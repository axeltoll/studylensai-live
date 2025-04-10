import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken } from '@/lib/firebase/admin';
import { incrementPromptUsage } from '@/lib/firebase/firestore';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';

// Initialize the Google Generative AI SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Initialize OpenAI client for image generation
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(req: NextRequest) {
  try {
    // Verify user authentication
    const authHeader = req.headers.get('Authorization');
    const decodedToken = await verifyAuthToken(authHeader);
    
    if (!decodedToken) {
      return NextResponse.json(
        { error: 'Unauthorized: Please log in to use this feature' },
        { status: 401 }
      );
    }
    
    // Check and increment usage limits
    const canUsePrompt = await incrementPromptUsage(decodedToken.uid);
    
    // Allow founders to bypass usage limits
    const isFounder = decodedToken.tier === 'founder' || decodedToken.email === 'axel@funnel-profits.com';
    
    if (!canUsePrompt && !isFounder) {
      return NextResponse.json(
        { error: 'Usage limit reached: Please upgrade your plan or try again after the reset period' },
        { status: 403 }
      );
    }

    // Parse the request body
    const body = await req.json();
    const { topic } = body;

    if (!topic || topic.trim() === '') {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    // Generate flashcards using Gemini API
    const flashcards = await generateFlashcards(topic);

    if (!flashcards || !Array.isArray(flashcards) || flashcards.length === 0) {
      // Return fallback flashcards if generation failed
      const fallbackFlashcards = createFallbackFlashcards(topic);
      return NextResponse.json({ 
        flashcards: fallbackFlashcards,
        message: 'Generated fallback flashcards due to an issue with AI generation'
      });
    }

    return NextResponse.json({ flashcards });
  } catch (error) {
    console.error('Error generating flashcards:', error);
    // Create fallback flashcards in case of any error
    const fallbackFlashcards = createFallbackFlashcards('General Knowledge');
    return NextResponse.json({ 
      flashcards: fallbackFlashcards,
      message: 'Using fallback flashcards due to an error'
    });
  }
}

async function generateFlashcards(topic: string) {
  try {
    // Check if Gemini API key is available
    if (!process.env.GEMINI_API_KEY) {
      console.warn('Gemini API key not found, using fallback flashcards.');
      return createFallbackFlashcards(topic);
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    // Prompt for generating flashcards
    const prompt = `Generate 5 educational flashcards about "${topic}". 
    Each flashcard should have a question on the front and a detailed answer on the back.
    Format the response as JSON with the following structure:
    [
      {
        "id": "1",
        "question": "Question text here",
        "answer": "Answer text here",
        "imagePrompt": "A detailed image prompt that would visualize this concept for image generation"
      },
      ...
    ]
    Make the questions challenging but appropriate for study purposes. Include key concepts, definitions, and examples.
    For each card, create a focused imagePrompt that would help visualize the concept being explained.`;

    // Get the response from the model
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Process the AI response to extract flashcards
    const basicFlashcards = await processResponse(text);
    
    // Generate images for the flashcards if OpenAI API key is available
    const flashcardsWithImages = await addImagesToFlashcards(basicFlashcards);
    
    return flashcardsWithImages;
  } catch (error) {
    console.error('Error in AI flashcard generation:', error);
    // Return fallback flashcards without throwing error
    return createFallbackFlashcards(topic);
  }
}

// Process the AI response to extract flashcards
async function processResponse(text: string) {
  try {
    console.log('Processing AI response to extract flashcards');
    
    // Try to extract JSON from the text response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.warn('No JSON array found in response, attempting to parse entire response as JSON');
      // Try to parse the entire response as JSON
      try {
        const parsedData = JSON.parse(text);
        if (Array.isArray(parsedData)) {
          return formatFlashcards(parsedData);
        } else if (parsedData && typeof parsedData === 'object') {
          // Check if the object has a property that might contain our array
          const possibleArrays = Object.values(parsedData).filter(Array.isArray);
          if (possibleArrays.length > 0) {
            return formatFlashcards(possibleArrays[0]);
          }
        }
      } catch (e) {
        console.error('Failed to parse entire response as JSON:', e);
      }
      
      // If we still can't parse it, create a simple fallback
      throw new Error('No JSON array found in response');
    }
    
    // Parse the JSON
    try {
      const parsedData = JSON.parse(jsonMatch[0]);
      return formatFlashcards(parsedData);
    } catch (jsonError) {
      console.error('Error parsing JSON:', jsonError);
      // Try to clean the JSON string before parsing
      const cleanedJsonString = jsonMatch[0]
        .replace(/\\'/g, "'")
        .replace(/\\"/g, '"')
        .replace(/\\&/g, '&')
        .replace(/\\r/g, '')
        .replace(/\\n/g, '')
        .replace(/\\t/g, '')
        .replace(/\\/g, '');
        
      try {
        const parsedData = JSON.parse(cleanedJsonString);
        return formatFlashcards(parsedData);
      } catch (e) {
        console.error('Failed to parse cleaned JSON:', e);
        throw new Error('Failed to parse JSON response');
      }
    }
  } catch (error) {
    console.error('Error processing AI response:', error);
    // Return an empty array instead of throwing error
    return [];
  }
}

// Helper function to format flashcards
function formatFlashcards(data: any[]) {
  console.log(`Formatting ${data.length} flashcards`);
  return data.map((card: any, index: number) => ({
    id: card.id || `card-${Date.now()}-${index}`,
    question: card.question || `Question ${index + 1}`,
    answer: card.answer || `Answer ${index + 1}`,
    imagePrompt: card.imagePrompt || `Visual representation of ${card.question || `Question ${index + 1}`}`,
    imageUrl: card.imageUrl || '/images/flashcards/default.png'
  }));
}

// Add images to flashcards using OpenAI's DALL-E API
async function addImagesToFlashcards(flashcards: any[]) {
  // If no OpenAI API key is available, return the flashcards without images
  if (!process.env.OPENAI_API_KEY || !Array.isArray(flashcards) || flashcards.length === 0) {
    console.log('OpenAI API key not found or invalid flashcards array. Using default images.');
    return flashcards.map((card, index) => ({
      ...card,
      imageUrl: '/images/flashcards/default.png'
    }));
  }
  
  try {
    console.log('Generating images for flashcards...');
    
    const flashcardsWithImages = await Promise.all(
      flashcards.map(async (card, index) => {
        try {
          // Generate a better prompt for the image with clear instructions for text rendering
          const improvedPrompt = `
          Create an educational flashcard image for the concept: "${card.question.replace(/"/g, '')}".
          
          VERY IMPORTANT REQUIREMENTS:
          1. The image must include the text "${card.question.replace(/"/g, '')}" clearly visible at the top
          2. All text must be perfectly legible and high contrast
          3. Use a clean, educational style with simple visuals
          4. Avoid any complex backgrounds that might make text hard to read
          5. Use large, clear fonts for all text elements
          6. If showing a concept, label it clearly with text
          7. Make text a central element of the design, not just an afterthought
          
          CONCEPT VISUALIZATION: ${card.imagePrompt}
          `;
          
          console.log(`Generating image for question: "${card.question.substring(0, 30)}..."`);
          
          // Call OpenAI API to generate image
          const response = await openai.images.generate({
            model: "dall-e-3", // DALL-E 3 is the preferred model for image generation
            prompt: improvedPrompt,
            n: 1,
            size: "1024x1024",
            quality: "hd", // Use higher quality for better text rendering
            style: "natural" // Natural style works better for educational content
          });
          
          // Log successful image generation
          console.log(`Successfully generated image for card ${index + 1}`);
          
          // Add the image URL to the flashcard
          return {
            ...card,
            imageUrl: response.data[0]?.url || '/images/flashcards/default.png'
          };
        } catch (imageError) {
          console.error('Error generating image for flashcard:', imageError);
          
          // Try alternative approach with GPT-4o if DALL-E fails
          try {
            // Use GPT-4o to generate an improved prompt
            if (process.env.OPENAI_API_MODEL === 'gpt-4o') {
              const promptResponse = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                  { role: "system", content: "You are an expert in creating clear, educational image descriptions that will render text perfectly in DALL-E." },
                  { role: "user", content: `I need to create a flashcard image with clear, readable text for the concept: "${card.question}". 
                  Create a very specific image generation prompt that will ensure the text is rendered perfectly in the image. 
                  Be extremely specific about text placement, font size, contrast, and ensuring the text is a central element.` }
                ],
                temperature: 0.7
              });
              
              const enhancedPrompt = promptResponse.choices[0]?.message?.content || "";
              
              // Try again with the enhanced prompt
              const retryResponse = await openai.images.generate({
                model: "dall-e-3",
                prompt: enhancedPrompt,
                n: 1,
                size: "1024x1024",
                quality: "hd",
                style: "natural"
              });
              
              return {
                ...card,
                imageUrl: retryResponse.data[0]?.url || '/images/flashcards/default.png'
              };
            }
          } catch (retryError) {
            console.error('Error with alternative image generation approach:', retryError);
          }
          
          // Return the card without a custom image if all attempts fail
          return {
            ...card,
            imageUrl: '/images/flashcards/default.png'
          };
        }
      })
    );
    
    return flashcardsWithImages;
  } catch (error) {
    console.error('Error adding images to flashcards:', error);
    // Return the original flashcards with default images
    return flashcards.map(card => ({
      ...card,
      imageUrl: '/images/flashcards/default.png'
    }));
  }
}

// Create fallback flashcards when AI generation fails
function createFallbackFlashcards(topic: string) {
  return [
    {
      id: `card-${Date.now()}-1`,
      question: `What is ${topic}?`,
      answer: `${topic} is an important concept in its field.`,
      imageUrl: '/images/flashcards/default.png'
    },
    {
      id: `card-${Date.now()}-2`,
      question: `Why is ${topic} significant?`,
      answer: `${topic} has significant applications and implications.`,
      imageUrl: '/images/flashcards/default.png'
    },
    {
      id: `card-${Date.now()}-3`,
      question: `How is ${topic} applied?`,
      answer: `${topic} can be applied in various contexts.`,
      imageUrl: '/images/flashcards/default.png'
    }
  ];
} 
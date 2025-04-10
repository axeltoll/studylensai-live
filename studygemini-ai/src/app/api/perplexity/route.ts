import { NextRequest, NextResponse } from 'next/server';

// Get API key from environment variable
const perplexityApiKey = process.env.PERPLEXITY_API_KEY;

// Set the runtime to edge
export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { query, userId, userTier, options = {} } = await req.json();
    
    // Check for required fields
    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Check usage limits based on user tier
    const usageLimit = userTier === 'pro' ? 10 : 2; // Pro: 10/week, Free: 2/week
    
    // TODO: Implement usage tracking in Firebase or database
    // This would check if the user has reached their limit
    // const userUsage = await getUserWeeklyUsage(userId, 'research');
    // if (userUsage >= usageLimit) {
    //   return NextResponse.json({ 
    //     error: 'Weekly usage limit reached',
    //     limit: usageLimit,
    //     current: userUsage,
    //     upgradeUrl: '/dashboard/upgrade'
    //   }, { status: 403 });
    // }

    // Determine research depth based on options
    const getTokensByDepth = () => {
      switch (options.depth) {
        case 'deep': return 8000;
        case 'medium': return 4000;
        case 'basic': return 2000;
        default: return 4000;
      }
    };
    
    // Use the appropriate model based on internet access preference
    const model = options.internetAccess !== false ? 'pplx-70b-online' : 'pplx-70b-chat';
    
    // Craft system prompt based on desired output format
    let systemPrompt = 'You are a research assistant providing thorough, detailed, and well-structured information on academic topics.';
    if (options.outputFormat === 'report') {
      systemPrompt += ' Create a comprehensive academic report with proper citations, detailed analysis, and a formal structure including abstract, methodology, findings, and conclusion sections.';
    } else {
      systemPrompt += ' Create a well-organized research summary with clear sections, bullet points where appropriate, and a logical flow. Include key concepts, important details, and cited sources.';
    }

    // Call the Perplexity API
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${perplexityApiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Perform detailed research on the following topic: ${query}. ${options.internetAccess !== false ? 'Please include the latest information and research findings from reliable academic sources.' : 'Use your knowledge to provide the most accurate information available.'} Structure your response with clear headings, subheadings, and a conclusion.`
          }
        ],
        options: {
          temperature: 0.1, // Low temperature for more factual responses
          max_tokens: getTokensByDepth()
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Perplexity API error:', errorData);
      return NextResponse.json({ error: 'Failed to get research from Perplexity API' }, { status: response.status });
    }

    const data = await response.json();
    
    // Update user's usage count
    // await incrementUserUsage(userId, 'research');

    // Store research in activity database
    // await saveToActivity(userId, {
    //   type: 'research',
    //   query,
    //   result: data.choices[0].message.content,
    //   timestamp: new Date().toISOString()
    // });

    // Return the results
    return NextResponse.json({
      result: data.choices[0].message.content,
      usage: {
        // current: userUsage + 1,
        limit: usageLimit
      }
    });
  } catch (error) {
    console.error('Error in Perplexity API handler:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your research request' },
      { status: 500 }
    );
  }
} 
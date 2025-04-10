import OpenAI from 'openai';
import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  // Removed organization parameter that was causing 401 error
});

// Initialize Anthropic client for Claude 3.7
const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_3_7_SONNET_API_KEY || process.env.ANTHROPIC_API_KEY,
});

// Message interfaces
interface Message {
  role: string;
  content: string;
}

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { messages, chatType, model = 'claude-3.7' } = await req.json();

    // Add a system prompt if desired (optional)
    const systemPrompt = {
        role: 'system',
        content: 'You are StudyGemini AI, a helpful and encouraging AI tutor. Assist the student with their questions clearly and concisely. Focus on educational value.'
    };

    // Select the appropriate model based on user choice
    if (model === 'claude-3.7') {
      // Map messages to Anthropic format
      const anthropicMessages = messages.map((msg: Message) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

      // Create system prompt for anthropic
      const systemPromptContent = systemPrompt.content;

      // Send to Anthropic Claude 3.7
      const response = await anthropic.messages.create({
        model: process.env.ANTHROPIC_MODEL || "claude-3-7-sonnet-20250219",
        max_tokens: 4000,
        system: systemPromptContent,
        messages: anthropicMessages
      });

      // Handle response content
      let responseContent = '';
      if (response.content && response.content.length > 0) {
        const firstContent = response.content[0];
        if (firstContent.type === 'text') {
          responseContent = firstContent.text;
        }
      }

      // Return Claude's response
      return new Response(JSON.stringify({ 
        message: {
          role: 'assistant',
          content: responseContent
        }
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } else if (model === 'gpt-4o') {
      // For GPT-4o, use OpenAI
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [systemPrompt, ...messages],
      });

      // Return the response
      return new Response(JSON.stringify({ 
        message: response.choices[0].message 
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      // For any other model including 'gemini-pro-2.5', use OpenAI as a placeholder
      // TODO: Implement actual Gemini API when package is available
      const response = await openai.chat.completions.create({
        model: process.env.OPENAI_API_MODEL || 'gpt-4-turbo',
        messages: [
          systemPrompt, 
          ...messages,
          {
            role: 'system',
            content: 'You are currently simulating Gemini Pro 2.5 responses as a temporary placeholder.'
          }
        ],
      });

      // Return the response
      return new Response(JSON.stringify({ 
        message: response.choices[0].message 
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

  } catch (error) {
    console.error("[API Chat Error]", error);
    // Handle potential errors, e.g., API key issues, rate limits
    let errorMessage = 'An unexpected error occurred';
    
    if (error instanceof OpenAI.APIError) {
      errorMessage = `OpenAI Error: ${error.message}`;
    } else if (error instanceof Anthropic.APIError) {
      errorMessage = `Claude Error: ${error.message}`;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    // Return error response
    return new Response(JSON.stringify({ error: errorMessage }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
} 
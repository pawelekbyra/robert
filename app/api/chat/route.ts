import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { prisma } from '@/lib/prisma';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1];

    // Log the user message to the database
    await prisma.systemLog.create({
      data: {
        level: 'INFO',
        message: `User Message: ${lastMessage.content}`,
        metadata: { role: 'user' }
      }
    });

    // Check if Google API key is present
    if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      const result = streamText({
        model: google('gemini-1.5-flash'),
        messages,
        onFinish: async ({ text }) => {
             await prisma.systemLog.create({
                data: {
                    level: 'INFO',
                    message: `AI Response: ${text}`,
                    metadata: { role: 'assistant', provider: 'gemini' }
                }
            });
        }
      });
      // @ts-ignore: toDataStreamResponse exists in runtime, explicit ignore for build if types are misaligned
      return result.toDataStreamResponse();
    } else {
      // Fallback mock response if no API key is present
      const mockResponse = "System Online. Database Connected. (No Gemini API Key found, running in diagnostic mode)";

       await prisma.systemLog.create({
            data: {
                level: 'WARN',
                message: `AI Response (Mock): ${mockResponse}`,
                metadata: { role: 'assistant', mode: 'diagnostic' }
            }
        });

      // Simple manual stream for the mock response
       const stream = new ReadableStream({
        start(controller) {
          // Format compatible with AI SDK Data Stream Protocol: 0:"text"
          controller.enqueue(new TextEncoder().encode(`0:"${mockResponse}"\n`));
          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'X-Vercel-AI-Data-Stream': 'v1'
        },
      });
    }
  } catch (error) {
    console.error('Error in chat route:', error);

    await prisma.systemLog.create({
      data: {
        level: 'ERROR',
        message: `Error processing chat: ${error instanceof Error ? error.message : String(error)}`,
      }
    });

    return new Response('Internal Server Error', { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const SYSTEM_PROMPT = `You are a helpful legal assistant specializing in UAE legislation.
- Your answers must be based on the official UAE legislation portal or well-established legal principles in the UAE.
- Always cite the specific law, article number, or legal principle as a source.
- If you don't know the answer, say so clearly. Do not invent information.
- Format your answers clearly using markdown (e.g., lists, bold text).
- Respond in the same language as the user's question (Arabic or English).
- Your final response MUST be a JSON object with two keys: "answer" (string) and "sources" (string).
- Example: {"answer": "The answer is based on Article 5 of Law No. 10...", "sources": "Article 5 of Law No. 10 of 2023"}`;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { message, history } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Invalid message format' },
        { status: 400 }
      );
    }

    // Build conversation history for context
    const messages = [
      {
        role: 'system',
        content: SYSTEM_PROMPT,
      },
    ];

    // Add previous messages for context (limit to last 10 messages)
    if (history && Array.isArray(history)) {
      const recentHistory = history.slice(-10);
      recentHistory.forEach((msg) => {
        messages.push({
          role: msg.role,
          content: msg.content,
        });
      });
    }

    // Add the current user message
    messages.push({
      role: 'user',
      content: message,
    });

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    const responseContent = completion.choices[0]?.message?.content || '';

    // Try to parse JSON response
    let answer = responseContent;
    let sources = '';

    try {
      const jsonMatch = responseContent.match(/\{[\s\S]*"answer"[\s\S]*"sources"[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        answer = parsed.answer || responseContent;
        sources = parsed.sources || '';
      }
    } catch (parseError) {
      console.warn('Could not parse JSON from OpenAI response, using raw content');
    }

    return NextResponse.json({
      answer,
      sources,
      usage: completion.usage,
    });
  } catch (error) {
    console.error('Error in legal assistant API:', error);

    if (error.code === 'insufficient_quota') {
      return NextResponse.json(
        { 
          error: 'OpenAI API quota exceeded',
          answer: 'عذراً، تم تجاوز حد استخدام الخدمة. يرجى المحاولة لاحقاً.',
          sources: ''
        },
        { status: 429 }
      );
    }

    if (error.code === 'invalid_api_key') {
      return NextResponse.json(
        { 
          error: 'Invalid OpenAI API key',
          answer: 'عذراً، هناك مشكلة في إعدادات الخدمة.',
          sources: ''
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Internal server error',
        answer: 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.',
        sources: ''
      },
      { status: 500 }
    );
  }
}

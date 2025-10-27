import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Note from '@/models/Note';
import OpenAI from 'openai';

// POST /api/notes/[id]/summarize - Generate AI summary for a note
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const note = await Note.findById(id);
    
    if (!note) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }

    // Try Groq AI first, fallback to simple summary if not available
    let summary = '';
    
    if (process.env.GROQ_API_KEY) {
      try {
        console.log('Attempting to generate AI summary with Groq...');
        const openai = new OpenAI({
          apiKey: process.env.GROQ_API_KEY,
          baseURL: 'https://api.groq.com/openai/v1',
        });

        const completion = await openai.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant that creates concise summaries of notes. Provide summaries in 2-3 sentences that capture the main points.'
            },
            {
              role: 'user',
              content: `Please provide a concise summary of the following note:\n\nTitle: ${note.title}\n\nContent: ${note.content}`
            }
          ],
          temperature: 0.7,
          max_tokens: 200,
        });

        summary = completion.choices[0]?.message?.content?.trim() || '';
        console.log('AI summary generated successfully with Groq');
      } catch (aiError) {
        if (aiError instanceof Error) {
          console.error('AI service failed:', aiError.message);
        } else {
          console.error('AI service failed:', String(aiError));
        }
        // Fallback to simple summary
        summary = `This note titled "${note.title}" contains ${note.content.split(' ').length} words covering the main topic. The content discusses key points and provides relevant information on the subject matter.`;
      }
    } else {
      console.log('GROQ_API_KEY not found, using fallback summary. Please set GROQ_API_KEY in your .env.local file.');
      // Simple fallback summary
      summary = `This note titled "${note.title}" contains ${note.content.split(' ').length} words covering the main topic. The content discusses key points and provides relevant information on the subject matter.`;
    }

    if (!summary) {
      return NextResponse.json(
        { error: 'Failed to generate summary' },
        { status: 500 }
      );
    }

    // Update the note with the generated summary
    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { summary },
      { new: true }
    );

    return NextResponse.json({
      summary,
      note: updatedNote,
    });
  } catch (error) {
    console.error('Error generating summary:', error);
    
    if (error instanceof Error && error.message.includes('API key')) {
      return NextResponse.json(
        { error: 'Invalid Groq API key' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    );
  }
}

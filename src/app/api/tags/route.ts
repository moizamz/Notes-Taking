import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Note from '@/models/Note';

// GET /api/tags - Get all unique tags
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const tags = await Note.distinct('tags', { isArchived: false });
    
    // Sort tags alphabetically and filter out empty strings
    const sortedTags = tags
      .filter(tag => tag && tag.trim())
      .sort();

    return NextResponse.json({ tags: sortedTags });
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    );
  }
}

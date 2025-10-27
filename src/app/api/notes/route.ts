import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Note from '@/models/Note';

// GET /api/notes - Get all notes with optional search and filtering
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const tag = searchParams.get('tag');
    const category = searchParams.get('category');
    const archived = searchParams.get('archived');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    let query: any = {};

    // Handle archived filter - default to showing only non-archived notes
    if (archived === 'true') {
      query.isArchived = true;
    } else {
      query.isArchived = false;
    }

    // Handle category filter
    if (category) {
      query.category = category;
    }

    // Handle search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    // Handle tag filter
    if (tag) {
      query.tags = { $in: [tag.toLowerCase()] };
    }

    const notes = await Note.find(query)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Note.countDocuments(query);

    return NextResponse.json({
      notes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notes' },
      { status: 500 }
    );
  }
}

// POST /api/notes - Create a new note
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { title, content, tags = [], category = 'Personal' } = body;

    console.log('API received body:', body);
    console.log('Category from body:', category);

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const note = new Note({
      title: title.trim(),
      content: content.trim(),
      tags: tags.map((tag: string) => tag.toLowerCase().trim()).filter(Boolean),
      category,
    });

    console.log('Creating note with category:', note.category);

    const savedNote = await note.save();

    return NextResponse.json(savedNote, { status: 201 });
  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json(
      { error: 'Failed to create note' },
      { status: 500 }
    );
  }
}

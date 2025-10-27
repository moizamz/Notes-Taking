import mongoose, { Document, Schema } from 'mongoose';

export interface INote extends Document {
  title: string;
  content: string;
  summary?: string;
  tags: string[];
  category: 'Project' | 'Personal' | 'Work' | 'Family' | 'Travel';
  color: string;
  createdAt: Date;
  updatedAt: Date;
  isArchived: boolean;
}

const NoteSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true,
  },
  summary: {
    type: String,
    trim: true,
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
  }],
  category: {
    type: String,
    enum: ['Project', 'Personal', 'Work', 'Family', 'Travel'],
    default: 'Personal',
  },
  color: {
    type: String,
    default: '#3B82F6', // blue
  },
  isArchived: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Index for better search performance
NoteSchema.index({ title: 'text', content: 'text', tags: 'text' });
NoteSchema.index({ createdAt: -1 });
NoteSchema.index({ tags: 1 });
NoteSchema.index({ category: 1 });

export default mongoose.models.Note || mongoose.model<INote>('Note', NoteSchema);

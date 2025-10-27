'use client';

import { useState } from 'react';
import { Edit3, Trash2, Archive, ArchiveRestore, Sparkles, Tag, Calendar } from 'lucide-react';

interface Note {
  _id: string;
  title: string;
  content: string;
  summary?: string;
  tags: string[];
  category: 'Project' | 'Personal' | 'Work' | 'Family' | 'Travel';
  color: string;
  createdAt: string;
  updatedAt: string;
  isArchived: boolean;
}

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (noteId: string) => void;
  onArchive: (noteId: string, isArchived: boolean) => void;
  onGenerateSummary: (noteId: string) => void;
  onViewSummary: (noteId: string) => void;
}

export default function NoteCard({ 
  note, 
  onEdit, 
  onDelete, 
  onArchive, 
  onGenerateSummary,
  onViewSummary
}: NoteCardProps) {
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    try {
      await onGenerateSummary(note._id);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Get gradient based on category
  const getGradient = () => {
    if (note.isArchived) return 'from-gray-400 to-gray-500';
    
    switch (note.category) {
      case 'Project':
        return 'from-blue-500 via-blue-600 to-purple-600';
      case 'Personal':
        return 'from-purple-500 via-purple-600 to-pink-600';
      case 'Work':
        return 'from-orange-500 via-orange-600 to-red-600';
      case 'Family':
        return 'from-pink-500 via-pink-600 to-rose-600';
      case 'Travel':
        return 'from-green-500 via-teal-600 to-cyan-600';
      default:
        return 'from-blue-500 to-purple-600';
    }
  };

  // Get solid color for folded corner
  const getCategoryColor = () => {
    if (note.isArchived) return '#9CA3AF';
    
    switch (note.category) {
      case 'Project':
        return '#3B82F6';
      case 'Personal':
        return '#A855F7';
      case 'Work':
        return '#F97316';
      case 'Family':
        return '#EC4899';
      case 'Travel':
        return '#10B981';
      default:
        return '#3B82F6';
    }
  };

  return (
    <div 
      className={`relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] ${
        note.isArchived ? 'opacity-60' : ''
      }`}
      style={{ minHeight: '280px' }}
    >
      {/* Gradient Background (original colors) */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getGradient()} rounded-2xl`} />
      
      {/* Content Container */}
      <div className="relative h-full flex flex-col p-6 text-white">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 text-xs font-semibold bg-white/20 backdrop-blur-sm rounded-full">
                {note.category}
              </span>
            </div>
            <h3 className="text-xl font-bold line-clamp-2 text-white drop-shadow-md">
              {note.title}
            </h3>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-1 ml-2">
            <button
              onClick={() => onEdit(note)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all"
              title="Edit note"
            >
              <Edit3 size={16} />
            </button>
            <button
              onClick={() => onArchive(note._id, note.isArchived)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all"
              title={note.isArchived ? 'Restore note' : 'Archive note'}
            >
              {note.isArchived ? <ArchiveRestore size={16} /> : <Archive size={16} />}
            </button>
            <button
              onClick={() => onDelete(note._id)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all"
              title="Delete note"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 mb-4">
          <p className="text-sm text-white/90 line-clamp-4">
            {truncateText(note.content, 200)}
          </p>
        </div>

        {/* Tags */}
        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {note.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-white/15 backdrop-blur-sm rounded-full"
              >
                <Tag size={10} />
                {tag}
              </span>
            ))}
            {note.tags.length > 3 && (
              <span className="text-xs text-white/70">
                +{note.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/20">
          <div className="flex items-center gap-1 text-xs text-white/80">
            <Calendar size={12} />
            {formatDate(note.updatedAt)}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={note.summary ? () => onViewSummary(note._id) : handleGenerateSummary}
              disabled={isGeneratingSummary}
              className="flex items-center gap-1 px-3 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-all text-xs font-medium disabled:opacity-50"
            >
              <Sparkles size={12} />
              {isGeneratingSummary ? 'Generating...' : note.summary ? 'View Summary' : 'Summarize'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

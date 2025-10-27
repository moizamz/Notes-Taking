'use client';

import { useState, useEffect } from 'react';
import { X, Save, Tag, Briefcase, User, Users, Plane } from 'lucide-react';

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

interface NoteEditorProps {
  note?: Note | null;
  onClose: () => void;
}

export default function NoteEditor({ note, onClose }: NoteEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [category, setCategory] = useState<'Project' | 'Personal' | 'Work' | 'Family' | 'Travel'>('Personal');
  const [isSaving, setIsSaving] = useState(false);

  // Debug: Log category changes
  useEffect(() => {
    console.log('Current category state:', category);
  }, [category]);

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
      setTags(note.tags || []);
      setCategory(note.category || 'Personal');
    } else {
      setTitle('');
      setContent('');
      setTags([]);
      setCategory('Personal');
    }
  }, [note]);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      alert('Please fill in both title and content');
      return;
    }

    setIsSaving(true);
    try {
      const noteData = {
        title: title.trim(),
        content: content.trim(),
        tags: tags.filter(tag => tag.trim()),
        category,
      };

      console.log('Saving note with data:', noteData);

      const url = (note && note._id) ? `/api/notes/${note._id}` : '/api/notes';
      const method = (note && note._id) ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteData),
      });

      if (!response.ok) {
        throw new Error('Failed to save note');
      }

      onClose();
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Failed to save note. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddTag = () => {
    const newTag = tagInput.trim().toLowerCase();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSave();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {note ? 'Edit Note' : 'Create New Note'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Enter note title..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              autoFocus
            />
          </div>

          {/* Content */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Write your note content here..."
              rows={12}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
            />
          </div>

          {/* Tags */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                >
                  <Tag size={12} />
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-blue-500 hover:text-blue-700 dark:hover:text-blue-200"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                placeholder="Add a tag..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={handleAddTag}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Category */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Category
            </label>
            <div className="grid grid-cols-5 gap-3">
              <button
                type="button"
                onClick={() => {
                  console.log('Setting category to Project');
                  setCategory('Project');
                }}
                className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                  category === 'Project'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <Briefcase size={24} className={category === 'Project' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'} />
                <span className={`mt-2 text-sm font-medium ${
                  category === 'Project'
                    ? 'text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  Project
                </span>
              </button>

              <button
                type="button"
                onClick={() => setCategory('Personal')}
                className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                  category === 'Personal'
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <User size={24} className={category === 'Personal' ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'} />
                <span className={`mt-2 text-sm font-medium ${
                  category === 'Personal'
                    ? 'text-purple-700 dark:text-purple-300'
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  Personal
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  console.log('Setting category to Work');
                  setCategory('Work');
                }}
                className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                  category === 'Work'
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <Briefcase size={24} className={category === 'Work' ? 'text-orange-600 dark:text-orange-400' : 'text-gray-400'} />
                <span className={`mt-2 text-sm font-medium ${
                  category === 'Work'
                    ? 'text-orange-700 dark:text-orange-300'
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  Work
                </span>
              </button>

              <button
                type="button"
                onClick={() => setCategory('Family')}
                className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                  category === 'Family'
                    ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <Users size={24} className={category === 'Family' ? 'text-pink-600 dark:text-pink-400' : 'text-gray-400'} />
                <span className={`mt-2 text-sm font-medium ${
                  category === 'Family'
                    ? 'text-pink-700 dark:text-pink-300'
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  Family
                </span>
              </button>

              <button
                type="button"
                onClick={() => setCategory('Travel')}
                className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                  category === 'Travel'
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <Plane size={24} className={category === 'Travel' ? 'text-green-600 dark:text-green-400' : 'text-gray-400'} />
                <span className={`mt-2 text-sm font-medium ${
                  category === 'Travel'
                    ? 'text-green-700 dark:text-green-300'
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  Travel
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !title.trim() || !content.trim()}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:bg-gray-400 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
          >
            <Save size={16} />
            {isSaving ? 'Saving...' : 'Save Note'}
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Tag, Archive, Edit3, Trash2, Sparkles, PenTool, FileEdit } from 'lucide-react';
import NoteEditor from '@/components/NoteEditor';
import NoteCard from '@/components/NoteCard';
import SearchBar from '@/components/SearchBar';
import TagFilter from '@/components/TagFilter';
import CategoryFilter from '@/components/CategoryFilter';
import SummaryModal from '@/components/SummaryModal';

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

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [summaryModalOpen, setSummaryModalOpen] = useState(false);
  const [selectedSummary, setSelectedSummary] = useState<{ title: string; summary: string } | null>(null);

  // Fetch notes
  const fetchNotes = async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedTag) params.append('tag', selectedTag);
      if (selectedCategory) params.append('category', selectedCategory);
      if (showArchived) params.append('archived', 'true');
      
      const response = await fetch(`/api/notes?${params}`);
      const data = await response.json();
      setNotes(data.notes || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch tags
  const fetchTags = async () => {
    try {
      const response = await fetch('/api/tags');
      const data = await response.json();
      setTags(data.tags || []);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [searchQuery, selectedTag, selectedCategory, showArchived]);

  useEffect(() => {
    fetchTags();
  }, []);

  const handleCreateNote = () => {
    // If a category is selected, create note in that category
    if (selectedCategory) {
      const tempNote = {
        _id: '',
        title: '',
        content: '',
        tags: [],
        category: (selectedCategory as 'Project' | 'Personal' | 'Work' | 'Family' | 'Travel'),
        color: '',
        createdAt: '',
        updatedAt: '',
        isArchived: false,
      };
      setSelectedNote(tempNote as any);
    } else {
      setSelectedNote(null);
    }
    setIsEditorOpen(true);
  };

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    setIsEditorOpen(true);
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    
    try {
      await fetch(`/api/notes/${noteId}`, { method: 'DELETE' });
      fetchNotes();
      fetchTags();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleArchiveNote = async (noteId: string, isArchived: boolean) => {
    try {
      await fetch(`/api/notes/${noteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isArchived: !isArchived }),
      });
      fetchNotes();
    } catch (error) {
      console.error('Error archiving note:', error);
    }
  };

  const handleGenerateSummary = async (noteId: string) => {
    try {
      const response = await fetch(`/api/notes/${noteId}/summarize`, {
        method: 'POST',
      });
      const data = await response.json();
      
      if (data.summary) {
        // Find the note to get its title
        const note = notes.find(n => n._id === noteId);
        if (note) {
          // Automatically open the modal with the new summary
          setSelectedSummary({ title: note.title, summary: data.summary });
          setSummaryModalOpen(true);
        }
        fetchNotes(); // Refresh to show the new summary
      }
    } catch (error) {
      console.error('Error generating summary:', error);
      alert('Failed to generate summary. Please check your Groq API key.');
    }
  };

  const handleViewSummary = (noteId: string) => {
    const note = notes.find(n => n._id === noteId);
    if (note && note.summary) {
      setSelectedSummary({ title: note.title, summary: note.summary });
      setSummaryModalOpen(true);
    }
  };

  const handleEditorClose = () => {
    setIsEditorOpen(false);
    setSelectedNote(null);
    fetchNotes();
    fetchTags();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="relative group">
                  {/* Animated glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 rounded-xl blur-md opacity-75 group-hover:opacity-100 transition-opacity animate-pulse"></div>
                  
                  {/* Logo container */}
                  <div className="relative bg-gradient-to-br from-purple-600 via-pink-500 to-blue-600 p-1.5 rounded-lg shadow-lg overflow-visible transform group-hover:rotate-6 transition-all duration-300">
                    {/* Playful notepad with pencil */}
                    <svg width="28" height="28" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {/* Notepad pages (layered effect) */}
                      <rect x="9" y="11" width="26" height="30" rx="2" fill="white" opacity="0.3"/>
                      <rect x="10" y="12" width="26" height="30" rx="2" fill="white" opacity="0.5"/>
                      <rect x="11" y="13" width="26" height="30" rx="2" fill="white" stroke="#E5E7EB" strokeWidth="1"/>
                      
                      {/* Colorful top binding */}
                      <rect x="11" y="13" width="26" height="4" rx="2" fill="url(#bindingGradient)"/>
                      
                      {/* Lines on paper (colorful) */}
                      <line x1="15" y1="22" x2="33" y2="22" stroke="#A855F7" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
                      <line x1="15" y1="26" x2="31" y2="26" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
                      <line x1="15" y1="30" x2="29" y2="30" stroke="#EC4899" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
                      <line x1="15" y1="34" x2="27" y2="34" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
                      
                      {/* Fun bouncy pencil */}
                      <g transform="translate(28, 32) rotate(-40)">
                        {/* Pencil body (gradient yellow to orange) */}
                        <rect x="0" y="0" width="3" height="18" rx="1" fill="url(#pencilGradient)"/>
                        
                        {/* Pencil tip */}
                        <path d="M0 18 L1.5 22 L3 18 Z" fill="#92400E"/>
                        <path d="M1 18 L1.5 22 L2 18 Z" fill="#374151"/>
                        
                        {/* Eraser (pink) */}
                        <rect x="0" y="-2.5" width="3" height="2.5" rx="0.5" fill="#EC4899"/>
                        
                        {/* Metal band */}
                        <rect x="0" y="-0.5" width="3" height="0.5" fill="#94A3B8"/>
                        
                        {/* Shine on pencil */}
                        <line x1="0.8" y1="2" x2="0.8" y2="8" stroke="white" strokeWidth="0.8" opacity="0.5"/>
                      </g>
                      
                      {/* Sparkles around */}
                      <g>
                        <path d="M8 8 L8 12 M6 10 L10 10" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M40 10 L40 14 M38 12 L42 12" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round"/>
                        <circle cx="40" cy="38" r="2" fill="#FB923C"/>
                        <circle cx="8" cy="38" r="1.5" fill="#A855F7"/>
                      </g>
                      
                      <defs>
                        <linearGradient id="bindingGradient" x1="11" y1="13" x2="37" y2="13">
                          <stop offset="0%" stopColor="#A855F7"/>
                          <stop offset="50%" stopColor="#EC4899"/>
                          <stop offset="100%" stopColor="#F59E0B"/>
                        </linearGradient>
                        <linearGradient id="pencilGradient" x1="0" y1="0" x2="0" y2="18">
                          <stop offset="0%" stopColor="#FCD34D"/>
                          <stop offset="100%" stopColor="#F59E0B"/>
                        </linearGradient>
                      </defs>
                    </svg>
                    
                    {/* Animated sparkle accent */}
                    <Sparkles size={14} className="absolute -top-1 -right-1 text-yellow-300 animate-bounce" />
                  </div>
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  NoteX
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Create, Organize and Summarize Notes
              </p>
            </div>
            <button
              onClick={handleCreateNote}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
            >
              <Plus size={20} />
              {selectedCategory ? `New ${selectedCategory} Note` : 'New Note'}
            </button>
          </div>

          {/* Category Filter */}
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          {/* Search and Archive */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <button
              onClick={() => setShowArchived(!showArchived)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                showArchived
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600'
              }`}
            >
              <Archive size={16} />
              {showArchived ? 'Hide Archived' : 'Show Archived'}
            </button>
          </div>

          {/* Tag Filter - Full Width Section */}
          <div className="mb-6">
            <TagFilter 
              tags={tags} 
              selectedTag={selectedTag} 
              onTagSelect={setSelectedTag} 
            />
          </div>
        </div>

        {/* Notes Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <Edit3 size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              No notes found
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {searchQuery || selectedTag || selectedCategory || showArchived
                ? 'Try adjusting your search or filters'
                : 'Create your first note to get started'}
            </p>
            <button
              onClick={handleCreateNote}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
            >
              Create Note
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onEdit={handleEditNote}
                onDelete={handleDeleteNote}
                onArchive={handleArchiveNote}
                onGenerateSummary={handleGenerateSummary}
                onViewSummary={handleViewSummary}
              />
            ))}
          </div>
        )}

        {/* Note Editor Modal */}
        {isEditorOpen && (
          <NoteEditor
            note={selectedNote}
            onClose={handleEditorClose}
          />
        )}

        {/* Summary Modal */}
        {summaryModalOpen && selectedSummary && (
          <SummaryModal
            isOpen={summaryModalOpen}
            onClose={() => setSummaryModalOpen(false)}
            summary={selectedSummary.summary}
            noteTitle={selectedSummary.title}
          />
        )}
      </div>
    </div>
  );
}

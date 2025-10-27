'use client';

import { Tag, X } from 'lucide-react';

interface TagFilterProps {
  tags: string[];
  selectedTag: string;
  onTagSelect: (tag: string) => void;
}

export default function TagFilter({ tags, selectedTag, onTagSelect }: TagFilterProps) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-3">
        <Tag size={18} className="text-purple-600 dark:text-purple-400" />
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Filter by Tags</h3>
        {selectedTag && (
          <button
            onClick={() => onTagSelect('')}
            className="ml-auto text-xs text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 flex items-center gap-1"
          >
            <X size={14} />
            Clear
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const isSelected = selectedTag === tag;
          return (
            <button
              key={tag}
              onClick={() => onTagSelect(isSelected ? '' : tag)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                isSelected
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md scale-105'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:scale-105'
              }`}
            >
              <Tag size={12} />
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
}

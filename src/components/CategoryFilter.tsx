'use client';

import { Briefcase, User, Home, Users, Plane, Grid } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

const categories = [
  { name: 'All', value: null, icon: Grid, color: 'bg-gray-500' },
  { name: 'Project', value: 'Project', icon: Briefcase, color: 'bg-blue-500' },
  { name: 'Personal', value: 'Personal', icon: User, color: 'bg-purple-500' },
  { name: 'Work', value: 'Work', icon: Briefcase, color: 'bg-orange-500' },
  { name: 'Family', value: 'Family', icon: Users, color: 'bg-pink-500' },
  { name: 'Travel', value: 'Travel', icon: Plane, color: 'bg-green-500' },
];

export default function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {categories.map((category) => {
        const Icon = category.icon;
        const isSelected = selectedCategory === category.value;
        
        return (
          <button
            key={category.name}
            onClick={() => onCategoryChange(category.value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all font-medium ${
              isSelected
                ? `${category.color} text-white shadow-lg scale-105`
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <Icon size={16} />
            <span>{category.name}</span>
          </button>
        );
      })}
    </div>
  );
}



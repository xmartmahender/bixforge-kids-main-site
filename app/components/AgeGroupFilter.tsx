'use client';

import React from 'react';

interface AgeGroupFilterProps {
  selectedAgeGroup: string;
  onAgeGroupChange: (ageGroup: string) => void;
}

export default function AgeGroupFilter({ selectedAgeGroup, onAgeGroupChange }: AgeGroupFilterProps) {
  const ageGroups = [
    { value: '', label: 'All Ages' },
    { value: '0-3', label: '0-3 years' },
    { value: '3-6', label: '3-6 years' },
    { value: '6-9', label: '6-9 years' },
    { value: '9-12', label: '9-12 years' },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 p-4 bg-gradient-to-r from-blue-100 to-pink-100 rounded-lg">
      <h3 className="font-bold text-gray-700">Filter by Age Group:</h3>
      <div className="flex flex-wrap gap-2 justify-center">
        {ageGroups.map((ageGroup) => (
          <button
            key={ageGroup.value}
            onClick={() => onAgeGroupChange(ageGroup.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
              selectedAgeGroup === ageGroup.value
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 hover:bg-purple-100'
            }`}
          >
            {ageGroup.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// File: C:\Users\PMYLS\Desktop\Mahendar Website\Mahendar Website\Clone-childrens-website\childrens-clone\src\components\LanguageDropdown.tsx

import React, { memo } from 'react';

const LANGUAGES = [
  { value: 'English', label: 'English' },
  { value: 'Urdu', label: 'Urdu' },
  { value: 'Sindhi', label: 'Sindhi' },
  { value: 'Hindi', label: 'Hindi' }
];

interface LanguageDropdownProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

// Using memo to prevent unnecessary re-renders
export const LanguageDropdown = memo(({ value, onChange, className = '' }: LanguageDropdownProps) => {
  return (
    <div className={`relative inline-block ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm leading-5 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
      >
        {LANGUAGES.map(lang => (
          <option key={lang.value} value={lang.value}>
            {lang.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );
});

LanguageDropdown.displayName = 'LanguageDropdown';
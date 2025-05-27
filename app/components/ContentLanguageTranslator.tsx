'use client';

import React, { useState, useEffect } from 'react';
import { FaGlobe, FaChevronDown, FaLanguage, FaSpinner } from 'react-icons/fa';

// Available languages for content translation
export const CONTENT_LANGUAGES = {
  'en': { name: 'English', flag: '🇺🇸', nativeName: 'English' },
  'ur': { name: 'Urdu', flag: '🇵🇰', nativeName: 'اردو' },
  'hi': { name: 'Hindi', flag: '🇮🇳', nativeName: 'हिंदी' },
  'ar': { name: 'Arabic', flag: '🇸🇦', nativeName: 'العربية' },
  'fr': { name: 'French', flag: '🇫🇷', nativeName: 'Français' },
  'es': { name: 'Spanish', flag: '🇪🇸', nativeName: 'Español' },
  'de': { name: 'German', flag: '🇩🇪', nativeName: 'Deutsch' },
  'pt': { name: 'Portuguese', flag: '🇵🇹', nativeName: 'Português' },
  'it': { name: 'Italian', flag: '🇮🇹', nativeName: 'Italiano' },
  'ja': { name: 'Japanese', flag: '🇯🇵', nativeName: '日本語' },
  'ko': { name: 'Korean', flag: '🇰🇷', nativeName: '한국어' },
  'zh': { name: 'Chinese', flag: '🇨🇳', nativeName: '中文' },
  'ru': { name: 'Russian', flag: '🇷🇺', nativeName: 'Русский' },
  'tr': { name: 'Turkish', flag: '🇹🇷', nativeName: 'Türkçe' },
  'nl': { name: 'Dutch', flag: '🇳🇱', nativeName: 'Nederlands' },
};

export type ContentLanguage = keyof typeof CONTENT_LANGUAGES;

interface ContentLanguageTranslatorProps {
  currentLanguage: ContentLanguage;
  onLanguageChange: (language: ContentLanguage) => void;
  availableLanguages?: ContentLanguage[];
  isTranslating?: boolean;
  className?: string;
  showLabel?: boolean;
  compact?: boolean;
}

export default function ContentLanguageTranslator({
  currentLanguage,
  onLanguageChange,
  availableLanguages = Object.keys(CONTENT_LANGUAGES) as ContentLanguage[],
  isTranslating = false,
  className = '',
  showLabel = true,
  compact = false
}: ContentLanguageTranslatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLanguageSelect = (language: ContentLanguage) => {
    onLanguageChange(language);
    setIsOpen(false);
    
    // Save preference
    if (typeof window !== 'undefined') {
      localStorage.setItem('contentLanguage', language);
    }
  };

  const currentLang = CONTENT_LANGUAGES[currentLanguage];

  if (!isClient) {
    return null; // Prevent hydration issues
  }

  if (compact) {
    return (
      <div className={`relative inline-block ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={isTranslating}
          className="flex items-center space-x-1 px-2 py-1 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-sm hover:bg-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 disabled:opacity-50"
          title="Change content language"
        >
          {isTranslating ? (
            <FaSpinner className="w-3 h-3 text-purple-600 animate-spin" />
          ) : (
            <FaLanguage className="w-3 h-3 text-purple-600" />
          )}
          <span className="text-sm">{currentLang.flag}</span>
          <FaChevronDown className={`w-2 h-2 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-1">
            {availableLanguages.map((langCode) => {
              const lang = CONTENT_LANGUAGES[langCode];
              return (
                <button
                  key={langCode}
                  onClick={() => handleLanguageSelect(langCode)}
                  className={`w-full flex items-center space-x-2 px-3 py-2 text-left transition-colors text-sm ${
                    currentLanguage === langCode
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span className="flex-1">{lang.nativeName}</span>
                  {currentLanguage === langCode && (
                    <span className="text-purple-600 text-xs">✓</span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isTranslating}
        className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 group disabled:opacity-50 w-full sm:w-auto"
        aria-label="Change content language"
      >
        {isTranslating ? (
          <FaSpinner className="w-5 h-5 text-purple-600 animate-spin" />
        ) : (
          <FaGlobe className="w-5 h-5 text-purple-600 group-hover:text-purple-700" />
        )}
        
        <span className="text-2xl">{currentLang.flag}</span>
        
        <div className="flex flex-col items-start">
          {showLabel && (
            <span className="text-xs text-purple-600 leading-none font-medium">
              {isTranslating ? 'Translating...' : 'Read in'}
            </span>
          )}
          <span className="text-sm font-semibold text-gray-700 leading-none">
            {currentLang.nativeName}
          </span>
        </div>
        
        <FaChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-80 overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <FaLanguage className="w-5 h-5 text-purple-600" />
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">Choose Reading Language</h3>
                  <p className="text-xs text-gray-600">Select your preferred language for this content</p>
                </div>
              </div>
            </div>

            {/* Language List */}
            <div className="py-2 max-h-64 overflow-y-auto">
              {availableLanguages.map((langCode) => {
                const lang = CONTENT_LANGUAGES[langCode];
                return (
                  <button
                    key={langCode}
                    onClick={() => handleLanguageSelect(langCode)}
                    className={`w-full text-left px-4 py-3 text-sm hover:bg-purple-50 hover:text-purple-700 flex items-center space-x-3 transition-all duration-150 group ${
                      currentLanguage === langCode
                        ? 'bg-purple-100 text-purple-700 font-medium border-r-2 border-purple-500'
                        : 'text-gray-700'
                    }`}
                  >
                    <span className="text-lg group-hover:scale-110 transition-transform duration-150">
                      {lang.flag}
                    </span>
                    <div className="flex-1">
                      <div className="font-medium">{lang.nativeName}</div>
                      <div className="text-xs text-gray-500">{lang.name}</div>
                    </div>
                    {currentLanguage === langCode && (
                      <div className="flex items-center space-x-1">
                        <span className="text-purple-600 font-bold">✓</span>
                        <span className="text-xs text-purple-600 font-medium">Current</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center">
                🌟 Translations powered by AI • May not be 100% accurate
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Hook to manage content language state
export function useContentLanguage() {
  const [contentLanguage, setContentLanguage] = useState<ContentLanguage>('en');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('contentLanguage') as ContentLanguage;
      if (saved && CONTENT_LANGUAGES[saved]) {
        setContentLanguage(saved);
      }
    }
  }, []);

  const changeLanguage = (language: ContentLanguage) => {
    setContentLanguage(language);
    if (typeof window !== 'undefined') {
      localStorage.setItem('contentLanguage', language);
    }
  };

  return {
    contentLanguage,
    setContentLanguage: changeLanguage,
    isClient
  };
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FaCopy, FaPlay, FaCode } from 'react-icons/fa';

interface CodeSyntaxExampleProps {
  language: string;
  title: string;
  description: string;
  code: string;
  ageGroup?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

const LANGUAGE_CONFIGS = {
  html: {
    name: 'HTML',
    icon: '🌐',
    color: 'from-red-500 to-orange-500',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200'
  },
  css: {
    name: 'CSS',
    icon: '🎨',
    color: 'from-blue-500 to-indigo-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  javascript: {
    name: 'JavaScript',
    icon: '⚡',
    color: 'from-yellow-500 to-orange-500',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200'
  },
  python: {
    name: 'Python',
    icon: '🐍',
    color: 'from-green-500 to-blue-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  scratch: {
    name: 'Scratch',
    icon: '🧩',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200'
  }
};

export default function CodeSyntaxExample({ 
  language, 
  title, 
  description, 
  code, 
  ageGroup,
  difficulty = 'beginner' 
}: CodeSyntaxExampleProps) {
  const [copied, setCopied] = useState(false);
  const [showFullCode, setShowFullCode] = useState(false);

  const langConfig = LANGUAGE_CONFIGS[language as keyof typeof LANGUAGE_CONFIGS] || LANGUAGE_CONFIGS.html;

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const truncatedCode = code.length > 200 ? code.substring(0, 200) + '...' : code;
  const displayCode = showFullCode ? code : truncatedCode;

  return (
    <div className={`${langConfig.bgColor} ${langConfig.borderColor} border-2 rounded-2xl p-6 mb-6 shadow-lg hover:shadow-xl transition-all duration-300`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`text-3xl`}>{langConfig.icon}</div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r ${langConfig.color} text-white`}>
                {langConfig.name}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor()}`}>
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </span>
              {ageGroup && (
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-800">
                  👶 Ages {ageGroup}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={copyCode}
            className={`flex items-center px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
              copied 
                ? 'bg-green-500 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
            title="Copy code"
          >
            <FaCopy className="mr-2" />
            {copied ? 'Copied!' : 'Copy'}
          </button>
          
          <Link
            href={`/code-playground?language=${language}&age=${ageGroup || '6-9'}`}
            className={`flex items-center px-4 py-2 bg-gradient-to-r ${langConfig.color} text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
            title="Try in Code Playground"
          >
            <FaPlay className="mr-2" />
            Try It
          </Link>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-700 mb-4 text-lg leading-relaxed">{description}</p>

      {/* Code Block */}
      <div className="bg-gray-900 rounded-xl overflow-hidden shadow-inner">
        <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FaCode className="text-gray-400" />
            <span className="text-gray-300 font-mono text-sm">{langConfig.name} Code</span>
          </div>
          {code.length > 200 && (
            <button
              onClick={() => setShowFullCode(!showFullCode)}
              className="text-blue-400 hover:text-blue-300 text-sm font-semibold"
            >
              {showFullCode ? 'Show Less' : 'Show More'}
            </button>
          )}
        </div>
        <pre className="p-4 text-green-400 font-mono text-sm overflow-x-auto leading-relaxed">
          <code>{displayCode}</code>
        </pre>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href={`/code-playground?language=${language}&age=${ageGroup || '6-9'}&code=${encodeURIComponent(code)}`}
          className="flex items-center px-6 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit & Run
        </Link>
        
        <button
          onClick={copyCode}
          className="flex items-center px-6 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy Code
        </button>

        <Link
          href="/code-playground"
          className="flex items-center px-6 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          Open IDE
        </Link>
      </div>

      {/* Learning Tip */}
      <div className="mt-4 p-4 bg-white/70 rounded-lg border border-gray-200">
        <div className="flex items-start space-x-2">
          <div className="text-xl">💡</div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-1">Learning Tip:</h4>
            <p className="text-sm text-gray-600">
              Copy this code and try modifying it in the Code Playground! 
              Change colors, text, or numbers to see what happens. 
              Experimenting is the best way to learn programming!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

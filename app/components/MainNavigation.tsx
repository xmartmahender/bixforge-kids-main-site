'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage, LANGUAGES, Language } from '../contexts/LanguageContext';
import SearchEngine from './SearchEngine';
import { FaSearch, FaGlobe, FaChevronDown } from 'react-icons/fa';
import Image from 'next/image';

interface MainNavigationProps {
  isScrolled: boolean;
}

export default function MainNavigation({ isScrolled }: MainNavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { t, currentLanguage, setLanguage, isRTL } = useLanguage();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  const navigationItems = [
    { href: '/', label: t('nav.home', 'Home'), icon: '🏠' },
    { href: '/age-groups/0-3', label: t('nav.ageGroups', 'Age Groups'), icon: '👶' },
    { href: '/code-stories', label: t('nav.codeStories', 'Code Stories'), icon: '📚' },
    { href: '/code-videos', label: t('nav.codeVideos', 'Code Videos'), icon: '🎥' },
    { href: '/code-playground', label: t('nav.codeIDE', 'Code IDE'), icon: '💻' },
    { href: '/poems', label: t('nav.poems', 'Poems'), icon: '🎪' },
    { href: '/blog', label: t('nav.blog', 'Blog'), icon: '✍️' },
    { href: '/subscriptions', label: t('nav.subscriptions', 'Subscriptions'), icon: '👑' },
    { href: '/parents', label: t('nav.parents', 'For Parents'), icon: '👪' },
  ];

  return (
    <nav className="relative">
      <div className="flex justify-between items-center">
        {/* Logo */}
        {/* <Link
          href="/"
          className={`
            flex items-center space-x-3 text-2xl font-bold transition-all duration-300
            ${isScrolled
              ? 'text-purple-700 hover:text-purple-800'
              : 'text-white hover:text-yellow-200'
            }
          `}
        >
          <div className="relative">
            <span><Image src="/assets/images/kinder-code.jpeg" alt='logo image' width={12} height={12} /></span>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
          </div>
          <span className="bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent font-extrabold">
            Kinder Code
          </span>
        </Link> */}

       <Link
  href="/"
  className={`flex items-center space-x-3 text-2xl font-bold transition-all duration-300
    ${isScrolled
      ? 'text-purple-700 hover:text-purple-800'
      : 'text-white hover:text-yellow-200'
    }
  `}
>
  <div className="relative w-12 h-12">
    <Image
      src="/assets/images/kinder-code1.png"
      alt="logo image"
      fill
      className="object-cover rounded-full"
    />
    <div className="absolute -top-1 -right-1 w-6 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
  </div>
  <span className="bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent font-extrabold">
   
  </span>
</Link>


        {/* Mobile menu button */}
        <button
          className={`
            md:hidden p-3 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500
            ${isScrolled
              ? 'text-purple-700 hover:text-purple-800 hover:bg-purple-50'
              : 'text-white hover:text-yellow-200 hover:bg-white/10'
            }
          `}
          onClick={toggleMenu}
        >
          <svg className="h-6 w-6 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center justify-between flex-1 ml-8">
          <div className="flex items-center space-x-1">
            {navigationItems.map((item) => {
              const isActiveItem = item.href === '/' ? isActive('/') : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    relative px-3 py-2 rounded-xl font-medium transition-all duration-300 group
                    flex items-center space-x-2 text-sm
                    ${isActiveItem
                      ? isScrolled
                        ? 'text-purple-700 bg-purple-100'
                        : 'text-yellow-200 bg-white/20'
                      : isScrolled
                        ? 'text-gray-700 hover:text-purple-700 hover:bg-purple-50'
                        : 'text-white/90 hover:text-yellow-200 hover:bg-white/10'
                    }
                  `}
                  onMouseEnter={() => setHoveredItem(item.href)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <span className="text-base transition-transform duration-300 group-hover:scale-110">
                    {item.icon}
                  </span>
                  <span className="text-sm font-semibold whitespace-nowrap">{item.label}</span>

                  {/* Active indicator */}
                  {isActiveItem && (
                    <div className={`
                      absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full
                      ${isScrolled ? 'bg-purple-600' : 'bg-yellow-300'}
                    `} />
                  )}

                  {/* Hover effect */}
                  {hoveredItem === item.href && !isActiveItem && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Search and Language Controls */}
          <div className="flex items-center space-x-3">
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className={`
                p-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500
                ${isScrolled
                  ? 'text-gray-700 hover:text-purple-700 hover:bg-purple-50'
                  : 'text-white/90 hover:text-yellow-200 hover:bg-white/10'
                }
              `}
              title={t('common.search', 'Search')}
            >
              <FaSearch className="w-4 h-4" />
            </button>

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                className={`
                  flex items-center space-x-2 p-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500
                  ${isScrolled
                    ? 'text-gray-700 hover:text-purple-700 hover:bg-purple-50'
                    : 'text-white/90 hover:text-yellow-200 hover:bg-white/10'
                  }
                `}
                title={t('common.language', 'Language')}
              >
                <FaGlobe className="w-4 h-4" />
                <span className="text-sm font-semibold">{LANGUAGES[currentLanguage].flag}</span>
                <FaChevronDown className={`w-3 h-3 transition-transform duration-300 ${isLanguageDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Language Dropdown */}
              {isLanguageDropdownOpen && (
                <div className={`
                  absolute ${isRTL ? 'left-0' : 'right-0'} top-full mt-2 w-48 z-50
                  ${isScrolled
                    ? 'bg-white border border-gray-200'
                    : 'bg-white/95 backdrop-blur-md border border-white/20'
                  }
                  rounded-xl shadow-lg py-2
                `}>
                  {Object.entries(LANGUAGES).map(([code, lang]) => (
                    <button
                      key={code}
                      onClick={() => {
                        setLanguage(code as Language);
                        setIsLanguageDropdownOpen(false);
                      }}
                      className={`
                        w-full flex items-center space-x-3 px-4 py-2 text-left transition-colors
                        ${currentLanguage === code
                          ? 'bg-purple-100 text-purple-700'
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                        ${isRTL ? 'text-right' : 'text-left'}
                      `}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className="font-medium">{lang.name}</span>
                      {currentLanguage === code && (
                        <span className="ml-auto text-purple-600">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>


        </div>
      </div>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <div className={`
          md:hidden absolute top-full left-0 right-0 z-40
          ${isScrolled
            ? 'bg-white/95 backdrop-blur-md border-t border-purple-100'
            : 'bg-gradient-to-b from-purple-600/95 to-pink-500/95 backdrop-blur-md'
          }
          shadow-lg rounded-b-2xl mx-4 mt-2
        `}>
          <div className="p-6 space-y-4">
            {navigationItems.map((item) => {
              const isActiveItem = item.href === '/' ? isActive('/') : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center space-x-3 p-3 rounded-xl transition-all duration-300
                    ${isActiveItem
                      ? isScrolled
                        ? 'text-purple-700 bg-purple-100'
                        : 'text-yellow-200 bg-white/20'
                      : isScrolled
                        ? 'text-gray-700 hover:text-purple-700 hover:bg-purple-50'
                        : 'text-white/90 hover:text-yellow-200 hover:bg-white/10'
                    }
                  `}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-semibold text-base">{item.label}</span>
                  {isActiveItem && (
                    <div className="ml-auto w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                  )}
                </Link>
              );
            })}

            {/* Mobile Search and Language */}
            <div className={`
              mt-6 pt-4 border-t space-y-3
              ${isScrolled ? 'border-purple-200' : 'border-white/20'}
            `}>
              {/* Search Button for Mobile */}
              <button
                onClick={() => {
                  setIsSearchOpen(true);
                  setIsMenuOpen(false);
                }}
                className={`
                  w-full flex items-center justify-center space-x-2 p-3 rounded-xl transition-all duration-300
                  ${isScrolled
                    ? 'text-gray-700 hover:text-purple-700 hover:bg-purple-50'
                    : 'text-white/90 hover:text-yellow-200 hover:bg-white/10'
                  }
                `}
              >
                <FaSearch className="w-4 h-4" />
                <span className="font-semibold">{t('common.search', 'Search')}</span>
              </button>

              {/* Language Switcher for Mobile */}
              <div className="relative">
                <button
                  onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                  className={`
                    w-full flex items-center justify-center space-x-2 p-3 rounded-xl transition-all duration-300
                    ${isScrolled
                      ? 'text-gray-700 hover:text-purple-700 hover:bg-purple-50'
                      : 'text-white/90 hover:text-yellow-200 hover:bg-white/10'
                    }
                  `}
                >
                  <FaGlobe className="w-4 h-4" />
                  <span className="text-lg">{LANGUAGES[currentLanguage].flag}</span>
                  <span className="font-semibold">{LANGUAGES[currentLanguage].name}</span>
                  <FaChevronDown className={`w-3 h-3 transition-transform duration-300 ${isLanguageDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Mobile Language Dropdown */}
                {isLanguageDropdownOpen && (
                  <div className={`
                    absolute left-0 right-0 top-full mt-2 z-50
                    ${isScrolled
                      ? 'bg-white border border-gray-200'
                      : 'bg-white/95 backdrop-blur-md border border-white/20'
                    }
                    rounded-xl shadow-lg py-2 max-h-60 overflow-y-auto
                  `}>
                    {Object.entries(LANGUAGES).map(([code, lang]) => (
                      <button
                        key={code}
                        onClick={() => {
                          setLanguage(code as Language);
                          setIsLanguageDropdownOpen(false);
                          setIsMenuOpen(false);
                        }}
                        className={`
                          w-full flex items-center space-x-3 px-4 py-2 text-left transition-colors
                          ${currentLanguage === code
                            ? 'bg-purple-100 text-purple-700'
                            : 'text-gray-700 hover:bg-gray-100'
                          }
                        `}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span className="font-medium">{lang.name}</span>
                        {currentLanguage === code && (
                          <span className="ml-auto text-purple-600">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Engine Modal */}
      <SearchEngine isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </nav>
  );
}

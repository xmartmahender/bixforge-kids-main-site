'use client';

import React, { useState, useEffect } from 'react';
import MainNavigation from './MainNavigation';

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out
        ${isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-purple-100'
          : 'bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 shadow-md'
        }
      `}
    >
      <div className="container mx-auto px-4 py-3">
        <MainNavigation isScrolled={isScrolled} />
      </div>
    </header>
  );
}

export default Header;

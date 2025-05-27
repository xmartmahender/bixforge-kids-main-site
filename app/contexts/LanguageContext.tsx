'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Language types
export type Language = 'en' | 'ur' | 'hi' | 'sd' | 'ar' | 'fr' | 'es' | 'de';

export interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, fallback?: string) => string;
  isRTL: boolean;
}

// Available languages
export const LANGUAGES = {
  en: { name: 'English', flag: '🇺🇸', rtl: false },
  ur: { name: 'اردو', flag: '🇵🇰', rtl: true },
  hi: { name: 'हिंदी', flag: '🇮🇳', rtl: false },
  sd: { name: 'سنڌي', flag: '🇵🇰', rtl: true },
  ar: { name: 'العربية', flag: '🇸🇦', rtl: true },
  fr: { name: 'Français', flag: '🇫🇷', rtl: false },
  es: { name: 'Español', flag: '🇪🇸', rtl: false },
  de: { name: 'Deutsch', flag: '🇩🇪', rtl: false },
};

// Translations
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.ageGroups': 'Age Groups',
    'nav.codeStories': 'Code Stories',
    'nav.codeVideos': 'Code Videos',
    'nav.codeIDE': 'Code IDE',
    'nav.poems': 'Poems',
    'nav.blog': 'Blog',
    'nav.subscriptions': 'Subscriptions',
    'nav.parents': 'For Parents',

    // Common
    'common.loading': 'Loading...',
    'common.search': 'Search...',
    'common.readMore': 'Read More',
    'common.viewAll': 'View All',
    'common.backToHome': 'Back to Home',
    'common.language': 'Language',

    // Search
    'search.placeholder': 'Search stories, videos, code tutorials...',
    'search.results': 'Search Results',
    'search.noResults': 'No results found',
    'search.suggestions': 'Suggestions',

    // Blog
    'blog.title': 'Educational Blog',
    'blog.subtitle': 'Expert insights, tips, and resources for parents and educators',
    'blog.readTime': 'min read',
    'blog.author': 'By',
    'blog.tags': 'Tags',
    'blog.relatedArticles': 'Related Articles',
    'blog.shareArticle': 'Share this article',

    // Stories
    'stories.title': 'Stories',
    'stories.subtitle': 'Engaging stories for children of all ages',
    'stories.ageGroup': 'Age Group',
    'stories.category': 'Category',

    // Code Stories
    'codeStories.title': 'Code Stories',
    'codeStories.subtitle': 'Learn programming through interactive stories',
    'codeStories.language': 'Programming Language',
    'codeStories.difficulty': 'Difficulty',

    // Videos
    'videos.title': 'Videos',
    'videos.subtitle': 'Educational videos for young learners',
    'videos.duration': 'Duration',
    'videos.views': 'views',
  },
  ur: {
    // Navigation
    'nav.home': 'گھر',
    'nav.ageGroups': 'عمر کے گروپس',
    'nav.codeStories': 'کوڈ کہانیاں',
    'nav.codeVideos': 'کوڈ ویڈیوز',
    'nav.codeIDE': 'کوڈ IDE',
    'nav.poems': 'نظمیں',
    'nav.blog': 'بلاگ',
    'nav.subscriptions': 'سبسکرپشنز',
    'nav.parents': 'والدین کے لیے',

    // Common
    'common.loading': 'لوڈ ہو رہا ہے...',
    'common.search': 'تلاش کریں...',
    'common.readMore': 'مزید پڑھیں',
    'common.viewAll': 'سب دیکھیں',
    'common.backToHome': 'گھر واپس',
    'common.language': 'زبان',

    // Search
    'search.placeholder': 'کہانیاں، ویڈیوز، کوڈ ٹیوٹوریلز تلاش کریں...',
    'search.results': 'تلاش کے نتائج',
    'search.noResults': 'کوئی نتیجہ نہیں ملا',
    'search.suggestions': 'تجاویز',

    // Blog
    'blog.title': 'تعلیمی بلاگ',
    'blog.subtitle': 'والدین اور اساتذہ کے لیے ماہرانہ بصیرت، تجاویز اور وسائل',
    'blog.readTime': 'منٹ پڑھیں',
    'blog.author': 'بذریعہ',
    'blog.tags': 'ٹیگز',
    'blog.relatedArticles': 'متعلقہ مضامین',
    'blog.shareArticle': 'یہ مضمون شیئر کریں',

    // Stories
    'stories.title': 'کہانیاں',
    'stories.subtitle': 'تمام عمر کے بچوں کے لیے دلچسپ کہانیاں',
    'stories.ageGroup': 'عمر کا گروپ',
    'stories.category': 'قسم',

    // Code Stories
    'codeStories.title': 'کوڈ کہانیاں',
    'codeStories.subtitle': 'انٹرایکٹو کہانیوں کے ذریعے پروگرامنگ سیکھیں',
    'codeStories.language': 'پروگرامنگ زبان',
    'codeStories.difficulty': 'مشکل',

    // Videos
    'videos.title': 'ویڈیوز',
    'videos.subtitle': 'نوجوان سیکھنے والوں کے لیے تعلیمی ویڈیوز',
    'videos.duration': 'مدت',
    'videos.views': 'مناظر',
  },
  hi: {
    // Navigation
    'nav.home': 'होम',
    'nav.ageGroups': 'आयु समूह',
    'nav.codeStories': 'कोड कहानियाँ',
    'nav.codeVideos': 'कोड वीडियो',
    'nav.codeIDE': 'कोड IDE',
    'nav.poems': 'कविताएं',
    'nav.blog': 'ब्लॉग',
    'nav.subscriptions': 'सब्सक्रिप्शन',
    'nav.parents': 'माता-पिता के लिए',

    // Common
    'common.loading': 'लोड हो रहा है...',
    'common.search': 'खोजें...',
    'common.readMore': 'और पढ़ें',
    'common.viewAll': 'सभी देखें',
    'common.backToHome': 'होम पर वापस',
    'common.language': 'भाषा',

    // Search
    'search.placeholder': 'कहानियाँ, वीडियो, कोड ट्यूटोरियल खोजें...',
    'search.results': 'खोज परिणाम',
    'search.noResults': 'कोई परिणाम नहीं मिला',
    'search.suggestions': 'सुझाव',

    // Blog
    'blog.title': 'शैक्षिक ब्लॉग',
    'blog.subtitle': 'माता-पिता और शिक्षकों के लिए विशेषज्ञ अंतर्दृष्टि, सुझाव और संसाधन',
    'blog.readTime': 'मिनट पढ़ें',
    'blog.author': 'द्वारा',
    'blog.tags': 'टैग',
    'blog.relatedArticles': 'संबंधित लेख',
    'blog.shareArticle': 'इस लेख को साझा करें',

    // Stories
    'stories.title': 'कहानियाँ',
    'stories.subtitle': 'सभी उम्र के बच्चों के लिए आकर्षक कहानियाँ',
    'stories.ageGroup': 'आयु समूह',
    'stories.category': 'श्रेणी',

    // Code Stories
    'codeStories.title': 'कोड कहानियाँ',
    'codeStories.subtitle': 'इंटरैक्टिव कहानियों के माध्यम से प्रोग्रामिंग सीखें',
    'codeStories.language': 'प्रोग्रामिंग भाषा',
    'codeStories.difficulty': 'कठिनाई',

    // Videos
    'videos.title': 'वीडियो',
    'videos.subtitle': 'युवा शिक्षार्थियों के लिए शैक्षिक वीडियो',
    'videos.duration': 'अवधि',
    'videos.views': 'दृश्य',
  },
  sd: {
    // Navigation (Sindhi)
    'nav.home': 'گھر',
    'nav.ageGroups': 'عمر جا گروپ',
    'nav.codeStories': 'ڪوڊ ڪهاڻيون',
    'nav.codeVideos': 'ڪوڊ وڊيوز',
    'nav.codeIDE': 'ڪوڊ IDE',
    'nav.poems': 'شعر',
    'nav.blog': 'بلاگ',
    'nav.subscriptions': 'سبسڪرپشن',
    'nav.parents': 'والدين لاءِ',

    // Common
    'common.loading': 'لوڊ ٿي رهيو آهي...',
    'common.search': 'ڳولهيو...',
    'common.readMore': 'وڌيڪ پڙهو',
    'common.viewAll': 'سڀ ڏسو',
    'common.backToHome': 'گھر واپس',
    'common.language': 'ٻولي',
  },
  ar: {
    // Navigation (Arabic)
    'nav.home': 'الرئيسية',
    'nav.ageGroups': 'الفئات العمرية',
    'nav.codeStories': 'قصص البرمجة',
    'nav.codeVideos': 'فيديوهات البرمجة',
    'nav.codeIDE': 'محرر الأكواد',
    'nav.poems': 'القصائد',
    'nav.blog': 'المدونة',
    'nav.subscriptions': 'الاشتراكات',
    'nav.parents': 'للوالدين',

    // Common
    'common.loading': 'جاري التحميل...',
    'common.search': 'البحث...',
    'common.readMore': 'اقرأ المزيد',
    'common.viewAll': 'عرض الكل',
    'common.backToHome': 'العودة للرئيسية',
    'common.language': 'اللغة',
  },
  fr: {
    // Navigation (French)
    'nav.home': 'Accueil',
    'nav.ageGroups': 'Groupes d\'âge',
    'nav.codeStories': 'Histoires de Code',
    'nav.codeVideos': 'Vidéos de Code',
    'nav.codeIDE': 'IDE de Code',
    'nav.poems': 'Poèmes',
    'nav.blog': 'Blog',
    'nav.subscriptions': 'Abonnements',
    'nav.parents': 'Pour les Parents',

    // Common
    'common.loading': 'Chargement...',
    'common.search': 'Rechercher...',
    'common.readMore': 'Lire la suite',
    'common.viewAll': 'Voir tout',
    'common.backToHome': 'Retour à l\'accueil',
    'common.language': 'Langue',
  },
  es: {
    // Navigation (Spanish)
    'nav.home': 'Inicio',
    'nav.ageGroups': 'Grupos de Edad',
    'nav.codeStories': 'Historias de Código',
    'nav.codeVideos': 'Videos de Código',
    'nav.codeIDE': 'IDE de Código',
    'nav.poems': 'Poemas',
    'nav.blog': 'Blog',
    'nav.subscriptions': 'Suscripciones',
    'nav.parents': 'Para Padres',

    // Common
    'common.loading': 'Cargando...',
    'common.search': 'Buscar...',
    'common.readMore': 'Leer más',
    'common.viewAll': 'Ver todo',
    'common.backToHome': 'Volver al inicio',
    'common.language': 'Idioma',
  },
  de: {
    // Navigation (German)
    'nav.home': 'Startseite',
    'nav.ageGroups': 'Altersgruppen',
    'nav.codeStories': 'Code-Geschichten',
    'nav.codeVideos': 'Code-Videos',
    'nav.codeIDE': 'Code-IDE',
    'nav.poems': 'Gedichte',
    'nav.blog': 'Blog',
    'nav.subscriptions': 'Abonnements',
    'nav.parents': 'Für Eltern',

    // Common
    'common.loading': 'Wird geladen...',
    'common.search': 'Suchen...',
    'common.readMore': 'Mehr lesen',
    'common.viewAll': 'Alle anzeigen',
    'common.backToHome': 'Zurück zur Startseite',
    'common.language': 'Sprache',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

  // Load saved language from localStorage after hydration
  useEffect(() => {
    // Only access localStorage after component has hydrated
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('bixforge-language') as Language;
      if (savedLanguage && LANGUAGES[savedLanguage]) {
        setCurrentLanguage(savedLanguage);
        // Update document direction for RTL languages
        document.documentElement.dir = LANGUAGES[savedLanguage].rtl ? 'rtl' : 'ltr';
        document.documentElement.lang = savedLanguage;
      }
    }
  }, []);

  // Save language to localStorage
  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);

    // Only access localStorage and document if available
    if (typeof window !== 'undefined') {
      localStorage.setItem('bixforge-language', language);

      // Update document direction for RTL languages
      document.documentElement.dir = LANGUAGES[language].rtl ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
    }
  };

  // Translation function
  const t = (key: string, fallback?: string): string => {
    return translations[currentLanguage]?.[key] || translations.en[key] || fallback || key;
  };

  const isRTL = LANGUAGES[currentLanguage].rtl;

  const value: LanguageContextType = {
    currentLanguage,
    setLanguage,
    t,
    isRTL,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

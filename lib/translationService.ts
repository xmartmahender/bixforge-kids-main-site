import { ContentLanguage } from '../app/components/ContentLanguageTranslator';

// Translation cache to avoid repeated API calls
const translationCache = new Map<string, string>();

// Mock translation service - In production, you would use Google Translate API, Azure Translator, etc.
export class TranslationService {
  private static instance: TranslationService;
  private apiKey: string | null = null;

  private constructor() {
    // Initialize with API key if available
    this.apiKey = process.env.NEXT_PUBLIC_TRANSLATE_API_KEY || null;
  }

  public static getInstance(): TranslationService {
    if (!TranslationService.instance) {
      TranslationService.instance = new TranslationService();
    }
    return TranslationService.instance;
  }

  // Generate cache key for translation
  private getCacheKey(text: string, fromLang: string, toLang: string): string {
    return `${fromLang}-${toLang}-${text.substring(0, 50)}`;
  }

  // Mock translation function - replace with real API
  private async mockTranslate(text: string, toLang: ContentLanguage): Promise<string> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

    // Mock translations for demonstration
    const mockTranslations: Record<ContentLanguage, Record<string, string>> = {
      'en': {},
      'ur': {
        'Once upon a time': 'ایک دفعہ کا ذکر ہے',
        'The End': 'اختتام',
        'Chapter': 'باب',
        'Story': 'کہانی',
        'Hello': 'سلام',
        'Welcome': 'خوش آمدید',
        'Thank you': 'شکریہ',
        'Good morning': 'صبح بخیر',
        'Good night': 'شب بخیر',
        'How are you?': 'آپ کیسے ہیں؟',
        'I love you': 'میں آپ سے محبت کرتا ہوں',
        'Beautiful': 'خوبصورت',
        'Happy': 'خوش',
        'Sad': 'اداس',
        'Friend': 'دوست',
        'Family': 'خاندان',
        'Home': 'گھر',
        'School': 'اسکول',
        'Book': 'کتاب',
        'Learn': 'سیکھنا'
      },
      'hi': {
        'Once upon a time': 'एक बार की बात है',
        'The End': 'समाप्त',
        'Chapter': 'अध्याय',
        'Story': 'कहानी',
        'Hello': 'नमस्ते',
        'Welcome': 'स्वागत',
        'Thank you': 'धन्यवाद',
        'Good morning': 'सुप्रभात',
        'Good night': 'शुभ रात्रि',
        'How are you?': 'आप कैसे हैं?',
        'I love you': 'मैं तुमसे प्यार करता हूँ',
        'Beautiful': 'सुंदर',
        'Happy': 'खुश',
        'Sad': 'उदास',
        'Friend': 'मित्र',
        'Family': 'परिवार',
        'Home': 'घर',
        'School': 'स्कूल',
        'Book': 'पुस्तक',
        'Learn': 'सीखना'
      },
      'ar': {
        'Once upon a time': 'في قديم الزمان',
        'The End': 'النهاية',
        'Chapter': 'فصل',
        'Story': 'قصة',
        'Hello': 'مرحبا',
        'Welcome': 'أهلا وسهلا',
        'Thank you': 'شكرا لك',
        'Good morning': 'صباح الخير',
        'Good night': 'تصبح على خير',
        'How are you?': 'كيف حالك؟',
        'I love you': 'أحبك',
        'Beautiful': 'جميل',
        'Happy': 'سعيد',
        'Sad': 'حزين',
        'Friend': 'صديق',
        'Family': 'عائلة',
        'Home': 'منزل',
        'School': 'مدرسة',
        'Book': 'كتاب',
        'Learn': 'تعلم'
      },
      'fr': {
        'Once upon a time': 'Il était une fois',
        'The End': 'Fin',
        'Chapter': 'Chapitre',
        'Story': 'Histoire',
        'Hello': 'Bonjour',
        'Welcome': 'Bienvenue',
        'Thank you': 'Merci',
        'Good morning': 'Bonjour',
        'Good night': 'Bonne nuit',
        'How are you?': 'Comment allez-vous?',
        'I love you': 'Je t\'aime',
        'Beautiful': 'Beau',
        'Happy': 'Heureux',
        'Sad': 'Triste',
        'Friend': 'Ami',
        'Family': 'Famille',
        'Home': 'Maison',
        'School': 'École',
        'Book': 'Livre',
        'Learn': 'Apprendre'
      },
      'es': {
        'Once upon a time': 'Érase una vez',
        'The End': 'Fin',
        'Chapter': 'Capítulo',
        'Story': 'Historia',
        'Hello': 'Hola',
        'Welcome': 'Bienvenido',
        'Thank you': 'Gracias',
        'Good morning': 'Buenos días',
        'Good night': 'Buenas noches',
        'How are you?': '¿Cómo estás?',
        'I love you': 'Te amo',
        'Beautiful': 'Hermoso',
        'Happy': 'Feliz',
        'Sad': 'Triste',
        'Friend': 'Amigo',
        'Family': 'Familia',
        'Home': 'Casa',
        'School': 'Escuela',
        'Book': 'Libro',
        'Learn': 'Aprender'
      },
      'de': {
        'Once upon a time': 'Es war einmal',
        'The End': 'Ende',
        'Chapter': 'Kapitel',
        'Story': 'Geschichte',
        'Hello': 'Hallo',
        'Welcome': 'Willkommen',
        'Thank you': 'Danke',
        'Good morning': 'Guten Morgen',
        'Good night': 'Gute Nacht',
        'How are you?': 'Wie geht es dir?',
        'I love you': 'Ich liebe dich',
        'Beautiful': 'Schön',
        'Happy': 'Glücklich',
        'Sad': 'Traurig',
        'Friend': 'Freund',
        'Family': 'Familie',
        'Home': 'Zuhause',
        'School': 'Schule',
        'Book': 'Buch',
        'Learn': 'Lernen'
      },
      'pt': {},
      'it': {},
      'ja': {},
      'ko': {},
      'zh': {},
      'ru': {},
      'tr': {},
      'nl': {}
    };

    // Try to find exact match first
    const langTranslations = mockTranslations[toLang] || {};
    if (langTranslations[text]) {
      return langTranslations[text];
    }

    // Try to find partial matches for common phrases
    for (const [key, value] of Object.entries(langTranslations)) {
      if (text.toLowerCase().includes(key.toLowerCase())) {
        return text.replace(new RegExp(key, 'gi'), value);
      }
    }

    // If no translation found, return original text with a note
    return `${text} [Translation to ${toLang} not available]`;
  }

  // Main translation method
  public async translateText(
    text: string,
    fromLang: ContentLanguage = 'en',
    toLang: ContentLanguage
  ): Promise<string> {
    if (fromLang === toLang) {
      return text;
    }

    const cacheKey = this.getCacheKey(text, fromLang, toLang);

    // Check cache first
    if (translationCache.has(cacheKey)) {
      return translationCache.get(cacheKey)!;
    }

    try {
      let translatedText: string;

      if (this.apiKey) {
        // Use real translation API (implement based on your chosen service)
        translatedText = await this.translateWithAPI(text, fromLang, toLang);
      } else {
        // Use mock translation
        translatedText = await this.mockTranslate(text, toLang);
      }

      // Cache the result
      translationCache.set(cacheKey, translatedText);

      return translatedText;
    } catch (error) {
      console.warn('Translation failed:', error);
      return `${text} [Translation failed]`;
    }
  }

  // Real API translation (implement based on your chosen service)
  private async translateWithAPI(
    text: string,
    fromLang: ContentLanguage,
    toLang: ContentLanguage
  ): Promise<string> {
    // Example implementation for Google Translate API
    // Replace with your actual API implementation

    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        from: fromLang,
        to: toLang,
        apiKey: this.apiKey
      })
    });

    if (!response.ok) {
      throw new Error('Translation API request failed');
    }

    const data = await response.json();
    return data.translatedText || text;
  }

  // Translate story content with formatting preservation
  public async translateStoryContent(
    content: string,
    fromLang: ContentLanguage = 'en',
    toLang: ContentLanguage
  ): Promise<string> {
    if (fromLang === toLang) {
      return content;
    }

    try {
      // Split content into paragraphs
      const paragraphs = content.split('\n');
      const translatedParagraphs: string[] = [];

      for (const paragraph of paragraphs) {
        if (paragraph.trim() === '') {
          translatedParagraphs.push('');
          continue;
        }

        // Translate the paragraph
        const translated = await this.translateText(paragraph, fromLang, toLang);
        translatedParagraphs.push(translated);
      }

      return translatedParagraphs.join('\n');
    } catch (error) {
      console.warn('Story content translation failed:', error);
      return content;
    }
  }

  // Clear translation cache
  public clearCache(): void {
    translationCache.clear();
  }

  // Get cache size
  public getCacheSize(): number {
    return translationCache.size;
  }
}

// Export singleton instance
export const translationService = TranslationService.getInstance();

// Utility function for quick translations
export async function translateText(
  text: string,
  toLang: ContentLanguage,
  fromLang: ContentLanguage = 'en'
): Promise<string> {
  return translationService.translateText(text, fromLang, toLang);
}

// Utility function for story content translation
export async function translateStoryContent(
  content: string,
  toLang: ContentLanguage,
  fromLang: ContentLanguage = 'en'
): Promise<string> {
  return translationService.translateStoryContent(content, fromLang, toLang);
}

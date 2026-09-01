import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';
import { translations, localizedSuggestedQuestions, TranslationSchema } from '../data/translations';

export interface LanguageMeta {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
  badge: string;
  sttCode: string; // Speech recognition locale
  ttsLang: string; // Speech synthesis locale
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', badge: 'EN', sttCode: 'en-IN', ttsLang: 'en-IN' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', badge: 'TA', sttCode: 'ta-IN', ttsLang: 'ta-IN' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳', badge: 'HI', sttCode: 'hi-IN', ttsLang: 'hi-IN' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', badge: 'TE', sttCode: 'te-IN', ttsLang: 'te-IN' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', badge: 'KN', sttCode: 'kn-IN', ttsLang: 'kn-IN' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳', badge: 'ML', sttCode: 'ml-IN', ttsLang: 'ml-IN' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', badge: 'MR', sttCode: 'mr-IN', ttsLang: 'mr-IN' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳', badge: 'BN', sttCode: 'bn-IN', ttsLang: 'bn-IN' },
];

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof TranslationSchema, fallback?: string) => string;
  currentLangMeta: LanguageMeta;
  suggestedQuestions: string[];
  supportedLanguages: LanguageMeta[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'agriveda_language';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && (saved === 'en' || saved === 'ta' || saved === 'hi' || saved === 'te')) {
        return saved as Language;
      }
    } catch (e) {
      console.warn('Could not load language from localStorage', e);
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      console.warn('Could not save language to localStorage', e);
    }
  };

  const currentLangMeta = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  // Translation lookup function with strict fallbacks
  const t = (key: keyof TranslationSchema, fallback?: string): string => {
    const dict = translations[language] || translations.en;
    if (dict && dict[key]) {
      return dict[key];
    }
    // Fallback to English dictionary if key is missing in selected language
    if (translations.en && translations.en[key]) {
      return translations.en[key];
    }
    return fallback || key;
  };

  const suggestedQuestions = localizedSuggestedQuestions[language] || localizedSuggestedQuestions.en;

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        currentLangMeta,
        suggestedQuestions,
        supportedLanguages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

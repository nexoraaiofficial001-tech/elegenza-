import React, { createContext, useContext, useState, useEffect } from 'react';
import enTranslations from '../locales/en.json';
import urTranslations from '../locales/ur.json';

export type Language = 'en' | 'ur';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  isRtl: boolean;
  t: (path: string, params?: Record<string, string | number>) => string;
  formatPrice: (amount: number) => string;
}

const translations: Record<Language, any> = {
  en: enTranslations,
  ur: urTranslations,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('eleganza_lang');
      if (saved === 'en' || saved === 'ur') return saved;
      if (navigator.language.startsWith('ur')) return 'ur';
    } catch {
      // Fallback
    }
    return 'en';
  });

  const isRtl = language === 'ur';

  useEffect(() => {
    try {
      localStorage.setItem('eleganza_lang', language);
    } catch {}
    
    document.documentElement.lang = language;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    if (isRtl) {
      document.documentElement.classList.add('font-urdu');
    } else {
      document.documentElement.classList.remove('font-urdu');
    }
  }, [language, isRtl]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'en' ? 'ur' : 'en'));
  };

  const t = (path: string, params?: Record<string, string | number>): string => {
    const keys = path.split('.');
    let current: any = translations[language];

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        // Fallback to English
        let fallbackCurrent: any = translations.en;
        for (const fbKey of keys) {
          if (fallbackCurrent && typeof fallbackCurrent === 'object' && fbKey in fallbackCurrent) {
            fallbackCurrent = fallbackCurrent[fbKey];
          } else {
            return path;
          }
        }
        current = fallbackCurrent;
        break;
      }
    }

    if (typeof current !== 'string') return path;

    let result = current;
    if (params) {
      for (const [key, val] of Object.entries(params)) {
        result = result.replace(new RegExp(`{{${key}}}`, 'g'), String(val));
      }
    }
    return result;
  };

  const formatPrice = (amount: number): string => {
    const formattedNum = Number(amount || 0).toLocaleString('en-US');
    return language === 'ur' ? `روپے ${formattedNum}` : `Rs ${formattedNum}`;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        isRtl,
        t,
        formatPrice,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

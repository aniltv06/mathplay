/**
 * i18n Context for managing language state across the React app
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, Translations, translations, languageNames } from './translations';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  languageNames: Record<Language, string>;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: ((props: { language: Language }) => ReactNode) | ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [language, setLanguageState] = useState<Language>('en');

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('mathplay_language') as Language;
    if (savedLang && translations[savedLang]) {
      setLanguageState(savedLang);
    }
  }, []);

  // Save language to localStorage when it changes
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('mathplay_language', lang);
  };

  const value: I18nContextType = {
    language,
    setLanguage,
    t: translations[language],
    languageNames
  };

  return (
    <I18nContext.Provider value={value}>
      {typeof children === 'function' ? children({ language }) : children}
    </I18nContext.Provider>
  );
}

/**
 * Hook to use i18n context
 */
export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}

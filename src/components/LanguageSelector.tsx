/**
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

/**
 * Language Selector Component
 * Dropdown for selecting app language
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, Check } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import type { Language } from '../i18n/translations';

export function LanguageSelector() {
  const { language, setLanguage, languageNames } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  const languages: Language[] = ['en', 'es', 'fr', 'de', 'zh', 'kn', 'te'];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-xl transition-all shadow-sm"
        aria-label="Select language"
      >
        <Globe className="w-5 h-5" />
        <span className="hidden sm:inline">{languageNames[language]}</span>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-[100] min-w-[180px]"
          >
            <div className="py-2">
              {languages.map((lang) => (
                <motion.button
                  key={lang}
                  whileHover={{ backgroundColor: 'rgba(167, 139, 250, 0.1)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleLanguageChange(lang)}
                  className={`w-full px-4 py-3 text-left flex items-center justify-between transition-colors ${
                    language === lang
                      ? 'bg-purple-50 text-purple-700 font-semibold'
                      : 'text-gray-800 hover:text-purple-700 hover:bg-purple-50/50'
                  }`}
                >
                  <span className="font-medium">{languageNames[lang]}</span>
                  {language === lang && (
                    <Check className="w-5 h-5 text-purple-700" />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

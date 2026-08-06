import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { translations } from './translations';

const LANGUAGE_KEY = 'oasis_lang';
const LanguageContext = createContext(null);

export const LANGUAGES = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'ml', label: 'മലയാളം', short: 'ML' },
  { code: 'ta', label: 'தமிழ்', short: 'TA' }
];

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem(LANGUAGE_KEY) || 'en';
    } catch (e) {
      return 'en';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LANGUAGE_KEY, lang);
    } catch (e) {
      // ignore
    }
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useCallback(
    (key, params) => {
      const dict = translations[lang] || translations.en;
      const value = key.split('.').reduce((obj, k) => (obj && obj[k] !== undefined ? obj[k] : undefined), dict);
      const resolved = value !== undefined ? value : key.split('.').reduce((obj, k) => (obj && obj[k] !== undefined ? obj[k] : undefined), translations.en);
      if (typeof resolved === 'string' && params) {
        return Object.entries(params).reduce((str, [k, v]) => str.replace(new RegExp(`\\{${k}\\}`, 'g'), v), resolved);
      }
      return resolved !== undefined ? resolved : key;
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}

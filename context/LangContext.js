'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const LangContext = createContext({ lang: 'ru', setLang: () => {} });

export function LangProvider({ children }) {
  const [lang, setLangState] = useState('ru');

  useEffect(() => {
    const stored = localStorage.getItem('lang');
    if (stored === 'en' || stored === 'ru') setLangState(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.classList.toggle('lang-ru', lang === 'ru');
    document.documentElement.classList.toggle('lang-en', lang === 'en');
  }, [lang]);

  const setLang = (l) => setLangState(l);

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}

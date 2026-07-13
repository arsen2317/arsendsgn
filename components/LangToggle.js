'use client';

import { useLang } from '../context/LangContext';

export default function LangToggle({ playFx = () => {} }) {
  const { lang, setLang } = useLang();

  const toggle = () => {
    playFx();
    setLang(lang === 'ru' ? 'en' : 'ru');
  };

  return (
    <button className="lang-toggle" onClick={toggle} aria-label="Switch language">
      <span className={lang === 'ru' ? 'lang-toggle__active' : ''}>RU</span>
      <span className="lang-toggle__sep">·</span>
      <span className={lang === 'en' ? 'lang-toggle__active' : ''}>EN</span>
    </button>
  );
}

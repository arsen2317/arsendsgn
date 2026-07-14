'use client';

import { useEffect, useRef, useState } from 'react';
import { useLang } from '../context/LangContext';
import { t } from '../lib/i18n';

const CV_URL_EN = `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/Arsen.Arakelyan.CV.eng.pdf`;
const CV_URL_RU = `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/Arsen.Arakelyan.CV.rus.pdf`;

const downloadCV = (lang) => {
  const a = document.createElement('a');
  a.href = lang === 'ru' ? CV_URL_RU : CV_URL_EN;
  a.target = '_blank';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const WORDS_1 = ['Empathetic', 'Curious', 'Thoughtful', 'Intentional', 'Holistic'];
const WORDS_2 = ['Strategic', 'Systematic', 'Analytical', 'Iterative', 'Precise'];

const ST = ({ children }) => (
  <span className="st-wrap">
    <span className="st">
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  </span>
);

export default function Footer() {
  const { lang } = useLang();
  const tr = t[lang];
  const idx1 = useRef(0);
  const idx2 = useRef(0);
  const [word1, setWord1] = useState(WORDS_1[0]);
  const [word2, setWord2] = useState(WORDS_2[0]);
  const [fade1, setFade1] = useState(false);
  const [fade2, setFade2] = useState(false);

  useEffect(() => {
    let turn = 0;
    const t = setInterval(() => {
      if (turn === 0) {
        setFade1(true);
        setTimeout(() => {
          idx1.current = (idx1.current + 1) % WORDS_1.length;
          setWord1(WORDS_1[idx1.current]);
          setFade1(false);
        }, 300);
      } else {
        setFade2(true);
        setTimeout(() => {
          idx2.current = (idx2.current + 1) % WORDS_2.length;
          setWord2(WORDS_2[idx2.current]);
          setFade2(false);
        }, 300);
      }
      turn = (turn + 1) % 2;
    }, 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <footer className="footer" id="contacts">
      <nav className="footer-nav">
        <div className="footer-nav-item square">Product</div>
        <div className={`footer-nav-item lavender cycling${fade1 ? ' fade' : ''}`}>{word1}</div>
        <div className="footer-nav-item square">Designer</div>
        <div className={`footer-nav-item pink cycling${fade2 ? ' fade' : ''}`}>{word2}</div>
      </nav>
      <div className="footer-bottom">
        <div className="footer-copy"><span>© 2026 Arsen Arakelyan</span></div>
        <div className="badge-wrap"><span className="badge yellow" onClick={() => downloadCV(lang)} style={{ cursor: 'pointer' }}><ST>{tr.footer.downloadCv}</ST></span></div>
        <div className="footer-links">
          <div className="badge-wrap"><a href="mailto:arsart94@yandex.ru" className="badge primary"><ST>E-mail</ST></a></div>
          <div className="badge-wrap"><a href="https://t.me/arsendsgn" target="_blank" className="badge primary"><ST>Telegram</ST></a></div>
          <div className="badge-wrap"><a href="https://www.linkedin.com/in/arsendsgn/" target="_blank" className="badge primary"><ST>LinkedIn</ST></a></div>
        </div>
      </div>
    </footer>
  );
}

'use client';

import { useState, useEffect } from 'react';
import styles from './Footer.module.css';

const adjectives = ['UX', 'Интерфейсный', 'Системный', 'Визуальный'];
const qualifiers = ['что работает', 'в деталях', 'с душой', 'с умом'];

export default function Footer() {
  const [adjIdx, setAdjIdx] = useState(0);
  const [qualIdx, setQualIdx] = useState(0);
  const [adjFading, setAdjFading] = useState(false);
  const [qualFading, setQualFading] = useState(false);

  useEffect(() => {
    const adjTimer = setInterval(() => {
      setAdjFading(true);
      setTimeout(() => {
        setAdjIdx((i) => (i + 1) % adjectives.length);
        setAdjFading(false);
      }, 300);
    }, 3000);

    const qualTimer = setInterval(() => {
      setQualFading(true);
      setTimeout(() => {
        setQualIdx((i) => (i + 1) % qualifiers.length);
        setQualFading(false);
      }, 300);
    }, 3700);

    return () => {
      clearInterval(adjTimer);
      clearInterval(qualTimer);
    };
  }, []);

  return (
    <footer className={styles.footer} id="footer">
      <div className={styles.inner}>
        {/* Big cycling tagline */}
        <div className={styles.tagline}>
          <span className={styles.taglineStatic}>Продуктовый</span>
          {' '}
          <span
            className={`${styles.taglinePill} ${adjFading ? styles.fading : ''}`}
          >
            {adjectives[adjIdx]}
          </span>
          {' '}
          <span className={styles.taglineStatic}>Дизайнер</span>
          {' '}
          <span
            className={`${styles.taglinePill} ${qualFading ? styles.fading : ''}`}
          >
            {qualifiers[qualIdx]}
          </span>
        </div>

        {/* Divider */}
        <div className={styles.divider} />

        {/* Bottom row */}
        <div className={styles.bottom}>
          <span className={styles.copy}>©2025 Арсен Ракелян</span>
          <div className={styles.contact}>
            <span className={styles.contactLabel}>Общие вопросы</span>
            <a
              href="mailto:arackelian.arsen@gmail.com"
              className={styles.contactLink}
            >
              arackelian.arsen@gmail.com
            </a>
          </div>
          <div className={styles.socials}>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              LinkedIn
            </a>
            <a
              href="https://t.me/arsendsgn"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              Telegram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

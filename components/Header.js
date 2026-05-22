'use client';

import { useEffect, useState } from 'react';
import styles from './Header.module.css';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [logoHovered, setLogoHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    setMenuOpen(false);
  };

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        {/* Logo */}
        <div
          className={styles.logo}
          onMouseEnter={() => setLogoHovered(true)}
          onMouseLeave={() => setLogoHovered(false)}
        >
          {logoHovered ? (
            <span className={styles.logoFull}>
              <span>Арсен</span>
              <span>Аракелян</span>
            </span>
          ) : (
            <span className={styles.logoShort}>
              A:<span className={styles.cursor}>_</span>
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
          <a
            href="#intro"
            className={styles.navPill}
            onClick={(e) => handleNavClick(e, '#intro')}
          >
            Работы
          </a>
          <a
            href="#intro"
            className={styles.navPill}
            onClick={(e) => handleNavClick(e, '#intro')}
          >
            Обо мне
          </a>
          <a
            href="mailto:arackelian.arsen@gmail.com"
            className={styles.navPill}
          >
            Связаться
          </a>
        </nav>

        {/* Right hint */}
        <div className={styles.hint}>
          <span className={styles.hintText}>Нажми / для ?</span>
          {/* Hamburger */}
          <button
            className={styles.hamburger}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Открыть меню"
          >
            <span className={`${styles.bar} ${menuOpen ? styles.barOpen1 : ''}`} />
            <span className={`${styles.bar} ${menuOpen ? styles.barOpen2 : ''}`} />
            <span className={`${styles.bar} ${menuOpen ? styles.barOpen3 : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
}

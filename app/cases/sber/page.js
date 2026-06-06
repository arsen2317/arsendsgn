'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './page.module.css';
import SiteHeader from '../../../components/SiteHeader';

const ST = ({ children }) => (
  <span className="st-wrap">
    <span className="st">
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  </span>
);

const CV_URL = 'https://github.com/arsen2317/arsendsgn/releases/download/cv/CV.Arsen.Arakelyan.pdf';
const downloadCV = () => {
  const a = document.createElement('a');
  a.href = CV_URL;
  a.target = '_blank';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const SLIDES = [
  {
    id: 'context',
    description:
      "Sber is Russia's largest acquiring provider with over 2 million terminals deployed across the country. The hardware is everywhere — payments via QR code, card, and biometrics are already solved. The question now is: can we expand the user experience of a payment terminal and find new value beyond the transaction itself?",
  },
  {
    id: 'research',
    description:
      'We conducted 24 in-depth interviews with merchants across different business segments. Key insight: terminals sit idle between payment moments. Merchants spent over half their workday on tasks the terminal could help with — but didn\'t.',
  },
  {
    id: 'concept',
    description:
      'We redesigned the terminal OS around micro-apps — lightweight tools for inventory management, tip prompts, loyalty integration, and end-of-day analytics. The goal: turn idle hardware into an active business assistant.',
  },
  {
    id: 'design',
    description:
      'The terminal screen is small, used in gloves, in noise, under time pressure. Every interaction had to be single-hand operable and resolve in under 3 taps. We tested 6 prototypes with real cashiers across 3 cities.',
  },
  {
    id: 'outcome',
    description:
      'Pilot across 1 200 terminals in 4 regions. Task completion improved by 34 %. Merchant NPS rose from 41 to 68. The feature set is now in public beta across Sber\'s full terminal network.',
  },
];

const VIDEO_URL = 'https://github.com/arsen2317/arsendsgn/releases/download/video/sber.video.mp4';

export default function SberCase() {
  const [activeIdx, setActiveIdx]       = useState(0);
  const [displayedIdx, setDisplayedIdx] = useState(0);
  const [textVisible, setTextVisible]   = useState(true);
  const [menuOpen, setMenuOpen]         = useState(false);

  const scrollerRef = useRef(null);
  const prevIdxRef  = useRef(0);
  const fxRef       = useRef(null);

  const playFx = () => fxRef.current?.cloneNode().play().catch(() => {});

  const scrollToSlide = (idx) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollTo({ top: idx * scroller.clientHeight, behavior: 'smooth' });
  };

  /* Full-viewport layout */
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.paddingTop = '0';
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingTop = '';
    };
  }, []);

  /* Audio */
  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
    const audio = new Audio(`${base}/fx.mp3`);
    fxRef.current = audio;
    const unlock = () => { audio.play().then(() => { audio.pause(); audio.currentTime = 0; }).catch(() => {}); };
    window.addEventListener('pointerdown', unlock, { once: true });
    return () => window.removeEventListener('pointerdown', unlock);
  }, []);

  /* GSAP entrance */
  useEffect(() => {
    let ctx;
    async function init() {
      const { gsap } = await import('gsap');
      ctx = gsap.context(() => {
        gsap.from('.header',         { y: -80, opacity: 0, duration: 0.7, ease: 'power3.out' });
        gsap.from('[data-case-tag]', { y: 40,  opacity: 0, duration: 0.8, delay: 0.2, stagger: 0.08, ease: 'back.out(2)' });
        gsap.from('[data-subtitle]', { y: 20,  opacity: 0, duration: 0.7, delay: 0.45, ease: 'power3.out' });
        gsap.from('[data-skill]',    { y: 16,  opacity: 0, duration: 0.6, delay: 0.55, stagger: 0.04, ease: 'power2.out' });
        gsap.from('[data-slide]',    { scale: 0.96, opacity: 0, duration: 1, delay: 0.3, ease: 'power3.out' });
      });
    }
    init();
    return () => ctx?.revert();
  }, []);

  /* Track active slide via scroll position */
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const onScroll = () => {
      const idx = Math.round(scroller.scrollTop / scroller.clientHeight);
      if (idx === prevIdxRef.current || idx < 0 || idx >= SLIDES.length) return;
      prevIdxRef.current = idx;
      setTextVisible(false);
      setTimeout(() => {
        setActiveIdx(idx);
        setDisplayedIdx(idx);
        setTextVisible(true);
      }, 200);
    };

    scroller.addEventListener('scroll', onScroll, { passive: true });
    return () => scroller.removeEventListener('scroll', onScroll);
  }, []);

  /* Keyboard navigation */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') scrollToSlide(Math.min(prevIdxRef.current + 1, SLIDES.length - 1));
      if (e.key === 'ArrowUp'   || e.key === 'ArrowLeft')  scrollToSlide(Math.max(prevIdxRef.current - 1, 0));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      {/* ── MOBILE MENU ── */}
      <div className={`menu-overlay${menuOpen ? ' menu-overlay--open' : ''}`}>
        <nav className="menu-overlay-nav">
          <a href="/"          className="nav-item square menu-item" onMouseEnter={playFx}><ST>About me</ST></a>
          <a href="/#cases"    className="nav-item pill   menu-item" onMouseEnter={playFx}><ST>Cases</ST></a>
          <a href="/#contacts" className="nav-item square menu-item" onMouseEnter={playFx}><ST>Contacts</ST></a>
          <button              className="nav-item pill   menu-item" onMouseEnter={playFx} onClick={downloadCV}><ST>My CV</ST></button>
        </nav>
        <div className="menu-overlay-footer">
          <div className="nav-item square menu-contact-chip menu-footer-item">Contact me</div>
          <div className="menu-social-links menu-footer-item">
            <a href="https://t.me/arsendsgn" target="_blank" className="menu-social-link">Telegram</a>
            <a href="https://www.linkedin.com/in/arsendsgn/" target="_blank" className="menu-social-link">LinkedIn</a>
          </div>
          <div className="menu-letter-chips menu-footer-item">
            <div className="nav-item square">send</div>
            <div className="nav-item pill">a letter</div>
          </div>
          <a href="mailto:arackelian.arsen@gmail.com" className="menu-email menu-footer-item">
            arackelian.arsen@gmail.com
          </a>
        </div>
        <span className="menu-copy">© 2026 Arsen Arakelyan</span>
      </div>

      {/* ── HEADER ── */}
      <SiteHeader
        backHref="/"
        menuOpen={menuOpen}
        onMenuToggle={() => setMenuOpen(p => !p)}
        playFx={playFx}
        navItems={[
          { label: 'About me', href: '/#about' },
          { label: 'Cases',    href: '/#cases',    pill: true },
          { label: 'Contacts', href: '/#contacts' },
          { label: 'My CV',    onClick: downloadCV, pill: true },
        ]}
      />

      {/* ── CASE LAYOUT ── */}
      <div className={styles.layout}>

        {/* LEFT PANEL */}
        <div className={styles.left}>
          <div className={styles.leftTop}>

            <div className={styles.titleRows}>
              <div className={styles.titleRow}>
                <div className={`tag square ${styles.caseTag}`} data-case-tag>
                  <span className={styles.caseTagText}>Sber</span>
                </div>
                <div className={`tag pill ${styles.caseTag}`} data-case-tag>
                  <span className={styles.caseTagText}>POS</span>
                </div>
              </div>
              <div className={styles.titleRow}>
                <div className={`tag square ${styles.caseTag}`} data-case-tag>
                  <span className={styles.caseTagText}>Terminal</span>
                </div>
              </div>
            </div>

            <div className={styles.subtitleBox} data-subtitle>
              <p className={styles.subtitle}>Pushing The POS Terminal<br />Beyond Payments</p>
            </div>

            <div className={styles.skillTags}>
              {['ux/ui design', 'research', 'usability testing', '3d animation', 'product design'].map((tag) => (
                <span key={tag} className="badge button" style={{ cursor: 'default' }} data-skill>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className={`${styles.leftDesc} ${!textVisible ? styles.leftDescHidden : ''}`}>
            <p>{SLIDES[displayedIdx].description}</p>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className={styles.right}>
          <div className={styles.dark} data-slide>

            {/* Snap-scroll container */}
            <div className={styles.scroller} ref={scrollerRef}>
              {SLIDES.map((slide, i) => (
                <div key={slide.id} className={styles.slide}>
                  {i === 0 ? (
                    <video
                      className={styles.slideVideo}
                      src={VIDEO_URL}
                      autoPlay loop muted playsInline
                    />
                  ) : (
                    <div className={styles.illustration} />
                  )}
                </div>
              ))}
            </div>

            {/* Counter overlay */}
            <div className={styles.counter}>
              <span className={styles.counterCurrent}>{String(activeIdx + 1).padStart(2, '0')}</span>
              <span className={styles.counterSep}>/</span>
              <span className={styles.counterTotal}>{String(SLIDES.length).padStart(2, '0')}</span>
            </div>

            {/* Dot indicators overlay */}
            <div className={styles.dots}>
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  className={`${styles.dot}${i === activeIdx ? ` ${styles.dotActive}` : ''}`}
                  onClick={() => scrollToSlide(i)}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

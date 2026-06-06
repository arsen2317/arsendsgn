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

export default function SberCase() {
  const [activeIdx, setActiveIdx]       = useState(0);
  const [displayedIdx, setDisplayedIdx] = useState(0);
  const [textVisible, setTextVisible]   = useState(true);
  const [menuOpen, setMenuOpen]         = useState(false);

  const lockRef      = useRef(false);
  const activeIdxRef = useRef(0);
  const wheelAccum   = useRef(0);
  const wheelTimer   = useRef(null);
  const fxRef        = useRef(null);
  const touchStartY  = useRef(null);

  const playFx = () => fxRef.current?.cloneNode().play().catch(() => {});

  const go = (nextIdx) => {
    if (lockRef.current) return;
    if (nextIdx < 0 || nextIdx >= SLIDES.length) return;
    lockRef.current = true;

    setTextVisible(false);
    setActiveIdx(nextIdx);
    activeIdxRef.current = nextIdx;

    setTimeout(() => {
      setDisplayedIdx(nextIdx);
      setTextVisible(true);
    }, 260);

    setTimeout(() => { lockRef.current = false; }, 950);
  };

  /* Full-viewport layout: remove body padding-top so right panel can reach the top */
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.paddingTop = '0';
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingTop = '';
    };
  }, []);

  /* Audio init */
  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
    const audio = new Audio(`${base}/fx.mp3`);
    fxRef.current = audio;
    const unlock = () => { audio.play().then(() => { audio.pause(); audio.currentTime = 0; }).catch(() => {}); };
    window.addEventListener('pointerdown', unlock, { once: true });
    return () => window.removeEventListener('pointerdown', unlock);
  }, []);

  /* GSAP entrance animation */
  useEffect(() => {
    let ctx;
    async function init() {
      const { gsap } = await import('gsap');
      ctx = gsap.context(() => {
        gsap.from('.header',        { y: -80, opacity: 0, duration: 0.7, ease: 'power3.out' });
        gsap.from('[data-case-tag]',{ y: 40,  opacity: 0, duration: 0.8, delay: 0.2, stagger: 0.08, ease: 'back.out(2)' });
        gsap.from('[data-subtitle]',{ y: 20,  opacity: 0, duration: 0.7, delay: 0.45, ease: 'power3.out' });
        gsap.from('[data-skill]',   { y: 16,  opacity: 0, duration: 0.6, delay: 0.55, stagger: 0.04, ease: 'power2.out' });
        gsap.from('[data-slide]',   { scale: 0.96, opacity: 0, duration: 1, delay: 0.3, ease: 'power3.out' });
      });
    }
    init();
    return () => ctx?.revert();
  }, []);

  /* Wheel snap */
  useEffect(() => {
    const norm = (e) => {
      if (e.deltaMode === 1) return e.deltaY * 16;
      if (e.deltaMode === 2) return e.deltaY * window.innerHeight;
      return e.deltaY;
    };
    const onWheel = (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      if (lockRef.current) { wheelAccum.current = 0; clearTimeout(wheelTimer.current); return; }
      clearTimeout(wheelTimer.current);
      wheelAccum.current += norm(e);
      wheelTimer.current = setTimeout(() => { wheelAccum.current = 0; }, 400);
      if (Math.abs(wheelAccum.current) >= 100) {
        const dir = wheelAccum.current > 0 ? 1 : -1;
        wheelAccum.current = 0;
        go(activeIdxRef.current + dir);
      }
    };
    window.addEventListener('wheel', onWheel, { passive: true });
    return () => window.removeEventListener('wheel', onWheel);
  }, []);

  /* Keyboard navigation */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') go(activeIdxRef.current + 1);
      if (e.key === 'ArrowUp'   || e.key === 'ArrowLeft')  go(activeIdxRef.current - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  /* Touch swipe */
  useEffect(() => {
    const onTouchStart = (e) => { touchStartY.current = e.touches[0].clientY; };
    const onTouchEnd = (e) => {
      if (touchStartY.current === null) return;
      const diff = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(diff) > 50) go(activeIdxRef.current + (diff > 0 ? 1 : -1));
      touchStartY.current = null;
    };
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend',   onTouchEnd,   { passive: true });
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend',   onTouchEnd);
    };
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

            {/* Title tags */}
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

            {/* Subtitle */}
            <div className={styles.subtitleBox} data-subtitle>
              <p className={styles.subtitle}>Pushing The POS Terminal<br />Beyond Payments</p>
            </div>

            {/* Skill tags */}
            <div className={styles.skillTags}>
              {['ux/ui design', 'research', 'usability testing', '3d animation', 'product design'].map((tag, i) => (
                <span key={tag} className="badge button" style={{ cursor: 'default' }} data-skill>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Description — changes per slide */}
          <div
            className={`${styles.leftDesc} ${!textVisible ? styles.leftDescHidden : ''}`}
            data-desc
          >
            <p>{SLIDES[displayedIdx].description}</p>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className={styles.right}>

          {/* Dark container */}
          <div className={styles.dark} data-slide>

            {/* Video fills entire dark block on slide 0 */}
            <video
              className={`${styles.bgVideo}${activeIdx === 0 ? ` ${styles.bgVideoVisible}` : ''}`}
              src="https://github.com/arsen2317/arsendsgn/releases/download/video/sber.video.mp4"
              autoPlay loop muted playsInline
            />

            {SLIDES.map((slide, i) => (
              <div
                key={slide.id}
                className={styles.slide}
                style={{
                  transform: `translateY(${(i - activeIdx) * 100}%)`,
                  opacity: i === activeIdx ? 1 : 0,
                }}
              >
                {i !== 0 && <div className={styles.illustration} />}
              </div>
            ))}

            {/* Slide counter */}
            <div className={styles.counter}>
              <span className={styles.counterCurrent}>{String(activeIdx + 1).padStart(2, '0')}</span>
              <span className={styles.counterSep}>/</span>
              <span className={styles.counterTotal}>{String(SLIDES.length).padStart(2, '0')}</span>
            </div>

            {/* Dot indicators */}
            <div className={styles.dots}>
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  className={`${styles.dot}${i === activeIdx ? ` ${styles.dotActive}` : ''}`}
                  onClick={() => go(i)}
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

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
      'Through field research, desk research, competitive analysis, and in-depth interviews it became clear that merchants transform payment terminals into part of their venue\'s atmosphere by decorating them and opting for custom stands. Customers love this personalization because it makes the payment experience brighter and more enjoyable.',
  },
  {
    id: 'concept',
    description:
      'The solution is a constructor for customizable POS. Through SberBusiness app, merchants can tailor the device by selecting body and interface colors, using interchangeable branded covers, creating personal mascots, and integrating tipping, loyalty, and cashback.',
  },
  {
    id: 'design',
    description:
      'To validate the idea, prototype thematic covers were created for various retail niches such as coffee shops, florists, and pet stores. These prototypes show how simple installation can be and how seamlessly the terminal can integrate into the venue\'s atmosphere.',
  },
  {
    id: 'outcome',
    description:
      "Pilot across 1 200 terminals in 4 regions. Task completion improved by 34 %. Merchant NPS rose from 41 to 68. The feature set is now in public beta across Sber's full terminal network.",
  },
];

const SKILL_TAGS = ['ux/ui design', 'research', 'usability testing', '3d animation', 'product design'];

const VIDEO_URL = '/sber.mp4';

export default function SberCase() {
  const [activeIdx, setActiveIdx]       = useState(0);
  const [displayedIdx, setDisplayedIdx] = useState(0);
  const [textVisible, setTextVisible]   = useState(true);
  const [menuOpen, setMenuOpen]         = useState(false);
  const [slideH, setSlideH]             = useState(0);
  const [isMobile, setIsMobile]         = useState(false);

  const rightRef     = useRef(null);
  const trackRef     = useRef(null);
  const activeIdxRef = useRef(0);
  const snapLockRef  = useRef(false);
  const offsetRef    = useRef(0);
  const fxRef        = useRef(null);

  const playFx = () => fxRef.current?.cloneNode().play().catch(() => {});

  /* Slide visuals — shared between the desktop snap track and the mobile scroll layout */
  const renderSlideMedia = (i) => {
    if (i === 0) {
      return (
        <div className={styles.dark}>
          <video
            className={styles.slideVideo}
            src={VIDEO_URL}
            autoPlay loop muted playsInline
            ref={el => { if (el) el.muted = true; }}
          />
        </div>
      );
    }
    if (i === 1) {
      return (
        <div className={styles.slideTwoCol}>
          <div className={styles.dark}>
            <img className={styles.slideImg} src="/images/sber-r1.png" alt="" />
          </div>
          <div className={styles.dark}>
            <img className={styles.slideImg} src="/images/sber-r2.png" alt="" />
          </div>
        </div>
      );
    }
    if (i === 2) {
      return (
        <div className={styles.dark} style={{ background: '#E1D7CB' }}>
          <div className={styles.slideTwoScreens}>
            <img className={styles.screenImg} src="/images/sber1.webp" alt="" />
            <img className={styles.screenImg} src="/images/sber2.webp" alt="" />
          </div>
        </div>
      );
    }
    if (i === 3) {
      return (
        <div className={styles.slideTwoCol}>
          <div className={styles.dark} style={{ background: '#E1D7CB' }}>
            <div className={styles.slideContent}>
              <div className={styles.phoneMockup}>
                <video
                  className={styles.mockupVideo}
                  src="/cases.mp4"
                  autoPlay loop muted playsInline
                  ref={el => { if (el) el.muted = true; }}
                />
                <img className={styles.phoneFrame} src="/images/iphoneframe.webp" alt="" />
              </div>
            </div>
          </div>
          <div className={styles.dark}>
            <img className={styles.slideImg} src="/images/sbercoffeshop.jpg" alt="" />
          </div>
        </div>
      );
    }
    return (
      <div className={styles.dark}>
        <div className={styles.slideContent}>
          <div className={styles.illustration} />
        </div>
      </div>
    );
  };

  /* ── Snap animation (same easing/lock pattern as main page) ── */
  const go = (nextIdx) => {
    if (snapLockRef.current) return;
    if (nextIdx < 0 || nextIdx >= SLIDES.length) return;
    const right = rightRef.current;
    const track = trackRef.current;
    if (!right || !track) return;

    snapLockRef.current = true;
    activeIdxRef.current = nextIdx;

    const startY   = offsetRef.current;
    const targetY  = -nextIdx * right.clientHeight;
    const duration = 900;
    const t0       = performance.now();
    const ease     = (t) => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2;

    setTextVisible(false);
    setTimeout(() => {
      setActiveIdx(nextIdx);
      setDisplayedIdx(nextIdx);
      setTextVisible(true);
    }, 200);

    const tick = (now) => {
      const t = Math.min((now - t0) / duration, 1);
      const y = startY + (targetY - startY) * ease(t);
      offsetRef.current = y;
      track.style.transform = `translateY(${y}px)`;
      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        offsetRef.current = targetY;
        track.style.transform = `translateY(${targetY}px)`;
        setTimeout(() => { snapLockRef.current = false; }, 80);
      }
    };
    requestAnimationFrame(tick);
  };

  /* Mobile breakpoint — switches to a plain scrolling layout, no fixed/snap pagination */
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)');
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  /* Slide height = right panel clientHeight, kept in sync via ResizeObserver */
  useEffect(() => {
    if (isMobile) return;
    const right = rightRef.current;
    if (!right) return;
    const sync = () => {
      setSlideH(right.clientHeight);
      // reposition track instantly on resize
      offsetRef.current = -activeIdxRef.current * right.clientHeight;
      if (trackRef.current) {
        trackRef.current.style.transform = `translateY(${offsetRef.current}px)`;
      }
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(right);
    return () => ro.disconnect();
  }, [isMobile]);

  /* Body overflow + padding reset — mobile uses normal page scroll */
  useEffect(() => {
    if (isMobile) return;
    document.body.style.overflow   = 'hidden';
    document.body.style.paddingTop = '0';
    return () => {
      document.body.style.overflow   = '';
      document.body.style.paddingTop = '';
    };
  }, [isMobile]);

  /* Audio unlock */
  useEffect(() => {
    const base  = process.env.NEXT_PUBLIC_BASE_PATH || '';
    const audio = new Audio(`${base}/fx.mp3`);
    fxRef.current = audio;
    const unlock = () => {
      audio.play().then(() => { audio.pause(); audio.currentTime = 0; }).catch(() => {});
    };
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

  /* Wheel snap — identical accumulator/lock pattern to main page (desktop only) */
  useEffect(() => {
    if (isMobile) return;
    const norm = (e) => {
      if (e.deltaMode === 1) return e.deltaY * 16;
      if (e.deltaMode === 2) return e.deltaY * window.innerHeight;
      return e.deltaY;
    };
    let wheelAccum  = 0;
    let resetId     = null;
    const onWheel = (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      if (snapLockRef.current) { wheelAccum = 0; clearTimeout(resetId); return; }
      clearTimeout(resetId);
      wheelAccum += norm(e);
      resetId = setTimeout(() => { wheelAccum = 0; }, 400);
      if (Math.abs(wheelAccum) >= 100) {
        go(activeIdxRef.current + (wheelAccum > 0 ? 1 : -1));
        wheelAccum = 0;
      }
    };
    window.addEventListener('wheel', onWheel, { passive: true });
    return () => window.removeEventListener('wheel', onWheel);
  }, [isMobile]);

  /* Keyboard (desktop only) */
  useEffect(() => {
    if (isMobile) return;
    const onKey = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') go(activeIdxRef.current + 1);
      if (e.key === 'ArrowUp'   || e.key === 'ArrowLeft')  go(activeIdxRef.current - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isMobile]);

  /* Touch swipe (desktop only — mobile uses normal scroll) */
  useEffect(() => {
    if (isMobile) return;
    let ty = null;
    const onStart = (e) => { ty = e.touches[0].clientY; };
    const onEnd   = (e) => {
      if (ty === null) return;
      const diff = ty - e.changedTouches[0].clientY;
      if (Math.abs(diff) > 50) go(activeIdxRef.current + (diff > 0 ? 1 : -1));
      ty = null;
    };
    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchend',   onEnd,   { passive: true });
    return () => {
      window.removeEventListener('touchstart', onStart);
      window.removeEventListener('touchend',   onEnd);
    };
  }, [isMobile]);

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

            <div className={styles.titleRow}>
              <div className={`tag square ${styles.caseTag}`} data-case-tag>
                <span className={styles.caseTagText}>Sber</span>
              </div>
              <div className={`tag pill ${styles.caseTag}`} data-case-tag>
                <span className={styles.caseTagText}>POS</span>
              </div>
              <div className={`tag square ${styles.caseTag}`} data-case-tag>
                <span className={styles.caseTagText}>Terminal</span>
              </div>
            </div>

            <div className={styles.subtitleBox} data-subtitle>
              <p className={styles.subtitle}>Pushing The POS Terminal<br />Beyond Payments</p>
            </div>

            <div className={`${styles.skillTags} ${styles.skillTagsDesktop}`}>
              {SKILL_TAGS.map((tag) => (
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

        {/* RIGHT PANEL — overflow:hidden, JS-driven translateY */}
        <div className={styles.right} ref={rightRef}>

          {/* Slides track */}
          <div className={styles.track} ref={trackRef} data-slide>
            {SLIDES.map((slide, i) => (
              <div
                key={slide.id}
                className={styles.slideWrapper}
                style={slideH ? { height: slideH } : undefined}
              >
                {renderSlideMedia(i)}
              </div>
            ))}
          </div>

          {/* Counter — stays fixed, outside track */}
          <div className={styles.counter}>
            <span className={styles.counterCurrent}>{String(activeIdx + 1).padStart(2, '0')}</span>
            <span className={styles.counterSep}>/</span>
            <span className={styles.counterTotal}>{String(SLIDES.length).padStart(2, '0')}</span>
          </div>

          {/* Dot indicators — stays fixed, outside track */}
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

        {/* MOBILE — plain scroll, alternating description / illustration, no fixed pagination */}
        <div className={styles.mobileSlides}>
          {SLIDES.map((slide, i) => (
            <div className={styles.mobileSlide} key={slide.id}>
              <div className={styles.mobileMedia}>{renderSlideMedia(i)}</div>

              {i === 0 && (
                <div className={`${styles.skillTags} ${styles.skillTagsMobile}`}>
                  {SKILL_TAGS.map((tag) => (
                    <span key={tag} className="badge button" style={{ cursor: 'default' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className={styles.mobileDesc}>
                <p>{slide.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

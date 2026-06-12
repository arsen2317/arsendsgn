'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './page.module.css';
import SiteHeader from '../../components/SiteHeader';
import Footer from '../../components/Footer';

const ST = ({ children }) => (
  <span className="st-wrap">
    <span className="st">
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  </span>
);

const CV_URL = 'https://github.com/arsen2317/arsendsgn/releases/download/cv/Arsen.Arakelyan.CV.eng.pdf';
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
      'T—J has an audience of 42 million readers, but less than 20% of them are T-Bank customers. The goal was to connect T—J and T-Bank through meaningful user scenarios without compromising the media platform’s trust. The focus was on the “Travel” section — one of the most popular and engaging on the platform.',
  },
  {
    id: 'research',
    description:
      'Research showed that authorization provided little value to users, the journey to bank products was too long, motivations varied from spontaneous to planned, and readers lacked simple tools to act on the inspiration from articles.',
  },
  {
    id: 'concept',
    description:
      'As a solution, we developed T-ID as a seamless authorization method that converts T—Journal readers into T-Bank customers by enhancing its appeal with new functionality and social features.',
  },
  {
    id: 'profile',
    description:
      'We created the “Geogenius” quiz game inspired by GeoGuessr, using real travel photos submitted by T—Journal readers in the travel section. Participation offered prizes and discounts, but required T-ID authorization — creating a soft and motivating entry point for registration.',
  },
  {
    id: 'editor',
    description:
      'A new Travel Hub became a vibrant community space for travelers, allowing users to check in during trips, share live streams and stories, create checklists, rate places, and track live cashback earned together with other participants.',
  },
  {
    id: 'matching',
    description:
      'Users can create and share their own travel plans in the Trip Planner — with curated selections based on personal interests, AI assistance trained on T—Journal content, and the ability to share plans with the community.',
  },
  {
    id: 'icebreaker',
    description:
      'For those who prefer not to plan trips themselves, we created ready-made travel plans by both users and the editorial team — complete with day-by-day plans, integrated ticket booking through T-Travel, and hotel reservations.',
  },
  {
    id: 'games',
    description:
      'The concept was first implemented and tested in the popular Travel section, with plans to scale the approach to other life scenarios supported by both T-Bank products and T—Journal content, eventually turning the platform into a universal life goals planner with seamless bank integration.',
  },
];

const SKILL_TAGS = ['ux/ui design', 'research', 'scaling concept', 'usability testing', 'illustration'];

/* Media frames for the desktop snap track — finer-grained than SLIDES, since
   the "editor" slide (index 4) is split into two scroll stops that share the
   same counter/description. */
const FRAME_TO_SLIDE = [0, 1, 2, 3, 4, 4, 5, 6, 7];

/* Mobile groups slides 1:1 with SLIDES — slide 4 (editor) shows both of its frames stacked */
const MOBILE_FRAME_GROUPS = [[0], [1], [2], [3], [4, 5], [6], [7], [8]];

const FRAME_MEDIA = [
  // 0 — tj1-1 + tj1-2, both pinned to the bottom (same principle as vibes slide 4, both bottom)
  () => (
    <div className={styles.dark} style={{ background: '#E1D7CB' }}>
      <div className={styles.profileScreens}>
        <img className={`${styles.screenImg} ${styles.profileImgBottom}`} src="/images/tj1-1.webp" alt="" />
        <img className={`${styles.screenImg} ${styles.profileImgBottom}`} src="/images/tj1-2.webp" alt="" />
      </div>
    </div>
  ),
  // 1 — single image
  () => (
    <div className={styles.dark} style={{ background: '#E1D7CB' }}>
      <div className={styles.slideContent}>
        <img className={styles.screenImg} src="/images/tj2.webp" alt="" />
      </div>
    </div>
  ),
  // 2 — single image, no drop-shadow
  () => (
    <div className={styles.dark} style={{ background: '#E1D7CB' }}>
      <div className={styles.slideContent}>
        <img className={`${styles.screenImg} ${styles.noShadow}`} src="/images/tj3.webp" alt="" />
      </div>
    </div>
  ),
  // 3 — three screens in a row
  () => (
    <div className={styles.dark} style={{ background: '#E1D7CB' }}>
      <div className={styles.slideThreeScreens}>
        <img className={styles.screenImg} src="/images/tj4-1.webp" alt="" />
        <img className={styles.screenImg} src="/images/tj4-2.webp" alt="" />
        <img className={styles.screenImg} src="/images/tj4-3.webp" alt="" />
      </div>
    </div>
  ),
  // 4 — editor, sub-slide A: single image pinned to the bottom
  () => (
    <div className={styles.dark} style={{ background: '#E1D7CB' }}>
      <img className={styles.editorImgBottom} src="/images/tj5-1.webp" alt="" />
    </div>
  ),
  // 5 — editor, sub-slide B: three screens in a row
  () => (
    <div className={styles.dark} style={{ background: '#E1D7CB' }}>
      <div className={styles.slideThreeScreens}>
        <img className={styles.screenImg} src="/images/tj5-2.webp" alt="" />
        <img className={styles.screenImg} src="/images/tj5-3.webp" alt="" />
        <img className={styles.screenImg} src="/images/tj5-4.webp" alt="" />
      </div>
    </div>
  ),
  // 6 — single image pinned to the bottom, same principle as frame 4
  () => (
    <div className={styles.dark} style={{ background: '#E1D7CB' }}>
      <img className={styles.editorImgBottom} src="/images/tj6-1.webp" alt="" />
    </div>
  ),
  // 7 — two images, left cropped ~15% off the top, right cropped ~15% off the bottom
  () => (
    <div className={styles.dark} style={{ background: '#E1D7CB' }}>
      <div className={styles.profileScreens}>
        <img className={`${styles.screenImg} ${styles.profileImgCropTop}`} src="/images/tj7-1.webp" alt="" />
        <img className={`${styles.screenImg} ${styles.profileImgCropBottom}`} src="/images/tj7-2.webp" alt="" />
      </div>
    </div>
  ),
  // 8 — two images side by side
  () => (
    <div className={styles.dark} style={{ background: '#E1D7CB' }}>
      <div className={styles.slideTwoScreens}>
        <img className={styles.screenImg} src="/images/tj8-1.webp" alt="" />
        <img className={styles.screenImg} src="/images/tj8-2.webp" alt="" />
      </div>
    </div>
  ),
];

export default function TjCase() {
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

  /* ── Snap animation (same easing/lock pattern as main page) ── */
  const go = (nextIdx) => {
    if (snapLockRef.current) return;
    if (nextIdx < 0 || nextIdx >= FRAME_TO_SLIDE.length) return;
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
                <span className={styles.caseTagText}>T-Bank</span>
              </div>
              <div className={`tag pill ${styles.caseTag}`} data-case-tag>
                <span className={styles.caseTagText}>Media</span>
              </div>
              <div className={`tag square ${styles.caseTag}`} data-case-tag>
                <span className={styles.caseTagText}>Platform</span>
              </div>
            </div>

            <div className={styles.subtitleBox} data-subtitle>
              <p className={styles.subtitle}>T-J — Linking<br />Content With Banking</p>
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
            <p>{SLIDES[FRAME_TO_SLIDE[displayedIdx]].description}</p>
          </div>
        </div>

        {/* RIGHT PANEL — overflow:hidden, JS-driven translateY */}
        <div className={styles.right} ref={rightRef}>

          {/* Slides track */}
          <div className={styles.track} ref={trackRef} data-slide>
            {FRAME_TO_SLIDE.map((slideIdx, i) => (
              <div
                key={i}
                className={styles.slideWrapper}
                style={slideH ? { height: slideH } : undefined}
              >
                {FRAME_MEDIA[i]()}
              </div>
            ))}
          </div>

          {/* Counter — stays fixed, outside track */}
          <div className={styles.counter}>
            <span className={styles.counterCurrent}>{String(FRAME_TO_SLIDE[activeIdx] + 1).padStart(2, '0')}</span>
            <span className={styles.counterSep}>/</span>
            <span className={styles.counterTotal}>{String(SLIDES.length).padStart(2, '0')}</span>
          </div>

        </div>

        {/* MOBILE — plain scroll, alternating description / illustration, no fixed pagination */}
        <div className={styles.mobileSlides}>
          {SLIDES.map((slide, i) => (
            <div className={styles.mobileSlide} key={slide.id}>
              <div className={styles.mobileMediaGroup}>
                {MOBILE_FRAME_GROUPS[i].map((frameIdx) => (
                  <div className={styles.mobileMedia} key={frameIdx}>{FRAME_MEDIA[frameIdx]()}</div>
                ))}
              </div>

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

      {/* Footer — mobile only, matches the homepage footer */}
      <div className={styles.mobileFooter}>
        <Footer />
      </div>
    </>
  );
}

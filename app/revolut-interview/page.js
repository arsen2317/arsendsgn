'use client';

import { useEffect, useRef, useState, Fragment } from 'react';
import styles from './page.module.css';
import SiteHeader from '../../components/SiteHeader';
import Footer from '../../components/Footer';
import RevolutSkills from '../../components/RevolutSkills';
import IterationsStack from '../../components/IterationsStack';

const ST = ({ children }) => (
  <span className="st-wrap">
    <span className="st">
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  </span>
);

const CV_URL = `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/Arsen.Arakelyan.CV.eng.pdf`;
const PROTOTYPE_URL = 'https://vacations-mts.vercel.app/en';
const downloadCV = () => {
  const a = document.createElement('a');
  a.href = CV_URL;
  a.target = '_blank';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const SBER_TAGS = [
  { text: 'Sber', shape: 'square' },
  { text: 'POS',  shape: 'pill' },
];

const MTS_TAGS = [
  { text: 'MTS',  shape: 'square' },
  { text: 'HR',   shape: 'pill' },
  { text: 'Tech', shape: 'square' },
];

const SLIDES = [
  {
    id: 'about',
    tags: [
      { text: 'Arsen',     shape: 'square' },
      { text: 'Arakelyan', shape: 'pill' },
    ],
    subtitle: 'Product Designer At MTS Fintech',
    skillTags: ['3 years experience', 'HR-tech', 'product design', 'graphic design background'],
    media: { type: 'video', src: '/MTSDengi.mp4' },
    description: [
      { p: 'I design HR Tech solutions that simplify internal processes.' },
      { p: 'With experience in both graphic and product design, I blend systemic thinking and understanding of human behavior, and keep developing new skills, including building interfaces in code.' },
    ],
  },
  {
    id: 'skills',
    tags: [
      { text: 'My',     shape: 'square' },
      { text: 'Skills', shape: 'pill' },
    ],
    subtitle: 'What Drives My Projects',
    skillTags: null,
    media: { type: 'skills-revolut' },
    description: [
      { p: 'I believe good design comes from seeing both the big picture and the small details.' },
      { list: ['Systemic + empathetic thinking', 'Learning agility', 'End-to-end ownership', 'Practical creativity', 'Strong communication'] },
    ],
  },
  {
    id: 'sber-context',
    tags: SBER_TAGS,
    subtitle: 'Pushing The POS Terminal\nBeyond Payments',
    skillTags: ['ux/ui design', 'research', 'usability testing', '3d animation', 'product design'],
    media: { type: 'image', src: '/images/sberRevolut3.png' },
    description: [
      { p: "Sber is Russia's largest acquiring provider with over 2 million payment terminals deployed across the country. The next challenge was to generate new value beyond the transaction itself." },
      { p: 'The initial brief was quite open-ended: explore ways to create additional value for merchants and customers through the payment terminal. I took ownership of defining the direction — from research to a concrete product concept.' },
    ],
  },
  {
    id: 'sber-research',
    tags: SBER_TAGS,
    subtitle: 'Research & Insights',
    skillTags: null,
    media: { type: 'twoCol', images: ['/images/sber-r1.png', '/images/sber-r2.png'] },
    description: [
      { p: 'Research: field research, in-depth interviews with merchants and customers, competitive analysis and desk research.' },
      { p: "Key Insight: merchants actively try to personalize their terminals (decorating them and using custom stands) to better fit their venue's atmosphere. Customers respond positively to more personalized and enjoyable payment experiences." },
      { p: 'This insight became the foundation for the solution.' },
    ],
  },
  {
    id: 'sber-solution-1',
    tags: SBER_TAGS,
    subtitle: 'Solution & Features',
    skillTags: null,
    media: { type: 'phoneAndImage' },
    description: [
      { p: 'Solution - a customizable POS platform accessible via the SberBusiness app, allowing merchants to:' },
      { list: ['Choose new colors', 'Use interchangeable branded covers and mascots', 'Add tipping, loyalty, and cashback features'] },
    ],
  },
  {
    id: 'sber-solution-2',
    tags: SBER_TAGS,
    subtitle: 'Solution & Features',
    skillTags: null,
    media: { type: 'threeScreens', images: ['/images/sber3.webp', '/images/sber4.webp', '/images/sber5.webp'] },
    description: [
      { p: 'Solution - a customizable POS platform accessible via the SberBusiness app, allowing merchants to:' },
      { list: ['Choose new colors', 'Use interchangeable branded covers and mascots', 'Add tipping, loyalty, and cashback features'] },
    ],
  },
  {
    id: 'sber-validation',
    tags: SBER_TAGS,
    subtitle: 'Validation & Execution',
    skillTags: null,
    media: { type: 'pilotGrid' },
    description: [
      { p: 'Validation:' },
      { list: ['Created thematic prototypes for different niches (coffee shops, florists, pet stores)', 'Developed 3D models and a physical test prototype of a branded cover', 'Designed seamless integration into the existing terminal interface'] },
      { p: 'Sber launched a live pilot with customized terminals installed in several Moscow retail locations.' },
    ],
  },
  {
    id: 'sber-pilot',
    tags: SBER_TAGS,
    subtitle: 'Pilot Results',
    skillTags: null,
    media: { type: 'video', src: '/sber.mp4' },
    description: [
      { p: 'Early metrics:' },
      { list: ['Higher tipping rates', 'Increased customer engagement with loyalty programs', 'Improved merchant satisfaction with terminal integration into their retail space'] },
    ],
  },
  {
    id: 'mts-context',
    tags: MTS_TAGS,
    subtitle: 'Vacation Planning Flow',
    skillTags: ['ux/ui design', 'research', 'usability testing', 'coded prototyping', 'developer handoff'],
    media: { type: 'image', src: '/images/vacationcover.png' },
    description: [
      { p: 'Situation: when I joined the bank, the internal HR platform had outdated and inconsistent design. The vacation planning process was especially fragmented and confusing for employees.' },
      { p: 'Task - completely rethink and unify the vacation planning experience to reduce confusion between different scenarios and make the process simple and transparent for both employees and managers.' },
    ],
  },
  {
    id: 'mts-research',
    tags: MTS_TAGS,
    subtitle: 'Research',
    skillTags: null,
    media: { type: 'twoRows', images: ['/images/as-is-1.png', '/images/as-is-2.png'] },
    description: [
      { p: 'Key Problems:' },
      { list: ['Different vacation scenarios lived on separate pages', 'Employees got confused between planned and unplanned vacation', 'Poor visual design and inconsistent UX across the platform', 'Legal nuances'] },
      { p: 'Research:' },
      { list: ['Conducted interviews with employees at different levels and managers who approve vacations', 'Analyzed industry benchmarks'] },
    ],
  },
  {
    id: 'mts-design',
    tags: MTS_TAGS,
    subtitle: 'Design Process & Iterations',
    skillTags: null,
    media: { type: 'iterations' },
    description: [
      { p: 'I ran multiple iterations exploring different approaches.' },
      { p: 'The main challenge was the high number of variations in user scenarios combined with legal restrictions. It was important not only to design a clean interface, but also to clearly communicate complex rules to users.' },
    ],
  },
  {
    id: 'mts-prototype',
    tags: MTS_TAGS,
    subtitle: 'Coded Prototype',
    skillTags: null,
    media: { type: 'prototype-cta' },
    description: [
      { p: 'Instead of handing over a complex Figma layout with many states, I took the initiative to build a fully functional prototype in code.' },
      { p: 'Why I did it:' },
      { list: ['Allowed us to test the solution quickly with real users before development', 'Made it much easier for developers to understand the intended behavior', 'Saved development resources by reducing ambiguity'] },
      { p: 'This approach helped us gather feedback early and iterate before the handoff.' },
    ],
  },
  {
    id: 'mts-impact',
    tags: MTS_TAGS,
    subtitle: 'Result & Impact',
    skillTags: null,
    media: { type: 'imageContained', src: '/images/21.png' },
    description: [
      { p: 'Key Outcomes' },
      { list: ['Reduced time to complete vacation planning requests by 35%', 'Decreased number of incorrect vacation requests by ~12%', 'Noticeable reduction in questions to HRBP regarding the vacation planning process', 'Faster and higher-quality handoff to development thanks to the interactive coded prototype'] },
    ],
  },
  {
    id: 'why-revolut',
    tags: [
      { text: 'Why',     shape: 'square' },
      { text: 'Revolut', shape: 'pill' },
    ],
    subtitle: null,
    skillTags: null,
    media: { type: 'revolut-outro' },
    description: [
      { p: "Revolut's combination of high ownership, fast iteration, and ambition to simplify complex financial experiences at massive scale feels like the right place for me to grow and contribute. I'm excited by the opportunity to work in small, autonomous teams where good ideas can move quickly from concept to real users." },
    ],
  },
];

/* Words cycled through the "Because It's ___" tag on the closing slide */
const OUTRO_WORDS = ['Cool', 'Fun', 'Mindblowing', '10x', 'Huge', 'My Dream', 'Unmatched', 'Awesome'];

/* Render a slide's description blocks — plain paragraphs and bullet lists */
const renderDescription = (blocks) => blocks.map((block, i) => (
  block.list ? (
    <ul className={styles.descList} key={i}>
      {block.list.map((item, j) => <li key={j}>{item}</li>)}
    </ul>
  ) : (
    <p key={i}>{block.p}</p>
  )
));

/* Render a subtitle string, splitting on \n into <br />-separated lines */
const renderSubtitle = (subtitle) => subtitle.split('\n').map((line, i, arr) => (
  <Fragment key={i}>
    {line}
    {i < arr.length - 1 && <br />}
  </Fragment>
));

export default function RevolutInterviewCase() {
  const [activeIdx, setActiveIdx]       = useState(0);
  const [displayedIdx, setDisplayedIdx] = useState(0);
  const [textVisible, setTextVisible]   = useState(true);
  const [menuOpen, setMenuOpen]         = useState(false);
  const [slideH, setSlideH]             = useState(0);
  const [isMobile, setIsMobile]         = useState(false);
  const [outroWord, setOutroWord]       = useState(OUTRO_WORDS[0]);
  const [outroFade, setOutroFade]       = useState(false);

  const rightRef     = useRef(null);
  const trackRef     = useRef(null);
  const activeIdxRef = useRef(0);
  const snapLockRef  = useRef(false);
  const offsetRef    = useRef(0);
  const fxRef        = useRef(null);
  const outroIdxRef  = useRef(0);

  const playFx = () => fxRef.current?.cloneNode().play().catch(() => {});

  /* Slide visuals — driven by each slide's `media` descriptor */
  const renderSlideMedia = (media) => {
    switch (media?.type) {
      case 'video':
        return (
          <div className={styles.dark}>
            <video
              className={styles.slideVideo}
              autoPlay loop muted playsInline
              ref={el => { if (el) el.muted = true; }}
            >
              <source src={media.src.replace(/\.mp4$/, '-mobile.mp4')} media="(max-width: 900px)" />
              <source src={media.src} />
            </video>
          </div>
        );
      case 'image':
        return (
          <div className={styles.dark}>
            <img className={styles.slideImg} src={media.src} alt="" />
          </div>
        );
      case 'imageContained':
        return (
          <div className={styles.dark}>
            <div className={styles.slideContent}>
              <img className={styles.screenImg} src={media.src} alt="" />
            </div>
          </div>
        );
      case 'twoCol':
        return (
          <div className={styles.slideTwoCol}>
            {media.images.map((src, i) => (
              <div className={styles.dark} key={i}>
                <img className={styles.slideImg} src={src} alt="" />
              </div>
            ))}
          </div>
        );
      case 'phoneAndImage':
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
      case 'threeScreens':
        return (
          <div className={styles.dark} style={{ background: '#E1D7CB' }}>
            <div className={styles.slideThreeScreens}>
              {media.images.map((src, i) => (
                <img className={styles.screenImg} src={src} key={i} alt="" />
              ))}
            </div>
          </div>
        );
      case 'pilotGrid':
        return (
          <div className={styles.pilotGrid}>
            <div className={styles.dark}>
              <img className={`${styles.slideImg} ${styles.pilotImgTop}`} src="/images/EFNNGKMONtsws22lHnxN.jpg.webp" alt="" />
            </div>
            <div className={styles.dark}>
              <img className={styles.slideImg} src="/images/photo_5361653863582208166_y.jpg" alt="" />
            </div>
            <div className={styles.dark}>
              <img className={`${styles.slideImg} ${styles.pilotImgUpper}`} src="/images/photo_5361653863582208164_y.jpg" alt="" />
            </div>
            <div className={styles.dark}>
              <img className={styles.slideImg} src="/images/photo_5361653863582208165_y.jpg" alt="" />
            </div>
          </div>
        );
      case 'twoRows':
        return (
          <div className={styles.dark}>
            <div className={styles.slideTwoRows}>
              {media.images.map((src, i) => (
                <img className={styles.rowImg} src={src} key={i} alt="" />
              ))}
            </div>
          </div>
        );
      case 'iterations':
        return (
          <div className={styles.dark}>
            <IterationsStack />
          </div>
        );
      case 'prototype-cta':
        return (
          <div className={styles.dark}>
            <div className={styles.slideContent}>
              <a
                className={styles.prototypeBtn}
                href={PROTOTYPE_URL}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={playFx}
              >
                Explore Prototype
                <span className={styles.prototypeBtnArrow} aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        );
      case 'skills-revolut':
        return (
          <div className={styles.dark}>
            <RevolutSkills />
          </div>
        );
      case 'revolut-outro':
        return (
          <div className={styles.dark} style={{ background: '#000000' }}>
            <div className={styles.outro}>
              <img className={styles.outroLogo} src="/images/Revolut-logo.svg" alt="Revolut" />
              <div className={styles.outroRow}>
                <span className={`tag square ${styles.outroTag}`}>Because</span>
                <span className={`tag pill ${styles.outroTag}`}>It&apos;s</span>
                <span className={`tag square ${styles.outroTag} ${styles.outroCycling}${outroFade ? ' ' + styles.outroFade : ''}`}>
                  {outroWord}
                </span>
              </div>
            </div>
          </div>
        );
      default:
        return <div className={styles.dark} />;
    }
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

  /* Cycle the "Because It's ___" word on the closing slide, same fade pattern as the footer */
  useEffect(() => {
    const t = setInterval(() => {
      setOutroFade(true);
      setTimeout(() => {
        outroIdxRef.current = (outroIdxRef.current + 1) % OUTRO_WORDS.length;
        setOutroWord(OUTRO_WORDS[outroIdxRef.current]);
        setOutroFade(false);
      }, 300);
    }, 2000);
    return () => clearInterval(t);
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

  const activeSlide = SLIDES[displayedIdx];

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
          <div className={`${styles.leftTop} ${!textVisible ? styles.leftDescHidden : ''}`}>

            <div className={styles.titleRow}>
              {activeSlide.tags.map((tag, i) => (
                <div key={i} className={`tag ${tag.shape} ${styles.caseTag}`} data-case-tag>
                  <span className={styles.caseTagText}>{tag.text}</span>
                </div>
              ))}
            </div>

            {activeSlide.subtitle && (
              <div className={styles.subtitleBox} data-subtitle>
                <p className={styles.subtitle}>{renderSubtitle(activeSlide.subtitle)}</p>
              </div>
            )}

            {activeSlide.skillTags && (
              <div className={`${styles.skillTags} ${styles.skillTagsDesktop}`}>
                {activeSlide.skillTags.map((tag) => (
                  <span key={tag} className="badge button" style={{ cursor: 'default' }} data-skill>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className={`${styles.leftDesc} ${!textVisible ? styles.leftDescHidden : ''}`}>
            {renderDescription(activeSlide.description)}
          </div>
        </div>

        {/* RIGHT PANEL — overflow:hidden, JS-driven translateY */}
        <div className={styles.right} ref={rightRef}>

          {/* Slides track */}
          <div className={styles.track} ref={trackRef} data-slide>
            {SLIDES.map((slide) => (
              <div
                key={slide.id}
                className={styles.slideWrapper}
                style={slideH ? { height: slideH } : undefined}
              >
                {renderSlideMedia(slide.media)}
              </div>
            ))}
          </div>

          {/* Counter — stays fixed, outside track */}
          <div className={styles.counter}>
            <span className={styles.counterCurrent}>{String(activeIdx + 1).padStart(2, '0')}</span>
            <span className={styles.counterSep}>/</span>
            <span className={styles.counterTotal}>{String(SLIDES.length).padStart(2, '0')}</span>
          </div>

        </div>

        {/* MOBILE — plain scroll, alternating description / illustration, no fixed pagination */}
        <div className={styles.mobileSlides}>
          {SLIDES.map((slide) => (
            <div className={styles.mobileSlide} key={slide.id}>
              <div className={styles.mobileMedia}>{renderSlideMedia(slide.media)}</div>

              {slide.skillTags && (
                <div className={`${styles.skillTags} ${styles.skillTagsMobile}`}>
                  {slide.skillTags.map((tag) => (
                    <span key={tag} className="badge button" style={{ cursor: 'default' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className={styles.mobileDesc}>
                {renderDescription(slide.description)}
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

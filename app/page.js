'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Skills from '../components/Skills';
import SiteHeader from '../components/SiteHeader';
import { useLang } from '../context/LangContext';
import { t } from '../lib/i18n';

const PortraitScene = dynamic(() => import('../components/PortraitScene'), { ssr: false });

/* Set a <video> element's src imperatively in its ref callback (client-only)
   instead of via a src prop, so the server-rendered HTML carries NO video src.
   Otherwise the browser's preload scanner grabs the desktop file from the SSR
   HTML before JS runs, and once isMobile flips it fetches the mobile file too —
   phones ended up downloading both the 3.4MB desktop clip AND the mobile one. */
const attachVideoSrc = (el, mobileSrc, desktopSrc) => {
  if (!el) return;
  el.muted = true;
  el.src = window.matchMedia('(max-width: 900px)').matches ? mobileSrc : desktopSrc;
  el.play().catch(() => {});
};

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

const SAY_HI = ['Say Hi', 'Привет', 'こんにちは', 'Hola', 'Bonjour', 'Ciao', 'Olá', '你好', '안녕', 'Hallo', 'مرحبا', 'Shalom'];

// Footer cycling words are now sourced from i18n via useLang()

const CURSORS = ['sheep', 'cat'];

const COMMAND_NAMES = ['about', 'cases', 'contacts', 'draw', 'cursor', 'noire', 'negative', 'reset', 'close'];

const ST = ({ children }) => (
  <span className="st-wrap">
    <span className="st">
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  </span>
);

export default function Home() {
  const { lang } = useLang();
  const tr = t[lang];

  const WORDS_1 = t.en.footer.word1;
  const WORDS_2 = t.en.footer.word2;

  const [word1, setWord1] = useState(WORDS_1[0]);
  const [word2, setWord2] = useState(WORDS_2[0]);
  const [fade1, setFade1] = useState(false);
  const [fade2, setFade2] = useState(false);
  const [sayHiWord, setSayHiWord] = useState(SAY_HI[0]);
  const [sayHiFade, setSayHiFade] = useState(false);
  const sayHiIdx = useRef(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [terminalInput, setTerminalInput] = useState('');
  const [drawMode, setDrawMode] = useState(false);
  const [cursorMode, setCursorMode] = useState(null); // null | 'cat' | 'nyan'
  const [filterMode, setFilterMode] = useState(null); // null | 'noire' | 'negative'
  const [musicOpen, setMusicOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const musicOpenRef = useRef(false);
  const musicWasOpenRef = useRef(false);
  const spotifyControllerRef = useRef(null);
  const spotifyEmbedRef = useRef(null);
  const idx1 = useRef(0);
  const idx2 = useRef(0);
  const lenisRef = useRef(null);
  const terminalInputRef = useRef(null);
  const terminalOpenRef = useRef(false);
  const drawModeRef = useRef(false);
  const drawingCanvasRef = useRef(null);
  const strokesRef = useRef([]);
  const fxRef = useRef(null);
  const noireRef = useRef(null);
  const drawMusicRef = useRef(null);
  const fahhRef = useRef(null);
  const navRef = useRef(null);
  const fakeCursorRef = useRef(null);
  const terminalRef = useRef(null);
  const bgVideosRef = useRef(new Set());

  const toggleMenu = () => setMenuOpen(prev => !prev);

  /* Mobile/desktop video src switching is done in JS (matchMedia), not via
     <source media="..."> — that attribute is unreliable on <video>: Chrome
     ignores media queries on <source> entirely, Firefox doesn't recognize
     the attribute at all, and the current HTML spec says media/srcset/sizes
     "must not be present" when the source's parent is a media element. */
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)');
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
    const audio = new Audio(`${base}/fx.mp3`);
    fxRef.current = audio;

    const unlock = () => {
      audio.play().then(() => { audio.pause(); audio.currentTime = 0; }).catch(() => {});
    };
    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, []);

  const playFx = () => {
    if (!fxRef.current) return;
    fxRef.current.cloneNode().play().catch(() => {});
  };

  /* noire/draw/fahh are rarely used — fetch them on first actual use instead of on every page load */
  const getNoireAudio = () => {
    if (!noireRef.current) {
      const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
      const a = new Audio(`${base}/noire.mp3`);
      a.loop = true;
      noireRef.current = a;
    }
    return noireRef.current;
  };
  const getDrawMusic = () => {
    if (!drawMusicRef.current) {
      const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
      const a = new Audio(`${base}/draw.mp3`);
      a.loop = true;
      drawMusicRef.current = a;
    }
    return drawMusicRef.current;
  };
  const getFahhAudio = () => {
    if (!fahhRef.current) {
      const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
      fahhRef.current = new Audio(`${base}/fahh.mp3`);
    }
    return fahhRef.current;
  };

  /* Filter mode audio effects */
  useEffect(() => {
    if (filterMode === 'noire') {
      const noire = getNoireAudio();
      noire.currentTime = 0;
      noire.play().catch(() => {});
    } else if (noireRef.current) {
      noireRef.current.pause();
      noireRef.current.currentTime = 0;
    }
    if (filterMode === 'negative') {
      const a = getFahhAudio();
      a.currentTime = 0;
      a.play().catch(() => {});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterMode]);

  /* Draw mode music */
  useEffect(() => {
    if (drawMode) {
      const music = getDrawMusic();
      music.currentTime = 0;
      music.play().catch(() => {});
    } else if (drawMusicRef.current) {
      drawMusicRef.current.pause();
      drawMusicRef.current.currentTime = 0;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawMode]);

  useEffect(() => { musicOpenRef.current = musicOpen; }, [musicOpen]);

  /* Pause Spotify when noire/draw mode activates, resume when they end */
  useEffect(() => {
    const modeActive = drawMode || filterMode === 'noire';
    if (modeActive && musicOpenRef.current) {
      musicWasOpenRef.current = true;
      setMusicOpen(false);
      spotifyControllerRef.current?.pause();
    } else if (!modeActive && musicWasOpenRef.current) {
      musicWasOpenRef.current = false;
      setMusicOpen(true);
      spotifyControllerRef.current?.play();
    }
  }, [drawMode, filterMode]);

  /* Initialize Spotify Iframe API on first open, resume on subsequent opens */
  useEffect(() => {
    if (!musicOpen) return;
    if (spotifyControllerRef.current) {
      spotifyControllerRef.current.play();
      return;
    }
    const init = (IFrameAPI) => {
      const el = spotifyEmbedRef.current;
      if (!el) return;
      IFrameAPI.createController(
        el,
        { uri: 'spotify:playlist:547c61BMeSUKljC7E4sdEG', width: '100%', height: '152' },
        (ctrl) => { spotifyControllerRef.current = ctrl; ctrl.play(); }
      );
    };
    if (window.SpotifyIframeApi) { init(window.SpotifyIframeApi); return; }
    window.onSpotifyIframeApiReady = init;
    const s = document.createElement('script');
    s.src = 'https://open.spotify.com/embed/iframe-api/v1';
    s.async = true;
    document.head.appendChild(s);
  }, [musicOpen]);

  const clearCanvas = () => {
    strokesRef.current = [];
    const c = drawingCanvasRef.current;
    if (c) c.getContext('2d').clearRect(0, 0, c.width, c.height);
  };

  const executeCommand = (cmd) => {
    switch (cmd) {
      case 'about':    scrollToSection('#about');    setTerminalOpen(false); break;
      case 'cases':    scrollToSection('#cases');    setTerminalOpen(false); break;
      case 'contacts': scrollToSection('#contacts'); setTerminalOpen(false); break;
      case 'draw':     setDrawMode(true);  setTerminalOpen(false); break;
      case 'cursor': {
        const arg = cmd.split(/\s+/)[1];
        if (arg === 'rainbowsheep') { setCursorMode('sheep'); break; }
        if (arg === 'slappingcat')  { setCursorMode('cat');   break; }
        // no arg → random (or toggle off if already active)
        if (cursorMode) { setCursorMode(null); break; }
        const pick = CURSORS[Math.floor(Math.random() * CURSORS.length)];
        setCursorMode(pick);
        break;
      }
      case 'noire':
        if (filterMode === 'noire') { document.documentElement.style.filter = ''; setFilterMode(null); }
        else { document.documentElement.style.filter = 'grayscale(1)'; setFilterMode('noire'); }
        break;
      case 'negative':
        if (filterMode === 'negative') { document.documentElement.style.filter = ''; setFilterMode(null); }
        else { document.documentElement.style.filter = 'invert(1)'; setFilterMode('negative'); }
        break;
      case 'reset':
        document.documentElement.style.filter = '';
        setDrawMode(false); clearCanvas();
        setCursorMode(null);
        setFilterMode(null);
        break;
      case 'close':    setTerminalOpen(false); break;
    }
    setTerminalInput('');
  };

  const scrollToSection = (id) => {
    setMenuOpen(false);
    // Wait for menu fade-out (300ms) before scrolling
    setTimeout(() => {
      lenisRef.current?.scrollTo(id, { duration: 1.2 });
    }, 350);
  };

  /* Lock/unlock Lenis scroll when menu opens */
  useEffect(() => {
    if (menuOpen) {
      lenisRef.current?.stop();
    } else {
      lenisRef.current?.start();
    }
  }, [menuOpen]);

  /* Sync terminal ref + focus input on open */
  useEffect(() => {
    terminalOpenRef.current = terminalOpen;
    if (terminalOpen) setTimeout(() => terminalInputRef.current?.focus(), 320);
  }, [terminalOpen]);

  /* Close terminal on click outside */
  useEffect(() => {
    const handleOutside = (e) => {
      if (!terminalOpenRef.current) return;
      if (e.target.closest('.header-hint')) return;
      if (terminalRef.current && !terminalRef.current.contains(e.target)) {
        setTerminalOpen(false);
      }
    };
    window.addEventListener('pointerdown', handleOutside);
    return () => window.removeEventListener('pointerdown', handleOutside);
  }, []);

  /* Sync draw mode ref */
  useEffect(() => { drawModeRef.current = drawMode; }, [drawMode]);

  /* "/" key opens terminal; ESC exits draw mode first, then terminal */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Slash' && !e.metaKey && !e.ctrlKey && !terminalOpenRef.current && !drawModeRef.current && !e.target.matches('input, textarea')) {
        e.preventDefault();
        setTerminalOpen(true);
      } else if (e.key === 'Escape') {
        if (drawModeRef.current) {
          setDrawMode(false);
          clearCanvas();
        } else if (terminalOpenRef.current) {
          setTerminalOpen(false);
        } else {
          document.documentElement.style.filter = '';
          setCursorMode(null);
          setFilterMode(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  /* Drawing canvas — strokes stored in page coords, re-rendered on scroll */
  useEffect(() => {
    const canvas = drawingCanvasRef.current;
    if (!canvas) return;
    if (!drawMode) { canvas.style.pointerEvents = 'none'; return; }

    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.pointerEvents = 'all';

    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 14;
    ctx.lineCap   = 'round';
    ctx.lineJoin  = 'round';

    const strokes = strokesRef.current;

    const render = () => {
      const sx = window.scrollX;
      const sy = window.scrollY;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'rgba(255, 229, 0, 0.88)';
      strokes.forEach((stroke) => {
        if (stroke.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(stroke[0].x - sx, stroke[0].y - sy);
        for (let i = 1; i < stroke.length; i++) {
          ctx.lineTo(stroke[i].x - sx, stroke[i].y - sy);
        }
        ctx.stroke();
      });
    };

    // Page coords = client coords + scroll offset
    const pos = (e) => {
      if (e.touches) return { x: e.touches[0].clientX + window.scrollX, y: e.touches[0].clientY + window.scrollY };
      return { x: e.clientX + window.scrollX, y: e.clientY + window.scrollY };
    };

    let currentStroke = null;
    const start = (e) => { currentStroke = [pos(e)]; strokes.push(currentStroke); e.preventDefault(); };
    const draw  = (e) => {
      if (!currentStroke) return; e.preventDefault();
      currentStroke.push(pos(e));
      render();
    };
    const stop  = () => { currentStroke = null; };
    const onScroll = () => render();

    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup',   stop);
    canvas.addEventListener('mouseleave', stop);
    canvas.addEventListener('touchstart', start, { passive: false });
    canvas.addEventListener('touchmove',  draw,  { passive: false });
    canvas.addEventListener('touchend',   stop);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      canvas.removeEventListener('mousedown', start);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup',   stop);
      canvas.removeEventListener('mouseleave', stop);
      canvas.removeEventListener('touchstart', start);
      canvas.removeEventListener('touchmove',  draw);
      canvas.removeEventListener('touchend',   stop);
      window.removeEventListener('scroll', onScroll);
    };
  }, [drawMode]);

  /* Custom cursor — fake cursor div follows mouse */
  useEffect(() => {
    const el = fakeCursorRef.current;
    if (!el) return;

    if (!cursorMode) {
      el.style.display = 'none';
      document.documentElement.classList.remove('custom-cursor-active');
      return;
    }

    const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
    const cursors = {
      sheep: { src: `${base}/cursors/rainbow-sheep.gif`, size: 36 },
      cat:   { src: `${base}/cursors/slapping-cat.gif`,  size: 40 },
    };
    const { src, size } = cursors[cursorMode] || cursors.sheep;

    el.style.width  = size + 'px';
    el.style.height = size + 'px';
    el.style.display = 'block';
    const img = el.querySelector('img');
    if (img) img.src = src;

    document.documentElement.classList.add('custom-cursor-active');

    const onMove = (e) => {
      el.style.left = e.clientX + 'px';
      el.style.top  = e.clientY + 'px';
    };

    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      el.style.display = 'none';
      document.documentElement.classList.remove('custom-cursor-active');
    };
  }, [cursorMode]);

  /* Reset cycling words when language changes */
  useEffect(() => {
    idx1.current = 0;
    idx2.current = 0;
    setWord1(WORDS_1[0]);
    setWord2(WORDS_2[0]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  /* Cycling footer words — restarts when lang changes to use new word list */
  useEffect(() => {
    let turn = 0;
    const timer = setInterval(() => {
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
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSayHiFade(true);
      setTimeout(() => {
        sayHiIdx.current = (sayHiIdx.current + 1) % SAY_HI.length;
        setSayHiWord(SAY_HI[sayHiIdx.current]);
        setSayHiFade(false);
      }, 200);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  /* Lenis + GSAP */
  useEffect(() => {
    let lenis;
    let onSnapWheel;

    async function init() {
      const { default: Lenis }    = await import('lenis');
      const { gsap }              = await import('gsap');

      lenis = new Lenis();
      lenisRef.current = lenis;
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);

      // ── Section snap ──────────────────────────────────────
      const SNAP_IDS = ['#hero', '#about', '#cases', '#skills'];
      let snapLock = false;
      let wheelAccum = 0;
      let wheelResetId = null;

      // Normalize delta across deltaMode (Firefox uses lines, not pixels)
      const normDelta = (e) => {
        if (e.deltaMode === 1) return e.deltaY * 16;
        if (e.deltaMode === 2) return e.deltaY * window.innerHeight;
        return e.deltaY;
      };

      const getActiveIdx = () => {
        const trigger = window.innerHeight * 0.4;
        const els = SNAP_IDS.map(s => document.querySelector(s)).filter(Boolean);
        for (let i = els.length - 1; i >= 0; i--) {
          if (els[i].getBoundingClientRect().top <= trigger) return i;
        }
        return 0;
      };

      const snapTo = (dir) => {
        if (snapLock) return;
        const els = SNAP_IDS.map(s => document.querySelector(s)).filter(Boolean);
        const next = getActiveIdx() + dir;
        if (next < 0 || next >= els.length) return;
        snapLock = true;
        lenis.stop();
        const startY = window.scrollY;
        // Hero (idx 0) always snaps to absolute top
        const targetY = next === 0
          ? 0
          : Math.round(els[next].getBoundingClientRect().top + startY);
        const duration = 900;
        const startTime = performance.now();
        const ease = (t) => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2;
        const tick = (now) => {
          const t = Math.min((now - startTime) / duration, 1);
          window.scrollTo(0, startY + (targetY - startY) * ease(t));
          if (t < 1) {
            requestAnimationFrame(tick);
          } else {
            // Lock final position before re-enabling Lenis so trackpad
            // momentum events don't cause a small inertial overshoot
            window.scrollTo(0, targetY);
            setTimeout(() => { lenis.start(); snapLock = false; }, 80);
          }
        };
        requestAnimationFrame(tick);
      };

      onSnapWheel = (e) => {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
        // While snap is animating, drain the accumulator so the gesture
        // can't pre-charge a second snap before the lock releases
        if (snapLock) {
          wheelAccum = 0;
          clearTimeout(wheelResetId);
          return;
        }
        clearTimeout(wheelResetId);
        wheelAccum += normDelta(e);
        wheelResetId = setTimeout(() => { wheelAccum = 0; }, 400);
        if (Math.abs(wheelAccum) >= 100) {
          snapTo(wheelAccum > 0 ? 1 : -1);
          wheelAccum = 0;
        }
      };
      window.addEventListener('wheel', onSnapWheel, { passive: true });
    }

    // ── Theme-color for iOS status bar ────────────────────
    const themeMetaEl = document.querySelector('meta[name="theme-color"]');
    if (themeMetaEl) {
      const darkObs = new IntersectionObserver(
        ([e]) => { themeMetaEl.content = e.isIntersecting ? '#111111' : '#faf6ef'; },
        { threshold: 0.3 }
      );
      const darkSection = document.getElementById('about');
      if (darkSection) darkObs.observe(darkSection);
    }

    init();

    return () => {
      lenis?.destroy();
      if (onSnapWheel) window.removeEventListener('wheel', onSnapWheel);
    };
  }, []);

  /* Entrance reveal — CSS-driven (see .header/.portrait-wrap/etc in globals.css)
     instead of gsap.from(opacity:0,...): a JS tween interrupted mid-flight (tab
     backgrounded, rAF throttled) can leave elements stuck invisible forever; a
     CSS transition always reaches its committed end state once the class lands. */
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      document.documentElement.classList.add('entrance-ready');
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  /* Scroll-triggered reveals (about section + work grid) — IntersectionObserver
     instead of ScrollTrigger, which needs an explicit refresh() after any late
     layout shift (video/font load, mobile URL-bar collapse) or its cached
     trigger positions go stale and the reveal never fires. */
  useEffect(() => {
    const targets = ['.dark-section', '.dark-row', '.work-grid'];
    const observers = targets.map((selector) => {
      const el = document.querySelector(selector);
      if (!el) return null;
      const io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) { el.classList.add('is-visible'); io.disconnect(); }
      }, { threshold: 0.2 });
      io.observe(el);
      return io;
    });
    return () => observers.forEach((io) => io?.disconnect());
  }, []);

  /* Pause background videos once they scroll out of view — several autoplay
     at once on mount otherwise, which overloads the decoder on iOS Safari */
  useEffect(() => {
    const videos = Array.from(bgVideosRef.current);
    if (!videos.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const v = entry.target;
        if (entry.isIntersecting) v.play().catch(() => {});
        else v.pause();
      });
    }, { threshold: 0.15 });
    videos.forEach((v) => io.observe(v));
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/* ── MOBILE MENU OVERLAY ── */}
      <div className={`menu-overlay${menuOpen ? ' menu-overlay--open' : ''}`}>
        <nav className="menu-overlay-nav">
          <button className="nav-item square menu-item" onClick={() => scrollToSection('#about')} onMouseEnter={playFx}><ST>{tr.nav.about}</ST></button>
          <button className="nav-item pill   menu-item" onClick={() => scrollToSection('#cases')} onMouseEnter={playFx}><ST>{tr.nav.cases}</ST></button>
          <button className="nav-item square menu-item" onClick={() => scrollToSection('#contacts')} onMouseEnter={playFx}><ST>{tr.nav.contacts}</ST></button>
          <button className="nav-item pill menu-item" onMouseEnter={playFx} onClick={() => downloadCV(lang)}><ST>{tr.nav.cv}</ST></button>
        </nav>

        <div className="menu-overlay-footer">
          <div className="nav-item square menu-contact-chip menu-footer-item">{tr.menu.contactMe}</div>
          <div className="menu-social-links menu-footer-item">
            <a href="https://t.me/arsendsgn" target="_blank" className="menu-social-link">Telegram</a>
            <a href="#" className="menu-social-link">LinkedIn</a>
          </div>
          <div className="menu-letter-chips menu-footer-item">
            <div className="nav-item square">{tr.menu.sendLetter[0]}</div>
            <div className="nav-item pill">{tr.menu.sendLetter[1]}</div>
          </div>
          <a href="mailto:arackelian.arsen@gmail.com" className="menu-email menu-footer-item">
            arackelian.arsen@gmail.com
          </a>
        </div>

        <span className="menu-copy">© 2026 Arsen Arakelyan</span>
      </div>

      {/* ── TOS COMMAND TERMINAL ── */}
      <div ref={terminalRef} className={`terminal${terminalOpen ? ' terminal--open' : ''}`}>
        <div className="terminal-header">
          <span className="terminal-title">{tr.terminal.title}</span>
          <button className="terminal-esc-btn" onClick={() => setTerminalOpen(false)}>ESC</button>
        </div>
        <div className="terminal-input-row">
          <span className="terminal-prefix">:/</span>
          <input
            ref={terminalInputRef}
            className="terminal-input"
            value={terminalInput}
            onChange={(e) => setTerminalInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') executeCommand(terminalInput.trim().toLowerCase());
              if (e.key === 'Escape') setTerminalOpen(false);
            }}
            placeholder={tr.terminal.placeholder}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div className="terminal-commands">
          <div className="terminal-section-label">{tr.terminal.available}</div>
          {COMMAND_NAMES.map((name) => (
            <button key={name} className="terminal-cmd" onClick={() => executeCommand(name)}>
              <span className="terminal-cmd-name">{name}</span>
              <span className="terminal-cmd-desc">{tr.terminal.commands[name]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── HEADER ── */}
      <SiteHeader
        menuOpen={menuOpen}
        onMenuToggle={toggleMenu}
        playFx={playFx}
        navRef={navRef}
        navItems={[
          { label: tr.nav.about,    onClick: () => scrollToSection('#about') },
          { label: tr.nav.cases,    onClick: () => scrollToSection('#cases'),    pill: true },
          { label: tr.nav.contacts, onClick: () => scrollToSection('#contacts') },
          { label: tr.nav.cv,       onClick: () => downloadCV(lang),              pill: true },
        ]}
        hintReset={!!(cursorMode || drawMode || filterMode)}
        onHint={
          (cursorMode || drawMode || filterMode)
            ? () => executeCommand('reset')
            : () => setTerminalOpen(prev => !prev)
        }
      />

      <canvas
        ref={drawingCanvasRef}
        className={`draw-canvas${drawMode ? ' draw-canvas--active' : ''}`}
        aria-hidden="true"
      />

      {/* ── HERO ── */}
      <section className="hero" id="hero">
        <div className="portrait-wrap">
          <div className="portrait-3d" id="portrait-3d">
            <PortraitScene />
          </div>
        </div>

        <div className="hero-name">
          <div className="hero-row">
            <div className="tag pill pink" data-word style={{ transitionDelay: '0.35s' }}><span className="tag-lg">{tr.hero.name}</span></div>
            <div className="tag square glass" data-word style={{ transitionDelay: '0.45s' }}><span className="tag-xl">{tr.hero.surname}</span></div>
          </div>
          <div className="hero-row">
            <div className="tag pill glass" data-word style={{ transitionDelay: '0.55s' }}>
              <span className="tag-xl hero-role-default">{tr.hero.role1}</span>
              <span className="tag-xl hero-role-mobile-en">Product</span>
            </div>
            <div className="tag square glass" data-word style={{ transitionDelay: '0.65s' }}>
              <span className="tag-xl hero-role-default">{tr.hero.role2}</span>
              <span className="tag-xl hero-role-mobile-en">designer</span>
            </div>
            <div className="tag pill lavender" data-word style={{ transitionDelay: '0.75s' }}><span className="tag-lg">{tr.hero.company}</span></div>
          </div>
        </div>

        <div className="hero-bottom">
          <div className="hero-exp"><span>{tr.hero.experience}</span></div>
          <div className="hero-socials">
            <div className="badge-wrap">
              <span className={`badge yellow${sayHiFade ? ' badge--fade' : ''}`} style={{cursor:'default'}}>{sayHiWord}</span>
            </div>
            <div className="badge-wrap">
              <a href="https://t.me/arsendsgn" target="_blank" className="badge button" onMouseEnter={playFx}><ST>t.me/arsendsgn</ST></a>
            </div>
          </div>
        </div>
      </section>

      {/* ── DARK / ABOUT ── */}
      <section className="dark-section" id="about">
        <div className="dark-quote">
          <p>{tr.about.quote}</p>
        </div>
        <div className="dark-row">
          <div className="dark-desc">
            <div className="dark-desc-inner">
              <p>{tr.about.desc}</p>
            </div>
          </div>
          <video
            className="dark-img-placeholder"
            autoPlay loop muted playsInline
            style={{ objectFit: 'cover' }}
            ref={el => { if (el) { attachVideoSrc(el, '/sber-mobile.mp4', '/sber.mp4'); bgVideosRef.current.add(el); } }}
          />
        </div>
      </section>

      {/* ── WORK GRID ── */}
      <section className="work-section" id="cases">
        <div className="work-section-header">
          <div className="work-section-labels">
            <div className="work-label-tag work-label-square"><span className="tag-xl">{tr.cases.label1}</span></div>
            <div className="work-label-tag work-label-pill"><span className="tag-xl">{tr.cases.label2}</span></div>
          </div>
          <div className="work-disciplines">
            {tr.cases.disciplines.map(tag => (
              <span key={tag} className="work-discipline-tag">{tag}</span>
            ))}
          </div>
        </div>
        <div className="work-grid">
          <a href="/sber" className="work-item">
            <div className="work-thumb">
              <video
                autoPlay loop muted playsInline
                style={{width:'100%',height:'100%',objectFit:'cover'}}
                ref={el => { if (el) { attachVideoSrc(el, '/sber-mobile.mp4', '/sber.mp4'); bgVideosRef.current.add(el); } }}
              />
            </div>
            <p className="work-title">Sber</p>
          </a>
          <a href="/po-copilot" className="work-item">
            <div className="work-thumb">
              <img
                src="/images/copilot4.webp"
                alt=""
                loading="lazy"
                style={{ width: '100%', aspectRatio: '16 / 9', objectFit: 'cover' }}
              />
            </div>
            <p className="work-title">PO-Copilot</p>
          </a>
          <a href="/vibes" className="work-item">
            <div className="work-thumb">
              <div className="work-thumb-vibes">
                <video
                  src="/vibes1.mp4"
                  autoPlay loop muted playsInline
                  ref={el => { if (el) { el.muted = true; el.play().catch(() => {}); bgVideosRef.current.add(el); } }}
                />
              </div>
            </div>
            <p className="work-title">Vibes</p>
          </a>
          <a href="/tj" className="work-item">
            <div className="work-thumb">
              <video
                src="/tj-720p.mp4"
                autoPlay loop muted playsInline
                style={{width:'100%',aspectRatio:'16 / 9',objectFit:'cover'}}
                ref={el => { if (el) { el.muted = true; el.play().catch(() => {}); bgVideosRef.current.add(el); } }}
              />
            </div>
            <p className="work-title">T-Journal</p>
          </a>
        </div>
      </section>

      {/* ── SKILLS + FOOTER (100vh) ── */}
      <div className="skills-footer-wrap" id="skills">
        <Skills />
        <footer className="footer" id="contacts">
        <nav className="footer-nav">
          <div className="footer-nav-item square">Product</div>
          <div className={`footer-nav-item lavender cycling${fade1 ? ' fade' : ''}`}>{word1}</div>
          <div className="footer-nav-item square">Designer</div>
          <div className={`footer-nav-item pink cycling${fade2 ? ' fade' : ''}`}>{word2}</div>
        </nav>
        <div className="footer-bottom">
          <div className="footer-copy"><span>© 2026 Arsen Arakelyan</span></div>
          <div className="badge-wrap"><span className="badge yellow" onMouseEnter={playFx} onClick={() => downloadCV(lang)} style={{cursor:'pointer'}}><ST>{tr.footer.downloadCv}</ST></span></div>
          <div className="footer-links">
            <div className="badge-wrap"><a href="mailto:arsart94@yandex.ru" className="badge primary" onMouseEnter={playFx}><ST>E-mail</ST></a></div>
            <div className="badge-wrap"><a href="https://t.me/arsendsgn" target="_blank" className="badge primary" onMouseEnter={playFx}><ST>Telegram</ST></a></div>
            <div className="badge-wrap"><a href="https://www.linkedin.com/in/arsendsgn/" target="_blank" className="badge primary" onMouseEnter={playFx}><ST>LinkedIn</ST></a></div>
          </div>
        </div>
      </footer>
      </div>{/* end skills-footer-wrap */}

      <div className="music-embed-wrap" style={{ display: musicOpen ? 'block' : 'none' }}>
        <div ref={spotifyEmbedRef} />
      </div>

      {/* ── FAKE CURSOR ── */}
      <div ref={fakeCursorRef} className="fake-cursor" style={{ display: 'none' }}>
        <img src="" alt="" draggable={false} />
      </div>
    </>
  );
}

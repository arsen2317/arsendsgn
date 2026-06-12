'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Skills from '../components/Skills';
import SiteHeader from '../components/SiteHeader';

const PortraitScene = dynamic(() => import('../components/PortraitScene'), { ssr: false });

const CV_URL = 'https://github.com/arsen2317/arsendsgn/releases/download/cv/Arsen.Arakelyan.CV.eng.pdf';
const downloadCV = () => {
  const a = document.createElement('a');
  a.href = CV_URL;
  a.target = '_blank';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const SAY_HI = ['Say Hi', 'Привет', 'こんにちは', 'Hola', 'Bonjour', 'Ciao', 'Olá', '你好', '안녕', 'Hallo', 'مرحبا', 'Shalom'];

const WORDS_1 = ['Empathetic', 'Curious', 'Thoughtful', 'Intentional', 'Holistic'];
const WORDS_2 = ['Strategic', 'Systematic', 'Analytical', 'Iterative', 'Precise'];

const CURSORS = ['sheep', 'cat'];

const COMMANDS = [
  { name: 'about',    desc: '→ About section' },
  { name: 'cases',    desc: '→ Cases section' },
  { name: 'contacts', desc: '→ Contacts' },
  { name: 'draw',     desc: 'Have fun' },
  { name: 'cursor',   desc: 'Random cursor' },
  { name: 'noire',    desc: 'Black & white' },
  { name: 'negative', desc: 'Invert colors' },
  { name: 'reset',    desc: 'Reset all effects' },
  { name: 'close',    desc: 'Close terminal' },
];

const ST = ({ children }) => (
  <span className="st-wrap">
    <span className="st">
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  </span>
);

export default function Home() {
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

  const toggleMenu = () => setMenuOpen(prev => !prev);


  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
    const audio = new Audio(`${base}/fx.mp3`);
    fxRef.current = audio;
    const noire = new Audio('https://github.com/arsen2317/arsendsgn/releases/download/sfx/noire.mp3');
    noire.loop = true;
    noireRef.current = noire;
    const drawMusic = new Audio('https://github.com/arsen2317/arsendsgn/releases/download/sfx/draw.mp3');
    drawMusic.loop = true;
    drawMusicRef.current = drawMusic;
    fahhRef.current = new Audio('https://github.com/arsen2317/arsendsgn/releases/download/sfx/fahh.mp3');

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

  /* Filter mode audio effects */
  useEffect(() => {
    const noire = noireRef.current;
    if (filterMode === 'noire') {
      if (noire) { noire.currentTime = 0; noire.play().catch(() => {}); }
    } else {
      if (noire) { noire.pause(); noire.currentTime = 0; }
    }
    if (filterMode === 'negative') {
      const a = fahhRef.current;
      if (a) { a.currentTime = 0; a.play().catch(() => {}); }
    }
  }, [filterMode]);

  /* Draw mode music */
  useEffect(() => {
    const music = drawMusicRef.current;
    if (!music) return;
    if (drawMode) {
      music.currentTime = 0;
      music.play().catch(() => {});
    } else {
      music.pause();
      music.currentTime = 0;
    }
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
      document.documentElement.style.cursor = '';
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

    document.documentElement.style.cursor = 'none';

    const onMove = (e) => {
      el.style.left = e.clientX + 'px';
      el.style.top  = e.clientY + 'px';
    };

    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      el.style.display = 'none';
      document.documentElement.style.cursor = '';
    };
  }, [cursorMode]);

  /* Cycling footer words */
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

  useEffect(() => {
    const t = setInterval(() => {
      setSayHiFade(true);
      setTimeout(() => {
        sayHiIdx.current = (sayHiIdx.current + 1) % SAY_HI.length;
        setSayHiWord(SAY_HI[sayHiIdx.current]);
        setSayHiFade(false);
      }, 200);
    }, 2000);
    return () => clearInterval(t);
  }, []);

  /* Lenis + GSAP */
  useEffect(() => {
    let lenis;
    let ctx;
    let onSnapWheel;

    async function init() {
      const { default: Lenis }    = await import('lenis');
      const { gsap }              = await import('gsap');
      const { ScrollTrigger }     = await import('gsap/ScrollTrigger');

      gsap.registerPlugin(ScrollTrigger);

      lenis = new Lenis();
      lenisRef.current = lenis;
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);

      ctx = gsap.context(() => {
        gsap.from('.header', { y: -80, opacity: 0, duration: 0.7, ease: 'power3.out' });
        gsap.from('.portrait-wrap', { y: -24, opacity: 0, scale: 0.92, duration: 0.8, delay: 0.25, ease: 'power3.out' });
        gsap.from('[data-word]', { y: 70, opacity: 0, duration: 0.9, delay: 0.35, stagger: 0.1, ease: 'back.out(2)' });
        gsap.from('.hero-bottom', { opacity: 0, duration: 0.6, delay: 0.85, ease: 'power2.out' });

        gsap.from('.dark-quote p', { x: 50, opacity: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: '.dark-section', start: 'top 70%' } });
        gsap.from('.dark-desc p', { y: 30, opacity: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: '.dark-row', start: 'top 80%' } });
        gsap.from('.dark-img-placeholder', { scale: 0.94, opacity: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: '.dark-row', start: 'top 80%' } });

        gsap.from('.work-item', {
          y: 48, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1,
          scrollTrigger: { trigger: '.work-grid', start: 'top 80%' },
        });
      });

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
      ctx?.revert();
      if (onSnapWheel) window.removeEventListener('wheel', onSnapWheel);
    };
  }, []);

  return (
    <>
      {/* ── MOBILE MENU OVERLAY ── */}
      <div className={`menu-overlay${menuOpen ? ' menu-overlay--open' : ''}`}>
        <nav className="menu-overlay-nav">
          <button className="nav-item square menu-item" onClick={() => scrollToSection('#about')} onMouseEnter={playFx}><ST>About me</ST></button>
          <button className="nav-item pill   menu-item" onClick={() => scrollToSection('#cases')} onMouseEnter={playFx}><ST>Cases</ST></button>
          <button className="nav-item square menu-item" onClick={() => scrollToSection('#contacts')} onMouseEnter={playFx}><ST>Contacts</ST></button>
          <button className="nav-item pill menu-item" onMouseEnter={playFx} onClick={() => downloadCV()}><ST>My CV</ST></button>
        </nav>

        <div className="menu-overlay-footer">
          <div className="nav-item square menu-contact-chip menu-footer-item">Contact me</div>
          <div className="menu-social-links menu-footer-item">
            <a href="https://t.me/arsendsgn" target="_blank" className="menu-social-link">Telegram</a>
            <a href="#" className="menu-social-link">LinkedIn</a>
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

      {/* ── TOS COMMAND TERMINAL ── */}
      <div ref={terminalRef} className={`terminal${terminalOpen ? ' terminal--open' : ''}`}>
        <div className="terminal-header">
          <span className="terminal-title">ASD Terminal</span>
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
            placeholder="type a command…"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div className="terminal-commands">
          <div className="terminal-section-label">Available commands</div>
          {COMMANDS.map((cmd) => (
            <button key={cmd.name} className="terminal-cmd" onClick={() => executeCommand(cmd.name)}>
              <span className="terminal-cmd-name">{cmd.name}</span>
              <span className="terminal-cmd-desc">{cmd.desc}</span>
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
          { label: 'About me', onClick: () => scrollToSection('#about') },
          { label: 'Cases',    onClick: () => scrollToSection('#cases'),    pill: true },
          { label: 'Contacts', onClick: () => scrollToSection('#contacts') },
          { label: 'My CV',    onClick: downloadCV,                         pill: true },
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
            <div className="tag pill pink" data-word><span className="tag-lg">Arsen</span></div>
            <div className="tag square glass" data-word><span className="tag-xl">Arakelyan</span></div>
          </div>
          <div className="hero-row">
            <div className="tag pill glass" data-word><span className="tag-xl">Product</span></div>
            <div className="tag square glass" data-word><span className="tag-xl">Designer</span></div>
            <div className="tag pill lavender" data-word><span className="tag-lg">MTS Fintech</span></div>
          </div>
        </div>

        <div className="hero-bottom">
          <div className="hero-exp"><span>2 years experience</span></div>
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
          <p>I focus on the user by combining empathy, attention to detail, and analytics to simplify complexity</p>
        </div>
        <div className="dark-row">
          <div className="dark-desc">
            <p>I focus on the user, combining empathy, attention to detail, and analytics to make the complex simple and understandable</p>
          </div>
          <video
            className="dark-img-placeholder"
            src="/sber.mp4"
            autoPlay loop muted playsInline
            style={{ objectFit: 'cover' }}
            ref={el => { if (el) el.muted = true; }}
          />
        </div>
      </section>

      {/* ── WORK GRID ── */}
      <section className="work-section" id="cases">
        <div className="work-section-header">
          <div className="work-section-labels">
            <div className="work-label-tag work-label-square"><span className="tag-xl">Recent</span></div>
            <div className="work-label-tag work-label-pill"><span className="tag-xl">Projects</span></div>
          </div>
          <div className="work-disciplines">
            {['UX/UI Design', 'Research', 'Usability Testing', 'Product Design', 'In-depth Interviews', 'Mobile App', 'Feature Ideation', '3D Animation'].map(tag => (
              <span key={tag} className="work-discipline-tag">{tag}</span>
            ))}
          </div>
        </div>
        <div className="work-grid">
          <a href="/sber" className="work-item">
            <div className="work-thumb">
              <video
                src="/sber.mp4"
                autoPlay loop muted playsInline
                style={{width:'100%',height:'100%',objectFit:'cover'}}
                ref={el => { if (el) el.muted = true; }}
              />
            </div>
            <p className="work-title">Sber</p>
          </a>
          <a href="/vibes" className="work-item">
            <div className="work-thumb">
              <div className="work-thumb-vibes">
                <video
                  src="/vibes1.mp4"
                  autoPlay loop muted playsInline
                  ref={el => { if (el) el.muted = true; }}
                />
              </div>
            </div>
            <p className="work-title">Vibes</p>
          </a>
          <a href="/tj" className="work-item">
            <div className="work-thumb">
              <iframe
                src="https://kinescope.io/embed/ttU5nXJMc4RCMbWnmZg8JH?&muted=true&autoplay=true&autopause=false&loop=true"
                allow="autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer; clipboard-write;"
                frameBorder="0"
                allowFullScreen
                style={{width:'100%',height:'100%',border:'none'}}
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
          <div className="badge-wrap"><span className="badge yellow" onMouseEnter={playFx} onClick={downloadCV} style={{cursor:'pointer'}}><ST>Download CV</ST></span></div>
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

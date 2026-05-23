'use client';

import { useEffect, useRef, useState } from 'react';

const WORDS_1 = ['Empathetic', 'Curious', 'Thoughtful', 'Intentional', 'Holistic'];
const WORDS_2 = ['Strategic', 'Systematic', 'Analytical', 'Iterative', 'Precise'];

const COMMANDS = [
  { name: 'about',    desc: '→ About section' },
  { name: 'cases',    desc: '→ Cases section' },
  { name: 'contacts', desc: '→ Contacts' },
  { name: 'draw',     desc: 'Yellow marker overlay' },
  { name: 'cursor',   desc: 'Random cursor' },
  { name: 'noire',    desc: 'Black & white + rain' },
  { name: 'negative', desc: 'Invert colors + fahh' },
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
  const fxRef = useRef(null);
  const noireRef = useRef(null);
  const drawMusicRef = useRef(null);
  const fahhRef = useRef(null);
  const navRef = useRef(null);
  const navHoveredRef = useRef(-1);
  const navResetTimerRef = useRef(null);

  const toggleMenu = () => setMenuOpen(prev => !prev);

  const handleNavItemEnter = (idx) => {
    const prev = navHoveredRef.current;
    if (prev !== -1 && prev !== idx) {
      const nav = navRef.current;
      if (nav) {
        nav.setAttribute('data-nav-resetting', 'true');
        clearTimeout(navResetTimerRef.current);
        navResetTimerRef.current = setTimeout(() => {
          nav.removeAttribute('data-nav-resetting');
        }, 60);
      }
    }
    navHoveredRef.current = idx;
  };

  const handleNavLeave = () => {
    navHoveredRef.current = -1;
    clearTimeout(navResetTimerRef.current);
    if (navRef.current) navRef.current.removeAttribute('data-nav-resetting');
  };

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
    const c = drawingCanvasRef.current;
    if (c) c.getContext('2d').clearRect(0, 0, c.width, c.height);
  };

  const executeCommand = (cmd) => {
    switch (cmd) {
      case 'about':    scrollToSection('#about');    setTerminalOpen(false); break;
      case 'cases':    scrollToSection('#cases');    setTerminalOpen(false); break;
      case 'contacts': scrollToSection('#contacts'); setTerminalOpen(false); break;
      case 'draw':     setDrawMode(true);  setTerminalOpen(false); break;
      case 'cursor':   setCursorMode(prev => prev === 'cat' ? null : 'cat'); break;
      case 'nyan':     setCursorMode(prev => prev === 'nyan' ? null : 'nyan'); break;
      case 'noire':    document.documentElement.style.filter = 'grayscale(1)'; setFilterMode('noire'); break;
      case 'negative': document.documentElement.style.filter = 'invert(1)';   setFilterMode('negative'); break;
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
      lenisRef.current?.scrollTo(id, { offset: -72, duration: 1.2 });
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

  /* Drawing canvas — set up pointer events when draw mode is active */
  useEffect(() => {
    const canvas = drawingCanvasRef.current;
    if (!canvas) return;
    if (!drawMode) { canvas.style.pointerEvents = 'none'; return; }

    const hero = document.getElementById('hero');
    if (!hero) return;
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
    canvas.style.pointerEvents = 'all';

    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = 'rgba(255, 229, 0, 0.88)';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    let drawing = false, lx = 0, ly = 0;
    const pos = (e) => {
      const r = canvas.getBoundingClientRect();
      if (e.touches) return { x: e.touches[0].clientX - r.left, y: e.touches[0].clientY - r.top };
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const start = (e) => { drawing = true; ({ x: lx, y: ly } = pos(e)); e.preventDefault(); };
    const draw  = (e) => {
      if (!drawing) return; e.preventDefault();
      const { x, y } = pos(e);
      ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(x, y); ctx.stroke();
      lx = x; ly = y;
    };
    const stop  = () => { drawing = false; };

    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stop);
    canvas.addEventListener('mouseleave', stop);
    canvas.addEventListener('touchstart', start, { passive: false });
    canvas.addEventListener('touchmove',  draw,  { passive: false });
    canvas.addEventListener('touchend',   stop);
    return () => {
      canvas.removeEventListener('mousedown', start);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stop);
      canvas.removeEventListener('mouseleave', stop);
      canvas.removeEventListener('touchstart', start);
      canvas.removeEventListener('touchmove',  draw);
      canvas.removeEventListener('touchend',   stop);
    };
  }, [drawMode]);

  /* Custom cursor — animated stylesheets from cursors-4u.com */
  useEffect(() => {
    document.getElementById('cursor-link')?.remove();
    document.getElementById('cursor-override')?.remove();
    if (!cursorMode) return;
    const urls = {
      cat:  'https://cdn.cursors-4u.net/cursors/animated/slapping-cat-1348ecde-64.css',
      nyan: 'https://cdn.cursors-4u.net/cursors/animated/animated-nyan-cat-rainbow-c493f1ef-32.css',
    };
    const link = document.createElement('link');
    link.id = 'cursor-link';
    link.rel = 'stylesheet';
    link.href = urls[cursorMode];
    document.head.appendChild(link);
    /* Force all elements to inherit cursor from html/body so CDN animation isn't overridden */
    const style = document.createElement('style');
    style.id = 'cursor-override';
    style.textContent = '*, *:hover { cursor: inherit !important; }';
    document.head.appendChild(style);
    return () => {
      document.getElementById('cursor-link')?.remove();
      document.getElementById('cursor-override')?.remove();
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

  /* Lenis + GSAP */
  useEffect(() => {
    let lenis;
    let ctx;
    let tiltRafId;
    let onMouseMove;

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

      /* Portrait 3D cursor tracking */
      const portrait3d = document.getElementById('portrait-3d');
      let targetRotX = 0, targetRotY = 0;
      let currentRotX = 0, currentRotY = 0;

      onMouseMove = (e) => {
        if (!portrait3d) return;
        const rect = portrait3d.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (window.innerWidth * 0.5);
        const dy = (e.clientY - cy) / (window.innerHeight * 0.5);
        const max = 22;
        targetRotY = Math.max(-max, Math.min(max, dx * max));
        targetRotX = Math.max(-max, Math.min(max, -dy * max));
      };

      const tiltTick = () => {
        const lerp = 0.06;
        const tx = drawModeRef.current ? 0 : targetRotX;
        const ty = drawModeRef.current ? 0 : targetRotY;
        currentRotX += (tx - currentRotX) * lerp;
        currentRotY += (ty - currentRotY) * lerp;
        if (portrait3d) {
          gsap.set(portrait3d, {
            rotateX: currentRotX,
            rotateY: currentRotY,
            transformPerspective: 700,
          });
        }
        tiltRafId = requestAnimationFrame(tiltTick);
      };

      if (window.matchMedia('(pointer: fine)').matches) {
        window.addEventListener('mousemove', onMouseMove);
        tiltRafId = requestAnimationFrame(tiltTick);
      }


      ctx = gsap.context(() => {
        gsap.from('.header', { y: -80, opacity: 0, duration: 0.7, ease: 'power3.out' });
        gsap.from('.hero-portrait', { y: -24, opacity: 0, scale: 0.92, duration: 0.8, delay: 0.25, ease: 'power3.out' });
        gsap.from('[data-word]', { y: 70, opacity: 0, duration: 0.9, delay: 0.35, stagger: 0.1, ease: 'back.out(2)' });
        gsap.from('.hero-bottom', { opacity: 0, duration: 0.6, delay: 0.85, ease: 'power2.out' });

        gsap.from('.dark-quote p', { x: 50, opacity: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: '.dark-section', start: 'top 70%' } });
        gsap.from('.dark-desc p', { y: 30, opacity: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: '.dark-row', start: 'top 80%' } });
        gsap.from('.dark-img-placeholder', { scale: 0.94, opacity: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: '.dark-row', start: 'top 80%' } });

        gsap.utils.toArray('.divider').forEach((el) => {
          gsap.from(el, { scaleX: 0, duration: 1.2, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 90%' } });
        });
        gsap.utils.toArray('.case-row').forEach((el) => {
          gsap.from(el, { y: 48, opacity: 0, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%' } });
        });
      });
    }

    init();

    return () => {
      lenis?.destroy();
      ctx?.revert();
      cancelAnimationFrame(tiltRafId);
      if (onMouseMove) window.removeEventListener('mousemove', onMouseMove);
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
          <button className="nav-item pill menu-item" onMouseEnter={playFx} onClick={() => window.open('https://disk.yandex.ru/i/8pjQktNNmsMnVg', '_blank')}><ST>My CV</ST></button>
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
      <div className={`terminal${terminalOpen ? ' terminal--open' : ''}`}>
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
      {(() => {
        const effectsActive = cursorMode || drawMode || filterMode;
        return (
          <header className={`header${menuOpen ? ' header--menu-open' : ''}`}>
            <button className="logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} onMouseEnter={playFx}><ST>arsendsgn</ST></button>
            <nav className="nav" ref={navRef} onMouseLeave={handleNavLeave}>
              <button className="nav-item square" onClick={() => scrollToSection('#about')} onMouseEnter={() => { playFx(); handleNavItemEnter(0); }}><ST>About me</ST></button>
              <button className="nav-item pill"   onClick={() => scrollToSection('#cases')} onMouseEnter={() => { playFx(); handleNavItemEnter(1); }}><ST>Cases</ST></button>
              <button className="nav-item square" onClick={() => scrollToSection('#contacts')} onMouseEnter={() => { playFx(); handleNavItemEnter(2); }}><ST>Contacts</ST></button>
              <button className="nav-item pill" onMouseEnter={() => { playFx(); handleNavItemEnter(3); }} onClick={() => window.open('https://disk.yandex.ru/i/8pjQktNNmsMnVg', '_blank')}><ST>My CV</ST></button>
            </nav>
            <div className="header-right">
              <button
                className={`header-hint${effectsActive ? ' header-hint--reset' : ''}`}
                onClick={effectsActive ? () => executeCommand('reset') : () => setTerminalOpen(prev => !prev)}
              >
                {effectsActive ? 'reset' : 'Press / for?'}
              </button>
              <button className={`menu-btn${menuOpen ? ' menu-btn--open' : ''}`} onClick={toggleMenu}>
                <span className="menu-btn-text menu-btn-text--menu">Menu</span>
                <span className="menu-btn-text menu-btn-text--close">Close</span>
              </button>
            </div>
          </header>
        );
      })()}

      {/* ── HERO ── */}
      <section className="hero" id="hero">
        <canvas
          ref={drawingCanvasRef}
          className={`draw-canvas${drawMode ? ' draw-canvas--active' : ''}`}
          aria-hidden="true"
        />
        <div className="portrait-wrap">
          <div className="portrait-3d" id="portrait-3d">
            <img
              className="hero-portrait"
              src="https://www.figma.com/api/mcp/asset/d1a20262-c7eb-4dc1-a238-2f49346f8228"
              alt="Arsen Arakelyan"
            />
            <div className="portrait-edge" />
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
              <a href="mailto:arackelian.arsen@gmail.com" className="badge yellow" onMouseEnter={playFx}><ST>Say Hi</ST></a>
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
          <div className="dark-img-placeholder" />
        </div>
      </section>

      {/* ── CASES ── */}
      <section className="cases-section" id="cases">
        <div className="divider" />
        <div className="case-row">
          <div className="case-img-box">
            <img src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/sber.webp`} alt="Sber case" />
          </div>
          <div className="case-info">
            <div className="case-header">
              <div className="case-title-row">
                <div className="glass-tag"><span className="case-num">(01)</span></div>
                <div className="glass-tag"><span className="case-title">Sber</span></div>
              </div>
              <div className="case-tags">
                <span className="case-tag">ux/ui design</span>
                <span className="case-tag">research</span>
                <span className="case-tag">usability testing</span>
                <span className="case-tag">3d animation</span>
                <span className="case-tag">product design</span>
              </div>
            </div>
            <div className="case-desc">
              <p>Sber terminals accept payments via QR, cards, and biometrics. This case explores how to expand the user experience by moving beyond the terminal's traditional role as just a payment device.</p>
            </div>
          </div>
        </div>

        <div className="divider" />

        <div className="case-row case-row--reverse">
          <div className="case-info">
            <div className="case-header">
              <div className="case-title-row">
                <div className="glass-tag"><span className="case-num">(02)</span></div>
                <div className="glass-tag"><span className="case-title">t-journal</span></div>
              </div>
              <div className="case-tags">
                <span className="case-tag">ux/ui design</span>
                <span className="case-tag">In-depth interviews</span>
                <span className="case-tag">usability testing</span>
                <span className="case-tag">feature ideation</span>
                <span className="case-tag">scaling concept</span>
              </div>
            </div>
            <div className="case-desc">
              <p>T-j reaches 42 million readers, but fewer than 20% are T-Bank clients. The project goal is to connect T-j and T-Bank through user scenarios without undermining trust in the media. The focus is on the "Travel" section.</p>
            </div>
          </div>
          <div className="case-img-box case-img-box--video">
            <iframe
              src="https://kinescope.io/embed/ttU5nXJMc4RCMbWnmZg8JH?&muted=true&autoplay=true&autopause=false&loop=true"
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer; clipboard-write;"
              frameBorder="0"
              allowFullScreen
              style={{width:'100%',height:'100%',border:'none'}}
            />
          </div>
        </div>

        <div className="divider" />

        <div className="case-row">
          <div className="case-img-box">
            <video
              src="https://static.tildacdn.com/vide3238-3739-4331-a561-353338386161/cover_short.mp4"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
          <div className="case-info">
            <div className="case-header">
              <div className="case-title-row">
                <div className="glass-tag"><span className="case-num">(03)</span></div>
                <div className="glass-tag"><span className="case-title">Vibes</span></div>
              </div>
              <div className="case-tags">
                <span className="case-tag">ux/ui design</span>
                <span className="case-tag">research</span>
                <span className="case-tag">usability testing</span>
                <span className="case-tag">mobile app</span>
                <span className="case-tag">product design</span>
              </div>
            </div>
            <div className="case-desc">
              <p>Vibes is an app for creating and sharing mood-driven playlists. The project explores how to convey emotion through interface design and help users discover music for any state of mind.</p>
            </div>
          </div>
        </div>

        <div className="divider" />
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer" id="contacts">
        <nav className="footer-nav">
          <div className="footer-nav-item square">Product</div>
          <div className={`footer-nav-item lavender cycling${fade1 ? ' fade' : ''}`}>{word1}</div>
          <div className="footer-nav-item square">Designer</div>
          <div className={`footer-nav-item pink cycling${fade2 ? ' fade' : ''}`}>{word2}</div>
        </nav>
        <div className="footer-bottom">
          <div className="footer-copy"><span>© 2026 Arsen Arakelyan</span></div>
          <div className="badge-wrap"><a href="https://disk.yandex.ru/i/8pjQktNNmsMnVg" target="_blank" className="badge yellow" onMouseEnter={playFx}><ST>Download CV</ST></a></div>
          <div className="footer-links">
            <div className="badge-wrap"><a href="mailto:arsart94@yandex.ru" className="badge primary" onMouseEnter={playFx}><ST>E-mail</ST></a></div>
            <div className="badge-wrap"><a href="https://t.me/arsendsgn" target="_blank" className="badge primary" onMouseEnter={playFx}><ST>Telegram</ST></a></div>
            <div className="badge-wrap"><a href="https://www.linkedin.com/in/arsendsgn/" target="_blank" className="badge primary" onMouseEnter={playFx}><ST>LinkedIn</ST></a></div>
          </div>
        </div>
      </footer>

      <div className="music-embed-wrap" style={{ display: musicOpen ? 'block' : 'none' }}>
        <div ref={spotifyEmbedRef} />
      </div>
    </>
  );
}

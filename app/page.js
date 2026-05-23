'use client';

import { useEffect, useRef, useState } from 'react';

const WORDS_1 = ['Empathetic', 'Curious', 'Thoughtful', 'Intentional', 'Holistic'];
const WORDS_2 = ['Strategic', 'Systematic', 'Analytical', 'Iterative', 'Precise'];

const COMMANDS = [
  { name: 'about',    desc: '→ About section' },
  { name: 'cases',    desc: '→ Cases section' },
  { name: 'contacts', desc: '→ Contacts' },
  { name: 'draw',     desc: 'Yellow marker overlay' },
  { name: 'cursor',   desc: 'Custom cursor on/off' },
  { name: 'bw',       desc: 'Black & white filter' },
  { name: 'negative', desc: 'Invert colors' },
  { name: 'reset',    desc: 'Reset all effects' },
  { name: 'close',    desc: 'Close terminal' },
];

export default function Home() {
  const [word1, setWord1] = useState(WORDS_1[0]);
  const [word2, setWord2] = useState(WORDS_2[0]);
  const [fade1, setFade1] = useState(false);
  const [fade2, setFade2] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [terminalInput, setTerminalInput] = useState('');
  const [drawMode, setDrawMode] = useState(false);
  const [cursorMode, setCursorMode] = useState(false);
  const [filterMode, setFilterMode] = useState(false);
  const idx1 = useRef(0);
  const idx2 = useRef(0);
  const lenisRef = useRef(null);
  const terminalInputRef = useRef(null);
  const terminalOpenRef = useRef(false);
  const drawModeRef = useRef(false);
  const drawingCanvasRef = useRef(null);
  const gyroSetupRef = useRef(null);
  const [gyroPromptVisible, setGyroPromptVisible] = useState(false);

  const toggleMenu = () => setMenuOpen(prev => !prev);

  /* Show gyro prompt immediately on iOS mobile */
  useEffect(() => {
    if (!('ontouchstart' in window)) return;
    if (typeof DeviceOrientationEvent?.requestPermission === 'function') {
      setGyroPromptVisible(true);
    }
  }, []);

  const requestGyro = async () => {
    setGyroPromptVisible(false);
    try {
      const perm = await DeviceOrientationEvent.requestPermission();
      if (perm === 'granted') gyroSetupRef.current?.();
    } catch {}
  };

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
      case 'cursor':   setCursorMode(prev => !prev); break;
      case 'bw':       document.documentElement.style.filter = 'grayscale(1)'; setFilterMode(true); break;
      case 'negative': document.documentElement.style.filter = 'invert(1)';   setFilterMode(true); break;
      case 'reset':
        document.documentElement.style.filter = '';
        setDrawMode(false); clearCanvas();
        setCursorMode(false);
        setFilterMode(false);
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

  /* Custom cursor — Rainbow Sheep .ani (Edge/IE) + emoji SVG fallback */
  useEffect(() => {
    const el = document.getElementById('cursor-style');
    if (el) el.remove();
    if (!cursorMode) return;
    const base = window.location.hostname === 'localhost' ? '' : '/arsendsgn';
    const aniUrl = `${base}/cursors/rainbow-sheep.ani`;
    const svg = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40'><text y='32' font-size='32'>🐑</text></svg>`;
    const style = document.createElement('style');
    style.id = 'cursor-style';
    style.textContent = `*, *:hover { cursor: url("${aniUrl}") 0 0, url("${svg}") 0 0, auto !important; }`;
    document.head.appendChild(style);
    return () => { document.getElementById('cursor-style')?.remove(); };
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
    let onDeviceOrientation;

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

      window.addEventListener('mousemove', onMouseMove);
      tiltRafId = requestAnimationFrame(tiltTick);

      /* Gyroscope tilt for mobile */
      if ('ontouchstart' in window) {
        let baseB = null, baseG = null;
        onDeviceOrientation = (e) => {
          if (baseB === null) { baseB = e.beta ?? 0; baseG = e.gamma ?? 0; }
          const max = 22;
          targetRotX = Math.max(-max, Math.min(max, -((e.beta  - baseB) / 30) * max));
          targetRotY = Math.max(-max, Math.min(max,  ((e.gamma - baseG) / 30) * max));
        };
        if (typeof DeviceOrientationEvent !== 'undefined' &&
            typeof DeviceOrientationEvent.requestPermission === 'function') {
          /* iOS: expose setup fn for the prompt button */
          gyroSetupRef.current = () => window.addEventListener('deviceorientation', onDeviceOrientation);
        } else {
          /* Android: works immediately */
          window.addEventListener('deviceorientation', onDeviceOrientation);
        }
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
      if (onDeviceOrientation) window.removeEventListener('deviceorientation', onDeviceOrientation);
    };
  }, []);

  return (
    <>
      {/* ── MOBILE MENU OVERLAY ── */}
      <div className={`menu-overlay${menuOpen ? ' menu-overlay--open' : ''}`}>
        <nav className="menu-overlay-nav">
          <button className="nav-item square menu-item" onClick={() => scrollToSection('#about')}>About me</button>
          <button className="nav-item pill   menu-item" onClick={() => scrollToSection('#cases')}>Cases</button>
          <button className="nav-item square menu-item" onClick={() => scrollToSection('#contacts')}>Contacts</button>
          <button className="nav-item pill   menu-item">Resume</button>
        </nav>

        <div className="menu-overlay-footer">
          <div className="nav-item square menu-contact-chip menu-footer-item">Contact me</div>
          <div className="menu-social-links menu-footer-item">
            <a href="https://t.me/arsendsgn" className="menu-social-link">Telegram</a>
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

      {/* ── GYRO PROMPT (iOS only) ── */}
      {gyroPromptVisible && (
        <button className="gyro-prompt" onClick={requestGyro}>
          Enable 3D portrait
        </button>
      )}

      {/* ── HEADER ── */}
      {(() => {
        const effectsActive = cursorMode || drawMode || filterMode;
        return (
          <header className={`header${menuOpen ? ' header--menu-open' : ''}`}>
            <div className="logo">arsendsgn</div>
            <nav className="nav">
              <button className="nav-item square" onClick={() => scrollToSection('#about')}>About me</button>
              <button className="nav-item pill"   onClick={() => scrollToSection('#cases')}>Cases</button>
              <button className="nav-item square" onClick={() => scrollToSection('#contacts')}>Contacts</button>
              <button className="nav-item pill">Resume</button>
            </nav>
            <div className="header-right">
              <button
                className={`header-hint${effectsActive ? ' header-hint--reset' : ''}`}
                onClick={effectsActive ? () => executeCommand('reset') : () => setTerminalOpen(true)}
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
              <a href="mailto:arackelian.arsen@gmail.com" className="badge yellow">Say Hi</a>
            </div>
            <div className="badge-wrap">
              <a href="https://t.me/arsendsgn" className="badge button">t.me/arsendsgn</a>
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
            <img src="https://www.figma.com/api/mcp/asset/32894ddf-f6ee-42fd-adcb-3a989bab3a9d" alt="Sber case" />
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

        <div className="case-row case-row--reverse">
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
          <div className="case-img-box">
            <video
              src="https://static.tildacdn.com/vide3238-3739-4331-a561-353338386161/cover_short.mp4"
              autoPlay
              loop
              muted
              playsInline
            />
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
          <div className="badge-wrap"><span className="badge yellow">Download CV</span></div>
          <div className="footer-links">
            <div className="badge-wrap"><a href="mailto:arackelian.arsen@gmail.com" className="badge primary">E-mail</a></div>
            <div className="badge-wrap"><a href="https://t.me/arsendsgn" className="badge primary">Telegram</a></div>
            <div className="badge-wrap"><a href="#" className="badge primary">LinkedIn</a></div>
          </div>
        </div>
      </footer>
    </>
  );
}

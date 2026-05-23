'use client';

import { useEffect, useRef, useState } from 'react';

const WORDS_1 = ['Empathetic', 'Curious', 'Thoughtful', 'Intentional', 'Holistic'];
const WORDS_2 = ['Strategic', 'Systematic', 'Analytical', 'Iterative', 'Precise'];

export default function Home() {
  const [word1, setWord1] = useState(WORDS_1[0]);
  const [word2, setWord2] = useState(WORDS_2[0]);
  const [fade1, setFade1] = useState(false);
  const [fade2, setFade2] = useState(false);
  const idx1 = useRef(0);
  const idx2 = useRef(0);

  /* Cycling footer words */
  useEffect(() => {
    const t1 = setInterval(() => {
      setFade1(true);
      setTimeout(() => {
        idx1.current = (idx1.current + 1) % WORDS_1.length;
        setWord1(WORDS_1[idx1.current]);
        setFade1(false);
      }, 300);
    }, 2200);

    const t2 = setInterval(() => {
      setFade2(true);
      setTimeout(() => {
        idx2.current = (idx2.current + 1) % WORDS_2.length;
        setWord2(WORDS_2[idx2.current]);
        setFade2(false);
      }, 300);
    }, 3100);

    return () => { clearInterval(t1); clearInterval(t2); };
  }, []);

  /* Lenis + GSAP */
  useEffect(() => {
    let lenis;
    let ctx;

    async function init() {
      const { default: Lenis }     = await import('lenis');
      const { gsap }               = await import('gsap');
      const { ScrollTrigger }      = await import('gsap/ScrollTrigger');

      gsap.registerPlugin(ScrollTrigger);

      lenis = new Lenis();
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);

      /* ── Portrait 3D cursor tracking ── */
      const portrait3d = document.getElementById('portrait-3d');
      let targetRotX = 0, targetRotY = 0;
      let currentRotX = 0, currentRotY = 0;
      let tiltRafId;

      const onMouseMove = (e) => {
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
        currentRotX += (targetRotX - currentRotX) * lerp;
        currentRotY += (targetRotY - currentRotY) * lerp;
        gsap.set(portrait3d, {
          rotateX: currentRotX,
          rotateY: currentRotY,
          transformPerspective: 700,
        });
        tiltRafId = requestAnimationFrame(tiltTick);
      };

      window.addEventListener('mousemove', onMouseMove);
      tiltRafId = requestAnimationFrame(tiltTick);

      ctx = gsap.context(() => {

        /* ── Header slide down ── */
        gsap.from('.header', {
          y: -80,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
        });

        /* ── Hero entrance: portrait + tags stagger ── */
        gsap.from('.hero-portrait', {
          y: -24,
          opacity: 0,
          scale: 0.92,
          duration: 0.8,
          delay: 0.25,
          ease: 'power3.out',
        });

        gsap.from('[data-word]', {
          y: 70,
          opacity: 0,
          duration: 0.9,
          delay: 0.35,
          stagger: 0.1,
          ease: 'back.out(2)', /* spring: cubic-bezier(1,-0.5,0,1.5) equivalent */
        });

        gsap.from('.hero-bottom', {
          opacity: 0,
          duration: 0.6,
          delay: 0.85,
          ease: 'power2.out',
        });

        /* ── Dark section ── */
        gsap.from('.dark-quote p', {
          x: 50,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.dark-section',
            start: 'top 70%',
          },
        });

        gsap.from('.dark-desc p', {
          y: 30,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.dark-row',
            start: 'top 80%',
          },
        });

        gsap.from('.dark-img-placeholder', {
          scale: 0.94,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.dark-row',
            start: 'top 80%',
          },
        });

        /* ── Dividers expand ── */
        gsap.utils.toArray('.divider').forEach((el) => {
          gsap.from(el, {
            scaleX: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 90%' },
          });
        });

        /* ── Case rows fade up ── */
        gsap.utils.toArray('.case-row').forEach((el) => {
          gsap.from(el, {
            y: 48,
            opacity: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%' },
          });
        });
      });
    }

    init();

    return () => {
      lenis?.destroy();
      ctx?.revert();
      cancelAnimationFrame(tiltRafId);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <>
      {/* ── HEADER ── */}
      <header className="header">
        <div className="logo">arsendsgn</div>
        <nav className="nav">
          <div className="nav-item square">About me</div>
          <div className="nav-item pill">Cases</div>
          <div className="nav-item square">Contacts</div>
          <div className="nav-item pill">Resume</div>
        </nav>
        <div className="header-hint">Press / for?</div>
      </header>

      {/* ── HERO ── */}
      <section className="hero">
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
            <div className="tag pill pink" data-word>
              <span className="tag-lg">Arsen</span>
            </div>
            <div className="tag square glass" data-word>
              <span className="tag-xl">Arakelyan</span>
            </div>
          </div>
          <div className="hero-row">
            <div className="tag pill glass" data-word>
              <span className="tag-xl">Product</span>
            </div>
            <div className="tag square glass" data-word>
              <span className="tag-xl">Designer</span>
            </div>
            <div className="tag pill lavender" data-word>
              <span className="tag-lg">MTS Fintech</span>
            </div>
          </div>
        </div>

        <div className="hero-bottom">
          <div className="hero-exp">
            <span>2 years experience</span>
          </div>
          <div className="hero-socials">
            <div className="badge-wrap">
              <span className="badge yellow">Say Hi</span>
            </div>
            <div className="badge-wrap">
              <span className="badge button">t.me/arsendsgn</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── DARK SECTION ── */}
      <section className="dark-section">
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
      <section className="cases-section">
        <div className="divider" />

        {/* Case 01: Sber — image left */}
        <div className="case-row">
          <div className="case-img-box">
            <img
              src="https://www.figma.com/api/mcp/asset/32894ddf-f6ee-42fd-adcb-3a989bab3a9d"
              alt="Sber case"
            />
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

        {/* Case 02: T-Journal — info left, image right */}
        <div className="case-row">
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
              <p>T-j reaches 42 million readers, but fewer than 20% are T-Bank clients. The project goal is to connect T-j and T-Bank through user scenarios without undermining trust in the media. The focus is on the "Travel" section — one of the platform's most popular and engaging areas.</p>
            </div>
          </div>
          <div className="case-img-box">
            <img
              src="https://www.figma.com/api/mcp/asset/62bad97c-1111-4c11-91e6-60e37a2135a5"
              alt="T-Journal case"
            />
          </div>
        </div>

        <div className="divider" />
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <nav className="footer-nav">
          <div className="footer-nav-item square">Product</div>
          <div className={`footer-nav-item lavender cycling${fade1 ? ' fade' : ''}`}>
            {word1}
          </div>
          <div className="footer-nav-item square">Designer</div>
          <div className={`footer-nav-item pink cycling${fade2 ? ' fade' : ''}`}>
            {word2}
          </div>
        </nav>
        <div className="footer-bottom">
          <div className="footer-copy">
            <span>© 2026 Arsen Arakelyan</span>
          </div>
          <div className="badge-wrap">
            <span className="badge yellow">Download CV</span>
          </div>
          <div className="footer-links">
            <div className="badge-wrap"><span className="badge primary">E-mail</span></div>
            <div className="badge-wrap"><span className="badge primary">Telegram</span></div>
            <div className="badge-wrap"><span className="badge primary">LinkedIn</span></div>
          </div>
        </div>
      </footer>
    </>
  );
}

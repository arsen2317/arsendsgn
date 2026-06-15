'use client';

import { useEffect, useRef } from 'react';
import styles from './RevolutSkills.module.css';

const base = process.env.NEXT_PUBLIC_BASE_PATH || '';

const HARD = [
  'Prototyping',
  { icon: true, key: 'Figma', src: `${base}/images/figma.svg`, alt: 'Figma' },
  'UI Design', ['Design', 'Systems'],
  ['User', 'Research'],
  { icon: true, key: 'After Effects', src: `${base}/images/ae.svg`, alt: 'After Effects' },
  'Usability', 'User Flow',
  'CJM', 'JTBD',
  { icon: true, key: 'Claude Code', src: `${base}/images/claude.svg`, alt: 'Claude Code' },
  'A/B Testing', 'Accessibility',
];

const SOFT = [
  'Empathy', 'Curiosity', ['Critical', 'Thinking'],
  ['Attention', 'to Detail'], 'Proactivity', 'Teamwork',
];

/* Revolut brand palette — cycled across the falling chips */
const PALETTE = [
  { bg: '#1326FD', color: '#FAF6EF' }, // Deep Blue
  { bg: '#6FA0FF', color: '#FAF6EF' }, // Mid Blue
  { bg: '#C6D9FD', color: '#0D0D0E' }, // Light Blue
  { bg: '#A7AAF8', color: '#0D0D0E' }, // Mid Purple
  { bg: '#CACCFB', color: '#0D0D0E' }, // Light Purple
  { bg: '#9539F2', color: '#FAF6EF' }, // Purple
  { bg: '#BFFF37', color: '#0D0D0E' }, // Lime
];

const ITEMS = [...HARD, ...SOFT];

/* Falling-skills physics, recolored with Revolut brand palette — used inside the
   revolut-interview slide deck. Same matter-js setup as components/Skills.js. */
export default function RevolutSkills() {
  const containerRef = useRef(null);
  const startedRef   = useRef(false);
  const cleanupRef   = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const startPhysics = async () => {
      if (startedRef.current) return;
      startedRef.current = true;

      const Matter = await import('matter-js');
      const { Engine, Bodies, Body, Composite, Runner } = Matter;

      const W = container.offsetWidth;
      const H = container.offsetHeight;
      const containerTopFromViewport = container.getBoundingClientRect().top;

      const engine = Engine.create({ gravity: { y: 0.7 } });
      const bodies = [];

      const elements = container.querySelectorAll('[data-skill]');

      elements.forEach((el) => {
        const w = el.offsetWidth;
        const h = el.offsetHeight;
        const isSoft = el.dataset.type === 'soft';
        const chamfer = isSoft ? h / 2 : 6;

        const x = W / 2 + (Math.random() - 0.5) * W * 0.6;
        const y = -containerTopFromViewport - h - Math.random() * window.innerHeight * 0.6;

        const body = Bodies.rectangle(x, y, w, h, {
          chamfer: { radius: chamfer },
          restitution: 0.25,
          friction: 0.8,
          frictionAir: 0.015,
          angle: (Math.random() - 0.5) * 0.8,
        });

        Body.setVelocity(body, {
          x: (Math.random() - 0.5) * 8,
          y: Math.random() * 2,
        });

        Composite.add(engine.world, body);
        bodies.push({ body, el, w, h });
        el.style.visibility = 'visible';
      });

      const floor = Bodies.rectangle(W / 2, H + 25, W * 2, 50, { isStatic: true });
      const wallL = Bodies.rectangle(-25, H / 2, 50, H * 3, { isStatic: true });
      const wallR = Bodies.rectangle(W + 25, H / 2, 50, H * 3, { isStatic: true });
      Composite.add(engine.world, [floor, wallL, wallR]);

      // Cursor "bumper" — a static body that follows the pointer and knocks chips around
      const cursor = Bodies.circle(-100, -100, 36, { isStatic: true });
      Composite.add(engine.world, cursor);

      const onPointerMove = (e) => {
        const rect = container.getBoundingClientRect();
        Body.setPosition(cursor, { x: e.clientX - rect.left, y: e.clientY - rect.top });
      };
      const onPointerLeave = () => Body.setPosition(cursor, { x: -100, y: -100 });
      container.addEventListener('pointermove', onPointerMove);
      container.addEventListener('pointerleave', onPointerLeave);

      const runner = Runner.create();
      Runner.run(runner, engine);

      let rafId;
      const sync = () => {
        bodies.forEach(({ body, el, w, h }) => {
          const { x, y } = body.position;
          el.style.left = `${x - w / 2}px`;
          el.style.top = `${y - h / 2}px`;
          el.style.transform = `rotate(${body.angle}rad)`;
        });
        rafId = requestAnimationFrame(sync);
      };
      sync();

      cleanupRef.current = () => {
        cancelAnimationFrame(rafId);
        container.removeEventListener('pointermove', onPointerMove);
        container.removeEventListener('pointerleave', onPointerLeave);
        Runner.stop(runner);
        Engine.clear(engine);
      };
    };

    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) startPhysics(); },
      { threshold: 0.1 }
    );
    observer.observe(container);

    return () => {
      observer.disconnect();
      cleanupRef.current?.();
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.field}>
      {ITEMS.map((s, i) => {
        const palette = PALETTE[i % PALETTE.length];
        const style = { background: palette.bg, color: palette.color };

        if (s.icon) {
          return (
            <span key={s.key} className={styles.icon} style={style} data-skill={s.key} data-type="hard">
              <img src={s.src} alt={s.alt} className={`${styles.iconImg}${s.key === 'After Effects' ? ' ' + styles.ae : ''}`} />
            </span>
          );
        }
        const key = Array.isArray(s) ? s.join(' ') : s;
        const isSoft = SOFT.includes(s);
        return (
          <span
            key={key}
            className={`${isSoft ? styles.soft : styles.hard} ${Array.isArray(s) ? styles.multiline : ''}`}
            style={style}
            data-skill={key}
            data-type={isSoft ? 'soft' : 'hard'}
          >
            {Array.isArray(s) ? <>{s[0]}<br />{s[1]}</> : s}
          </span>
        );
      })}
    </div>
  );
}

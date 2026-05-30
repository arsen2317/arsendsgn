'use client';

import { useEffect, useRef } from 'react';
import styles from './Skills.module.css';

const HARD = [
  'Prototyping',
  { icon: true, key: 'Figma', src: '/images/figma.svg', alt: 'Figma' },
  'UI Design', ['Design', 'Systems'],
  ['User', 'Research'],
  { icon: true, key: 'After Effects', src: '/images/ae.svg', alt: 'After Effects' },
  'Usability', 'User Flow',
  'CJM', 'JTBD',
  { icon: true, key: 'Claude Code', src: '/images/claude.svg', alt: 'Claude Code' },
  'A/B Testing', 'Accessibility',
];

const SOFT = [
  'Empathy', 'Curiosity', ['Critical', 'Thinking'],
  ['Attention', 'to Detail'], 'Proactivity', 'Teamwork',
];

export default function Skills() {
  const sectionRef = useRef(null);
  const startedRef = useRef(false);
  const cleanupRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const startPhysics = async () => {
      if (startedRef.current) return;
      startedRef.current = true;

      const Matter = await import('matter-js');
      const { Engine, Bodies, Body, Composite, Runner } = Matter;

      const W = section.offsetWidth;
      const H = section.offsetHeight;

      const engine = Engine.create({ gravity: { y: 0.7 } });
      const bodies = [];

      const elements = section.querySelectorAll('[data-skill]');

      elements.forEach((el) => {
        const w = el.offsetWidth;
        const h = el.offsetHeight;
        const isSoft = el.dataset.type === 'soft';
        const chamfer = isSoft ? h / 2 : 6;

        // All start from same burst point: center, just above viewport top
        const x = W / 2 + (Math.random() - 0.5) * 40;
        const y = -h / 2 - 20 - Math.random() * 30;

        const body = Bodies.rectangle(x, y, w, h, {
          chamfer: { radius: chamfer },
          restitution: 0.25,
          friction: 0.8,
          frictionAir: 0.015,
          angle: (Math.random() - 0.5) * 0.3,
        });

        // Random burst velocity: spread outward in all directions
        Body.setVelocity(body, {
          x: (Math.random() - 0.5) * 14,
          y: Math.random() * -3,
        });

        Composite.add(engine.world, body);
        bodies.push({ body, el, w, h });
        el.style.visibility = 'visible';
      });

      // Floor = footer top border (section bottom)
      const floor = Bodies.rectangle(W / 2, H + 25, W * 2, 50, { isStatic: true });
      const wallL = Bodies.rectangle(-25, H / 2, 50, H * 3, { isStatic: true });
      const wallR = Bodies.rectangle(W + 25, H / 2, 50, H * 3, { isStatic: true });
      Composite.add(engine.world, [floor, wallL, wallR]);

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
        Runner.stop(runner);
        Engine.clear(engine);
      };
    };

    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) startPhysics(); },
      { threshold: 0.1 }
    );
    observer.observe(section);

    return () => {
      observer.disconnect();
      cleanupRef.current?.();
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.skills}>
      <p className={styles.title}>Skills That Drive<br />All My Projects</p>
      {HARD.map(s => {
        if (s.icon) {
          return (
            <span key={s.key} className={styles.icon} data-skill={s.key} data-type="hard">
              <img src={s.src} alt={s.alt} className={`${styles.iconImg}${s.key === 'After Effects' ? ' ' + styles.ae : ''}`} />
            </span>
          );
        }
        const key = Array.isArray(s) ? s.join(' ') : s;
        return (
          <span key={key} className={`${styles.hard} ${Array.isArray(s) ? styles.multiline : ''}`} data-skill={key} data-type="hard">
            {Array.isArray(s) ? <>{s[0]}<br />{s[1]}</> : s}
          </span>
        );
      })}
      {SOFT.map(s => {
        const key = Array.isArray(s) ? s.join(' ') : s;
        return (
          <span key={key} className={`${styles.soft} ${Array.isArray(s) ? styles.multiline : ''}`} data-skill={key} data-type="soft">
            {Array.isArray(s) ? <>{s[0]}<br />{s[1]}</> : s}
          </span>
        );
      })}
    </section>
  );
}

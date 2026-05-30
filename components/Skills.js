'use client';

import { useEffect, useRef } from 'react';
import styles from './Skills.module.css';

const HARD = [
  'Figma', 'Prototyping', 'UI Design', 'Design Systems',
  'User Research', 'Usability Testing', 'User Flow',
  'CJM', 'JTBD', 'A/B Testing',
  'After Effects', 'Claude Code', 'Accessibility',
];

const SOFT = [
  'Empathy', 'Curiosity', 'Critical Thinking',
  'Attention to Detail', 'Proactivity', 'Teamwork',
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
      const { Engine, Bodies, Composite, Runner } = Matter;

      const W = section.offsetWidth;
      const H = section.offsetHeight;

      // Gravity ~3x slower than default (was 2.2)
      const engine = Engine.create({ gravity: { y: 0.7 } });
      const bodies = [];

      const elements = section.querySelectorAll('[data-skill]');

      elements.forEach((el, i) => {
        const w = el.offsetWidth;
        const h = el.offsetHeight;
        const isSoft = el.dataset.type === 'soft';
        const chamfer = isSoft ? h / 2 : 6;

        // Start clustered around center, above viewport top
        const spread = W * 0.25;
        const x = Math.max(w / 2, Math.min(W - w / 2, W / 2 + (Math.random() - 0.5) * 2 * spread));
        const y = -h - Math.random() * H * 0.9;

        const body = Bodies.rectangle(x, y, w, h, {
          chamfer: { radius: chamfer },
          restitution: 0.18,
          friction: 0.85,
          frictionAir: 0.018,
          angle: (Math.random() - 0.5) * 0.5,
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
      {HARD.map(s => (
        <span key={s} className={styles.hard} data-skill={s} data-type="hard">{s}</span>
      ))}
      {SOFT.map(s => (
        <span key={s} className={styles.soft} data-skill={s} data-type="soft">{s}</span>
      ))}
    </section>
  );
}

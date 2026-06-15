'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './IterationsStack.module.css';

const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
const COUNT = 21;

/* Deterministic pseudo-random spread so each card lands in the same spot every render */
const seeded = (i, scale) => {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return ((x - Math.floor(x)) - 0.5) * 2 * scale;
};

/* Quick "cards falling into a stack" reveal — used on the design-iterations slide */
export default function IterationsStack() {
  const containerRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={styles.field}>
      {Array.from({ length: COUNT }, (_, i) => {
        const n = i + 1;
        const angle = seeded(i, 12);
        const x = seeded(i * 1.7, 7);
        const y = seeded(i * 2.3, 5);
        const style = visible
          ? {
              transform: `translate(calc(-50% + ${x}%), calc(-50% + ${y}%)) rotate(${angle}deg)`,
              transitionDelay: `${i * 45}ms`,
              zIndex: n,
            }
          : { transform: 'translate(-50%, 130%) rotate(0deg)', zIndex: n };

        return (
          <img
            key={n}
            src={`${base}/images/${n}.png`}
            alt=""
            className={`${styles.card}${visible ? ' ' + styles.visible : ''}`}
            style={style}
          />
        );
      })}
    </div>
  );
}

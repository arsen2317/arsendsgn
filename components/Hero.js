'use client';

import { useEffect, useRef } from 'react';
import styles from './Hero.module.css';

export default function Hero() {
  const heroRef = useRef(null);

  useEffect(() => {
    let ctx;

    async function initGsap() {
      const { gsap } = await import('gsap');

      ctx = gsap.context(() => {
        gsap.fromTo(
          '[data-word]',
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.12,
            duration: 0.9,
            ease: 'back.out(2)',
            delay: 0.2,
          }
        );
      }, heroRef);
    }

    initGsap();

    return () => {
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <section className={styles.hero} ref={heroRef} id="hero">
      {/* Geometric decorative element */}
      <div className={styles.geometric} aria-hidden="true">
        <div className={styles.diamond} />
        <div className={styles.ring} />
        <div className={styles.dot} />
      </div>

      <div className={styles.content}>
        <h1 className={styles.heading}>
          <span className={styles.line1}>
            <span className={styles.nameFirst} data-word>
              Арсен
            </span>
          </span>
          <span className={styles.line2}>
            <span className={styles.nameLast} data-word>
              Аракелян
            </span>
          </span>
          <span className={styles.line3}>
            <span
              className={`${styles.pill} ${styles.pillLavender}`}
              data-word
            >
              Продуктовый
            </span>
            <span
              className={`${styles.pill} ${styles.pillAccent}`}
              data-word
            >
              Дизайнер
            </span>
          </span>
        </h1>
      </div>

      {/* Bottom corners */}
      <div className={styles.bottomLeft} data-word>
        Создаю с 2022 года
      </div>
      <a
        href="mailto:arackelian.arsen@gmail.com"
        className={styles.bottomRight}
        data-word
      >
        Написать →
      </a>
    </section>
  );
}

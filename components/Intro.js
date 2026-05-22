'use client';

import { useEffect, useRef } from 'react';
import styles from './Intro.module.css';

export default function Intro() {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const colsRef = useRef(null);

  useEffect(() => {
    let ctx;

    async function initGsap() {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        // Pin the section and animate text in
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=600',
            pin: true,
            anticipatePin: 1,
            scrub: 0.6,
          },
        });

        tl.fromTo(
          textRef.current,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1 }
        ).fromTo(
          colsRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1 },
          '-=0.4'
        );
      }, sectionRef);
    }

    initGsap();

    return () => {
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <section className={styles.intro} id="intro" ref={sectionRef}>
      <div className={styles.inner}>
        <p className={styles.bigText} ref={textRef}>
          Создаю цифровые продукты, которые понятны, нужны и приятны в
          использовании
        </p>

        <div className={styles.cols} ref={colsRef}>
          <div className={styles.colLeft}>
            <p className={styles.bio}>
              Три года работаю с командами Сбера, Т-Банка и медиа. Фокус на
              исследованиях, проектировании и системах.
            </p>
          </div>
          <div className={styles.colRight}>
            <div className={styles.videoPlaceholder}>
              <svg
                className={styles.playBtn}
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="32"
                  cy="32"
                  r="31"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="2"
                />
                <path d="M26 20L46 32L26 44V20Z" fill="white" fillOpacity="0.8" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

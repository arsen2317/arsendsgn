'use client';

import { useEffect, useRef } from 'react';
import styles from './Cases.module.css';

const cases = [
  {
    id: 'sber',
    name: 'Сбер',
    desc: 'Мобильный банк',
    tags: ['Банки', 'iOS', 'Android'],
    year: '2024',
    href: '/cases/sber',
  },
  {
    id: 'vibes',
    name: 'Vibes',
    desc: 'Социальная сеть',
    tags: ['Соцсети', 'Mobile'],
    year: '2023',
    href: '/cases/vibes',
  },
  {
    id: 'tj',
    name: 'Т—Ж',
    desc: 'Медиа о финансах',
    tags: ['Медиа', 'Web'],
    year: '2023',
    href: '/cases/tj',
  },
  {
    id: 'tbank',
    name: 'Т-Банк',
    desc: 'Экосистема банка',
    tags: ['Финтех', 'iOS'],
    year: '2024',
    href: '/cases/tbank',
  },
];

export default function Cases() {
  const sectionRef = useRef(null);

  useEffect(() => {
    let ctx;

    async function initGsap() {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        gsap.fromTo(
          '[data-card]',
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.15,
            duration: 0.8,
            ease: 'back.out(1.5)',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
            },
          }
        );
      }, sectionRef);
    }

    initGsap();

    return () => {
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <section className={styles.cases} id="cases" ref={sectionRef}>
      <div className={styles.inner}>
        <h2 className={styles.heading}>Работы</h2>
        <div className={styles.grid}>
          {cases.map((c) => (
            <a key={c.id} href={c.href} className={styles.card} data-card>
              <div className={styles.cardImage} />
              <div className={styles.cardBody}>
                <div className={styles.cardTop}>
                  <div>
                    <h3 className={styles.cardName}>{c.name}</h3>
                    <p className={styles.cardDesc}>{c.desc}</p>
                  </div>
                  <div className={styles.cardTags}>
                    {c.tags.map((tag) => (
                      <span key={tag} className={styles.tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className={styles.cardBottom}>
                  <span className={styles.cardYear}>{c.year}</span>
                  <span className={styles.cardArrow}>→</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';

import { useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Intro from '../components/Intro';
import Cases from '../components/Cases';
import Footer from '../components/Footer';

export default function Home() {
  useEffect(() => {
    let lenis;
    let rafId;

    async function initLenis() {
      const { default: Lenis } = await import('lenis');

      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
      });

      function raf(time) {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      }

      rafId = requestAnimationFrame(raf);
    }

    initLenis();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (lenis) lenis.destroy();
    };
  }, []);

  return (
    <main>
      <Header />
      <Hero />
      <Intro />
      <Cases />
      <Footer />
    </main>
  );
}

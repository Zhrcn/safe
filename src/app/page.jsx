'use client';
import { useEffect, useRef, useCallback, useState } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import AboutSection from '@/components/AboutSection';
import RolesSection from '@/components/RolesSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import Footer from '@/components/Footer';
import anime from 'animejs';

// Custom hook for scroll-triggered animation
function useSectionInView(ref, animateFn) {
  useEffect(() => {
    if (!ref.current) return;
    const node = ref.current;
    let hasAnimated = false;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          animateFn(node);
          observer.unobserve(node);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(node);
    // Fallback: if animation doesn't run, set opacity to 1 after 2s
    const fallback = setTimeout(() => {
      if (!hasAnimated && node) {
        node.style.opacity = 1;
      }
    }, 2000);
    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, [ref, animateFn]);
}

// SVGs for heart and plus icons
const HeartSVG = ({ style, className }) => (
  <svg width="60" height="60" viewBox="0 0 60 60" fill="none" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
    <path d="M30 44c-6-5-14-9-14-16a8 8 0 0 1 16 0 8 8 0 0 1 16 0c0 7-8 11-14 16z" fill="#F87171" fillOpacity="0.18" />
  </svg>
);
const PlusSVG = ({ style, className }) => (
  <svg width="60" height="60" viewBox="0 0 60 60" fill="none" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
    <rect x="22" y="22" width="16" height="16" rx="4" fill="#38BDF8" fillOpacity="0.13" />
    <path d="M38 30h-4v-4a2 2 0 1 0-4 0v4h-4a2 2 0 1 0 0 4h4v4a2 2 0 1 0 4 0v-4h4a2 2 0 1 0 0-4z" fill="#FBBF24" fillOpacity="0.13" />
  </svg>
);

export default function Home() {
  const bgRef = useRef(null);
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const aboutRef = useRef(null);
  const rolesRef = useRef(null);
  const testimonialsRef = useRef(null);

  // Refs for each icon
  const heart1Ref = useRef(null);
  const plus1Ref = useRef(null);
  const heart2Ref = useRef(null);
  const plus2Ref = useRef(null);

  // Animation state (not React state)
  const mouseTarget = useRef({ x: 0, y: 0 }); // -1 to 1
  const iconStates = useRef([
    { x: 0, y: 0 }, // heart1
    { x: 0, y: 0 }, // plus1
    { x: 0, y: 0 }, // heart2
    { x: 0, y: 0 }, // plus2
  ]);
  const floatPhases = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
  const lags = [0.08, 0.12, 0.10, 0.14]; // unique lag for each icon
  const animFrame = useRef();

  // Mouse parallax handler (no React state)
  const handleMouseMove = (e) => {
    const rect = bgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to 1
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    mouseTarget.current = { x, y };
  };
  const handleMouseLeave = () => {
    mouseTarget.current = { x: 0, y: 0 };
  };

  // Animation loop
  useEffect(() => {
    let running = true;
    function animate() {
      const now = performance.now() / 1000; // seconds
      // Target positions
      const targets = [
        { x: mouseTarget.current.x * 18, y: mouseTarget.current.y * 12 },
        { x: mouseTarget.current.x * -12, y: mouseTarget.current.y * 18 },
        { x: mouseTarget.current.x * 10, y: mouseTarget.current.y * -10 },
        { x: mouseTarget.current.x * -16, y: mouseTarget.current.y * -8 },
      ];
      // Float amplitudes
      const floats = [8, 10, 7, 9];
      // For each icon, lerp toward target and add float
      [heart1Ref, plus1Ref, heart2Ref, plus2Ref].forEach((ref, i) => {
        // Lerp
        iconStates.current[i].x += (targets[i].x - iconStates.current[i].x) * lags[i];
        iconStates.current[i].y += (targets[i].y - iconStates.current[i].y) * lags[i];
        // Idle float
        const floatY = Math.sin(now * 1.1 + floatPhases[i]) * floats[i];
        const floatR = Math.sin(now * 0.7 + floatPhases[i]) * 2; // subtle rotation
        if (ref.current) {
          ref.current.style.transform = `translate(${iconStates.current[i].x}px, ${iconStates.current[i].y + floatY}px) scale(${[1.2,1.1,1.3,1.05][i]}) rotate(${floatR}deg)`;
        }
      });
      if (running) animFrame.current = requestAnimationFrame(animate);
    }
    animFrame.current = requestAnimationFrame(animate);
    return () => {
      running = false;
      if (animFrame.current) cancelAnimationFrame(animFrame.current);
    };
  }, []);

  // Section scroll-triggered animations
  useSectionInView(heroRef, node => {
    anime({
      targets: node,
      opacity: [0, 1],
      translateY: [40, 0],
      duration: 800,
      easing: 'easeOutExpo',
    });
  });
  useSectionInView(featuresRef, node => {
    anime({
      targets: node,
      opacity: [0, 1],
      translateY: [40, 0],
      duration: 800,
      easing: 'easeOutExpo',
    });
  });
  useSectionInView(aboutRef, node => {
    anime({
      targets: node,
      opacity: [0, 1],
      translateY: [40, 0],
      duration: 800,
      easing: 'easeOutExpo',
    });
  });
  useSectionInView(rolesRef, node => {
    anime({
      targets: node,
      opacity: [0, 1],
      translateY: [40, 0],
      duration: 800,
      easing: 'easeOutExpo',
    });
  });
  useSectionInView(testimonialsRef, node => {
    anime({
      targets: node,
      opacity: [0, 1],
      translateY: [40, 0],
      duration: 800,
      easing: 'easeOutExpo',
    });
  });

  return (
    <div
      ref={bgRef}
      className="min-h-screen w-full bg-gradient-to-br from-background via-muted/60 to-background text-foreground relative overflow-x-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Animated medical icons background */}
      <div className="pointer-events-none select-none fixed inset-0 z-0 opacity-40 contrast-125" aria-hidden="true">
        {/* Heart */}
        <span style={{ position: 'absolute', left: `10%`, top: `18%` }}>
          <HeartSVG ref={heart1Ref} />
        </span>
        {/* Plus */}
        <span style={{ position: 'absolute', left: `60%`, top: `10%` }}>
          <PlusSVG ref={plus1Ref} />
        </span>
        {/* Heart */}
        <span style={{ position: 'absolute', left: `75%`, top: `60%` }}>
          <HeartSVG ref={heart2Ref} />
        </span>
        {/* Plus */}
        <span style={{ position: 'absolute', left: `20%`, top: `70%` }}>
          <PlusSVG ref={plus2Ref} />
        </span>
      </div>
      <main className="relative z-10 w-full flex flex-col gap-0">
        <Navbar />
        <section
          className="mb-0" ref={heroRef} style={{ opacity: 0 }}>
          <HeroSection />
        </section>
        {/* Section divider */}
        <div className="w-full h-8 bg-gradient-to-b from-transparent to-muted/30" />
        <section
          className="py-0" ref={featuresRef} style={{ opacity: 0 }}>
          <FeaturesSection />
        </section>
        <div className="w-full h-8 bg-gradient-to-b from-transparent to-muted/40" />
        <section
          className="py-0" ref={aboutRef} style={{ opacity: 0 }}>
          <AboutSection />
        </section>
        <div className="w-full h-8 bg-gradient-to-b from-transparent to-muted/30" />
        <section
          className="py-0" ref={rolesRef} style={{ opacity: 0 }}>
          <RolesSection />
        </section>
        <div className="w-full h-8 bg-gradient-to-b from-transparent to-muted/40" />
        <section
          className="py-0" ref={testimonialsRef} style={{ opacity: 0 }}>
          <TestimonialsSection />
        </section>
        <Footer />
      </main>
    </div>
  );
}
'use client';
import React, { useRef, useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';

export default function HeroSection() {
  const { t, ready } = useTranslation();
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const containerRef = useRef(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setParallax({ x, y });
  };
  const handleMouseLeave = () => setParallax({ x: 0, y: 0 });

  const [colorIndex, setColorIndex] = useState(0);
  const colorCycle = [
    'var(--color-primary)',
    'var(--color-secondary)',
    'var(--color-success)',
    'var(--color-warning)',
    'var(--color-accent)',
    'var(--color-muted)',
    'var(--color-background)'
  ];
  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((i) => (i + 1) % colorCycle.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  if (!ready) return null;

  return (
    <section className="relative overflow-hidden text-primary-foreground py-16 md:py-20 bg-transparent mt-0">
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] rounded-full bg-gradient-radial from-primary/20 via-secondary/10 to-background opacity-50 dark:opacity-30 animate-pulse-slow blur-2xl" />
      </div>
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-14 items-center">
          <div className="md:col-span-6 flex flex-col items-start justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full"
            >
              <h1 className="text-5xl md:text-6xl font-extrabold mb-8 leading-tight tracking-tight drop-shadow-xl text-shadow-lg text-primary dark:text-white dark:drop-shadow-[0_4px_32px_rgba(0,180,255,0.25)]">
                {t('hero.title', 'Your Health, Our Priority')}
              </h1>
              <p className="text-xl md:text-2xl mb-12 opacity-90 max-w-2xl font-normal text-muted-foreground dark:text-muted">
                {t('hero.description', 'A modern platform for patients, doctors, and pharmacists to connect, manage care, and improve health outcomes.')}
              </p>
              <div className="flex flex-wrap sm:flex-nowrap gap-8 mt-4">
                <motion.div
                  initial={{ boxShadow: '0 0 0 0 rgba(0,0,0,0)' }}
                  animate={{ boxShadow: '0 0 32px 0 var(--color-secondary, #00A3E0)' }}
                  transition={{ duration: 1.2, repeat: Infinity, repeatType: 'reverse' }}
                  className="rounded-full animate-pulse-fast"
                >
                  <Button
                    variant="default"
                    onClick={() => scrollToSection('roles')}
                    className="px-10 py-5 text-xl font-bold rounded-full border-4 bg-primary text-primary-foreground  hover:bg-primary/10 hover:text-primary-foreground transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary/60 focus:ring-offset-2 shadow-lg dark:border-white dark:text-white dark:bg-transparent"

                  >
                    {t('hero.getStarted', 'Get Started')}
                  </Button>
                </motion.div>
                <Button
                  onClick={() => scrollToSection('features')}
                  className="px-10 py-5 text-xl font-bold rounded-full border-4 border-primary text-primary bg-white hover:bg-primary/10 hover:text-primary-foreground transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary/60 focus:ring-offset-2 shadow-lg dark:border-white dark:text-white dark:bg-transparent"
                >
                  {t('hero.learnMore', 'Learn More')}
                </Button>
              </div>
            </motion.div>
          </div>
          <div className="hidden md:block md:col-span-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <motion.div
                ref={containerRef}
                className="relative w-full h-[420px] flex justify-center items-center bg-white/40 dark:bg-[#232a36]/60 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl shadow-xl"
                animate={{
                  y: [0, -18, 0, 18, 0],
                  scale: [1, 1.04, 1, 0.98, 1],
                  filter: [
                    'brightness(1)',
                    'brightness(1.08)',
                    'brightness(1)',
                    'brightness(0.96)',
                    'brightness(1)'
                  ],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <motion.svg
                  width="380"
                  height="340"
                  viewBox="0 0 380 340"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full max-w-[380px] max-h-[340px] drop-shadow-2xl"
                  style={{
                    x: parallax.x * 18,
                    y: parallax.y * 18,
                  }}
                >
                  <rect x="20" y="40" width="340" height="220" rx="32" fill="#fff" fillOpacity="0.9" />
                  <rect x="40" y="60" width="120" height="40" rx="12" fill={colorCycle[(colorIndex+0)%colorCycle.length]} />
                  <rect x="180" y="60" width="140" height="40" rx="12" fill={colorCycle[(colorIndex+1)%colorCycle.length]} />
                  <rect x="40" y="120" width="280" height="24" rx="8" fill={colorCycle[(colorIndex+2)%colorCycle.length]} />
                  <rect x="40" y="160" width="80" height="40" rx="12" fill={colorCycle[(colorIndex+3)%colorCycle.length]} />
                  <rect x="140" y="160" width="180" height="40" rx="12" fill={colorCycle[(colorIndex+4)%colorCycle.length]} />
                  <circle cx="320" cy="220" r="24" fill={colorCycle[(colorIndex+5)%colorCycle.length]} />
                  <rect x="60" y="220" width="60" height="20" rx="8" fill={colorCycle[(colorIndex+6)%colorCycle.length]} />
                  <rect x="140" y="220" width="120" height="20" rx="8" fill={colorCycle[(colorIndex+1)%colorCycle.length]} />
                  <rect x="280" y="220" width="20" height="20" rx="8" fill={colorCycle[(colorIndex+2)%colorCycle.length]} />
                  <polyline points="60,200 100,180 140,210 180,170 220,200 260,160 300,210" stroke="#38BDF8" strokeWidth="3" fill="none" />
                  <circle cx="60" cy="90" r="12" fill="#38BDF8" />
                  <circle cx="90" cy="90" r="12" fill="#FBBF24" />
                  <circle cx="120" cy="90" r="12" fill="#F87171" />
                </motion.svg>
                <motion.div
                  animate={{
                    y: [0, -10, 0, 10, 0],
                    scale: [1, 1.08, 1, 0.96, 1],
                    x: parallax.x * 10,
                    y: parallax.y * 10 - 40,
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute left-4 top-4 bg-white/90 dark:bg-[#232a36]/90 rounded-xl shadow-2xl border-2 border-primary/30 px-4 py-2 flex flex-col items-center animate-glow"
                  style={{ minWidth: 90 }}
                >
                  <span className="text-xs font-semibold text-primary mb-1">{t('hero.today', 'Today')}</span>
                  <span className="text-lg font-bold text-foreground">3 {t('hero.appointments', 'Appts')}</span>
                </motion.div>
                <motion.div
                  animate={{
                    y: [0, 10, 0, -10, 0],
                    scale: [1, 1.08, 1, 0.96, 1],
                    x: parallax.x * 10 + 40,
                    y: parallax.y * 10 + 40,
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute right-8 bottom-8 bg-white/90 dark:bg-[#232a36]/90 rounded-xl shadow-2xl border-2 border-primary/30 px-4 py-2 flex flex-col items-center animate-glow"
                  style={{ minWidth: 90 }}
                >
                  <span className="text-xs font-semibold text-primary mb-1">{t('hero.prescriptions', 'Prescriptions')}</span>
                  <span className="text-lg font-bold text-foreground">5 {t('hero.active', 'Active')}</span>
                </motion.div>
                <motion.div
                  animate={{
                    y: [0, -8, 0, 8, 0],
                    scale: [1, 1.08, 1, 0.96, 1],
                    x: parallax.x * 10,
                    y: parallax.y * 10 + 60,
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                  className="absolute left-1/2 -translate-x-1/2 bottom-2 bg-white/90 dark:bg-[#232a36]/90 rounded-xl shadow-2xl border-2 border-primary/30 px-4 py-2 flex flex-col items-center animate-glow"
                  style={{ minWidth: 90 }}
                >
                  <span className="text-xs font-semibold text-primary mb-1">{t('hero.patients', 'Patients')}</span>
                  <span className="text-lg font-bold text-foreground">12</span>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
} 
'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { APP_NAME, APP_DESCRIPTION } from '@/config/app-config';
import { Button } from '@/components/ui/Button';

export default function HeroSection() {
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-16 md:py-24">
      <div className="absolute bottom-0 left-0 w-full h-[70px] sm:h-[100px] md:h-[120px] z-10 pointer-events-none select-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          className="absolute bottom-0 w-full h-full"
          aria-hidden="true"
          focusable="false"
        >
          <path
            fill="white"
            fillOpacity="1"
            d="M0,224L48,197.3C96,171,192,117,288,122.7C384,128,480,192,576,197.3C672,203,768,149,864,133.3C960,117,1056,139,1152,154.7C1248,171,1344,181,1392,186.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-6 flex flex-col items-start justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full"
            >
              <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight tracking-tight drop-shadow-xl">
                {APP_NAME} Medical Platform
              </h1>
              <p className="text-lg md:text-2xl mb-10 opacity-90 max-w-2xl font-normal">
                {APP_DESCRIPTION}
              </p>
              <div className="flex flex-wrap sm:flex-nowrap gap-4">
                <motion.div
                  initial={{ boxShadow: '0 0 0 0 rgba(0,0,0,0)' }}
                  animate={{ boxShadow: '0 0 32px 0 var(--color-secondary, #00A3E0)' }}
                  transition={{ duration: 1.2, repeat: Infinity, repeatType: 'reverse' }}
                  className="rounded-full"
                >
                  <Button
                    onClick={() => scrollToSection('roles')}
                    className="px-7 py-3 text-base font-semibold rounded-full bg-secondary text-secondary-foreground shadow-lg hover:bg-secondary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary relative"
                  >
                    Get Started
                  </Button>
                </motion.div>
                <Button
                  onClick={() => scrollToSection('features')}
                  className="px-7 py-3 text-base font-semibold rounded-full border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary shadow"
                >
                  Learn More
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
              <div className="relative w-full h-[400px] flex justify-center items-center">
                {/* Dashboard SVG Illustration */}
                <svg
                  width="380"
                  height="340"
                  viewBox="0 0 380 340"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full max-w-[380px] max-h-[340px] drop-shadow-2xl"
                >
                  <rect x="20" y="40" width="340" height="220" rx="32" fill="#fff" fillOpacity="0.9" />
                  <rect x="40" y="60" width="120" height="40" rx="12" fill="#E0F2FE" />
                  <rect x="180" y="60" width="140" height="40" rx="12" fill="#F1F5F9" />
                  <rect x="40" y="120" width="280" height="24" rx="8" fill="#F1F5F9" />
                  <rect x="40" y="160" width="80" height="40" rx="12" fill="#E0F2FE" />
                  <rect x="140" y="160" width="180" height="40" rx="12" fill="#F1F5F9" />
                  <circle cx="320" cy="220" r="24" fill="#E0F2FE" />
                  <rect x="60" y="220" width="60" height="20" rx="8" fill="#F1F5F9" />
                  <rect x="140" y="220" width="120" height="20" rx="8" fill="#F1F5F9" />
                  <rect x="280" y="220" width="20" height="20" rx="8" fill="#F1F5F9" />
                  {/* Chart lines */}
                  <polyline points="60,200 100,180 140,210 180,170 220,200 260,160 300,210" stroke="#38BDF8" strokeWidth="3" fill="none" />
                  {/* Avatars */}
                  <circle cx="60" cy="90" r="12" fill="#38BDF8" />
                  <circle cx="90" cy="90" r="12" fill="#FBBF24" />
                  <circle cx="120" cy="90" r="12" fill="#F87171" />
                </svg>
                {/* Animated floating widgets */}
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1, delay: 0.6 }}
                  className="absolute left-4 top-4 bg-white/90 rounded-xl shadow-lg px-4 py-2 flex flex-col items-center"
                  style={{ minWidth: 90 }}
                >
                  <span className="text-xs font-semibold text-primary mb-1">Today</span>
                  <span className="text-lg font-bold text-foreground">3 Appts</span>
                </motion.div>
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1, delay: 0.8 }}
                  className="absolute right-8 bottom-8 bg-white/90 rounded-xl shadow-lg px-4 py-2 flex flex-col items-center"
                  style={{ minWidth: 90 }}
                >
                  <span className="text-xs font-semibold text-primary mb-1">Prescriptions</span>
                  <span className="text-lg font-bold text-foreground">5 Active</span>
                </motion.div>
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1, delay: 1 }}
                  className="absolute left-1/2 -translate-x-1/2 bottom-2 bg-white/90 rounded-xl shadow-lg px-4 py-2 flex flex-col items-center"
                  style={{ minWidth: 90 }}
                >
                  <span className="text-xs font-semibold text-primary mb-1">Patients</span>
                  <span className="text-lg font-bold text-foreground">12</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
} 
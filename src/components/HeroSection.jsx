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
                <Button
                  onClick={() => scrollToSection('roles')}
                  className="px-7 py-3 text-base font-semibold rounded-full bg-secondary text-secondary-foreground shadow-lg hover:bg-secondary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  Get Started
                </Button>
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
                <div className="w-full h-full rounded-3xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border-4 border-primary/20">
                  {/* Replace with an actual illustration or image for production */}
                  <p className="text-2xl opacity-70 font-semibold text-primary-foreground">
                    Medical Dashboard Illustration
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
} 
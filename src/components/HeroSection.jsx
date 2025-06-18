'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { APP_NAME, APP_DESCRIPTION } from '@/config/app-config';
export default function HeroSection() {
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
      <div className="absolute bottom-0 left-0 w-full h-[70px] sm:h-[100px] md:h-[120px] z-10">
        <svg 
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          className="absolute bottom-0 w-full h-full"
        >
          <path 
            fill="#fff" 
            fillOpacity="1" 
            d="M0,224L48,197.3C96,171,192,117,288,122.7C384,128,480,192,576,197.3C672,203,768,149,864,133.3C960,117,1056,139,1152,154.7C1248,171,1344,181,1392,186.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
          </path>
        </svg>
      </div>
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-12 pb-12 md:pb-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                {APP_NAME} Medical Platform
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl font-normal">
                {APP_DESCRIPTION}
              </p>
              <div className="flex flex-wrap sm:flex-nowrap gap-4">
                <button
                  onClick={() => scrollToSection('roles')}
                  className="px-6 py-3 text-base font-semibold rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors shadow-lg"
                >
                  Get Started
                </button>
                <button
                  onClick={() => scrollToSection('features')}
                  className="px-6 py-3 text-base font-semibold rounded-md border border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
                >
                  Learn More
                </button>
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
              <div className="relative w-full h-[400px] flex justify-center">
                {}
                <div className="w-full h-full rounded-xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-md flex items-center justify-center">
                  <p className="text-xl opacity-70">
                    Medical Dashboard Illustration
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
} 
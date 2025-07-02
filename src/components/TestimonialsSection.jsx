'use client';
import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Button } from "@/components/ui/Button";
import Section from './common/Section';
import GlassCard from './common/GlassCard';
import { useTranslation } from 'react-i18next';

export default function TestimonialsSection() {
  const { t, i18n } = useTranslation();
  const testimonials = useMemo(() => [
    {
      id: 1,
      name: t('testimonials.1.name', 'Sarah Johnson'),
      role: t('testimonials.1.role', 'Patient'),
      avatar: '/img/pep/patient-2.jpg',
      rating: 5,
      text: t('testimonials.1.text', 'This platform made it so easy to book appointments and manage my health records!')
    },
    {
      id: 2,
      name: t('testimonials.2.name', 'Dr. Ahmed Al-Farsi'),
      role: t('testimonials.2.role', 'Doctor'),
      avatar: '/img/docs/doctor-4.jpg',
      rating: 5,
      text: t('testimonials.2.text', 'A seamless experience for both doctors and patients. Highly recommended!')
    },
    {
      id: 3,
      name: t('testimonials.3.name', 'Fatima Al-Abbas'),
      role: t('testimonials.3.role', 'Pharmacist'),
      avatar: '/img/docs/doctor-3.jpg',
      rating: 4,
      text: t('testimonials.3.text', 'Managing prescriptions has never been easier. Great support team!')
    },
    {
      id: 4,
      name: t('testimonials.4.name', 'Mohammed Al-Sayed'),
      role: t('testimonials.4.role', 'Patient'),
      avatar: '/img/pep/patient-1.jpg',
      rating: 5,
      text: t('testimonials.4.text', 'I love the secure messaging feature and the quick response from doctors.')
    },
    {
      id: 5,
      name: t('testimonials.5.name', 'Dr. Lina Khaled'),
      role: t('testimonials.5.role', 'Doctor'),
      avatar: '/img/docs/doctor-5.jpg',
      rating: 5,
      text: t('testimonials.5.text', 'A must-have for every healthcare provider!')
    }
  ], [t]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const progressRef = useRef();
  const AUTOPLAY_INTERVAL = 6000;

  const isRtl = i18n.language === 'ar';

  useEffect(() => {
    if (!autoplay) return;
    if (progressRef.current) {
      progressRef.current.style.transition = 'none';
      progressRef.current.style.width = '0%';
      setTimeout(() => {
        if (progressRef.current) {
          progressRef.current.style.transition = `width ${AUTOPLAY_INTERVAL}ms linear`;
          progressRef.current.style.width = '100%';
        }
      }, 50);
    }
  }, [activeIndex, autoplay]);

  useEffect(() => {
    let interval;
    if (autoplay) {
      interval = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      }, AUTOPLAY_INTERVAL);
    }
    return () => clearInterval(interval);
  }, [autoplay, testimonials.length]);

  const handlePrev = () => {
    setAutoplay(false);
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };
  const handleNext = () => {
    setAutoplay(false);
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };
  const handleDotClick = (index) => {
    setAutoplay(false);
    setActiveIndex(index);
  };

  return (
    <Section
      id="testimonials"
      className="relative overflow-hidden bg-transparent py-12"
    >
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        <svg width="100%" height="100%" className="absolute inset-0 w-full h-full" style={{ minHeight: 400 }} aria-hidden="true">
          <circle cx="80%" cy="20%" r="60" fill="url(#grad1)" opacity="0.12" />
          <circle cx="20%" cy="80%" r="40" fill="url(#grad2)" opacity="0.10" />
          <rect x="10%" y="10%" width="40" height="40" rx="12" fill="url(#grad3)" opacity="0.08" />
          <defs>
            <linearGradient id="grad1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
            <linearGradient id="grad2" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
            <linearGradient id="grad3" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f472b6" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <p className="text-primary font-semibold tracking-widest mb-2 text-xs md:text-sm uppercase">
              {t('testimonials.title', 'Testimonials')}
            </p>
            <h2 className="font-extrabold mb-2 text-3xl md:text-4xl text-foreground tracking-tight">
              {t('testimonials.heading', 'What Our Users Say')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-2 text-base md:text-lg">
              {t('testimonials.intro', 'Real feedback from patients, doctors, and pharmacists using SAFE.')}
            </p>
          </motion.div>
        </div>
        <div className="relative max-w-xl mx-auto">
          <div className="relative h-[340px] flex items-center justify-center">
            <AnimatePresence initial={false} mode="wait">
              {testimonials.map((testimonial, index) => (
                activeIndex === index && (
                  <motion.div
                    key={testimonial.id}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.5, type: 'spring' }}
                    className="absolute w-full h-full flex items-center justify-center"
                  >
                    <GlassCard className="relative p-6 md:p-8 flex flex-col h-full w-full max-w-md mx-auto focus-within:ring-2 focus-within:ring-primary outline-none transition-all duration-300 shadow-2xl rounded-2xl border-none bg-white/60 dark:bg-[#232a36]/70 backdrop-blur-xl border border-white/20 dark:border-white/10"
                      style={{ boxShadow: '0 8px 32px 0 rgba(56,189,248,0.18), 0 1.5px 8px 0 rgba(99,102,241,0.10)' }}
                    >
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-primary/90 rounded-full p-3 shadow-lg flex items-center justify-center">
                        <Quote className="w-7 h-7 opacity-90" />
                      </div>
                      <p className="mb-5 mt-8 text-base md:text-lg italic text-center text-card-foreground font-medium dark:text-white" aria-live="polite">
                        "{testimonial.text}"
                      </p>
                      <div className="mt-auto flex flex-col items-center gap-2">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg border-2 border-white dark:border-primary/40 relative group transition-transform duration-200 hover:scale-110 hover:shadow-xl">
                          <img
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            className="w-full h-full rounded-full object-cover border-2 border-primary/30 relative z-10 shadow-md group-hover:shadow-primary/40 group-hover:ring-2 group-hover:ring-primary/40 transition-all duration-200"
                          />
                        </div>
                        <p className="font-bold text-base text-card-foreground dark:text-white mt-2">
                          {testimonial.name}
                        </p>
                        <p className="text-muted-foreground text-xs font-medium dark:text-muted">
                          {testimonial.role}
                        </p>
                        <div className="flex mt-1" aria-label={`${t('testimonials.rating')}: ${testimonial.rating} ${t('testimonials.outOf5')}` }>
                          {[...Array(5)].map((_, i) => (
                            <motion.svg
                              key={i}
                              className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400' : 'text-muted-foreground/30'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              aria-hidden="true"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.2 + i * 0.08, type: 'spring', stiffness: 200 }}
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </motion.svg>
                          ))}
                        </div>
                      </div>
                      <div className="absolute left-0 right-0 bottom-0 h-1.5 rounded-b-2xl overflow-hidden">
                        <div ref={progressRef} className="h-full bg-gradient-to-r from-primary to-blue-400 transition-all" style={{ width: '0%' }} />
                      </div>
                    </GlassCard>
                  </motion.div>
                )
              ))}
            </AnimatePresence>
          </div>
          <div className="flex justify-center items-center mt-8 gap-2">
            <Button
              onClick={handlePrev}
              aria-label={t('testimonials.prev', 'Previous')}
              variant="default"
              size="icon"
              className="bg-primary hover:bg-primary/90"
            >
              {isRtl ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </Button>
            <div className="flex items-center gap-1">
              {testimonials.map((_, index) => (
                <span
                  key={index}
                  onClick={() => handleDotClick(index)}
                  role="button"
                  tabIndex={0}
                  aria-label={t('testimonials.goto', { index: index + 1, defaultValue: 'Go to testimonial {{index}}' })}
                  className={`w-2.5 h-2.5 rounded-full border-2 border-primary transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary ${
                    activeIndex === index ? 'bg-primary' : 'bg-muted-foreground/20'
                  }`}
                  style={{ transition: 'background 0.3s, border 0.3s', cursor: 'pointer' }}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleDotClick(index); }}
                />
              ))}
            </div>
            <Button
              onClick={handleNext}
              aria-label={t('testimonials.next', 'Next')}
              variant="default"
              className="bg-primary hover:bg-primary/90"
              size="icon"
            >
              {isRtl ? (
                <ChevronLeft className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}
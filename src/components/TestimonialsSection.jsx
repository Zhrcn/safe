'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Button } from "@/components/ui/Button";
import Section from './common/Section';
import GlassCard from './common/GlassCard';
import { useTranslation } from 'react-i18next';

export default function TestimonialsSection() {
  const { t } = useTranslation();
  const testimonials = [
    {
      id: 1,
      name: t('testimonials.1.name', 'Sarah Johnson'),
      role: t('testimonials.1.role', 'Patient'),
      avatar: '/avatars/avatar-1.jpg',
      rating: 5,
      text: t('testimonials.1.text', 'This platform made it so easy to book appointments and manage my health records!')
    },
    {
      id: 2,
      name: t('testimonials.2.name', 'Dr. Ahmed Al-Farsi'),
      role: t('testimonials.2.role', 'Doctor'),
      avatar: '/avatars/avatar-2.jpg',
      rating: 5,
      text: t('testimonials.2.text', 'A seamless experience for both doctors and patients. Highly recommended!')
    },
    {
      id: 3,
      name: t('testimonials.3.name', 'Fatima Al-Abbas'),
      role: t('testimonials.3.role', 'Pharmacist'),
      avatar: '/avatars/avatar-3.jpg',
      rating: 4,
      text: t('testimonials.3.text', 'Managing prescriptions has never been easier. Great support team!')
    },
    {
      id: 4,
      name: t('testimonials.4.name', 'Mohammed Al-Sayed'),
      role: t('testimonials.4.role', 'Patient'),
      avatar: '/avatars/avatar-4.jpg',
      rating: 5,
      text: t('testimonials.4.text', 'I love the secure messaging feature and the quick response from doctors.')
    },
    {
      id: 5,
      name: t('testimonials.5.name', 'Dr. Lina Khaled'),
      role: t('testimonials.5.role', 'Doctor'),
      avatar: '/avatars/avatar-5.jpg',
      rating: 5,
      text: t('testimonials.5.text', 'A must-have for every healthcare provider!')
    }
  ];
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  useEffect(() => {
    let interval;
    if (autoplay) {
      interval = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      }, 6000);
    }
    return () => clearInterval(interval);
  }, [autoplay]);
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
      <div className="absolute inset-0 pointer-events-none select-none opacity-10 z-0" aria-hidden="true"
        style={{
          background:
            'radial-gradient(circle at 70% 30%, var(--color-primary) 0%, transparent 70%)',
        }}
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <p className="text-primary font-semibold tracking-widest mb-2 text-xs md:text-sm uppercase">
              {t('testimonials.title', 'Testimonials')}
            </p>
            <h2 className="font-extrabold mb-2 text-4xl md:text-5xl text-foreground tracking-tight">
              {t('testimonials.heading', 'What Our Users Say')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-2 text-lg md:text-xl">
              {t('testimonials.intro', 'Real feedback from patients, doctors, and pharmacists using SAFE.')}
            </p>
          </motion.div>
        </div>
        <div className="relative max-w-2xl mx-auto">
          <div className="relative h-[420px] md:h-[340px] flex items-center justify-center">
            <AnimatePresence initial={false} mode="wait">
              {testimonials.map((testimonial, index) => (
                activeIndex === index && (
                  <motion.div
                    key={testimonial.id}
                    initial={{ opacity: 0, scale: 0.96, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: -30 }}
                    transition={{ duration: 0.5 }}
                    className="absolute w-full h-full flex items-center justify-center"
                  >
                    <GlassCard className="relative p-10 md:p-12 flex flex-col h-full w-full max-w-xl mx-auto focus-within:ring-2 focus-within:ring-primary outline-none transition-all duration-300 shadow-xl rounded-3xl border-none bg-white/40 dark:bg-[#232a36]/60 backdrop-blur-xl border border-white/20 dark:border-white/10">
                      <Quote className="w-10 h-10 opacity-10 absolute top-6 left-6 text-primary" />
                      <p className="mb-8 text-xl md:text-2xl italic relative z-10 text-card-foreground font-medium dark:text-white">
                        "{testimonial.text}"
                      </p>
                      <div className="mt-auto flex items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-xl border-4 border-background dark:border-primary/40 relative animate-glow">
                          <motion.div
                            initial={{ boxShadow: '0 0 0 0 rgba(56,189,248,0.7)' }}
                            animate={{ boxShadow: '0 0 32px 8px rgba(56,189,248,0.25)' }}
                            transition={{ duration: 1.2, repeat: Infinity, repeatType: 'reverse' }}
                            className="absolute inset-0 rounded-full z-0"
                          />
                          <img
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            className="w-full h-full rounded-full object-cover border-2 border-primary/30 relative z-10"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-xl text-card-foreground dark:text-white">
                            {testimonial.name}
                          </p>
                          <p className="text-muted-foreground text-base font-medium dark:text-muted">
                            {testimonial.role}
                          </p>
                          <div className="flex mt-1" aria-label={`${t('testimonials.rating')}: ${testimonial.rating} ${t('testimonials.outOf5')}` }>
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-muted-foreground/30'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                aria-hidden="true"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                )
              ))}
            </AnimatePresence>
          </div>
          <div className="flex justify-center items-center mt-10 gap-4">
            <Button
              onClick={handlePrev}
              aria-label={t('testimonials.prev', 'Previous')}
              className="p-3 rounded-xl bg-card border border-border shadow hover:shadow-lg hover:bg-primary/10 transition-all focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <div className="flex items-center gap-3">
              {testimonials.map((_, index) => (
                <Button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  aria-label={t('testimonials.goto', { index: index + 1, defaultValue: 'Go to testimonial {{index}}' })}
                  className={`w-4 h-4 rounded-xl border-2 border-primary transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary ${
                    activeIndex === index ? 'bg-primary' : 'bg-muted-foreground/20'
                  }`}
                />
              ))}
            </div>
            <Button
              onClick={handleNext}
              aria-label={t('testimonials.next', 'Next')}
              className="p-3 rounded-xl bg-card border border-border shadow hover:shadow-lg hover:bg-primary/10 transition-all focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
} 
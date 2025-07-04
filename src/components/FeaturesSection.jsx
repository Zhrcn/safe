'use client';
import { motion } from 'framer-motion';
import { Shield, Calendar, FileText, Users, Stethoscope, Clock, Zap } from 'lucide-react';
import Section from './common/Section';
import GlassCard from './common/GlassCard';
import { useTranslation } from 'react-i18next';

export default function FeaturesSection() {
  const { t, ready } = useTranslation();
  if (!ready) return null;

  const features = [
    {
      icon: Shield,
      title: t('features.secureRecords.title', 'Secure Medical Records'),
      description: t('features.secureRecords.description', 'Your health data is encrypted and protected.'),
      color: 'var(--color-primary)',
      bg: 'rgba(var(--color-primary-rgb, 0,119,204),0.08)',
      border: 'var(--color-primary)',
      text: 'var(--color-primary)',
      transitionDelay: 0.002,
    },
    {
      icon: Calendar,
      title: t('features.easyScheduling.title', 'Easy Scheduling'),
      description: t('features.easyScheduling.description', 'Book appointments with just a few clicks.'),
      color: 'var(--color-secondary)',
      bg: 'rgba(var(--color-secondary-rgb, 0,163,224),0.08)',
      border: 'var(--color-secondary)',
      text: 'var(--color-secondary)',
      transitionDelay: 0.004,
    },
    {
      icon: FileText,
      title: t('features.digitalPrescriptions.title', 'Digital Prescriptions'),
      description: t('features.digitalPrescriptions.description', 'Receive and manage prescriptions online.'),
      color: 'var(--color-digital-prescriptions)',
      bg: 'rgba(var(--color-digital-prescriptions-rgb, 0,119,204),0.10)',
      border: 'var(--color-digital-prescriptions)',
      text: 'var(--color-digital-prescriptions)',
      transitionDelay: 0.006,
    },
    {
      icon: Stethoscope,
      title: t('features.expertDoctors.title', 'Expert Doctors'),
      description: t('features.expertDoctors.description', 'Consult with certified healthcare professionals.'),
      color: 'var(--color-warning)',
      bg: 'rgba(var(--color-warning-rgb, 255,160,0),0.08)',
      border: 'var(--color-warning)',
      text: 'var(--color-warning)',
      transitionDelay: 0.008,
    },
    {
      icon: Clock,
      title: t('features.quickResponse.title', 'Quick Response'),
      description: t('features.quickResponse.description', 'Get timely answers and support.'),
      color: 'var(--color-error)',
      bg: 'rgba(var(--color-error-rgb, 229,57,53),0.08)',
      border: 'var(--color-error)',
      text: 'var(--color-error)',
      highlight: true,
      transitionDelay: 0.01,
    },
    {
      icon: Users,
      title: t('features.familyAccounts.title', 'Family Accounts'),
      description: t('features.familyAccounts.description', "Manage your family's health in one place."),
      color: 'var(--color-accent)',
      bg: 'rgba(var(--color-accent-rgb, 0,75,141),0.08)',
      border: 'var(--color-accent)',
      text: 'var(--color-accent)',
      transitionDelay: 0.012,
    }
  ];

  const FAST_TRANSITION = { duration: 0.08, type: 'tween', ease: 'easeOut' };
  const FAST_SPRING = { duration: 0.12, delay: 0, type: 'spring', bounce: 0.08 };

  const FeatureCard = ({ icon: Icon, title, description, index, highlight, color, bg, border, text }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ ...FAST_SPRING, delay: index * 0.008 }}
        viewport={{ once: true, margin: '-30px' }}
        whileHover={{
          y: -6,
          scale: 1.03,
          boxShadow: `0 8px 40px 0 ${color}33`,
          filter: 'brightness(1.04)',
          transition: FAST_TRANSITION,
        }}
        className="h-full w-full group transition-all duration-75"
        tabIndex={0}
        aria-label={title}
      >
        <GlassCard
          className="h-full p-10 flex flex-col relative overflow-hidden transition-all duration-75 ease-in-out focus-within:ring-2 focus-within:ring-primary outline-none backdrop-blur-xl border-2 rounded-3xl shadow-2xl bg-white/60 dark:bg-[#232a36]/70"
          style={{
            borderTop: `4px solid ${border}`,
            boxShadow: highlight
              ? `0 0 0 3px ${color}44, 0 8px 40px 0 ${color}22`
              : `0 8px 32px 0 ${color}11`,
          }}
        >
          <div className="mb-6 flex items-center justify-center relative">
            <span
              className="inline-flex items-center justify-center rounded-full shadow-inner"
              style={{
                width: highlight ? 72 : 56,
                height: highlight ? 72 : 56,
                background: bg,
                boxShadow: `0 2px 12px 0 ${color}22 inset`,
                color: text,
                border: `2px solid ${border}`,
              }}
            >
              <Icon className={highlight ? 'w-10 h-10' : 'w-7 h-7'} strokeWidth={2.2} />
            </span>
          </div>
          <h3
            className="mb-3 font-extrabold text-2xl sm:text-3xl md:text-4xl tracking-tight group-hover:drop-shadow-lg transition-all duration-50"
            style={{ color: text }}
          >
            {title}
          </h3>
          <p className="text-base flex-grow opacity-90" style={{ color: text }}>
            {description}
          </p>
        </GlassCard>
      </motion.div>
    );
  };

  return (
    <Section id="features" className="relative overflow-hidden bg-transparent py-8">
      <div className="flex flex-col items-center justify-center relative z-10">
        <div className="text-center mb-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={FAST_TRANSITION}
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            <p className="text-primary font-semibold tracking-wider mb-2 text-xs sm:text-sm">
              {t('features.whyChooseUs', 'Why Choose Us?')}
            </p>
            <h2 className="font-bold mb-2 text-4xl sm:text-5xl md:text-6xl leading-tight text-foreground dark:text-white">
              {t('features.ourFeatures', 'Our Features')}
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg px-4 sm:px-0 text-center dark:text-muted">
              {t('features.intro', 'Discover the benefits of our platform for your healthcare journey.')}
            </p>
          </motion.div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full justify-center items-stretch">
          {features.map((feature, index) => (
            <div key={feature.title} className="w-full flex items-stretch">
              <FeatureCard {...feature} index={index} />
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
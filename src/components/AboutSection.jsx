'use client';
import { motion } from 'framer-motion';
import { Users, Clock, Award, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function AboutSection() {
  const { t, ready } = useTranslation();
  if (!ready) return null;
  const stats = [
    {
      icon: Users,
      value: '10K+',
      label: t('about.stats.activeUsers', 'Active Users'),
      color: 'var(--color-primary)',
    },
    {
      icon: Clock,
      value: '24/7',
      label: t('about.stats.support', '24/7 Support'),
      color: 'var(--color-secondary)',
    },
    {
      icon: Award,
      value: '99.9%',
      label: t('about.stats.uptime', 'Uptime'),
      color: 'var(--color-success)',
    },
    {
      icon: Heart,
      value: '95%',
      label: t('about.stats.satisfaction', 'Satisfaction'),
      color: 'var(--color-destructive)',
    },
  ];
  return (
    <section 
      id="about" 
      className="relative overflow-hidden py-20 sm:py-28 bg-gradient-to-br from-background via-white/60 to-background dark:from-[#181c23] dark:via-[#232a36]/60 dark:to-[#181c23]">
      <div className="absolute right-0 top-0 w-2/3 h-full pointer-events-none select-none opacity-10 z-0" aria-hidden="true"
        style={{
          background:
            'radial-gradient(circle at 80% 40%, var(--color-primary) 0%, transparent 70%)',
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-0 items-stretch">
          <div className="col-span-1 lg:col-span-6 flex flex-col justify-center pr-0 lg:pr-16 py-10 lg:py-0">
            <div className="relative mb-10">
              <div className="absolute -left-8 top-2 h-16 w-2 rounded-full bg-primary/80 hidden lg:block" />
              <p className="text-primary font-extrabold tracking-widest mb-4 text-base sm:text-lg uppercase letter-spacing-[0.2em]">{t('about.title', 'About SAFE')}</p>
              <h2 className="font-extrabold mb-10 text-5xl sm:text-6xl md:text-7xl leading-tight text-foreground drop-shadow-xl">
                {t('about.subtitle1', 'Empowering Healthcare')}<br className="hidden md:block" /> {t('about.subtitle2', 'For Everyone')}
              </h2>
            </div>
            <div className="space-y-8">
              <p className="text-muted-foreground text-xl sm:text-2xl leading-relaxed max-w-2xl">
                {t('about.mission', 'Our mission is to make healthcare accessible, secure, and efficient for all.')}
              </p>
              <p className="text-muted-foreground text-xl sm:text-2xl leading-relaxed max-w-2xl">
                {t('about.vision', 'We envision a world where technology bridges the gap between patients and providers.')}
              </p>
              <p className="text-muted-foreground text-xl sm:text-2xl leading-relaxed max-w-2xl">
                {t('about.goal', 'Our goal is to deliver innovative solutions for better health outcomes.')}
              </p>
            </div>
          </div>
          <div className="hidden lg:flex items-center justify-center col-span-1">
            <div className="h-4/5 w-px bg-gradient-to-b from-primary/10 via-primary/40 to-primary/10 mx-8 rounded-full" />
          </div>
          <div className="col-span-1 lg:col-span-5 flex flex-col justify-center items-center py-10 lg:py-0">
            <div className="grid grid-cols-2 gap-8 w-full">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center justify-center bg-white/70 dark:bg-[#232a36]/80 backdrop-blur-2xl rounded-3xl shadow-xl border border-white/20 dark:border-white/10 p-10 hover:shadow-2xl transition-all duration-300 min-w-[180px] min-h-[220px]"
                  tabIndex={0}
                  aria-label={stat.label}
                >
                  <div
                    className="flex justify-center items-center mb-6 p-6 rounded-full shadow-lg dark:shadow-primary/30"
                    style={{
                      backgroundColor: `${stat.color}15`,
                      color: stat.color,
                    }}
                  >
                    <stat.icon className="w-14 h-14" />
                  </div>
                  <p 
                    className="font-extrabold mb-2 text-5xl sm:text-6xl tracking-tight dark:text-white"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-muted-foreground text-lg font-bold dark:text-muted">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 
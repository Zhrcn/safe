'use client';
import { motion } from 'framer-motion';
import { Users, Clock, Award, Heart } from 'lucide-react';

const stats = [
  {
    icon: Users,
    value: '10K+',
    label: 'Active Users',
    color: 'hsl(var(--primary))',
  },
  {
    icon: Clock,
    value: '24/7',
    label: 'Support',
    color: 'hsl(var(--secondary))',
  },
  {
    icon: Award,
    value: '99.9%',
    label: 'Uptime',
    color: 'hsl(var(--success))',
  },
  {
    icon: Heart,
    value: '95%',
    label: 'Satisfaction',
    color: 'hsl(var(--destructive))',
  },
];

export default function AboutSection() {
  return (
    <section 
      id="about" 
      className="relative overflow-hidden py-20 sm:py-28 bg-background">
      {/* Background accent for depth */}
      <div className="absolute inset-0 pointer-events-none select-none opacity-10 z-0" aria-hidden="true"
        style={{
          background:
            'radial-gradient(circle at 80% 60%, var(--color-secondary) 0%, transparent 70%)',
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
          <div className="w-full md:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <p className="text-primary font-semibold tracking-wider mb-3 text-xs sm:text-sm uppercase">
                ABOUT US
              </p>
              <h2 className="font-bold mb-5 text-3xl sm:text-4xl md:text-5xl leading-tight text-foreground">
                Transforming Healthcare Through Technology
              </h2>
              <p className="mb-4 text-muted-foreground text-base sm:text-lg">
                Our mission is to revolutionize healthcare management by providing a secure, accessible, fast, and efficient platform that connects patients, doctors, and pharmacists.
              </p>
              <p className="mb-4 text-muted-foreground text-base sm:text-lg">
                We believe that technology can significantly improve healthcare outcomes by streamlining processes, enhancing communication, and ensuring data security.
              </p>
              <p className="text-muted-foreground text-base sm:text-lg">
                With our platform, we aim to reduce administrative burdens, minimize errors, and ultimately improve patient care and satisfaction across the healthcare ecosystem.
              </p>
            </motion.div>
          </div>
          <div className="w-full md:w-1/2 flex flex-wrap justify-center gap-6">
            {stats.map((stat, index) => (
                <motion.div
                key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                whileHover={{ y: -4, scale: 1.06, boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.13)' }}
                className="w-full sm:w-1/2 md:w-1/3 px-2 flex"
              >
                <div
                  className="h-full w-full p-8 text-center rounded-3xl transition-all duration-300 ease-in-out shadow-lg hover:shadow-2xl border bg-card hover:-translate-y-1 focus-within:ring-2 focus-within:ring-primary outline-none flex flex-col items-center justify-center gap-2"
                  tabIndex={0}
                  aria-label={stat.label}
                >
                  <div
                    className="flex justify-center items-center mb-4 p-4 rounded-full shadow-md"
                        style={{
                          backgroundColor: `${stat.color}15`,
                          color: stat.color,
                        }}
                      >
                    <stat.icon className="w-10 h-10" />
                    </div>
                    <p 
                    className="font-extrabold mb-1 text-4xl sm:text-5xl tracking-tight"
                      style={{ color: stat.color }}
                    >
                      {stat.value}
                    </p>
                  <p className="text-muted-foreground text-base font-medium">
                      {stat.label}
                    </p>
                  </div>
                </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 
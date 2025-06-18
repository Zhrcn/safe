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
      className="relative overflow-hidden py-12 sm:py-16 md:py-24 bg-background"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-8 sm:gap-12">
          <div className="w-full md:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <p className="text-primary font-semibold tracking-wider mb-2 sm:mb-4 text-xs sm:text-sm">
                ABOUT US
              </p>
              <h2 className="font-bold mb-3 sm:mb-4 text-3xl sm:text-4xl md:text-5xl leading-tight sm:leading-snug md:leading-normal text-foreground">
                Transforming Healthcare Through Technology
              </h2>
              <p className="mb-4 text-muted-foreground text-sm sm:text-base">
                Our mission is to revolutionize healthcare management by providing a secure, accessible, fast, and efficient platform that connects patients, doctors, and pharmacists.
              </p>
              <p className="mb-4 text-muted-foreground text-sm sm:text-base">
                We believe that technology can significantly improve healthcare outcomes by streamlining processes, enhancing communication, and ensuring data security.
              </p>
              <p className="text-muted-foreground text-sm sm:text-base">
                With our platform, we aim to reduce administrative burdens, minimize errors, and ultimately improve patient care and satisfaction across the healthcare ecosystem.
              </p>
            </motion.div>
          </div>
          <div className="w-full md:w-1/2 flex flex-wrap justify-center gap-4 sm:gap-6">
            {stats.map((stat, index) => (
              <div key={stat.label} className="w-full sm:w-1/2 md:w-1/3 px-2 flex">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="h-full w-full"
                >
                  <div
                    className="h-full p-4 sm:p-6 text-center rounded-2xl transition-all duration-300 ease-in-out shadow-sm hover:shadow-lg border bg-card hover:-translate-y-1"
                  >
                    <div className="flex justify-center mb-4">
                      <div 
                        className="p-2 sm:p-3 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: `${stat.color}15`,
                          color: stat.color,
                        }}
                      >
                        <stat.icon className="w-7 h-7" />
                      </div>
                    </div>
                    <p 
                      className="font-bold mb-2 text-2xl sm:text-3xl"
                      style={{ color: stat.color }}
                    >
                      {stat.value}
                    </p>
                    <p className="text-muted-foreground text-sm sm:text-base">
                      {stat.label}
                    </p>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 
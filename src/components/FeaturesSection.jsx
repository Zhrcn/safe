'use client';
import { motion } from 'framer-motion';
import { Shield, Calendar, FileText, Users, Stethoscope, Clock } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Secure Records',
    description: 'Your medical records are securely stored and accessible only to authorized personnel.',
    color: 'var(--color-primary)'
  },
  {
    icon: Calendar,
    title: 'Easy Scheduling',
    description: 'Book appointments with your healthcare providers with just a few clicks.',
    color: 'var(--color-secondary)'
  },
  {
    icon: FileText,
    title: 'Digital Prescriptions',
    description: 'Receive and manage your prescriptions digitally, with automatic refill reminders.',
    color: 'var(--color-success)'
  },
  {
    icon: Stethoscope,
    title: 'Expert Doctors',
    description: 'Connect with qualified healthcare professionals specialized in various fields.',
    color: 'var(--color-warning)'
  },
  {
    icon: Clock,
    title: 'Quick Response',
    description: 'Get timely responses and emergency care when you need it the most.',
    color: 'var(--color-destructive)'
  },
  {
    icon: Users,
    title: 'Family Accounts',
    description: 'Manage healthcare for your entire family with connected accounts and shared access.',
    color: 'var(--color-accent)'
  }
];

const FeatureCard = ({ icon: Icon, title, description, color, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ y: -8, scale: 1.04, boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.12)' }}
      className="h-full w-full"
      tabIndex={0}
      aria-label={title}
    >
      <div 
        className="h-full p-8 rounded-3xl flex flex-col relative overflow-hidden transition-all duration-300 ease-in-out backdrop-blur-md bg-white/30 dark:bg-[#181c23]/30 border border-white/30 dark:border-[#181c23]/30 shadow-2xl hover:shadow-3xl focus-within:ring-2 focus-within:ring-primary outline-none"
        style={{
          borderTop: `4px solid ${color}`,
        }}
      >
        <div 
          className="mb-4 inline-flex p-3 rounded-xl shadow-md"
          style={{
            backgroundColor: `${color}15`,
            color: color,
          }}
        >
          <Icon className="w-8 h-8" strokeWidth={2} />
        </div>
        <h3 className="mb-2 font-bold text-xl sm:text-2xl md:text-3xl text-foreground">
          {title}
        </h3>
        <p className="text-muted-foreground text-base flex-grow">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export default function FeaturesSection() {
  return (
    <section 
      id="features" 
      className="py-20 sm:py-28 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 flex flex-col items-center justify-center relative z-10">
        <div className="text-center mb-12 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            <p className="text-primary font-semibold tracking-wider mb-3 text-xs sm:text-sm">
              WHY CHOOSE US
            </p>
            <h2 className="font-bold mb-3 text-3xl sm:text-4xl md:text-5xl leading-tight text-foreground">
              Our Features
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-base px-4 sm:px-0 text-center">
              Experience the future of healthcare with our comprehensive suite of features designed to make your medical journey seamless and efficient.
            </p>
          </motion.div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full justify-center items-stretch">
          {features.map((feature, index) => (
            <div key={feature.title} className="w-full flex items-stretch">
              <FeatureCard {...feature} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
'use client';
import { motion } from 'framer-motion';
import { Shield, Calendar, FileText, Users, Stethoscope, Clock } from 'lucide-react';
const features = [
  {
    icon: Shield,
    title: 'Secure Records',
    description: 'Your medical records are securely stored and accessible only to authorized personnel.',
    color: 'hsl(var(--primary))'
  },
  {
    icon: Calendar,
    title: 'Easy Scheduling',
    description: 'Book appointments with your healthcare providers with just a few clicks.',
    color: 'hsl(var(--secondary))'
  },
  {
    icon: FileText,
    title: 'Digital Prescriptions',
    description: 'Receive and manage your prescriptions digitally, with automatic refill reminders.',
    color: 'hsl(var(--success))'
  },
  {
    icon: Stethoscope,
    title: 'Expert Doctors',
    description: 'Connect with qualified healthcare professionals specialized in various fields.',
    color: 'hsl(var(--warning))'
  },
  {
    icon: Clock,
    title: 'Quick Response',
    description: 'Get timely responses and emergency care when you need it the most.',
    color: 'hsl(var(--destructive))'
  },
  {
    icon: Users,
    title: 'Family Accounts',
    description: 'Manage healthcare for your entire family with connected accounts and shared access.',
    color: 'hsl(var(--info))'
  }
];

const themeColorMap = {
  'primary': 'var(--primary)',
  'secondary': 'var(--secondary)',
  'success': 'var(--success)',
  'info': 'var(--info)',
  'warning': 'var(--warning)',
  'error': 'var(--error)',
};

const FeatureCard = ({ icon: Icon, title, description, color = 'primary', index }) => {
  const themeColor = themeColorMap[color] || 'var(--primary)';
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="h-full w-full"
    >
      <div 
        className="h-full p-3 sm:p-4 md:p-5 rounded-xl flex flex-col relative overflow-hidden transition-all duration-300 ease-in-out bg-card hover:shadow-lg"
        style={{
          borderTop: `4px solid hsl(${themeColor})`,
        }}
      >
        <div 
          className="mb-3 sm:mb-4 inline-flex p-2 rounded-lg"
          style={{
            backgroundColor: `hsl(${themeColor} / 0.15)` ,
            color: `hsl(${themeColor})`,
          }}
        >
          <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" strokeWidth={2} />
        </div>
        <h3 className="mb-2 font-semibold text-base sm:text-lg md:text-xl text-card-foreground">
          {title}
        </h3>
        <p className="text-muted-foreground text-xs sm:text-sm md:text-base flex-grow">
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
      className="py-8 sm:py-12 md:py-16 lg:py-20 bg-background"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <div className="text-center mb-8 sm:mb-12 md:mb-16 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            <p className="text-primary font-semibold tracking-wider mb-2 sm:mb-3 text-xs sm:text-sm">
              WHY CHOOSE US
            </p>
            <h2 className="font-bold mb-2 sm:mb-3 text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight text-foreground">
              Our Features
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-xs sm:text-sm md:text-base px-4 sm:px-0 text-center">
              Experience the future of healthcare with our comprehensive suite of features
              designed to make your medical journey seamless and efficient.
            </p>
          </motion.div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 w-full">
          {features.map((feature, index) => (
            <div key={feature.title} className="w-full">
              <FeatureCard {...feature} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
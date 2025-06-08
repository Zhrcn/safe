'use client';

import { Container, Typography, Box, Paper, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import { Shield, Calendar, FileText, Users, Stethoscope, Clock } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Secure Records',
    description: 'Your medical records are securely stored and accessible only to authorized personnel.',
    color: '#3b82f6'
  },
  {
    icon: Calendar,
    title: 'Easy Scheduling',
    description: 'Book appointments with your healthcare providers with just a few clicks.',
    color: '#8b5cf6'
  },
  {
    icon: FileText,
    title: 'Digital Prescriptions',
    description: 'Receive and manage your prescriptions digitally, with automatic refill reminders.',
    color: '#10b981'
  },
  {
    icon: Stethoscope,
    title: 'Expert Doctors',
    description: 'Connect with qualified healthcare professionals specialized in various fields.',
    color: '#f59e0b'
  },
  {
    icon: Clock,
    title: 'Quick Response',
    description: 'Get timely responses and emergency care when you need it the most.',
    color: '#ef4444'
  },
  {
    icon: Users,
    title: 'Family Accounts',
    description: 'Manage healthcare for your entire family with connected accounts and shared access.',
    color: '#06b6d4'
  }
];

const FeatureCard = ({ icon: Icon, title, description, color, index }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="h-full w-full"
    >
      <Paper 
        elevation={0}
        className={`h-full p-3 sm:p-4 md:p-5 rounded-xl flex flex-col relative overflow-hidden transition-all duration-300 ease-in-out
          ${isDark ? 'bg-gray-800' : 'bg-white'} hover:shadow-lg`}
        style={{
          '--feature-color': color,
          borderTop: `4px solid ${color}`,
        }}
      >
        <Box 
          className="mb-3 sm:mb-4 inline-flex p-2 rounded-lg"
          style={{
            backgroundColor: `${color}15`,
            color: color,
          }}
        >
          <Icon size={isMobile ? 24 : isTablet ? 26 : 28} strokeWidth={2} />
        </Box>
        
        <Typography 
          variant="h5" 
          component="h3" 
          className="mb-2 font-semibold text-base sm:text-lg md:text-xl"
          style={{ color: isDark ? 'white' : '#333' }}
        >
          {title}
        </Typography>
        
        <Typography 
          variant="body1" 
          className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm md:text-base flex-grow"
        >
          {description}
        </Typography>
      </Paper>
    </motion.div>
  );
};

export default function FeaturesSection() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box 
      id="features" 
      className={`py-8 sm:py-12 md:py-16 lg:py-20 ${
        isDark ? 'bg-background-default' : 'bg-background-paper'
      }`}
    >
      <Container maxWidth="lg" className="flex flex-col items-center justify-center">
        <Box className="text-center mb-8 sm:mb-12 md:mb-16 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            <Typography 
              variant="overline" 
              component="p"
              className="text-primary font-semibold tracking-wider mb-2 sm:mb-3 text-xs sm:text-sm"
            >
              WHY CHOOSE US
            </Typography>
            
            <Typography 
              variant="h3" 
              component="h2" 
              className="font-bold mb-2 sm:mb-3 text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight"
            >
              Our Features
            </Typography>
            
            <Typography 
              variant="body1" 
              className="text-gray-600 dark:text-gray-400 mx-auto max-w-2xl text-xs sm:text-sm md:text-base px-4 sm:px-0 text-center"
            >
              Experience the future of healthcare with our comprehensive suite of features
              designed to make your medical journey seamless and efficient.
            </Typography>
          </motion.div>
        </Box>
        
        <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 w-full">
          {features.map((feature, index) => (
            <Box key={feature.title} className="w-full">
              <FeatureCard {...feature} index={index} />
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
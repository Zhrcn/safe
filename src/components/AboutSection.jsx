'use client';

import { Container, Typography, Box, Paper, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import { Users, Clock, Award, Heart } from 'lucide-react';

const stats = [
  {
    icon: Users,
    value: '10K+',
    label: 'Active Users',
    color: '#3b82f6',
  },
  {
    icon: Clock,
    value: '24/7',
    label: 'Support',
    color: '#8b5cf6',
  },
  {
    icon: Award,
    value: '99.9%',
    label: 'Uptime',
    color: '#10b981',
  },
  {
    icon: Heart,
    value: '95%',
    label: 'Satisfaction',
    color: '#ef4444',
  },
];

export default function AboutSection() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box 
      id="about" 
      className={`relative overflow-hidden py-12 sm:py-16 md:py-24 ${
        isDark ? 'bg-background-paper' : 'bg-gray-50'
      }`}
    >
      <Container maxWidth="lg">
        <Box className="flex flex-col md:flex-row items-center gap-8 sm:gap-12">
  
          <Box className="w-full md:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Typography 
                variant="overline" 
                component="p"
                className="text-primary font-semibold tracking-wider mb-2 sm:mb-4 text-xs sm:text-sm"
              >
                ABOUT US
              </Typography>
              
              <Typography 
                variant="h3" 
                component="h2" 
                className="font-bold mb-3 sm:mb-4 text-3xl sm:text-4xl md:text-5xl leading-tight sm:leading-snug md:leading-normal"
              >
                Transforming Healthcare Through Technology
              </Typography>
              
              <Typography 
                variant="body1" 
                paragraph
                className="mb-4 text-gray-600 dark:text-gray-300 text-sm sm:text-base"
              >
                Our mission is to revolutionize healthcare management by providing a secure, accessible, fast, and efficient platform that connects patients, doctors, and pharmacists.
              </Typography>
              
              <Typography 
                variant="body1" 
                paragraph
                className="mb-4 text-gray-600 dark:text-gray-300 text-sm sm:text-base"
              >
                We believe that technology can significantly improve healthcare outcomes by streamlining processes, enhancing communication, and ensuring data security.
              </Typography>
              
              <Typography 
                variant="body1" 
                paragraph
                className="text-gray-600 dark:text-gray-300 text-sm sm:text-base"
              >
                With our platform, we aim to reduce administrative burdens, minimize errors, and ultimately improve patient care and satisfaction across the healthcare ecosystem.
              </Typography>
            </motion.div>
          </Box>
          
          <Box className="w-full md:w-1/2 flex flex-wrap justify-center gap-4 sm:gap-6">
            {stats.map((stat, index) => (
              <Box key={stat.label} className="w-full sm:w-1/2 md:w-1/3 px-2 flex">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="h-full w-full"
                  >
                    <Paper
                      className={`h-full p-4 sm:p-6 text-center rounded-2xl transition-all duration-300 ease-in-out shadow-sm hover:shadow-lg border ${
                        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                      } hover:-translate-y-1`}
                    >
                      <Box 
                        className="flex justify-center mb-4"
                      >
                        <Box 
                          className="p-2 sm:p-3 rounded-full flex items-center justify-center"
                          style={{
                            backgroundColor: `${stat.color}15`,
                            color: stat.color,
                          }}
                        >
                          <stat.icon size={28} />
                        </Box>
                      </Box>
                      
                      <Typography 
                        variant="h3" 
                        component="p"
                        className="font-bold mb-2 text-2xl sm:text-3xl"
                        style={{ color: stat.color }}
                      >
                        {stat.value}
                      </Typography>
                      
                      <Typography 
                        variant="body2"
                        className="text-gray-600 dark:text-gray-400 text-sm sm:text-base"
                      >
                        {stat.label}
                      </Typography>
                    </Paper>
                  </motion.div>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
} 
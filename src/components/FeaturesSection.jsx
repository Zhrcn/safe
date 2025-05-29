'use client';

import { Container, Typography, Grid, Box, Paper } from '@mui/material';
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

// Feature card component with animation
const FeatureCard = ({ icon: Icon, title, description, color, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Paper 
        elevation={0}
        sx={{
          height: '100%',
          p: 4,
          borderRadius: 3,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '4px',
            backgroundColor: color,
          }
        }}
      >
        <Box 
          sx={{ 
            mb: 2,
            display: 'inline-flex',
            p: 1.5,
            borderRadius: 2,
            backgroundColor: `${color}15`,
            color: color,
          }}
        >
          <Icon size={28} strokeWidth={2} />
        </Box>
        
        <Typography 
          variant="h5" 
          component="h3" 
          gutterBottom
          sx={{ fontWeight: 600 }}
        >
          {title}
        </Typography>
        
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ flex: 1 }}
        >
          {description}
        </Typography>
      </Paper>
    </motion.div>
  );
};

export default function FeaturesSection() {
  return (
    <Box 
      id="features" 
      sx={{ 
        py: { xs: 8, md: 12 },
        backgroundColor: theme => theme.palette.mode === 'dark' ? 'background.default' : 'background.paper',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 10 } }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Typography 
              variant="overline" 
              component="p"
              sx={{ 
                color: 'primary.main',
                fontWeight: 600,
                letterSpacing: 1.5,
                mb: 2,
              }}
            >
              WHY CHOOSE US
            </Typography>
            
            <Typography 
              variant="h3" 
              component="h2" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: '2rem', md: '2.5rem' }
              }}
            >
              Our Features
            </Typography>
            
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ 
                maxWidth: '700px',
                mx: 'auto',
                mb: 2,
              }}
            >
              Experience the future of healthcare with our comprehensive suite of features
              designed to make your medical journey seamless and efficient.
            </Typography>
          </motion.div>
        </Box>
        
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={feature.title}>
              <FeatureCard {...feature} index={index} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
} 
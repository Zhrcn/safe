'use client';

import { Box, Container, Typography, Button, Grid, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { APP_NAME, APP_DESCRIPTION } from '@/lib/config';

export default function HeroSection() {
  const theme = useTheme();
  
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Box 
      className="relative overflow-hidden"
      sx={{
        background: (theme) => 
          theme.palette.mode === 'dark' 
            ? 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)' 
            : 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
        color: 'white',
        pt: { xs: 10, md: 12 },
        pb: { xs: 12, md: 16 },
      }}
    >
      {/* Wave decoration */}
      <Box 
        className="absolute bottom-0 left-0 w-full"
        sx={{
          height: { xs: '70px', sm: '100px', md: '120px' },
          zIndex: 1,
        }}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1440 320"
          style={{ 
            position: 'absolute', 
            bottom: 0,
            width: '100%',
            height: '100%',
          }}
        >
          <path 
            fill={theme.palette.mode === 'dark' ? '#111827' : '#f9fafb'} 
            fillOpacity="1" 
            d="M0,128L48,144C96,160,192,192,288,186.7C384,181,480,139,576,138.7C672,139,768,181,864,181.3C960,181,1056,139,1152,122.7C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography 
                variant="h2" 
                component="h1" 
                sx={{ 
                  fontWeight: 800,
                  mb: 2,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  lineHeight: 1.2,
                }}
              >
                {APP_NAME} Medical Platform
              </Typography>
              
              <Typography 
                variant="h5" 
                component="p" 
                sx={{ 
                  mb: 4,
                  opacity: 0.9,
                  maxWidth: '600px',
                  fontWeight: 400,
                }}
              >
                {APP_DESCRIPTION}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  sx={{ 
                    px: 4, 
                    py: 1.5,
                    fontWeight: 600,
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  }}
                  onClick={() => scrollToSection('roles')}
                >
                  Get Started
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{ 
                    px: 4, 
                    py: 1.5,
                    fontWeight: 600,
                    color: 'white',
                    borderColor: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                  onClick={() => scrollToSection('features')}
                >
                  Learn More
                </Button>
              </Box>
            </motion.div>
          </Grid>
          
          <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <Box 
                sx={{ 
                  position: 'relative',
                  width: '100%',
                  height: '400px',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                {/* Placeholder for illustration - replace with actual image */}
                <Box 
                  sx={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h5" sx={{ opacity: 0.7 }}>
                    Medical Dashboard Illustration
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
} 
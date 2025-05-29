'use client';

import { Container, Typography, Grid, Box, Paper, useTheme } from '@mui/material';
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
      sx={{ 
        py: { xs: 8, md: 12 },
        backgroundColor: theme => 
          theme.palette.mode === 'dark' ? 'background.paper' : '#f9fafb',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          {/* About content */}
          <Grid item xs={12} md={6}>
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
                ABOUT US
              </Typography>
              
              <Typography 
                variant="h3" 
                component="h2" 
                gutterBottom
                sx={{ 
                  fontWeight: 700,
                  mb: 3,
                  fontSize: { xs: '2rem', md: '2.5rem' }
                }}
              >
                Transforming Healthcare Through Technology
              </Typography>
              
              <Typography 
                variant="body1" 
                paragraph
                sx={{ mb: 2 }}
              >
                Our mission is to revolutionize healthcare management by providing a secure, accessible, fast, and efficient platform that connects patients, doctors, and pharmacists.
              </Typography>
              
              <Typography 
                variant="body1" 
                paragraph
                sx={{ mb: 2 }}
              >
                We believe that technology can significantly improve healthcare outcomes by streamlining processes, enhancing communication, and ensuring data security.
              </Typography>
              
              <Typography 
                variant="body1" 
                paragraph
              >
                With our platform, we aim to reduce administrative burdens, minimize errors, and ultimately improve patient care and satisfaction across the healthcare ecosystem.
              </Typography>
            </motion.div>
          </Grid>
          
          {/* Stats */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={3}>
              {stats.map((stat, index) => (
                <Grid item xs={6} key={stat.label}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Paper
                      elevation={1}
                      sx={{
                        p: 3,
                        textAlign: 'center',
                        height: '100%',
                        borderRadius: 3,
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                        },
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Box 
                        sx={{ 
                          display: 'flex',
                          justifyContent: 'center',
                          mb: 2,
                        }}
                      >
                        <Box 
                          sx={{ 
                            p: 1.5,
                            borderRadius: '50%',
                            backgroundColor: `${stat.color}15`,
                            color: stat.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <stat.icon size={24} />
                        </Box>
                      </Box>
                      
                      <Typography 
                        variant="h3" 
                        component="p"
                        sx={{ 
                          fontWeight: 700,
                          color: stat.color,
                          mb: 1,
                        }}
                      >
                        {stat.value}
                      </Typography>
                      
                      <Typography 
                        variant="body2"
                        color="text.secondary"
                      >
                        {stat.label}
                      </Typography>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
} 
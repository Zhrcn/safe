'use client';

import { useState, useEffect } from 'react';
import { Box, Container, Typography, Paper, Avatar, Rating, IconButton, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Patient',
    avatar: '/avatars/avatar-1.jpg', // You can replace with actual images
    rating: 5,
    text: 'The SAFE platform has completely transformed how I manage my healthcare. Scheduling appointments is so easy, and I love having all my medical records in one secure place. The digital prescriptions feature is a game-changer!'
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    role: 'Cardiologist',
    avatar: '/avatars/avatar-2.jpg',
    rating: 5,
    text: 'As a doctor, this platform has streamlined my workflow significantly. Patient management is intuitive, and the secure communication channel ensures I can provide timely care. The integration with other healthcare systems is seamless.'
  },
  {
    id: 3,
    name: 'Lisa Rodriguez',
    role: 'Pharmacist',
    avatar: '/avatars/avatar-3.jpg',
    rating: 4,
    text: 'Processing prescriptions has never been easier. The system helps prevent medication errors and allows me to communicate directly with doctors when needed. The inventory management tools are also incredibly helpful.'
  },
  {
    id: 4,
    name: 'Robert Williams',
    role: 'Patient',
    avatar: '/avatars/avatar-4.jpg',
    rating: 5,
    text: 'I manage healthcare for my elderly parents, and this platform makes it so much easier. The family account feature lets me coordinate appointments and medications efficiently. The reminders have been invaluable.'
  },
  {
    id: 5,
    name: 'Dr. Emily Taylor',
    role: 'Pediatrician',
    avatar: '/avatars/avatar-5.jpg',
    rating: 5,
    text: 'The platform is intuitive and helps me provide better care for my young patients. The medical history access and secure messaging with parents have improved communication tremendously. Highly recommended for all healthcare providers!'
  }
];

export default function TestimonialsSection() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  
  // Autoplay functionality
  useEffect(() => {
    let interval;
    if (autoplay) {
      interval = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      }, 5000);
    }
    
    return () => clearInterval(interval);
  }, [autoplay]);
  
  const handlePrev = () => {
    setAutoplay(false);
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };
  
  const handleNext = () => {
    setAutoplay(false);
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };
  
  const handleDotClick = (index) => {
    setAutoplay(false);
    setActiveIndex(index);
  };

  return (
    <Box 
      id="testimonials" 
      sx={{ 
        py: { xs: 8, md: 12 },
        backgroundColor: isDark ? 'background.default' : '#f1f5f9',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decoration */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      
      <Container maxWidth="lg" sx={{ position: 'relative' }}>
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
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
              TESTIMONIALS
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
              What Our Users Say
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
              Discover how our platform is making a difference in healthcare management
            </Typography>
          </motion.div>
        </Box>
        
        <Box sx={{ position: 'relative', maxWidth: '900px', mx: 'auto' }}>
          {/* Testimonial carousel */}
          <Box 
            sx={{ 
              position: 'relative',
              height: { xs: '400px', md: '300px' },
              overflow: 'hidden',
            }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, x: 100 }}
                animate={{ 
                  opacity: activeIndex === index ? 1 : 0,
                  x: activeIndex === index ? 0 : 100,
                  position: activeIndex === index ? 'relative' : 'absolute',
                }}
                transition={{ duration: 0.5 }}
                style={{ 
                  width: '100%',
                  height: '100%',
                  top: 0,
                  left: 0,
                  visibility: activeIndex === index ? 'visible' : 'hidden',
                }}
              >
                <Paper
                  elevation={2}
                  sx={{
                    p: { xs: 3, md: 5 },
                    borderRadius: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <Quote 
                    size={40} 
                    style={{ 
                      opacity: 0.1,
                      position: 'absolute',
                      top: 20,
                      left: 20,
                    }} 
                  />
                  
                  <Typography 
                    variant="body1" 
                    paragraph
                    sx={{ 
                      mb: 4,
                      fontSize: { xs: '1rem', md: '1.125rem' },
                      fontStyle: 'italic',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    "{testimonial.text}"
                  </Typography>
                  
                  <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      sx={{ width: 56, height: 56, mr: 2 }}
                    >
                      {testimonial.name.charAt(0)}
                    </Avatar>
                    
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {testimonial.role}
                      </Typography>
                      <Rating 
                        value={testimonial.rating} 
                        readOnly 
                        size="small" 
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                  </Box>
                </Paper>
              </motion.div>
            ))}
          </Box>
          
          {/* Navigation buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 2 }}>
            <IconButton 
              onClick={handlePrev}
              sx={{ 
                backgroundColor: 'background.paper',
                boxShadow: 1,
                '&:hover': {
                  backgroundColor: 'background.paper',
                  boxShadow: 2,
                }
              }}
            >
              <ChevronLeft />
            </IconButton>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {testimonials.map((_, index) => (
                <Box
                  key={index}
                  onClick={() => handleDotClick(index)}
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor: activeIndex === index ? 'primary.main' : 'grey.300',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                />
              ))}
            </Box>
            
            <IconButton 
              onClick={handleNext}
              sx={{ 
                backgroundColor: 'background.paper',
                boxShadow: 1,
                '&:hover': {
                  backgroundColor: 'background.paper',
                  boxShadow: 2,
                }
              }}
            >
              <ChevronRight />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
} 
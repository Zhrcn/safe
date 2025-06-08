'use client';

import { Box, Container, Grid, Typography, Link, IconButton, Divider, useTheme } from '@mui/material';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { APP_NAME } from '@/app-config';

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
];

const quickLinks = [
  { name: 'About Us', href: '#' },
  { name: 'Services', href: '#' },
  { name: 'Doctors', href: '#' },
  { name: 'Departments', href: '#' },
  { name: 'Contact Us', href: '#' },
  { name: 'FAQs', href: '#' },
];

const legalLinks = [
  { name: 'Terms of Service', href: '#' },
  { name: 'Privacy Policy', href: '#' },
  { name: 'Cookie Policy', href: '#' },
  { name: 'HIPAA Compliance', href: '#' },
];

export default function Footer() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  const currentYear = new Date().getFullYear();

  return (
    <Box 
      component="footer" 
      sx={{ 
        backgroundColor: isDark ? 'background.paper' : '#f8fafc',
        pt: 8,
        pb: 4,
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          <Grid columns={{ xs: 12, md: 4 }}>
            <Box sx={{ mb: 3 }}>
              <Typography 
                variant="h5" 
                component="div" 
                sx={{ 
                  fontWeight: 700,
                  color: 'primary.main',
                  mb: 2,
                }}
              >
                {APP_NAME}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" paragraph>
                Providing secure, accessible, fast, and efficient healthcare services to improve lives through technology and compassionate care.
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                {socialLinks.map((social) => (
                  <IconButton 
                    key={social.label}
                    component="a"
                    href={social.href}
                    aria-label={social.label}
                    size="small"
                    sx={{ 
                      color: 'text.secondary',
                      '&:hover': {
                        color: 'primary.main',
                      }
                    }}
                  >
                    <social.icon size={18} />
                  </IconButton>
                ))}
              </Box>
            </Box>
            
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Mail size={16} style={{ marginRight: '8px' }} />
                <Link href="mailto:contact@safemedical.com" color="inherit" underline="hover">
                  contact@safemedical.com
                </Link>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Phone size={16} style={{ marginRight: '8px' }} />
                <Link href="tel:+1234567890" color="inherit" underline="hover">
                  (123) 456-7890
                </Link>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <MapPin size={16} style={{ marginRight: '8px', marginTop: '4px' }} />
                <Typography variant="body2" color="text.secondary">
                  1234 Healthcare Blvd, <br />
                  Medical City, MC 12345
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid columns={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="h6" component="h2" sx={{ mb: 3, fontWeight: 600 }}>
              Quick Links
            </Typography>
            
            <Grid container spacing={2}>
              <Grid columns={{ xs: 6 }}>
                {quickLinks.slice(0, Math.ceil(quickLinks.length / 2)).map((link) => (
                  <Box key={link.name} sx={{ mb: 1.5 }}>
                    <Link 
                      href={link.href}
                      color="text.secondary"
                      underline="hover"
                      sx={{ 
                        display: 'inline-flex',
                        alignItems: 'center',
                        '&:hover': {
                          color: 'primary.main',
                        }
                      }}
                    >
                      {link.name}
                    </Link>
                  </Box>
                ))}
              </Grid>
              <Grid columns={{ xs: 6 }}>
                {quickLinks.slice(Math.ceil(quickLinks.length / 2)).map((link) => (
                  <Box key={link.name} sx={{ mb: 1.5 }}>
                    <Link 
                      href={link.href}
                      color="text.secondary"
                      underline="hover"
                      sx={{ 
                        display: 'inline-flex',
                        alignItems: 'center',
                        '&:hover': {
                          color: 'primary.main',
                        }
                      }}
                    >
                      {link.name}
                    </Link>
                  </Box>
                ))}
              </Grid>
            </Grid>
          </Grid>
          
          <Grid columns={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="h6" component="h2" sx={{ mb: 3, fontWeight: 600 }}>
              Legal
            </Typography>
            
            {legalLinks.map((link) => (
              <Box key={link.name} sx={{ mb: 1.5 }}>
                <Link 
                  href={link.href}
                  color="text.secondary"
                  underline="hover"
                  sx={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    '&:hover': {
                      color: 'primary.main',
                    }
                  }}
                >
                  {link.name}
                </Link>
              </Box>
            ))}
            
            <Box sx={{ mt: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Subscribe to our newsletter
              </Typography>
              <Box 
                component="form" 
                sx={{ 
                  display: 'flex',
                  mt: 1.5,
                  '& .MuiInputBase-root': {
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                  },
                  '& .MuiButton-root': {
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                  }
                }}
              >
                <input
                  type="email"
                  placeholder="Your email"
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    borderTop: `1px solid ${theme.palette.divider}`,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    borderLeft: `1px solid ${theme.palette.divider}`,
                    borderRight: 'none',
                    borderRadius: '4px 0 0 4px',
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'white',
                    color: theme.palette.text.primary,
                    outline: 'none',
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: '10px 16px',
                    backgroundColor: theme.palette.primary.main,
                    color: 'white',
                    border: 'none',
                    borderRadius: '0 4px 4px 0',
                    cursor: 'pointer',
                  }}
                >
                  Subscribe
                </button>
              </Box>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 4 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Typography variant="body2" color="text.secondary">
            {currentYear} {APP_NAME}. All rights reserved.
          </Typography>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Designed with ❤️ for better healthcare
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
} 
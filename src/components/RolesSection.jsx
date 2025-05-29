'use client';

import { useState } from 'react';
import { Container, Typography, Grid, Box, Card, CardContent, Button, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { User, Stethoscope, Droplet } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ROLES } from '@/lib/config';

const roles = [
  {
    icon: User,
    title: 'Patient',
    description: 'Access your medical records, schedule appointments, and manage prescriptions.',
    features: ['View medical history', 'Book appointments', 'Manage prescriptions', 'Secure messaging'],
    role: ROLES.PATIENT,
    color: '#3b82f6',
    bgGradient: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
    darkBgGradient: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
  },
  {
    icon: Stethoscope,
    title: 'Doctor',
    description: 'Manage patient records, appointments, and issue digital prescriptions.',
    features: ['Patient management', 'Schedule appointments', 'Issue prescriptions', 'Medical records access'],
    role: ROLES.DOCTOR,
    color: '#8b5cf6',
    bgGradient: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)',
    darkBgGradient: 'linear-gradient(135deg, #4c1d95 0%, #5b21b6 100%)',
  },
  {
    icon: Droplet,
    title: 'Pharmacist',
    description: 'Process digital prescriptions and manage medication dispensing.',
    features: ['Process prescriptions', 'Inventory management', 'Patient consultation', 'Medication tracking'],
    role: ROLES.PHARMACIST,
    color: '#10b981',
    bgGradient: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
    darkBgGradient: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
  }
];

const RoleCard = ({ icon: Icon, title, description, features, role, color, bgGradient, darkBgGradient, index }) => {
  const router = useRouter();
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  
  const isDark = theme.palette.mode === 'dark';
  
  const handleLogin = () => {
    router.push(`/login?role=${role}`);
  };

  const handleRegister = () => {
    router.push(`/register?role=${role}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: '-50px' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        elevation={isHovered ? 8 : 1}
        sx={{
          height: '100%',
          borderRadius: 3,
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          transform: isHovered ? 'translateY(-8px)' : 'none',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            height: '100px',
            background: isDark ? darkBgGradient : bgGradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              opacity: 0.1,
              backgroundSize: '20px 20px',
              backgroundImage: `radial-gradient(${color} 1px, transparent 1px)`,
            }}
          />
          
          <Box
            sx={{
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.8)',
              borderRadius: '50%',
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            }}
          >
            <Icon size={40} color={color} />
          </Box>
        </Box>
        
        <CardContent sx={{ p: 4 }}>
          <Typography 
            variant="h5" 
            component="h3" 
            gutterBottom 
            sx={{ 
              fontWeight: 700, 
              textAlign: 'center',
              mb: 2,
            }}
          >
            {title}
          </Typography>
          
          <Typography 
            variant="body1" 
            color="text.secondary" 
            paragraph 
            sx={{ 
              textAlign: 'center',
              mb: 3,
            }}
          >
            {description}
          </Typography>
          
          <Box sx={{ mb: 4 }}>
            {features.map((feature, i) => (
              <Box 
                key={i} 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  mb: 1,
                }}
              >
                <Box 
                  component="span" 
                  sx={{ 
                    width: 6, 
                    height: 6, 
                    borderRadius: '50%', 
                    backgroundColor: color,
                    mr: 2,
                  }} 
                />
                <Typography variant="body2">
                  {feature}
                </Typography>
              </Box>
            ))}
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 'auto' }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: color,
                '&:hover': {
                  backgroundColor: color,
                  filter: 'brightness(0.9)',
                },
                px: 3,
              }}
              onClick={handleLogin}
            >
              Login
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: color,
                color: color,
                '&:hover': {
                  borderColor: color,
                  backgroundColor: `${color}10`,
                },
                px: 3,
              }}
              onClick={handleRegister}
            >
              Register
            </Button>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function RolesSection() {
  return (
    <Box 
      id="roles" 
      sx={{ 
        py: { xs: 8, md: 12 },
        backgroundColor: theme => 
          theme.palette.mode === 'dark' ? 'background.paper' : 'grey.50',
      }}
    >
      <Container maxWidth="lg">
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
              USER ACCESS
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
              Choose Your Role
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
              Select your role to access the features tailored for your specific healthcare needs
            </Typography>
          </motion.div>
        </Box>
        
        <Grid container spacing={4}>
          {roles.map((role, index) => (
            <Grid item xs={12} md={4} key={role.title}>
              <RoleCard {...role} index={index} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
} 
'use client';

import { useState } from 'react';
import { Container, Typography, Grid, Box, Card, CardContent, Button, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import { User, Stethoscope, Droplet, ArrowRight, CheckCircle2, Crown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ROLES } from '@/app-config';

const roles = [
  {
    icon: User,
    title: 'Patient',
    description: 'Access your medical records, schedule appointments, and manage prescriptions.',
    features: [
      'View medical history',
      'Book appointments',
      'Manage prescriptions',
      'Secure messaging',
      'Track health metrics',
      'Access test results'
    ],
    role: ROLES.PATIENT,
    color: '#3b82f6',
    bgGradient: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
    darkBgGradient: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
  },
  {
    icon: Stethoscope,
    title: 'Doctor',
    description: 'Manage patient records, appointments, and issue digital prescriptions.',
    features: [
      'Patient management',
      'Schedule appointments',
      'Issue prescriptions',
      'Medical records access',
      'Virtual consultations',
      'Treatment planning'
    ],
    role: ROLES.DOCTOR,
    color: '#8b5cf6',
    bgGradient: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)',
    darkBgGradient: 'linear-gradient(135deg, #4c1d95 0%, #5b21b6 100%)',
  },
  {
    icon: Droplet,
    title: 'Pharmacist',
    description: 'Process digital prescriptions and manage medication dispensing.',
    features: [
      'Process prescriptions',
      'Inventory management',
      'Patient consultation',
      'Medication tracking',
      'Drug interactions check',
      'Prescription verification'
    ],
    role: ROLES.PHARMACIST,
    color: '#10b981',
    bgGradient: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
    darkBgGradient: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
  },
];

const RoleCard = ({ icon: Icon, title, description, features, role, color, bgGradient, darkBgGradient, index }) => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
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
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
      className="h-full group"
    >
      <Card
        className={`h-full overflow-hidden rounded-2xl transition-all duration-300 ease-in-out shadow-md group-hover:shadow-xl ${
          isDark ? 'bg-gray-900' : 'bg-white'
        }  ${isTablet ? 'min-h-auto' : 'min-h-[500px]'}`}
      >
        <Box
          className="relative h-40 sm:h-48 overflow-hidden rounded-t-xl  transition-all duration-300"
          style={{
            background: isDark ? darkBgGradient : bgGradient,
          }}
        >
          <Box
            className="absolute inset-0 opacity-20"
            style={{
              backgroundSize: '20px 20px',
              backgroundImage: `radial-gradient(${color} 1px, transparent 1px)`,
            }}
          />
          
          <Box className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:rotate-3 -y-[-100px] group-hover:scale-75 transition-all duration-300">
            <Box
              className={`flex items-center justify-center rounded-full p-4 shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[360deg]`}
              style={{
                backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.2)' : (isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.8)'),
                width: isMobile ? '72px' : isTablet ? '80px' : '90px',
                height: isMobile ? '72px' : isTablet ? '80px' : '90px',
              }}
            >
              <Icon size={isMobile ? 36 : 48} color={color} />
            </Box>
          </Box>
        </Box>
        
        <CardContent className="p-5 sm:p-7 flex flex-col h-full">
          <Typography 
            variant="h5" 
            component="h3" 
            className={`mb-2 sm:mb-3 text-center font-bold text-lg sm:text-xl md:text-2xl transition-colors duration-300 group-hover:text-[${color}] ${isDark ? 'text-white' : 'text-gray-800'}`}
          >
            {title}
          </Typography>
          
          <Typography 
            variant="body1" 
            className="mb-4 sm:mb-6 text-center text-gray-600 dark:text-gray-300 text-sm sm:text-base"
          >
            {description}
          </Typography>
          
          <div className="mb-4 sm:mb-6 space-y-2 sm:space-y-3 flex-grow  transition-all duration-300">
            {features.map((feature, i) => (
              <div 
                key={i} 
                className="flex items-center justify-center space-x-2 sm:space-x-3"
              >
                <CheckCircle2 
                  size={isMobile ? 14 : 16} 
                  color={color}
                  className="flex-shrink-0"
                />
                <Typography 
                  variant="body2"
                  className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm"
                >
                  {feature}
                </Typography>
              </div>
            ))}
          </div>
          
          <div className="mt-auto flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-3  transition-transform duration-300">
            <Button
              variant="contained"
              className={`w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 font-semibold rounded-lg transition-all duration-300 group-hover:brightness-90 group-hover:shadow-lg`}
              style={{
                backgroundColor: color,
              }}
              onClick={handleLogin}
            >
              Login
            </Button>
            <Button
              variant="outlined"
              className={`w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 font-semibold rounded-lg transition-all duration-300 group-hover:shadow-lg`}
              style={{
                borderColor: color,
                color: color,
                backgroundColor: isHovered ? `${color}10` : 'transparent',
              }}
              onClick={handleRegister}
            >
              Register
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function RolesSection() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box 
      id="roles" 
      className={`relative overflow-hidden py-12 sm:py-16 md:py-24 w-full ${
        theme.palette.mode === 'dark' ? 'bg-background-paper' : 'bg-gray-50'
      }`}
    >
      <Container maxWidth={false} className="mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-8 sm:mb-12 md:mb-16 text-center"
        >
          <Typography 
            variant="overline" 
            component="p"
            className="mb-2 sm:mb-4 font-semibold tracking-wider text-primary text-xs sm:text-sm"
          >
            USER ACCESS
          </Typography>
          
          <Typography 
            variant="h3" 
            component="h2" 
            className="mb-3 sm:mb-4 font-bold text-3xl sm:text-4xl md:text-5xl leading-tight sm:leading-snug md:leading-normal"
          >
            Choose Your Role
          </Typography>
          
          <Typography 
            variant="body1" 
            className="text-gray-600 dark:text-gray-300 text-sm sm:text-base text-center"
          >
            Select your role to access the features tailored for your specific healthcare needs
          </Typography>
        </motion.div>

        <Box className="w-full flex flex-wrap justify-center items-center gap-x-4 sm:gap-x-6 md:gap-x-8 gap-y-8 sm:gap-y-12 md:gap-y-24">
          {roles.map((role, index) => (
            <Box key={role.title} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
              <RoleCard {...role} index={index} />
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
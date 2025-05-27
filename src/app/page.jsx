'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Paper,
  Divider
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  User,
  Stethoscope,
  Droplet,
  Shield,
  Calendar,
  FileText,
  Users
} from 'lucide-react';
import { ROLES } from '@/lib/config';

// Feature card component
const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div
    whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
    transition={{ duration: 0.2 }}
  >
    <Paper className="h-full p-6 flex flex-col">
      <Box className="flex items-center mb-4">
        <Box className="p-3 rounded-full bg-blue-100 mr-4">
          <Icon size={24} className="text-blue-600" />
        </Box>
        <Typography variant="h6" component="h3">
          {title}
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" paragraph>
        {description}
      </Typography>
    </Paper>
  </motion.div>
);

// Role card component
const RoleCard = ({ icon: Icon, title, description, role }) => {
  const router = useRouter();

  const handleLogin = () => {
    router.push(`/login?role=${role}`);
  };

  const handleRegister = () => {
    router.push('/register');
  };

  return (
    <Card className="h-full">
      <CardContent>
        <Box className="flex flex-col items-center mb-4">
          <Box className="p-4 rounded-full bg-blue-100 mb-3">
            <Icon size={36} className="text-blue-600" />
          </Box>
          <Typography variant="h5" component="h2" gutterBottom align="center">
            {title}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" paragraph align="center">
          {description}
        </Typography>
      </CardContent>
      <CardActions className="flex justify-center pb-4">
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogin}
        >
          Login
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleRegister}
        >
          Register
        </Button>
      </CardActions>
    </Card>
  );
};

export default function Home() {
  return (
    <Box className="min-h-screen pb-16">
      {/* Hero Section */}
      <Box className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography variant="h2" component="h1" className="font-bold mb-4" align="center">
              S.A.F.E Medical Platform
            </Typography>
            <Typography variant="h5" component="p" align="center" className="max-w-3xl mx-auto mb-8">
              Secure, Accessible, Fast, and Efficient healthcare management
            </Typography>
            <Box className="flex justify-center">
              <Button
                variant="contained"
                color="secondary"
                size="large"
                className="mr-4"
                onClick={() => document.getElementById('roles').scrollIntoView({ behavior: 'smooth' })}
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                size="large"
                onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              >
                Learn More
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Features Section */}
      <Box id="features" className="py-16">
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" className="mb-12 font-bold" align="center">
            Our Features
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <FeatureCard
                icon={Shield}
                title="Secure Records"
                description="Your medical records are securely stored and accessible only to authorized personnel."
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FeatureCard
                icon={Calendar}
                title="Easy Scheduling"
                description="Book appointments with your healthcare providers with just a few clicks."
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FeatureCard
                icon={FileText}
                title="Digital Prescriptions"
                description="Receive and manage your prescriptions digitally, with automatic refill reminders."
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Divider />

      {/* Roles Section */}
      <Box id="roles" className="py-16 bg-gray-50">
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" className="mb-12 font-bold" align="center">
            Choose Your Role
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <RoleCard
                icon={User}
                title="Patient"
                description="Access your medical records, schedule appointments, and manage prescriptions."
                role={ROLES.PATIENT}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <RoleCard
                icon={Stethoscope}
                title="Doctor"
                description="Manage patient records, appointments, and issue digital prescriptions."
                role={ROLES.DOCTOR}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <RoleCard
                icon={Droplet}
                title="Pharmacist"
                description="Process digital prescriptions and manage medication dispensing."
                role={ROLES.PHARMACIST}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box className="py-16 bg-blue-600 text-white">
        <Container maxWidth="md">
          <Typography variant="h4" component="h2" className="mb-6 font-bold" align="center">
            Join Our Healthcare Platform Today
          </Typography>
          <Typography variant="body1" paragraph align="center" className="mb-8">
            Experience the future of healthcare management with our secure and efficient platform.
          </Typography>
          <Box className="flex justify-center">
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => document.getElementById('roles').scrollIntoView({ behavior: 'smooth' })}
            >
              Get Started Now
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
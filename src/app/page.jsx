'use client';

import { Box, Typography, Card, CardContent, Grid, Paper } from '@mui/material';
import { Stethoscope, Pill, User } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HomePage() {
  const roles = [
    {
      name: 'Doctor',
      icon: Stethoscope,
      link: '/login?role=doctor',
      description: 'Access your patient records and appointments.',
      bgColor: 'bg-blue-100 dark:bg-blue-700',
      iconColor: 'text-blue-600 dark:text-blue-200',
      hoverColor: 'hover:bg-blue-200 dark:hover:bg-blue-600'
    },
    {
      name: 'Patient',
      icon: User,
      link: '/login?role=patient',
      description: 'Manage your health information and appointments.',
      bgColor: 'bg-green-100 dark:bg-green-700',
      iconColor: 'text-green-600 dark:text-green-200',
      hoverColor: 'hover:bg-green-200 dark:hover:bg-green-600'
    },
    {
      name: 'Pharmacist',
      icon: Pill,
      link: '/login?role=pharmacist',
      description: 'Manage pharmacy inventory and prescriptions.',
      bgColor: 'bg-purple-100 dark:bg-purple-700',
      iconColor: 'text-purple-600 dark:text-purple-200',
      hoverColor: 'hover:bg-purple-200 dark:hover:bg-purple-600'
    },
    {
      name: 'Admin',
      icon: User, // Consider a different icon for admin if available
      link: '/login?role=admin',
      description: 'Administer the platform and manage users.',
      bgColor: 'bg-red-100 dark:bg-red-700',
      iconColor: 'text-red-600 dark:text-red-200',
      hoverColor: 'hover:bg-red-200 dark:hover:bg-red-600'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <Box
      className="flex items-center justify-center min-h-screen bg-background text-foreground p-6 transition-colors duration-300"
    >
      <Paper elevation={6} className="p-8 rounded-lg shadow-xl text-center w-full max-w-4xl bg-card text-card-foreground transition-colors duration-300">
        <Typography variant="h3" gutterBottom className="text-foreground font-bold">
          Welcome to S.A.F.E
        </Typography>
        <Typography variant="h6" gutterBottom className="text-muted-foreground mb-8">
          Secure, Accessible, Fast, Efficient Medical Service Platform
        </Typography>

        <Typography variant="h5" component="h2" gutterBottom className="text-foreground mt-8 mb-6 font-semibold">
          Select Your Role
        </Typography>

        <motion.div
          className="flex flex-wrap justify-center gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {roles.map((role) => (
            <motion.div
              key={role.name}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
            >
              <Link href={role.link} passHref legacyBehavior>
                <Card
                  component="a"
                  className={`flex flex-col items-center p-6 rounded-lg shadow-md cursor-pointer h-full transition-all duration-300 ${role.hoverColor} bg-card text-card-foreground border border-border`}
                >
                  <Box className={`p-4 rounded-full ${role.bgColor} mb-4`}>
                    <role.icon size={40} className={role.iconColor} />
                  </Box>
                  <Typography variant="h6" component="div" className="font-semibold mb-2 text-foreground">
                    {role.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" className="text-muted-foreground flex-grow">
                    {role.description}
                  </Typography>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </Paper>
    </Box>
  );
}
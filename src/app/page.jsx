'use client';

import Link from 'next/link';
import { Card, CardContent, Typography, Button, Grid, Box } from '@mui/material';
// Import Lucid Icons
import { Hospital, Pill, User, Building } from 'lucide-react';

export default function WelcomePage() {
  const roles = [
    { name: 'Doctor', path: '/login?role=doctor', description: 'Access your doctor dashboard, manage patients and appointments.', icon: Hospital, iconBgColor: 'bg-blue-100', iconColor: 'text-blue-600', buttonColor: 'primary' },
    { name: 'Pharmacy', path: '/login?role=pharmacist', description: 'Manage prescriptions, inventory, and orders.', icon: Pill, iconBgColor: 'bg-green-100', iconColor: 'text-green-600', buttonColor: 'success' },
    { name: 'Patient', path: '/login?role=patient', description: 'View your health records and connect with doctors.', icon: User, iconBgColor: 'bg-gray-200', iconColor: 'text-gray-700', buttonColor: 'grey' },
    { name: 'Hospital', path: '/login?role=admin', description: 'Oversee hospital operations and staff.', icon: Building, iconBgColor: 'bg-orange-100', iconColor: 'text-orange-600', buttonColor: 'warning' },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8 text-center">
        <Typography variant="h3" component="h1" gutterBottom className="text-gray-900 font-bold">
          Welcome to Safe E-Health
        </Typography>
        <Typography variant="h6" component="p" className="text-gray-700 mb-8">
          Select your role to continue
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {roles.map((role) => (
            <Grid item xs={12} sm={6} md={3} key={role.name}>
              <Link href={role.path} passHref legacyBehavior>
                <Card className="h-full flex flex-col justify-between p-6 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-white cursor-pointer border border-gray-200">
                  <CardContent className="flex flex-col items-center text-center flex-grow p-0 pb-6">
                    <Box sx={{ mb: 2, borderRadius: '50%', p: 2, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} className={`${role.iconBgColor} rounded-full`}>
                      <role.icon size={40} strokeWidth={1.5} className={role.iconColor} />
                    </Box>
                    <Typography variant="h6" component="h2" gutterBottom className="font-extrabold text-gray-800 mb-1">
                      {role.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" className="flex-grow text-gray-600 mt-1">
                      {role.description}
                    </Typography>
                  </CardContent>
                  <Button variant="contained" color={role.buttonColor} className="w-full mt-auto">
                    Login as {role.name}
                  </Button>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
} from '@mui/material';
import AppointmentManagement from '@/components/doctor/AppointmentManagement';

export default function AppointmentsPage() {
  return (
    <Box className="p-6">
      <Box className="mb-6">
        <Typography variant="h4" component="h1" className="font-bold text-foreground">
          Appointment Management
        </Typography>
        <Typography variant="body1" className="text-muted-foreground">
          View, edit, and manage all appointments. Note that appointments can only be edited at least 24 hours in advance.
        </Typography>
      </Box>
      
      <AppointmentManagement />
    </Box>
  );
} 
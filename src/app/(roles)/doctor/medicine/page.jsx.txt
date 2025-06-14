'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
} from '@mui/material';
import MedicineQuery from '@/components/doctor/MedicineQuery';

export default function MedicinePage() {
  return (
    <Box className="p-6">
      <Box className="mb-6">
        <Typography variant="h4" component="h1" className="font-bold text-foreground">
          Medicine Availability
        </Typography>
        <Typography variant="body1" className="text-muted-foreground">
          Check the availability of medicines at partner pharmacies and find alternatives when needed.
        </Typography>
      </Box>
      
      <MedicineQuery />
    </Box>
  );
} 
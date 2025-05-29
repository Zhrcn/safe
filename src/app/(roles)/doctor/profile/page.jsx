'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
} from '@mui/material';
import ProfileManager from '@/components/doctor/ProfileManager';

export default function ProfilePage() {
  return (
    <Box className="p-6">
      <Box className="mb-6">
        <Typography variant="h4" component="h1" className="font-bold text-foreground">
          Doctor Profile
        </Typography>
        <Typography variant="body1" className="text-muted-foreground">
          Manage your personal information, education, and professional achievements.
        </Typography>
      </Box>
      
      <ProfileManager />
    </Box>
  );
} 
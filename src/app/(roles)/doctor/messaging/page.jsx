'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
} from '@mui/material';
import ChatInterface from '@/components/doctor/ChatInterface';

export default function MessagingPage() {
  return (
    <Box className="p-6">
      <Box className="mb-6">
        <Typography variant="h4" component="h1" className="font-bold text-foreground">
          Messaging Center
        </Typography>
        <Typography variant="body1" className="text-muted-foreground">
          Communicate with patients, pharmacists, and other healthcare providers.
        </Typography>
      </Box>
      
      <Paper className="p-0 bg-card border border-border rounded-lg">
        <ChatInterface />
      </Paper>
    </Box>
  );
} 
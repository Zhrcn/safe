'use client';

import { Typography, Box, Paper } from '@mui/material';

export default function DoctorMessagingPage() {
  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3 }} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
        <Typography variant="h4" gutterBottom className="text-gray-900 dark:text-white">
          Messaging
        </Typography>
        <Typography paragraph className="text-gray-700 dark:text-gray-300">
          This is the Doctor Messaging page. Content will be added here for secure messaging. This page will adapt to both light and dark themes.
        </Typography>
      </Paper>
    </Box>
  );
} 
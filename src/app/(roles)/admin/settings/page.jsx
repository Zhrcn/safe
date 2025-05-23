'use client';

import { Typography, Box, Paper } from '@mui/material';

export default function AdminSettingsPage() {
  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3 }} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-md">
        <Typography variant="h4" gutterBottom className="text-gray-900 dark:text-white font-bold">
          Admin Settings
        </Typography>
        <Typography paragraph className="text-gray-700 dark:text-gray-300">
          This page will display and manage system settings.
        </Typography>
      </Paper>
    </Box>
  );
} 
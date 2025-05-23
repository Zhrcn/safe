'use client';

import { Typography, Box, Paper } from '@mui/material';

export default function PatientMedicalFilePage() {
  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3 }} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-md">
        <Typography variant="h4" gutterBottom className="text-gray-900 dark:text-white font-bold">
          Medical File
        </Typography>
        <Typography paragraph className="text-gray-700 dark:text-gray-300">
          This is the Patient Medical File page. Content will be added here to view and manage access to your centralized medical file.
        </Typography>
      </Paper>
    </Box>
  );
} 
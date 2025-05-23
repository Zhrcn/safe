'use client';

import { Typography, Box, Paper, List, ListItem, ListItemText, Divider, Card, CardContent } from '@mui/material';
import { Pill, CalendarDays, Clock } from 'lucide-react';

// Mock Medications Data (replace with actual data fetching)
const mockMedications = [
  { id: 1, name: 'Lisinopril', dosage: '10 mg', frequency: 'Once daily', startDate: '2023-01-10', endDate: null },
  { id: 2, name: 'Amoxicillin', dosage: '500 mg', frequency: 'Three times a day', startDate: '2024-06-15', endDate: '2024-06-25' },
  { id: 3, name: 'Ibuprofen', dosage: '200 mg', frequency: 'As needed', startDate: '2024-05-01', endDate: null },
];

export default function PatientMedicationsPage() {
  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3 }} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-md min-h-[80vh]">
        <Typography variant="h4" gutterBottom className="text-gray-900 dark:text-white font-bold">
          Medications
        </Typography>
        <Typography paragraph className="text-gray-700 dark:text-gray-300 mb-6">
          View your prescribed medicines and manage reminders.
        </Typography>

        <Card className="shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardContent>
             <Box className="flex items-center mb-4">
                 <Pill size={28} className="mr-4 text-green-600 dark:text-green-400"/>
                 <Typography variant="h6" component="div" className="font-semibold text-gray-900 dark:text-white">Current Medications</Typography>
             </Box>

            <List className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
              {mockMedications.length === 0 ? (
                <ListItem>
                  <ListItemText primary="No medications found on record." className="text-gray-700 dark:text-gray-300"/>
                </ListItem>
              ) : (
                mockMedications.map((medication) => (
                  <ListItem
                    key={medication.id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 last:border-b-0"
                  >
                    <ListItemText
                      primary={<Typography variant="body1" className="font-semibold text-gray-900 dark:text-white">{medication.name}</Typography>}
                      secondary={
                        <Box className="flex flex-col mt-1 text-gray-700 dark:text-gray-300">
                          <Typography variant="body2"><strong>Dosage:</strong> {medication.dosage}</Typography>
                          <Typography variant="body2" className="flex items-center"><Clock size={16} className="mr-1 text-gray-500 dark:text-gray-400"/><strong>Frequency:</strong> {medication.frequency}</Typography>
                          {medication.endDate ? (
                            <Typography variant="body2" className="flex items-center"><CalendarDays size={16} className="mr-1 text-gray-500 dark:text-gray-400"/><strong>Duration:</strong> {medication.startDate} to {medication.endDate}</Typography>
                          ) : (
                            <Typography variant="body2" className="flex items-center"><CalendarDays size={16} className="mr-1 text-gray-500 dark:text-gray-400"/><strong>Start Date:</strong> {medication.startDate}</Typography>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                ))
              )}
            </List>
          </CardContent>
        </Card>

      </Paper>
    </Box>
  );
} 
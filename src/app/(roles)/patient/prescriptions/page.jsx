'use client';

import { Typography, Box, Paper, Card, CardContent, List, ListItem, ListItemText, Divider } from '@mui/material';
import { Pill, CalendarDays, User } from 'lucide-react';

// Mock Prescriptions Data (replace with actual data fetching)
const mockPrescriptions = [
  { id: 1, medication: 'Lisinopril', dosage: '10 mg', frequency: 'Once daily', issueDate: '2023-01-10', prescribingDoctor: 'Dr. Ahmad Al-Ali' },
  { id: 2, medication: 'Amoxicillin', dosage: '500 mg', frequency: 'Three times a day for 10 days', issueDate: '2024-06-15', prescribingDoctor: 'Dr. Maria Garcia' },
  { id: 3, medication: 'Ibuprofen', dosage: '200 mg', frequency: 'As needed for pain', issueDate: '2024-05-01', prescribingDoctor: 'Dr. Ahmad Al-Ali' },
];

export default function PatientPrescriptionsPage() {
  const prescriptions = mockPrescriptions; // In a real app, fetch patient's prescriptions

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3 }} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-md min-h-[80vh]"> {/* Theme-aware background, shadow, and minimum height */}
        <Typography variant="h4" gutterBottom className="text-gray-900 dark:text-white font-bold"> {/* Theme-aware text color */}
          Prescriptions
        </Typography>
        <Typography paragraph className="text-gray-700 dark:text-gray-300 mb-6"> {/* Theme-aware text color */}
          View your prescription history.
        </Typography>

        <Card className="shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"> {/* Theme-aware card styles */}
          <CardContent>
             <Box className="flex items-center mb-4">
                 <Pill size={28} className="mr-4 text-green-600 dark:text-green-400"/> {/* Themed icon color and spacing */}
                 <Typography variant="h6" component="div" className="font-semibold text-gray-900 dark:text-white">Prescription History</Typography> {/* Theme-aware text color */}
             </Box>

            <List className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden"> {/* Theme-aware border and rounded corners */}
              {prescriptions.length === 0 ? (
                <ListItem>
                  <ListItemText primary="No prescriptions found on record." className="text-gray-700 dark:text-gray-300"/> {/* Theme-aware text */}
                </ListItem>
              ) : (
                prescriptions.map((prescription, index) => (
                  <>
                    <ListItem
                      key={prescription.id}
                      className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200" // Theme-aware hover
                    >
                      <ListItemText
                        primary={<Typography variant="body1" className="font-semibold text-gray-900 dark:text-white">{prescription.medication}</Typography>} // Theme-aware text
                        secondary={
                          <Box className="flex flex-col mt-1 text-gray-700 dark:text-gray-300"> {/* Theme-aware text */}
                            <Typography variant="body2"><strong>Dosage:</strong> {prescription.dosage}</Typography>
                            <Typography variant="body2"><strong>Frequency:</strong> {prescription.frequency}</Typography>
                            <Typography variant="body2" className="flex items-center"><CalendarDays size={16} className="mr-1 text-gray-500 dark:text-gray-400"/><strong>Issue Date:</strong> {prescription.issueDate}</Typography> {/* Themed icon */}
                            <Typography variant="body2" className="flex items-center"><User size={16} className="mr-1 text-gray-500 dark:text-gray-400"/><strong>Prescribed By:</strong> {prescription.prescribingDoctor}</Typography> {/* Themed icon */}
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < prescriptions.length - 1 && <Divider className="!border-gray-200 dark:!border-gray-700"/> /* Theme-aware divider */}
                  </>
                ))
              )}
            </List>
          </CardContent>
        </Card>

        {/* Add search/filter or other actions here later */}

      </Paper>
    </Box>
  );
} 
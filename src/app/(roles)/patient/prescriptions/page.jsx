'use client';

import { Typography, Box, Paper, Card, CardContent, List, ListItem, ListItemText, Divider } from '@mui/material';
import { Pill, CalendarDays, User } from 'lucide-react';
import React from 'react';

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
      <Paper elevation={3} sx={{ p: 3 }} className="bg-card text-card-foreground rounded-lg shadow-md min-h-[80vh]">
        <Typography variant="h4" gutterBottom className="text-foreground font-bold">
          Prescriptions
        </Typography>
        <Typography paragraph className="text-muted-foreground mb-6">
          View your prescription history.
        </Typography>

        <Card className="shadow-lg rounded-lg border border-border bg-card">
          <CardContent>
            <Box className="flex items-center mb-4">
              <Pill size={28} className="mr-4 text-primary" />
              <Typography variant="h6" component="div" className="font-semibold text-foreground">Prescription History</Typography>
            </Box>

            <List className="border border-border rounded-md overflow-hidden">
              {prescriptions.length === 0 ? (
                <ListItem>
                  <ListItemText primary="No prescriptions found on record." className="text-muted-foreground" />
                </ListItem>
              ) : (
                prescriptions.map((prescription, index) => (
                  <React.Fragment key={prescription.id}>
                    <ListItem className="hover:bg-muted transition-colors duration-200">
                      <ListItemText
                        primary={<Typography variant="body1" className="font-semibold text-foreground">{prescription.medication}</Typography>}
                        secondary={
                          <Box className="flex flex-col mt-1 text-muted-foreground">
                            <Typography variant="body2"><strong>Dosage:</strong> {prescription.dosage}</Typography>
                            <Typography variant="body2"><strong>Frequency:</strong> {prescription.frequency}</Typography>
                            <Typography variant="body2" className="flex items-center"><CalendarDays size={16} className="mr-1 text-muted-foreground" /><strong>Issue Date:</strong> {prescription.issueDate}</Typography>
                            <Typography variant="body2" className="flex items-center"><User size={16} className="mr-1 text-muted-foreground" /><strong>Prescribed By:</strong> {prescription.prescribingDoctor}</Typography>
                          </Box>
                        }
                      />
                    </ListItem>{index < prescriptions.length - 1 && <Divider className="!border-border" />}
                  </React.Fragment>
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
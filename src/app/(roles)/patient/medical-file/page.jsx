'use client';

import { Typography, Box, Paper, Card, CardContent, Grid, List, ListItem, ListItemText, Divider } from '@mui/material';
import { HeartPulse, Allergy, FileText, Stethoscope } from 'lucide-react';
import React from 'react';

// Mock Medical File Data (replace with actual data fetching)
const mockMedicalFile = {
  conditions: [
    { id: 1, name: 'Hypertension', diagnosisDate: '2020-05-10' },
    { id: 2, name: 'Type 2 Diabetes', diagnosisDate: '2022-11-20' },
  ],
  allergies: [
    { id: 1, name: 'Penicillin', reaction: 'Rash' },
    { id: 2, name: 'Dust Mites', reaction: 'Sneezing, Itchy Eyes' },
  ],
  procedures: [
    { id: 1, name: 'Appendectomy', date: '2018-07-15' },
  ],
  immunizations: [
    { id: 1, name: 'Influenza Vaccine', date: '2023-10-01' },
    { id: 2, name: 'COVID-19 Vaccine (Booster)', date: '2023-04-20' },
  ],
  // Add other sections like lab results, imaging, etc.
};

export default function PatientMedicalFilePage() {
  const medicalFile = mockMedicalFile; // In a real app, fetch patient's medical file

  const MedicalFileSection = ({ title, icon: IconComponent, items, renderItem }) => (
    <Card className="h-full shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"> {/* Theme-aware card styles */}
      <CardContent>
        <Box className="flex items-center mb-4">
          <IconComponent size={28} className="mr-4 text-blue-600 dark:text-blue-400" /> {/* Themed icon color and spacing */}
          <Typography variant="h6" component="div" className="font-semibold text-gray-900 dark:text-white">{title}</Typography> {/* Theme-aware text color */}
        </Box>
        <List className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden"> {/* Theme-aware border and rounded corners */}
          {items.length === 0 ? (
            <ListItem>
              <ListItemText primary={`No ${title.toLowerCase()} found.`} className="text-gray-700 dark:text-gray-300" /> {/* Theme-aware text */}
            </ListItem>
          ) : (
            items.map((item, index) => (
              <React.Fragment key={item.id || index}>
                <ListItem className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                  {renderItem(item)}
                </ListItem>
                {index < items.length - 1 && <Divider className="!border-gray-200 dark:!border-gray-700" />}
              </React.Fragment>
            ))
          )}
        </List>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3 }} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-md min-h-[80vh]"> {/* Theme-aware background, shadow, and minimum height */}
        <Typography variant="h4" gutterBottom className="text-gray-900 dark:text-white font-bold"> {/* Theme-aware text color */}
          Medical File
        </Typography>
        <Typography paragraph className="text-gray-700 dark:text-gray-300 mb-6"> {/* Theme-aware text color */}
          View and manage access to your centralized medical file.
        </Typography>

        <Grid container spacing={3}> {/* Added spacing between grid items */}
          <Grid item xs={12} md={6}> {/* Conditions Section */}
            <MedicalFileSection
              title="Conditions"
              icon={HeartPulse}
              items={medicalFile.conditions}
              renderItem={(condition) => (
                <ListItemText
                  primary={<Typography variant="body1" className="font-semibold text-gray-900 dark:text-white">{condition.name}</Typography>} // Theme-aware text
                  secondary={<Typography variant="body2" className="text-gray-700 dark:text-gray-300">Diagnosis Date: {condition.diagnosisDate}</Typography>} // Theme-aware text
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}> {/* Allergies Section */}
            <MedicalFileSection
              title="Allergies"
              icon={Allergy}
              items={medicalFile.allergies}
              renderItem={(allergy) => (
                <ListItemText
                  primary={<Typography variant="body1" className="font-semibold text-gray-900 dark:text-white">{allergy.name}</Typography>} // Theme-aware text
                  secondary={<Typography variant="body2" className="text-gray-700 dark:text-gray-300">Reaction: {allergy.reaction}</Typography>} // Theme-aware text
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}> {/* Procedures Section */}
            <MedicalFileSection
              title="Procedures"
              icon={Stethoscope}
              items={medicalFile.procedures}
              renderItem={(procedure) => (
                <ListItemText
                  primary={<Typography variant="body1" className="font-semibold text-gray-900 dark:text-white">{procedure.name}</Typography>} // Theme-aware text
                  secondary={<Typography variant="body2" className="text-gray-700 dark:text-gray-300">Date: {procedure.date}</Typography>} // Theme-aware text
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}> {/* Immunizations Section */}
            <MedicalFileSection
              title="Immunizations"
              icon={FileText}
              items={medicalFile.immunizations}
              renderItem={(immunization) => (
                <ListItemText
                  primary={<Typography variant="body1" className="font-semibold text-gray-900 dark:text-white">{immunization.name}</Typography>} // Theme-aware text
                  secondary={<Typography variant="body2" className="text-gray-700 dark:text-gray-300">Date: {immunization.date}</Typography>} // Theme-aware text
                />
              )}
            />
          </Grid>

          {/* Add more sections like lab results, imaging, etc. */}

        </Grid>
      </Paper>
    </Box>
  );
} 
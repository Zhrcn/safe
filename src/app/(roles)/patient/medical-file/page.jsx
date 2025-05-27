'use client';

import { Typography, Box, Paper, Card, CardContent, Grid, List, ListItem, ListItemText, Divider, CircularProgress } from '@mui/material';
import { HeartPulse, FileText, Stethoscope } from 'lucide-react';
import SickIcon from '@mui/icons-material/Sick';
import React, { useEffect, useState } from 'react';
import { getMedicalFile } from '@/lib/api/medicalFile';

export default function PatientMedicalFilePage() {
  const [medicalFile, setMedicalFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMedicalFile() {
      try {
        const data = await getMedicalFile();
        setMedicalFile(data);
        setError(null);
      } catch (err) {
        setError('Failed to load medical file. Please try again later.');
        console.error('Error loading medical file:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchMedicalFile();
  }, []);

  const MedicalFileSection = ({ title, icon: IconComponent, items, renderItem }) => (
    <Card className="h-full shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <CardContent>
        <Box className="flex items-center mb-4">
          {IconComponent === SickIcon ? (
            <IconComponent className="mr-4 text-blue-600 dark:text-blue-400" fontSize="large" />
          ) : (
            <IconComponent size={28} className="mr-4 text-blue-600 dark:text-blue-400" />
          )}
          <Typography variant="h6" component="div" className="font-semibold text-gray-900 dark:text-white">
            {title}
          </Typography>
        </Box>
        <List className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
          {items?.length === 0 ? (
            <ListItem>
              <ListItemText
                primary={
                  <Typography variant="body1" className="text-gray-700 dark:text-gray-300">
                    {`No ${title.toLowerCase()} found.`}
                  </Typography>
                }
              />
            </ListItem>
          ) : (
            items?.map((item, index) => (
              <React.Fragment key={item._id || index}>
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

  if (loading) {
    return (
      <Box className="flex items-center justify-center min-h-[80vh]">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="flex items-center justify-center min-h-[80vh]">
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!medicalFile) {
    return (
      <Box className="flex items-center justify-center min-h-[80vh]">
        <Typography variant="h6" className="text-gray-700 dark:text-gray-300">
          No medical file found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3 }} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-md min-h-[80vh]">
        <Typography variant="h4" gutterBottom className="text-gray-900 dark:text-white font-bold">
          Medical File
        </Typography>
        <Typography component="div" className="text-gray-700 dark:text-gray-300 mb-6">
          View and manage access to your centralized medical file.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <MedicalFileSection
              title="Conditions"
              icon={HeartPulse}
              items={medicalFile.conditions}
              renderItem={(condition) => (
                <ListItemText
                  primary={
                    <Typography variant="body1" className="font-semibold text-gray-900 dark:text-white">
                      {condition.name}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" component="div" className="text-gray-700 dark:text-gray-300">
                      Diagnosis Date: {new Date(condition.diagnosisDate).toLocaleDateString()}
                      {condition.diagnosedBy && ` • Dr. ${condition.diagnosedBy.name}`}
                      {condition.status && ` • Status: ${condition.status}`}
                    </Typography>
                  }
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <MedicalFileSection
              title="Allergies"
              icon={SickIcon}
              items={medicalFile.allergies}
              renderItem={(allergy) => (
                <ListItemText
                  primary={
                    <Typography variant="body1" className="font-semibold text-gray-900 dark:text-white">
                      {allergy.name}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" component="div" className="text-gray-700 dark:text-gray-300">
                      Reaction: {allergy.reaction}
                      {allergy.severity && ` • Severity: ${allergy.severity}`}
                    </Typography>
                  }
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <MedicalFileSection
              title="Procedures"
              icon={Stethoscope}
              items={medicalFile.procedures}
              renderItem={(procedure) => (
                <ListItemText
                  primary={
                    <Typography variant="body1" className="font-semibold text-gray-900 dark:text-white">
                      {procedure.name}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" component="div" className="text-gray-700 dark:text-gray-300">
                      Date: {new Date(procedure.date).toLocaleDateString()}
                      {procedure.performedBy && ` • Dr. ${procedure.performedBy.name}`}
                      {procedure.facility && ` • ${procedure.facility}`}
                    </Typography>
                  }
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <MedicalFileSection
              title="Immunizations"
              icon={FileText}
              items={medicalFile.immunizations}
              renderItem={(immunization) => (
                <ListItemText
                  primary={
                    <Typography variant="body1" className="font-semibold text-gray-900 dark:text-white">
                      {immunization.name}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" component="div" className="text-gray-700 dark:text-gray-300">
                      Date: {new Date(immunization.date).toLocaleDateString()}
                      {immunization.administeredBy && ` • Dr. ${immunization.administeredBy.name}`}
                      {immunization.facility && ` • ${immunization.facility}`}
                      {immunization.nextDueDate && ` • Next Due: ${new Date(immunization.nextDueDate).toLocaleDateString()}`}
                    </Typography>
                  }
                />
              )}
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
} 
'use client';

import { Typography, Box, Paper, Card, CardContent, Grid, TextField, InputAdornment, Avatar } from '@mui/material';
import { User, Mail, Phone, Home, CalendarDays, FileText } from 'lucide-react';

// Mock Patient Profile Data (replace with actual data fetching)
const mockPatientProfile = {
  name: 'Patient A',
  age: 45,
  gender: 'Male',
  dateOfBirth: '1979-08-15',
  contact: {
    email: 'patient.a@example.com',
    phone: '+1 123 456 7890',
  },
  address: '123 Main St, Anytown, USA',
  medicalHistorySummary: 'Diagnosed with Hypertension in 2020. No known allergies. Current medications: Lisinopril.',
  // Add other profile details as needed
};

export default function PatientProfilePage() {
  const patient = mockPatientProfile; // In a real app, fetch authenticated patient's profile

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3 }} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-md"> {/* Theme-aware background and shadow */}
        <Typography variant="h4" gutterBottom className="text-gray-900 dark:text-white font-bold"> {/* Theme-aware text color */}
          Patient Profile
        </Typography>
        <Typography paragraph className="text-gray-700 dark:text-gray-300 mb-6"> {/* Theme-aware text color */}
          This page displays your personal and medical information.
        </Typography>

        <Grid container spacing={3}> {/* Added spacing between grid items */}
          <Grid item xs={12} md={4}> {/* Avatar and basic info card */}
             <Card className="h-full shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"> {/* Theme-aware card styles */}
              <CardContent className="flex flex-col items-center text-center">
                 <Avatar sx={{ bgcolor: 'primary.main', mb: 2, width: 80, height: 80 }} className="bg-green-500 dark:bg-green-700"> {/* Themed Avatar background with Patient color */}
                    <User size={40} className="text-white dark:text-gray-200"/> {/* Themed icon color */}
                 </Avatar>
                 <Typography variant="h5" component="div" className="font-bold mb-1 text-gray-900 dark:text-white">{patient.name}</Typography> {/* Theme-aware text color */}
                 <Typography variant="body1" className="text-gray-700 dark:text-gray-300">Age: {patient.age}</Typography> {/* Theme-aware text color */}
                 <Typography variant="body1" className="text-gray-700 dark:text-gray-300">Gender: {patient.gender}</Typography> {/* Theme-aware text color */}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}> {/* Personal and Contact Info Card */}
             <Card className="h-full shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"> {/* Theme-aware card styles */}
              <CardContent>
                <Typography variant="h6" gutterBottom className="font-semibold mb-4 text-gray-900 dark:text-white">Personal and Contact Information</Typography> {/* Theme-aware text color */}
                <Grid container spacing={2}> {/* Spacing within this card */}
                   <Grid item xs={12} sm={6}> {/* Responsive grid items */}
                      <TextField
                        label="Date of Birth"
                        value={patient.dateOfBirth}
                        fullWidth
                        InputProps={{ readOnly: true, startAdornment: (<InputAdornment position="start"><CalendarDays size={20} className="text-gray-500 dark:text-gray-400"/></InputAdornment>), className: 'text-gray-900 dark:text-white' }} // Themed input text and icon color
                         InputLabelProps={{
                           style: { color: 'inherit' },
                        }}
                        variant="outlined"
                         sx={{
                            '& .MuiOutlinedInput-root': { // Style the input border
                                fieldset: { borderColor: '#d1d5db' }, // Default border
                                '&:hover fieldset': { borderColor: '#9ca3af' }, // Hover border
                                 '&.Mui-focused fieldset': { borderColor: '#3b82f6' }, // Focused border
                                  '& .MuiOutlinedInput-notchedOutline': { // Dark theme borders
                                       borderColor: '#4b5563',
                                 },
                                 '&:hover .MuiOutlinedInput-notchedOutline': {
                                      borderColor: '#6b7280',
                                 },
                                 '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                      borderColor: '#60a5fa',
                                 },
                            },
                             '& .MuiInputBase-input::placeholder': { // Themed placeholder color
                                 color: '#9ca3af', // Default placeholder color
                                 opacity: 1, // Ensure placeholder is visible
                                 '.dark & ': { // Dark mode placeholder color
                                      color: '#6b7280',
                                 },
                             },
                             '& .MuiInputLabel-outlined': { // Themed label color
                                  color: '#6b7280', // Default label color
                                   '.dark & ': { // Dark mode label color
                                       color: '#9ca3af',
                                 },
                             },
                         }}
                      />
                   </Grid>
                   <Grid item xs={12} sm={6}> {/* Responsive grid items */}
                      <TextField
                        label="Email"
                        value={patient.contact.email}
                        fullWidth
                         InputProps={{ readOnly: true, startAdornment: (<InputAdornment position="start"><Mail size={20} className="text-gray-500 dark:text-gray-400"/></InputAdornment>), className: 'text-gray-900 dark:text-white' }} // Themed input text and icon color
                          InputLabelProps={{
                           style: { color: 'inherit' },
                        }}
                        variant="outlined"
                         sx={{
                            '& .MuiOutlinedInput-root': { // Style the input border
                                fieldset: { borderColor: '#d1d5db' }, // Default border
                                '&:hover fieldset': { borderColor: '#9ca3af' }, // Hover border
                                 '&.Mui-focused fieldset': { borderColor: '#3b82f6' }, // Focused border
                                  '& .MuiOutlinedInput-notchedOutline': { // Dark theme borders
                                       borderColor: '#4b5563',
                                 },
                                 '&:hover .MuiOutlinedInput-notchedOutline': {
                                      borderColor: '#6b7280',
                                 },
                                 '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                      borderColor: '#60a5fa',
                                 },
                            },
                             '& .MuiInputBase-input::placeholder': { // Themed placeholder color
                                 color: '#9ca3af', // Default placeholder color
                                 opacity: 1, // Ensure placeholder is visible
                                 '.dark & ': { // Dark mode placeholder color
                                      color: '#6b7280',
                                 },
                             },
                             '& .MuiInputLabel-outlined': { // Themed label color
                                  color: '#6b7280', // Default label color
                                   '.dark & ': { // Dark mode label color
                                       color: '#9ca3af',
                                 },
                             },
                         }}
                      />
                   </Grid>
                   <Grid item xs={12} sm={6}> {/* Responsive grid items */}
                      <TextField
                        label="Phone"
                        value={patient.contact.phone}
                        fullWidth
                         InputProps={{ readOnly: true, startAdornment: (<InputAdornment position="start"><Phone size={20} className="text-gray-500 dark:text-gray-400"/></InputAdornment>), className: 'text-gray-900 dark:text-white' }} // Themed input text and icon color
                          InputLabelProps={{
                           style: { color: 'inherit' },
                        }}
                        variant="outlined"
                         sx={{
                            '& .MuiOutlinedInput-root': { // Style the input border
                                fieldset: { borderColor: '#d1d5db' }, // Default border
                                '&:hover fieldset': { borderColor: '#9ca3af' }, // Hover border
                                 '&.Mui-focused fieldset': { borderColor: '#3b82f6' }, // Focused border
                                  '& .MuiOutlinedInput-notchedOutline': { // Dark theme borders
                                       borderColor: '#4b5563',
                                 },
                                 '&:hover .MuiOutlinedInput-notchedOutline': {
                                      borderColor: '#6b7280',
                                 },
                                 '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                      borderColor: '#60a5fa',
                                 },
                            },
                             '& .MuiInputBase-input::placeholder': { // Themed placeholder color
                                 color: '#9ca3af', // Default placeholder color
                                 opacity: 1, // Ensure placeholder is visible
                                 '.dark & ': { // Dark mode placeholder color
                                      color: '#6b7280',
                                 },
                             },
                             '& .MuiInputLabel-outlined': { // Themed label color
                                  color: '#6b7280', // Default label color
                                   '.dark & ': { // Dark mode label color
                                       color: '#9ca3af',
                                 },
                             },
                         }}
                      />
                   </Grid>
                   <Grid item xs={12}> {/* Responsive grid items */}
                      <TextField
                        label="Address"
                        value={patient.address}
                        fullWidth
                         InputProps={{ readOnly: true, startAdornment: (<InputAdornment position="start"><Home size={20} className="text-gray-500 dark:text-gray-400"/></InputAdornment>), className: 'text-gray-900 dark:text-white' }} // Themed input text and icon color
                          InputLabelProps={{
                           style: { color: 'inherit' },
                        }}
                        variant="outlined"
                         sx={{
                            '& .MuiOutlinedInput-root': { // Style the input border
                                fieldset: { borderColor: '#d1d5db' }, // Default border
                                '&:hover fieldset': { borderColor: '#9ca3af' }, // Hover border
                                 '&.Mui-focused fieldset': { borderColor: '#3b82f6' }, // Focused border
                                  '& .MuiOutlinedInput-notchedOutline': { // Dark theme borders
                                       borderColor: '#4b5563',
                                 },
                                 '&:hover .MuiOutlinedInput-notchedOutline': {
                                      borderColor: '#6b7280',
                                 },
                                 '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                      borderColor: '#60a5fa',
                                 },
                            },
                             '& .MuiInputBase-input::placeholder': { // Themed placeholder color
                                 color: '#9ca3af', // Default placeholder color
                                 opacity: 1, // Ensure placeholder is visible
                                 '.dark & ': { // Dark mode placeholder color
                                      color: '#6b7280',
                                 },
                             },
                             '& .MuiInputLabel-outlined': { // Themed label color
                                  color: '#6b7280', // Default label color
                                   '.dark & ': { // Dark mode label color
                                       color: '#9ca3af',
                                 },
                             },
                         }}
                      />
                   </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}> {/* Medical History Summary Card */}
            <Card className="h-full shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"> {/* Theme-aware card styles */}
              <CardContent>
                 <Box className="flex items-center mb-4">
                     <FileText size={28} className="mr-4 text-blue-600 dark:text-blue-400"/> {/* Themed icon color and spacing */}
                     <Typography variant="h6" component="div" className="font-semibold text-gray-900 dark:text-white">Medical History Summary</Typography> {/* Theme-aware text color */}
                 </Box>
                <Typography variant="body1" className="text-gray-700 dark:text-gray-300">{patient.medicalHistorySummary}</Typography> {/* Theme-aware text color */}
              </CardContent>
            </Card>
          </Grid>

           {/* Add more sections like medications, appointments, etc. */}

        </Grid>
      </Paper>
    </Box>
  );
}

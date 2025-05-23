'use client';

import { Typography, Box, Paper, Card, CardContent, Grid, TextField, InputAdornment, Avatar } from '@mui/material';
import { User, Mail, Phone, MapPin } from 'lucide-react';

// Mock Pharmacist Profile Data (replace with actual data fetching)
const mockPharmacistProfile = {
  name: 'Fatima Al-Abbas',
  location: 'Downtown Pharmacy',
  licenseNumber: 'PH98765',
  contact: {
    email: 'fatima.abbas@example.com',
    phone: '+963 99 876 5432',
  },
  // Add other profile details as needed
};

export default function PharmacistProfilePage() {
  const pharmacist = mockPharmacistProfile; // In a real app, fetch authenticated pharmacist's profile

  return (
    <Box className="p-6 bg-gray-100 dark:bg-[#0f172a] min-h-screen"> {/* Add theme-aware background and padding to the main container */}
      <Paper elevation={3} sx={{ p: 3 }} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-md min-h-[80vh]"> {/* Theme-aware background, shadow, and minimum height */}
        <Typography variant="h4" gutterBottom className="text-gray-900 dark:text-white font-bold"> {/* Theme-aware text color */}
          Pharmacist Profile
        </Typography>
        <Typography paragraph className="text-gray-700 dark:text-gray-300 mb-6"> {/* Theme-aware text color */}
          This page displays your profile information.
        </Typography>

        <Grid container spacing={3}> {/* Added spacing between grid items */}
          <Grid item xs={12} md={4}> {/* Avatar and basic info card */}
             <Card className="h-full shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"> {/* Theme-aware card styles */}
              <CardContent className="flex flex-col items-center text-center">
                 <Avatar sx={{ bgcolor: 'primary.main', mb: 2, width: 80, height: 80 }} className="bg-green-500 dark:bg-green-700"> {/* Themed Avatar background with Pharmacist color */}
                    <User size={40} className="text-white dark:text-gray-200"/> {/* Themed icon color */}
                 </Avatar>
                 <Typography variant="h5" component="div" className="font-bold mb-1 text-gray-900 dark:text-white">{pharmacist.name}</Typography> {/* Theme-aware text color */}
                 <Typography variant="body1" className="text-gray-700 dark:text-gray-300">License: {pharmacist.licenseNumber}</Typography> {/* Theme-aware text color */}
                 <Typography variant="body1" className="text-gray-700 dark:text-gray-300 flex items-center"><MapPin size={16} className="mr-1 text-gray-500 dark:text-gray-400"/>{pharmacist.location}</Typography> {/* Theme-aware text color and icon */}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}> {/* Contact Info Card */}
             <Card className="h-full shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"> {/* Theme-aware card styles */}
              <CardContent>
                <Typography variant="h6" gutterBottom className="font-semibold mb-4 text-gray-900 dark:text-white">Contact Information</Typography> {/* Theme-aware text color */}
                <Grid container spacing={2}> {/* Spacing within this card */}
                   <Grid item xs={12} sm={6}> {/* Responsive grid items */}
                      <TextField
                        label="Email"
                        value={pharmacist.contact.email}
                        fullWidth
                         InputProps={{ readOnly: true, startAdornment: (<InputAdornment position="start"><Mail size={20} className="text-gray-500 dark:text-gray-400"/></InputAdornment>), className: 'text-gray-900 dark:text-white' }} // Themed input text and icon color
                          InputLabelProps={{
                           style: { color: 'inherit' },
                        }}
                        variant="outlined"
                         sx={{
                            '& .MuiOutlinedInput-root': {
                                 fieldset: { borderColor: '#d1d5db' },
                                 '&:hover fieldset': { borderColor: '#9ca3af' },
                                 '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                                 '& .MuiOutlinedInput-notchedOutline': {
                                      borderColor: '#4b5563',
                                 },
                                 '&:hover .MuiOutlinedInput-notchedOutline': {
                                      borderColor: '#6b7280',
                                 },
                                 '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                      borderColor: '#60a5fa',
                                 },
                            },
                             '& .MuiInputBase-input::placeholder': {
                                 color: '#9ca3af',
                                 opacity: 1,
                                 '.dark & ': {
                                      color: '#6b7280',
                                 },
                             },
                             '& .MuiInputLabel-outlined': {
                                  color: '#6b7280',
                                   '.dark & ': {
                                       color: '#9ca3af',
                                 },
                             },
                         }}
                      />
                   </Grid>
                   <Grid item xs={12} sm={6}> {/* Responsive grid items */}
                      <TextField
                        label="Phone"
                        value={pharmacist.contact.phone}
                        fullWidth
                         InputProps={{ readOnly: true, startAdornment: (<InputAdornment position="start"><Phone size={20} className="text-gray-500 dark:text-gray-400"/></InputAdornment>), className: 'text-gray-900 dark:text-white' }} // Themed input text and icon color
                          InputLabelProps={{
                           style: { color: 'inherit' },
                        }}
                        variant="outlined"
                         sx={{
                            '& .MuiOutlinedInput-root': {
                                 fieldset: { borderColor: '#d1d5db' },
                                 '&:hover fieldset': { borderColor: '#9ca3af' },
                                 '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                                 '& .MuiOutlinedInput-notchedOutline': {
                                      borderColor: '#4b5563',
                                 },
                                 '&:hover .MuiOutlinedInput-notchedOutline': {
                                      borderColor: '#6b7280',
                                 },
                                 '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                      borderColor: '#60a5fa',
                                 },
                            },
                             '& .MuiInputBase-input::placeholder': {
                                 color: '#9ca3af',
                                 opacity: 1,
                                 '.dark & ': {
                                      color: '#6b7280',
                                 },
                             },
                             '& .MuiInputLabel-outlined': {
                                  color: '#6b7280',
                                   '.dark & ': {
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

           {/* Add more sections like inventory management access, etc. */}

        </Grid>
      </Paper>
    </Box>
  );
} 
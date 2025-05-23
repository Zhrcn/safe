'use client';

import { Typography, Card, CardContent, Box, Avatar, Grid, TextField, Paper, InputAdornment } from '@mui/material';
import { User, Mail, Phone, Hospital, Home, FileText } from 'lucide-react';

// Mock Doctor Profile Data (replace with actual data fetching)
const mockDoctorProfile = {
  name: 'Dr. Ahmad Al-Ali',
  specialty: 'General Surgery',
  contact: {
    email: 'ahmad.ali@example.com',
    phone: '+963 11 123 4567',
  },
  address: 'Damascus, Syria',
  licenseNumber: 'DR12345',
  // Add other profile details as needed
};

export default function DoctorProfilePage() {
  const doctor = mockDoctorProfile; // In a real app, fetch authenticated doctor's profile

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3 }} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-md">
        <Typography variant="h4" gutterBottom className="text-gray-900 dark:text-white font-bold">
          Doctor Profile
        </Typography>
        <Typography paragraph className="text-gray-700 dark:text-gray-300 mb-6">
          This page displays and allows editing of your profile information.
        </Typography>
        <Card className="mb-6 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardContent>
            <Box className="flex items-center mb-6 p-4 border-b border-gray-200 dark:border-gray-700">
              <Avatar sx={{ bgcolor: 'primary.main', mr: 3, width: 80, height: 80 }} className="bg-blue-500 dark:bg-blue-700 shadow-md">
                <User size={40} className="text-white dark:text-gray-200"/>
              </Avatar>
              <div>
                <Typography variant="h5" component="h1" className="font-bold text-gray-900 dark:text-white">Doctor Profile</Typography>
                <Typography variant="h6" className="text-gray-700 dark:text-gray-300">Dr. {doctor.name}</Typography>
              </div>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Full Name"
                  value={doctor.name}
                  fullWidth
                  InputProps={{ readOnly: true, startAdornment: (<InputAdornment position="start"><User size={20} className="text-gray-500 dark:text-gray-400"/></InputAdornment>), className: 'text-gray-900 dark:text-white' }}
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
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Specialty"
                  value={doctor.specialty}
                  fullWidth
                  InputProps={{ readOnly: true, startAdornment: (<InputAdornment position="start"><Hospital size={20} className="text-gray-500 dark:text-gray-400"/></InputAdornment>), className: 'text-gray-900 dark:text-white' }}
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
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  value={doctor.contact.email}
                  fullWidth
                  InputProps={{ readOnly: true, startAdornment: (<InputAdornment position="start"><Mail size={20} className="text-gray-500 dark:text-gray-400"/></InputAdornment>), className: 'text-gray-900 dark:text-white' }}
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
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone"
                  value={doctor.contact.phone}
                  fullWidth
                  InputProps={{ readOnly: true, startAdornment: (<InputAdornment position="start"><Phone size={20} className="text-gray-500 dark:text-gray-400"/></InputAdornment>), className: 'text-gray-900 dark:text-white' }}
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
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Address"
                  value={doctor.address}
                  fullWidth
                  InputProps={{ readOnly: true, startAdornment: (<InputAdornment position="start"><Home size={20} className="text-gray-500 dark:text-gray-400"/></InputAdornment>), className: 'text-gray-900 dark:text-white' }}
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
              <Grid item xs={12} sm={6}>
                <TextField
                  label="License Number"
                  value={doctor.licenseNumber}
                  fullWidth
                  InputProps={{ readOnly: true, startAdornment: (<InputAdornment position="start"><FileText size={20} className="text-gray-500 dark:text-gray-400"/></InputAdornment>), className: 'text-gray-900 dark:text-white' }}
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
              {/* Add more fields for other profile information */}
            </Grid>

          </CardContent>
        </Card>
      </Paper>
    </Box>
  );
} 
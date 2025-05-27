'use client';

import { useState, useEffect } from 'react';
import { Typography, Card, CardContent, Box, Avatar, Grid, TextField, Paper, InputAdornment, Button, Snackbar, Alert } from '@mui/material';
import { User, Mail, Phone, Home, FileText, Save, Edit } from 'lucide-react';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

// Mock Doctor Profile Data (replace with actual data fetching)
const mockDoctorProfile = {
  id: 'doc123',
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
  const [doctor, setDoctor] = useState(mockDoctorProfile); // In a real app, fetch authenticated doctor's profile
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...doctor });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // In a real app, fetch doctor profile from API
  useEffect(() => {
    // Example API call:
    // async function fetchDoctorProfile() {
    //   try {
    //     const response = await fetch('/api/users/doctors?id=current');
    //     if (response.ok) {
    //       const data = await response.json();
    //       setDoctor(data.doctor);
    //       setFormData(data.doctor);
    //     }
    //   } catch (error) {
    //     console.error('Error fetching doctor profile:', error);
    //   }
    // }
    // fetchDoctorProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Handle nested objects
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // If canceling edit, reset form data
      setFormData({ ...doctor });
    }
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = async () => {
    try {
      // In a real app, save to API
      // const response = await fetch('/api/users/doctors', {
      //   method: 'PATCH',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     id: doctor.id,
      //     ...formData
      //   }),
      // });

      // if (response.ok) {
      //   const data = await response.json();
      //   setDoctor(data.doctor);

      //   setSnackbar({
      //     open: true,
      //     message: 'Profile updated successfully',
      //     severity: 'success'
      //   });
      //   setIsEditing(false);
      // } else {
      //   setSnackbar({
      //     open: true,
      //     message: 'Failed to update profile',
      //     severity: 'error'
      //   });
      // }

      // For mock implementation:
      setDoctor({ ...formData });
      setSnackbar({
        open: true,
        message: 'Profile updated successfully',
        severity: 'success'
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setSnackbar({
        open: true,
        message: 'An error occurred while updating profile',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3 }} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-md">
        <Box className="flex justify-between items-center mb-4">
          <Typography variant="h4" gutterBottom className="text-gray-900 dark:text-white font-bold">
            Doctor Profile
          </Typography>
          <Button
            variant={isEditing ? "outlined" : "contained"}
            startIcon={isEditing ? <Save /> : <Edit />}
            onClick={isEditing ? handleSaveProfile : handleEditToggle}
            className={isEditing ? "border-blue-500 text-blue-500" : "bg-blue-600 text-white"}
          >
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </Button>
        </Box>
        <Typography paragraph className="text-gray-700 dark:text-gray-300 mb-6">
          {isEditing ? 'Edit your profile information below and save changes when done.' : 'This page displays your profile information.'}
        </Typography>
        <Card className="mb-6 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardContent>
            <Box className="flex items-center mb-6 p-4 border-b border-gray-200 dark:border-gray-700">
              <Avatar sx={{ bgcolor: 'primary.main', mr: 3, width: 80, height: 80 }} className="bg-blue-500 dark:bg-blue-700 shadow-md">
                <User size={40} className="text-white dark:text-gray-200" />
              </Avatar>
              <div>
                <Typography variant="h5" component="h1" className="font-bold text-gray-900 dark:text-white">Doctor Profile</Typography>
                <Typography variant="h6" className="text-gray-700 dark:text-gray-300">Dr. {formData.name}</Typography>
              </div>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  fullWidth
                  InputProps={{
                    readOnly: !isEditing,
                    startAdornment: (<InputAdornment position="start"><User size={20} className="text-gray-500 dark:text-gray-400" /></InputAdornment>),
                    className: 'text-gray-900 dark:text-white'
                  }}
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
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleInputChange}
                  fullWidth
                  InputProps={{
                    readOnly: !isEditing,
                    startAdornment: (<InputAdornment position="start"><LocalHospitalIcon fontSize="small" className="text-gray-500 dark:text-gray-400" /></InputAdornment>),
                    className: 'text-gray-900 dark:text-white'
                  }}
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
                  name="contact.email"
                  value={formData.contact.email}
                  onChange={handleInputChange}
                  fullWidth
                  InputProps={{
                    readOnly: !isEditing,
                    startAdornment: (<InputAdornment position="start"><Mail size={20} className="text-gray-500 dark:text-gray-400" /></InputAdornment>),
                    className: 'text-gray-900 dark:text-white'
                  }}
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
                  name="contact.phone"
                  value={formData.contact.phone}
                  onChange={handleInputChange}
                  fullWidth
                  InputProps={{
                    readOnly: !isEditing,
                    startAdornment: (<InputAdornment position="start"><Phone size={20} className="text-gray-500 dark:text-gray-400" /></InputAdornment>),
                    className: 'text-gray-900 dark:text-white'
                  }}
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
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  fullWidth
                  InputProps={{
                    readOnly: !isEditing,
                    startAdornment: (<InputAdornment position="start"><Home size={20} className="text-gray-500 dark:text-gray-400" /></InputAdornment>),
                    className: 'text-gray-900 dark:text-white'
                  }}
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
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  fullWidth
                  InputProps={{
                    readOnly: !isEditing,
                    startAdornment: (<InputAdornment position="start"><FileText size={20} className="text-gray-500 dark:text-gray-400" /></InputAdornment>),
                    className: 'text-gray-900 dark:text-white'
                  }}
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

              {isEditing && (
                <Grid item xs={12} className="flex justify-end mt-4">
                  <Button
                    variant="outlined"
                    onClick={handleEditToggle}
                    className="mr-2 border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSaveProfile}
                    className="bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Save Changes
                  </Button>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
} 
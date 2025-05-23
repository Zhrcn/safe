'use client';

import { Typography, Card, CardContent, Box, Avatar, Grid, TextField } from '@mui/material';
import { User, Mail, Phone, Hospital } from 'lucide-react';
import { Paper } from '@mui/material';

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
      <Paper elevation={3} sx={{ p: 3 }} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
        <Typography variant="h4" gutterBottom className="text-gray-900 dark:text-white">
          Doctor Profile
        </Typography>
        <Typography paragraph className="text-gray-700 dark:text-gray-300">
          This is the Doctor Profile page. Content will be added here to display and edit doctor profile information. This page will adapt to both light and dark themes.
        </Typography>
        <Card className="mb-6 shadow-lg">
          <CardContent>
            <Box className="flex items-center mb-6">
              <Avatar sx={{ bgcolor: 'primary.main', mr: 3, width: 80, height: 80 }}>
                <User size={40} />
              </Avatar>
              <div>
                <Typography variant="h4" component="h1" className="font-bold">Doctor Profile</Typography>
                <Typography variant="h6" color="text.secondary">Dr. {doctor.name}</Typography>
              </div>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Full Name"
                  value={doctor.name}
                  fullWidth
                  InputProps={{ readOnly: true, startAdornment: (<InputAdornment position="start"><User size={20} /></InputAdornment>) }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Specialty"
                  value={doctor.specialty}
                  fullWidth
                  InputProps={{ readOnly: true, startAdornment: (<InputAdornment position="start"><Hospital size={20} /></InputAdornment>) }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  value={doctor.contact.email}
                  fullWidth
                  InputProps={{ readOnly: true, startAdornment: (<InputAdornment position="start"><Mail size={20} /></InputAdornment>) }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone"
                  value={doctor.contact.phone}
                  fullWidth
                  InputProps={{ readOnly: true, startAdornment: (<InputAdornment position="start"><Phone size={20} /></InputAdornment>) }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Address"
                  value={doctor.address}
                  fullWidth
                  InputProps={{ readOnly: true, startAdornment: (<InputAdornment position="start"><Home size={20} /></InputAdornment>) }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="License Number"
                  value={doctor.licenseNumber}
                  fullWidth
                  InputProps={{ readOnly: true }}
                  variant="outlined"
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

import InputAdornment from '@mui/material/InputAdornment'; // Import needed for TextField adornment
import Home from 'lucide-react'; // Import Home icon from Lucid 
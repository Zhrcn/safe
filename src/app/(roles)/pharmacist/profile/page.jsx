'use client';

import { useState, useEffect } from 'react';
import { Typography, Box, Grid, TextField, InputAdornment, Avatar, Card, CardContent } from '@mui/material';
import { User, Mail, Phone, MapPin } from 'lucide-react';
import { PharmacistPageContainer } from '@/components/pharmacist/PharmacistComponents';
import { getPharmacistProfile } from '@/services/pharmacistService';

export default function PharmacistProfilePage() {
  const [pharmacist, setPharmacist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const data = await getPharmacistProfile();
        setPharmacist(data);
      } catch (error) {
        console.error('Error loading pharmacist profile:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  if (loading) {
    return (
      <PharmacistPageContainer
        title="Pharmacist Profile"
        description="Loading profile information..."
      >
        <Box className="flex justify-center items-center h-64">
          <Typography>Loading profile data...</Typography>
        </Box>
      </PharmacistPageContainer>
    );
  }

  return (
    <PharmacistPageContainer
      title="Pharmacist Profile"
      description="This page displays your profile information."
    >
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          {/* Avatar and basic info card */}
          <Card className="h-full shadow-lg rounded-lg border border-border bg-card">
            <CardContent className="flex flex-col items-center text-center">
              <Avatar sx={{ bgcolor: 'primary.main', mb: 2, width: 80, height: 80 }} className="bg-green-500 dark:bg-green-700">
                <User size={40} className="text-white dark:text-gray-200" />
              </Avatar>
              <Typography variant="h5" component="div" className="font-bold mb-1 text-foreground">{pharmacist.name}</Typography>
              <Typography variant="body1" className="text-muted-foreground">License: {pharmacist.licenseNumber}</Typography>
              <Typography variant="body1" className="text-muted-foreground flex items-center justify-center mt-1">
                <MapPin size={16} className="mr-1 text-muted-foreground" />
                {pharmacist.location}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          {/* Contact Info Card */}
          <Card className="h-full shadow-lg rounded-lg border border-border bg-card">
            <CardContent>
              <Typography variant="h6" gutterBottom className="font-semibold mb-4 text-foreground">Contact Information</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    value={pharmacist.contact.email}
                    fullWidth
                    InputProps={{
                      readOnly: true,
                      startAdornment: (<InputAdornment position="start"><Mail size={20} className="text-muted-foreground" /></InputAdornment>),
                      className: 'text-foreground'
                    }}
                    InputLabelProps={{ style: { color: 'inherit' } }}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'var(--border)' },
                        '&:hover fieldset': { borderColor: 'var(--border)' },
                        '&.Mui-focused fieldset': { borderColor: 'var(--primary)' },
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Phone"
                    value={pharmacist.contact.phone}
                    fullWidth
                    InputProps={{
                      readOnly: true,
                      startAdornment: (<InputAdornment position="start"><Phone size={20} className="text-muted-foreground" /></InputAdornment>),
                      className: 'text-foreground'
                    }}
                    InputLabelProps={{ style: { color: 'inherit' } }}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'var(--border)' },
                        '&:hover fieldset': { borderColor: 'var(--border)' },
                        '&.Mui-focused fieldset': { borderColor: 'var(--primary)' },
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PharmacistPageContainer>
  );
} 
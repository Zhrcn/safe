'use client';

import React, { useState, useEffect } from 'react';
import usePatient from '@/hooks/usePatient';
import { 
  Typography, Box, Grid, Card, CardContent, TextField, InputAdornment, 
  Avatar, Button, CircularProgress, Snackbar, Alert, Chip
} from '@mui/material';
import { 
  User, Mail, Phone, Home, CalendarDays, FileText, HeartPulse, 
  DropletIcon, Edit, Save, X, AlertCircle, Check
} from 'lucide-react';
import { PatientPageContainer } from '@/components/patient/PatientComponents';

function PatientProfilePage() {
  const {
    profile,
    loading,
    error,
    updatePatientProfile,
    fetchPatientData
  } = usePatient();

  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    if (!loading && !error && profile) {
      setFormData({
        name: profile.user?.firstName + ' ' + profile.user?.lastName,
        email: profile.user?.email,
        phone: profile.patient?.phone || '',
        address: profile.patient?.address || ''
      });
    }
  }, [loading, error, profile]);

  const handleRefresh = () => {
    fetchPatientData();
  };

  const handleEditToggle = () => {
    if (editMode) {
      setFormData({
        name: profile.user?.firstName + ' ' + profile.user?.lastName,
        email: profile.user?.email,
        phone: profile.patient?.phone || '',
        address: profile.patient?.address || ''
      });
    }
    setEditMode(!editMode);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!isFormValid()) {
      setNotification({
        open: true,
        message: 'Please fill in all required fields.',
        severity: 'warning',
      });
      return;
    }
    try {
      setSaving(true);
      
      const nameParts = formData.name.trim().split(/\s+/);
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const payload = {
        firstName: firstName,
        lastName: lastName,
        email: formData.email,
        contactNumber: formData.phone, // Assumes backend Patient model uses contactNumber
        address: formData.address,
      };
      
      await updatePatientProfile(payload);
      
      setNotification({
        open: true,
        message: 'Profile updated successfully!',
        severity: 'success'
      });
      
      setEditMode(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      const errorMessage = err.data?.message || err.message || 'Failed to update profile. Please try again.';
      setNotification({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const isFormValid = () => {
    return (
      formData.name?.trim() !== '' &&
      formData.email?.trim() !== '' &&
      formData.phone?.trim() !== '' &&
      formData.address?.trim() !== ''
    );
  };

  if (loading) {
    return (
      <PatientPageContainer title="Profile" description="Loading your profile...">
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      </PatientPageContainer>
    );
  }

  if (error) {
    return (
      <PatientPageContainer title="Profile" description="Error loading profile">
        <Box mt={2}>
          <Alert severity="error" action={
            <Button color="inherit" size="small" onClick={handleRefresh}>
              Retry
            </Button>
          }>
            {error}
          </Alert>
        </Box>
      </PatientPageContainer>
    );
  }

  if (!profile) {
    return (
      <PatientPageContainer title="Profile" description="No profile data available">
        <Box mt={2}>
          <Alert severity="warning">
            No profile data available. 
            <Button color="inherit" size="small" onClick={fetchPatientData} sx={{ ml: 1 }}>
              Refresh
            </Button>
          </Alert>
        </Box>
      </PatientPageContainer>
    );
  }

  return (
    <PatientPageContainer
      title="Profile"
      description="View and manage your personal information"
    >
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card className="h-full border border-border bg-card shadow-sm">
            <CardContent className="flex flex-col items-center p-6">
              <Avatar 
                className="w-24 h-24 mb-4"
                src={profile.user?.profileImage}
              />
              <Typography variant="h6" className="font-semibold">
                {profile.user?.firstName} {profile.user?.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary" className="mb-2">
                Patient ID: {profile.user?.id}
              </Typography>
              <Chip 
                label="Patient" 
                color="primary" 
                size="small" 
                className="mb-4" 
              />
              
              {editMode ? (
                <Box className="flex gap-2 mt-4">
                  <Button 
                    variant="contained" 
                    startIcon={<Save size={16} />}
                    onClick={handleSave}
                    disabled={saving || !isFormValid()}
                  >
                    {saving ? <CircularProgress size={20} /> : 'Save'}
                  </Button>
                  <Button 
                    variant="outlined" 
                    startIcon={<X size={16} />}
                    onClick={handleEditToggle}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                </Box>
              ) : (
                <Button 
                  variant="outlined" 
                  startIcon={<Edit size={16} />}
                  onClick={handleEditToggle}
                >
                  Edit Profile
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card className="border border-border bg-card shadow-sm">
            <CardContent className="p-6">
              <Typography variant="h6" className="font-semibold mb-4">
                Personal Information
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    fullWidth
                    InputProps={{
                      readOnly: !editMode,
                      startAdornment: (
                        <InputAdornment position="start">
                          <User size={20} className="text-muted-foreground" />
                        </InputAdornment>
                      ) 
                    }}
                    className="mb-4"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    fullWidth
                    InputProps={{
                      readOnly: !editMode,
                      startAdornment: (
                        <InputAdornment position="start">
                          <Mail size={20} className="text-muted-foreground" />
                        </InputAdornment>
                      ) 
                    }}
                    className="mb-4"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    fullWidth
                    InputProps={{
                      readOnly: !editMode,
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone size={20} className="text-muted-foreground" />
                        </InputAdornment>
                      ) 
                    }}
                    className="mb-4"
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
                      readOnly: !editMode,
                      startAdornment: (
                        <InputAdornment position="start">
                          <Home size={20} className="text-muted-foreground" />
                        </InputAdornment>
                      ) 
                    }}
                    className="mb-4"
                  />
                </Grid>
              </Grid>

              <Typography variant="h6" className="font-semibold mt-6 mb-4">
                Medical Information
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Date of Birth"
                    value={profile.patient?.dateOfBirth || 'Not specified'}
                    fullWidth
                    InputProps={{ 
                      readOnly: true,
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarDays size={20} className="text-muted-foreground" />
                        </InputAdornment>
                      ) 
                    }}
                    className="mb-4"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Blood Type"
                    value={profile.patient?.bloodType || 'Not specified'}
                    fullWidth
                    InputProps={{ 
                      readOnly: true,
                      startAdornment: (
                        <InputAdornment position="start">
                          <DropletIcon size={20} className="text-muted-foreground" />
                        </InputAdornment>
                      ) 
                    }}
                    className="mb-4"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Medical Conditions"
                    value={profile.patient?.medicalConditions?.join(', ') || 'None'}
                    fullWidth
                    InputProps={{ 
                      readOnly: true,
                      startAdornment: (
                        <InputAdornment position="start">
                          <HeartPulse size={20} className="text-muted-foreground" />
                        </InputAdornment>
                      ) 
                    }}
                    className="mb-4"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Allergies"
                    value={profile.patient?.allergies?.join(', ') || 'None'}
                    fullWidth
                    InputProps={{ 
                      readOnly: true,
                      startAdornment: (
                        <InputAdornment position="start">
                          <AlertCircle size={20} className="text-muted-foreground" />
                        </InputAdornment>
                      ) 
                    }}
                    className="mb-4"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Card className="border border-border bg-card shadow-sm">
          <CardContent>
            <Typography variant="h6" className="font-semibold mb-4 flex items-center">
              <FileText size={20} className="mr-2" />
              Insurance Information
            </Typography>
            {profile.patient?.insurance ? (
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Insurance Provider"
                    value={profile.patient?.insurance.provider}
                    fullWidth
                    InputProps={{ readOnly: true }}
                    className="mb-4"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Policy Number"
                    value={profile.patient?.insurance.policyNumber}
                    fullWidth
                    InputProps={{ readOnly: true }}
                    className="mb-4"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Expiry Date"
                    value={new Date(profile.patient?.insurance.expiryDate).toLocaleDateString()}
                    fullWidth
                    InputProps={{ readOnly: true }}
                    className="mb-4"
                  />
                </Grid>
              </Grid>
            ) : (
              <Box className="text-center p-4">
                <AlertCircle size={32} className="mx-auto text-muted-foreground mb-2" />
                <Typography variant="body1" className="text-muted-foreground">
                  No insurance information available
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>
      
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </PatientPageContainer>
  );
}

export default PatientProfilePage;

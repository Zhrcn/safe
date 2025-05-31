'use client';

import React, { useState, useEffect } from 'react';
import { 
  Typography, Box, Grid, Card, CardContent, TextField, InputAdornment, 
  Avatar, Button, CircularProgress, Snackbar, Alert, Chip
} from '@mui/material';
import { 
  User, Mail, Phone, Home, CalendarDays, FileText, HeartPulse, 
  DropletIcon, Edit, Save, X, AlertCircle, Check
} from 'lucide-react';
import { PatientPageContainer } from '@/components/patient/PatientComponents';
import { getPatientProfile, updatePatientProfile } from '@/services/patientService';

export default function PatientProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    async function loadProfile() {
      try {
        setLoading(true);
        const data = await getPatientProfile();
        setProfile(data);
        setFormData({
          name: data.name,
          email: data.contact.email,
          phone: data.contact.phone,
          address: data.contact?.address || data.address || ''
        });
      } catch (error) {
        console.error('Error loading profile:', error);
        setError('Failed to load profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  const handleEditToggle = () => {
    if (editMode) {
      setFormData({
        name: profile.name,
        email: profile.contact.email,
        phone: profile.contact.phone,
        address: profile.contact?.address || profile.address || ''
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
    try {
      setSaving(true);
      
      const updatedProfile = {
        name: formData.name,
        contact: {
          ...profile.contact,
          email: formData.email,
          phone: formData.phone
        },
        address: formData.address
      };
      
      const result = await updatePatientProfile(updatedProfile);
      
      setProfile(prev => ({
        ...prev,
        name: formData.name,
        contact: {
          ...prev.contact,
          email: formData.email,
          phone: formData.phone
        },
        address: formData.address
      }));
      
      setNotification({
        open: true,
        message: 'Profile updated successfully',
        severity: 'success'
      });
      
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setNotification({
        open: true,
        message: 'Failed to update profile',
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

  return (
    <PatientPageContainer
      title="Profile"
      description="View and manage your personal information"
    >
      {loading ? (
        <Box className="flex justify-center items-center h-64">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box className="flex justify-center items-center h-64">
          <Typography color="error">{error}</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card className="h-full border border-border bg-card shadow-sm">
              <CardContent className="flex flex-col items-center text-center">
                <Avatar 
                  sx={{ width: 100, height: 100 }} 
                  className="bg-primary/10 text-primary mb-4"
                >
                  <User size={50} />
                </Avatar>
                <Typography variant="h5" className="font-bold mb-1">
                  {editMode ? formData.name : profile.name}
                </Typography>
                <Typography variant="body1" className="text-muted-foreground">
                  Age: {profile.age}
                </Typography>
                <Typography variant="body1" className="text-muted-foreground mb-4">
                  Gender: {profile.gender}
                </Typography>
                
                <Box className="flex gap-2 mt-2">
                  <Chip 
                    icon={<DropletIcon size={16} />} 
                    label={`Blood Type: ${profile.bloodType}`}
                    className="bg-red-50 text-red-600 border-red-100"
                  />
                </Box>
                
                <Box className="mt-6 w-full">
                  <Button
                    variant={editMode ? "outlined" : "contained"}
                    startIcon={editMode ? <X size={16} /> : <Edit size={16} />}
                    onClick={handleEditToggle}
                    fullWidth
                    className={
                      editMode 
                        ? "border-red-500 text-red-500 hover:bg-red-50" 
                        : "bg-primary text-primary-foreground"
                    }
                  >
                    {editMode ? "Cancel" : "Edit Profile"}
                  </Button>
                  
                  {editMode && (
                    <Button
                      variant="contained"
                      startIcon={saving ? <CircularProgress size={16} /> : <Save size={16} />}
                      onClick={handleSave}
                      disabled={saving || !isFormValid()}
                      className="mt-2 bg-green-600 text-white"
                      fullWidth
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card className="h-full border border-border bg-card shadow-sm">
              <CardContent>
                <Typography variant="h6" className="font-semibold mb-4 flex items-center">
                  <User size={20} className="mr-2" />
                  Personal Information
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Name"
                      name="name"
                      value={editMode ? formData.name : profile.name}
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
                      label="Date of Birth"
                      value={new Date(profile.dob || profile.dateOfBirth).toLocaleDateString()}
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
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Email"
                      name="email"
                      value={editMode ? formData.email : profile.contact.email}
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
                      value={editMode ? formData.phone : profile.contact.phone}
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
                  <Grid item xs={12}>
                    <TextField
                      label="Address"
                      name="address"
                      value={editMode ? formData.address : profile.contact?.address || profile.address || ''}
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
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card className="h-full border border-border bg-card shadow-sm">
              <CardContent>
                <Typography variant="h6" className="font-semibold mb-4 flex items-center">
                  <HeartPulse size={20} className="mr-2" />
                  Medical Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box className="p-3 rounded-md bg-muted/50 mb-3">
                      <Typography variant="subtitle2" className="font-semibold mb-1">
                        Chronic Conditions
                      </Typography>
                      <Box className="flex flex-wrap gap-1">
                        {profile.chronicConditions && profile.chronicConditions.length > 0 ? (
                          profile.chronicConditions.map((condition, idx) => (
                            <Chip 
                              key={idx} 
                              label={condition} 
                              size="small" 
                              className="bg-blue-50 text-blue-600 border-blue-100"
                            />
                          ))
                        ) : (
                          <Typography variant="body2" className="text-muted-foreground">
                            No chronic conditions recorded
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box className="p-3 rounded-md bg-muted/50">
                      <Typography variant="subtitle2" className="font-semibold mb-1">
                        Allergies
                      </Typography>
                      <Box className="flex flex-wrap gap-1">
                        {profile.allergies && profile.allergies.length > 0 ? (
                          profile.allergies.map((allergy, idx) => (
                            <Chip 
                              key={idx} 
                              label={allergy} 
                              size="small" 
                              className="bg-red-50 text-red-600 border-red-100"
                            />
                          ))
                        ) : (
                          <Typography variant="body2" className="text-muted-foreground">
                            No allergies recorded
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card className="h-full border border-border bg-card shadow-sm">
              <CardContent>
                <Typography variant="h6" className="font-semibold mb-4 flex items-center">
                  <AlertCircle size={20} className="mr-2" />
                  Emergency Contact
                </Typography>
                {profile.emergencyContact ? (
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Name"
                        value={profile.emergencyContact.name}
                        fullWidth
                        InputProps={{ 
                          readOnly: true,
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
                        label="Relationship"
                        value={profile.emergencyContact.relationship}
                        fullWidth
                        InputProps={{ 
                          readOnly: true,
                          startAdornment: (
                            <InputAdornment position="start">
                              <User size={20} className="text-muted-foreground" />
                            </InputAdornment>
                          ) 
                        }}
                        className="mb-4"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Phone"
                        value={profile.emergencyContact.phone}
                        fullWidth
                        InputProps={{ 
                          readOnly: true,
                          startAdornment: (
                            <InputAdornment position="start">
                              <Phone size={20} className="text-muted-foreground" />
                            </InputAdornment>
                          ) 
                        }}
                        className="mb-4"
                      />
                    </Grid>
                  </Grid>
                ) : (
                  <Box className="text-center p-4">
                    <AlertCircle size={32} className="mx-auto text-muted-foreground mb-2" />
                    <Typography variant="body1" className="text-muted-foreground">
                      No emergency contact information available
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card className="border border-border bg-card shadow-sm">
              <CardContent>
                <Typography variant="h6" className="font-semibold mb-4 flex items-center">
                  <FileText size={20} className="mr-2" />
                  Insurance Information
                </Typography>
                {profile.insurance ? (
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        label="Insurance Provider"
                        value={profile.insurance.provider}
                        fullWidth
                        InputProps={{ readOnly: true }}
                        className="mb-4"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        label="Policy Number"
                        value={profile.insurance.policyNumber}
                        fullWidth
                        InputProps={{ readOnly: true }}
                        className="mb-4"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        label="Expiry Date"
                        value={new Date(profile.insurance.expiryDate).toLocaleDateString()}
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
        </Grid>
      )}
      
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

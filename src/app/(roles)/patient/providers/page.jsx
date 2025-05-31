'use client';

import React, { useState, useEffect } from 'react';
import { 
  Typography, Box, Grid, TextField, InputAdornment, Tabs, Tab, Card, CardContent,
  CardActions, Button, Avatar, Chip, Rating, CircularProgress, IconButton, Dialog,
  DialogTitle, DialogContent, DialogContentText, DialogActions, FormControl, InputLabel,
  Select, MenuItem, TextareaAutosize
} from '@mui/material';
import { 
  Search, MapPin, Phone, Mail, Award, Calendar, MessageCircle, 
  Clock, AlertCircle, Check, X
} from 'lucide-react';
import { PatientPageContainer } from '@/components/patient/PatientComponents';
import { 
  getMedicalProviders, scheduleAppointment, updateDoctorAccess, 
  setPrimaryDoctor, requestConsultation, checkMedicineAvailability 
} from '@/services/patientService';

export default function PatientProvidersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [providers, setProviders] = useState({ doctors: [], pharmacists: [] });
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [error, setError] = useState(null);
  
  const [appointmentDialog, setAppointmentDialog] = useState(false);
  const [consultationDialog, setConsultationDialog] = useState(false);
  const [medicineDialog, setMedicineDialog] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [appointmentReason, setAppointmentReason] = useState('');
  const [consultationReason, setConsultationReason] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [medicationName, setMedicationName] = useState('');
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availabilityResult, setAvailabilityResult] = useState(null);
  
  const [appointmentSuccess, setAppointmentSuccess] = useState(false);
  const [consultationSuccess, setConsultationSuccess] = useState(false);

  useEffect(() => {
    async function loadProviders() {
      try {
        setLoading(true);
        const data = await getMedicalProviders();
        setProviders(data);
      } catch (error) {
        console.error('Error loading providers:', error);
        setError('Failed to load providers. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    loadProviders();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filteredProviders = tabValue === 0 
    ? providers.doctors.filter(provider =>
        provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.hospital.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : providers.pharmacists.filter(provider =>
    provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.pharmacy.toLowerCase().includes(searchTerm.toLowerCase())
      );

  const handleAppointmentOpen = (provider) => {
    setSelectedProvider(provider);
    setAppointmentDialog(true);
  };

  const handleConsultationOpen = (provider) => {
    setSelectedProvider(provider);
    setConsultationDialog(true);
  };

  const handleMedicineDialogOpen = (provider) => {
    setSelectedProvider(provider);
    setMedicineDialog(true);
    setAvailabilityResult(null);
  };

  const handleDialogClose = () => {
    setAppointmentDialog(false);
    setConsultationDialog(false);
    setMedicineDialog(false);
    setAppointmentDate('');
    setAppointmentTime('');
    setAppointmentReason('');
    setConsultationReason('');
    setPreferredTime('');
    setMedicationName('');
    setAvailabilityResult(null);
    setAppointmentSuccess(false);
    setConsultationSuccess(false);
  };

  const handleCheckAvailability = async () => {
    if (!medicationName.trim() || !selectedProvider) return;
    
    try {
      setCheckingAvailability(true);
      const result = await checkMedicineAvailability(medicationName, selectedProvider.id);
      setAvailabilityResult(result);
    } catch (error) {
      console.error('Error checking medicine availability:', error);
    } finally {
      setCheckingAvailability(false);
    }
  };

  const handleScheduleAppointment = async () => {
    if (!appointmentDate || !appointmentTime || !appointmentReason || !selectedProvider) return;
    
    try {
      const result = await scheduleAppointment({
        doctorId: selectedProvider.id,
        doctorName: selectedProvider.name,
        doctorSpecialty: selectedProvider.specialty,
        date: appointmentDate,
        time: appointmentTime,
        notes: appointmentReason
      });
      
      setAppointmentSuccess(true);
      
      setTimeout(() => {
        handleDialogClose();
      }, 2000);
    } catch (error) {
      console.error('Error scheduling appointment:', error);
    }
  };

  const handleRequestConsultation = async () => {
    if (!consultationReason || !preferredTime || !selectedProvider) return;
    
    try {
      const result = await requestConsultation(
        selectedProvider.id,
        consultationReason,
        preferredTime
      );
      
      setConsultationSuccess(true);
      
      setTimeout(() => {
        handleDialogClose();
      }, 2000);
    } catch (error) {
      console.error('Error requesting consultation:', error);
    }
  };

  const toggleDoctorAccess = async (doctorId, currentAccess) => {
    try {
      await updateDoctorAccess(doctorId, !currentAccess);
            setProviders(prev => ({
        ...prev,
        doctors: prev.doctors.map(doctor => 
          doctor.id === doctorId 
            ? { ...doctor, hasAccess: !currentAccess } 
            : doctor
        )
      }));
    } catch (error) {
      console.error('Error updating doctor access:', error);
    }
  };

  const makePrimaryDoctor = async (doctorId) => {
    try {
      const updatedDoctors = await setPrimaryDoctor(doctorId);
      
    } catch (error) {
      console.error('Error setting primary doctor:', error);
    }
  };

  return (
    <PatientPageContainer
      title="Healthcare Providers"
      description="Connect with your doctors and pharmacists"
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
        <>
        <Box className="mb-6">
          <TextField
            fullWidth
            variant="outlined"
            size="medium"
              placeholder={tabValue === 0 ? "Search doctors by name, specialty, or hospital..." : "Search pharmacists by name or pharmacy..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                    <Search size={20} className="text-muted-foreground" />
                </InputAdornment>
              ),
                className: 'text-foreground bg-background',
             }}
          />
        </Box>

          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            className="mb-6 border-b border-border"
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab 
              label={
                       <Box className="flex items-center">
                  <Award className="mr-2 h-4 w-4" />
                  <span>Doctors</span>
                  <Chip 
                    size="small" 
                    label={providers.doctors.length} 
                    className="ml-2 bg-primary/10 text-primary"
                  />
                       </Box>
                    }
            />
            <Tab 
              label={
                <Box className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4" />
                  <span>Pharmacies</span>
                  <Chip 
                    size="small" 
                    label={providers.pharmacists.length} 
                    className="ml-2 bg-primary/10 text-primary"
                  />
                      </Box>
                    }
            />
          </Tabs>

          {filteredProviders.length === 0 ? (
            <Box className="text-center p-8 bg-muted rounded-lg">
              <AlertCircle size={48} className="mx-auto text-muted-foreground mb-4" />
              <Typography variant="h6" className="font-semibold">
                No providers found
              </Typography>
              <Typography variant="body2" className="text-muted-foreground">
                Try adjusting your search or browse all providers
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {filteredProviders.map((provider) => (
                <Grid item xs={12} md={6} lg={4} key={provider.id}>
                  {tabValue === 0 ? (
                    <Card className="h-full flex flex-col border border-border bg-card hover:shadow-md transition-shadow">
                      <CardContent className="flex-1">
                        <Box className="flex items-start justify-between mb-4">
                          <Box className="flex items-center">
                            <Avatar 
                              src={provider.photo} 
                              alt={provider.name}
                              className="w-12 h-12 mr-3 bg-primary/10"
                            >
                              {provider.name.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="h6" className="font-semibold">
                                {provider.name}
                              </Typography>
                              <Typography variant="body2" className="text-muted-foreground">
                                {provider.specialty}
                              </Typography>
                            </Box>
                          </Box>
                          <IconButton 
                            onClick={() => toggleDoctorAccess(provider.id, provider.hasAccess)}
                            color={provider.hasAccess ? "primary" : "default"}
                            className="h-8 w-8"
                            title={provider.hasAccess ? "Revoke access to medical files" : "Grant access to medical files"}
                          >
                            {provider.hasAccess ? <Check size={20} /> : <X size={20} />}
                          </IconButton>
                        </Box>
                        
                        <Box className="mb-4">
                          <Box className="flex items-center mb-2">
                            <MapPin size={16} className="mr-2 text-muted-foreground" />
                            <Typography variant="body2">{provider.hospital}</Typography>
                          </Box>
                          <Box className="flex items-center mb-2">
                            <Award size={16} className="mr-2 text-muted-foreground" />
                            <Typography variant="body2">{provider.yearsExperience} years experience</Typography>
                          </Box>
                          <Box className="flex items-center">
                            <Rating 
                              value={provider.rating} 
                              readOnly 
                              precision={0.1} 
                              size="small"
                            />
                            <Typography variant="body2" className="ml-1">
                              ({provider.rating})
                            </Typography>
                          </Box>
                        </Box>
                        
                        {provider.isPrimary && (
                          <Chip 
                            label="Primary Doctor" 
                            size="small" 
                            color="primary" 
                            className="mb-2"
                          />
                        )}
                      </CardContent>
                      <CardActions className="bg-muted/30 p-3 flex justify-between">
                        <Box>
                          <Button 
                            size="small" 
                            variant="outlined" 
                            startIcon={<MessageCircle size={16} />}
                            className="mr-2"
                            onClick={() => window.location.href = '/patient/messaging'}
                          >
                            Chat
                          </Button>
                          <Button 
                            size="small" 
                            variant="outlined" 
                            startIcon={<Calendar size={16} />}
                            onClick={() => handleAppointmentOpen(provider)}
                          >
                            Schedule
                          </Button>
                        </Box>
                        <Box>
                          {!provider.isPrimary && (
                            <Button 
                              size="small" 
                              variant="text" 
                              onClick={() => makePrimaryDoctor(provider.id)}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              Set as Primary
                            </Button>
                          )}
                          <Button 
                            size="small" 
                            variant="text"
                            onClick={() => handleConsultationOpen(provider)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            Consult
                          </Button>
                        </Box>
                      </CardActions>
                    </Card>
                  ) : (
                    <Card className="h-full flex flex-col border border-border bg-card hover:shadow-md transition-shadow">
                      <CardContent className="flex-1">
                        <Box className="flex items-center mb-4">
                          <Avatar 
                            src={provider.photo} 
                            alt={provider.name}
                            className="w-12 h-12 mr-3 bg-green-100 text-green-600"
                          >
                            {provider.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="h6" className="font-semibold">
                              {provider.name}
                            </Typography>
                            <Typography variant="body2" className="text-muted-foreground">
                              {provider.pharmacy}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box className="mb-4">
                          <Box className="flex items-center mb-2">
                            <Phone size={16} className="mr-2 text-muted-foreground" />
                            <Typography variant="body2">+963 11 123 4567</Typography>
                          </Box>
                          <Box className="flex items-center mb-2">
                            <Mail size={16} className="mr-2 text-muted-foreground" />
                            <Typography variant="body2">contact@{provider.pharmacy.toLowerCase().replace(/\s+/g, '')}.sy</Typography>
                          </Box>
                          <Box className="flex items-center">
                            <Rating 
                              value={provider.rating} 
                              readOnly 
                              precision={0.1} 
                              size="small"
                            />
                            <Typography variant="body2" className="ml-1">
                              ({provider.rating})
                            </Typography>
                          </Box>
                          <Box className="flex items-center mt-2">
                            <Award size={16} className="mr-2 text-muted-foreground" />
                            <Typography variant="body2">{provider.yearsExperience} years experience</Typography>
                          </Box>
                        </Box>
                      </CardContent>
                      <CardActions className="bg-muted/30 p-3">
                        <Button 
                          size="small" 
                          variant="outlined" 
                          startIcon={<MessageCircle size={16} />}
                          className="mr-2"
                          onClick={() => window.location.href = '/patient/messaging'}
                        >
                          Chat
                        </Button>
                        <Button 
                          size="small" 
                          variant="outlined" 
                          startIcon={<Search size={16} />}
                          onClick={() => handleMedicineDialogOpen(provider)}
                        >
                          Check Availability
                        </Button>
                      </CardActions>
                    </Card>
                  )}
                </Grid>
              ))}
            </Grid>
          )}
          
          <Dialog 
            open={appointmentDialog} 
            onClose={handleDialogClose}
            fullWidth
            maxWidth="sm"
          >
            <DialogTitle className="bg-primary text-primary-foreground">
              Schedule Appointment with {selectedProvider?.name}
            </DialogTitle>
            <DialogContent className="mt-4">
              {appointmentSuccess ? (
                <Box className="text-center py-6">
                  <Check size={48} className="mx-auto text-green-500 mb-2" />
                  <Typography variant="h6" className="font-semibold">
                    Appointment Scheduled!
                  </Typography>
                  <Typography variant="body1">
                    Your appointment has been successfully scheduled.
                  </Typography>
                </Box>
              ) : (
                <>
                  <DialogContentText className="mb-4">
                    Please select a date and time for your appointment with {selectedProvider?.name}.
                  </DialogContentText>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Date"
                        type="date"
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        className="mb-4"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Time"
                        type="time"
                        value={appointmentTime}
                        onChange={(e) => setAppointmentTime(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        className="mb-4"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Reason for Visit"
                        multiline
                        rows={3}
                        value={appointmentReason}
                        onChange={(e) => setAppointmentReason(e.target.value)}
                        className="mb-2"
                      />
                    </Grid>
                  </Grid>
                </>
              )}
            </DialogContent>
            <DialogActions className="bg-muted/30 p-3">
              {!appointmentSuccess && (
                <>
                  <Button 
                    onClick={handleDialogClose} 
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleScheduleAppointment} 
                    variant="contained"
                    disabled={!appointmentDate || !appointmentTime || !appointmentReason}
                    className="bg-primary text-primary-foreground"
                  >
                    Schedule
                  </Button>
                </>
              )}
            </DialogActions>
          </Dialog>
          
          <Dialog 
            open={consultationDialog} 
            onClose={handleDialogClose}
            fullWidth
            maxWidth="sm"
          >
            <DialogTitle className="bg-primary text-primary-foreground">
              Request Medical Consultation with {selectedProvider?.name}
            </DialogTitle>
            <DialogContent className="mt-4">
              {consultationSuccess ? (
                <Box className="text-center py-6">
                  <Check size={48} className="mx-auto text-green-500 mb-2" />
                  <Typography variant="h6" className="font-semibold">
                    Consultation Requested!
                  </Typography>
                  <Typography variant="body1">
                    Your consultation request has been sent successfully.
                  </Typography>
                </Box>
              ) : (
                <>
                  <DialogContentText className="mb-4">
                    Please provide details for your medical consultation request.
                  </DialogContentText>
                  <TextField
                    fullWidth
                    label="Reason for Consultation"
                    multiline
                    rows={4}
                    value={consultationReason}
                    onChange={(e) => setConsultationReason(e.target.value)}
                    className="mb-4"
                  />
                  <FormControl fullWidth className="mb-2">
                    <InputLabel>Preferred Time</InputLabel>
                    <Select
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      label="Preferred Time"
                    >
                      <MenuItem value="Morning (8AM-12PM)">Morning (8AM-12PM)</MenuItem>
                      <MenuItem value="Afternoon (12PM-4PM)">Afternoon (12PM-4PM)</MenuItem>
                      <MenuItem value="Evening (4PM-8PM)">Evening (4PM-8PM)</MenuItem>
                    </Select>
                  </FormControl>
                </>
              )}
            </DialogContent>
            <DialogActions className="bg-muted/30 p-3">
              {!consultationSuccess && (
                <>
                  <Button 
                    onClick={handleDialogClose} 
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleRequestConsultation} 
                    variant="contained"
                    disabled={!consultationReason || !preferredTime}
                    className="bg-primary text-primary-foreground"
                  >
                    Send Request
                  </Button>
                </>
              )}
            </DialogActions>
          </Dialog>
          
          {/* Medicine Availability Dialog */}
          <Dialog 
            open={medicineDialog} 
            onClose={handleDialogClose}
            fullWidth
            maxWidth="sm"
          >
            <DialogTitle className="bg-primary text-primary-foreground">
              Check Medicine Availability at {selectedProvider?.pharmacy}
            </DialogTitle>
            <DialogContent className="mt-4">
              <DialogContentText className="mb-4">
                Enter the name of the medication you want to check availability for.
              </DialogContentText>
              <Box className="flex mb-4">
                <TextField
                  fullWidth
                  label="Medication Name"
                  value={medicationName}
                  onChange={(e) => setMedicationName(e.target.value)}
                  className="mr-2"
                />
                <Button 
                  variant="contained"
                  onClick={handleCheckAvailability}
                  disabled={!medicationName.trim() || checkingAvailability}
                  className="bg-primary text-primary-foreground whitespace-nowrap"
                >
                  {checkingAvailability ? (
                    <CircularProgress size={24} className="text-primary-foreground" />
                  ) : (
                    'Check'
                  )}
                </Button>
        </Box>

              {availabilityResult && (
                <Box className={`p-4 rounded-md ${availabilityResult.isAvailable ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <Box className="flex items-center mb-2">
                    {availabilityResult.isAvailable ? (
                      <Check className="mr-2 text-green-500" />
                    ) : (
                      <X className="mr-2 text-red-500" />
                    )}
                    <Typography variant="h6" className={availabilityResult.isAvailable ? 'text-green-700' : 'text-red-700'}>
                      {availabilityResult.isAvailable ? 'Available' : 'Not Available'}
                    </Typography>
                  </Box>
                  <Typography variant="body1" className={availabilityResult.isAvailable ? 'text-green-600' : 'text-red-600'}>
                    {availabilityResult.medication} is {availabilityResult.isAvailable ? 'in stock' : 'out of stock'} at {availabilityResult.pharmacy}.
                  </Typography>
                  {availabilityResult.isAvailable && (
                    <Typography variant="body2" className="mt-1 flex items-center text-green-600">
                      <Clock size={16} className="mr-1" /> 
                      Current stock: {availabilityResult.quantity} units
                    </Typography>
                  )}
    </Box>
              )}
            </DialogContent>
            <DialogActions className="bg-muted/30 p-3">
              <Button 
                onClick={handleDialogClose} 
                className="text-muted-foreground hover:text-foreground"
              >
                Close
              </Button>
              {availabilityResult && availabilityResult.isAvailable && (
                <Button 
                  variant="contained"
                  className="bg-primary text-primary-foreground"
                  onClick={() => window.location.href = '/patient/messaging'}
                >
                  Message Pharmacy
                </Button>
              )}
            </DialogActions>
          </Dialog>
        </>
      )}
    </PatientPageContainer>
  );
} 
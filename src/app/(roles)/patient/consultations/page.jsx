'use client';

import React, { useState, useEffect } from 'react';
import { 
  Typography, Box, Grid, Button, Tabs, Tab, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField, FormControl, InputLabel, 
  Select, MenuItem, Divider, IconButton, Tooltip, Alert, CircularProgress,
  Paper, Card, CardContent, Chip
} from '@mui/material';
import { 
  MessageCircle, FileText, AlertCircle, Clock, Calendar, 
  Plus, Upload, Paperclip, Send, X, Check, Download
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { PatientPageContainer, PatientCard } from '@/components/patient/PatientComponents';
import { getConsultations, requestConsultation } from '@/services/patientService';

export default function PatientConsultationsPage() {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // New consultation dialog
  const [newConsultationDialog, setNewConsultationDialog] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [consultationReason, setConsultationReason] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [attachments, setAttachments] = useState([]);
  
  // Filtered consultations
  const [activeConsultations, setActiveConsultations] = useState([]);
  const [completedConsultations, setCompletedConsultations] = useState([]);

  useEffect(() => {
    loadConsultations();
  }, []);

  useEffect(() => {
    if (consultations.length > 0) {
      const active = consultations.filter(consultation => 
        consultation.status === 'Pending' || consultation.status === 'In Progress'
      ).sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt));
      
      const completed = consultations.filter(consultation => 
        consultation.status === 'Completed' || consultation.status === 'Cancelled'
      ).sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt));
      
      setActiveConsultations(active);
      setCompletedConsultations(completed);
    }
  }, [consultations]);

  const loadConsultations = async () => {
    try {
      setLoading(true);
      setError(null);
      // This function needs to be implemented in patientService.js
      const data = await getConsultations();
      setConsultations(data || []);
    } catch (error) {
      console.error('Error loading consultations:', error);
      setError('Failed to load consultations. Please try again later.');
      // Fallback to empty array for robustness
      setConsultations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleNewConsultationOpen = (doctor = null) => {
    setSelectedDoctor(doctor);
    setNewConsultationDialog(true);
  };

  const handleDialogClose = () => {
    setNewConsultationDialog(false);
    setSelectedDoctor(null);
    setConsultationReason('');
    setPreferredTime('');
    setAttachments([]);
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const newAttachments = files.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      file: file
    }));
    
    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const handleRemoveAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleRequestConsultation = async () => {
    try {
      if (!selectedDoctor || !consultationReason || !preferredTime) {
        setError('Please fill in all required fields');
        return;
      }

      // This function is already implemented in patientService.js
      const newConsultation = await requestConsultation(
        selectedDoctor.id, 
        consultationReason, 
        preferredTime
      );
      
      // In a real app, we would upload the attachments here
      // For now, we'll just simulate it
      if (attachments.length > 0) {
        console.log('Uploading attachments:', attachments);
        // Simulate delay for attachment upload
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      setConsultations(prev => [...prev, newConsultation]);
      setSuccess('Consultation request sent successfully!');
      handleDialogClose();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error) {
      console.error('Error requesting consultation:', error);
      setError('Failed to request consultation. Please try again later.');
    }
  };

  const renderConsultationCard = (consultation) => {
    const requestDate = new Date(consultation.requestedAt);
    const formattedDate = format(requestDate, 'MMMM d, yyyy');
    
    return (
      <PatientCard 
        key={consultation.id}
        className="mb-4"
        title={`Consultation with ${consultation.doctorName}`}
        subtitle={formattedDate}
        actions={
          <Box className={`px-2 py-1 rounded-full text-xs font-medium ${
            consultation.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
            consultation.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
            consultation.status === 'Completed' ? 'bg-green-100 text-green-800' :
            'bg-red-100 text-red-800'
          }`}>
            {consultation.status}
          </Box>
        }
      >
        <Grid container spacing={2} className="mt-2">
          <Grid item xs={12}>
            <Box className="flex items-start mb-2">
              <MessageCircle size={16} className="mr-2 mt-1 text-muted-foreground" />
              <Typography variant="body2">{consultation.reason}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box className="flex items-center mb-2">
              <Clock size={16} className="mr-2 text-muted-foreground" />
              <Typography variant="body2">Preferred time: {consultation.preferredTime}</Typography>
            </Box>
          </Grid>
          {consultation.response && (
            <Grid item xs={12}>
              <Divider className="my-2" />
              <Typography variant="subtitle2" className="font-medium mb-1">Doctor's Response:</Typography>
              <Paper className="p-3 bg-muted/20">
                <Typography variant="body2">{consultation.response}</Typography>
              </Paper>
            </Grid>
          )}
          {consultation.attachments && consultation.attachments.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" className="font-medium mb-1">Attachments:</Typography>
              <Box className="flex flex-wrap gap-2">
                {consultation.attachments.map((attachment, index) => (
                  <Chip
                    key={index}
                    icon={<Paperclip size={16} />}
                    label={attachment.name}
                    variant="outlined"
                    className="bg-muted/10"
                    onClick={() => {/* Download logic would go here */}}
                  />
                ))}
              </Box>
            </Grid>
          )}
          {consultation.status === 'Completed' && consultation.documents && consultation.documents.length > 0 && (
            <Grid item xs={12}>
              <Divider className="my-2" />
              <Typography variant="subtitle2" className="font-medium mb-1">Documents:</Typography>
              <Box className="flex flex-wrap gap-2">
                {consultation.documents.map((doc, index) => (
                  <Button
                    key={index}
                    variant="outlined"
                    size="small"
                    startIcon={<Download size={16} />}
                    className="text-primary"
                    onClick={() => {/* Download logic would go here */}}
                  >
                    {doc.name}
                  </Button>
                ))}
              </Box>
            </Grid>
          )}
        </Grid>
      </PatientCard>
    );
  };

  return (
    <PatientPageContainer
      title="Consultations"
      description="Request and manage medical consultations with your doctors"
    >
      {error && (
        <Alert severity="error" className="mb-4" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" className="mb-4" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}
      
      <Box className="flex justify-between items-center mb-6">
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          className="bg-background"
        >
          <Tab label="Active" />
          <Tab label="Completed" />
        </Tabs>
        
        <Button
          variant="contained"
          startIcon={<Plus size={16} />}
          className="bg-primary text-primary-foreground"
          onClick={() => handleNewConsultationOpen()}
        >
          New Consultation
        </Button>
      </Box>
      
      {loading ? (
        <Box className="flex justify-center items-center py-12">
          <CircularProgress size={24} className="mr-2" />
          <Typography variant="body1">Loading consultations...</Typography>
        </Box>
      ) : (
        <Box>
          {tabValue === 0 && (
            <>
              {activeConsultations.length === 0 ? (
                <Box className="text-center py-8">
                  <AlertCircle size={48} className="mx-auto mb-4 text-muted-foreground" />
                  <Typography variant="h6" className="mb-2">No Active Consultations</Typography>
                  <Typography variant="body2" className="text-muted-foreground mb-4">
                    You don't have any active consultation requests.
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => handleNewConsultationOpen()}
                    className="mx-auto"
                  >
                    Request a Consultation
                  </Button>
                </Box>
              ) : (
                activeConsultations.map(consultation => renderConsultationCard(consultation))
              )}
            </>
          )}
          
          {tabValue === 1 && (
            <>
              {completedConsultations.length === 0 ? (
                <Box className="text-center py-8">
                  <AlertCircle size={48} className="mx-auto mb-4 text-muted-foreground" />
                  <Typography variant="h6" className="mb-2">No Completed Consultations</Typography>
                  <Typography variant="body2" className="text-muted-foreground">
                    You don't have any completed consultation records.
                  </Typography>
                </Box>
              ) : (
                completedConsultations.map(consultation => renderConsultationCard(consultation))
              )}
            </>
          )}
        </Box>
      )}
      
      {/* New Consultation Dialog */}
      <Dialog 
        open={newConsultationDialog} 
        onClose={handleDialogClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle className="bg-primary text-primary-foreground">
          Request Medical Consultation
        </DialogTitle>
        <DialogContent className="mt-4">
          {!selectedDoctor ? (
            <Typography variant="body1" className="mb-4">
              Please go to the Providers page to select a doctor for your consultation.
            </Typography>
          ) : (
            <>
              <Box className="mb-4">
                <Typography variant="subtitle1" className="font-medium">
                  Doctor Information
                </Typography>
                <Typography variant="body1">
                  {selectedDoctor.name} - {selectedDoctor.specialty}
                </Typography>
                <Typography variant="body2" className="text-muted-foreground">
                  {selectedDoctor.hospital}
                </Typography>
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Describe Your Medical Issue"
                    multiline
                    rows={4}
                    value={consultationReason}
                    onChange={(e) => setConsultationReason(e.target.value)}
                    placeholder="Please describe your symptoms, concerns, or questions in detail"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="preferred-time-label">Preferred Response Time</InputLabel>
                    <Select
                      labelId="preferred-time-label"
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      label="Preferred Response Time"
                    >
                      <MenuItem value="As soon as possible">As soon as possible</MenuItem>
                      <MenuItem value="Within 24 hours">Within 24 hours</MenuItem>
                      <MenuItem value="Within 48 hours">Within 48 hours</MenuItem>
                      <MenuItem value="This week">This week</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" className="mb-2">
                    Attachments (Optional)
                  </Typography>
                  <Box className="border border-dashed border-border rounded-md p-4 text-center mb-3">
                    <input
                      type="file"
                      multiple
                      id="file-upload"
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                    />
                    <label htmlFor="file-upload">
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={<Upload size={16} />}
                        className="mb-2"
                      >
                        Upload Files
                      </Button>
                    </label>
                    <Typography variant="body2" className="text-muted-foreground">
                      Upload medical documents, images, or test results
                    </Typography>
                  </Box>
                  
                  {attachments.length > 0 && (
                    <Box className="mt-2">
                      <Typography variant="subtitle2" className="mb-1">
                        Uploaded Files:
                      </Typography>
                      <Box className="max-h-32 overflow-y-auto">
                        {attachments.map((file, index) => (
                          <Box key={index} className="flex items-center justify-between p-2 bg-muted/10 rounded mb-1">
                            <Box className="flex items-center">
                              <Paperclip size={16} className="mr-2 text-muted-foreground" />
                              <Typography variant="body2" noWrap className="max-w-[200px]">
                                {file.name}
                              </Typography>
                            </Box>
                            <IconButton 
                              size="small" 
                              onClick={() => handleRemoveAttachment(index)}
                              className="text-red-500"
                            >
                              <X size={16} />
                            </IconButton>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </>
          )}
        </DialogContent>
        <DialogActions className="bg-muted/30 p-3">
          <Button 
            onClick={handleDialogClose} 
            className="text-muted-foreground hover:text-foreground"
          >
            Cancel
          </Button>
          {selectedDoctor ? (
            <Button 
              variant="contained"
              onClick={handleRequestConsultation}
              disabled={!consultationReason || !preferredTime}
              className="bg-primary text-primary-foreground"
              startIcon={<Send size={16} />}
            >
              Send Request
            </Button>
          ) : (
            <Button 
              variant="contained"
              onClick={() => {
                handleDialogClose();
                window.location.href = '/patient/providers';
              }}
              className="bg-primary text-primary-foreground"
            >
              Go to Providers
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </PatientPageContainer>
  );
}

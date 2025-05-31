'use client';

import React, { useState, useEffect } from 'react';
import { 
  Typography, Box, Grid, Card, CardContent, List, ListItem, ListItemText, 
  Divider, CircularProgress, Switch, Chip, Button, Tabs, Tab, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, FormControl,
  InputLabel, Select, MenuItem, FormControlLabel, TextField
} from '@mui/material';
import { 
  Pill, Clock, CalendarClock, CheckCircle2, AlertCircle, X, Calendar,
  AlarmClock, Timer, Bell, BellOff, Plus, Info, Edit3, Clipboard
} from 'lucide-react';
import { PatientPageContainer } from '@/components/patient/PatientComponents';
import { getPrescriptions, getMedicineReminders, updateMedicineReminder } from '@/services/patientService';

export default function PatientMedicationsPage() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  
  const [reminderDialog, setReminderDialog] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState(null);
  const [reminderTime, setReminderTime] = useState('');
  const [reminderDays, setReminderDays] = useState([]);
  
  const [infoDialog, setInfoDialog] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  useEffect(() => {
    async function loadMedicationData() {
      try {
        setLoading(true);
        const [prescriptionsData, remindersData] = await Promise.all([
          getPrescriptions(),
          getMedicineReminders()
        ]);
        setPrescriptions(prescriptionsData);
        setReminders(remindersData);
      } catch (error) {
        console.error('Error loading medication data:', error);
        setError('Failed to load medication data. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    loadMedicationData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const toggleReminderEnabled = async (reminder) => {
    try {
      const updatedReminder = await updateMedicineReminder(reminder.id, {
        ...reminder,
        enabled: !reminder.enabled
      });
      
      setReminders(prevReminders => 
        prevReminders.map(r => 
          r.id === reminder.id ? {...r, enabled: !r.enabled} : r
        )
      );
    } catch (error) {
      console.error('Error updating reminder:', error);
    }
  };

  const handleEditReminder = (reminder) => {
    setSelectedReminder(reminder);
    setReminderTime(reminder.time);
    setReminderDays(reminder.days);
    setReminderDialog(true);
  };

  const handleSaveReminder = async () => {
    if (!selectedReminder || !reminderTime) return;
    
    try {
      const updatedReminder = await updateMedicineReminder(selectedReminder.id, {
        ...selectedReminder,
        time: reminderTime,
        days: reminderDays
      });
      
      setReminders(prevReminders => 
        prevReminders.map(r => 
          r.id === selectedReminder.id 
            ? {...r, time: reminderTime, days: reminderDays} 
            : r
        )
      );
      
      setReminderDialog(false);
    } catch (error) {
      console.error('Error updating reminder:', error);
    }
  };

  const handleCloseDialog = () => {
    setReminderDialog(false);
    setInfoDialog(false);
    setSelectedReminder(null);
    setSelectedPrescription(null);
  };

  const handleInfoOpen = (prescription) => {
    setSelectedPrescription(prescription);
    setInfoDialog(true);
  };

  const getDayLabel = (day) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days[day - 1];
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Ongoing';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getActivePrescriptions = () => {
    return prescriptions.filter(prescription => prescription.status === 'Active');
  };

  const getCompletedPrescriptions = () => {
    return prescriptions.filter(prescription => prescription.status === 'Completed');
  };

  return (
    <PatientPageContainer
      title="Medications"
      description="View your prescribed medicines and manage reminders"
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
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            className="mb-6 border-b border-border"
          >
            <Tab 
              label={
                <Box className="flex items-center">
                  <Pill className="mr-2 h-4 w-4" />
                  <span>Active Medications</span>
                  <Chip 
                    size="small" 
                    label={getActivePrescriptions().length} 
                    className="ml-2 bg-primary/10 text-primary"
                  />
                </Box>
              } 
            />
            <Tab 
              label={
                <Box className="flex items-center">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  <span>Completed</span>
                  <Chip 
                    size="small" 
                    label={getCompletedPrescriptions().length} 
                    className="ml-2 bg-primary/10 text-primary"
                  />
                </Box>
              } 
            />
            <Tab 
              label={
                <Box className="flex items-center">
                  <Bell className="mr-2 h-4 w-4" />
                  <span>Reminders</span>
                  <Chip 
                    size="small" 
                    label={reminders.length} 
                    className="ml-2 bg-primary/10 text-primary"
                  />
                </Box>
              } 
            />
          </Tabs>

          {tabValue === 0 && (
            <>
              {getActivePrescriptions().length === 0 ? (
                <Box className="text-center p-8 bg-muted rounded-lg">
                  <Pill size={48} className="mx-auto text-muted-foreground mb-4" />
                  <Typography variant="h6" className="font-semibold">
                    No active medications
                  </Typography>
                  <Typography variant="body2" className="text-muted-foreground">
                    You don't have any active prescriptions at the moment
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {getActivePrescriptions().map((prescription) => (
                    <Grid item xs={12} md={6} key={prescription.id}>
                      <Card className="h-full border border-border bg-card hover:shadow-md transition-shadow">
                        <CardContent>
                          <Box className="flex justify-between items-start mb-2">
                            <Box className="flex items-center">
                              <Box 
                                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3"
                              >
                                <Pill size={20} className="text-primary" />
                              </Box>
                              <Box>
                                <Typography variant="h6" className="font-semibold">
                                  {prescription.medication}
                                </Typography>
                                <Typography variant="body2" className="text-muted-foreground">
                                  {prescription.dosage}
                                </Typography>
                              </Box>
                            </Box>
                            <Chip 
                              label={prescription.status} 
                              size="small"
                              color="primary"
                              className="bg-green-50 text-green-600 border-green-200"
                            />
                          </Box>

                          <Box className="mt-4 space-y-2">
                            <Box className="flex items-center">
                              <Clock size={16} className="mr-2 text-muted-foreground" />
                              <Typography variant="body2">
                                <strong>Frequency:</strong> {prescription.frequency}
                              </Typography>
                            </Box>
                            <Box className="flex items-center">
                              <Calendar size={16} className="mr-2 text-muted-foreground" />
                              <Typography variant="body2">
                                <strong>Start Date:</strong> {formatDate(prescription.startDate)}
                              </Typography>
                            </Box>
                            <Box className="flex items-center">
                              <CalendarClock size={16} className="mr-2 text-muted-foreground" />
                              <Typography variant="body2">
                                <strong>End Date:</strong> {formatDate(prescription.endDate)}
                              </Typography>
                            </Box>
                            <Box className="flex items-center">
                              <Clipboard size={16} className="mr-2 text-muted-foreground" />
                              <Typography variant="body2">
                                <strong>Prescribed By:</strong> {prescription.prescribedBy}
                              </Typography>
                            </Box>
                          </Box>

                          <Box className="mt-4 flex justify-end">
                            <Button 
                              variant="outlined" 
                              size="small"
                              startIcon={<Info size={16} />}
                              onClick={() => handleInfoOpen(prescription)}
                            >
                              Details
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </>
          )}

          {tabValue === 1 && (
            <>
              {getCompletedPrescriptions().length === 0 ? (
                <Box className="text-center p-8 bg-muted rounded-lg">
                  <CheckCircle2 size={48} className="mx-auto text-muted-foreground mb-4" />
                  <Typography variant="h6" className="font-semibold">
                    No completed medications
                  </Typography>
                  <Typography variant="body2" className="text-muted-foreground">
                    Your completed medication history will appear here
                  </Typography>
                </Box>
              ) : (
                <List className="border border-border rounded-md overflow-hidden bg-card">
                  {getCompletedPrescriptions().map((prescription, index) => (
                    <React.Fragment key={prescription.id}>
                      <ListItem 
                        className="hover:bg-muted/50 transition-colors duration-200"
                        secondaryAction={
                          <IconButton 
                            edge="end" 
                            onClick={() => handleInfoOpen(prescription)}
                            className="text-muted-foreground"
                          >
                            <Info size={20} />
                          </IconButton>
                        }
                      >
                        <ListItemText
                          primary={
                            <Box className="flex items-center">
                              <Typography variant="body1" className="font-semibold">
                                {prescription.medication}
                              </Typography>
                              <Typography variant="body2" className="ml-2 text-muted-foreground">
                                ({prescription.dosage})
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Box className="flex flex-col mt-1">
                              <Typography variant="body2" className="text-muted-foreground">
                                {formatDate(prescription.startDate)} - {formatDate(prescription.endDate)}
                              </Typography>
                              <Typography variant="body2" className="text-muted-foreground">
                                Prescribed by {prescription.prescribedBy}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < getCompletedPrescriptions().length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </>
          )}

          {tabValue === 2 && (
            <>
              {reminders.length === 0 ? (
                <Box className="text-center p-8 bg-muted rounded-lg">
                  <Bell size={48} className="mx-auto text-muted-foreground mb-4" />
                  <Typography variant="h6" className="font-semibold">
                    No medication reminders
                  </Typography>
                  <Typography variant="body2" className="text-muted-foreground">
                    You don't have any medication reminders set up
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {reminders.map((reminder) => (
                    <Grid item xs={12} md={6} lg={4} key={reminder.id}>
                      <Card className={`h-full border border-border ${reminder.enabled ? 'bg-card' : 'bg-muted/50'} hover:shadow-md transition-shadow`}>
                        <CardContent>
                          <Box className="flex items-start justify-between mb-3">
                            <Box className="flex items-center">
                              <Box 
                                className={`w-10 h-10 rounded-full ${reminder.enabled ? 'bg-primary/10' : 'bg-muted'} flex items-center justify-center mr-3`}
                              >
                                {reminder.enabled ? (
                                  <AlarmClock size={20} className="text-primary" />
                                ) : (
                                  <BellOff size={20} className="text-muted-foreground" />
                                )}
                              </Box>
                              <Box>
                                <Typography variant="h6" className={`font-semibold ${!reminder.enabled && 'text-muted-foreground'}`}>
                                  {reminder.medication}
                                </Typography>
                                <Typography variant="body2" className="text-muted-foreground">
                                  {reminder.dosage}
                                </Typography>
                              </Box>
                            </Box>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={reminder.enabled}
                                  onChange={() => toggleReminderEnabled(reminder)}
                                  color="primary"
                                />
                              }
                              label=""
                            />
                          </Box>
                          
                          <Box className="mt-4 space-y-3">
                            <Box className="flex items-center">
                              <Clock size={16} className="mr-2 text-muted-foreground" />
                              <Typography variant="body2" className={!reminder.enabled ? 'text-muted-foreground' : ''}>
                                <strong>Time:</strong> {reminder.time}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="body2" className="mb-2 flex items-center">
                                <Calendar size={16} className="mr-2 text-muted-foreground" />
                                <strong>Days:</strong>
                              </Typography>
                              <Box className="flex flex-wrap gap-1">
                                {[1, 2, 3, 4, 5, 6, 7].map(day => (
                                  <Chip
                                    key={day}
                                    label={getDayLabel(day)}
                                    size="small"
                                    className={reminder.days.includes(day) 
                                      ? (reminder.enabled ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground') 
                                      : 'bg-muted/30 text-muted-foreground'
                                    }
                                  />
                                ))}
                              </Box>
                            </Box>
                          </Box>
                          
                          <Box className="mt-4 flex justify-end">
                            <Button 
                              variant="outlined" 
                              size="small"
                              startIcon={<Edit3 size={16} />}
                              onClick={() => handleEditReminder(reminder)}
                              className={reminder.enabled ? '' : 'border-muted-foreground text-muted-foreground'}
                            >
                              Edit
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </>
          )}
          
          {/* Reminder Edit Dialog */}
          <Dialog 
            open={reminderDialog} 
            onClose={handleCloseDialog}
            fullWidth
            maxWidth="xs"
          >
            <DialogTitle className="bg-primary text-primary-foreground">
              Edit Reminder for {selectedReminder?.medication}
            </DialogTitle>
            <DialogContent className="mt-4">
              <Box className="mb-4">
                <TextField
                  fullWidth
                  label="Reminder Time"
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  className="mb-4"
                />
              </Box>
              
              <Typography variant="subtitle2" className="mb-2">
                Active Days
              </Typography>
              <Box className="flex flex-wrap gap-2 mb-4">
                {[1, 2, 3, 4, 5, 6, 7].map(day => (
                  <Chip
                    key={day}
                    label={getDayLabel(day)}
                    onClick={() => {
                      if (reminderDays.includes(day)) {
                        setReminderDays(reminderDays.filter(d => d !== day));
                      } else {
                        setReminderDays([...reminderDays, day]);
                      }
                    }}
                    color={reminderDays.includes(day) ? 'primary' : 'default'}
                    className={reminderDays.includes(day) ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
                  />
                ))}
              </Box>
            </DialogContent>
            <DialogActions className="bg-muted/30 p-3">
              <Button 
                onClick={handleCloseDialog} 
                className="text-muted-foreground"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveReminder} 
                variant="contained"
                disabled={!reminderTime || reminderDays.length === 0}
                className="bg-primary text-primary-foreground"
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>
          
          {/* Prescription Info Dialog */}
          <Dialog
            open={infoDialog}
            onClose={handleCloseDialog}
            fullWidth
            maxWidth="sm"
          >
            <DialogTitle className="bg-primary text-primary-foreground flex justify-between items-center">
              <Typography variant="h6">{selectedPrescription?.medication}</Typography>
              <IconButton onClick={handleCloseDialog} className="text-primary-foreground">
                <X size={20} />
              </IconButton>
            </DialogTitle>
            <DialogContent className="mt-4">
              {selectedPrescription && (
                <List disablePadding>
                  <ListItem>
                    <ListItemText
                      primary="Dosage"
                      secondary={selectedPrescription.dosage}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="Frequency"
                      secondary={selectedPrescription.frequency}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="Start Date"
                      secondary={formatDate(selectedPrescription.startDate)}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="End Date"
                      secondary={formatDate(selectedPrescription.endDate)}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="Prescribed By"
                      secondary={selectedPrescription.prescribedBy}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="Status"
                      secondary={selectedPrescription.status}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="Pharmacy"
                      secondary={selectedPrescription.pharmacy}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="Refills Remaining"
                      secondary={selectedPrescription.refillsRemaining}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="Instructions"
                      secondary={selectedPrescription.instructions}
                      secondaryTypographyProps={{ 
                        style: { whiteSpace: 'pre-wrap' } 
                      }}
                    />
                  </ListItem>
                </List>
              )}
            </DialogContent>
          </Dialog>
        </>
      )}
    </PatientPageContainer>
  );
} 
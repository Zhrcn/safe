'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Grid,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMedicalFile, updateMedicalFile } from '@/store/slices/patient/medicalFileSlice';
import { FileText, Calendar, User, AlertCircle, Activity, Heart, Brain, Pill } from 'lucide-react';
import { useNotification } from '@/components/ui/Notification';

const MedicalFilePage = () => {
  const dispatch = useDispatch();
  const { showNotification } = useNotification();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    bloodType: '',
    allergies: [],
    chronicConditions: [],
    medications: [],
    immunizations: [],
    labResults: [],
    vitalSigns: {},
    familyHistory: [],
    lifestyle: {},
  });

  const { medicalFile, loading, error } = useSelector((state) => state.medicalFile);

  const handleEdit = () => {
    setFormData({
      bloodType: medicalFile.bloodType,
      allergies: medicalFile.allergies,
      chronicConditions: medicalFile.chronicConditions,
      medications: medicalFile.medications,
      immunizations: medicalFile.immunizations,
      labResults: medicalFile.labResults,
      vitalSigns: medicalFile.vitalSigns,
      familyHistory: medicalFile.familyHistory,
      lifestyle: medicalFile.lifestyle,
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await dispatch(updateMedicalFile(formData)).unwrap();
      setIsEditing(false);
      showNotification('Medical file updated successfully', 'success');
    } catch (error) {
      showNotification(error.message || 'Failed to update medical file', 'error');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">
          {error.message || 'Failed to load medical file'}
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Medical File</Typography>
        {!isEditing ? (
          <Button
            variant="outlined"
            startIcon={<FileText />}
            onClick={handleEdit}
          >
            Edit Medical File
          </Button>
        ) : (
          <Button
            variant="contained"
            startIcon={<FileText />}
            onClick={handleSave}
          >
            Save Changes
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Heart size={20} />
                    <Typography variant="subtitle2" color="text.secondary">
                      Blood Type
                    </Typography>
                  </Box>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      value={formData.bloodType}
                      onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                    />
                  ) : (
                    <Typography variant="body1">{medicalFile.bloodType}</Typography>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Allergies
              </Typography>
              {isEditing ? (
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  value={formData.allergies.join(', ')}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value.split(',').map(item => item.trim()) })}
                  placeholder="Enter allergies separated by commas"
                />
              ) : (
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {medicalFile.allergies.map((allergy, index) => (
                    <Chip
                      key={index}
                      label={allergy}
                      color="error"
                      icon={<AlertCircle size={16} />}
                    />
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Chronic Conditions
              </Typography>
              {isEditing ? (
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  value={formData.chronicConditions.join(', ')}
                  onChange={(e) => setFormData({ ...formData, chronicConditions: e.target.value.split(',').map(item => item.trim()) })}
                  placeholder="Enter chronic conditions separated by commas"
                />
              ) : (
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {medicalFile.chronicConditions.map((condition, index) => (
                    <Chip
                      key={index}
                      label={condition}
                      color="warning"
                      icon={<Brain size={16} />}
                    />
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Vital Signs
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Blood Pressure
                  </Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      value={formData.vitalSigns.bloodPressure}
                      onChange={(e) => setFormData({
                        ...formData,
                        vitalSigns: { ...formData.vitalSigns, bloodPressure: e.target.value }
                      })}
                    />
                  ) : (
                    <Typography variant="body1">{medicalFile.vitalSigns.bloodPressure}</Typography>
                  )}
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Heart Rate
                  </Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      value={formData.vitalSigns.heartRate}
                      onChange={(e) => setFormData({
                        ...formData,
                        vitalSigns: { ...formData.vitalSigns, heartRate: e.target.value }
                      })}
                    />
                  ) : (
                    <Typography variant="body1">{medicalFile.vitalSigns.heartRate}</Typography>
                  )}
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Temperature
                  </Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      value={formData.vitalSigns.temperature}
                      onChange={(e) => setFormData({
                        ...formData,
                        vitalSigns: { ...formData.vitalSigns, temperature: e.target.value }
                      })}
                    />
                  ) : (
                    <Typography variant="body1">{medicalFile.vitalSigns.temperature}</Typography>
                  )}
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Weight
                  </Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      value={formData.vitalSigns.weight}
                      onChange={(e) => setFormData({
                        ...formData,
                        vitalSigns: { ...formData.vitalSigns, weight: e.target.value }
                      })}
                    />
                  ) : (
                    <Typography variant="body1">{medicalFile.vitalSigns.weight}</Typography>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Immunizations
              </Typography>
              <List>
                {medicalFile.immunizations.map((immunization, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemText
                        primary={immunization.name}
                        secondary={`Date: ${new Date(immunization.date).toLocaleDateString()}`}
                      />
                    </ListItem>
                    {index < medicalFile.immunizations.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Family History
              </Typography>
              {isEditing ? (
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  value={formData.familyHistory.join(', ')}
                  onChange={(e) => setFormData({ ...formData, familyHistory: e.target.value.split(',').map(item => item.trim()) })}
                  placeholder="Enter family medical history separated by commas"
                />
              ) : (
                <List>
                  {medicalFile.familyHistory.map((condition, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemText primary={condition} />
                      </ListItem>
                      {index < medicalFile.familyHistory.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MedicalFilePage; 
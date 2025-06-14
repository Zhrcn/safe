'use client';

import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Alert,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Autocomplete,
  FormHelperText,
  Divider,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Plus, Trash2, Edit2, Info } from 'lucide-react';

const commonMedications = [
  { name: 'Lisinopril 10mg', type: 'Tablet', dosage: '10mg', frequency: ['Once daily', 'Twice daily'] },
  { name: 'Metformin 500mg', type: 'Tablet', dosage: '500mg', frequency: ['Twice daily', 'Three times daily'] },
  { name: 'Atorvastatin 10mg', type: 'Tablet', dosage: '10mg', frequency: ['Once daily'] },
  { name: 'Levothyroxine 50mcg', type: 'Tablet', dosage: '50mcg', frequency: ['Once daily'] },
  { name: 'Amlodipine 5mg', type: 'Tablet', dosage: '5mg', frequency: ['Once daily'] },
  { name: 'Omeprazole 20mg', type: 'Capsule', dosage: '20mg', frequency: ['Once daily'] },
  { name: 'Simvastatin 20mg', type: 'Tablet', dosage: '20mg', frequency: ['Once daily'] },
  { name: 'Metoprolol 25mg', type: 'Tablet', dosage: '25mg', frequency: ['Twice daily'] },
  { name: 'Albuterol 90mcg', type: 'Inhaler', dosage: '90mcg', frequency: ['As needed'] },
  { name: 'Sertraline 50mg', type: 'Tablet', dosage: '50mg', frequency: ['Once daily'] }
];

const defaultFrequencyOptions = [
  'Once daily',
  'Twice daily',
  'Three times daily',
  'As needed',
  'Before meals',
  'After meals',
  'At bedtime'
];

const prescriptionSchema = z.object({
  medications: z.array(z.object({
    name: z.string(),
    dosage: z.string(),
    frequency: z.string(),
    type: z.string(),
    instructions: z.string().optional()
  })).min(1, 'At least one medication is required'),
  instructions: z.string().min(5, 'Instructions must be at least 5 characters'),
  duration: z.string().min(1, 'Duration is required'),
  notes: z.string().optional()
});

export default function PrescriptionForm({ patientId, patientName, onClose, onSuccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [medications, setMedications] = useState([]);
  const [newMedication, setNewMedication] = useState('');
  const [medicationError, setMedicationError] = useState('');
  const [newFrequency, setNewFrequency] = useState('');
  const [newDosage, setNewDosage] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editInstructions, setEditInstructions] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      medications: [],
      instructions: '',
      duration: '',
      notes: ''
    }
  });

  // Auto-fill frequency/dosage when medication is selected
  const handleMedicationChange = (value) => {
    setNewMedication(value || '');
    const medObj = commonMedications.find(m => m.name === value);
    if (medObj) {
      setNewDosage(medObj.dosage);
      setNewFrequency(medObj.frequency[0] || '');
    } else {
      setNewDosage('');
      setNewFrequency('');
    }
  };

  const handleAddMedication = () => {
    if (!newMedication || newMedication.trim() === '') {
      setMedicationError('Please select a medication');
      return;
    }
    const medObj = commonMedications.find(m => m.name === newMedication);
    if (!medObj) {
      setMedicationError('Please select a valid medication');
      return;
    }
    if (!newFrequency) {
      setMedicationError('Please select a frequency');
      return;
    }
    const updatedMedications = [
      ...medications,
      { ...medObj, frequency: newFrequency, dosage: newDosage || medObj.dosage, instructions: '' }
    ];
    setMedications(updatedMedications);
    setValue('medications', updatedMedications);
    setNewMedication('');
    setNewFrequency('');
    setNewDosage('');
    setMedicationError('');
  };

  const handleRemoveMedication = (index) => {
    const updatedMedications = medications.filter((_, i) => i !== index);
    setMedications(updatedMedications);
    setValue('medications', updatedMedications);
  };

  // Edit medication instructions modal
  const handleEditMedication = (index) => {
    setEditIndex(index);
    setEditInstructions(medications[index].instructions || '');
    setEditDialogOpen(true);
  };
  const handleEditDialogSave = () => {
    const updatedMedications = [...medications];
    updatedMedications[editIndex].instructions = editInstructions;
    setMedications(updatedMedications);
    setValue('medications', updatedMedications);
    setEditDialogOpen(false);
  };

  const handleReset = () => {
    reset();
    setMedications([]);
    setNewMedication('');
    setNewFrequency('');
    setNewDosage('');
    setError('');
    setSuccess('');
  };

  const handleSaveDraft = () => {
    setSuccess('Draft saved (not submitted)');
    setTimeout(() => setSuccess(''), 1500);
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setError('');
      if (data.medications.length === 0) {
        setError('At least one medication is required');
        return;
      }
      setSuccess('Prescription created successfully');
      reset();
      setMedications([]);
      if (onSuccess) onSuccess(data);
      setTimeout(() => {
        if (onClose) onClose();
      }, 1500);
    } catch (err) {
      setError('An error occurred while creating the prescription');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Section header helper
  const SectionHeader = ({ icon, children }) => (
    <Box display="flex" alignItems="center" gap={1} mb={1} mt={3}>
      {icon}
      <Typography variant="subtitle1" fontWeight={600}>{children}</Typography>
    </Box>
  );

  return (
    <Box maxWidth={540} mx="auto">
      <Card elevation={3} sx={{ borderRadius: 3, p: 0, background: '#fafbfc' }}>
        <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box>
              <Typography variant="h6" fontWeight={700} mb={0.5}>
                New Prescription
              </Typography>
              {patientName && (
                <Typography variant="body2" color="text.secondary">
                  for {patientName}
                </Typography>
              )}
            </Box>
            {onClose && (
              <IconButton onClick={onClose} size="small">
                <X size={20} />
              </IconButton>
            )}
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>
          )}

          <SectionHeader icon={<Info size={18} color="#1976d2" />}>
            Medications
          </SectionHeader>
          <TableContainer component={Paper} variant="outlined" sx={{ mb: 2, boxShadow: 'none', borderRadius: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ background: '#f5f7fa' }}>
                  <TableCell>Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Dosage</TableCell>
                  <TableCell>Frequency</TableCell>
                  <TableCell align="center">Edit</TableCell>
                  <TableCell align="right">Remove</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {medications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                      No medications added
                    </TableCell>
                  </TableRow>
                ) : (
                  medications.map((med, idx) => (
                    <TableRow key={idx} hover sx={{ transition: 'background 0.2s' }}>
                      <TableCell>{med.name}</TableCell>
                      <TableCell>{med.type}</TableCell>
                      <TableCell>{med.dosage}</TableCell>
                      <TableCell>{med.frequency}</TableCell>
                      <TableCell align="center">
                        <IconButton size="small" onClick={() => handleEditMedication(idx)}>
                          <Edit2 size={16} />
                        </IconButton>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => handleRemoveMedication(idx)}>
                          <Trash2 size={16} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Grid container spacing={1} alignItems="center" mb={2}>
            <Grid item xs={12} sm={5}>
              <Autocomplete
                options={commonMedications.map(m => m.name)}
                value={newMedication}
                onChange={(_, value) => handleMedicationChange(value)}
                onInputChange={(_, value) => handleMedicationChange(value)}
                renderInput={(params) => (
                  <TextField {...params} label="Medication" size="small" />
                )}
                fullWidth
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Frequency</InputLabel>
                <Select
                  value={newFrequency}
                  label="Frequency"
                  onChange={e => setNewFrequency(e.target.value)}
                >
                  {(commonMedications.find(m => m.name === newMedication)?.frequency || defaultFrequencyOptions).map(opt => (
                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={2}>
              <TextField
                label="Dosage"
                size="small"
                value={newDosage}
                onChange={e => setNewDosage(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="medium"
                sx={{ minWidth: 0, px: 0, fontWeight: 600 }}
                onClick={handleAddMedication}
                startIcon={<Plus size={18} />}
                disabled={!newMedication || !newFrequency}
              >
                Add
              </Button>
            </Grid>
            {medicationError && (
              <Grid item xs={12}>
                <FormHelperText error>{medicationError}</FormHelperText>
              </Grid>
            )}
          </Grid>

          <Divider sx={{ my: 3 }} />

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <SectionHeader icon={<Info size={18} color="#1976d2" />}>General Instructions</SectionHeader>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Controller
                  name="instructions"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="General Instructions"
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={2}
                      error={!!errors.instructions}
                      helperText={errors.instructions?.message}
                      disabled={isSubmitting}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="duration"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth variant="outlined" error={!!errors.duration} disabled={isSubmitting} size="small">
                      <InputLabel>Duration</InputLabel>
                      <Select
                        {...field}
                        label="Duration"
                      >
                        <MenuItem value="7 days">7 days</MenuItem>
                        <MenuItem value="14 days">14 days</MenuItem>
                        <MenuItem value="30 days">30 days</MenuItem>
                        <MenuItem value="60 days">60 days</MenuItem>
                        <MenuItem value="90 days">90 days</MenuItem>
                        <MenuItem value="As needed">As needed</MenuItem>
                        <MenuItem value="Until finished">Until finished</MenuItem>
                        <MenuItem value="Indefinitely">Indefinitely</MenuItem>
                      </Select>
                      {errors.duration && (
                        <FormHelperText>{errors.duration.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Additional Notes (Optional)"
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={2}
                      error={!!errors.notes}
                      helperText={errors.notes?.message}
                      disabled={isSubmitting}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                  <Button variant="outlined" color="secondary" onClick={handleReset} disabled={isSubmitting}>
                    Reset
                  </Button>
                  <Button variant="outlined" color="primary" onClick={handleSaveDraft} disabled={isSubmitting}>
                    Save as Draft
                  </Button>
                  {onClose && (
                    <Button variant="outlined" onClick={onClose} disabled={isSubmitting}>
                      Cancel
                    </Button>
                  )}
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting || medications.length === 0}
                    sx={{ fontWeight: 600 }}
                  >
                    {isSubmitting ? 'Creating...' : 'Create Prescription'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      {/* Medication Edit Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)} 
        maxWidth="xs" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: 8,
            background: '#fff',
            p: 0
          }
        }}
      >
        <DialogTitle sx={{ pb: 0, pt: 3, fontWeight: 700, fontSize: 20, background: 'transparent' }}>
          Edit Medication Instructions
        </DialogTitle>
        <Typography variant="subtitle2" color="text.secondary" sx={{ px: 3, pt: 0.5, pb: 0, background: 'transparent' }}>
          Add any special instructions for this medication (e.g., take with food, avoid alcohol).
        </Typography>
        <DialogContent sx={{ pt: 3, pb: 3, px: 3, background: 'transparent' }}>
          <TextField
            label="Special Instructions"
            value={editInstructions}
            onChange={e => setEditInstructions(e.target.value)}
            fullWidth
            multiline
            minRows={3}
            autoFocus
            variant="outlined"
            sx={{ background: '#fff', borderRadius: 2 }}
            placeholder="e.g., Take with food, avoid sunlight, ..."
          />
        </DialogContent>
        <Divider sx={{ my: 0 }} />
        <DialogActions sx={{ px: 3, py: 3, justifyContent: 'space-between', background: 'transparent' }}>
          <Button onClick={() => setEditDialogOpen(false)} color="secondary" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleEditDialogSave} variant="contained" color="primary" sx={{ fontWeight: 600, px: 4 }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 
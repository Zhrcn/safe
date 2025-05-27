'use client';

import { useState, useEffect } from 'react';
import { Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Chip } from '@mui/material';
import { FileText, Eye, CheckCircle, X } from 'lucide-react';
import { PharmacistPageContainer, PharmacistCard, SearchField } from '@/components/pharmacist/PharmacistComponents';
import { getPrescriptions, updatePrescriptionStatus } from '@/services/pharmacistService';

// Prescription Detail Dialog Component
function PrescriptionDetailDialog({ open, onClose, prescription }) {
  if (!prescription) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle className="flex justify-between items-center">
        <Typography variant="h6" className="font-bold">
          Prescription Details
        </Typography>
        <IconButton onClick={onClose}>
          <X size={20} />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box className="mt-4 space-y-4">
          <Box className="space-y-1">
            <Typography variant="body2" className="text-muted-foreground">Patient</Typography>
            <Typography variant="body1" className="font-medium">{prescription.patientName}</Typography>
          </Box>

          <Box className="space-y-1">
            <Typography variant="body2" className="text-muted-foreground">Medication</Typography>
            <Typography variant="body1" className="font-medium">{prescription.medication}</Typography>
          </Box>

          <Box className="space-y-1">
            <Typography variant="body2" className="text-muted-foreground">Dosage</Typography>
            <Typography variant="body1">{prescription.dosage}</Typography>
          </Box>

          <Box className="space-y-1">
            <Typography variant="body2" className="text-muted-foreground">Frequency</Typography>
            <Typography variant="body1">{prescription.frequency}</Typography>
          </Box>

          <Box className="space-y-1">
            <Typography variant="body2" className="text-muted-foreground">Issue Date</Typography>
            <Typography variant="body1">{prescription.issueDate}</Typography>
          </Box>

          <Box className="space-y-1">
            <Typography variant="body2" className="text-muted-foreground">Status</Typography>
            <Chip
              label={prescription.status}
              color={prescription.status === 'Pending' ? 'warning' : 'success'}
              size="small"
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} className="text-muted-foreground">
          Close
        </Button>
        {prescription.status === 'Pending' && (
          <Button
            variant="contained"
            startIcon={<CheckCircle size={16} />}
            onClick={onClose}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Mark as Filled
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default function PharmacistPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  // Load prescriptions data
  useEffect(() => {
    async function loadPrescriptions() {
      try {
        setLoading(true);
        const data = await getPrescriptions();
        setPrescriptions(data);
      } catch (error) {
        console.error('Error loading prescriptions:', error);
      } finally {
        setLoading(false);
      }
    }

    loadPrescriptions();
  }, []);

  // Filter prescriptions based on search term
  const filteredPrescriptions = searchTerm
    ? prescriptions.filter(prescription =>
      prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.medication.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : prescriptions;

  const handleViewDetails = (prescriptionId) => {
    const prescription = prescriptions.find(p => p.id === prescriptionId);
    if (prescription) {
      setSelectedPrescription(prescription);
      setDetailDialogOpen(true);
    }
  };

  const handleMarkAsFilled = async (prescriptionId) => {
    try {
      const updatedPrescription = await updatePrescriptionStatus(prescriptionId, 'Filled');
      setPrescriptions(prev => prev.map(prescription =>
        prescription.id === prescriptionId ? updatedPrescription : prescription
      ));
    } catch (error) {
      console.error('Error updating prescription status:', error);
    }
  };

  return (
    <PharmacistPageContainer
      title="Prescription Management"
      description="View and manage prescriptions to be filled."
    >
      <PharmacistCard
        title="Prescriptions List"
        actions={
          <SearchField
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Prescriptions"
          />
        }
      >
        <TableContainer component={Paper} elevation={2} className="bg-card rounded-md">
          <Table>
            <TableHead>
              <TableRow className="bg-muted">
                <TableCell className="text-foreground font-semibold">Patient</TableCell>
                <TableCell className="text-foreground font-semibold">Medication</TableCell>
                <TableCell className="text-foreground font-semibold">Dosage</TableCell>
                <TableCell className="text-foreground font-semibold">Frequency</TableCell>
                <TableCell className="text-foreground font-semibold">Issue Date</TableCell>
                <TableCell className="text-foreground font-semibold">Status</TableCell>
                <TableCell align="right" className="text-foreground font-semibold">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" className="text-muted-foreground">
                    Loading prescriptions data...
                  </TableCell>
                </TableRow>
              ) : filteredPrescriptions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" className="text-muted-foreground">
                    No prescriptions found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPrescriptions.map((prescription) => (
                  <TableRow
                    key={prescription.id}
                    className="hover:bg-muted/40 transition-colors duration-200"
                  >
                    <TableCell className="text-foreground">{prescription.patientName}</TableCell>
                    <TableCell className="text-foreground">{prescription.medication}</TableCell>
                    <TableCell className="text-foreground">{prescription.dosage}</TableCell>
                    <TableCell className="text-foreground">{prescription.frequency}</TableCell>
                    <TableCell className="text-foreground">{prescription.issueDate}</TableCell>
                    <TableCell>
                      <Chip
                        label={prescription.status}
                        color={prescription.status === 'Pending' ? 'warning' : 'success'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right" className="space-x-2">
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Eye size={16} />}
                        onClick={() => handleViewDetails(prescription.id)}
                        className="text-blue-600 dark:text-blue-300 border-blue-600 dark:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900"
                      >
                        View
                      </Button>
                      {prescription.status === 'Pending' && (
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<CheckCircle size={16} />}
                          onClick={() => handleMarkAsFilled(prescription.id)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          Mark as Filled
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </PharmacistCard>

      {/* Prescription Detail Dialog */}
      <PrescriptionDetailDialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        prescription={selectedPrescription}
      />
    </PharmacistPageContainer>
  );
} 
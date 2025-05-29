'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  InputAdornment,
  Dialog,
  CircularProgress,
  Tabs,
  Tab,
  Alert
} from '@mui/material';
import { Search, UserPlus, UserRound, Filter } from 'lucide-react';
import { getPatients } from '@/services/doctorService';
import AddPatientForm from '@/components/doctor/AddPatientForm';
import PatientCard from '@/components/doctor/PatientCard';

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // Load patients on component mount
  useEffect(() => {
    const loadPatients = async () => {
      try {
        setLoading(true);
        setError('');
        
        const data = await getPatients();
        setPatients(data);
        setFilteredPatients(data);
      } catch (err) {
        setError('Failed to load patients');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadPatients();
  }, []);
  
  // Filter patients based on search term and active tab
  useEffect(() => {
    let filtered = patients;
    
    // Apply search filter
    if (searchTerm) {
      const lowercaseSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(patient => 
        patient.name.toLowerCase().includes(lowercaseSearch) || 
        patient.condition.toLowerCase().includes(lowercaseSearch) ||
        patient.medicalId?.toLowerCase().includes(lowercaseSearch)
      );
    }
    
    // Apply tab filter
    if (activeTab !== 'all') {
      filtered = filtered.filter(patient => patient.status.toLowerCase() === activeTab);
    }
    
    setFilteredPatients(filtered);
  }, [searchTerm, activeTab, patients]);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Open add patient dialog
  const handleOpenAddDialog = () => {
    setAddDialogOpen(true);
  };
  
  // Close add patient dialog
  const handleCloseAddDialog = () => {
    setAddDialogOpen(false);
  };
  
  // Handle successful patient addition
  const handlePatientAdded = (newPatient) => {
    setPatients(prevPatients => [...prevPatients, newPatient]);
  };

  return (
    <Box className="p-6">
      <Box className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Typography variant="h4" component="h1" className="font-bold text-foreground">
          Patient Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<UserPlus size={18} />}
          onClick={handleOpenAddDialog}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          Add New Patient
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" className="mb-6">
          {error}
        </Alert>
      )}
      
      <Paper className="p-6 bg-card border border-border rounded-lg mb-6">
        <Box className="flex flex-col sm:flex-row gap-4 mb-6">
          <TextField
            placeholder="Search patients by name, condition, or ID..."
            value={searchTerm}
            onChange={handleSearchChange}
            variant="outlined"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={20} className="text-muted-foreground" />
                </InputAdornment>
              ),
              className: "bg-background text-foreground"
            }}
          />
          <Button
            variant="outlined"
            startIcon={<Filter size={18} />}
            className="whitespace-nowrap text-muted-foreground border-muted-foreground hover:bg-muted/50"
          >
            Advanced Filters
          </Button>
        </Box>
        
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          className="mb-6"
          TabIndicatorProps={{ style: { backgroundColor: 'var(--primary)' } }}
        >
          <Tab 
            label={`All Patients (${patients.length})`} 
            value="all" 
            className={activeTab === 'all' ? 'text-primary' : 'text-muted-foreground'}
          />
          <Tab 
            label={`Active (${patients.filter(p => p.status.toLowerCase() === 'active').length})`} 
            value="active" 
            className={activeTab === 'active' ? 'text-primary' : 'text-muted-foreground'}
          />
          <Tab 
            label={`Urgent (${patients.filter(p => p.status.toLowerCase() === 'urgent').length})`} 
            value="urgent" 
            className={activeTab === 'urgent' ? 'text-primary' : 'text-muted-foreground'}
          />
          <Tab 
            label={`Inactive (${patients.filter(p => p.status.toLowerCase() === 'inactive').length})`} 
            value="inactive" 
            className={activeTab === 'inactive' ? 'text-primary' : 'text-muted-foreground'}
          />
        </Tabs>
        
        {loading ? (
          <Box className="flex justify-center items-center py-12">
            <CircularProgress />
          </Box>
        ) : filteredPatients.length === 0 ? (
          <Box className="py-12 text-center">
            <UserRound size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
            <Typography variant="h6" className="text-foreground mb-2">
              No patients found
            </Typography>
            <Typography variant="body2" className="text-muted-foreground mb-6">
              {searchTerm 
                ? 'Try a different search term or clear the filters'
                : 'Add a new patient to get started'
              }
            </Typography>
            <Button
              variant="outlined"
              onClick={handleOpenAddDialog}
              className="text-primary border-primary hover:bg-primary/10"
            >
              Add New Patient
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredPatients.map(patient => (
              <Grid item xs={12} sm={6} md={4} key={patient.id}>
                <PatientCard patient={patient} />
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
      
      {/* Add Patient Dialog */}
      <Dialog
        open={addDialogOpen}
        onClose={handleCloseAddDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          className: "bg-background"
        }}
      >
        <AddPatientForm 
          onClose={handleCloseAddDialog} 
          onSuccess={handlePatientAdded} 
        />
      </Dialog>
    </Box>
  );
} 
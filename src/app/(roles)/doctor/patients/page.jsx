'use client';
import { useState, useEffect, useMemo } from 'react';
import { Search, UserPlus, UserRound, Filter } from 'lucide-react';
import { patients as mockPatients } from '@/mockdata/patients';
import AddPatientForm from '@/components/doctor/AddPatientForm';
import PatientCard from '@/components/doctor/PatientCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Dialog, DialogContent } from '@/components/ui/Dialog';
import { Loader2 } from 'lucide-react';
export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const filteredPatients = useMemo(() => {
    let filtered = Array.isArray(patients) ? patients : [];
    if (searchTerm) {
      const lowercaseSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(patient => 
        `${patient.user?.firstName || ''} ${patient.user?.lastName || ''}`.trim().toLowerCase().includes(lowercaseSearch) || 
        patient.condition.toLowerCase().includes(lowercaseSearch) ||
        patient.medicalId?.toLowerCase().includes(lowercaseSearch)
      );
    }
    if (activeTab !== 'all') {
      filtered = filtered.filter(patient => (patient.user?.isActive ? 'active' : 'inactive').toLowerCase() === activeTab);
    }
    return filtered;
  }, [searchTerm, activeTab, patients]);
  const statusCounts = useMemo(() => {
    if (!Array.isArray(patients)) {
      return { all: 0, active: 0, urgent: 0, inactive: 0 };
    }
    return {
      all: patients.length,
      active: patients.filter(p => (p.user?.isActive ? 'active' : 'inactive').toLowerCase() === 'active').length,
      urgent: patients.filter(p => (p.user?.isActive ? 'active' : 'inactive').toLowerCase() === 'urgent').length,
      inactive: patients.filter(p => (p.user?.isActive ? 'active' : 'inactive').toLowerCase() === 'inactive').length
    };
  }, [patients]);
  const tabLabels = useMemo(() => {
    return {
      all: `All Patients (${statusCounts.all})`,
      active: `Active (${statusCounts.active})`,
      urgent: `Urgent (${statusCounts.urgent})`,
      inactive: `Inactive (${statusCounts.inactive})`
    };
  }, [statusCounts]);
  useEffect(() => {
    const loadPatients = async () => {
      try {
        setLoading(true);
        setError('');
        const data = mockPatients;
        setPatients(data);
      } catch (err) {
        setError('Failed to load patients');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadPatients();
  }, []);
  const handleTabChange = (value) => {
    setActiveTab(value);
  };
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleOpenAddDialog = () => {
    setAddDialogOpen(true);
  };
  const handleCloseAddDialog = () => {
    setAddDialogOpen(false);
  };
  const handlePatientAdded = (newPatient) => {
    setPatients(prevPatients => [...prevPatients, newPatient]);
  };
  return (
    <div className="p-6">
      <Card className="mb-6 rounded-xl shadow-lg">
        <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6">
          <h1 className="text-2xl font-bold text-foreground">Patient Management</h1>
          <Button onClick={handleOpenAddDialog} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg">
            <UserPlus className="mr-2 h-4 w-4" />
            Add New Patient
          </Button>
        </CardContent>
      </Card>
      {error && (
        <Alert variant="destructive" className="mb-6 rounded-lg">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Card className="p-6 rounded-xl shadow-lg">
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients by name, condition, or ID..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10 bg-background rounded-lg"
              />
            </div>
            <Button
              variant="outline"
              className="whitespace-nowrap text-muted-foreground border-muted-foreground hover:bg-muted/50 rounded-lg"
            >
              <Filter className="mr-2 h-4 w-4" />
              Advanced Filters
            </Button>
          </div>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-6">
            <TabsList>
              <TabsTrigger value="all">{tabLabels.all}</TabsTrigger>
              <TabsTrigger value="active">{tabLabels.active}</TabsTrigger>
              <TabsTrigger value="urgent">{tabLabels.urgent}</TabsTrigger>
              <TabsTrigger value="inactive">{tabLabels.inactive}</TabsTrigger>
            </TabsList>
          </Tabs>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="py-12 text-center">
              <UserRound className="mx-auto mb-4 h-12 w-12 text-muted-foreground opacity-50" />
              <h2 className="text-lg font-semibold text-foreground mb-2">
                No patients found
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                {searchTerm 
                  ? 'Try a different search term or clear the filters'
                  : 'Add a new patient to get started'
                }
              </p>
              <Button
                variant="outline"
                onClick={handleOpenAddDialog}
                className="text-primary border-primary hover:bg-primary/10 rounded-lg"
              >
                Add New Patient
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredPatients.map((patient) => (
                <Card key={patient.id} className="rounded-xl shadow-md">
                  <CardContent className="p-4">
                    <PatientCard patient={patient} />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-xl">
          <AddPatientForm 
            onClose={handleCloseAddDialog} 
            onSuccess={handlePatientAdded} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
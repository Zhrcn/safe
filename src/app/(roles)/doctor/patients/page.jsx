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
import { useTranslation } from 'react-i18next';
export default function PatientsPage() {
  const { t } = useTranslation();
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
      all: t('doctor.patients.all', { count: statusCounts.all }, `All Patients (${statusCounts.all})`),
      active: t('doctor.patients.active', { count: statusCounts.active }, `Active (${statusCounts.active})`),
      urgent: t('doctor.patients.urgent', { count: statusCounts.urgent }, `Urgent (${statusCounts.urgent})`),
      inactive: t('doctor.patients.inactive', { count: statusCounts.inactive }, `Inactive (${statusCounts.inactive})`)
    };
  }, [statusCounts, t]);
  useEffect(() => {
    const loadPatients = async () => {
      try {
        setLoading(true);
        setError('');
        const data = mockPatients;
        setPatients(data);
      } catch (err) {
        setError(t('doctor.patients.loadError', 'Failed to load patients'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadPatients();
  }, [t]);
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
    <div className="p-6 bg-background min-h-screen text-foreground">
      <Card className="mb-6 rounded-xl shadow-lg bg-card border border-border">
        <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6">
          <h1 className="text-2xl font-bold text-card-foreground">{t('doctor.patients.title', 'Patient Management')}</h1>
          <Button onClick={handleOpenAddDialog} className="rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground  shadow-md">
            <UserPlus className="mr-2 h-4 w-4" />
            {t('doctor.patients.addNew', 'Add New Patient')}
          </Button>
        </CardContent>
      </Card>
      {error && (
        <Alert variant="destructive" className="mb-6 rounded-2xl bg-destructive/10 border border-destructive text-destructive-foreground">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Card className="p-6 rounded-xl shadow-lg bg-card border border-border">
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/3 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('doctor.patients.searchPlaceholder', 'Search patients by name, condition, or ID...')}
                value={searchTerm}
                onChange={handleSearchChange}
                className="rounded-2xl pl-10 bg-background border border-border text-foreground    focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              />
            </div>
            <Button
              variant="outline"
              className="rounded-2xl whitespace-nowrap text-muted-foreground border border-border hover:bg-muted/50  shadow-sm"
            >
              <Filter className="mr-2 h-4 w-4" />
              {t('doctor.patients.advancedFilters', 'Advanced Filters')}
            </Button>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-6">
            <TabsList className="bg-muted rounded-2xl p-1">
              <TabsTrigger value="all" className="rounded-2xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">{tabLabels.all}</TabsTrigger>
              <TabsTrigger value="active" className="rounded-2xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">{tabLabels.active}</TabsTrigger>
              <TabsTrigger value="urgent" className="rounded-2xl data-[state=active]:bg-warning data-[state=active]:text-warning-foreground">{tabLabels.urgent}</TabsTrigger>
              <TabsTrigger value="inactive" className="rounded-2xl data-[state=active]:bg-muted-foreground/10 data-[state=active]:text-foreground">{tabLabels.inactive}</TabsTrigger>
            </TabsList>
          </Tabs>
          </div>  
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="py-12 text-center">
              <UserRound className="mx-auto mb-4 h-12 w-12 text-muted-foreground opacity-50" />
              <h2 className="text-lg font-semibold text-card-foreground mb-2">
                {t('doctor.patients.noPatients', 'No patients found')}
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                {searchTerm 
                  ? t('doctor.patients.noSearchResults', 'Try a different search term or clear the filters')
                  : t('doctor.patients.addPrompt', 'Add a new patient to get started')
                }
              </p>
              <Button
                variant="outline"
                onClick={handleOpenAddDialog}
                className="text-primary border-primary hover:bg-primary/10 rounded-2xl"
              >
                {t('doctor.patients.addNew', 'Add New Patient')}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
              {filteredPatients.map((patient) => (
                <PatientCard key={patient.id} patient={patient} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-xl bg-card border border-border">
          <AddPatientForm 
            onClose={handleCloseAddDialog} 
            onSuccess={handlePatientAdded} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
'use client';
import { useState, useEffect, useMemo } from 'react';
import { Search, UserPlus, UserRound, Filter } from 'lucide-react';
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
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchPatients } from '@/store/slices/doctor/doctorPatientsSlice';
import { getImageUrl, getInitials } from '@/components/ui/Avatar';
import { getAgeFromDateOfBirth } from '@/lib/utils';

export default function PatientsPage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { patients, loading, error } = useAppSelector(
    (state) => state.doctorPatients
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchPatients());
  }, [dispatch]);

  const filteredPatients = useMemo(() => {
    let filtered = Array.isArray(patients) ? patients : [];
    if (searchTerm) {
      const lowercaseSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(patient =>
        `${patient.user?.firstName || patient.firstName || ''} ${patient.user?.lastName || patient.lastName || ''}`.trim().toLowerCase().includes(lowercaseSearch) ||
        (patient.condition || '').toLowerCase().includes(lowercaseSearch) ||
        (patient.medicalId || '').toLowerCase().includes(lowercaseSearch)
      );
    }
    if (activeTab !== 'all') {
      filtered = filtered.filter(patient => {
        const isActive = patient.user?.isActive ?? patient.isActive ?? true;
        return (isActive ? 'active' : 'inactive').toLowerCase() === activeTab;
      });
    }
    return filtered;
  }, [searchTerm, activeTab, patients]);

  const statusCounts = useMemo(() => {
    if (!Array.isArray(patients)) {
      return { all: 0, active: 0, urgent: 0, inactive: 0 };
    }
    return {
      all: patients.length,
      active: patients.filter(p => {
        const isActive = p.user?.isActive ?? p.isActive ?? true;
        return isActive;
      }).length,
      urgent: patients.filter(p => {
        const isUrgent = p.user?.isUrgent ?? p.isUrgent ?? false;
        return isUrgent;
      }).length,
      inactive: patients.filter(p => {
        const isActive = p.user?.isActive ?? p.isActive ?? true;
        return !isActive;
      }).length
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
    dispatch(fetchPatients());
  };

  return (
    <div className="p-2 sm:p-4 md:p-6 bg-background min-h-screen text-foreground">
      <Card className="mb-4 sm:mb-6 rounded-xl shadow-lg bg-card border border-border">
        <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-4 sm:p-6">
          <h1 className="text-xl sm:text-2xl font-bold text-card-foreground">{t('doctor.patients.title', 'Patient Management')}</h1>
          <Button
            variant="default"
            onClick={handleOpenAddDialog}
            className="rounded-2xl shadow-md w-full sm:w-auto"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            <span className="hidden xs:inline">{t('doctor.patients.addNew', 'Add New Patient')}</span>
            <span className="inline xs:hidden">{t('doctor.patients.addShort', 'Add')}</span>
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="danger" className="mb-4 sm:mb-6 rounded-2xl bg-danger/10 border border-danger text-danger-foreground">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="p-2 sm:p-4 md:p-6 rounded-xl shadow-lg bg-card border border-border">
        <CardContent className="p-0">
          <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('doctor.patients.searchPlaceholder', 'Search patients by name, condition, or ID...')}
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="rounded-2xl pl-10 bg-background border border-border text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary transition w-full"
                />
              </div>
              <Button
                variant="outline"
                className="rounded-2xl whitespace-nowrap shadow-sm w-full sm:w-auto"
              >
                <Filter className="mr-2 h-4 w-4" />
                <span className="hidden xs:inline">{t('doctor.patients.advancedFilters', 'Advanced Filters')}</span>
                <span className="inline xs:hidden">{t('doctor.patients.filtersShort', 'Filters')}</span>
              </Button>
            </div>
            <div className="w-full overflow-x-auto">
              <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-4 sm:mb-6 min-w-[340px]">
                <TabsList className="bg-muted rounded-2xl p-1 flex flex-row gap-1 w-full">
                  <TabsTrigger value="all" className="rounded-2xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-1 min-w-[80px]">
                    <span className="truncate">{tabLabels.all}</span>
                  </TabsTrigger>
                  <TabsTrigger value="active" className="rounded-2xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-1 min-w-[80px]">
                    <span className="truncate">{tabLabels.active}</span>
                  </TabsTrigger>
                  <TabsTrigger value="urgent" className="rounded-2xl data-[state=active]:bg-warning data-[state=active]:text-warning-foreground flex-1 min-w-[80px]">
                    <span className="truncate">{tabLabels.urgent}</span>
                  </TabsTrigger>
                  <TabsTrigger value="inactive" className="rounded-2xl data-[state=active]:bg-muted-foreground/10 data-[state=active]:text-foreground flex-1 min-w-[80px]">
                    <span className="truncate">{tabLabels.inactive}</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="py-8 sm:py-12 text-center">
              <UserRound className="mx-auto mb-4 h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground opacity-50" />
              <h2 className="text-base sm:text-lg font-semibold text-card-foreground mb-2">
                {t('doctor.patients.noPatients', 'No patients found')}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
                {searchTerm
                  ? t('doctor.patients.noSearchResults', 'Try a different search term or clear the filters')
                  : t('doctor.patients.addPrompt', 'Add a new patient to get started')
                }
              </p>
              <Button
                variant="outline"
                onClick={handleOpenAddDialog}
                className="rounded-2xl w-full sm:w-auto"
              >
                {t('doctor.patients.addNew', 'Add New Patient')}
              </Button>
            </div>
          ) : (
            <div
              className="
                grid
                grid-cols-1
                xs:grid-cols-2
                md:grid-cols-3
                lg:grid-cols-4
                gap-4
                sm:gap-6
                md:gap-8
                xl:gap-10
              "
            >
              {filteredPatients.map((patient) => {
                const userProfileImage = patient.user?.profileImage;
                const age = patient.age || patient.user?.age || getAgeFromDateOfBirth(patient.user?.dateOfBirth || patient.dateOfBirth);
                return (
                  <div key={patient._id || patient.id} className="flex">
                    <PatientCard
                      patient={{
                        ...patient,
                        profileImage: userProfileImage,
                        age
                      }}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-xl bg-card border border-border w-full">
          <AddPatientForm
            onClose={handleCloseAddDialog}
            onSuccess={handlePatientAdded}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
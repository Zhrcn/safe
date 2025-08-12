'use client';
import { useState, useEffect, useMemo } from 'react';
import { Search, UserPlus, UserRound, Filter } from 'lucide-react';
import AddPatientForm from '@/components/doctor/AddPatientForm';
import PatientCard from '@/components/doctor/PatientCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Card, CardContent } from '@/components/ui/Card';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Dialog, DialogContent } from '@/components/ui/Dialog';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchPatients } from '@/store/slices/doctor/doctorPatientsSlice';
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
        if (activeTab === 'active') return isActive;
        if (activeTab === 'inactive') return !isActive;
        if (activeTab === 'urgent') {
          const isUrgent = patient.user?.isUrgent ?? patient.isUrgent ?? false;
          return isUrgent;
        }
        return true;
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

  const handlePatientAdded = () => {
    dispatch(fetchPatients());
  };

  return (
    <div className="p-0 bg-background min-h-screen text-foreground flex flex-col">
      <Card className="mb-0 rounded-none shadow-none bg-card border-b border-border">
        <CardContent className="flex flex-row items-center justify-between gap-2 px-4 py-3">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-card-foreground">
              {t('doctor.patients.title', 'Patient Management')}
            </h1>
          </div>
          <Button
            variant="default"
            onClick={handleOpenAddDialog}
            className="rounded-2xl shadow-md text-sm px-4 py-2 flex items-center"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            <span className="hidden md:inline">{t('doctor.patients.addNew', 'Add New Patient')}</span>
            <span className="inline md:hidden">{t('doctor.patients.addShort', 'Add')}</span>
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="danger" className="mb-2 rounded-2xl bg-danger/10 border border-danger text-danger-foreground mx-4 mt-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <Card className="flex-1 rounded-none shadow-none bg-card border-none">
          <CardContent className="p-0 flex-1 flex flex-col">
            <div className="flex flex-col gap-2 mb-2 px-4 pt-4">
              <div className="flex flex-row gap-2 w-full">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t('doctor.patients.searchPlaceholder', 'Search patients by name, condition, or ID...')}
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="rounded-2xl pl-10 bg-background border border-border text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary transition w-full text-sm"
                  />
                </div>
                <Button
                  variant="outline"
                  className="rounded-2xl whitespace-nowrap shadow-sm w-auto text-sm flex items-center px-3"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  <span className="hidden xs:inline">{t('doctor.patients.advancedFilters', 'Advanced Filters')}</span>
                  <span className="inline xs:hidden">{t('doctor.patients.filtersShort', 'Filters')}</span>
                </Button>
              </div>
              <div className="w-full overflow-x-auto">
                <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-2 min-w-[340px]">
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
            <div className="flex-1 overflow-y-auto px-4 pb-4">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredPatients.length === 0 ? (
                <div className="py-8 text-center">
                  <UserRound className="mx-auto mb-4 h-10 w-10 text-muted-foreground opacity-50" />
                  <h2 className="text-base font-semibold text-card-foreground mb-2">
                    {t('doctor.patients.noPatients', 'No patients found')}
                  </h2>
                  <p className="text-xs text-muted-foreground mb-4">
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
                    sm:grid-cols-2
                    lg:grid-cols-3
                    xl:grid-cols-4
                    gap-4
                  "
                >
                  {filteredPatients.map((patient) => {
                    const userProfileImage = patient.user?.profileImage;
                    const age = patient.age || patient.user?.age || getAgeFromDateOfBirth(patient.user?.dateOfBirth || patient.dateOfBirth);
                    return (
                      <div key={patient._id || patient.id} className="flex w-full">
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
            </div>
          </CardContent>
        </Card>
      </div>
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
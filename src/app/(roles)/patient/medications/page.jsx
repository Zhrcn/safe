'use client';
import React, { useState, useEffect } from 'react';
import {
    Search,
    Plus,
    FileText
} from 'lucide-react';
import { useNotification } from '@/components/ui/Notification';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMedications, addMedication, editMedication, removeMedication, updateReminders, requestRefill } from '@/store/slices/patient/medicationsSlice';
import PageHeader from '@/components/patient/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/Separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/DropdownMenu';
import { useTranslation } from 'react-i18next';
import MedicationFormDialog from '@/components/medications/MedicationFormDialog';
import ReminderDialog from '@/components/medications/ReminderDialog';
import MedicationCard from '@/components/patient/MedicationCard';

const MedicationsPage = () => {
    const router = useRouter();
    const { showNotification } = useNotification();
    const [activeTab, setActiveTab] = useState('active');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [medicationDialogOpen, setMedicationDialogOpen] = useState(false);
    const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
    const [selectedMedication, setSelectedMedication] = useState(null);
    const { t, i18n } = useTranslation('common');
    const [_, setRerender] = useState(0);
    
    useEffect(() => {
        const handleLangChange = () => setRerender(x => x + 1);
        i18n.on('languageChanged', handleLangChange);
        return () => i18n.off('languageChanged', handleLangChange);
    }, [i18n]);
    
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchMedications());
    }, [dispatch]);

    const { medications, loading: isLoading, error } = useSelector(state => state.medications);
    const medsArray = Array.isArray(medications) ? medications : [];

    const primary = 'var(--color-primary)';
    const border = 'var(--color-border)';
    const cardBg = 'var(--color-card)';
    const text = 'var(--color-foreground)';
    const muted = 'var(--color-muted-foreground)';
    const errorColor = 'var(--color-error)';

    const handleAddMedication = () => {
        setSelectedMedication(null);
        setMedicationDialogOpen(true);
    };

    const handleEditMedication = (medication) => {
        setSelectedMedication(medication);
        setMedicationDialogOpen(true);
    };

    const handleDeleteMedication = async (id) => {
        if (window.confirm(t('patient.medications.confirmDelete', 'Are you sure you want to delete this medication?'))) {
            try {
                await dispatch(removeMedication(id)).unwrap();
                showNotification(t('patient.medications.deleteSuccess', 'Medication deleted successfully!'), 'success');
            } catch (error) {
                showNotification(t('patient.medications.deleteError', 'Failed to delete medication.'), 'error');
            }
        }
    };

    const handleSaveMedication = async (formData) => {
        try {
            if (!selectedMedication) {
                await dispatch(addMedication(formData)).unwrap();
                showNotification(t('patient.medications.addSuccess', 'Medication added successfully!'), 'success');
            } else {
                await dispatch(editMedication({ id: selectedMedication._id, medicationData: formData })).unwrap();
                showNotification(t('patient.medications.editSuccess', 'Medication updated successfully!'), 'success');
            }
        } catch (error) {
            showNotification(t('patient.medications.addError', 'Failed to save medication.'), 'error');
        }
        setMedicationDialogOpen(false);
    };

    const handleRefill = async (medication) => {
        try {
            await dispatch(requestRefill(medication._id)).unwrap();
            showNotification(t('patient.medications.refillRequested', { name: medication.name, defaultValue: 'Refill requested for {{name}}' }), 'success');
        } catch (error) {
            showNotification(t('patient.medications.refillError', 'Failed to request refill.'), 'error');
        }
    };

    const handleViewDetails = (medication) => {
        console.log(t('patient.medications.viewingDetails', 'Viewing details for:'), medication);
        showNotification(t('patient.medications.viewingDetailsFor', { name: medication.name, defaultValue: 'Viewing details for {{name}}' }), 'info');
    };

    const handleSetReminder = (medication) => {
        setSelectedMedication(medication);
        setReminderDialogOpen(true);
    };

    const handleReminderUpdate = async (formData) => {
        try {
            await dispatch(updateReminders({ id: selectedMedication._id, reminderData: formData })).unwrap();
            showNotification(t('patient.medications.reminderUpdated', 'Reminders updated successfully!'), 'success');
            setReminderDialogOpen(false);
        } catch (error) {
            showNotification(t('patient.medications.reminderError', 'Failed to update reminders.'), 'error');
        }
    };

    const handleViewPrescriptions = () => {
        router.push('/patient/prescriptions');
    };

    const safeToLower = (val) => (typeof val === 'string' ? val.toLowerCase() : '');

    const filteredMedications = medsArray.filter(med => {
        const medName = safeToLower(med?.name);
        const medPrescribedBy = safeToLower(med?.prescribedBy?.firstName + ' ' + med?.prescribedBy?.lastName);
        const medStatus = safeToLower(med?.status);

        const matchesSearch =
            medName.includes(searchQuery.toLowerCase()) ||
            medPrescribedBy.includes(searchQuery.toLowerCase());

        const matchesStatus =
            statusFilter === 'all' || medStatus === safeToLower(statusFilter);

        const matchesTab =
            activeTab === 'all' || medStatus === safeToLower(activeTab);

        return matchesSearch && matchesStatus && matchesTab;
    });

    const [dialog, setDialog] = useState({ open: false, mode: 'add', medication: null });
    const openAddDialog = () => setDialog({ open: true, mode: 'add', medication: null });
    const openEditDialog = (medication) => setDialog({ open: true, mode: 'edit', medication });
    const closeDialog = () => setDialog({ open: false, mode: 'add', medication: null });

    const handleSubmitMedication = async (formData) => {
        try {
            if (dialog.mode === 'edit' && dialog.medication) {
                await dispatch(editMedication({ id: dialog.medication._id, medicationData: formData })).unwrap();
                showNotification(t('patient.medications.editSuccess', 'Medication updated successfully!'), 'success');
            } else {
                await dispatch(addMedication(formData)).unwrap();
                showNotification(t('patient.medications.addSuccess', 'Medication added successfully!'), 'success');
            }
        } catch (error) {
            showNotification(t('patient.medications.addError', 'Failed to save medication.'), 'error');
        }
        closeDialog();
    };

    if (isLoading) {
        return (
            <div className="flex flex-col space-y-6">
                <PageHeader
                    title={t('patient.medications.title', 'Medications')}
                    description={t('patient.medications.description', 'Manage your prescribed medications and set reminders.')}
                    breadcrumbs={[
                        { label: t('patient.breadcrumb', 'Patient'), href: '/patient/dashboard' },
                        { label: t('patient.medications.title', 'Medications'), href: '/patient/medications' }
                    ]}
                />
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2"
                        style={{ borderColor: primary }}></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col space-y-6">
                <PageHeader
                    title={t('patient.medications.title', 'Medications')}
                    description={t('patient.medications.description', 'Manage your prescribed medications and set reminders.')}
                    breadcrumbs={[
                        { label: t('patient.breadcrumb', 'Patient'), href: '/patient/dashboard' },
                        { label: t('patient.medications.title', 'Medications'), href: '/patient/medications' }
                    ]}
                />
                <div className="text-center py-12 rounded-2xl shadow-sm"
                    style={{ background: cardBg, color: text }}>
                    <div className="h-16 w-16 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
                        <span className="text-red-600 text-2xl">!</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-3" style={{ color: text }}>{t('patient.medications.errorLoading', 'Error Loading Medications')}</h3>
                    <p className="mb-6" style={{ color: muted }}>{typeof error === 'string' ? error : error?.message || 'Unknown error'}</p>
                    <Button
                        onClick={() => window.location.reload()}
                        style={{
                            background: primary,
                            color: 'var(--color-primary-foreground)',
                            fontWeight: 500,
                            transition: 'background 0.2s, color 0.2s'
                        }}>
                        {t('common.retry', 'Retry')}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col space-y-6">
            <PageHeader
                title={t('patient.medications.title', 'Medications')}
                description={t('patient.medications.description', 'Manage your prescribed medications and set reminders.')}
                breadcrumbs={[
                    { label: t('patient.breadcrumb', 'Patient'), href: '/patient/dashboard' },
                    { label: t('patient.medications.title', 'Medications'), href: '/patient/medications' }
                ]}
            />

            {/* Search and Filter Section */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex flex-1 gap-4 w-full md:w-auto flex-wrap ">
                    <div className="relative flex-1 min-w-[200px] max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
                            style={{ color: muted }} />
                        <Input
                            placeholder={t('patient.medications.searchPlaceholder', 'Search medications...')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 rounded-2xl"
                            style={{
                                borderColor: border,
                                color: text,
                                background: cardBg
                            }}
                        />
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-[180px] justify-between rounded-2xl"
                                style={{
                                    borderColor: border,
                                    color: primary,
                                    background: 'var(--color-secondary-bg, #f0f4fa)',
                                    fontWeight: 500,
                                    transition: 'background 0.2s, color 0.2s'
                                }}>
                                <span style={{ color: primary }}>
                                    {(() => {
                                        switch (statusFilter) {
                                            case 'active': return t('patient.medications.status.active', 'Active');
                                            case 'completed': return t('patient.medications.status.completed', 'Completed');
                                            case 'expired': return t('patient.medications.status.expired', 'Expired');
                                            default: return t('patient.medications.status.all', 'All Status');
                                        }
                                    })()}
                                </span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent style={{ background: cardBg, color: text, borderColor: border }}>
                            <DropdownMenuItem style={{ color: primary }} onClick={() => setStatusFilter('all')}>
                                {t('patient.medications.status.all', 'All Status')}
                            </DropdownMenuItem>
                            <DropdownMenuItem style={{ color: primary }} onClick={() => setStatusFilter('active')}>
                                {t('patient.medications.status.active', 'Active')}
                            </DropdownMenuItem>
                            <DropdownMenuItem style={{ color: primary }} onClick={() => setStatusFilter('completed')}>
                                {t('patient.medications.status.completed', 'Completed')}
                            </DropdownMenuItem>
                            <DropdownMenuItem style={{ color: primary }} onClick={() => setStatusFilter('expired')}>
                                {t('patient.medications.status.expired', 'Expired')}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Button
                        variant="outline"
                        onClick={handleViewPrescriptions}
                        className="w-full md:w-auto rounded-2xl"
                        style={{
                            borderColor: border,
                            color: primary,
                            background: 'var(--color-secondary-bg, #f0f4fa)',
                            fontWeight: 500,
                            transition: 'background 0.2s, color 0.2s'
                        }}>
                        <FileText className="h-4 w-4 mr-2" style={{ color: primary }} />
                        <span style={{ color: primary }}>
                            {t('patient.medications.viewPrescriptions', 'View Prescriptions')}
                        </span>
                    </Button>
                    <Button
                        onClick={openAddDialog}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl"  
                        style={{
                            background: primary,
                            color: 'var(--color-primary-foreground)',
                            fontWeight: 500,
                            transition: 'background 0.2s, color 0.2s'
                        }}>
                        <Plus className="h-4 w-4 mr-2" />
                        {t('patient.medications.addMedication', 'Add Medication')}
                    </Button>
                </div>
            </div>

            <Separator style={{ borderColor: border }} />

            {/* Tabs Section */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full rounded-2xl">
                <TabsList className="grid w-full grid-cols-3 rounded-2xl"
                    style={{ background: cardBg, borderColor: border }}>
                    <TabsTrigger 
                        value="active" 
                        style={{ 
                            color: activeTab === 'active' ? (text === '#ffffff' ? '#000000' : '#ffffff') : text,
                            background: activeTab === 'active' ? primary : 'transparent'
                        }}
                    >
                        <span>{t('patient.medications.status.active', 'Active')}</span>
                    </TabsTrigger>
                    <TabsTrigger 
                        value="completed" 
                        style={{ 
                            color: activeTab === 'completed' ? (text === '#ffffff' ? '#000000' : '#ffffff') : text,
                            background: activeTab === 'completed' ? primary : 'transparent'
                        }}
                    >
                        <span>{t('patient.medications.status.completed', 'Completed')}</span>
                    </TabsTrigger>
                    <TabsTrigger 
                        value="expired" 
                        style={{ 
                            color: activeTab === 'expired' ? (text === '#ffffff' ? '#000000' : '#ffffff') : text,
                            background: activeTab === 'expired' ? primary : 'transparent'
                        }}
                    >
                        <span>{t('patient.medications.status.expired', 'Expired')}</span>
                    </TabsTrigger>
                </TabsList>
                <TabsContent value={activeTab} className="mt-6">
                    {filteredMedications.length > 0 ? (
                        <div className="grid gap-4">
                            {filteredMedications.map((medication) => (
                                <MedicationCard
                                    key={medication._id}
                                    medication={medication}
                                    onRefill={handleRefill}
                                    onViewDetails={handleViewDetails}
                                    onSetReminder={handleSetReminder}
                                    onEdit={openEditDialog}
                                    onDelete={handleDeleteMedication}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 rounded-2xl shadow-sm"
                            style={{ background: cardBg, color: text }}>
                            <div className="h-16 w-16 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                                <span className="text-gray-600 text-2xl">💊</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-3" style={{ color: text }}>{t('patient.medications.noMedicationsFound', 'No Medications Found')}</h3>
                            <p className="mb-6" style={{ color: muted }}>
                                {searchQuery || statusFilter !== 'all' || activeTab !== 'all'
                                    ? t('patient.medications.tryAdjustingSearch', 'Try adjusting your search or filters to find medications.')
                                    : t('patient.medications.noMedicationsDefault', "You don't have any medications here yet. Add your first medication!")}
                            </p>
                            <Button
                                onClick={openAddDialog}
                                style={{
                                    background: primary,
                                    color: 'var(--color-primary-foreground)',
                                    fontWeight: 500,
                                    transition: 'background 0.2s, color 0.2s'
                                }}>
                                <Plus className="h-4 w-4 mr-2" />
                                {t('patient.medications.addNewMedication', 'Add New Medication')}
                            </Button>
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            {/* Dialogs */}
            <ReminderDialog
                open={reminderDialogOpen}
                medication={selectedMedication}
                onClose={() => setReminderDialogOpen(false)}
                onSubmit={handleReminderUpdate}
            />
            <MedicationFormDialog
                open={dialog.open}
                mode={dialog.mode}
                medication={dialog.medication}
                onClose={closeDialog}
                onSubmit={handleSubmitMedication}
            />
        </div>
    );
};

export default MedicationsPage;
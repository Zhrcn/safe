'use client';
import React, { useState, useEffect } from 'react';
import {
    Search,
    Plus,
    FileText,
    Bell,
    Clock,
    Calendar,
    Edit2,
    Trash2
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
import PatientCheckMedicinePage from './check-medicine.jsx';
import {
  Dialog,
  DialogContent,
  DialogTitle
} from '@/components/ui/Dialog';
import { Switch } from '@/components/ui/Switch';

const MedicationsPage = () => {
    const router = useRouter();
    const { showNotification } = useNotification();
    const [activeTab, setActiveTab] = useState('medications');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [medicationDialogOpen, setMedicationDialogOpen] = useState(false);
    const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
    const [selectedMedication, setSelectedMedication] = useState(null);
    const { t, i18n } = useTranslation('common');
    const [_, setRerender] = useState(0);
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const [detailsMedication, setDetailsMedication] = useState(null);
    
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
        setDetailsMedication(medication);
        setDetailsDialogOpen(true);
    };

    const handleSetReminder = (medication) => {
        setSelectedMedication(medication);
        setReminderDialogOpen(true);
    };

    const handleReminderUpdate = async (formData) => {
        try {
            const reminders = formData.reminders || [];
            await dispatch(updateReminders({ id: selectedMedication._id, reminderData: { reminders } })).unwrap();
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

    const filteredMedications = medsArray;

    const allReminders = medsArray
      .filter(med => Array.isArray(med.reminders) && med.reminders.length > 0)
      .map(med => ({
        medicationName: med.name,
        medicationId: med._id,
        reminders: (med.reminders || []).map(rem => ({
          ...rem,
          medicationId: med._id
        }))
      }));

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

    const handleToggleReminder = async (medicationId, idx) => {
        const med = medsArray.find(m => m._id === medicationId);
        if (!med) return;
        const reminders = med.reminders.map((rem, i) => i === idx ? { ...rem, enabled: !rem.enabled } : rem);
        await dispatch(updateReminders({ id: medicationId, reminderData: { reminders } }));
    };

    const handleDeleteReminder = async (medicationId, idx) => {
        const med = medsArray.find(m => m._id === medicationId);
        if (!med) return;
        const reminders = med.reminders.filter((_, i) => i !== idx);
        await dispatch(updateReminders({ id: medicationId, reminderData: { reminders } }));
    };

    const handleEditReminder = (medicationId, idx) => {
        const med = medsArray.find(m => m._id === medicationId);
        if (!med) return;
        setSelectedMedication({ ...med, editingReminderIdx: idx });
        setReminderDialogOpen(true);
    };

    const renderDetailsDialog = () => (
        <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
            <DialogContent>
                <DialogTitle>{detailsMedication?.name}</DialogTitle>
                <div className="space-y-2 mt-2">
                    <div><b>{t('patient.medications.dosage', 'Dosage')}:</b> {detailsMedication?.dosage}</div>
                    <div><b>{t('patient.medications.frequency', 'Frequency')}:</b> {detailsMedication?.frequency}</div>
                    <div><b>{t('patient.medications.status', 'Status')}:</b> {detailsMedication?.status}</div>
                    <div><b>{t('patient.medications.startDate', 'Start Date')}:</b> {detailsMedication?.startDate ? new Date(detailsMedication.startDate).toLocaleDateString() : '-'}</div>
                    <div><b>{t('patient.medications.endDate', 'End Date')}:</b> {detailsMedication?.endDate ? new Date(detailsMedication.endDate).toLocaleDateString() : '-'}</div>
                    <div><b>{t('patient.medications.notes', 'Notes')}:</b> {detailsMedication?.notes || '-'}</div>
                    {Array.isArray(detailsMedication?.reminders) && detailsMedication.reminders.length > 0 && (
                        <div>
                            <b>{t('patient.medications.reminders', 'Reminders')}:</b>
                            <ul className="list-disc list-inside ml-4">
                                {detailsMedication.reminders.map((rem, idx) => (
                                    <li key={rem._id || idx}>
                                        {rem.time ? `${t('patient.medications.at', 'At')} ${rem.time}` : ''}
                                        {rem.days && rem.days.length > 0 ? ` (${rem.days.join(', ')})` : ''}
                                        {rem.note ? ` - ${rem.note}` : ''}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <div className="flex justify-end mt-4">
                    <Button variant="outline" onClick={() => setDetailsDialogOpen(false)}>{t('common.close', 'Close')}</Button>
                </div>
            </DialogContent>
        </Dialog>
    );

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

    function ReminderCard({ medicationName, medicationId, reminders }) {
        return (
            <div
                className="rounded-2xl border shadow-lg p-0 bg-gradient-to-br from-white via-card to-gray-50"
                style={{
                    borderColor: border,
                    background: cardBg,
                    minHeight: 180,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start'
                }}
            >
                <div className="flex items-center gap-2 px-5 pt-5 pb-2 border-b" style={{ borderColor: border }}>
                    <Bell className="h-5 w-5 text-primary" style={{ color: primary }} />
                    <span className="font-bold text-lg" style={{ color: text }}>{medicationName}</span>
                </div>
                <div className="flex-1 flex flex-col gap-3 px-5 py-4">
                    {reminders.length > 0 ? (
                        reminders.map((rem, i) => (
                            <div
                                key={rem._id || i}
                                className="rounded-xl border flex flex-col md:flex-row md:items-center gap-2 md:gap-4 p-3 bg-gradient-to-r from-white via-muted to-gray-100 shadow-sm"
                                style={{
                                    borderColor: rem.enabled !== false ? primary : border,
                                    background: rem.enabled !== false
                                        ? 'linear-gradient(90deg, #e6f7ff 0%, #f0f4fa 100%)'
                                        : cardBg,
                                    opacity: rem.enabled !== false ? 1 : 0.7,
                                    transition: 'background 0.2s, opacity 0.2s'
                                }}
                            >
                                <div className="flex-1 flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-primary" style={{ color: primary }} />
                                        <span className="font-semibold text-base" style={{ color: text }}>
                                            {rem.time ? `${t('patient.medications.at', 'At')} ${rem.time}` : ''}
                                        </span>
                                        {rem.days && rem.days.length > 0 && (
                                            <span className="ml-2 flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                                                <Calendar className="h-3 w-3" />
                                                {rem.days.join(', ')}
                                            </span>
                                        )}
                                    </div>
                                    {rem.note && (
                                        <div className="text-sm text-muted-foreground mt-1 pl-6" style={{ color: muted }}>
                                            {rem.note}
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 mt-2 md:mt-0">
                                    <Switch
                                        checked={rem.enabled !== false}
                                        onCheckedChange={() => handleToggleReminder(medicationId, i)}
                                        className="mr-1"
                                    />
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => handleEditReminder(medicationId, i)}
                                        aria-label={t('common.edit', 'Edit')}
                                        className="hover:bg-blue-100"
                                        style={{ color: primary }}
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => handleDeleteReminder(medicationId, i)}
                                        aria-label={t('common.delete', 'Delete')}
                                        className="hover:bg-red-100"
                                        style={{ color: errorColor }}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-muted-foreground py-4">
                            <span>{t('patient.medications.noReminders', 'No reminders set for this medication.')}</span>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col space-y-6">
            {renderDetailsDialog()}
            <div className="flex items-center justify-between">
                <PageHeader
                    title={t('patient.medications.title', 'Medications')}
                    description={t('patient.medications.description', 'Manage your prescribed medications and set reminders.')}
                    breadcrumbs={[
                        { label: t('patient.breadcrumb', 'Patient'), href: '/patient/dashboard' },
                        { label: t('patient.medications.title', 'Medications'), href: '/patient/medications' }
                    ]}
                />
            </div>

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
                </div>
            </div>

            <Separator style={{ borderColor: border }} />

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full rounded-2xl">
                <TabsList className="grid w-full grid-cols-3 rounded-2xl"
                    style={{ background: cardBg, borderColor: border }}>
                    <TabsTrigger 
                        value="medications" 
                        style={{ 
                            color: activeTab === 'medications' ? (text === '#ffffff' ? '#000000' : '#ffffff') : text,
                            background: activeTab === 'medications' ? primary : 'transparent'
                        }}
                    >
                        <span>{t('patient.medications.tabs.medications', 'Medications')}</span>
                    </TabsTrigger>
                    <TabsTrigger 
                        value="reminders" 
                        style={{ 
                            color: activeTab === 'reminders' ? (text === '#ffffff' ? '#000000' : '#ffffff') : text,
                            background: activeTab === 'reminders' ? primary : 'transparent'
                        }}
                    >
                        <span>{t('patient.medications.tabs.reminders', 'Reminders')}</span>
                    </TabsTrigger>
                    <TabsTrigger 
                        value="availability" 
                        style={{ 
                            color: activeTab === 'availability' ? (text === '#ffffff' ? '#000000' : '#ffffff') : text,
                            background: activeTab === 'availability' ? primary : 'transparent'
                        }}
                    >
                        <span>{t('patient.medications.tabs.availability', 'Check Availability')}</span>
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="medications" className="mt-6">
                    {filteredMedications.length > 0 ? (
                        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
                                {searchQuery || statusFilter !== 'all'
                                    ? t('patient.medications.tryAdjustingSearch', 'Try adjusting your search or filters to find medications.')
                                    : t('patient.medications.noMedicationsDefault', "You don't have any medications here yet. Add your first medication!")}
                            </p>
                        </div>
                    )}
                </TabsContent>
                <TabsContent value="reminders" className="mt-6">
                    <ReminderDialog
                        open={reminderDialogOpen}
                        medication={selectedMedication}
                        onClose={() => setReminderDialogOpen(false)}
                        onSubmit={handleReminderUpdate}
                    />
                    {allReminders.length > 0 ? (
                        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {allReminders.map(({ medicationName, medicationId, reminders }, medIdx) => (
                                <ReminderCard
                                    key={medicationId}
                                    medicationName={medicationName}
                                    medicationId={medicationId}
                                    reminders={reminders}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground py-12">
                            <span>{t('patient.medications.remindersTabPlaceholder', 'Manage and view your medication reminders here.')}</span>
                        </div>
                    )}
                </TabsContent>
                <TabsContent value="availability" className="mt-6">
                    <PatientCheckMedicinePage hideHeader />
                </TabsContent>
            </Tabs>

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
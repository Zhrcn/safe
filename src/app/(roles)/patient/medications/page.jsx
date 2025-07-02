'use client';
import React, { useState, useEffect } from 'react';
import {
    Add,
    Edit,
    Trash2,
    BellRing,
    BellOff,
    Clock,
    CalendarDays,
    Repeat,
    Hospital,
    Pill,
    AlertCircle,
    CheckCircle,
    Info,
    Search,
    Plus,
    ChevronDown,
    Calendar as CalendarIcon,
    FileText
} from 'lucide-react';
import { useNotification } from '@/components/ui/Notification';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMedications, createMedication, editMedication } from '@/store/slices/patient/medicationsSlice';
import PageHeader from '@/components/patient/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/Separator';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/ToggleGroup';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover';
import { Calendar } from '@/components/ui/Calendar';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/DropdownMenu';
import { useTranslation } from 'react-i18next';
import MedicationFormDialog from '@/components/medications/MedicationFormDialog';
import ReminderDialog from '@/components/medications/ReminderDialog';

function getCssVar(varName, fallback) {
    if (typeof window === 'undefined') return fallback;
    const value = getComputedStyle(document.documentElement).getPropertyValue(varName);
    return value ? value.trim() : fallback;
}

const MedicationCard = ({ medication, onRefill, onViewDetails, onSetReminder, onToggleReminder, onEdit, onDelete }) => {
    const { t } = useTranslation();

    const primary = 'var(--color-primary)';
    const success = 'var(--color-success)';
    const secondary = 'var(--color-secondary)';
    const error = 'var(--color-error)';
    const warning = 'var(--color-warning)';
    const info = 'var(--color-info)';
    const border = 'var(--color-border)';
    const cardBg = 'var(--color-card)';
    const text = 'var(--color-foreground)';
    const muted = 'var(--color-muted-foreground)';

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'active':
                return {
                    background: 'var(--color-success-bg, #e6f9f0)',
                    color: success,
                    borderColor: success
                };
            case 'completed':
                return {
                    background: 'var(--color-secondary-bg, #f0f4fa)',
                    color: secondary,
                    borderColor: secondary
                };
            case 'expired':
                return {
                    background: 'var(--color-error-bg, #fbeaea)',
                    color: error,
                    borderColor: error
                };
            default:
                return {
                    background: 'var(--color-secondary-bg, #f0f4fa)',
                    color: secondary,
                    borderColor: secondary
                };
        }
    };
    const DAYS_OF_WEEK = [
        { value: 'monday', label: t('patient.medications.days.mon', 'Mon') },
        { value: 'tuesday', label: t('patient.medications.days.tue', 'Tue') },
        { value: 'wednesday', label: t('patient.medications.days.wed', 'Wed') },
        { value: 'thursday', label: t('patient.medications.days.thu', 'Thu') },
        { value: 'friday', label: t('patient.medications.days.fri', 'Fri') },
        { value: 'saturday', label: t('patient.medications.days.sat', 'Sat') },
        { value: 'sunday', label: t('patient.medications.days.sun', 'Sun') },
    ];
    const isRefillable = medication.status.toLowerCase() === 'active' &&
        (medication.refillDate && new Date(medication.refillDate) <= new Date());
    const statusStyle = getStatusColor(medication.status);

    return (
        <Card
            className="transition-all duration-300 hover:shadow-lg"
            style={{ background: cardBg, color: text, borderColor: border }}
        >
            <CardContent className="p-6 flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3 mb-2">
                        <Pill className="h-6 w-6" style={{ color: primary }} />
                        <h3 className="text-lg font-bold" style={{ color: text }}>{medication.name}</h3>
                    </div>
                    <p className="text-sm" style={{ color: muted }}>{medication.dosage} - {medication.frequency}</p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm mt-2" style={{ color: muted }}>
                        {medication.refillDate && (
                            <div className="flex items-center gap-1">
                                <CalendarIcon className="h-4 w-4" style={{ color: primary }} />
                                <span>{t('patient.medications.nextRefill', 'Next refill:')} {format(new Date(medication.refillDate), 'PPP')}</span>
                            </div>
                        )}
                        {medication.prescribedBy && (
                            <div className="flex items-center gap-1">
                                <Hospital className="h-4 w-4" style={{ color: primary }} />
                                <span>{t('patient.medications.prescribedBy', 'Prescribed by')} {medication.prescribedBy}</span>
                            </div>
                        )}
                    </div>
                    {medication.notes && (
                        <Alert
                            className="mt-3"
                            style={{
                                background: 'var(--color-warning-bg, #fffbe6)',
                                color: warning,
                                borderColor: warning
                            }}
                            icon={<AlertCircle className="h-4 w-4" style={{ color: warning }} />}
                        >
                            <AlertTitle>{t('patient.medications.note', 'Note')}</AlertTitle>
                            <AlertDescription>{medication.notes}</AlertDescription>
                        </Alert>
                    )}
                    {medication.remindersEnabled && medication.reminderTimes && medication.reminderDays && (
                        <Alert
                            className="mt-3"
                            style={{
                                background: 'var(--color-info-bg, #e6f4fa)',
                                color: info,
                                borderColor: info
                            }}
                            icon={<BellRing className="h-4 w-4" style={{ color: info }} />}
                        >
                            <AlertTitle>{t('patient.medications.remindersActive', 'Reminders Active')}</AlertTitle>
                            <AlertDescription>
                                {t('patient.medications.dailyAt', 'Daily at:')} {medication.reminderTimes.join(', ')} {t('patient.medications.on', 'on')} {medication.reminderDays.map(day => DAYS_OF_WEEK.find(d => d.value === day)?.label).join(', ')}
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
                <div className="flex flex-col items-end gap-2">
                    <Badge
                        style={{
                            background: statusStyle.background,
                            color: statusStyle.color,
                            borderColor: statusStyle.borderColor,
                            borderWidth: 1,
                            borderStyle: 'solid'
                        }}
                    >
                        {medication.status}
                    </Badge>
                    <div className="flex flex-wrap gap-2 justify-end">
                        {isRefillable && (
                            <Button
                                variant="default"
                                size="sm"
                                onClick={() => onRefill(medication)}
                                className="flex items-center gap-2"
                                style={{
                                    background: primary,
                                    color: 'var(--color-primary-foreground)',
                                    borderColor: border,
                                    fontWeight: 500,
                                    transition: 'background 0.2s, color 0.2s'
                                }}
                            >
                                <Pill className="h-4 w-4" />
                                {t('patient.medications.refillNow', 'Refill Now')}
                            </Button>
                        )}
                        <Button
                            variant="default"
                            size="sm"
                            onClick={() => onSetReminder(medication)}
                            className="bg-primary flex items-center gap-2"
                            style={{
                                background: 'var(--color-primary-bg, #f0f4fa)',
                                color: primary,
                                borderColor: border,
                                fontWeight: 500,
                                transition: 'background 0.2s, color 0.2s'
                            }}
                        >
                            {medication.remindersEnabled ? <BellOff className="h-4 w-4" /> : <BellRing className="h-4 w-4" />}
                            {medication.remindersEnabled ? t('patient.medications.manageReminders', 'Manage Reminders') : t('patient.medications.setReminders', 'Set Reminders')}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onViewDetails(medication)}
                            className="text-primary border-primary flex items-center gap-2"
                            style={{
                                borderColor: border,
                                color: primary,
                                background: 'var(--color-secondary-bg, #f0f4fa)',
                                fontWeight: 500,
                                transition: 'background 0.2s, color 0.2s'
                            }}
                        >
                            {t('patient.medications.viewDetails', 'View Details')}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(medication)}
                            className="text-primary border-primary flex items-center gap-2"
                        
                        >
                            <Edit className="h-4 w-4" />
                            {t('patient.medications.edit', 'Edit')}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(medication.id)}
                            className="flex items-center gap-2 group"
                            style={{
                                background: '#fff',
                                color: 'var(--color-error, #ef4444)',
                                borderColor: 'var(--color-error, #ef4444)',
                                fontWeight: 500,
                                transition: 'background 0.2s, color 0.2s'
                            }}
                        >
                            <Trash2
                                className="h-4 w-4"
                                style={{
                                    color: 'var(--color-error, #ef4444)',
                                    transition: 'color 0.2s'
                                }}
                            />
                            <span
                                style={{
                                    color: 'var(--color-error, #ef4444)',
                                    transition: 'color 0.2s'
                                }}
                            >
                                {t('patient.medications.delete', 'Delete')}
                            </span>
                            <style jsx>{`
                                .group:hover {
                                    background: var(--color-error, #ef4444) !important;
                                }
                                .group:hover .h-4 {
                                    color: #fff !important;
                                }
                                .group:hover span {
                                    color: #fff !important;
                                }
                            `}</style>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const MedicationsPage = () => {
    const router = useRouter();
    const { showNotification } = useNotification();
    const [activeTab, setActiveTab] = useState('active');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [medicationDialogOpen, setMedicationDialogOpen] = useState(false);
    const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
    const [selectedMedication, setSelectedMedication] = useState(null);
    const [localLoading, setLocalLoading] = useState(true);
    const [apiError, setApiError] = useState(null);
    const { t, i18n } = useTranslation('common');
    const [_, setRerender] = useState(0);
    useEffect(() => {
        const handleLangChange = () => setRerender(x => x + 1);
        i18n.on('languageChanged', handleLangChange);
        return () => i18n.off('languageChanged', handleLangChange);
    }, [i18n]);
    console.log('Current language:', i18n.language);
    const isRtl = i18n.language === 'ar';

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchMedications());
    }, [dispatch]);

    const { medications, loading: isLoading, error } = useSelector(state => state.medications);

    const medsArray = Array.isArray(medications) ? medications : (medications?.data && Array.isArray(medications.data) ? medications.data : []);

    const FREQUENCY_OPTIONS = [
        { value: 'once_daily', label: t('patient.medications.frequency.onceDaily', 'Once a day') },
        { value: 'twice_daily', label: t('patient.medications.frequency.twiceDaily', 'Twice a day') },
        { value: 'three_times_daily', label: t('patient.medications.frequency.threeTimesDaily', 'Three times a day') },
        { value: 'four_times_daily', label: t('patient.medications.frequency.fourTimesDaily', 'Four times a day') },
        { value: 'every_6_hours', label: t('patient.medications.frequency.every6Hours', 'Every 6 hours') },
        { value: 'every_8_hours', label: t('patient.medications.frequency.every8Hours', 'Every 8 hours') },
        { value: 'every_12_hours', label: t('patient.medications.frequency.every12Hours', 'Every 12 hours') },
        { value: 'as_needed', label: t('patient.medications.frequency.asNeeded', 'As Needed') },
    ];
    const DAYS_OF_WEEK = [
        { value: 'monday', label: t('patient.medications.days.mon', 'Mon') },
        { value: 'tuesday', label: t('patient.medications.days.tue', 'Tue') },
        { value: 'wednesday', label: t('patient.medications.days.wed', 'Wed') },
        { value: 'thursday', label: t('patient.medications.days.thu', 'Thu') },
        { value: 'friday', label: t('patient.medications.days.fri', 'Fri') },
        { value: 'saturday', label: t('patient.medications.days.sat', 'Sat') },
        { value: 'sunday', label: t('patient.medications.days.sun', 'Sun') },
    ];

    const primary = 'var(--color-primary)';
    const border = 'var(--color-border)';
    const cardBg = 'var(--color-card)';
    const text = 'var(--color-foreground)';
    const muted = 'var(--color-muted-foreground)';
    const errorColor = 'var(--color-error)';
    const warning = 'var(--color-warning)';

    const handleAddMedication = () => {
        setSelectedMedication(null);
        setMedicationDialogOpen(true);
    };

    const handleEditMedication = (medication) => {
        setSelectedMedication(medication);
        setMedicationDialogOpen(true);
    };

    const handleDeleteMedication = (id) => {
        console.log('Deleting medication with ID:', id);
        showNotification(t('patient.medications.deleteSuccess', 'Medication deleted successfully!'), 'success');
    };

    const handleSaveMedication = async (formData) => {
        if (!selectedMedication) {
            const result = await dispatch(createMedication(formData));
            if (result.type.endsWith('fulfilled')) {
                showNotification(t('patient.medications.addSuccess', 'Medication added successfully!'), 'success');
                dispatch(fetchMedications());
            } else {
                showNotification(t('patient.medications.addError', 'Failed to add medication.'), 'error');
            }
        }
        setMedicationDialogOpen(false);
    };

    const handleRefill = (medication) => {
        showNotification(t('patient.medications.requestingRefill', { name: medication.name, defaultValue: 'Requesting refill for {{name}}...' }), 'info');
    };

    const handleViewDetails = (medication) => {
        console.log(t('patient.medications.viewingDetails', 'Viewing details for:'), medication);
        showNotification(t('patient.medications.viewingDetailsFor', { name: medication.name, defaultValue: 'Viewing details for {{name}}' }), 'info');
    };

    const handleSetReminder = (medication) => {
        setSelectedMedication(medication);
        setReminderDialogOpen(true);
    };

    const handleReminderUpdate = (formData) => {
        console.log(t('patient.medications.updatingReminder', 'Updating reminder for:'), selectedMedication.name, formData);
        setReminderDialogOpen(false);
    };

    const handleToggleReminder = (medication) => {
        const newReminderStatus = !medication.remindersEnabled;
        showNotification(
            t(newReminderStatus ? 'patient.medications.enabledRemindersFor' : 'patient.medications.disabledRemindersFor', { name: medication.name, defaultValue: newReminderStatus ? 'Enabled reminders for {{name}}' : 'Disabled reminders for {{name}}' }),
            'info'
        );
    };

    const handleViewPrescriptions = () => {
        router.push('/patient/prescriptions');
    };

    const safeToLower = (val) => (typeof val === 'string' ? val.toLowerCase() : '');

    const filteredMedications = medsArray.filter(med => {
        const medName = safeToLower(med?.name);
        const medPrescribedBy = safeToLower(med?.prescribedBy);
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
        if (dialog.mode === 'edit' && dialog.medication) {
            const result = await dispatch(editMedication({ id: dialog.medication.id, medicationData: formData }));
            if (result.type.endsWith('fulfilled')) {
                showNotification(t('patient.medications.editSuccess', 'Medication updated successfully!'), 'success');
                dispatch(fetchMedications());
            } else {
                showNotification(t('patient.medications.editError', 'Failed to update medication.'), 'error');
            }
        } else {
            const result = await dispatch(createMedication(formData));
            if (result.type.endsWith('fulfilled')) {
                showNotification(t('patient.medications.addSuccess', 'Medication added successfully!'), 'success');
                dispatch(fetchMedications());
            } else {
                showNotification(t('patient.medications.addError', 'Failed to add medication.'), 'error');
            }
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
                    <AlertCircle className="h-16 w-16 mx-auto mb-6" style={{ color: errorColor }} />
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
                                <span  style={{ color: primary }}>
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

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full`rounded-2xl">
                <TabsList className="grid w-full grid-cols-3 rounded-2xl"
                    style={{ background: cardBg, borderColor: border }}>
                    <TabsTrigger 
                        value="active" 
                        style={{ 
                            color: activeTab === 'active' ? (text === '#ffffff' ? '#000000' : '#ffffff') : text,
                            background: activeTab === 'active' ? primary : 'transparent'
                        }}
                    >
                        {t('patient.medications.status.active', 'Active')}
                    </TabsTrigger>
                    <TabsTrigger 
                        value="completed" 
                        style={{ 
                            color: activeTab === 'completed' ? (text === '#ffffff' ? '#000000' : '#ffffff') : text,
                            background: activeTab === 'completed' ? primary : 'transparent'
                        }}
                    >
                        {t('patient.medications.status.completed', 'Completed')}
                    </TabsTrigger>
                    <TabsTrigger 
                        value="expired" 
                        style={{ 
                            color: activeTab === 'expired' ? (text === '#ffffff' ? '#000000' : '#ffffff') : text,
                            background: activeTab === 'expired' ? primary : 'transparent'
                        }}
                    >
                        {t('patient.medications.status.expired', 'Expired')}
                    </TabsTrigger>
                </TabsList>
                <TabsContent value={activeTab} className="mt-6">
                    {filteredMedications.length > 0 ? (
                        <div className="grid gap-4">
                            {filteredMedications.map((medication) => (
                                <MedicationCard
                                    key={medication.id}
                                    medication={medication}
                                    onRefill={handleRefill}
                                    onViewDetails={handleViewDetails}
                                    onSetReminder={handleSetReminder}
                                    onToggleReminder={handleToggleReminder}
                                    onEdit={openEditDialog}
                                    onDelete={handleDeleteMedication}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 rounded-2xl shadow-sm"
                            style={{ background: cardBg, color: text }}>
                            <Pill className="h-16 w-16 mx-auto mb-6" style={{ color: muted }} />
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
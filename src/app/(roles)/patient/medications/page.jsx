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
import { useDispatch } from 'react-redux';
import { medications } from '@/mockdata/medications';
import {
    setActiveMedications,
    setMedicationsLoading,
    setMedicationsError,
} from '@/store/slices/patient/dashboardSlice';
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

function getCssVar(varName, fallback) {
    if (typeof window === 'undefined') return fallback;
    const value = getComputedStyle(document.documentElement).getPropertyValue(varName);
    return value ? value.trim() : fallback;
}

const ReminderDialog = ({ open, onClose, medication, onSubmit }) => {
    const { t } = useTranslation();
    const [reminderTimes, setReminderTimes] = useState(medication?.reminderTimes || []);
    const [reminderDays, setReminderDays] = useState(medication?.reminderDays || []);
    const [remindersEnabled, setRemindersEnabled] = useState(medication?.remindersEnabled ?? true);

    useEffect(() => {
        if (medication) {
            setReminderTimes(medication.reminderTimes || []);
            setReminderDays(medication.reminderDays || []);
            setRemindersEnabled(medication.remindersEnabled ?? true);
        }
    }, [medication]);

    const DAYS_OF_WEEK = [
        { value: 'monday', label: t('patient.medications.days.mon', 'Mon') },
        { value: 'tuesday', label: t('patient.medications.days.tue', 'Tue') },
        { value: 'wednesday', label: t('patient.medications.days.wed', 'Wed') },
        { value: 'thursday', label: t('patient.medications.days.thu', 'Thu') },
        { value: 'friday', label: t('patient.medications.days.fri', 'Fri') },
        { value: 'saturday', label: t('patient.medications.days.sat', 'Sat') },
        { value: 'sunday', label: t('patient.medications.days.sun', 'Sun') },
    ];

    const handleTimeChange = (e, idx) => {
        const newTimes = [...reminderTimes];
        newTimes[idx] = e.target.value;
        setReminderTimes(newTimes);
    };

    const handleAddTime = () => {
        setReminderTimes([...reminderTimes, '08:00']);
    };

    const handleRemoveTime = (idx) => {
        setReminderTimes(reminderTimes.filter((_, i) => i !== idx));
    };

    const handleDayToggle = (day) => {
        if (reminderDays.includes(day)) {
            setReminderDays(reminderDays.filter(d => d !== day));
        } else {
            setReminderDays([...reminderDays, day]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            reminderTimes,
            reminderDays,
            remindersEnabled,
        });
    };

    if (!open) return null;

    const primary = 'var(--color-primary)';
    const warning = 'var(--color-warning)';
    const info = 'var(--color-info)';
    const border = 'var(--color-border)';
    const cardBg = 'var(--color-card)';
    const text = 'var(--color-foreground)';
    const muted = 'var(--color-muted-foreground)';

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent style={{ background: cardBg, color: text, borderColor: border }}>
                <DialogHeader>
                    <DialogTitle>
                        {t('patient.medications.reminderDialogTitle', 'Set Reminders')}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label>{t('patient.medications.enableReminders', 'Enable Reminders')}</Label>
                        <div className="mt-2">
                            <Button
                                type="button"
                                variant={remindersEnabled ? "default" : "outline"}
                                onClick={() => setRemindersEnabled(!remindersEnabled)}
                                className="flex items-center gap-2"
                                style={{
                                    background: remindersEnabled ? primary : 'transparent',
                                    color: remindersEnabled ? 'var(--color-primary-foreground)' : text,
                                    borderColor: border,
                                    transition: 'background 0.2s, color 0.2s'
                                }}
                            >
                                {remindersEnabled ? <BellRing className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                                {remindersEnabled ? t('patient.medications.enabled', 'Enabled') : t('patient.medications.disabled', 'Disabled')}
                            </Button>
                        </div>
                    </div>
                    {remindersEnabled && (
                        <>
                            <div>
                                <Label>{t('patient.medications.reminderTimes', 'Reminder Times')}</Label>
                                <div className="flex flex-col gap-2 mt-2">
                                    {reminderTimes.map((time, idx) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <Input
                                                type="time"
                                                value={time}
                                                onChange={e => handleTimeChange(e, idx)}
                                                className="w-32"
                                                style={{ borderColor: border, color: text, background: cardBg }}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveTime(idx)}
                                                style={{
                                                    color: warning,
                                                    background: 'transparent',
                                                    borderColor: 'transparent'
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleAddTime}
                                        style={{
                                            borderColor: border,
                                            color: primary,
                                            background: 'var(--color-secondary-bg, #f0f4fa)',
                                            fontWeight: 500,
                                            transition: 'background 0.2s, color 0.2s'
                                        }}>
                                        <Plus className="h-4 w-4 mr-1" />
                                        {t('patient.medications.addTime', 'Add Time')}
                                    </Button>
                                </div>
                            </div>
                            <div>
                                <Label>{t('patient.medications.reminderDays', 'Reminder Days')}</Label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {DAYS_OF_WEEK.map(day => (
                                        <Button
                                            key={day.value}
                                            type="button"
                                            variant={reminderDays.includes(day.value) ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => handleDayToggle(day.value)}
                                            style={{
                                                background: reminderDays.includes(day.value) ? primary : 'var(--color-secondary-bg, #f0f4fa)',
                                                color: reminderDays.includes(day.value) ? 'var(--color-primary-foreground)' : text,
                                                borderColor: border,
                                                fontWeight: 500,
                                                transition: 'background 0.2s, color 0.2s'
                                            }}
                                        >
                                            {day.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            style={{
                                borderColor: border,
                                color: primary,
                                background: 'var(--color-secondary-bg, #f0f4fa)',
                                fontWeight: 500,
                                transition: 'background 0.2s, color 0.2s'
                            }}>
                            {t('common.cancel', 'Cancel')}
                        </Button>
                        <Button
                            type="submit"
                            style={{
                                background: primary,
                                color: 'var(--color-primary-foreground)',
                                fontWeight: 500,
                                transition: 'background 0.2s, color 0.2s'
                            }}>
                            {t('common.save', 'Save')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

const MedicationFormDialog = ({ open, onClose, onSubmit, medication }) => {
    const { t } = useTranslation();
    const [name, setName] = useState(medication?.name || '');
    const [dosage, setDosage] = useState(medication?.dosage || '');
    const [frequency, setFrequency] = useState(medication?.frequency || '');
    const [refillDate, setRefillDate] = useState(medication?.refillDate ? format(new Date(medication.refillDate), 'yyyy-MM-dd') : '');
    const [prescribedBy, setPrescribedBy] = useState(medication?.prescribedBy || '');
    const [notes, setNotes] = useState(medication?.notes || '');

    useEffect(() => {
        if (medication) {
            setName(medication.name || '');
            setDosage(medication.dosage || '');
            setFrequency(medication.frequency || '');
            setRefillDate(medication.refillDate ? format(new Date(medication.refillDate), 'yyyy-MM-dd') : '');
            setPrescribedBy(medication.prescribedBy || '');
            setNotes(medication.notes || '');
        } else {
            setName('');
            setDosage('');
            setFrequency('');
            setRefillDate('');
            setPrescribedBy('');
            setNotes('');
        }
    }, [medication]);

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

    if (!open) return null;

    const primary = 'var(--color-primary)';
    const border = 'var(--color-border)';
    const cardBg = 'var(--color-card)';
    const text = 'var(--color-foreground)';

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            name,
            dosage,
            frequency,
            refillDate,
            prescribedBy,
            notes,
        });
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent style={{ background: cardBg, color: text, borderColor: border }}>
                <DialogHeader>
                    <DialogTitle>
                        {medication ? t('patient.medications.editMedication', 'Edit Medication') : t('patient.medications.addMedication', 'Add Medication')}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label>{t('patient.medications.name', 'Medication Name')}</Label>
                        <Input value={name} onChange={e => setName(e.target.value)} required style={{ borderColor: border, color: text, background: cardBg }} />
                    </div>
                    <div>
                        <Label>{t('patient.medications.dosage', 'Dosage')}</Label>
                        <Input value={dosage} onChange={e => setDosage(e.target.value)} required style={{ borderColor: border, color: text, background: cardBg }} />
                    </div>
                    <div>
                        <Label>{t('patient.medications.frequency', 'Frequency')}</Label>
                        <Select value={frequency} onValueChange={setFrequency} required>
                            <SelectTrigger style={{ borderColor: border, color: text, background: cardBg }}>
                                <SelectValue placeholder={t('patient.medications.selectFrequency', 'Select frequency')} />
                            </SelectTrigger>
                            <SelectContent style={{ background: cardBg, color: text, borderColor: border }}>
                                {FREQUENCY_OPTIONS.map(opt => (
                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>{t('patient.medications.refillDate', 'Refill Date')}</Label>
                        <Input type="date" value={refillDate} onChange={e => setRefillDate(e.target.value)} style={{ borderColor: border, color: text, background: cardBg }} />
                    </div>
                    <div>
                        <Label>{t('patient.medications.prescribedBy', 'Prescribed By')}</Label>
                        <Input value={prescribedBy} onChange={e => setPrescribedBy(e.target.value)} style={{ borderColor: border, color: text, background: cardBg }} />
                    </div>
                    <div>
                        <Label>{t('patient.medications.notes', 'Notes')}</Label>
                        <Textarea value={notes} onChange={e => setNotes(e.target.value)} style={{ borderColor: border, color: text, background: cardBg }} />
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            style={{
                                borderColor: border,
                                color: primary,
                                background: 'var(--color-secondary-bg, #f0f4fa)',
                                fontWeight: 500,
                                transition: 'background 0.2s, color 0.2s'
                            }}>
                            {t('common.cancel', 'Cancel')}
                        </Button>
                        <Button
                            type="submit"
                            style={{
                                background: primary,
                                color: 'var(--color-primary-foreground)',
                                fontWeight: 500,
                                transition: 'background 0.2s, color 0.2s'
                            }}>
                            {t('common.save', 'Save')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

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
                            variant="secondary"
                            size="sm"
                            onClick={() => onSetReminder(medication)}
                            className="flex items-center gap-2"
                            style={{
                                background: 'var(--color-secondary-bg, #f0f4fa)',
                                color: secondary,
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
                            className="flex items-center gap-2"
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
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(medication)}
                            className="flex items-center gap-2"
                            style={{
                                color: muted,
                                fontWeight: 500,
                                background: 'transparent',
                                borderColor: 'transparent',
                                transition: 'color 0.2s'
                            }}
                        >
                            <Edit className="h-4 w-4" />
                            {t('patient.medications.edit', 'Edit')}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(medication.id)}
                            className="flex items-center gap-2"
                            style={{
                                color: error,
                                fontWeight: 500,
                                background: 'transparent',
                                borderColor: 'transparent',
                                transition: 'color 0.2s'
                            }}
                        >
                            <Trash2 className="h-4 w-4" />
                            {t('patient.medications.delete', 'Delete')}
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
    const [isLoading, setIsLoading] = useState(true);
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
    const error = 'var(--color-error)';
    const warning = 'var(--color-warning)';

    useEffect(() => {
        const fetchMedications = async () => {
            setIsLoading(true);
            setApiError(null);
            try {
                await new Promise(resolve => setTimeout(resolve, 1000));
                dispatch(setActiveMedications(medications));
            } catch (err) {
                setApiError(t('patient.medications.failedToLoad', 'Failed to load medications.'));
                showNotification(t('patient.medications.failedToLoad', 'Failed to load medications.'), 'error');
            } finally {
                setIsLoading(false);
            }
        };

        fetchMedications();
    }, [dispatch, t]);

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

    const handleSaveMedication = (formData) => {
        console.log(t('patient.medications.savingMedication', 'Saving medication:'), formData);
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

    const filteredMedications = medications.filter(med => {
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

    if (apiError) {
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
                <div className="text-center py-12 rounded-lg shadow-sm"
                    style={{ background: cardBg, color: text }}>
                    <AlertCircle className="h-16 w-16 mx-auto mb-6" style={{ color: error }} />
                    <h3 className="text-xl font-semibold mb-3" style={{ color: text }}>{t('patient.medications.errorLoading', 'Error Loading Medications')}</h3>
                    <p className="mb-6" style={{ color: muted }}>{apiError}</p>
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
                        onClick={handleAddMedication}
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
                                    onEdit={handleEditMedication}
                                    onDelete={handleDeleteMedication}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 rounded-lg shadow-sm"
                            style={{ background: cardBg, color: text }}>
                            <Pill className="h-16 w-16 mx-auto mb-6" style={{ color: muted }} />
                            <h3 className="text-xl font-semibold mb-3" style={{ color: text }}>{t('patient.medications.noMedicationsFound', 'No Medications Found')}</h3>
                            <p className="mb-6" style={{ color: muted }}>
                                {searchQuery || statusFilter !== 'all' || activeTab !== 'all'
                                    ? t('patient.medications.tryAdjustingSearch', 'Try adjusting your search or filters to find medications.')
                                    : t('patient.medications.noMedicationsDefault', "You don't have any medications here yet. Add your first medication!")}
                            </p>
                            <Button
                                onClick={handleAddMedication}
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
            <ReminderDialog open={reminderDialogOpen} onClose={() => setReminderDialogOpen(false)} medication={selectedMedication} onSubmit={handleReminderUpdate} />
            <MedicationFormDialog open={medicationDialogOpen} onClose={() => setMedicationDialogOpen(false)} onSubmit={handleSaveMedication} medication={selectedMedication} />
        </div>
    );
};

export default MedicationsPage;
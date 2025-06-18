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

const FREQUENCY_OPTIONS = [
    { value: 'once_daily', label: 'Once a day' },
    { value: 'twice_daily', label: 'Twice a day' },
    { value: 'three_times_daily', label: 'Three times a day' },
    { value: 'four_times_daily', label: 'Four times a day' },
    { value: 'every_6_hours', label: 'Every 6 hours' },
    { value: 'every_8_hours', label: 'Every 8 hours' },
    { value: 'every_12_hours', label: 'Every 12 hours' },
    { value: 'as_needed', label: 'As Needed' },
];
const DAYS_OF_WEEK = [
    { value: 'monday', label: 'Mon' },
    { value: 'tuesday', label: 'Tue' },
    { value: 'wednesday', label: 'Wed' },
    { value: 'thursday', label: 'Thu' },
    { value: 'friday', label: 'Fri' },
    { value: 'saturday', label: 'Sat' },
    { value: 'sunday', label: 'Sun' },
];
const MedicationCard = ({ medication, onRefill, onViewDetails, onSetReminder, onToggleReminder, onEdit, onDelete }) => {
    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'bg-success/10 text-success border-success';
            case 'completed':
                return 'bg-secondary/10 text-secondary border-secondary';
            case 'expired':
                return 'bg-error/10 text-error border-error';
            default:
                return 'bg-secondary/10 text-secondary border-secondary';
        }
    };

    const isRefillable = medication.status.toLowerCase() === 'active' && 
        (medication.refillDate && new Date(medication.refillDate) <= new Date());

    return (
        <Card className="transition-all duration-300 hover:shadow-lg">
            <CardContent className="p-6 flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3 mb-2">
                        <Pill className="h-6 w-6 text-primary" />
                        <h3 className="text-lg font-bold text-foreground">{medication.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{medication.dosage} - {medication.frequency}</p>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mt-2">
                        {medication.refillDate && (
                            <div className="flex items-center gap-1">
                                <CalendarIcon className="h-4 w-4 text-primary" />
                                <span>Next refill: {format(new Date(medication.refillDate), 'PPP')}</span>
                            </div>
                        )}
                        {medication.prescribedBy && (
                             <div className="flex items-center gap-1">
                                <Hospital className="h-4 w-4 text-primary" />
                                <span>Prescribed by {medication.prescribedBy}</span>
                            </div>
                        )}
                    </div>

                    {medication.notes && (
                        <Alert className="mt-3 bg-warning/10 text-warning border-warning" icon={<AlertCircle className="h-4 w-4" />}>
                            <AlertTitle>Note</AlertTitle>
                            <AlertDescription>{medication.notes}</AlertDescription>
                        </Alert>
                    )}

                    {medication.remindersEnabled && medication.reminderTimes && medication.reminderDays && (
                        <Alert className="mt-3 bg-info/10 text-info border-info" icon={<BellRing className="h-4 w-4" />}>
                            <AlertTitle>Reminders Active</AlertTitle>
                            <AlertDescription>
                                Daily at: {medication.reminderTimes.join(', ')} on {medication.reminderDays.map(day => DAYS_OF_WEEK.find(d => d.value === day)?.label).join(', ')}
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
                
                <div className="flex flex-col items-end gap-2">
                    <Badge className={getStatusColor(medication.status)}>
                        {medication.status}
                    </Badge>
                    <div className="flex flex-wrap gap-2 justify-end">
                        {isRefillable && (
                            <Button
                                variant="default"
                                size="sm"
                                onClick={() => onRefill(medication)}
                                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                            >
                                <Pill className="h-4 w-4" />
                                Refill Now
                            </Button>
                        )}
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => onSetReminder(medication)}
                            className="flex items-center gap-2"
                        >
                            {medication.remindersEnabled ? <BellOff className="h-4 w-4" /> : <BellRing className="h-4 w-4" />}
                            {medication.remindersEnabled ? 'Manage Reminders' : 'Set Reminders'}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onViewDetails(medication)}
                            className="flex items-center gap-2"
                        >
                            View Details
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(medication)}
                            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                        >
                            <Edit className="h-4 w-4" />
                            Edit
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(medication.id)}
                            className="flex items-center gap-2 text-destructive hover:text-destructive"
                        >
                            <Trash2 className="h-4 w-4" />
                            Delete
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
const ReminderDialog = ({ open, onClose, medication, onSubmit }) => {
    const [times, setTimes] = useState([]);
    const [selectedDays, setSelectedDays] = useState([]);
    const [firstTime, setFirstTime] = useState('09:00'); 
    const [selectedFrequency, setSelectedFrequency] = useState(medication?.frequency || '');
    const { showNotification } = useNotification();

    useEffect(() => {
        if (medication) {
            setTimes(medication.reminderTimes || []);
            setSelectedDays(medication.reminderDays || []);
            setSelectedFrequency(medication.frequency || '');
            if (medication.reminderTimes && medication.reminderTimes.length > 0) {
                setFirstTime(medication.reminderTimes[0]);
            } else {
                setFirstTime('09:00');
            }
        }
    }, [medication]);

    useEffect(() => {
        if (selectedFrequency && firstTime) {
            setTimes(calculateReminderTimes(selectedFrequency, firstTime));
        }
    }, [selectedFrequency, firstTime]);

    const calculateReminderTimes = (frequency, initialTime) => {
        const newTimes = [];
        const [hours, minutes] = initialTime.split(':').map(Number);
        let intervalHours = 0;

        switch (frequency) {
            case 'once_daily': intervalHours = 24; break;
            case 'twice_daily': intervalHours = 12; break;
            case 'three_times_daily': intervalHours = 8; break;
            case 'four_times_daily': intervalHours = 6; break;
            case 'every_6_hours': intervalHours = 6; break;
            case 'every_8_hours': intervalHours = 8; break;
            case 'every_12_hours': intervalHours = 12; break;
            case 'as_needed': return []; // No scheduled times for as needed
            default: return [];
        }

        if (intervalHours === 24) {
            newTimes.push(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`);
        } else {
            let currentHour = hours;
            for (let i = 0; i < 24 / intervalHours; i++) {
                newTimes.push(`${String(currentHour % 24).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`);
                currentHour += intervalHours;
            }
        }
        return newTimes.sort();
    };

    const handleFrequencyChange = (value) => {
        setSelectedFrequency(value);
    };

    const handleFirstTimeChange = (e) => {
        setFirstTime(e.target.value);
    };

    const handleDayToggle = (value) => {
        setSelectedDays(prev => 
            prev.includes(value)
                ? prev.filter(day => day !== value)
                : [...prev, value]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (times.length === 0 || selectedDays.length === 0) {
            showNotification('Please select reminder times and days.', 'error');
            return;
        }
        onSubmit({
            reminderTimes: times,
            reminderDays: selectedDays,
            remindersEnabled: true,
        });
        showNotification('Reminder settings updated successfully!', 'success');
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle>Set Reminders for {medication?.name}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="frequency">Frequency</Label>
                        <Select value={selectedFrequency} onValueChange={handleFrequencyChange}>
                            <SelectTrigger id="frequency">
                                <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                            <SelectContent>
                                {FREQUENCY_OPTIONS.map(option => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {selectedFrequency !== 'as_needed' && (
                        <div className="space-y-2">
                            <Label htmlFor="firstTime">First Dose Time (24h format)</Label>
                            <Input
                                id="firstTime"
                                type="time"
                                value={firstTime}
                                onChange={handleFirstTimeChange}
                                className="border-border focus:border-primary focus:ring-primary/20"
                            />
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label>Reminder Days</Label>
                        <ToggleGroup type="multiple" value={selectedDays} onValueChange={setSelectedDays} className="flex flex-wrap gap-2">
                            {DAYS_OF_WEEK.map(day => (
                                <ToggleGroupItem
                                    key={day.value}
                                    value={day.value}
                                    aria-label={`Toggle ${day.label}`}
                                    className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                                >
                                    {day.label}
                                </ToggleGroupItem>
                            ))}
                        </ToggleGroup>
                    </div>
                    {times.length > 0 && selectedDays.length > 0 && selectedFrequency !== 'as_needed' && (
                        <Alert className="bg-primary/10 text-primary border-primary">
                            <AlertTitle>Scheduled Times:</AlertTitle>
                            <AlertDescription>{times.join(', ')}</AlertDescription>
                        </Alert>
                    )}
                </form>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button type="submit" form="reminder-form" onClick={handleSubmit}>Save Reminders</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
const MedicationFormDialog = ({ open, onClose, onSubmit, medication }) => {
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        dosage: '',
        frequency: '',
        notes: '',
        refillDate: null,
        prescribedBy: '',
        status: 'active',
        remindersEnabled: false,
        reminderTimes: [],
        reminderDays: [],
    });
    const { showNotification } = useNotification();

    useEffect(() => {
        if (medication) {
            setFormData({
                id: medication.id || '',
                name: medication.name || '',
                dosage: medication.dosage || '',
                frequency: medication.frequency || '',
                notes: medication.notes || '',
                refillDate: medication.refillDate ? new Date(medication.refillDate) : null,
                prescribedBy: medication.prescribedBy || '',
                status: medication.status || 'active',
                remindersEnabled: medication.remindersEnabled || false,
                reminderTimes: medication.reminderTimes || [],
                reminderDays: medication.reminderDays || [],
            });
        } else {
            setFormData({
                id: '',
                name: '',
                dosage: '',
                frequency: '',
                notes: '',
                refillDate: null,
                prescribedBy: '',
                status: 'active',
                remindersEnabled: false,
                reminderTimes: [],
                reminderDays: [],
            });
        }
    }, [medication]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (date, field) => {
        setFormData(prev => ({ ...prev, [field]: date }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.dosage || !formData.frequency) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }
        onSubmit(formData);
        showNotification('Medication saved successfully!', 'success');
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{medication ? 'Edit Medication' : 'Add New Medication'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input id="name" name="name" value={formData.name} onChange={handleChange} className="col-span-3 border-border focus:border-primary focus:ring-primary/20" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="dosage" className="text-right">Dosage</Label>
                        <Input id="dosage" name="dosage" value={formData.dosage} onChange={handleChange} className="col-span-3 border-border focus:border-primary focus:ring-primary/20" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="frequency" className="text-right">Frequency</Label>
                        <Select value={formData.frequency} onValueChange={(value) => handleChange({ target: { name: 'frequency', value } })}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                            <SelectContent>
                                {FREQUENCY_OPTIONS.map(option => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="prescribedBy" className="text-right">Prescribed By</Label>
                        <Input id="prescribedBy" name="prescribedBy" value={formData.prescribedBy} onChange={handleChange} className="col-span-3 border-border focus:border-primary focus:ring-primary/20" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="refillDate" className="text-right">Next Refill Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal col-span-3",
                                        !formData.refillDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {formData.refillDate ? format(formData.refillDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={formData.refillDate}
                                    onSelect={(date) => handleDateChange(date, 'refillDate')}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">Status</Label>
                        <Select value={formData.status} onValueChange={(value) => handleChange({ target: { name: 'status', value } })}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="expired">Expired</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="notes" className="text-right">Notes</Label>
                        <Textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} className="col-span-3 min-h-[80px] border-border focus:border-primary focus:ring-primary/20" />
                    </div>
                </form>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button type="submit" form="medication-form" onClick={handleSubmit}>Save Medication</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
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

    const dispatch = useDispatch();

    useEffect(() => {
        // Simulate API call
        const fetchMedications = async () => {
            setIsLoading(true);
            setApiError(null);
            try {
                // In a real app, you'd fetch from your backend
                await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
                dispatch(setActiveMedications(medications));
            } catch (err) {
                setApiError('Failed to load medications.');
                showNotification('Failed to load medications.', 'error');
            } finally {
                setIsLoading(false);
            }
        };

        fetchMedications();
    }, [dispatch]);

    const handleAddMedication = () => {
        setSelectedMedication(null);
        setMedicationDialogOpen(true);
    };

    const handleEditMedication = (medication) => {
        setSelectedMedication(medication);
        setMedicationDialogOpen(true);
    };

    const handleDeleteMedication = (id) => {
        // In a real app, this would be an API call to delete
        console.log('Deleting medication with ID:', id);
        showNotification('Medication deleted successfully!', 'success');
        // Optimistically update UI or re-fetch data
    };

    const handleSaveMedication = (formData) => {
        console.log('Saving medication:', formData);
        // In a real app, this would be an API call to save
        setMedicationDialogOpen(false);
    };

    const handleRefill = (medication) => {
        showNotification(`Requesting refill for ${medication.name}...`, 'info');
        // Implement refill logic, likely API call
    };

    const handleViewDetails = (medication) => {
        console.log('Viewing details for:', medication);
        showNotification(`Viewing details for ${medication.name}`, 'info');
    };

    const handleSetReminder = (medication) => {
        setSelectedMedication(medication);
        setReminderDialogOpen(true);
    };

    const handleReminderUpdate = (formData) => {
        // This would typically involve an API call to update reminder settings
        console.log('Updating reminder for:', selectedMedication.name, formData);
        setReminderDialogOpen(false);
    };

    const handleToggleReminder = (medication) => {
        const newReminderStatus = !medication.remindersEnabled;
        showNotification(`${newReminderStatus ? 'Enabled' : 'Disabled'} reminders for ${medication.name}`, 'info');
        // In a real app, update this via API
    };

    const handleViewPrescriptions = () => {
        router.push('/patient/prescriptions');
    };

    const filteredMedications = medications.filter(med => {
        const matchesSearch = med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            med.prescribedBy.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || med.status.toLowerCase() === statusFilter.toLowerCase();
        const matchesTab = activeTab === 'all' || med.status.toLowerCase() === activeTab.toLowerCase();
        return matchesSearch && matchesStatus && matchesTab;
    });

    if (isLoading) {
        return (
            <div className="flex flex-col space-y-6">
                <PageHeader
                    title="Medications"
                    description="Manage your prescribed medications and set reminders."
                    breadcrumbs={[
                        { label: 'Patient', href: '/patient/dashboard' },
                        { label: 'Medications', href: '/patient/medications' }
                    ]}
                />
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    if (apiError) {
        return (
            <div className="flex flex-col space-y-6">
                <PageHeader
                    title="Medications"
                    description="Manage your prescribed medications and set reminders."
                    breadcrumbs={[
                        { label: 'Patient', href: '/patient/dashboard' },
                        { label: 'Medications', href: '/patient/medications' }
                    ]}
                />
                <div className="text-center py-12 bg-card rounded-lg shadow-sm">
                    <AlertCircle className="h-16 w-16 mx-auto mb-6 text-destructive" />
                    <h3 className="text-xl font-semibold mb-3 text-foreground">Error Loading Medications</h3>
                    <p className="text-muted-foreground mb-6">{apiError}</p>
                    <Button onClick={() => window.location.reload()}>Retry</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col space-y-6">
            <PageHeader
                title="Medications"
                description="Manage your prescribed medications and set reminders."
                breadcrumbs={[
                    { label: 'Patient', href: '/patient/dashboard' },
                    { label: 'Medications', href: '/patient/medications' }
                ]}
            />

            {/* Actions Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex flex-1 gap-4 w-full md:w-auto flex-wrap">
                    <div className="relative flex-1 min-w-[200px] max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search medications..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 border-border focus:border-primary focus:ring-primary/20"
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="expired">Expired</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Button variant="outline" onClick={handleViewPrescriptions} className="w-full md:w-auto">
                        <FileText className="h-4 w-4 mr-2" />
                        View Prescriptions
                    </Button>
                    <Button onClick={handleAddMedication} className="w-full md:w-auto">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Medication
                    </Button>
                </div>
            </div>

            <Separator />

            {/* Medication List */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                    <TabsTrigger value="expired">Expired</TabsTrigger>
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
                        <div className="text-center py-12 bg-card rounded-lg shadow-sm">
                            <Pill className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
                            <h3 className="text-xl font-semibold mb-3 text-foreground">No Medications Found</h3>
                            <p className="text-muted-foreground mb-6">
                                {searchQuery || statusFilter !== 'all' || activeTab !== 'all'
                                    ? 'Try adjusting your search or filters to find medications.'
                                    : 'You don\'t have any medications here yet. Add your first medication!'}
                            </p>
                            <Button onClick={handleAddMedication}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add New Medication
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
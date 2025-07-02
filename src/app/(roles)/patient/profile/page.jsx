'use client';
import React, { useState, useEffect, useRef } from 'react';
import {
    User, Mail, Phone, Home, CalendarDays, FileText, HeartPulse,
    DropletIcon, Edit, Save, X, AlertCircle, Check, MapPin,
    Shield, Stethoscope, Pill, Clock, BarChart3, ChevronRight,
    History, FileImage, Download, FilePlus2, RefreshCcw,
    Camera, Bell, Lock, CreditCard, CalendarIcon, Info, Plus, Trash2, Eye,
    ChevronLeft,
} from 'lucide-react';
import { PatientPageContainer } from '@/components/patient/PatientComponents';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Separator } from '@/components/ui/Separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import PageHeader from '@/components/patient/PageHeader';
import FormLayout from '@/components/patient/FormLayout';
import LoadingState from '@/components/patient/LoadingState';
import ErrorState from '@/components/patient/ErrorState';
import { useNotification } from '@/components/ui/Notification';
import AddAllergyDialog from '@/components/patient/medical-file/AddAllergyDialog';
import AddChronicConditionDialog from '@/components/patient/medical-file/AddChronicConditionDialog';
import AddMedicationDialog from '@/components/patient/medical-file/AddMedicationDialog';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover';
import { Calendar } from '@/components/ui/Calendar';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/ScrollArea';
import { useTranslation } from 'react-i18next';
import { Tooltip } from '@/components/ui/Tooltip';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMedicalRecords } from '@/store/slices/patient/medical-recordsSlice';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const glassCard = "backdrop-blur-md bg-card/70 border border-border shadow-xl";
const fadeIn = "animate-fade-in";
const gradientBg = "fixed inset-0 -z-10 animate-gradient bg-gradient-to-br from-background via-card/80 to-muted/60";
const avatarHover = "transition-transform duration-300 hover:scale-105 hover:shadow-2xl";
const gradientBtn = "bg-gradient-to-r from-primary to-blue-400 text-white shadow-lg hover:from-blue-500 hover:to-primary";
const stickyTabs = "sticky top-0 z-20";

const ProfilePage = () => {
    const router = useRouter();
    const { showNotification } = useNotification();
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('personal');
    const [allergyDialogOpen, setAllergyDialogOpen] = useState(false);
    const [chronicConditionDialogOpen, setChronicConditionDialogOpen] = useState(false);
    const [medicationDialogOpen, setMedicationDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        dateOfBirth: null,
    });
    const [emergencyContactData, setEmergencyContactData] = useState({
        name: '',
        relationship: '',
        phone: '',
        email: '',
    });
    const [insuranceData, setInsuranceData] = useState({
        provider: '',
        policyNumber: '',
        groupNumber: '',
        expiryDate: null,
    });
    const [medicalRecordsData, setMedicalRecordsData] = useState({});
    const initializedProfileData = useRef(false);
    const [medicalTabValue, setMedicalTabValue] = useState('vitalSigns');
    const { t } = useTranslation('common');
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchMedicalRecords());
    }, [dispatch]);

    const { medicalRecords, loading, error } = useSelector(state => state.medicalRecords);

    const apiError = null;

    const medicalRecordCategories = [
        { id: 'vitalSigns', label: t('patient.profile.vitalSigns', 'Vital Signs'), icon: HeartPulse },
        { id: 'allergies', label: t('patient.profile.allergies', 'Allergies'), icon: DropletIcon },
        { id: 'chronicConditions', label: t('patient.profile.chronicConditions', 'Chronic Conditions'), icon: Stethoscope },
        { id: 'diagnoses', label: t('patient.profile.diagnoses', 'Diagnoses'), icon: HeartPulse },
        { id: 'labResults', label: t('patient.profile.labResults', 'Lab Results'), icon: BarChart3 },
        { id: 'imagingReports', label: t('patient.profile.imagingReports', 'Imaging Reports'), icon: FileImage },
        { id: 'medications', label: t('patient.profile.medications', 'Medications'), icon: Pill },
        { id: 'immunizations', label: t('patient.profile.immunizations', 'Immunizations'), icon: Shield },
        { id: 'surgicalHistory', label: t('patient.profile.surgicalHistory', 'Surgical History'), icon: History },
        { id: 'documents', label: t('patient.profile.documents', 'Documents'), icon: FileText },
        { id: 'familyHistory', label: t('patient.profile.familyHistory', 'Family History'), icon: User },
        { id: 'socialHistory', label: t('patient.profile.socialHistory', 'Social History'), icon: Home },
        { id: 'generalHistory', label: t('patient.profile.generalHistory', 'General History'), icon: CalendarDays },
    ];

    const handleTabChange = (newValue) => {
        setMedicalTabValue(newValue);
    };

    const [pdfDialogOpen, setPdfDialogOpen] = useState(false);
    const [selectedPdf, setSelectedPdf] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.2);
    
    useEffect(() => {
        if (!initializedProfileData.current) {
            if (!loading && !error && medicalRecords) {
                setFormData({
                    firstName: medicalRecords.profile?.firstName || '',
                    lastName: medicalRecords.profile?.lastName || '',
                    email: medicalRecords.profile?.email || '',
                    phone: medicalRecords.profile?.phone || '',
                    address: medicalRecords.profile?.address || '',
                    dateOfBirth: medicalRecords.profile?.dateOfBirth ? new Date(medicalRecords.profile.dateOfBirth) : null,
                });
                setEmergencyContactData(medicalRecords.profile?.emergencyContact || {
                    name: '',
                    relationship: '',
                    phone: '',
                    email: '',
                });
                setInsuranceData(medicalRecords.profile?.insuranceDetails || {
                    provider: '',
                    policyNumber: '',
                    groupNumber: '',
                    expiryDate: null,
                });
                setMedicalRecordsData(medicalRecords.medicalRecords || {});
                initializedProfileData.current = true;
            }
        }
    }, [loading, error, medicalRecords]);

    const handleRefresh = () => {
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEmergencyContactChange = (e) => {
        const { name, value } = e.target;
        setEmergencyContactData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleInsuranceChange = (e) => {
        const { name, value } = e.target;
        setInsuranceData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDateChange = (date, field) => {
        setFormData(prev => ({
            ...prev,
            [field]: date
        }));
    };

    const handleInsuranceDateChange = (date, field) => {
        setInsuranceData(prev => ({
            ...prev,
            [field]: date
        }));
    };

    const handleMedicalRecordDelete = (category, id) => {
        setMedicalRecordsData(prev => ({
            ...prev,
            [category]: prev[category]?.filter(item => item.id !== id) || []
        }));
    };

    const handleMedicalRecordAdd = (category, newItem) => {
        setMedicalRecordsData(prev => ({
            ...prev,
            [category]: [...(prev[category] || []), { ...newItem, id: Date.now() }]
        }));
    };

    const handleSave = async () => {
        if (!isFormValid()) {
            showNotification(t('patient.profile.saveRequired', 'Please fill in all required fields'), 'error');
            return;
        }
        setSaving(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            showNotification(t('patient.profile.saveSuccess', 'Profile updated successfully'), 'success');
            setIsEditing(false);
        } catch (error) {
            showNotification(error.message || t('patient.profile.saveFailed', 'Failed to update profile'), 'error');
        } finally {
            setSaving(false);
        }
    };

    const isFormValid = () => {
        return formData.firstName && formData.lastName && formData.email && formData.phone;
    };

    const getStatusText = (loadingState, errorState) => {
        if (loadingState) return t('patient.profile.loading', 'Loading...');
        if (errorState) return t('patient.profile.errorLoading', 'Error loading data');
        return '';
    };

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    const changePage = (offset) => {
        setPageNumber(prevPageNumber => prevPageNumber + offset);
    };

    const previousPage = () => changePage(-1);
    const nextPage = () => changePage(1);

    const handlePdfOpen = (document) => {
        setSelectedPdf(document);
        setPdfDialogOpen(true);
    };

    const handlePdfClose = () => {
        setPdfDialogOpen(false);
        setSelectedPdf(null);
        setPageNumber(1);
    };

    const renderProfileHeader = () => (
        <div className={`${glassCard} ${fadeIn} p-6 flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 w-full`}>
            <div className="flex flex-col items-center md:items-start gap-4 w-full md:w-1/3">
                <Avatar className={`h-32 w-32 border-4 border-primary shadow-xl ${avatarHover}`}>
                    <AvatarImage src={medicalRecords?.profile?.profilePicture || '/images/default-avatar.png'} alt="Profile Picture" />
                    <AvatarFallback className="bg-primary/10 text-primary text-5xl font-semibold">
                        {medicalRecords?.profile?.firstName.charAt(0)}{medicalRecords?.profile?.lastName.charAt(0)}
                    </AvatarFallback>
                </Avatar>
                <div className="text-center md:text-left">
                    <h1 className="text-3xl font-bold text-foreground mb-1">
                        {medicalRecords?.profile?.firstName} {medicalRecords?.profile?.lastName}
                    </h1>
                    <p className="text-muted-foreground text-lg">{medicalRecords?.profile?.email}</p>
                    <div className="flex gap-2 justify-center md:justify-start mt-2">
                        <Badge className="bg-muted text-foreground px-3 py-1 rounded-full text-xs font-semibold">Patient</Badge>
                        <span className="flex items-center gap-1 text-success text-xs font-semibold">
                            <Check className="h-4 w-4" /> Active
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-4 w-full md:w-2/3 justify-between">
                <div className="flex flex-wrap gap-3 justify-center md:justify-end">
                    <Button
                        variant="outline"
                        onClick={handleRefresh}
                        className="border-primary text-primary hover:bg-primary hover:text-primary-foreground flex items-center gap-2 rounded-full shadow"
                        aria-label={t('patient.profile.refresh', 'Refresh')}
                    >
                        <RefreshCcw className="w-5 h-5" />
                        {t('patient.profile.refresh', 'Refresh')}
                    </Button>
                    <Button
                        variant={isEditing ? "destructive" : "default"}
                        onClick={() => setIsEditing(!isEditing)}
                        className={`flex items-center gap-2 border-primary rounded-full shadow ${isEditing ? '' : 'bg-primary text-white hover:bg-primary/90'}`}
                        disabled={saving}
                        aria-label={isEditing ? t('patient.profile.cancel', 'Cancel') : t('patient.profile.editProfile', 'Edit Profile')}
                    >
                        {isEditing ? (
                            <>
                                <X className="w-5 h-5" />
                                {t('patient.profile.cancel', 'Cancel')}
                            </>
                        ) : (
                            <>
                                <Edit className="w-5 h-5" />
                                {t('patient.profile.editProfile', 'Edit Profile')}
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );

    const renderPersonalInfo = () => (
        <Card className="w-full min-w-0 max-w-full overflow-hidden">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" /> {t('patient.profile.personalInformation', 'Personal Information')}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="firstName">{t('patient.profile.firstName', 'First Name')}</Label>
                        <Input
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            disabled={!isEditing || saving}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName">{t('patient.profile.lastName', 'Last Name')}</Label>
                        <Input
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            disabled={!isEditing || saving}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">{t('patient.profile.email', 'Email')}</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            disabled={!isEditing || saving}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">{t('patient.profile.phone', 'Phone')}</Label>
                        <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                            disabled={!isEditing || saving}
                            required
                        />
                    </div>
                    <div className="space-y-2 col-span-1 md:col-span-2">
                        <Label htmlFor="address">{t('patient.profile.address', 'Address')}</Label>
                        <Input
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            disabled={!isEditing || saving}
                        />
                    </div>
                    <div className="space-y-2 col-span-1 md:col-span-2">
                        <Label htmlFor="dateOfBirth">{t('patient.profile.dateOfBirth', 'Date of Birth')}</Label>
                        <Popover>
                            <PopoverTrigger asChild disabled={!isEditing || saving}>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal flex items-center gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground",
                                        !formData.dateOfBirth && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {formData.dateOfBirth ? format(formData.dateOfBirth, "PPP") : <span>{t('patient.profile.pickDate', 'Pick a date')}</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={formData.dateOfBirth}
                                    onSelect={(date) => handleDateChange(date, 'dateOfBirth')}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                {isEditing && (
                    <div className="flex justify-end pt-4 border-t ">
                        <Button className="flex items-center gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground" onClick={handleSave} disabled={saving}>
                            {saving ? t('patient.profile.saving', 'Saving...') : t('patient.profile.saveChanges', 'Save Changes')}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );

    const renderEmergencyContact = () => (
        <Card className="w-full min-w-0 max-w-full overflow-hidden">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" /> {t('patient.profile.emergencyContact', 'Emergency Contact')}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="ec_name">{t('patient.profile.name', 'Name')}</Label>
                        <Input
                            id="ec_name"
                            name="name"
                            value={emergencyContactData.name}
                            onChange={handleEmergencyContactChange}
                            disabled={!isEditing || saving}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="ec_relationship">{t('patient.profile.relationship', 'Relationship')}</Label>
                        <Input
                            id="ec_relationship"
                            name="relationship"
                            value={emergencyContactData.relationship}
                            onChange={handleEmergencyContactChange}
                            disabled={!isEditing || saving}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="ec_phone">{t('patient.profile.phone', 'Phone')}</Label>
                        <Input
                            id="ec_phone"
                            name="phone"
                            type="tel"
                            value={emergencyContactData.phone}
                            onChange={handleEmergencyContactChange}
                            disabled={!isEditing || saving}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="ec_email">{t('patient.profile.email', 'Email')}</Label>
                        <Input
                            id="ec_email"
                            name="email"
                            type="email"
                            value={emergencyContactData.email}
                            onChange={handleEmergencyContactChange}
                            disabled={!isEditing || saving}
                        />
                    </div>
                </div>
                {isEditing && (
                    <div className="flex justify-end pt-4 border-t">
                        <Button onClick={handleSave} disabled={saving}>
                            {saving ? t('patient.profile.saving', 'Saving...') : t('patient.profile.saveChanges', 'Save Changes')}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );

    const renderInsuranceInfo = () => (
        <Card className="w-full min-w-0 max-w-full overflow-hidden">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" /> {t('patient.profile.insuranceInformation', 'Insurance Information')}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="ins_provider">{t('patient.profile.provider', 'Provider')}</Label>
                        <Input
                            id="ins_provider"
                            name="provider"
                            value={insuranceData.provider}
                            onChange={handleInsuranceChange}
                            disabled={!isEditing || saving}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="ins_policyNumber">{t('patient.profile.policyNumber', 'Policy Number')}</Label>
                        <Input
                            id="ins_policyNumber"
                            name="policyNumber"
                            value={insuranceData.policyNumber}
                            onChange={handleInsuranceChange}
                            disabled={!isEditing || saving}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="ins_groupNumber">{t('patient.profile.groupNumber', 'Group Number')}</Label>
                        <Input
                            id="ins_groupNumber"
                            name="groupNumber"
                            value={insuranceData.groupNumber}
                            onChange={handleInsuranceChange}
                            disabled={!isEditing || saving}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="ins_expiryDate">{t('patient.profile.expiryDate', 'Expiry Date')}</Label>
                        <Popover>
                            <PopoverTrigger asChild disabled={!isEditing || saving}>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !insuranceData.expiryDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {insuranceData.expiryDate ? format(insuranceData.expiryDate, "PPP") : <span>{t('patient.profile.pickDate', 'Pick a date')}</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={insuranceData.expiryDate}
                                    onSelect={(date) => handleInsuranceDateChange(date, 'expiryDate')}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                {isEditing && (
                    <div className="flex justify-end pt-4 border-t">
                        <Button onClick={handleSave} disabled={saving} className="bg-primary text-primary-foreground hover:bg-primary/90">
                            {saving ? t('patient.profile.saving', 'Saving...') : t('patient.profile.saveChanges', 'Save Changes')}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );

    const renderMedicalFile = () => (
        <Card className="w-full min-w-0 max-w-full overflow-hidden">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" /> {t('patient.profile.medicalFile', 'Medical File')}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 w-full min-w-0 max-w-full overflow-x-visible">
                <Tabs value={medicalTabValue} onValueChange={handleTabChange} className="w-full min-w-0 max-w-full">
                    <div className="w-full max-w-screen-lg mx-auto overflow-x-auto">
                        <TabsList className="flex w-max h-auto p-1 text-muted-foreground rounded-md bg-muted gap-1" style={{scrollBehavior: 'smooth'}}>
                            {medicalRecordCategories.map(category => (
                                <TabsTrigger
                                    key={category.id}
                                    value={category.id}
                                    className="flex items-center px-3 py-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-xs whitespace-nowrap"
                                >
                                    <category.icon className="h-4 w-4 mr-2 flex-shrink-0" />
                                    <span className="truncate">{category.label}</span>
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>
                    
                    <TabsContent value="vitalSigns" className="mt-4">
                        <h3 className="text-lg font-semibold mb-3">{t('patient.profile.recentVitalSigns', 'Recent Vital Signs')}</h3>
                        {medicalRecordsData.vitalSigns && medicalRecordsData.vitalSigns.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full min-w-0 max-w-full">
                                {medicalRecordsData.vitalSigns.map(vital => (
                                    <Card key={vital.id} className="bg-muted/50 w-full min-w-0">
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <HeartPulse className="h-5 w-5 text-primary" />
                                                <p className="font-medium text-foreground">{vital.type}</p>
                                            </div>
                                            <p className="text-2xl font-bold text-primary mb-2">{vital.value} {vital.unit}</p>
                                            <p className="text-sm text-muted-foreground">on {format(new Date(vital.date), 'PPP')}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Alert className="bg-blue-50 text-blue-800 border-blue-200" icon={<Info className="h-4 w-4" />}>
                                <AlertTitle>{t('patient.profile.noVitalSignsRecorded', 'No Vital Signs Recorded')}</AlertTitle>
                                <AlertDescription>{t('patient.profile.vitalSignsDescription', 'Your recent vital signs will appear here.')}</AlertDescription>
                            </Alert>
                        )}
                    </TabsContent>

                    <TabsContent value="allergies" className="mt-4">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-semibold">{t('patient.profile.myAllergies', 'My Allergies')}</h3>
                            <Button size="sm" onClick={() => setAllergyDialogOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" /> {t('patient.profile.addAllergy', 'Add Allergy')}
                            </Button>
                        </div>
                        {medicalRecordsData.allergies && medicalRecordsData.allergies.length > 0 ? (
                            <div className="grid gap-3">
                                {medicalRecordsData.allergies.map(allergy => (
                                    <Card key={allergy.id} className="flex items-center justify-between p-4 bg-muted/50">
                                        <div className="flex items-center gap-3">
                                            <DropletIcon className="h-5 w-5 text-destructive" />
                                            <div>
                                                <p className="font-medium text-foreground">{allergy.name}</p>
                                                <p className="text-sm text-muted-foreground">{t('patient.profile.severity', 'Severity')}: {allergy.severity}</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={() => handleMedicalRecordDelete('allergies', allergy.id)} className="text-muted-foreground hover:text-destructive">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Alert className="bg-blue-50 text-blue-800 border-blue-200" icon={<Info className="h-4 w-4" />}>
                                <AlertTitle>{t('patient.profile.noAllergiesRecorded', 'No Allergies Recorded')}</AlertTitle>
                                <AlertDescription>{t('patient.profile.allergiesDescription', 'You can add your allergies here.')}</AlertDescription>
                            </Alert>
                        )}
                    </TabsContent>

                    <TabsContent value="chronicConditions" className="mt-4">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-semibold">{t('patient.profile.chronicConditionsTitle', 'Chronic Conditions')}</h3>
                            <Button size="sm" onClick={() => setChronicConditionDialogOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" /> {t('patient.profile.addCondition', 'Add Condition')}
                            </Button>
                        </div>
                        {medicalRecordsData.chronicConditions && medicalRecordsData.chronicConditions.length > 0 ? (
                            <div className="grid gap-3">
                                {medicalRecordsData.chronicConditions.map(condition => (
                                    <Card key={condition.id} className="flex items-center justify-between p-4 bg-muted/50">
                                        <div className="flex items-center gap-3">
                                            <Stethoscope className="h-5 w-5 text-primary" />
                                            <div>
                                                <p className="font-medium text-foreground">{condition.name}</p>
                                                <p className="text-sm text-muted-foreground">{t('patient.profile.diagnosedOn', 'Diagnosed on')} {format(new Date(condition.diagnosedDate), 'PPP')}</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={() => handleMedicalRecordDelete('chronicConditions', condition.id)} className="text-muted-foreground hover:text-destructive">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Alert className="bg-blue-50 text-blue-800 border-blue-200" icon={<Info className="h-4 w-4" />}>
                                <AlertTitle>{t('patient.profile.noChronicConditionsRecorded', 'No Chronic Conditions Recorded')}</AlertTitle>
                                <AlertDescription>{t('patient.profile.chronicConditionsDescription', 'You can add your chronic conditions here.')}</AlertDescription>
                            </Alert>
                        )}
                    </TabsContent>

                    <TabsContent value="diagnoses" className="mt-4">
                        <h3 className="text-lg font-semibold mb-3">{t('patient.profile.myDiagnoses', 'My Diagnoses')}</h3>
                        {medicalRecordsData.diagnoses && medicalRecordsData.diagnoses.length > 0 ? (
                            <div className="grid gap-3">
                                {medicalRecordsData.diagnoses.map(diagnosis => (
                                    <Card key={diagnosis.id} className="p-4 bg-muted/50">
                                        <p className="font-medium text-foreground mb-1">{diagnosis.name}</p>
                                        <p className="text-sm text-muted-foreground">{t('patient.profile.diagnosedBy', 'Diagnosed by')} {diagnosis.doctor} {t('patient.profile.on', 'on')} {format(new Date(diagnosis.date), 'PPP')}</p>
                                        {diagnosis.notes && <p className="text-xs text-muted-foreground mt-2">{t('patient.profile.notes', 'Notes')}: {diagnosis.notes}</p>}
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Alert className="bg-blue-50 text-blue-800 border-blue-200" icon={<Info className="h-4 w-4" />}>
                                <AlertTitle>{t('patient.profile.noDiagnosesRecorded', 'No Diagnoses Recorded')}</AlertTitle>
                                <AlertDescription>{t('patient.profile.diagnosesDescription', 'Your medical diagnoses will appear here.')}</AlertDescription>
                            </Alert>
                        )}
                    </TabsContent>

                    <TabsContent value="labResults" className="mt-4">
                        <h3 className="text-lg font-semibold mb-3">{t('patient.profile.labResultsTitle', 'Lab Results')}</h3>
                        {medicalRecordsData.labResults && medicalRecordsData.labResults.length > 0 ? (
                            <div className="grid gap-3">
                                {medicalRecordsData.labResults.map(result => (
                                    <Card key={result.id} className="flex items-center justify-between p-4 bg-muted/50">
                                        <div className="flex items-center gap-3">
                                            <BarChart3 className="h-5 w-5 text-primary" />
                                            <div>
                                                <p className="font-medium text-foreground">{result.title}</p>
                                                <p className="text-sm text-muted-foreground">{t('patient.profile.date', 'Date')}: {format(new Date(result.date), 'PPP')}</p>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm" onClick={() => handlePdfOpen(result)}>
                                            <Eye className="h-4 w-4 mr-2" /> {t('patient.profile.viewReport', 'View Report')}
                                        </Button>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Alert className="bg-blue-50 text-blue-800 border-blue-200" icon={<Info className="h-4 w-4" />}>
                                <AlertTitle>{t('patient.profile.noLabResultsAvailable', 'No Lab Results Available')}</AlertTitle>
                                <AlertDescription>{t('patient.profile.labResultsDescription', 'Your lab test results will appear here.')}</AlertDescription>
                            </Alert>
                        )}
                    </TabsContent>

                    <TabsContent value="imagingReports" className="mt-4">
                        <h3 className="text-lg font-semibold mb-3">{t('patient.profile.imagingReportsTitle', 'Imaging Reports')}</h3>
                        {medicalRecordsData.imagingReports && medicalRecordsData.imagingReports.length > 0 ? (
                            <div className="grid gap-3">
                                {medicalRecordsData.imagingReports.map(report => (
                                    <Card key={report.id} className="flex items-center justify-between p-4 bg-muted/50">
                                        <div className="flex items-center gap-3">
                                            <FileImage className="h-5 w-5 text-primary" />
                                            <div>
                                                <p className="font-medium text-foreground">{report.title}</p>
                                                <p className="text-sm text-muted-foreground">{t('patient.profile.date', 'Date')}: {format(new Date(report.date), 'PPP')}</p>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm" onClick={() => handlePdfOpen(report)}>
                                            <Eye className="h-4 w-4 mr-2" /> {t('patient.profile.viewReport', 'View Report')}
                                        </Button>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Alert className="bg-blue-50 text-blue-800 border-blue-200" icon={<Info className="h-4 w-4" />}>
                                <AlertTitle>{t('patient.profile.noImagingReportsAvailable', 'No Imaging Reports Available')}</AlertTitle>
                                <AlertDescription>{t('patient.profile.imagingReportsDescription', 'Your imaging reports (X-rays, MRIs, etc.) will appear here.')}</AlertDescription>
                            </Alert>
                        )}
                    </TabsContent>

                    <TabsContent value="medications" className="mt-4">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-semibold">{t('patient.profile.currentMedications', 'Current Medications')}</h3>
                            <Button size="sm" onClick={() => setMedicationDialogOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" /> {t('patient.profile.addMedication', 'Add Medication')}
                            </Button>
                        </div>
                        {medicalRecordsData.medications && medicalRecordsData.medications.length > 0 ? (
                            <div className="grid gap-3">
                                {medicalRecordsData.medications.map(med => (
                                    <Card key={med.id} className="flex items-center justify-between p-4 bg-muted/50">
                                        <div className="flex items-center gap-3">
                                            <Pill className="h-5 w-5 text-primary" />
                                            <div>
                                                <p className="font-medium text-foreground">{med.name} - {med.dosage}</p>
                                                <p className="text-sm text-muted-foreground">{t('patient.profile.frequency', 'Frequency')}: {med.frequency}</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={() => handleMedicalRecordDelete('medications', med.id)} className="text-muted-foreground hover:text-destructive">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Alert className="bg-blue-50 text-blue-800 border-blue-200" icon={<Info className="h-4 w-4" />}>
                                <AlertTitle>{t('patient.profile.noMedicationsRecorded', 'No Medications Recorded')}</AlertTitle>
                                <AlertDescription>{t('patient.profile.medicationsDescription', 'Your current and past medications will appear here.')}</AlertDescription>
                            </Alert>
                        )}
                    </TabsContent>

                    <TabsContent value="immunizations" className="mt-4">
                        <h3 className="text-lg font-semibold mb-3">{t('patient.profile.immunizationsHistory', 'Immunizations History')}</h3>
                        {medicalRecordsData.immunizations && medicalRecordsData.immunizations.length > 0 ? (
                            <div className="grid gap-3">
                                {medicalRecordsData.immunizations.map(imm => (
                                    <Card key={imm.id} className="p-4 bg-muted/50">
                                        <p className="font-medium text-foreground mb-1">{imm.name}</p>
                                        <p className="text-sm text-muted-foreground">{t('patient.profile.date', 'Date')}: {format(new Date(imm.date), 'PPP')} - {t('patient.profile.administeredBy', 'Administered by')} {imm.administeredBy}</p>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Alert className="bg-blue-50 text-blue-800 border-blue-200" icon={<Info className="h-4 w-4" />}>
                                <AlertTitle>{t('patient.profile.noImmunizationsRecorded', 'No Immunizations Recorded')}</AlertTitle>
                                <AlertDescription>{t('patient.profile.immunizationsDescription', 'Your immunization records will appear here.')}</AlertDescription>
                            </Alert>
                        )}
                    </TabsContent>

                    <TabsContent value="surgicalHistory" className="mt-4">
                        <h3 className="text-lg font-semibold mb-3">{t('patient.profile.surgicalHistoryTitle', 'Surgical History')}</h3>
                        {medicalRecordsData.surgicalHistory && medicalRecordsData.surgicalHistory.length > 0 ? (
                            <div className="grid gap-3">
                                {medicalRecordsData.surgicalHistory.map(surgery => (
                                    <Card key={surgery.id} className="p-4 bg-muted/50">
                                        <p className="font-medium text-foreground mb-1">{surgery.procedure}</p>
                                        <p className="text-sm text-muted-foreground">{t('patient.profile.date', 'Date')}: {format(new Date(surgery.date), 'PPP')} - {t('patient.profile.hospital', 'Hospital')}: {surgery.hospital}</p>
                                        {surgery.notes && <p className="text-xs text-muted-foreground mt-2">{t('patient.profile.notes', 'Notes')}: {surgery.notes}</p>}
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Alert className="bg-blue-50 text-blue-800 border-blue-200" icon={<Info className="h-4 w-4" />}>
                                <AlertTitle>{t('patient.profile.noSurgicalHistoryRecorded', 'No Surgical History Recorded')}</AlertTitle>
                                <AlertDescription>{t('patient.profile.surgicalHistoryDescription', 'Your surgical history will appear here.')}</AlertDescription>
                            </Alert>
                        )}
                    </TabsContent>

                    <TabsContent value="documents" className="mt-4">
                        <h3 className="text-lg font-semibold mb-3">{t('patient.profile.myDocuments', 'My Documents')}</h3>
                        <div className="flex justify-between items-center mb-3">
                            <p className="text-muted-foreground text-sm">{t('patient.profile.uploadAndManageDocuments', 'Upload and manage your medical documents.')}</p>
                            <Button size="sm" onClick={() => router.push('/patient/medical-records/upload')}>
                                <FilePlus2 className="h-4 w-4 mr-2" /> {t('patient.profile.uploadDocument', 'Upload Document')}
                            </Button>
                        </div>
                        {medicalRecordsData.documents && medicalRecordsData.documents.length > 0 ? (
                            <div className="grid gap-3">
                                {medicalRecordsData.documents.map(doc => (
                                    <Card key={doc.id} className="flex items-center justify-between p-4 bg-muted/50">
                                        <div className="flex items-center gap-3">
                                            <FileText className="h-5 w-5 text-primary" />
                                            <div>
                                                <p className="font-medium text-foreground">{doc.title}</p>
                                                <p className="text-sm text-muted-foreground">{t('patient.profile.type', 'Type')}: {doc.type} - {t('patient.profile.date', 'Date')}: {format(new Date(doc.date), 'PPP')}</p>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm" onClick={() => handlePdfOpen(doc)}>
                                            <Eye className="h-4 w-4 mr-2" /> {t('patient.profile.viewDocument', 'View Document')}
                                        </Button>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Alert className="bg-blue-50 text-blue-800 border-blue-200" icon={<Info className="h-4 w-4" />}>
                                <AlertTitle>{t('patient.profile.noDocumentsUploaded', 'No Documents Uploaded')}</AlertTitle>
                                <AlertDescription>{t('patient.profile.documentsDescription', 'You can upload your medical documents here.')}</AlertDescription>
                            </Alert>
                        )}
                    </TabsContent>

                    <TabsContent value="familyHistory" className="mt-4">
                        <h3 className="text-lg font-semibold mb-3">{t('patient.profile.familyMedicalHistory', 'Family Medical History')}</h3>
                        {medicalRecordsData.familyHistory && medicalRecordsData.familyHistory.length > 0 ? (
                            <div className="grid gap-3">
                                {medicalRecordsData.familyHistory.map(item => (
                                    <Card key={item.id} className="p-4 bg-muted/50">
                                        <p className="font-medium text-foreground mb-1">{item.condition}</p>
                                        <p className="text-sm text-muted-foreground">{t('patient.profile.relationship', 'Relationship')}: {item.relationship} - {t('patient.profile.notes', 'Notes')}: {item.notes}</p>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Alert className="bg-blue-50 text-blue-800 border-blue-200" icon={<Info className="h-4 w-4" />}>
                                <AlertTitle>{t('patient.profile.noFamilyHistoryRecorded', 'No Family History Recorded')}</AlertTitle>
                                <AlertDescription>{t('patient.profile.familyHistoryDescription', 'You can add relevant family medical history here.')}</AlertDescription>
                            </Alert>
                        )}
                    </TabsContent>

                    <TabsContent value="socialHistory" className="mt-4">
                        <h3 className="text-lg font-semibold mb-3">{t('patient.profile.socialHistoryTitle', 'Social History')}</h3>
                        {medicalRecordsData.socialHistory && medicalRecordsData.socialHistory.length > 0 ? (
                            <div className="grid gap-3">
                                {medicalRecordsData.socialHistory.map(item => (
                                    <Card key={item.id} className="p-4 bg-muted/50">
                                        <p className="font-medium text-foreground mb-1">{item.aspect}</p>
                                        <p className="text-sm text-muted-foreground">{t('patient.profile.details', 'Details')}: {item.details}</p>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Alert className="bg-blue-50 text-blue-800 border-blue-200" icon={<Info className="h-4 w-4" />}>
                                <AlertTitle>{t('patient.profile.noSocialHistoryRecorded', 'No Social History Recorded')}</AlertTitle>
                                <AlertDescription>{t('patient.profile.socialHistoryDescription', 'You can add your social history details here.')}</AlertDescription>
                            </Alert>
                        )}
                    </TabsContent>

                    <TabsContent value="generalHistory" className="mt-4">
                        <h3 className="text-lg font-semibold mb-3">{t('patient.profile.generalMedicalHistory', 'General Medical History')}</h3>
                        {medicalRecordsData.generalHistory && medicalRecordsData.generalHistory.length > 0 ? (
                            <div className="grid gap-3">
                                {medicalRecordsData.generalHistory.map(item => (
                                    <Card key={item.id} className="p-4 bg-muted/50">
                                        <p className="font-medium text-foreground mb-1">{item.question}</p>
                                        <p className="text-sm text-muted-foreground">{t('patient.profile.answer', 'Answer')}: {item.answer}</p>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Alert className="bg-blue-50 text-blue-800 border-blue-200" icon={<Info className="h-4 w-4" />}>
                                <AlertTitle>{t('patient.profile.noGeneralHistoryRecorded', 'No General History Recorded')}</AlertTitle>
                                <AlertDescription>{t('patient.profile.generalHistoryDescription', 'You can add general medical history questions and answers here.')}</AlertDescription>
                            </Alert>
                        )}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );

    const renderContent = () => {
        if (loading) {
            return (
                <div className="min-h-[400px] flex items-center justify-center">
                    <LoadingSpinner />
                </div>
            );
        }

        if (error) {
            return (
                <div className="min-h-[400px] flex items-center justify-center">
                    <ErrorState message={error} onRetry={handleRefresh} />
                </div>
            );
        }

        return (
            <>
                {activeTab === 'personal' && renderPersonalInfo()}
                {activeTab === 'emergency' && renderEmergencyContact()}
                {activeTab === 'insurance' && renderInsuranceInfo()}
                {activeTab === 'medical' && renderMedicalFile()}
            </>
        );
    };

    return (
        <div className="relative min-h-screen w-full overflow-x-hidden">
            <div className={gradientBg} />
            <div className="flex flex-col items-center w-full">
                <div className="w-full max-w-screen-2xl px-2 sm:px-6 md:px-10 py-8">
                    <div className={`${glassCard} ${fadeIn} p-6 flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 w-full`}>
                        <div className="flex flex-col items-center md:items-start gap-4 w-full md:w-1/3">
                            <Avatar className={`h-32 w-32 border-4 border-primary shadow-xl ${avatarHover}`}> 
                                <AvatarImage src={medicalRecords?.profile?.profilePicture || '/images/default-avatar.png'} alt="Profile Picture" />
                                <AvatarFallback className="bg-primary/10 text-primary text-5xl font-semibold">
                                    {medicalRecords?.profile?.firstName.charAt(0)}{medicalRecords?.profile?.lastName.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="text-center md:text-left">
                                <h1 className="text-3xl font-bold text-foreground mb-1">
                                    {medicalRecords?.profile?.firstName} {medicalRecords?.profile?.lastName}
                                </h1>
                                <p className="text-muted-foreground text-lg">{medicalRecords?.profile?.email}</p>
                                <div className="flex gap-2 justify-center md:justify-start mt-2">
                                    <Badge className="bg-muted text-foreground px-3 py-1 rounded-full text-xs font-semibold">Patient</Badge>
                                    <span className="flex items-center gap-1 text-success text-xs font-semibold">
                                        <Check className="h-4 w-4" /> Active
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 w-full md:w-2/3 justify-between">
                            <div className="flex flex-wrap gap-3 justify-center md:justify-end">
                                <Button
                                    variant="outline"
                                    onClick={handleRefresh}
                                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground flex items-center gap-2 rounded-full shadow"
                                    aria-label={t('patient.profile.refresh', 'Refresh')}
                                >
                                    <RefreshCcw className="w-5 h-5" />
                                    {t('patient.profile.refresh', 'Refresh')}
                                </Button>
                                <Button
                                    variant={isEditing ? "destructive" : "default"}
                                    onClick={() => setIsEditing(!isEditing)}
                                    className={`flex items-center gap-2 border-primary rounded-full shadow ${isEditing ? '' : 'bg-primary text-white hover:bg-primary/90'}`}
                                    disabled={saving}
                                    aria-label={isEditing ? t('patient.profile.cancel', 'Cancel') : t('patient.profile.editProfile', 'Edit Profile')}
                                >
                                    {isEditing ? (
                                        <>
                                            <X className="w-5 h-5" />
                                            {t('patient.profile.cancel', 'Cancel')}
                                        </>
                                    ) : (
                                        <>
                                            <Edit className="w-5 h-5" />
                                            {t('patient.profile.editProfile', 'Edit Profile')}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className={`${glassCard} ${fadeIn} p-4 mb-8 w-full`}>
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className={`grid w-full grid-cols-4 gap-2 bg-blue-50 rounded-xl p-1 ${stickyTabs}`}> 
                                <Tooltip content={t('patient.profile.tabs.personal', 'Personal Info')}>
                                    <TabsTrigger
                                        value="personal"
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground focus:ring-2 focus:ring-primary"
                                    >
                                        <User className="h-5 w-5" />
                                        {t('patient.profile.tabs.personal', 'Personal Info')}
                                    </TabsTrigger>
                                </Tooltip>
                                <Tooltip content={t('patient.profile.tabs.emergency', 'Emergency Contact')}>
                                    <TabsTrigger
                                        value="emergency"
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground focus:ring-2 focus:ring-primary"
                                    >
                                        <Bell className="h-5 w-5" />
                                        {t('patient.profile.tabs.emergency', 'Emergency Contact')}
                                    </TabsTrigger>
                                </Tooltip>
                                <Tooltip content={t('patient.profile.tabs.insurance', 'Insurance')}>
                                    <TabsTrigger
                                        value="insurance"
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground focus:ring-2 focus:ring-primary"
                                    >
                                        <CreditCard className="h-5 w-5" />
                                        {t('patient.profile.tabs.insurance', 'Insurance')}
                                    </TabsTrigger>
                                </Tooltip>
                                <Tooltip content={t('patient.profile.tabs.medical', 'Medical File')}>
                                    <TabsTrigger
                                        value="medical"
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground focus:ring-2 focus:ring-primary"
                                    >
                                        <FileText className="h-5 w-5" />
                                        {t('patient.profile.tabs.medical', 'Medical File')}
                                    </TabsTrigger>
                                </Tooltip>
                            </TabsList>
                        </Tabs>
                    </div>

                    <div className={`${glassCard} ${fadeIn} p-6 border border-border w-full`}>
                        {renderContent()}
                    </div>
                </div>
            </div>

            <Dialog open={pdfDialogOpen} onOpenChange={setPdfDialogOpen}>
                <DialogContent className="sm:max-w-[800px] h-[90vh] flex flex-col p-4">
                    <DialogHeader className="pb-2">
                        <DialogTitle className="text-xl font-bold">{selectedPdf?.title || t('patient.profile.document', 'Document')}</DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 flex flex-col items-center justify-center overflow-hidden bg-muted/20 rounded-md">
                        {selectedPdf?.url ? (
                            <ScrollArea className="w-full h-full p-4">
                                <Document
                                    file={selectedPdf.url}
                                    onLoadSuccess={onDocumentLoadSuccess}
                                    className="flex justify-center items-center"
                                >
                                    <Page pageNumber={pageNumber} scale={scale} renderTextLayer={false} renderAnnotationLayer={false} />
                                </Document>
                            </ScrollArea>
                        ) : (
                            <Alert variant="destructive" className="w-fit">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{t('patient.profile.documentUrlMissing', 'Document URL is missing.')}</AlertDescription>
                            </Alert>
                        )}
                    </div>
                    {numPages > 0 && (
                        <div className="flex justify-center items-center gap-2 pt-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => changePage(-1)}
                                disabled={pageNumber <= 1}
                            >
                                {t('patient.profile.previous', 'Previous')}
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                {t('patient.profile.page', 'Page')} {pageNumber} {t('patient.profile.of', 'of')} {numPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => changePage(1)}
                                disabled={pageNumber >= numPages}
                            >
                                {t('patient.profile.next', 'Next')}
                            </Button>
                        </div>
                    )}
                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={handlePdfClose}>{t('patient.profile.close', 'Close')}</Button>
                        {selectedPdf?.url && (
                            <Button asChild>
                                <a href={selectedPdf.url} download={selectedPdf.title || 'document.pdf'}>
                                    <span className="flex items-center gap-2">
                                        <Download className="h-4 w-4" /> {t('patient.profile.download', 'Download')}
                                    </span>
                                </a>
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AddAllergyDialog
                open={allergyDialogOpen}
                onClose={() => setAllergyDialogOpen(false)}
                onAdd={(newAllergy) => handleMedicalRecordAdd('allergies', newAllergy)}
            />

            <AddChronicConditionDialog
                open={chronicConditionDialogOpen}
                onClose={() => setChronicConditionDialogOpen(false)}
                onAdd={(newCondition) => handleMedicalRecordAdd('chronicConditions', newCondition)}
            />

            <AddMedicationDialog
                open={medicationDialogOpen}
                onClose={() => setMedicationDialogOpen(false)}
                onAdd={(newMedication) => handleMedicalRecordAdd('medications', newMedication)}
            />
        </div>
    );
};

const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
);

export default ProfilePage;

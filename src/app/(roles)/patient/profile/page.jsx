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
import { fetchProfile } from '@/store/slices/patient/profileSlice';
import DicomViewer from '@/components/medical/DicomViewer';

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
        dispatch(fetchProfile());
    }, [dispatch]);

    const { profile, loading, error } = useSelector(state => state.profile);

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
    const [dicomDialogOpen, setDicomDialogOpen] = useState(false);
    const [selectedDicomImages, setSelectedDicomImages] = useState([]);
    const [dicomImageIndex, setDicomImageIndex] = useState(0);
    
    useEffect(() => {
        if (!initializedProfileData.current) {
            if (!loading && !error && profile) {
                setFormData({
                    firstName: profile.user?.firstName || '',
                    lastName: profile.user?.lastName || '',
                    email: profile.user?.email || '',
                    phone: profile.user?.phoneNumber || '',
                    address: profile.user?.address || '',
                    dateOfBirth: profile.user?.dateOfBirth ? new Date(profile.user.dateOfBirth) : null,
                });
                setEmergencyContactData(
                    Array.isArray(profile.emergencyContacts) && profile.emergencyContacts.length > 0
                        ? {
                            name: profile.emergencyContacts[0].name || '',
                            relationship: profile.emergencyContacts[0].relationship || '',
                            phone: profile.emergencyContacts[0].phoneNumber || '',
                            email: profile.emergencyContacts[0].email || '',
                        }
                        : { name: '', relationship: '', phone: '', email: '' }
                );
                setInsuranceData(profile.insurance || {
                    provider: '',
                    policyNumber: '',
                    groupNumber: '',
                    expiryDate: null,
                });
                setMedicalRecordsData({
                    ...profile.medicalFile,
                    allergies: (profile.medicalFile?.allergies?.length ? profile.medicalFile.allergies : profile.allergies) || [],
                    chronicConditions: (profile.medicalFile?.chronicConditions?.length ? profile.medicalFile.chronicConditions : profile.chronicConditions) || [],
                    medications: (profile.medicalFile?.medications?.length ? profile.medicalFile.medications : profile.medications) || [],
                    vitalSigns: profile.medicalFile?.vitalSigns || [],
                    labResults: profile.medicalFile?.labResults || [],
                    imagingReports: profile.medicalFile?.imagingReports || [],
                    immunizations: profile.medicalFile?.immunizations || [],
                    surgicalHistory: profile.medicalFile?.surgicalHistory || [],
                    documents: profile.medicalFile?.attachedDocuments || [],
                    diagnoses: profile.medicalFile?.diagnoses || [],
                    familyHistory: profile.medicalFile?.familyMedicalHistory || [],
                    generalHistory: profile.medicalFile?.generalMedicalHistory || [],
                    socialHistory: profile.medicalFile?.socialHistory || [],
                });
                initializedProfileData.current = true;
            }
        }
    }, [loading, error, profile]);

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
                    <AvatarImage src={profile?.profilePicture || '/images/default-avatar.png'} alt="Profile Picture" />
                    <AvatarFallback className="bg-primary/10 text-primary text-5xl font-semibold">
                        {(profile?.user?.firstName ? profile.user.firstName.charAt(0) : '')}{(profile?.user?.lastName ? profile.user.lastName.charAt(0) : '')}
                    </AvatarFallback>
                </Avatar>
                <div className="text-center md:text-left">
                    <h1 className="text-3xl font-bold text-foreground mb-1">
                        {profile?.user?.firstName || ''} {profile?.user?.lastName || ''}
                    </h1>
                    <p className="text-muted-foreground text-lg">{profile?.user?.email || ''}</p>
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
                                    {formData.dateOfBirth && !isNaN(new Date(formData.dateOfBirth).getTime()) ? format(new Date(formData.dateOfBirth), "PPP") : ''}
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
                                    {insuranceData.expiryDate && !isNaN(new Date(insuranceData.expiryDate).getTime()) ? format(new Date(insuranceData.expiryDate), "PPP") : ''}
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
                                    <Card key={vital._id || vital.id} className="bg-muted/50 w-full min-w-0">
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <HeartPulse className="h-5 w-5 text-primary" />
                                                <p className="font-medium text-foreground">{t('patient.profile.vitalSigns', 'Vital Signs')}</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-xs">
                                                {vital.bloodPressure && <div><span className="font-semibold">BP:</span> {vital.bloodPressure}</div>}
                                                {vital.heartRate && <div><span className="font-semibold">HR:</span> {vital.heartRate} bpm</div>}
                                                {vital.temperature && <div><span className="font-semibold">Temp:</span> {vital.temperature}°C</div>}
                                                {vital.weight && <div><span className="font-semibold">Weight:</span> {vital.weight} kg</div>}
                                                {vital.height && <div><span className="font-semibold">Height:</span> {vital.height} cm</div>}
                                                {vital.bmi && <div><span className="font-semibold">BMI:</span> {vital.bmi}</div>}
                                                {vital.oxygenSaturation && <div><span className="font-semibold">O2 Sat:</span> {vital.oxygenSaturation}%</div>}
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-2">{t('patient.profile.date', 'Date')}: {vital.date && !isNaN(new Date(vital.date).getTime()) ? format(new Date(vital.date), 'PPP') : ''}</p>
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
                            <Button size="sm" variant="default" className="bg-primary text-foreground" onClick={() => setAllergyDialogOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" /> {t('patient.profile.addAllergy', 'Add Allergy')}
                            </Button>
                        </div>
                        {medicalRecordsData.allergies && medicalRecordsData.allergies.length > 0 ? (
                            <div className="grid gap-3">
                                {medicalRecordsData.allergies.map(allergy => (
                                    <Card key={allergy._id || allergy.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-muted/50 gap-2">
                                        <div className="flex items-center gap-3">
                                            <DropletIcon className="h-5 w-5 text-destructive" />
                                            <div>
                                                <p className="font-medium text-foreground flex items-center gap-2">
                                                    {allergy.name}
                                                    {allergy.severity && (
                                                        <Badge className={`ml-2 ${allergy.severity === 'severe' ? 'bg-destructive text-white' : allergy.severity === 'moderate' ? 'bg-orange-200 text-orange-900' : 'bg-yellow-100 text-yellow-900'}`}>{allergy.severity}</Badge>
                                                    )}
                                                </p>
                                                {allergy.reaction && <p className="text-xs text-muted-foreground mt-1">{t('patient.profile.reaction', 'Reaction')}: {allergy.reaction}</p>}
                                                {allergy.notes && <p className="text-xs text-muted-foreground mt-1">{t('patient.profile.notes', 'Notes')}: {allergy.notes}</p>}
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={() => handleMedicalRecordDelete('allergies', allergy._id || allergy.id)} className="text-muted-foreground hover:text-destructive">
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
                                    <Card key={condition._id || condition.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-muted/50 gap-2">
                                        <div className="flex items-center gap-3">
                                            <Stethoscope className="h-5 w-5 text-primary" />
                                            <div>
                                                <p className="font-medium text-foreground flex items-center gap-2">
                                                    {condition.name}
                                                    {condition.status && (
                                                        <Badge className={`ml-2 ${condition.status === 'active' ? 'bg-primary text-white' : condition.status === 'resolved' ? 'bg-green-200 text-green-900' : 'bg-muted text-muted-foreground'}`}>{condition.status}</Badge>
                                                    )}
                                                </p>
                                                <p className="text-sm text-muted-foreground">{t('patient.profile.diagnosedOn', 'Diagnosed on')} {condition.diagnosisDate && !isNaN(new Date(condition.diagnosisDate).getTime()) ? format(new Date(condition.diagnosisDate), 'PPP') : ''}</p>
                                                {condition.notes && <p className="text-xs text-muted-foreground mt-1">{t('patient.profile.notes', 'Notes')}: {condition.notes}</p>}
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={() => handleMedicalRecordDelete('chronicConditions', condition._id || condition.id)} className="text-muted-foreground hover:text-destructive">
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
                                    <Card key={diagnosis._id || diagnosis.id} className="p-4 bg-muted/50">
                                        <p className="font-medium text-foreground mb-1">{diagnosis.name}</p>
                                        <p className="text-sm text-muted-foreground">{t('patient.profile.diagnosedBy', 'Diagnosed by')} {diagnosis.doctor} {t('patient.profile.on', 'on')} {diagnosis.date && !isNaN(new Date(diagnosis.date).getTime()) ? format(new Date(diagnosis.date), 'PPP') : ''}</p>
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
                                    <Card key={result._id || result.id} className="p-4 bg-muted/50">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <BarChart3 className="h-5 w-5 text-primary" />
                                                <span className="font-medium text-foreground">{result.testName}</span>
                                                {result.labName && <span className="ml-2 text-xs text-muted-foreground">{result.labName}</span>}
                                            </div>
                                            <p className="text-sm text-muted-foreground">{t('patient.profile.date', 'Date')}: {result.date && !isNaN(new Date(result.date).getTime()) ? format(new Date(result.date), 'PPP') : ''}</p>
                                            {result.normalRange && <p className="text-xs text-muted-foreground">{t('patient.profile.normalRange', 'Normal Range')}: {result.normalRange}</p>}
                                            {result.unit && <p className="text-xs text-muted-foreground">{t('patient.profile.unit', 'Unit')}: {result.unit}</p>}
                                            {result.results && typeof result.results === 'object' && (
                                                <div className="mt-2">
                                                    <table className="min-w-[200px] text-xs border rounded">
                                                        <thead><tr><th className="px-2 py-1">Test</th><th className="px-2 py-1">Value</th></tr></thead>
                                                        <tbody>
                                                            {Object.entries(result.results).map(([key, value]) => (
                                                                <tr key={key}><td className="px-2 py-1 font-semibold">{key}</td><td className="px-2 py-1">{value}</td></tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                            {result.pdfUrl && (
                                                <Button variant="outline" className="text-primary border-primary mt-2 ml-2" size="sm" onClick={() => handlePdfOpen({ url: result.pdfUrl, title: result.testName })}>
                                                    <FileText className="h-4 w-4 mr-2" /> PDF
                                                </Button>
                                            )}
                                            {result.documents && Array.isArray(result.documents) && result.documents.length > 0 && result.documents.map((doc, i) => (
                                                doc.endsWith('.pdf') && (
                                                    <Button key={i} variant="outline" className="text-primary border-primary mt-2 ml-2" size="sm" onClick={() => handlePdfOpen({ url: doc, title: result.testName })}>
                                                        <FileText className="h-4 w-4 mr-2" /> PDF
                                                    </Button>
                                                )
                                            ))}
                                        </div>
                                        <Button variant="outline" className="text-primary border-primary mt-2" size="sm" onClick={() => handlePdfOpen(result)}>
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
                                    <Card key={report._id || report.id} className="p-4 bg-muted/50">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <FileImage className="h-5 w-5 text-primary" />
                                                <span className="font-medium text-foreground">{report.type}</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{t('patient.profile.date', 'Date')}: {report.date && !isNaN(new Date(report.date).getTime()) ? format(new Date(report.date), 'PPP') : ''}</p>
                                            {report.images && report.images.length > 0 ? (
                                                <div className="flex flex-col gap-4 mt-2">
                                                    <div className="w-full font-semibold text-xs mb-1">DICOM Viewer</div>
                                                    <DicomViewer imageUrls={report.images.map(img => img.src || img)} />
                                                </div>
                                            ) : (
                                                <div className="text-xs text-muted-foreground mt-2">{t('patient.profile.noImages', 'No images available')}</div>
                                            )}
                                        </div>
                                        <Button variant="outline" size="sm" className="text-primary border-primary mt-2" onClick={() => {
                                            setSelectedDicomImages((report.images || []).map(img => img.src || img));
                                            setDicomImageIndex(0);
                                            setDicomDialogOpen(true);
                                        }}>
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
                            <Button size="sm" className="text-primary border-primary" onClick={() => setMedicationDialogOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" /> {t('patient.profile.addMedication', 'Add Medication')}
                            </Button>
                        </div>
                        {medicalRecordsData.medications && medicalRecordsData.medications.length > 0 ? (
                            <div className="grid gap-3">
                                {medicalRecordsData.medications.map(med => (
                                    <Card key={med._id || med.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-muted/50 gap-2">
                                        <div className="flex items-center gap-3">
                                            <Pill className="h-5 w-5 text-primary" />
                                            <div>
                                                <p className="font-medium text-foreground flex items-center gap-2">{med.name} <span className="text-xs text-muted-foreground">{med.dosage}</span></p>
                                                <p className="text-sm text-muted-foreground">{t('patient.profile.frequency', 'Frequency')}: {med.frequency}</p>
                                                <p className="text-sm text-muted-foreground">{t('patient.profile.status', 'Status')}: {med.status}</p>
                                                <p className="text-sm text-muted-foreground">{t('patient.profile.startDate', 'Start')}: {med.startDate && !isNaN(new Date(med.startDate).getTime()) ? format(new Date(med.startDate), 'PPP') : ''} | {t('patient.profile.endDate', 'End')}: {med.endDate && !isNaN(new Date(med.endDate).getTime()) ? format(new Date(med.endDate), 'PPP') : ''}</p>
                                                {med.notes && <p className="text-xs text-muted-foreground mt-1">{t('patient.profile.notes', 'Notes')}: {med.notes}</p>}
                                                {med.prescribedBy && <p className="text-xs text-muted-foreground mt-1">{t('patient.profile.prescribedBy', 'Prescribed by')}: {med.prescribedBy}</p>}
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={() => handleMedicalRecordDelete('medications', med._id || med.id)} className="text-muted-foreground hover:text-destructive">
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
                                    <Card key={imm._id || imm.id} className="p-4 bg-muted/50">
                                        <p className="font-medium text-foreground mb-1">{imm.name}</p>
                                        <p className="text-sm text-muted-foreground">{t('patient.profile.date', 'Date')}: {imm.date && !isNaN(new Date(imm.date).getTime()) ? format(new Date(imm.date), 'PPP') : ''} - {t('patient.profile.administeredBy', 'Administered by')} {imm.administeredBy}</p>
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
                                    <Card key={surgery._id || surgery.id} className="p-4 bg-muted/50">
                                        <p className="font-medium text-foreground mb-1">{surgery.procedure}</p>
                                        <p className="text-sm text-muted-foreground">{t('patient.profile.date', 'Date')}: {surgery.date && !isNaN(new Date(surgery.date).getTime()) ? format(new Date(surgery.date), 'PPP') : ''} - {t('patient.profile.hospital', 'Hospital')}: {surgery.hospital}</p>
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
                                    <Card key={doc._id || doc.id} className="flex items-center justify-between p-4 bg-muted/50">
                                        <div className="flex items-center gap-3">
                                            <FileText className="h-5 w-5 text-primary" />
                                            <div>
                                                <p className="font-medium text-foreground">{doc.title}</p>
                                                <p className="text-sm text-muted-foreground">{t('patient.profile.type', 'Type')}: {doc.type} - {t('patient.profile.date', 'Date')}: {doc.date && !isNaN(new Date(doc.date).getTime()) ? format(new Date(doc.date), 'PPP') : ''}</p>
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
                                    <Card key={item._id || item.id} className="p-4 bg-muted/50">
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
                                    <Card key={item._id || item.id} className="p-4 bg-muted/50">
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
                                    <Card key={item._id || item.id} className="p-4 bg-muted/50">
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
                    <ErrorState message={typeof error === 'string' ? error : error?.message || 'An error occurred.'} onRetry={handleRefresh} />
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
                                <AvatarImage src={profile?.profilePicture || '/images/default-avatar.png'} alt="Profile Picture" />
                                <AvatarFallback className="bg-primary/10 text-primary text-5xl font-semibold">
                                    {(profile?.user?.firstName ? profile.user.firstName.charAt(0) : '')}{(profile?.user?.lastName ? profile.user.lastName.charAt(0) : '')}
                                </AvatarFallback>
                            </Avatar>
                            <div className="text-center md:text-left">
                                <h1 className="text-3xl font-bold text-foreground mb-1">
                                    {profile?.user?.firstName || ''} {profile?.user?.lastName || ''}
                                </h1>
                                <p className="text-muted-foreground text-lg">{profile?.user?.email || ''}</p>
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
                                <TabsTrigger value="personal"><span>{t('patient.profile.tabs.personal', 'Personal Info')}</span></TabsTrigger>
                                <TabsTrigger value="emergency"><span>{t('patient.profile.tabs.emergency', 'Emergency Contact')}</span></TabsTrigger>
                                <TabsTrigger value="insurance"><span>{t('patient.profile.tabs.insurance', 'Insurance')}</span></TabsTrigger>
                                <TabsTrigger value="medical"><span>{t('patient.profile.tabs.medical', 'Medical File')}</span></TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                    <div className={`${glassCard} ${fadeIn} p-6 border border-border w-full`}>
                        {renderContent()}
                    </div>
                </div>
            </div>
            {pdfDialogOpen && selectedPdf && (
                <Dialog open={pdfDialogOpen} onOpenChange={handlePdfClose}>
                    <DialogContent className="max-w-3xl w-full">
                        <DialogHeader>
                            <DialogTitle>{selectedPdf.title || t('patient.profile.labResultPdf', 'Lab Result PDF')}</DialogTitle>
                        </DialogHeader>
                        <div className="w-full flex flex-col items-center">
                            <Document file={selectedPdf.url} onLoadSuccess={onDocumentLoadSuccess} loading={<LoadingSpinner />}>
                                <Page pageNumber={pageNumber} width={600} />
                            </Document>
                            {numPages > 1 && (
                                <div className="flex gap-2 mt-2">
                                    <Button onClick={previousPage} disabled={pageNumber <= 1}>Previous</Button>
                                    <span>{pageNumber} / {numPages}</span>
                                    <Button onClick={nextPage} disabled={pageNumber >= numPages}>Next</Button>
                                </div>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            )}
            {dicomDialogOpen && selectedDicomImages.length > 0 && (
                <Dialog open={dicomDialogOpen} onOpenChange={setDicomDialogOpen}>
                    <DialogContent className="max-w-3xl w-full">
                        <DialogHeader>
                            <DialogTitle>DICOM Viewer</DialogTitle>
                        </DialogHeader>
                        <div className="w-full flex flex-col items-center">
                            <DicomViewer imageUrls={selectedDicomImages} />
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}

const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
);

export default ProfilePage;
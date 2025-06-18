'use client';
import React, { useState, useEffect, useRef } from 'react';
import {
    User, Mail, Phone, Home, CalendarDays, FileText, HeartPulse,
    DropletIcon, Edit, Save, X, AlertCircle, Check, MapPin,
    Shield, Stethoscope, Pill, Clock, BarChart3, ChevronRight,
    History, FileImage, Download, FilePlus2, RefreshCcw,
    Camera, Bell, Lock, CreditCard,
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
import { Alert, AlertDescription } from '@/components/ui/Alert';
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
import { mockPatientData } from '@/mockdata/patientData';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover';
import { Calendar } from '@/components/ui/Calendar';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/ScrollArea';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

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
    const [medicalRecordsData, setMedicalRecordsData] = useState(mockPatientData.medicalRecords || {});
    const initializedProfileData = useRef(false);
    const [medicalTabValue, setMedicalTabValue] = useState('vitalSigns');

    const medicalRecordCategories = [
        { id: 'vitalSigns', label: 'Vital Signs', icon: HeartPulse },
        { id: 'allergies', label: 'Allergies', icon: DropletIcon },
        { id: 'chronicConditions', label: 'Chronic Conditions', icon: Stethoscope },
        { id: 'diagnoses', label: 'Diagnoses', icon: HeartPulse },
        { id: 'labResults', label: 'Lab Results', icon: BarChart3 },
        { id: 'imagingReports', label: 'Imaging Reports', icon: FileImage },
        { id: 'medications', label: 'Medications', icon: Pill },
        { id: 'immunizations', label: 'Immunizations', icon: Shield },
        { id: 'surgicalHistory', label: 'Surgical History', icon: History },
        { id: 'documents', label: 'Documents', icon: FileText },
        { id: 'familyHistory', label: 'Family History', icon: User },
        { id: 'socialHistory', label: 'Social History', icon: Home },
        { id: 'generalHistory', label: 'General History', icon: CalendarDays },
    ];

    const [pdfDialogOpen, setPdfDialogOpen] = useState(false);
    const [selectedPdf, setSelectedPdf] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.2);
    
    const isLoading = false; // Replace with actual loading state from API
    const apiError = null;   // Replace with actual error state from API

    useEffect(() => {
        if (!initializedProfileData.current) {
            if (!isLoading && !apiError && mockPatientData.profile) {
                setFormData({
                    firstName: mockPatientData.profile.firstName || '',
                    lastName: mockPatientData.profile.lastName || '',
                    email: mockPatientData.profile.email || '',
                    phone: mockPatientData.profile.phone || '',
                    address: mockPatientData.profile.address || '',
                    dateOfBirth: mockPatientData.profile.dateOfBirth ? new Date(mockPatientData.profile.dateOfBirth) : null,
                });
                setEmergencyContactData(mockPatientData.profile.emergencyContact || {
                    name: '',
                    relationship: '',
                    phone: '',
                    email: '',
                });
                setInsuranceData(mockPatientData.profile.insuranceDetails || {
                    provider: '',
                    policyNumber: '',
                    groupNumber: '',
                    expiryDate: null,
                });
                setMedicalRecordsData(mockPatientData.medicalRecords || {});
                initializedProfileData.current = true;
            }
        }
    }, [isLoading, apiError, mockPatientData]);

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

    const handleSave = async () => {
        if (!isFormValid()) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        setSaving(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            showNotification('Profile updated successfully', 'success');
            setIsEditing(false);
        } catch (error) {
            showNotification(error.message || 'Failed to update profile', 'error');
        } finally {
            setSaving(false);
        }
    };

    const isFormValid = () => {
        return formData.firstName && formData.lastName && formData.email && formData.phone;
    };

    const getStatusText = (loadingState, errorState) => {
        if (loadingState) return 'Loading...';
        if (errorState) return 'Error loading data';
        return '';
    };

    const handleMedicalTabChange = (newValue) => {
        setMedicalTabValue(newValue);
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
                <Avatar className="h-24 w-24">
                    <AvatarImage src={mockPatientData.profile.profilePicture || '/images/default-avatar.png'} alt="Profile Picture" />
                    <AvatarFallback className="bg-primary/10 text-primary text-4xl font-semibold">
                        {mockPatientData.profile.firstName.charAt(0)}{mockPatientData.profile.lastName.charAt(0)}
                    </AvatarFallback>
                </Avatar>
                <div className="text-center sm:text-left">
                    <h1 className="text-2xl font-bold text-foreground">
                        {mockPatientData.profile.firstName} {mockPatientData.profile.lastName}
                    </h1>
                    <p className="text-muted-foreground">{mockPatientData.profile.email}</p>
                </div>
            </div>
            <div className="flex gap-3">
                <Button
                    variant="outline"
                    onClick={handleRefresh}
                    className="flex items-center gap-2"
                >
                    <RefreshCcw className="w-4 h-4" />
                    Refresh
                </Button>
                <Button
                    variant={isEditing ? "destructive" : "default"}
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-2"
                    disabled={saving}
                >
                    {isEditing ? (
                        <>
                            <X className="w-4 h-4" />
                            Cancel
                        </>
                    ) : (
                        <>
                            <Edit className="w-4 h-4" />
                            Edit Profile
                        </>
                    )}
                </Button>
            </div>
        </div>
    );

    const renderPersonalInfo = () => (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" /> Personal Information
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
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
                        <Label htmlFor="lastName">Last Name</Label>
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
                        <Label htmlFor="email">Email</Label>
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
                        <Label htmlFor="phone">Phone</Label>
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
                        <Label htmlFor="address">Address</Label>
                        <Input
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            disabled={!isEditing || saving}
                        />
                    </div>
                    <div className="space-y-2 col-span-1 md:col-span-2">
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Popover>
                            <PopoverTrigger asChild disabled={!isEditing || saving}>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !formData.dateOfBirth && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {formData.dateOfBirth ? format(formData.dateOfBirth, "PPP") : <span>Pick a date</span>}
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
                    <div className="flex justify-end pt-4 border-t">
                        <Button onClick={handleSave} disabled={saving}>
                            {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );

    const renderEmergencyContact = () => (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" /> Emergency Contact
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="ec_name">Name</Label>
                        <Input
                            id="ec_name"
                            name="name"
                            value={emergencyContactData.name}
                            onChange={handleEmergencyContactChange}
                            disabled={!isEditing || saving}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="ec_relationship">Relationship</Label>
                        <Input
                            id="ec_relationship"
                            name="relationship"
                            value={emergencyContactData.relationship}
                            onChange={handleEmergencyContactChange}
                            disabled={!isEditing || saving}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="ec_phone">Phone</Label>
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
                        <Label htmlFor="ec_email">Email</Label>
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
                            {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );

    const renderInsuranceInfo = () => (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" /> Insurance Information
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="ins_provider">Provider</Label>
                        <Input
                            id="ins_provider"
                            name="provider"
                            value={insuranceData.provider}
                            onChange={handleInsuranceChange}
                            disabled={!isEditing || saving}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="ins_policyNumber">Policy Number</Label>
                        <Input
                            id="ins_policyNumber"
                            name="policyNumber"
                            value={insuranceData.policyNumber}
                            onChange={handleInsuranceChange}
                            disabled={!isEditing || saving}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="ins_groupNumber">Group Number</Label>
                        <Input
                            id="ins_groupNumber"
                            name="groupNumber"
                            value={insuranceData.groupNumber}
                            onChange={handleInsuranceChange}
                            disabled={!isEditing || saving}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="ins_expiryDate">Expiry Date</Label>
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
                                    {insuranceData.expiryDate ? format(insuranceData.expiryDate, "PPP") : <span>Pick a date</span>}
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
                        <Button onClick={handleSave} disabled={saving}>
                            {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );

    const renderMedicalFile = () => (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" /> Medical File
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <Tabs value={medicalTabValue} onValueChange={setMedicalTabValue} className="w-full">
                    <ScrollArea className="w-full whitespace-nowrap pb-4">
                        <TabsList className="inline-flex h-auto p-1 text-muted-foreground rounded-md bg-muted justify-start">
                            {medicalRecordCategories.map(category => (
                                <TabsTrigger
                                    key={category.id}
                                    value={category.id}
                                    className="px-3 py-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                                >
                                    <category.icon className="h-4 w-4 mr-2" />
                                    {category.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>

                    {/* Vital Signs */}
                    <TabsContent value="vitalSigns" className="mt-4">
                        <h3 className="text-lg font-semibold mb-3">Recent Vital Signs</h3>
                        {medicalRecordsData.vitalSigns && medicalRecordsData.vitalSigns.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {medicalRecordsData.vitalSigns.map(vital => (
                                    <Card key={vital.id} className="bg-muted/50">
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
                                <AlertTitle>No Vital Signs Recorded</AlertTitle>
                                <AlertDescription>Your recent vital signs will appear here.</AlertDescription>
                            </Alert>
                        )}
                    </TabsContent>

                    {/* Allergies */}
                    <TabsContent value="allergies" className="mt-4">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-semibold">My Allergies</h3>
                            <Button size="sm" onClick={() => setAllergyDialogOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" /> Add Allergy
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
                                                <p className="text-sm text-muted-foreground">Severity: {allergy.severity}</p>
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
                                <AlertTitle>No Allergies Recorded</AlertTitle>
                                <AlertDescription>You can add your allergies here.</AlertDescription>
                            </Alert>
                        )}
                    </TabsContent>

                    {/* Chronic Conditions */}
                    <TabsContent value="chronicConditions" className="mt-4">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-semibold">Chronic Conditions</h3>
                            <Button size="sm" onClick={() => setChronicConditionDialogOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" /> Add Condition
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
                                                <p className="text-sm text-muted-foreground">Diagnosed on {format(new Date(condition.diagnosedDate), 'PPP')}</p>
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
                                <AlertTitle>No Chronic Conditions Recorded</AlertTitle>
                                <AlertDescription>You can add your chronic conditions here.</AlertDescription>
                            </Alert>
                        )}
                    </TabsContent>

                    {/* Diagnoses */}
                    <TabsContent value="diagnoses" className="mt-4">
                        <h3 className="text-lg font-semibold mb-3">My Diagnoses</h3>
                        {medicalRecordsData.diagnoses && medicalRecordsData.diagnoses.length > 0 ? (
                            <div className="grid gap-3">
                                {medicalRecordsData.diagnoses.map(diagnosis => (
                                    <Card key={diagnosis.id} className="p-4 bg-muted/50">
                                        <p className="font-medium text-foreground mb-1">{diagnosis.name}</p>
                                        <p className="text-sm text-muted-foreground">Diagnosed by {diagnosis.doctor} on {format(new Date(diagnosis.date), 'PPP')}</p>
                                        {diagnosis.notes && <p className="text-xs text-muted-foreground mt-2">Notes: {diagnosis.notes}</p>}
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Alert className="bg-blue-50 text-blue-800 border-blue-200" icon={<Info className="h-4 w-4" />}>
                                <AlertTitle>No Diagnoses Recorded</AlertTitle>
                                <AlertDescription>Your medical diagnoses will appear here.</AlertDescription>
                            </Alert>
                        )}
                    </TabsContent>

                    {/* Lab Results */}
                    <TabsContent value="labResults" className="mt-4">
                        <h3 className="text-lg font-semibold mb-3">Lab Results</h3>
                        {medicalRecordsData.labResults && medicalRecordsData.labResults.length > 0 ? (
                            <div className="grid gap-3">
                                {medicalRecordsData.labResults.map(result => (
                                    <Card key={result.id} className="flex items-center justify-between p-4 bg-muted/50">
                                        <div className="flex items-center gap-3">
                                            <BarChart3 className="h-5 w-5 text-primary" />
                                            <div>
                                                <p className="font-medium text-foreground">{result.title}</p>
                                                <p className="text-sm text-muted-foreground">Date: {format(new Date(result.date), 'PPP')}</p>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm" onClick={() => handlePdfOpen(result)}>
                                            <Eye className="h-4 w-4 mr-2" /> View Report
                                        </Button>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Alert className="bg-blue-50 text-blue-800 border-blue-200" icon={<Info className="h-4 w-4" />}>
                                <AlertTitle>No Lab Results Available</AlertTitle>
                                <AlertDescription>Your lab test results will appear here.</AlertDescription>
                            </Alert>
                        )}
                    </TabsContent>

                    {/* Imaging Reports */}
                    <TabsContent value="imagingReports" className="mt-4">
                        <h3 className="text-lg font-semibold mb-3">Imaging Reports</h3>
                        {medicalRecordsData.imagingReports && medicalRecordsData.imagingReports.length > 0 ? (
                            <div className="grid gap-3">
                                {medicalRecordsData.imagingReports.map(report => (
                                    <Card key={report.id} className="flex items-center justify-between p-4 bg-muted/50">
                                        <div className="flex items-center gap-3">
                                            <FileImage className="h-5 w-5 text-primary" />
                                            <div>
                                                <p className="font-medium text-foreground">{report.title}</p>
                                                <p className="text-sm text-muted-foreground">Date: {format(new Date(report.date), 'PPP')}</p>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm" onClick={() => handlePdfOpen(report)}>
                                            <Eye className="h-4 w-4 mr-2" /> View Report
                                        </Button>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Alert className="bg-blue-50 text-blue-800 border-blue-200" icon={<Info className="h-4 w-4" />}>
                                <AlertTitle>No Imaging Reports Available</AlertTitle>
                                <AlertDescription>Your imaging reports (X-rays, MRIs, etc.) will appear here.</AlertDescription>
                            </Alert>
                        )}
                    </TabsContent>

                    {/* Medications */}
                    <TabsContent value="medications" className="mt-4">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-semibold">Current Medications</h3>
                            <Button size="sm" onClick={() => setMedicationDialogOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" /> Add Medication
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
                                                <p className="text-sm text-muted-foreground">Frequency: {med.frequency}</p>
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
                                <AlertTitle>No Medications Recorded</AlertTitle>
                                <AlertDescription>Your current and past medications will appear here.</AlertDescription>
                            </Alert>
                        )}
                    </TabsContent>

                    {/* Immunizations */}
                    <TabsContent value="immunizations" className="mt-4">
                        <h3 className="text-lg font-semibold mb-3">Immunizations History</h3>
                        {medicalRecordsData.immunizations && medicalRecordsData.immunizations.length > 0 ? (
                            <div className="grid gap-3">
                                {medicalRecordsData.immunizations.map(imm => (
                                    <Card key={imm.id} className="p-4 bg-muted/50">
                                        <p className="font-medium text-foreground mb-1">{imm.name}</p>
                                        <p className="text-sm text-muted-foreground">Date: {format(new Date(imm.date), 'PPP')} - Administered by {imm.administeredBy}</p>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Alert className="bg-blue-50 text-blue-800 border-blue-200" icon={<Info className="h-4 w-4" />}>
                                <AlertTitle>No Immunizations Recorded</AlertTitle>
                                <AlertDescription>Your immunization records will appear here.</AlertDescription>
                            </Alert>
                        )}
                    </TabsContent>

                    {/* Surgical History */}
                    <TabsContent value="surgicalHistory" className="mt-4">
                        <h3 className="text-lg font-semibold mb-3">Surgical History</h3>
                        {medicalRecordsData.surgicalHistory && medicalRecordsData.surgicalHistory.length > 0 ? (
                            <div className="grid gap-3">
                                {medicalRecordsData.surgicalHistory.map(surgery => (
                                    <Card key={surgery.id} className="p-4 bg-muted/50">
                                        <p className="font-medium text-foreground mb-1">{surgery.procedure}</p>
                                        <p className="text-sm text-muted-foreground">Date: {format(new Date(surgery.date), 'PPP')} - Hospital: {surgery.hospital}</p>
                                        {surgery.notes && <p className="text-xs text-muted-foreground mt-2">Notes: {surgery.notes}</p>}
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Alert className="bg-blue-50 text-blue-800 border-blue-200" icon={<Info className="h-4 w-4" />}>
                                <AlertTitle>No Surgical History Recorded</AlertTitle>
                                <AlertDescription>Your surgical history will appear here.</AlertDescription>
                            </Alert>
                        )}
                    </TabsContent>

                    {/* Documents */}
                    <TabsContent value="documents" className="mt-4">
                        <h3 className="text-lg font-semibold mb-3">My Documents</h3>
                        <div className="flex justify-between items-center mb-3">
                            <p className="text-muted-foreground text-sm">Upload and manage your medical documents.</p>
                            <Button size="sm" onClick={() => router.push('/patient/medical-records/upload')}>
                                <FilePlus2 className="h-4 w-4 mr-2" /> Upload Document
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
                                                <p className="text-sm text-muted-foreground">Type: {doc.type} - Date: {format(new Date(doc.date), 'PPP')}</p>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm" onClick={() => handlePdfOpen(doc)}>
                                            <Eye className="h-4 w-4 mr-2" /> View Document
                                        </Button>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Alert className="bg-blue-50 text-blue-800 border-blue-200" icon={<Info className="h-4 w-4" />}>
                                <AlertTitle>No Documents Uploaded</AlertTitle>
                                <AlertDescription>You can upload your medical documents here.</AlertDescription>
                            </Alert>
                        )}
                    </TabsContent>

                    {/* Family History */}
                    <TabsContent value="familyHistory" className="mt-4">
                        <h3 className="text-lg font-semibold mb-3">Family Medical History</h3>
                        {medicalRecordsData.familyHistory && medicalRecordsData.familyHistory.length > 0 ? (
                            <div className="grid gap-3">
                                {medicalRecordsData.familyHistory.map(item => (
                                    <Card key={item.id} className="p-4 bg-muted/50">
                                        <p className="font-medium text-foreground mb-1">{item.condition}</p>
                                        <p className="text-sm text-muted-foreground">Relationship: {item.relationship} - Notes: {item.notes}</p>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Alert className="bg-blue-50 text-blue-800 border-blue-200" icon={<Info className="h-4 w-4" />}>
                                <AlertTitle>No Family History Recorded</AlertTitle>
                                <AlertDescription>You can add relevant family medical history here.</AlertDescription>
                            </Alert>
                        )}
                    </TabsContent>

                    {/* Social History */}
                    <TabsContent value="socialHistory" className="mt-4">
                        <h3 className="text-lg font-semibold mb-3">Social History</h3>
                        {medicalRecordsData.socialHistory && medicalRecordsData.socialHistory.length > 0 ? (
                            <div className="grid gap-3">
                                {medicalRecordsData.socialHistory.map(item => (
                                    <Card key={item.id} className="p-4 bg-muted/50">
                                        <p className="font-medium text-foreground mb-1">{item.aspect}</p>
                                        <p className="text-sm text-muted-foreground">Details: {item.details}</p>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Alert className="bg-blue-50 text-blue-800 border-blue-200" icon={<Info className="h-4 w-4" />}>
                                <AlertTitle>No Social History Recorded</AlertTitle>
                                <AlertDescription>You can add your social history details here.</AlertDescription>
                            </Alert>
                        )}
                    </TabsContent>

                    {/* General History */}
                    <TabsContent value="generalHistory" className="mt-4">
                        <h3 className="text-lg font-semibold mb-3">General Medical History</h3>
                        {medicalRecordsData.generalHistory && medicalRecordsData.generalHistory.length > 0 ? (
                            <div className="grid gap-3">
                                {medicalRecordsData.generalHistory.map(item => (
                                    <Card key={item.id} className="p-4 bg-muted/50">
                                        <p className="font-medium text-foreground mb-1">{item.question}</p>
                                        <p className="text-sm text-muted-foreground">Answer: {item.answer}</p>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Alert className="bg-blue-50 text-blue-800 border-blue-200" icon={<Info className="h-4 w-4" />}>
                                <AlertTitle>No General History Recorded</AlertTitle>
                                <AlertDescription>You can add general medical history questions and answers here.</AlertDescription>
                            </Alert>
                        )}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="min-h-[400px] flex items-center justify-center">
                    <LoadingSpinner /> {/* Assuming a LoadingSpinner component exists */}
                </div>
            );
        }

        if (apiError) {
            return (
                <div className="min-h-[400px] flex items-center justify-center">
                    <ErrorState message={apiError} onRetry={handleRefresh} /> {/* Assuming an ErrorState component exists */}
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
        <div className="flex flex-col space-y-6">
            <PageHeader
                title="My Profile"
                description="Manage your personal information, emergency contacts, insurance, and medical records."
                breadcrumbs={[
                    { label: 'Patient', href: '/patient/dashboard' },
                    { label: 'Profile', href: '/patient/profile' }
                ]}
            />

            {renderProfileHeader()}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="personal">Personal Info</TabsTrigger>
                    <TabsTrigger value="emergency">Emergency Contact</TabsTrigger>
                    <TabsTrigger value="insurance">Insurance</TabsTrigger>
                    <TabsTrigger value="medical">Medical File</TabsTrigger>
                </TabsList>
            </Tabs>

            <Separator />

            {renderContent()}

            {/* PDF Viewer Dialog */}
            <Dialog open={pdfDialogOpen} onOpenChange={setPdfDialogOpen}>
                <DialogContent className="sm:max-w-[800px] h-[90vh] flex flex-col p-4">
                    <DialogHeader className="pb-2">
                        <DialogTitle className="text-xl font-bold">{selectedPdf?.title || 'Document'}</DialogTitle>
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
                                <AlertDescription>Document URL is missing.</AlertDescription>
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
                                Previous
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                Page {pageNumber} of {numPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => changePage(1)}
                                disabled={pageNumber >= numPages}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={handlePdfClose}>Close</Button>
                        {selectedPdf?.url && (
                            <Button asChild>
                                <a href={selectedPdf.url} download={selectedPdf.title || 'document.pdf'}>
                                    <Download className="h-4 w-4 mr-2" /> Download
                                </a>
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Allergy Dialog */}
            <AddAllergyDialog
                open={allergyDialogOpen}
                onClose={() => setAllergyDialogOpen(false)}
                onAdd={(newAllergy) => handleMedicalRecordAdd('allergies', newAllergy)}
            />

            {/* Add Chronic Condition Dialog */}
            <AddChronicConditionDialog
                open={chronicConditionDialogOpen}
                onClose={() => setChronicConditionDialogOpen(false)}
                onAdd={(newCondition) => handleMedicalRecordAdd('chronicConditions', newCondition)}
            />

            {/* Add Medication Dialog (for medical records tab) */}
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

const ErrorState = ({ message, onRetry }) => (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <AlertCircle className="h-16 w-16 text-destructive mb-4" />
        <h3 className="text-lg font-semibold text-destructive mb-2">Error Loading Data</h3>
        <p className="text-muted-foreground mb-4">{message || 'Something went wrong. Please try again.'}</p>
        <Button onClick={onRetry}>Retry</Button>
    </div>
);

export default ProfilePage;

'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import {
    User,
    Mail,
    Phone,
    Home,
    CalendarDays,
    FileText,
    HeartPulse,
    DropletIcon,
    Shield,
    Stethoscope,
    Pill,
    Clock,
    BarChart3,
    FileImage,
    History,
    MapPin,
    Star,
    Edit,
    MessageCircle,
    Printer,
    Share2,
    Plus,
    X,
    ChevronLeft,
    ChevronRight,
    Eye,
    Info,
    Trash2
} from 'lucide-react';
import { useNotification, NotificationProvider } from '@/components/ui/Notification';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchPatientById } from '@/store/slices/doctor/doctorPatientsSlice';
import PersonalInfo from '@/components/patient/sections/PersonalInfo';
import MedicalHistory from '@/components/doctor/patient/MedicalHistory';
import Medications from '@/components/patient/sections/Medications';
import Appointments from '@/components/patient/sections/Appointments';
import Insurance from '@/components/patient/sections/Insurance';
import EmergencyContact from '@/components/patient/sections/EmergencyContact';
import { Button } from '@/components/ui/Button';
import { answerConsultation } from '@/store/services/doctor/consultationsApi';
import { addPatientMedicalRecord, updatePatientRecordItem, deletePatientRecordItem } from '@/store/services/doctor/patientMedicalRecordApi';
import { useTranslation } from 'react-i18next';
import { getImageUrl } from '@/components/ui/Avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Avatar, AvatarFallback } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog';
import { format } from 'date-fns';
import dynamic from 'next/dynamic';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Label } from '@/components/ui/Label';
import { getDoctorById } from '@/store/services/doctor/doctorApi';

const DicomViewer = dynamic(() => import('@/components/medical/DicomViewer'), { ssr: false });

function PrescriptionForm({ open, onClose, onSubmit, patient }) {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        medication: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        notes: ''
    });
    const [errors, setErrors] = useState({});
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };
    
    const validateForm = () => {
        const newErrors = {};
        if (!formData.medication) newErrors.medication = t('doctor.patientDetail.medicationRequired', 'Medication is required');
        if (!formData.dosage) newErrors.dosage = t('doctor.patientDetail.dosageRequired', 'Dosage is required');
        if (!formData.frequency) newErrors.frequency = t('doctor.patientDetail.frequencyRequired', 'Frequency is required');
        if (!formData.duration) newErrors.duration = t('doctor.patientDetail.durationRequired', 'Duration is required');
        if (!formData.startDate) newErrors.startDate = t('doctor.patientDetail.startDateRequired', 'Start date is required');
        if (!formData.endDate) newErrors.endDate = t('doctor.patientDetail.endDateRequired', 'End date is required');
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
            onClose();
        }
    };
    
    if (!open) return null;
    
    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-card text-card-foreground rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-lg border border-border">
                <div className="p-6 border-b border-border">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">{t('doctor.patientDetail.newPrescription', 'New Prescription')}</h2>
                        <Button 
                            onClick={onClose} 
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                {t('doctor.patientDetail.medication', 'Medication')}
                            </label>
                            <input
                                type="text"
                                name="medication"
                                value={formData.medication}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 bg-background text-foreground border rounded-md transition-colors ${
                                    errors.medication ? 'border-danger' : 'border-input'
                                }`}
                            />
                            {errors.medication && (
                                <p className="mt-1 text-sm text-danger">{errors.medication}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                {t('doctor.patientDetail.dosage', 'Dosage')}
                            </label>
                            <input
                                type="text"
                                name="dosage"
                                value={formData.dosage}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 bg-background text-foreground border rounded-md transition-colors ${
                                    errors.dosage ? 'border-danger' : 'border-input'
                                }`}
                            />
                            {errors.dosage && (
                                <p className="mt-1 text-sm text-danger">{errors.dosage}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                {t('doctor.patientDetail.frequency', 'Frequency')}
                            </label>
                            <select
                                name="frequency"
                                value={formData.frequency}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 bg-background text-foreground border rounded-md transition-colors ${
                                    errors.frequency ? 'border-danger' : 'border-input'
                                }`}
                            >
                                <option key="" value="">{t('doctor.patientDetail.selectFrequency', 'Select frequency')}</option>
                                <option key="once" value="once">{t('doctor.patientDetail.onceDaily', 'Once daily')}</option>
                                <option key="twice" value="twice">{t('doctor.patientDetail.twiceDaily', 'Twice daily')}</option>
                                <option key="thrice" value="thrice">{t('doctor.patientDetail.thriceDaily', 'Three times daily')}</option>
                                <option key="four" value="four">{t('doctor.patientDetail.fourTimesDaily', 'Four times daily')}</option>
                                <option key="as_needed" value="as_needed">{t('doctor.patientDetail.asNeeded', 'As needed')}</option>
                            </select>
                            {errors.frequency && (
                                <p className="mt-1 text-sm text-danger">{errors.frequency}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                {t('doctor.patientDetail.duration', 'Duration')}
                            </label>
                            <input
                                type="text"
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 bg-background text-foreground border rounded-md transition-colors ${
                                    errors.duration ? 'border-danger' : 'border-input'
                                }`}
                            />
                            {errors.duration && (
                                <p className="mt-1 text-sm text-danger">{errors.duration}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                {t('doctor.patientDetail.startDate', 'Start Date')}
                            </label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 bg-background text-foreground border rounded-md transition-colors ${
                                    errors.startDate ? 'border-danger' : 'border-input'
                                }`}
                            />
                            {errors.startDate && (
                                <p className="mt-1 text-sm text-danger">{errors.startDate}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                {t('doctor.patientDetail.endDate', 'End Date')}
                            </label>
                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 bg-background text-foreground border rounded-md transition-colors ${
                                    errors.endDate ? 'border-danger' : 'border-input'
                                }`}
                            />
                            {errors.endDate && (
                                <p className="mt-1 text-sm text-danger">{errors.endDate}</p>
                            )}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                            {t('doctor.patientDetail.instructions', 'Instructions')}
                        </label>
                        <textarea
                            name="instructions"
                            value={formData.instructions}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-3 py-2 bg-background text-foreground border border-input rounded-md transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                            {t('doctor.patientDetail.notes', 'Additional Notes')}
                        </label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows={2}
                            className="w-full px-3 py-2 bg-background text-foreground border border-input rounded-md transition-colors"
                        />
                    </div>
                </form>
                <div className="p-6 border-t border-border flex justify-end gap-3">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="px-4 py-2"
                    >
                        {t('doctor.patientDetail.cancel', 'Cancel')}
                    </Button>
                    <Button
                        variant="default"
                        onClick={handleSubmit}
                        className="px-4 py-2"
                    >
                        {t('doctor.patientDetail.createPrescription', 'Create Prescription')}
                    </Button>
                </div>
            </div>
        </div>
    );
}

const glassCard = "backdrop-blur-md bg-card/70 border border-border shadow-xl";
const fadeIn = "animate-fade-in";
const gradientBg = "fixed inset-0 -z-10 animate-gradient bg-gradient-to-br from-background via-card/80 to-muted/60";
const stickyTabs = "sticky top-0 z-20";

const PatientPageContent = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const params = useParams();
    const router = useRouter();
    const { showNotification } = useNotification();
    const dispatch = useAppDispatch();
    const { selectedPatient, loading, error } = useAppSelector((state) => state.doctorPatients);
    const [activeTab, setActiveTab] = useState('personal');
    const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
    const [activeMedicalTab, setActiveMedicalTab] = useState('vitalSigns');
    const [pdfDialogOpen, setPdfDialogOpen] = useState(false);
    const [selectedPdf, setSelectedPdf] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [dicomDialogOpen, setDicomDialogOpen] = useState(false);
    const [selectedDicomImages, setSelectedDicomImages] = useState([]);
    const [dicomImageIndex, setDicomImageIndex] = useState(0);

    // Dialog states
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [currentRecord, setCurrentRecord] = useState(null);
    const [currentCategory, setCurrentCategory] = useState('');
    const [formData, setFormData] = useState({});

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

    useEffect(() => {
        if (params.id) {
            dispatch(fetchPatientById(params.id));
        }
    }, [dispatch, params.id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <div className="bg-danger/10 border border-danger/20 rounded-md p-8 max-w-md text-center">
                    <h2 className="text-xl font-semibold mb-2 text-danger">Access Denied</h2>
                    <p className="text-danger mb-4">{error}</p>
                    <Button variant="default" onClick={() => router.push('/doctor/patients')}>Back to Patients List</Button>
                </div>
            </div>
        );
    }

    if (!selectedPatient) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <div className="bg-muted border border-border rounded-md p-8 max-w-md text-center">
                    <h2 className="text-xl font-semibold mb-2">Patient Not Found</h2>
                    <p className="text-muted-foreground mb-4">
                        The patient with ID "{params.id}" could not be found. They may have been removed or the ID is incorrect.
                    </p>
                    <Button variant="default" onClick={() => router.push('/doctor/patients')}>Back to Patients List</Button>
                </div>
            </div>
        );
    }

    // Avatar logic (with cache-buster)
    const avatarUrl = selectedPatient.user?.profileImage
        ? getImageUrl(selectedPatient.user.profileImage) + '?t=' + Date.now()
        : '/avatars/default-avatar.svg';

    // --- Unified Header ---
    const renderProfileHeader = () => (
        <div className={`${glassCard} ${fadeIn} p-6 flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 w-full`}>
            <Avatar src={avatarUrl} alt="Profile Picture" className="h-32 w-32 border-4 border-primary shadow-xl" />
            <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-foreground mb-1">
                    {selectedPatient.user?.firstName || ''} {selectedPatient.user?.lastName || ''}
                </h1>
                <p className="text-muted-foreground text-lg">{selectedPatient.user?.email || ''}</p>
                <div className="flex gap-2 justify-center md:justify-start mt-2">
                    <Badge className="bg-muted text-foreground px-3 py-1 rounded-full text-xs font-semibold">Patient</Badge>
                    <Badge className="bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold">Doctor View</Badge>
                </div>
            </div>
        </div>
    );

    // --- Unified Tabs ---
    const medicalRecordsData = {
        vitalSigns: selectedPatient?.medicalFile?.vitalSigns || [],
        allergies: selectedPatient?.medicalFile?.allergies || [],
        chronicConditions: selectedPatient?.medicalFile?.chronicConditions || [],
        diagnoses: selectedPatient?.medicalFile?.diagnoses || [],
        labResults: selectedPatient?.medicalFile?.labResults || [],
        imagingReports: selectedPatient?.medicalFile?.imagingReports || [],
        medications: selectedPatient?.medicalFile?.medicationHistory || [],
        immunizations: selectedPatient?.medicalFile?.immunizations || [],
        surgicalHistory: selectedPatient?.medicalFile?.surgicalHistory || [],
        documents: selectedPatient?.medicalFile?.attachedDocuments || [],
        familyHistory: selectedPatient?.medicalFile?.familyMedicalHistory || [],
        socialHistory: selectedPatient?.medicalFile?.socialHistory ? [selectedPatient.medicalFile.socialHistory] : [],
        generalHistory: selectedPatient?.medicalFile?.generalMedicalHistory || [],
    };

    // Debug: Log the medical file data
    console.log('Selected Patient:', selectedPatient);
    console.log('Medical File:', selectedPatient?.medicalFile);
    console.log('Medical Records Data:', medicalRecordsData);

    const handleAddRecord = (category) => {
        setCurrentCategory(category);
        setFormData({});
        setAddDialogOpen(true);
    };

    const handleEditRecord = (category, record) => {
        setCurrentCategory(category);
        setCurrentRecord(record);
        
        // Map all fields from the record to form data
        const mappedData = {};
        Object.keys(record).forEach(key => {
            if (key === 'date' || key === 'dateAdded' || key === 'startDate' || key === 'endDate') {
                if (record[key]) {
                    mappedData[key] = new Date(record[key]).toISOString().split('T')[0];
                }
            } else if (key !== '_id' && key !== 'createdBy' && key !== 'createdAt') {
                mappedData[key] = record[key] || '';
            }
        });
        
        setFormData(mappedData);
        setEditDialogOpen(true);
    };

    const handleDeleteRecord = (category, record) => {
        setCurrentCategory(category);
        setCurrentRecord(record);
        setDeleteDialogOpen(true);
    };

    const canEditRecord = (record) => {
        // Compare as strings for type safety
        return record.doctorId?.toString() === user?._id?.toString();
    };

    const getRecordFormFields = (category) => {
        const baseFields = [
            { name: 'name', label: t('common.name', 'Name'), type: 'text', required: true },
            { name: 'notes', label: t('common.notes', 'Notes'), type: 'textarea' },
            { name: 'date', label: t('common.date', 'Date'), type: 'date' }
        ];

        switch (category) {
            case 'vitalSigns':
                return [
                    { name: 'bloodPressure', label: t('patient.profile.bloodPressure', 'Blood Pressure'), type: 'text' },
                    { name: 'heartRate', label: t('patient.profile.heartRate', 'Heart Rate (bpm)'), type: 'number' },
                    { name: 'temperature', label: t('patient.profile.temperature', 'Temperature (°C)'), type: 'number' },
                    { name: 'respiratoryRate', label: t('patient.profile.respiratoryRate', 'Respiratory Rate'), type: 'number' },
                    { name: 'weight', label: t('patient.profile.weight', 'Weight (kg)'), type: 'number' },
                    { name: 'height', label: t('patient.profile.height', 'Height (cm)'), type: 'number' },
                    { name: 'oxygenSaturation', label: t('patient.profile.oxygenSaturation', 'Oxygen Saturation (%)'), type: 'number' },
                    { name: 'notes', label: t('common.notes', 'Notes'), type: 'textarea' }
                ];
            case 'allergies':
                return [
                    { name: 'name', label: t('patient.profile.allergyName', 'Allergy Name'), type: 'text', required: true },
                    { name: 'severity', label: t('patient.profile.severity', 'Severity'), type: 'select', options: [
                        { value: 'mild', label: t('patient.profile.mild', 'Mild') },
                        { value: 'moderate', label: t('patient.profile.moderate', 'Moderate') },
                        { value: 'severe', label: t('patient.profile.severe', 'Severe') }
                    ]},
                    { name: 'reaction', label: t('patient.profile.reaction', 'Reaction'), type: 'text' }
                ];
            case 'chronicConditions':
                return [
                    { name: 'name', label: t('patient.profile.conditionName', 'Condition Name'), type: 'text', required: true },
                    { name: 'diagnosisDate', label: t('patient.profile.diagnosisDate', 'Diagnosis Date'), type: 'date' },
                    { name: 'status', label: t('patient.profile.status', 'Status'), type: 'select', options: [
                        { value: 'active', label: t('patient.profile.active', 'Active') },
                        { value: 'managed', label: t('patient.profile.managed', 'Managed') },
                        { value: 'resolved', label: t('patient.profile.resolved', 'Resolved') }
                    ]},
                    { name: 'notes', label: t('common.notes', 'Notes'), type: 'textarea' }
                ];
            case 'diagnoses':
                return [
                    { name: 'conditionName', label: t('patient.profile.conditionName', 'Condition Name'), type: 'text', required: true },
                    { name: 'date', label: t('patient.profile.diagnosisDate', 'Diagnosis Date'), type: 'date' },
                    { name: 'treatmentPlan', label: t('patient.profile.treatmentPlan', 'Treatment Plan'), type: 'textarea' },
                    { name: 'status', label: t('patient.profile.status', 'Status'), type: 'select', options: [
                        { value: 'active', label: t('patient.profile.active', 'Active') },
                        { value: 'resolved', label: t('patient.profile.resolved', 'Resolved') },
                        { value: 'chronic', label: t('patient.profile.chronic', 'Chronic') }
                    ]},
                    { name: 'notes', label: t('common.notes', 'Notes'), type: 'textarea' }
                ];
            case 'labResults':
                return [
                    { name: 'testName', label: t('patient.profile.testName', 'Test Name'), type: 'text', required: true },
                    { name: 'date', label: t('patient.profile.date', 'Date'), type: 'date' },
                    { name: 'labName', label: t('patient.profile.labName', 'Lab Name'), type: 'text' },
                    { name: 'normalRange', label: t('patient.profile.normalRange', 'Normal Range'), type: 'text' },
                    { name: 'unit', label: t('patient.profile.unit', 'Unit'), type: 'text' },
                    { name: 'results', label: t('patient.profile.results', 'Results (JSON)'), type: 'textarea', placeholder: '{"glucose": "120", "cholesterol": "200"}' },
                    { name: 'pdfFile', label: t('patient.profile.uploadPdf', 'Upload PDF Report'), type: 'file', accept: '.pdf' }
                ];
            case 'imagingReports':
                return [
                    { name: 'type', label: t('patient.profile.imagingType', 'Imaging Type'), type: 'text', required: true },
                    { name: 'date', label: t('patient.profile.date', 'Date'), type: 'date' },
                    { name: 'findings', label: t('patient.profile.findings', 'Findings'), type: 'textarea' },
                    { name: 'location', label: t('patient.profile.location', 'Location'), type: 'text' },
                    { name: 'dcmFiles', label: t('patient.profile.uploadDcm', 'Upload DCM Files'), type: 'file', accept: '.dcm', multiple: true }
                ];
            case 'medications':
                return [
                    { name: 'name', label: t('patient.profile.medicationName', 'Medication Name'), type: 'text', required: true },
                    { name: 'dose', label: t('patient.profile.dose', 'Dose'), type: 'text', required: true },
                    { name: 'frequency', label: t('patient.profile.frequency', 'Frequency'), type: 'text', required: true },
                    { name: 'route', label: t('patient.profile.route', 'Route'), type: 'text' },
                    { name: 'startDate', label: t('patient.profile.startDate', 'Start Date'), type: 'date' },
                    { name: 'endDate', label: t('patient.profile.endDate', 'End Date'), type: 'date' },
                    { name: 'active', label: t('patient.profile.active', 'Active'), type: 'checkbox' },
                    { name: 'instructions', label: t('patient.profile.instructions', 'Instructions'), type: 'textarea' }
                ];
            case 'immunizations':
                return [
                    { name: 'name', label: t('patient.profile.vaccineName', 'Vaccine Name'), type: 'text', required: true },
                    { name: 'dateAdministered', label: t('patient.profile.dateAdministered', 'Date Administered'), type: 'date', required: true },
                    { name: 'nextDoseDate', label: t('patient.profile.nextDoseDate', 'Next Dose Date'), type: 'date' },
                    { name: 'manufacturer', label: t('patient.profile.manufacturer', 'Manufacturer'), type: 'text' },
                    { name: 'batchNumber', label: t('patient.profile.batchNumber', 'Batch Number'), type: 'text' },
                    { name: 'administeredBy', label: t('patient.profile.administeredBy', 'Administered By'), type: 'text' }
                ];
            case 'surgicalHistory':
                return [
                    { name: 'name', label: t('patient.profile.procedureName', 'Procedure Name'), type: 'text', required: true },
                    { name: 'date', label: t('patient.profile.date', 'Date'), type: 'date', required: true },
                    { name: 'hospital', label: t('patient.profile.hospital', 'Hospital'), type: 'text' },
                    { name: 'surgeon', label: t('patient.profile.surgeon', 'Surgeon'), type: 'text' },
                    { name: 'complications', label: t('patient.profile.complications', 'Complications'), type: 'textarea' },
                    { name: 'outcome', label: t('patient.profile.outcome', 'Outcome'), type: 'textarea' },
                    { name: 'notes', label: t('common.notes', 'Notes'), type: 'textarea' }
                ];
            case 'documents':
                return [
                    { name: 'title', label: t('patient.profile.documentTitle', 'Document Title'), type: 'text', required: true },
                    { name: 'type', label: t('patient.profile.documentType', 'Document Type'), type: 'text' },
                    { name: 'tags', label: t('patient.profile.tags', 'Tags (comma separated)'), type: 'text' },
                    { name: 'documentFile', label: t('patient.profile.uploadDocument', 'Upload Document'), type: 'file', accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png' }
                ];
            case 'familyHistory':
                return [
                    { name: 'relation', label: t('patient.profile.relation', 'Relation'), type: 'text', required: true },
                    { name: 'condition', label: t('patient.profile.condition', 'Condition'), type: 'text', required: true },
                    { name: 'notes', label: t('common.notes', 'Notes'), type: 'textarea' }
                ];
            case 'socialHistory':
                return [
                    { name: 'smokingStatus', label: t('patient.profile.smokingStatus', 'Smoking Status'), type: 'select', options: [
                        { value: 'current', label: t('patient.profile.current', 'Current') },
                        { value: 'former', label: t('patient.profile.former', 'Former') },
                        { value: 'never', label: t('patient.profile.never', 'Never') }
                    ]},
                    { name: 'alcoholUse', label: t('patient.profile.alcoholUse', 'Alcohol Use'), type: 'text' },
                    { name: 'occupation', label: t('patient.profile.occupation', 'Occupation'), type: 'text' },
                    { name: 'livingSituation', label: t('patient.profile.livingSituation', 'Living Situation'), type: 'text' }
                ];
            case 'generalHistory':
                return [
                    { name: 'visitReason', label: t('patient.profile.visitReason', 'Visit Reason'), type: 'text', required: true },
                    { name: 'diagnosisSummary', label: t('patient.profile.diagnosisSummary', 'Diagnosis Summary'), type: 'textarea' },
                    { name: 'treatmentSummary', label: t('patient.profile.treatmentSummary', 'Treatment Summary'), type: 'textarea' },
                    { name: 'notes', label: t('common.notes', 'Notes'), type: 'textarea' }
                ];
            default:
                return baseFields;
        }
    };

    const handleFileUpload = async (file, category) => {
        const formData = new FormData();
        formData.append('file', file);
        
        let uploadPath = '';
        switch (category) {
            case 'labResults':
                uploadPath = '/api/upload/labresults';
                break;
            case 'imagingReports':
                uploadPath = '/api/upload/imaging';
                break;
            case 'documents':
                uploadPath = '/api/upload/documents';
                break;
            default:
                uploadPath = '/api/upload/general';
        }
        
        try {
            const response = await fetch(uploadPath, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (response.ok) {
                const result = await response.json();
                return result.url;
            } else {
                throw new Error('Upload failed');
            }
        } catch (error) {
            console.error('File upload error:', error);
            throw error;
        }
    };

    const handleSubmit = async (isEdit = false) => {
        try {
            if (isEdit && (!currentRecord || !currentRecord._id)) {
                showNotification({
                    type: 'error',
                    title: t('common.error', 'Error'),
                    message: t('common.invalidRecord', 'Invalid record selected for editing.')
                });
                return;
            }
            const recordData = {
                ...formData,
                doctorId: user?._id // Add doctorId to identify ownership
            };

            // Handle file uploads
            if (formData.pdfFile && currentCategory === 'labResults') {
                const pdfUrl = await handleFileUpload(formData.pdfFile, 'labResults');
                recordData.documents = [pdfUrl];
                delete recordData.pdfFile;
            }
            
            if (formData.dcmFiles && currentCategory === 'imagingReports') {
                const dcmUrls = [];
                for (const file of formData.dcmFiles) {
                    const dcmUrl = await handleFileUpload(file, 'imagingReports');
                    dcmUrls.push(dcmUrl);
                }
                recordData.images = dcmUrls;
                delete recordData.dcmFiles;
            }
            
            if (formData.documentFile && currentCategory === 'documents') {
                const docUrl = await handleFileUpload(formData.documentFile, 'documents');
                recordData.url = docUrl;
                delete recordData.documentFile;
            }

            // Handle special field mappings
            if (currentCategory === 'labResults' && formData.results) {
                try {
                    recordData.results = JSON.parse(formData.results);
                } catch (e) {
                    recordData.results = { result: formData.results };
                }
            }
            
            if (currentCategory === 'documents' && formData.tags) {
                recordData.tags = formData.tags.split(',').map(tag => tag.trim());
            }

            console.log(`${isEdit ? 'Editing' : 'Adding'} ${currentCategory} record:`, recordData);
            
            if (isEdit) {
                // Update existing record
                await updatePatientRecordItem(params.id, currentCategory, currentRecord._id, recordData);
                setEditDialogOpen(false);
            } else {
                // Add new record
                await addPatientMedicalRecord(params.id, currentCategory, recordData);
                setAddDialogOpen(false);
            }
            
            // Refresh patient data
            dispatch(fetchPatientById(params.id));
            
            // Show success notification
            showNotification({
                type: 'success',
                title: t('common.success', 'Success'),
                message: isEdit 
                    ? t('common.recordUpdated', 'Record updated successfully')
                    : t('common.recordAdded', 'Record added successfully')
            });
        } catch (error) {
            console.error('Error saving record:', error);
            showNotification({
                type: 'error',
                title: t('common.error', 'Error'),
                message: error.response?.data?.message || t('common.somethingWentWrong', 'Something went wrong')
            });
        }
    };

    const handleDelete = async () => {
        if (!currentRecord || !currentRecord._id) {
            showNotification({
                type: 'error',
                title: t('common.error', 'Error'),
                message: t('common.invalidRecord', 'Invalid record selected for deletion.')
            });
            setDeleteDialogOpen(false);
            return;
        }
        try {
            await deletePatientRecordItem(params.id, currentCategory, currentRecord._id);
            setDeleteDialogOpen(false);
            
            // Refresh patient data
            dispatch(fetchPatientById(params.id));
            
            // Show success notification
            showNotification({
                type: 'success',
                title: t('common.success', 'Success'),
                message: t('common.recordDeleted', 'Record deleted successfully')
            });
        } catch (error) {
            console.error('Error deleting record:', error);
            showNotification({
                type: 'error',
                title: t('common.error', 'Error'),
                message: error.response?.data?.message || t('common.somethingWentWrong', 'Something went wrong')
            });
        }
    };

    const renderRecordCard = (record, category, index) => {
        const canEdit = canEditRecord(record);
        const categoryMeta = medicalRecordCategories.find(c => c.id === category);
        return (
            <div
                key={record._id || record.name || record.id || `${category}-${index}`}
                className="relative bg-white/90 dark:bg-card/90 border-2 border-border rounded-xl shadow-lg hover:shadow-xl transition-shadow p-0 flex flex-col min-h-[120px]"
            >
                {/* Card Header */}
                <div className="flex items-center gap-2 px-4 pt-4 pb-2 border-b border-border">
                    {categoryMeta?.icon && <categoryMeta.icon className="h-5 w-5 text-primary" />}
                    <div className="font-bold text-lg text-foreground flex-1 truncate">
                        {record.name || record.testName || record.type || record.procedure || record.title || record.conditionName || record.question || 'Medical Record'}
                    </div>
                    <span className="text-xs text-muted-foreground font-semibold bg-muted px-2 py-0.5 rounded-full">
                        {categoryMeta?.label}
                    </span>
                </div>
                {/* Card Content */}
                <div className="flex-1 px-4 py-3 space-y-1 text-sm">
                    {/* Category-specific data display */}
                    {category === 'vitalSigns' && (
                        <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                            {record.bloodPressure && <div><span className="font-semibold">{t('patient.profile.bp', 'BP')}:</span> {record.bloodPressure}</div>}
                            {record.heartRate && <div><span className="font-semibold">{t('patient.profile.hr', 'HR')}:</span> {record.heartRate} bpm</div>}
                            {record.temperature && <div><span className="font-semibold">{t('patient.profile.temp', 'Temp')}:</span> {record.temperature}°C</div>}
                            {record.weight && <div><span className="font-semibold">{t('patient.profile.weight', 'Weight')}:</span> {record.weight} kg</div>}
                            {record.height && <div><span className="font-semibold">{t('patient.profile.height', 'Height')}:</span> {record.height} cm</div>}
                            {record.bmi && <div><span className="font-semibold">{t('patient.profile.bmi', 'BMI')}:</span> {record.bmi}</div>}
                            {record.oxygenSaturation && <div><span className="font-semibold">{t('patient.profile.o2sat', 'O2 Sat')}:</span> {record.oxygenSaturation}%</div>}
                        </div>
                    )}
                    
                    {category === 'allergies' && (
                        <>
                            {record.severity && (
                                <Badge className={`ml-2 ${record.severity === 'severe' ? 'bg-danger text-white' : record.severity === 'moderate' ? 'bg-orange-200 text-orange-900' : 'bg-yellow-100 text-yellow-900'}`}>
                                    {t(`patient.profile.${record.severity}`, record.severity)}
                                </Badge>
                            )}
                            {record.reaction && <div className="text-xs text-muted-foreground mt-1">{t('patient.profile.reaction', 'Reaction')}: {record.reaction}</div>}
                        </>
                    )}
                    
                    {category === 'chronicConditions' && (
                        <>
                            {record.status && (
                                <Badge className={`ml-2 ${record.status === 'active' ? 'bg-red-100 text-red-900' : record.status === 'managed' ? 'bg-yellow-100 text-yellow-900' : 'bg-green-100 text-green-900'}`}>
                                    {t(`patient.profile.${record.status}`, record.status)}
                                </Badge>
                            )}
                            {record.diagnosisDate && <div className="text-xs text-muted-foreground mt-1">{t('patient.profile.diagnosisDate', 'Diagnosis Date')}: {format(new Date(record.diagnosisDate), 'PPP')}</div>}
                        </>
                    )}
                    
                    {category === 'labResults' && (
                        <>
                            {record.labName && <div className="text-xs text-muted-foreground mt-1">{t('patient.profile.labName', 'Lab')}: {record.labName}</div>}
                            {record.normalRange && <div className="text-xs text-muted-foreground mt-1">{t('patient.profile.normalRange', 'Normal Range')}: {record.normalRange}</div>}
                            {record.unit && <div className="text-xs text-muted-foreground mt-1">{t('patient.profile.unit', 'Unit')}: {record.unit}</div>}
                            {record.documents && record.documents.length > 0 && (
                                <a href={record.documents[0]} target="_blank" rel="noopener noreferrer" className="text-primary underline text-xs mt-1 block">
                                    {t('patient.profile.viewPdf', 'View PDF Report')}
                                </a>
                            )}
                        </>
                    )}
                    
                    {category === 'imagingReports' && (
                        <>
                            {record.findings && <div className="text-xs text-muted-foreground mt-1">{t('patient.profile.findings', 'Findings')}: {record.findings}</div>}
                            {record.location && <div className="text-xs text-muted-foreground mt-1">{t('patient.profile.location', 'Location')}: {record.location}</div>}
                            {record.images && record.images.length > 0 && (
                                <a href="#" onClick={(e) => {
                                    e.preventDefault();
                                    const imageUrls = record.images.map(img => img.src || img);
                                    setSelectedDicomImages(imageUrls);
                                    setDicomImageIndex(0);
                                    setDicomDialogOpen(true);
                                }} className="text-primary underline text-xs mt-1 block">
                                    {t('patient.profile.viewImages', 'View DICOM Images')} ({record.images.length})
                                </a>
                            )}
                        </>
                    )}
                    
                    {category === 'medications' && (
                        <>
                            {record.dose && <div className="text-xs text-muted-foreground mt-1">{t('patient.profile.dose', 'Dose')}: {record.dose}</div>}
                            {record.frequency && <div className="text-xs text-muted-foreground mt-1">{t('patient.profile.frequency', 'Frequency')}: {record.frequency}</div>}
                            {record.route && <div className="text-xs text-muted-foreground mt-1">{t('patient.profile.route', 'Route')}: {record.route}</div>}
                            {record.instructions && <div className="text-xs text-muted-foreground mt-1">{t('patient.profile.instructions', 'Instructions')}: {record.instructions}</div>}
                            {record.startDate && <div className="text-xs text-muted-foreground mt-1">{t('patient.profile.startDate', 'Start Date')}: {format(new Date(record.startDate), 'PPP')}</div>}
                            {record.endDate && <div className="text-xs text-muted-foreground mt-1">{t('patient.profile.endDate', 'End Date')}: {format(new Date(record.endDate), 'PPP')}</div>}
                        </>
                    )}
                    
                    {category === 'immunizations' && (
                        <>
                            {record.dateAdministered && <div className="text-xs text-muted-foreground mt-1">{t('patient.profile.dateAdministered', 'Date Administered')}: {format(new Date(record.dateAdministered), 'PPP')}</div>}
                            {record.nextDoseDate && <div className="text-xs text-muted-foreground mt-1">{t('patient.profile.nextDoseDate', 'Next Dose')}: {format(new Date(record.nextDoseDate), 'PPP')}</div>}
                            {record.manufacturer && <div className="text-xs text-muted-foreground mt-1">{t('patient.profile.manufacturer', 'Manufacturer')}: {record.manufacturer}</div>}
                            {record.batchNumber && <div className="text-xs text-muted-foreground mt-1">{t('patient.profile.batchNumber', 'Batch Number')}: {record.batchNumber}</div>}
                            {record.administeredBy && <div className="text-xs text-muted-foreground mt-1">{t('patient.profile.administeredBy', 'Administered By')}: {record.administeredBy}</div>}
                        </>
                    )}
                    
                    {category === 'surgicalHistory' && (
                        <>
                            {record.hospital && <div className="text-xs text-muted-foreground mt-1">{t('patient.profile.hospital', 'Hospital')}: {record.hospital}</div>}
                            {record.surgeon && <div className="text-xs text-muted-foreground mt-1">{t('patient.profile.surgeon', 'Surgeon')}: {record.surgeon}</div>}
                            {record.complications && <div className="text-xs text-muted-foreground mt-1">{t('patient.profile.complications', 'Complications')}: {record.complications}</div>}
                            {record.outcome && <div className="text-xs text-muted-foreground mt-1">{t('patient.profile.outcome', 'Outcome')}: {record.outcome}</div>}
                        </>
                    )}
                    
                    {category === 'documents' && (
                        <>
                            {record.type && <div className="text-xs text-muted-foreground mt-1">{t('patient.profile.type', 'Type')}: {record.type}</div>}
                            {record.url && (
                                <a href={record.url} target="_blank" rel="noopener noreferrer" className="text-primary underline text-xs mt-1 block">
                                    {t('patient.profile.viewDocument', 'View Document')}
                                </a>
                            )}
                        </>
                    )}
                    
                    {category === 'diagnoses' && (
                        <>
                            {record.conditionName && <div className="text-xs text-muted-foreground mt-1">{t('patient.profile.conditionName', 'Condition')}: {record.conditionName}</div>}
                            {record.treatmentPlan && <div className="text-xs text-muted-foreground mt-1">{t('patient.profile.treatmentPlan', 'Treatment Plan')}: {record.treatmentPlan}</div>}
                            {record.status && (
                                <Badge className={`ml-2 ${record.status === 'active' ? 'bg-green-100 text-green-900' : record.status === 'resolved' ? 'bg-blue-100 text-blue-900' : 'bg-yellow-100 text-yellow-900'}`}>
                                    {t(`patient.profile.${record.status}`, record.status)}
                                </Badge>
                            )}
                        </>
                    )}
                    
                    {category === 'generalHistory' && (
                        <>
                            {record.visitReason && <div className="text-xs text-muted-foreground mt-1">{t('patient.profile.visitReason', 'Visit Reason')}: {record.visitReason}</div>}
                            {record.diagnosisSummary && <div className="text-xs text-muted-foreground mt-1">{t('patient.profile.diagnosisSummary', 'Diagnosis Summary')}: {record.diagnosisSummary}</div>}
                            {record.treatmentSummary && <div className="text-xs text-muted-foreground mt-1">{t('patient.profile.treatmentSummary', 'Treatment Summary')}: {record.treatmentSummary}</div>}
                        </>
                    )}
                    
                    {category === 'familyHistory' && (
                        <>
                            {record.relation && <div className="text-xs text-muted-foreground mt-1">{t('patient.profile.relation', 'Relation')}: {record.relation}</div>}
                            {record.condition && <div className="text-xs text-muted-foreground mt-1">{t('patient.profile.condition', 'Condition')}: {record.condition}</div>}
                        </>
                    )}
                    
                    {category === 'socialHistory' && (
                        <>
                            {record.smokingStatus && <div className="text-xs text-muted-foreground mt-1">{t('patient.profile.smokingStatus', 'Smoking Status')}: {record.smokingStatus}</div>}
                            {record.alcoholUse && <div className="text-xs text-muted-foreground mt-1">{t('patient.profile.alcoholUse', 'Alcohol Use')}: {record.alcoholUse}</div>}
                            {record.occupation && <div className="text-xs text-muted-foreground mt-1">{t('patient.profile.occupation', 'Occupation')}: {record.occupation}</div>}
                            {record.livingSituation && <div className="text-xs text-muted-foreground mt-1">{t('patient.profile.livingSituation', 'Living Situation')}: {record.livingSituation}</div>}
                        </>
                    )}
                    
                    {record.notes && <div className="text-xs text-muted-foreground mt-1">{record.notes}</div>}
                    {record.date && <div className="text-xs text-muted-foreground mt-1">{t('patient.profile.date', 'Date')}: {format(new Date(record.date), 'PPP')}</div>}
                </div>
                {/* Card Footer */}
                <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/40 rounded-b-xl mt-2">
                    {/* Ownership stamp */}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        {record.doctorId?.toString() === user?._id?.toString()
                            ? t('common.you', 'You')
                            : <DoctorName doctorId={record.doctorId} />}
                    </div>
                    {/* Action buttons for own records */}
                    {canEdit && (
                        <div className="flex gap-1">
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditRecord(category, record)}
                                className="h-6 w-6 p-0"
                                aria-label="Edit"
                            >
                                <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteRecord(category, record)}
                                className="h-6 w-6 p-0 text-destructive"
                                aria-label="Delete"
                            >
                                <Trash2 className="h-3 w-3" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderAddEditDialog = (isEdit = false) => {
        const fields = getRecordFormFields(currentCategory);
        const dialogTitle = isEdit 
            ? t('common.editRecord', 'Edit Record') 
            : t('common.addRecord', 'Add Record');
        
        return (
            <Dialog open={isEdit ? editDialogOpen : addDialogOpen} onOpenChange={isEdit ? setEditDialogOpen : setAddDialogOpen}>
                <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{dialogTitle}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        {fields.map((field) => (
                            <div key={field.name}>
                                <Label htmlFor={field.name}>{field.label}</Label>
                                {field.type === 'textarea' ? (
                                    <Textarea
                                        id={field.name}
                                        value={formData[field.name] || ''}
                                        onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                                        required={field.required}
                                        placeholder={field.placeholder}
                                    />
                                ) : field.type === 'select' ? (
                                    <Select value={formData[field.name] || ''} onValueChange={(value) => setFormData({ ...formData, [field.name]: value })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={field.label} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {field.options?.map((option) => (
                                                <SelectItem key={option.value || option} value={option.value || option}>
                                                    {option.label || option}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : field.type === 'file' ? (
                                    <Input
                                        id={field.name}
                                        type="file"
                                        onChange={(e) => setFormData({ ...formData, [field.name]: field.multiple ? e.target.files : e.target.files[0] })}
                                        accept={field.accept}
                                        multiple={field.multiple}
                                        required={field.required}
                                    />
                                ) : (
                                    <Input
                                        id={field.name}
                                        type={field.type}
                                        value={formData[field.name] || ''}
                                        onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                                        required={field.required}
                                        placeholder={field.placeholder}
                                    />
                                )}
                            </div>
                        ))}
                        <div className="flex gap-2 pt-4">
                            <Button onClick={() => handleSubmit(isEdit)} className="flex-1">
                                {isEdit ? t('common.save', 'Save') : t('common.add', 'Add')}
                            </Button>
                            <Button variant="outline" onClick={() => isEdit ? setEditDialogOpen(false) : setAddDialogOpen(false)} className="flex-1">
                                {t('common.cancel', 'Cancel')}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    };

    const renderDeleteDialog = () => (
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{t('common.deleteRecord', 'Delete Record')}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <p>{t('common.deleteRecordConfirm', 'Are you sure you want to delete this record? This action cannot be undone.')}</p>
                    <div className="flex gap-2">
                        <Button onClick={handleDelete} variant="destructive" className="flex-1">
                            {t('common.delete', 'Delete')}
                        </Button>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} className="flex-1">
                            {t('common.cancel', 'Cancel')}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );

    const renderMedicalFile = () => (
        <Card className="w-full overflow-hidden">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" /> {t('patient.profile.medicalFile', 'Medical File')}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <Tabs value={activeMedicalTab} onValueChange={setActiveMedicalTab} className="w-full">
                    <div className="relative">
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                    const idx = medicalRecordCategories.findIndex(c => c.id === activeMedicalTab);
                                    if (idx > 0) setActiveMedicalTab(medicalRecordCategories[idx - 1].id);
                                }}
                                disabled={medicalRecordCategories.findIndex(c => c.id === activeMedicalTab) === 0}
                                className="h-8 w-8 flex-shrink-0"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            
                            <div className="w-full overflow-x-auto">
                                <TabsList className="flex flex-nowrap w-fit overflow-x-auto scrollbar-hide h-auto p-0 bg-muted gap-1">
                                    {medicalRecordCategories.map((category) => (
                                        <TabsTrigger 
                                            key={category.id} 
                                            value={category.id} 
                                            className={`flex items-center px-3 py-2 text-xs whitespace-nowrap transition-colors duration-200 ${getMedicalTabTriggerClass(category.id)}`}
                                        >
                                            <category.icon className="h-4 w-4 mr-2 flex-shrink-0" />
                                            <span className="truncate">{category.label}</span>
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                            </div>
                            
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                    const idx = medicalRecordCategories.findIndex(c => c.id === activeMedicalTab);
                                    if (idx < medicalRecordCategories.length - 1) setActiveMedicalTab(medicalRecordCategories[idx + 1].id);
                                }}
                                disabled={medicalRecordCategories.findIndex(c => c.id === activeMedicalTab) === medicalRecordCategories.length - 1}
                                className="h-8 w-8 flex-shrink-0"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    
                    {/* Vital Signs */}
                    <TabsContent value="vitalSigns" className="mt-4">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <HeartPulse className="h-5 w-5 text-primary" /> {t('patient.profile.vitalSigns', 'Vital Signs')}
                            </h3>
                            <Button size="sm" onClick={() => handleAddRecord('vitalSigns')}>
                                <Plus className="h-4 w-4 mr-1" />
                                {t('common.add', 'Add')}
                            </Button>
                        </div>
                        {medicalRecordsData.vitalSigns && medicalRecordsData.vitalSigns.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {medicalRecordsData.vitalSigns.map((vital, index) => renderRecordCard(vital, 'vitalSigns', index))}
                            </div>
                        ) : (
                            <div className="text-muted-foreground italic text-sm">{t('patient.profile.noVitalSigns', 'No vital signs recorded.')}</div>
                        )}
                    </TabsContent>
                    
                    {/* Allergies */}
                    <TabsContent value="allergies" className="mt-4">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <DropletIcon className="h-5 w-5 text-primary" /> {t('patient.profile.allergies', 'Allergies')}
                            </h3>
                            <Button size="sm" onClick={() => handleAddRecord('allergies')}>
                                <Plus className="h-4 w-4 mr-1" />
                                {t('common.add', 'Add')}
                            </Button>
                        </div>
                        {medicalRecordsData.allergies && medicalRecordsData.allergies.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {medicalRecordsData.allergies.map((allergy, index) => renderRecordCard(allergy, 'allergies', index))}
                            </div>
                        ) : (
                            <div className="text-muted-foreground italic text-sm">{t('patient.profile.noAllergies', 'No allergies recorded.')}</div>
                        )}
                    </TabsContent>
                    
                    {/* Chronic Conditions */}
                    <TabsContent value="chronicConditions" className="mt-4">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Stethoscope className="h-5 w-5 text-primary" /> {t('patient.profile.chronicConditions', 'Chronic Conditions')}
                            </h3>
                            <Button size="sm" onClick={() => handleAddRecord('chronicConditions')}>
                                <Plus className="h-4 w-4 mr-1" />
                                {t('common.add', 'Add')}
                            </Button>
                        </div>
                        {medicalRecordsData.chronicConditions && medicalRecordsData.chronicConditions.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {medicalRecordsData.chronicConditions.map((condition, index) => renderRecordCard(condition, 'chronicConditions', index))}
                            </div>
                        ) : (
                            <div className="text-muted-foreground italic text-sm">{t('patient.profile.noChronicConditions', 'No chronic conditions recorded.')}</div>
                        )}
                    </TabsContent>
                    
                    {/* Diagnoses */}
                    <TabsContent value="diagnoses" className="mt-4">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <HeartPulse className="h-5 w-5 text-primary" /> {t('patient.profile.diagnoses', 'Diagnoses')}
                            </h3>
                            <Button size="sm" onClick={() => handleAddRecord('diagnoses')}>
                                <Plus className="h-4 w-4 mr-1" />
                                {t('common.add', 'Add')}
                            </Button>
                        </div>
                        {medicalRecordsData.diagnoses && medicalRecordsData.diagnoses.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {medicalRecordsData.diagnoses.map((diagnosis, index) => renderRecordCard(diagnosis, 'diagnoses', index))}
                            </div>
                        ) : (
                            <div className="text-muted-foreground italic text-sm">{t('patient.profile.noDiagnoses', 'No diagnoses recorded.')}</div>
                        )}
                    </TabsContent>
                    
                    {/* Lab Results */}
                    <TabsContent value="labResults" className="mt-4">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <BarChart3 className="h-5 w-5 text-primary" /> {t('patient.profile.labResults', 'Lab Results')}
                            </h3>
                            <Button size="sm" onClick={() => handleAddRecord('labResults')}>
                                <Plus className="h-4 w-4 mr-1" />
                                {t('common.add', 'Add')}
                            </Button>
                        </div>
                        {medicalRecordsData.labResults && medicalRecordsData.labResults.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {medicalRecordsData.labResults.map((result, index) => renderRecordCard(result, 'labResults', index))}
                            </div>
                        ) : (
                            <div className="text-muted-foreground italic text-sm">{t('patient.profile.noLabResults', 'No lab results recorded.')}</div>
                        )}
                    </TabsContent>
                    
                    {/* Imaging Reports */}
                    <TabsContent value="imagingReports" className="mt-4">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <FileImage className="h-5 w-5 text-primary" /> {t('patient.profile.imagingReports', 'Imaging Reports')}
                            </h3>
                            <Button size="sm" onClick={() => handleAddRecord('imagingReports')}>
                                <Plus className="h-4 w-4 mr-1" />
                                {t('common.add', 'Add')}
                            </Button>
                        </div>
                        {medicalRecordsData.imagingReports && medicalRecordsData.imagingReports.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {medicalRecordsData.imagingReports.map((img, index) => renderRecordCard(img, 'imagingReports', index))}
                            </div>
                        ) : (
                            <div className="text-muted-foreground italic text-sm">{t('patient.profile.noImagingReports', 'No imaging reports recorded.')}</div>
                        )}
                    </TabsContent>
                    
                    {/* Medications */}
                    <TabsContent value="medications" className="mt-4">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Pill className="h-5 w-5 text-primary" /> {t('patient.profile.medications', 'Medications')}
                            </h3>
                            <Button size="sm" onClick={() => handleAddRecord('medications')}>
                                <Plus className="h-4 w-4 mr-1" />
                                {t('common.add', 'Add')}
                            </Button>
                        </div>
                        {medicalRecordsData.medications && medicalRecordsData.medications.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {medicalRecordsData.medications.map((med, index) => renderRecordCard(med, 'medications', index))}
                            </div>
                        ) : (
                            <div className="text-muted-foreground italic text-sm">{t('patient.profile.noMedications', 'No medications recorded.')}</div>
                        )}
                    </TabsContent>
                    
                    {/* Immunizations */}
                    <TabsContent value="immunizations" className="mt-4">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Shield className="h-5 w-5 text-primary" /> {t('patient.profile.immunizations', 'Immunizations')}
                            </h3>
                            <Button size="sm" onClick={() => handleAddRecord('immunizations')}>
                                <Plus className="h-4 w-4 mr-1" />
                                {t('common.add', 'Add')}
                            </Button>
                        </div>
                        {medicalRecordsData.immunizations && medicalRecordsData.immunizations.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {medicalRecordsData.immunizations.map((imm, index) => renderRecordCard(imm, 'immunizations', index))}
                            </div>
                        ) : (
                            <div className="text-muted-foreground italic text-sm">{t('patient.profile.noImmunizations', 'No immunizations recorded.')}</div>
                        )}
                    </TabsContent>
                    
                    {/* Surgical History */}
                    <TabsContent value="surgicalHistory" className="mt-4">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <History className="h-5 w-5 text-primary" /> {t('patient.profile.surgicalHistory', 'Surgical History')}
                            </h3>
                            <Button size="sm" onClick={() => handleAddRecord('surgicalHistory')}>
                                <Plus className="h-4 w-4 mr-1" />
                                {t('common.add', 'Add')}
                            </Button>
                        </div>
                        {medicalRecordsData.surgicalHistory && medicalRecordsData.surgicalHistory.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {medicalRecordsData.surgicalHistory.map((surg, index) => renderRecordCard(surg, 'surgicalHistory', index))}
                            </div>
                        ) : (
                            <div className="text-muted-foreground italic text-sm">{t('patient.profile.noSurgicalHistory', 'No surgical history recorded.')}</div>
                        )}
                    </TabsContent>
                    
                    {/* Documents */}
                    <TabsContent value="documents" className="mt-4">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" /> {t('patient.profile.documents', 'Documents')}
                            </h3>
                            <Button size="sm" onClick={() => handleAddRecord('documents')}>
                                <Plus className="h-4 w-4 mr-1" />
                                {t('common.add', 'Add')}
                            </Button>
                        </div>
                        {medicalRecordsData.documents && medicalRecordsData.documents.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {medicalRecordsData.documents.map((doc, index) => renderRecordCard(doc, 'documents', index))}
                            </div>
                        ) : (
                            <div className="text-muted-foreground italic text-sm">{t('patient.profile.noDocuments', 'No documents uploaded.')}</div>
                        )}
                    </TabsContent>
                    
                    {/* Family History */}
                    <TabsContent value="familyHistory" className="mt-4">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <User className="h-5 w-5 text-primary" /> {t('patient.profile.familyHistory', 'Family History')}
                            </h3>
                            <Button size="sm" onClick={() => handleAddRecord('familyHistory')}>
                                <Plus className="h-4 w-4 mr-1" />
                                {t('common.add', 'Add')}
                            </Button>
                        </div>
                        {medicalRecordsData.familyHistory && medicalRecordsData.familyHistory.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {medicalRecordsData.familyHistory.map((fh, index) => renderRecordCard(fh, 'familyHistory', index))}
                            </div>
                        ) : (
                            <div className="text-muted-foreground italic text-sm">{t('patient.profile.noFamilyHistory', 'No family history recorded.')}</div>
                        )}
                    </TabsContent>
                    
                    {/* Social History */}
                    <TabsContent value="socialHistory" className="mt-4">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Home className="h-5 w-5 text-primary" /> {t('patient.profile.socialHistory', 'Social History')}
                            </h3>
                            <Button size="sm" onClick={() => handleAddRecord('socialHistory')}>
                                <Plus className="h-4 w-4 mr-1" />
                                {t('common.add', 'Add')}
                            </Button>
                        </div>
                        {medicalRecordsData.socialHistory && medicalRecordsData.socialHistory.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {medicalRecordsData.socialHistory.map((sh, index) => renderRecordCard(sh, 'socialHistory', index))}
                            </div>
                        ) : (
                            <div className="text-muted-foreground italic text-sm">{t('patient.profile.noSocialHistory', 'No social history recorded.')}</div>
                        )}
                    </TabsContent>
                    
                    {/* General History */}
                    <TabsContent value="generalHistory" className="mt-4">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Info className="h-5 w-5 text-primary" /> {t('patient.profile.generalHistory', 'General History')}
                            </h3>
                            <Button size="sm" onClick={() => handleAddRecord('generalHistory')}>
                                <Plus className="h-4 w-4 mr-1" />
                                {t('common.add', 'Add')}
                            </Button>
                        </div>
                        {medicalRecordsData.generalHistory && medicalRecordsData.generalHistory.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {medicalRecordsData.generalHistory.map((gh, index) => renderRecordCard(gh, 'generalHistory', index))}
                            </div>
                        ) : (
                            <div className="text-muted-foreground italic text-sm">{t('patient.profile.noGeneralHistory', 'No general history recorded.')}</div>
                        )}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );

    // Helper for active tab styling
    const getMedicalTabTriggerClass = (categoryId) =>
        activeMedicalTab === categoryId
            ? 'bg-primary text-primary-foreground font-semibold rounded-md'
            : 'bg-transparent text-foreground';

    // Custom hook to fetch and cache doctor names by ID
    function useDoctorName(doctorId) {
        const [name, setName] = React.useState('');
        React.useEffect(() => {
            let isMounted = true;
            async function fetchName() {
                if (!doctorId) {
                    if (isMounted) setName('Unknown');
                    return;
                }
                try {
                    const response = await getDoctorById(doctorId);
                    const doctor = response?.data;
                    const doctorName = `${doctor?.user?.firstName || ''} ${doctor?.user?.lastName || ''}`.trim();
                    if (isMounted) setName(doctorName || 'Unknown');
                } catch (e) {
                    if (isMounted) setName('Unknown');
                }
            }
            fetchName();
            return () => { isMounted = false; };
        }, [doctorId]);
        return name;
    }

    // Component to display doctor name by ID
    function DoctorName({ doctorId }) {
        const name = useDoctorName(doctorId);
        return <span className="text-xs text-muted-foreground">{name || 'Loading...'}</span>;
    }

    return (
        <div className="relative min-h-screen w-full overflow-x-hidden">
            <div className={gradientBg} />
            <div className="flex flex-col items-start max-w-screen-xl  ">
                <div className="w-full max-w-screen-2xl  sm:px-6 md:px-10 py-8">
                    {renderProfileHeader()}
                    <div className={`${glassCard} ${fadeIn} p-4 mb-8 w-full`}>
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className={`grid w-full grid-cols-4 gap-2 rounded-xl p-1 ${stickyTabs}`}> 
                                <TabsTrigger value="personal"
                                    style={activeTab === 'personal' ? {
                                        background: 'var(--color-primary)',
                                        color: 'var(--color-on-primary)',
                                        borderRadius: '0.5rem',
                                        fontWeight: 600
                                    } : {
                                        background: 'transparent',
                                        color: 'var(--color-foreground)'
                                    }}
                                >
                                    <span>{t('patient.profile.tabs.personal', 'Personal Info')}</span>
                                </TabsTrigger>
                                <TabsTrigger value="emergency"
                                    style={activeTab === 'emergency' ? {
                                        background: 'var(--color-primary)',
                                        color: 'var(--color-on-primary)',
                                        borderRadius: '0.5rem',
                                        fontWeight: 600
                                    } : {
                                        background: 'transparent',
                                        color: 'var(--color-foreground)'
                                    }}
                                >
                                    <span>{t('patient.profile.tabs.emergency', 'Emergency Contact')}</span>
                                </TabsTrigger>
                                <TabsTrigger value="insurance"
                                    style={activeTab === 'insurance' ? {
                                        background: 'var(--color-primary)',
                                        color: 'var(--color-on-primary)',
                                        borderRadius: '0.5rem',
                                        fontWeight: 600
                                    } : {
                                        background: 'transparent',
                                        color: 'var(--color-foreground)'
                                    }}
                                >
                                    <span>{t('patient.profile.tabs.insurance', 'Insurance')}</span>
                                </TabsTrigger>
                                <TabsTrigger value="medical"
                                    style={activeTab === 'medical' ? {
                                        background: 'var(--color-primary)',
                                        color: 'var(--color-on-primary)',
                                        borderRadius: '0.5rem',
                                        fontWeight: 600
                                    } : {
                                        background: 'transparent',
                                        color: 'var(--color-foreground)'
                                    }}
                                >
                                    <span>{t('patient.profile.tabs.medical', 'Medical File')}</span>
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                    <div className={`${glassCard} ${fadeIn} p-6 border border-border w-full`}>
                        {activeTab === 'personal' && <PersonalInfo patient={selectedPatient} />}
                        {activeTab === 'emergency' && <EmergencyContact patient={selectedPatient} />}
                        {activeTab === 'insurance' && <Insurance patient={selectedPatient} />}
                        {activeTab === 'medical' && renderMedicalFile()}
                    </div>
                </div>
            </div>
            {/* Doctor-only actions, e.g., PrescriptionForm */}
            <PrescriptionForm
                open={isPrescriptionModalOpen}
                onClose={() => setIsPrescriptionModalOpen(false)}
                onSubmit={() => {}}
                patient={selectedPatient}
            />
            {/* Dialogs */}
            {renderAddEditDialog(false)}
            {renderAddEditDialog(true)}
            {renderDeleteDialog()}
            
            {/* DICOM Viewer Dialog */}
            {dicomDialogOpen && selectedDicomImages.length > 0 && (
                <Dialog open={dicomDialogOpen} onOpenChange={setDicomDialogOpen}>
                    <DialogContent className="max-w-4xl w-full">
                        <DialogHeader>
                            <DialogTitle>{t('patient.profile.dicomViewer', 'DICOM Viewer')}</DialogTitle>
                        </DialogHeader>
                        <div className="w-full flex flex-col items-center">
                            <DicomViewer imageUrls={selectedDicomImages} />
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

export default function PatientPage() {
    return (
        <NotificationProvider>
            <PatientPageContent />
        </NotificationProvider>
    );
} 
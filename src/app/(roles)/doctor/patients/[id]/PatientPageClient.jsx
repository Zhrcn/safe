'use client';
import React, { useState, useEffect } from 'react';
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
    X
} from 'lucide-react';
import { useNotification, NotificationProvider } from '@/components/ui/Notification';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { patients } from '@/mockdata/patients';
import { doctors } from '@/mockdata/doctors';
import { prescriptions } from '@/mockdata/prescriptions';
import { medicalFiles } from '@/mockdata/medicalFiles';
import PersonalInfo from '@/components/patient/sections/PersonalInfo';
import MedicalHistory from '@/components/doctor/patient/MedicalHistory';
import Medications from '@/components/patient/sections/Medications';
import Appointments from '@/components/patient/sections/Appointments';
import Insurance from '@/components/patient/sections/Insurance';
import EmergencyContact from '@/components/patient/sections/EmergencyContact';
import { Button } from '@/components/ui/Button';
import { getPatientConsultations, answerConsultation } from '@/store/services/doctor/consultationsApi';
import { useTranslation } from 'react-i18next';

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
                                    errors.medication ? 'border-destructive' : 'border-input'
                                }`}
                            />
                            {errors.medication && (
                                <p className="mt-1 text-sm text-destructive">{errors.medication}</p>
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
                                    errors.dosage ? 'border-destructive' : 'border-input'
                                }`}
                            />
                            {errors.dosage && (
                                <p className="mt-1 text-sm text-destructive">{errors.dosage}</p>
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
                                    errors.frequency ? 'border-destructive' : 'border-input'
                                }`}
                            >
                                <option value="">{t('doctor.patientDetail.selectFrequency', 'Select frequency')}</option>
                                <option value="once">{t('doctor.patientDetail.onceDaily', 'Once daily')}</option>
                                <option value="twice">{t('doctor.patientDetail.twiceDaily', 'Twice daily')}</option>
                                <option value="thrice">{t('doctor.patientDetail.thriceDaily', 'Three times daily')}</option>
                                <option value="four">{t('doctor.patientDetail.fourTimesDaily', 'Four times daily')}</option>
                                <option value="as_needed">{t('doctor.patientDetail.asNeeded', 'As needed')}</option>
                            </select>
                            {errors.frequency && (
                                <p className="mt-1 text-sm text-destructive">{errors.frequency}</p>
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
                                    errors.duration ? 'border-destructive' : 'border-input'
                                }`}
                            />
                            {errors.duration && (
                                <p className="mt-1 text-sm text-destructive">{errors.duration}</p>
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
                                    errors.startDate ? 'border-destructive' : 'border-input'
                                }`}
                            />
                            {errors.startDate && (
                                <p className="mt-1 text-sm text-destructive">{errors.startDate}</p>
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
                                    errors.endDate ? 'border-destructive' : 'border-input'
                                }`}
                            />
                            {errors.endDate && (
                                <p className="mt-1 text-sm text-destructive">{errors.endDate}</p>
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
                            {t('doctor.patientDetail.notes', 'Notes')}
                        </label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows={2}
                            className="w-full px-3 py-2 bg-background text-foreground border border-input rounded-md transition-colors"
                        />
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                        >
                            {t('common.cancel', 'Cancel')}
                        </Button>
                        <Button type="submit">
                            {t('doctor.patientDetail.createPrescription', 'Create Prescription')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const PatientPageContent = ({ id }) => {
    const { t } = useTranslation();
    const router = useRouter();
    const { showNotification } = useNotification();
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(0);
    const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
    const [consultations, setConsultations] = useState([]);
    const [loadingConsultations, setLoadingConsultations] = useState(false);

    useEffect(() => {
        const loadPatient = async () => {
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                const foundPatient = patients.find(p => p.id === parseInt(id));
                if (foundPatient) {
                    setPatient(foundPatient);
                } else {
                    showNotification('Patient not found', 'error');
                    router.push('/doctor/patients');
                }
            } catch (error) {
                console.error('Error loading patient:', error);
                showNotification('Error loading patient data', 'error');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadPatient();
        }
    }, [id, router, showNotification]);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleFavoriteToggle = () => {
        setPatient(prev => ({
            ...prev,
            isFavorite: !prev.isFavorite
        }));
    };

    const handleCreatePrescription = (prescriptionData) => {
        const newPrescription = {
            id: Date.now(),
            patientId: patient.id,
            doctorId: 1, // Current doctor
            ...prescriptionData,
            status: 'active',
            createdAt: new Date().toISOString()
        };
        
        showNotification('Prescription created successfully', 'success');
        // Here you would typically save to API
        console.log('New prescription:', newPrescription);
    };

    const handleSendMessage = () => {
        router.push(`/doctor/messaging?patient=${patient.id}`);
    };

    useEffect(() => {
        const loadConsultations = async () => {
            if (!patient) return;
            
            setLoadingConsultations(true);
            try {
                const response = await getPatientConsultations(patient.id);
                setConsultations(response.data || []);
            } catch (error) {
                console.error('Error loading consultations:', error);
                showNotification('Error loading consultations', 'error');
            } finally {
                setLoadingConsultations(false);
            }
        };

        loadConsultations();
    }, [patient, showNotification]);

    const handleAnswerChange = (consultationId, value) => {
        setConsultations(prev => 
            prev.map(consultation => 
                consultation.id === consultationId 
                    ? { ...consultation, answer: value }
                    : consultation
            )
        );
    };

    const handleAnswerSubmit = async (consultationId) => {
        try {
            const consultation = consultations.find(c => c.id === consultationId);
            if (!consultation?.answer) {
                showNotification('Please provide an answer', 'error');
                return;
            }

            await answerConsultation(consultationId, { answer: consultation.answer });
            showNotification('Answer submitted successfully', 'success');
            
            // Reload consultations
            const response = await getPatientConsultations(patient.id);
            setConsultations(response.data || []);
        } catch (error) {
            console.error('Error submitting answer:', error);
            showNotification('Error submitting answer', 'error');
        }
    };

    const handleChat = (consultation) => {
        router.push(`/doctor/messaging?consultation=${consultation.id}`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!patient) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-foreground mb-4">Patient Not Found</h2>
                    <Button onClick={() => router.push('/doctor/patients')}>
                        Back to Patients
                    </Button>
                </div>
            </div>
        );
    }

    const tabs = [
        { label: t('doctor.patientDetail.personalInfo', 'Personal Info'), icon: User },
        { label: t('doctor.patientDetail.medicalHistory', 'Medical History'), icon: History },
        { label: t('doctor.patientDetail.medications', 'Medications'), icon: Pill },
        { label: t('doctor.patientDetail.appointments', 'Appointments'), icon: CalendarDays },
        { label: t('doctor.patientDetail.consultations', 'Consultations'), icon: MessageCircle },
        { label: t('doctor.patientDetail.insurance', 'Insurance'), icon: Shield },
        { label: t('doctor.patientDetail.emergencyContact', 'Emergency Contact'), icon: Phone }
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-card border-b border-border">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="ghost"
                                onClick={() => router.push('/doctor/patients')}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                ← {t('common.back', 'Back')}
                            </Button>
                            <div>
                                <h1 className="text-2xl font-bold text-foreground">
                                    {patient.firstName} {patient.lastName}
                                </h1>
                                <p className="text-muted-foreground">Patient ID: {patient.id}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Button
                                variant={patient.isFavorite ? "default" : "outline"}
                                onClick={handleFavoriteToggle}
                                className="flex items-center space-x-2"
                            >
                                <Star className={`w-4 h-4 ${patient.isFavorite ? 'fill-current' : ''}`} />
                                <span>{patient.isFavorite ? t('common.favorited', 'Favorited') : t('common.favorite', 'Favorite')}</span>
                            </Button>
                            <Button
                                onClick={handleSendMessage}
                                className="flex items-center space-x-2"
                            >
                                <MessageCircle className="w-4 h-4" />
                                <span>{t('common.message', 'Message')}</span>
                            </Button>
                            <Button
                                onClick={() => setShowPrescriptionForm(true)}
                                className="flex items-center space-x-2"
                            >
                                <Plus className="w-4 h-4" />
                                <span>{t('doctor.patientDetail.newPrescription', 'New Prescription')}</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-6">
                {/* Tabs */}
                <div className="mb-6">
                    <div className="flex space-x-1 bg-muted rounded-lg p-1">
                        {tabs.map((tab, index) => {
                            const Icon = tab.icon;
                            return (
                                <Button
                                    key={index}
                                    variant={activeTab === index ? "default" : "ghost"}
                                    onClick={() => handleTabChange(null, index)}
                                    className="flex items-center space-x-2"
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{tab.label}</span>
                                </Button>
                            );
                        })}
                    </div>
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {activeTab === 0 && <PersonalInfo patient={patient} />}
                        {activeTab === 1 && <MedicalHistory patient={patient} />}
                        {activeTab === 2 && <Medications patient={patient} />}
                        {activeTab === 3 && <Appointments patient={patient} />}
                        {activeTab === 4 && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">{t('doctor.patientDetail.consultations', 'Consultations')}</h3>
                                {loadingConsultations ? (
                                    <div className="flex items-center justify-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                    </div>
                                ) : consultations.length > 0 ? (
                                    <div className="space-y-4">
                                        {consultations.map((consultation) => (
                                            <div key={consultation.id} className="bg-card border border-border rounded-lg p-4">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <h4 className="font-semibold">{consultation.subject}</h4>
                                                        <p className="text-sm text-muted-foreground">
                                                            {new Date(consultation.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleChat(consultation)}
                                                        >
                                                            {t('common.chat', 'Chat')}
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleAnswerSubmit(consultation.id)}
                                                        >
                                                            {t('common.submit', 'Submit')}
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    <div>
                                                        <label className="block text-sm font-medium mb-1">
                                                            {t('doctor.patientDetail.question', 'Question')}:
                                                        </label>
                                                        <p className="text-sm bg-muted p-3 rounded">{consultation.question}</p>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium mb-1">
                                                            {t('doctor.patientDetail.answer', 'Answer')}:
                                                        </label>
                                                        <textarea
                                                            value={consultation.answer || ''}
                                                            onChange={(e) => handleAnswerChange(consultation.id, e.target.value)}
                                                            className="w-full p-3 border border-input rounded-md bg-background text-foreground"
                                                            rows={3}
                                                            placeholder={t('doctor.patientDetail.enterAnswer', 'Enter your answer...')}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        {t('doctor.patientDetail.noConsultations', 'No consultations found')}
                                    </div>
                                )}
                            </div>
                        )}
                        {activeTab === 5 && <Insurance patient={patient} />}
                        {activeTab === 6 && <EmergencyContact patient={patient} />}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Prescription Form Modal */}
            <PrescriptionForm
                open={showPrescriptionForm}
                onClose={() => setShowPrescriptionForm(false)}
                onSubmit={handleCreatePrescription}
                patient={patient}
            />
        </div>
    );
};

export default function PatientPageClient({ id }) {
    return (
        <NotificationProvider>
            <PatientPageContent id={id} />
        </NotificationProvider>
    );
} 
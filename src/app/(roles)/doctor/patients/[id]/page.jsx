'use client';
import React, { useState, useEffect } from 'react';
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
    X
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
                        onClick={onClose}
                        className="px-4 py-2 text-foreground hover:bg-muted rounded-md transition-colors"
                    >
                        {t('doctor.patientDetail.cancel', 'Cancel')}
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-primary text-primary-foreground hover:opacity-90 rounded-md transition-colors"
                    >
                        {t('doctor.patientDetail.createPrescription', 'Create Prescription')}
                    </Button>
                </div>
            </div>
        </div>
    );
}
const PatientPageContent = () => {
    const params = useParams();
    const router = useRouter();
    const { showNotification } = useNotification();
    const dispatch = useAppDispatch();
    const { selectedPatient, loading, error } = useAppSelector((state) => state.doctorPatients);
    const [activeTab, setActiveTab] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
    const [answerInputs, setAnswerInputs] = useState({});
    
    useEffect(() => {
        if (params.id) {
            dispatch(fetchPatientById(params.id));
        }
    }, [dispatch, params.id]);
    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };
    const handleFavoriteToggle = () => {
        setIsFavorite(!isFavorite);
        showNotification(
            isFavorite ? 'Removed from favorites' : 'Added to favorites',
            'success'
        );
    };
    const handleCreatePrescription = (prescriptionData) => {
        console.log('Creating prescription:', prescriptionData);
        showNotification('Prescription created successfully', 'success');
    };
    const handleSendMessage = () => {
        router.push(`/chat/${selectedPatient?.id || selectedPatient?._id}`);
    };
    const [patientConsultations, setPatientConsultations] = useState([]);
    const [consultationsLoading, setConsultationsLoading] = useState(false);

    useEffect(() => {
        const loadConsultations = async () => {
            if (selectedPatient?.id || selectedPatient?._id) {
                setConsultationsLoading(true);
                try {
                    const consultations = await getPatientConsultations(selectedPatient.id || selectedPatient._id);
                    setPatientConsultations(consultations);
                } catch (error) {
                    console.error('Failed to load consultations:', error);
                    showNotification('Failed to load consultations', 'error');
                } finally {
                    setConsultationsLoading(false);
                }
            }
        };
        loadConsultations();
    }, [selectedPatient?.id, selectedPatient?._id]);

    const handleAnswerChange = (consultationId, value) => {
        setAnswerInputs(prev => ({ ...prev, [consultationId]: value }));
    };

    const handleAnswerSubmit = async (consultationId) => {
        const answer = answerInputs[consultationId];
        if (!answer?.trim()) return;

        try {
            await answerConsultation(consultationId, answer);
            showNotification('Answer submitted successfully!', 'success');
            setAnswerInputs(prev => ({ ...prev, [consultationId]: '' }));
            const consultations = await getPatientConsultations(selectedPatient.id || selectedPatient._id);
            setPatientConsultations(consultations);
        } catch (error) {
            console.error('Failed to submit answer:', error);
            showNotification('Failed to submit answer', 'error');
        }
    };
    const handleChat = (consultation) => {
        router.push(`/chat/${consultation.patientId}`);
    };
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }
    if (error) {
        return (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-destructive">{error}</p>
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
                    <Button 
                        onClick={() => router.push('/doctor/patients')}
                        className="bg-primary text-primary-foreground hover:opacity-90"
                    >
                        Back to Patients List
                    </Button>
                </div>
            </div>
        );
    }
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-card text-card-foreground rounded-2xl shadow-lg overflow-hidden border border-border">
                <div className="p-6 border-b border-border">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <img
                                    src={selectedPatient.user?.profilePicture || selectedPatient.profileImage || '/default-avatar.png'}
                                    alt={selectedPatient.user?.name || selectedPatient.firstName}
                                    className="w-16 h-16 rounded-full object-cover border-2 border-border"
                                />
                                <span className="absolute bottom-0 right-0 w-4 h-4 bg-success border-2 border-background rounded-full"></span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-foreground">
                                    {selectedPatient.user?.name || `${selectedPatient.firstName || ''} ${selectedPatient.lastName || ''}`.trim()}
                                </h1>
                                <p className="text-muted-foreground">Patient ID: {selectedPatient.id || selectedPatient._id}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                onClick={handleFavoriteToggle}
                                className={`p-2 rounded-full transition-colors ${
                                    isFavorite ? 'text-yellow-500' : 'text-muted-foreground'
                                } hover:bg-muted`}
                            >
                                <Star className="w-5 h-5" />
                            </Button>
                            <Button
                                onClick={() => setIsPrescriptionModalOpen(true)}
                                className="flex items-center px-4 py-2 bg-primary text-primary-foreground hover:opacity-90 rounded-md transition-colors"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                New Prescription
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="border-b border-border">
                    <div className="flex space-x-8 px-6">
                        {['Personal Info', 'Medical History', 'Medications', 'Appointments', 'Insurance', 'Emergency Contact', 'Consultations'].map((tab, index) => (
                            <Button
                                key={tab}
                                onClick={() => setActiveTab(index)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                    activeTab === index
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                                }`}
                            >
                                {tab}
                            </Button>
                        ))}
                    </div>
                </div>
                <div className="p-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeTab === 0 && <PersonalInfo patient={selectedPatient} />}
                            {activeTab === 1 && <MedicalHistory patient={selectedPatient} />}
                            {activeTab === 2 && <Medications patient={selectedPatient} />}
                            {activeTab === 3 && <Appointments patient={selectedPatient} />}
                            {activeTab === 4 && <Insurance patient={selectedPatient} />}
                            {activeTab === 5 && <EmergencyContact patient={selectedPatient} />}
                            {activeTab === 6 && (
                                <div>
                                    <h2 className="text-xl font-bold mb-4">Consultations</h2>
                                    {consultationsLoading ? (
                                        <div className="flex items-center justify-center py-8">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                        </div>
                                    ) : patientConsultations.length === 0 ? (
                                        <div className="text-muted-foreground">No consultations for this patient.</div>
                                    ) : (
                                        <div className="space-y-6">
                                            {patientConsultations.map((consultation) => (
                                                <div key={consultation._id} className="bg-muted rounded-2xl p-4 border border-border flex flex-col gap-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <User className="w-5 h-5 text-primary" />
                                                            <span className="font-semibold">Initial Question:</span>
                                                        </div>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                            consultation.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                            consultation.status === 'Answered' ? 'bg-green-100 text-green-800' :
                                                            'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {consultation.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-foreground bg-background p-3 rounded-md">
                                                        {consultation.question}
                                                    </p>
                                                    
                                                    {consultation.messages && consultation.messages.length > 0 && (
                                                        <div className="space-y-3">
                                                            <h4 className="font-medium text-sm">Conversation History:</h4>
                                                            <div className="max-h-48 overflow-y-auto space-y-2">
                                                                {consultation.messages.slice(1).map((message, index) => (
                                                                    <div
                                                                        key={index}
                                                                        className={`flex ${message.sender === 'patient' ? 'justify-start' : 'justify-end'}`}
                                                                    >
                                                                        <div
                                                                            className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                                                                                message.sender === 'patient'
                                                                                    ? 'bg-blue-100 text-blue-900'
                                                                                    : 'bg-green-100 text-green-900'
                                                                            }`}
                                                                        >
                                                                            <p>{message.message}</p>
                                                                            <p className="text-xs mt-1 opacity-70">
                                                                                {new Date(message.timestamp).toLocaleString()}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {consultation.status === 'Pending' && (
                                                        <div className="flex items-center gap-2">
                                                            <MessageCircle className="w-5 h-5 text-muted-foreground" />
                                                            <span className="font-semibold text-sm">Your Answer:</span>
                                                            <input
                                                                type="text"
                                                                value={answerInputs[consultation._id] || ''}
                                                                onChange={e => handleAnswerChange(consultation._id, e.target.value)}
                                                                placeholder="Type your answer..."
                                                                className="border rounded px-3 py-2 text-sm flex-1"
                                                            />
                                                            <Button
                                                                size="sm"
                                                                onClick={() => handleAnswerSubmit(consultation._id)}
                                                                disabled={!answerInputs[consultation._id]?.trim()}
                                                            >
                                                                Submit
                                                            </Button>
                                                        </div>
                                                    )}

                                                    <div className="flex items-center justify-between pt-2 border-t border-border">
                                                        <span className="text-xs text-muted-foreground">
                                                            Created: {new Date(consultation.createdAt).toLocaleDateString()}
                                                        </span>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleChat(consultation)}
                                                        >
                                                            <MessageCircle className="w-4 h-4 mr-1" />
                                                            Chat
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
            {console.log('Patient medicalHistory being passed to MedicalHistory:', selectedPatient?.medicalHistory)}
            <PrescriptionForm
                open={isPrescriptionModalOpen}
                onClose={() => setIsPrescriptionModalOpen(false)}
                onSubmit={handleCreatePrescription}
                patient={selectedPatient}
            />
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
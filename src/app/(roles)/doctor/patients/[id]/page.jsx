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
function PrescriptionForm({ open, onClose, onSubmit, patient }) {
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
        if (!formData.medication) newErrors.medication = 'Medication is required';
        if (!formData.dosage) newErrors.dosage = 'Dosage is required';
        if (!formData.frequency) newErrors.frequency = 'Frequency is required';
        if (!formData.duration) newErrors.duration = 'Duration is required';
        if (!formData.startDate) newErrors.startDate = 'Start date is required';
        if (!formData.endDate) newErrors.endDate = 'End date is required';
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
            <div className="bg-card text-card-foreground rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-lg border border-border">
                <div className="p-6 border-b border-border">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">New Prescription</h2>
                        <button 
                            onClick={onClose} 
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Medication
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
                                Dosage
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
                                Frequency
                            </label>
                            <select
                                name="frequency"
                                value={formData.frequency}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 bg-background text-foreground border rounded-md transition-colors ${
                                    errors.frequency ? 'border-destructive' : 'border-input'
                                }`}
                            >
                                <option value="">Select frequency</option>
                                <option value="once">Once daily</option>
                                <option value="twice">Twice daily</option>
                                <option value="thrice">Three times daily</option>
                                <option value="four">Four times daily</option>
                                <option value="as_needed">As needed</option>
                            </select>
                            {errors.frequency && (
                                <p className="mt-1 text-sm text-destructive">{errors.frequency}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Duration
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
                                Start Date
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
                                End Date
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
                            Instructions
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
                            Additional Notes
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
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-foreground hover:bg-muted rounded-md transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-primary text-primary-foreground hover:opacity-90 rounded-md transition-colors"
                    >
                        Create Prescription
                    </button>
                </div>
            </div>
        </div>
    );
}
const PatientPageContent = () => {
    const params = useParams();
    const router = useRouter();
    const { showNotification } = useNotification();
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
    useEffect(() => {
        const loadPatient = async () => {
            try {
                setLoading(true);
                setError(null);
                const foundPatient = patients.find(p => p.id === params.id);
                if (!foundPatient) {
                    throw new Error('Patient not found');
                }
                const medicalFile = medicalFiles.find(file => file.patientId === foundPatient.user.id);
                console.log('Found Patient:', foundPatient); 
                console.log('Found Medical File:', medicalFile); 
                const combinedPatientData = {
                    ...foundPatient,
                    medicalHistory: medicalFile ? {
                        allergies: medicalFile.allergies || [],
                        chronicConditions: medicalFile.chronicConditions || [],
                        labResults: medicalFile.labResults || [],
                        imagingReports: medicalFile.imagingReports || [],
                        vitalSigns: medicalFile.vitalSigns || [],
                        medicationHistory: medicalFile.medicationHistory || [],
                        immunizations: medicalFile.immunizations || [],
                        surgicalHistory: medicalFile.surgicalHistory || [],
                        diagnoses: medicalFile.diagnoses || [],
                        socialHistory: medicalFile.socialHistory || {},
                        familyMedicalHistory: medicalFile.familyMedicalHistory || [],
                        generalMedicalHistory: medicalFile.generalMedicalHistory || [],
                        emergencyContact: medicalFile.emergencyContact || {},
                        insuranceDetails: medicalFile.insuranceDetails || {},
                        bloodType: medicalFile.bloodType,
                        status: medicalFile.status,
                        attachedDocuments: medicalFile.attachedDocuments || []
                    } : {
                        allergies: [],
                        chronicConditions: [],
                        labResults: [],
                        imagingReports: [],
                        vitalSigns: [],
                        medicationHistory: [],
                        immunizations: [],
                        surgicalHistory: [],
                        diagnoses: [],
                        socialHistory: {},
                        familyMedicalHistory: [],
                        generalMedicalHistory: [],
                        emergencyContact: {},
                        insuranceDetails: {},
                        bloodType: '',
                        status: '',
                        attachedDocuments: []
                    }
                };
                console.log('Combined Patient Data:', combinedPatientData); 
                setPatient(combinedPatientData);
            } catch (error) {
                console.error('Error loading patient:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        loadPatient();
    }, [params.id]);
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
        setPatient(prev => ({
            ...prev,
            medications: [
                ...prev.medications,
                {
                    id: Date.now().toString(),
                    ...prescriptionData,
                    status: 'active',
                    prescribedBy: 'Dr. John Doe', 
                    prescribedAt: new Date().toISOString()
                }
            ]
        }));
    };
    const handleSendMessage = () => {
        router.push(`/chat/${patient.id}`);
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
    if (!patient) {
        return (
            <div className="p-4 bg-muted border border-border rounded-md">
                <p className="text-muted-foreground">Patient not found</p>
            </div>
        );
    }
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-card text-card-foreground rounded-lg shadow-lg overflow-hidden border border-border">
                {}
                <div className="p-6 border-b border-border">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <img
                                    src={patient.user?.profilePicture || '/default-avatar.png'}
                                    alt={patient.user?.name}
                                    className="w-16 h-16 rounded-full object-cover border-2 border-border"
                                />
                                <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-background rounded-full"></span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-foreground">{patient.user?.name}</h1>
                                <p className="text-muted-foreground">Patient ID: {patient.id}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={handleFavoriteToggle}
                                className={`p-2 rounded-full transition-colors ${
                                    isFavorite ? 'text-yellow-500' : 'text-muted-foreground'
                                } hover:bg-muted`}
                            >
                                <Star className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setIsPrescriptionModalOpen(true)}
                                className="flex items-center px-4 py-2 bg-primary text-primary-foreground hover:opacity-90 rounded-md transition-colors"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                New Prescription
                            </button>
                        </div>
                    </div>
                </div>
                {}
                <div className="border-b border-border">
                    <div className="flex space-x-8 px-6">
                        {['Personal Info', 'Medical History', 'Medications', 'Appointments', 'Insurance', 'Emergency Contact'].map((tab, index) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(index)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                    activeTab === index
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
                {}
                <div className="p-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                    {activeTab === 0 && <PersonalInfo patient={patient} />}
                            {activeTab === 1 && (
                                <MedicalHistory patient={patient} />
                            )}
                    {activeTab === 2 && <Medications patient={patient} />}
                            {activeTab === 3 && <Appointments patient={patient} />}
                            {activeTab === 4 && <Insurance patient={patient} />}
                            {activeTab === 5 && <EmergencyContact patient={patient} />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
            {console.log('Patient medicalHistory being passed to MedicalHistory:', patient?.medicalHistory)}
            {}
            <PrescriptionForm
                open={isPrescriptionModalOpen}
                onClose={() => setIsPrescriptionModalOpen(false)}
                onSubmit={handleCreatePrescription}
                patient={patient}
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
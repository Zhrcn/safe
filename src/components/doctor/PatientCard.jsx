'use client';
import { useState } from 'react';
import {
    MoreVertical,
    User,
    Calendar,
    FileText,
    Pill,
    Activity,
    Send,
    Edit,
    Trash2,
    MessageCircle,
    Eye
} from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import AddPatientForm from './AddPatientForm';
import PrescriptionForm from './PrescriptionForm';
import PatientConditionForm from './PatientConditionForm';
import ReferralForm from './ReferralForm';
export default function PatientCard({ patient }) {
    const router = useRouter();
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [activeDialog, setActiveDialog] = useState(null);
    const handleMenuOpen = (event) => {
        setMenuAnchor(event.currentTarget);
    };
    const handleMenuClose = () => {
        setMenuAnchor(null);
    };
    const handleOpenDialog = (dialogType) => {
        setActiveDialog(dialogType);
        handleMenuClose();
    };
    const handleCloseDialog = () => {
        setActiveDialog(null);
    };
    const handleViewPatient = () => {
        router.push(`/doctor/patients/${patient.id}`);
    };
    const getStatusChipClass = (status) => {
        switch(status.toLowerCase()) {
            case 'active':
                return 'bg-green-100 text-green-700';
            case 'urgent':
                return 'bg-red-100 text-red-700';
            case 'inactive':
                return 'bg-gray-100 text-gray-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };
    const getInitials = (patient) => {
        const name = `${patient.user?.firstName || ''} ${patient.user?.lastName || ''}`.trim();
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase();
    };
    return (
        <>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="p-4 flex items-center border-b border-gray-200">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-lg font-bold">
                        {getInitials(patient)}
                    </div>
                    <div className="ml-3 flex-grow">
                        <h3 className="text-lg font-medium text-gray-900">
                            {`${patient.user?.firstName || ''} ${patient.user?.lastName || ''}`.trim()}
                        </h3>
                        <p className="text-sm text-gray-600">
                            {patient.age} years • {patient.gender}
                        </p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusChipClass(patient.user?.isActive ? 'active' : 'inactive')}`}>
                        {patient.user?.isActive ? 'active' : 'inactive'}
                    </span>
                </div>
                <div className="p-4">
                    <p className="text-gray-900 font-medium mb-2">
                        Condition
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                        {patient.condition}
                    </p>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                        <div>
                            <p className="text-xs text-gray-500">
                                Medical ID
                            </p>
                            <p className="text-sm text-gray-900">
                                {patient.medicalId || 'N/A'}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">
                                Last Visit
                            </p>
                            <p className="text-sm text-gray-900">
                                {patient.lastAppointment ? format(new Date(patient.lastAppointment), 'MMM dd, yyyy') : 'None'}
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-between items-center space-x-2">
                        <button
                            type="button"
                            className="flex items-center px-3 py-1.5 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                            onClick={handleViewPatient}
                        >
                            <Eye className="h-4 w-4 mr-1" /> View Patient
                        </button>
                        <button
                            type="button"
                            className="flex items-center px-3 py-1.5 rounded-md text-sm font-medium text-blue-600 border border-blue-600 hover:bg-blue-50"
                            onClick={() => handleOpenDialog('condition')}
                        >
                            <Activity className="h-4 w-4 mr-1" /> Update
                        </button>
                        <button
                            type="button"
                            className="flex items-center px-3 py-1.5 rounded-md text-sm font-medium text-blue-600 border border-blue-600 hover:bg-blue-50"
                            onClick={() => handleOpenDialog('prescription')}
                        >
                            <FileText className="h-4 w-4 mr-1" /> Prescribe
                        </button>
                        <button
                            type="button"
                            onClick={handleMenuOpen}
                            className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100"
                        >
                            <MoreVertical className="h-5 w-5" />
                        </button>
                        {Boolean(menuAnchor) && (
                            <div
                                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-10"
                                style={{ top: menuAnchor.offsetTop + menuAnchor.offsetHeight, left: menuAnchor.offsetLeft - 170 }}
                                onBlur={handleMenuClose}
                            >
                                <button
                                    onClick={() => handleOpenDialog('edit')}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                >
                                    <Edit className="h-4 w-4 mr-2 text-gray-500" />Edit Patient
                                </button>
                                <button
                                    onClick={() => handleOpenDialog('referral')}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                >
                                    <Send className="h-4 w-4 mr-2 text-gray-500" />Create Referral
                                </button>
                                <button
                                    onClick={() => window.location.href = `/doctor/messaging`}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                >
                                    <MessageCircle className="h-4 w-4 mr-2 text-gray-500" />Send Message
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {}
            {activeDialog === 'edit' && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
                    <div className="relative p-6 bg-white rounded-lg shadow-xl max-w-md mx-auto">
                        <AddPatientForm 
                            onClose={handleCloseDialog} 
                            patientId={patient.id}
                            initialData={patient}
                            isEdit={true}
                        />
                    </div>
                </div>
            )}
            {}
            {activeDialog === 'prescription' && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
                    <div className="relative p-6 bg-white rounded-lg shadow-xl max-w-2xl mx-auto">
                        <PrescriptionForm 
                            patientId={patient.id} 
                            patientName={`${patient.user?.firstName} ${patient.user?.lastName}`} 
                            onClose={handleCloseDialog}
                        />
                    </div>
                </div>
            )}
            {}
            {activeDialog === 'condition' && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
                    <div className="relative p-6 bg-white rounded-lg shadow-xl max-w-md mx-auto">
                        <PatientConditionForm 
                            patientId={patient.id} 
                            onClose={handleCloseDialog}
                            initialData={{
                                currentCondition: patient.condition,
                                notes: ''
                            }}
                        />
                    </div>
                </div>
            )}
            {}
            {activeDialog === 'referral' && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
                    <div className="relative p-6 bg-white rounded-lg shadow-xl max-w-md mx-auto">
                        <ReferralForm 
                            patientId={patient.id} 
                            patientName={`${patient.user?.firstName} ${patient.user?.lastName}`} 
                            onClose={handleCloseDialog}
                        />
                    </div>
                </div>
            )}
        </>
    );
} 
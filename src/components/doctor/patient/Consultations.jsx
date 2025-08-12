import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Plus as AddIcon,
    Edit as EditIcon,
    Paperclip as AttachmentIcon
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useDispatch, useSelector } from 'react-redux';
import { fetchConsultationsByDoctorAndPatient } from '@/store/slices/patient/consultationsSlice';

const Consultations = ({ patientId }) => {
    const { user } = useAuth();
    const doctorId = user?._id || user?.id;
    const dispatch = useDispatch();
    const { consultations, loading, error } = useSelector(state => state.consultations);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedConsultation, setSelectedConsultation] = useState(null);
    const [note, setNote] = useState('');

    useEffect(() => {
        if (!patientId || !doctorId) return;
        dispatch(fetchConsultationsByDoctorAndPatient(patientId));
    }, [dispatch, patientId, doctorId]);

    const handleOpenDialog = (consultation = null) => {
        setSelectedConsultation(consultation);
        setOpenDialog(true);
    };
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedConsultation(null);
        setNote('');
    };
    const handleAddNote = () => {
        setNote('');
    };
    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };
    const getStatusColorClass = (status) => {
        switch (status) {
            case 'scheduled':
                return 'bg-blue-100 text-blue-800';
            case 'in-progress':
                return 'bg-yellow-100 text-yellow-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    if (loading) {
        return (
            <div className="flex justify-center items-center h-48">
                <p className="text-gray-500">Loading consultations...</p>
            </div>
        );
    }
    if (error) {
        return <div className="text-red-500">{error}</div>;
    }
    return (
        <div className="p-4 bg-white rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Consultations</h2>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenDialog()}
                >
                    <AddIcon className="h-5 w-5 mr-2" />
                    New Consultation
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {consultations.length === 0 ? (
                    <div className="text-gray-500 text-center py-8 col-span-full">No consultations found.</div>
                ) : (
                    consultations.map((consultation, index) => (
                        <div key={consultation._id || consultation.id} className="bg-gray-50 rounded-xl shadow p-4 flex flex-col gap-2 border border-gray-200">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="font-semibold text-base text-primary">Doctor:</span>
                                <span className="text-base text-gray-900">{consultation.doctor?.firstName || consultation.doctorName || 'Unknown'} {consultation.doctor?.lastName || ''}</span>
                            </div>
                            <div className="mb-1">
                                <span className="font-semibold text-sm text-gray-700">Question:</span>
                                <span className="ml-2 text-gray-800">{consultation.question || 'No question provided.'}</span>
                            </div>
                            <div className="mb-1">
                                <span className="font-semibold text-sm text-gray-700">Status:</span>
                                <span className="ml-2 text-gray-800">{consultation.status}</span>
                            </div>
                            <div className="mb-1">
                                <span className="font-semibold text-sm text-gray-700">Messages:</span>
                                <ul className="ml-4 mt-1 list-disc text-gray-700">
                                    {consultation.messages && consultation.messages.length > 0 ? (
                                        consultation.messages.map((m, i) => (
                                            <li key={i}><b>{m.sender}:</b> {m.message}</li>
                                        ))
                                    ) : (
                                        <li className="italic text-gray-400">No messages</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    ))
                )}
            </div>
            {openDialog && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
                    <div className="relative p-6 bg-white rounded-2xl shadow-xl max-w-md mx-auto">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            {selectedConsultation ? 'Edit Consultation' : 'New Consultation'}
                        </h3>
                        <form className="space-y-4">
                            <div>
                                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
                                <textarea
                                    id="notes"
                                    rows="4"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                ></textarea>
                            </div>
                        </form>
                        <div className="mt-6 flex justify-end space-x-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCloseDialog}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="default"
                                size="sm"
                                onClick={handleAddNote}
                            >
                                {selectedConsultation ? 'Update' : 'Create'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default Consultations; 
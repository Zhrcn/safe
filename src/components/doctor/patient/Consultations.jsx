import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Plus as AddIcon,
    Edit as EditIcon,
    Paperclip as AttachmentIcon
} from 'lucide-react';
import { fetchConsultationsByPatient, createConsultation, updateConsultation, addConsultationNote } from '../../../store/slices/doctor/doctorConsultationsSlice';
import { Button } from '@/components/ui/Button';
const Consultations = ({ patientId }) => {
    const dispatch = useDispatch();
    const { consultations, loading } = useSelector((state) => state.doctorConsultations);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedConsultation, setSelectedConsultation] = useState(null);
    const [note, setNote] = useState('');
    useEffect(() => {
        dispatch(fetchConsultationsByPatient(patientId));
    }, [dispatch, patientId]);
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
        if (selectedConsultation && note.trim()) {
            dispatch(addConsultationNote({
                consultationId: selectedConsultation.id,
                note: note.trim()
            }));
            setNote('');
        }
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
            <div className="divide-y divide-gray-200">
                {consultations.map((consultation, index) => (
                    <div key={consultation.id} className="py-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-lg font-medium text-gray-900">
                                    {formatDate(consultation.date)}
                                </p>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${getStatusColorClass(consultation.status)}`}>
                                    {consultation.status}
                                </span>
                            </div>
                            <div className="flex space-x-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleOpenDialog(consultation)}
                                >
                                    <EditIcon className="h-5 w-5" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                >
                                    <AttachmentIcon className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                            {consultation.notes}
                        </p>
                        {consultation.attachments?.length > 0 && (
                            <div className="mt-2">
                                <p className="text-sm text-gray-600">
                                    Attachments:
                                </p>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {consultation.attachments.map((attachment) => (
                                        <a
                                            key={attachment.id}
                                            href={attachment.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
                                        >
                                            <AttachmentIcon className="h-3 w-3 mr-1" />
                                            {attachment.name}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
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
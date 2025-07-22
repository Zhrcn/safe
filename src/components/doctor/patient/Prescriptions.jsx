import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Plus as AddIcon,
    Edit as EditIcon,
    Printer as PrinterIcon
} from 'lucide-react';
import { fetchPrescriptionsByPatient, createPrescription, updatePrescription } from '../../../store/slices/doctor/doctorPrescriptionsSlice';
import { Button } from '@/components/ui/Button';

const Prescriptions = ({ patientId }) => {
    const dispatch = useDispatch();
    const { prescriptions, loading } = useSelector((state) => state.doctorPrescriptions);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    const [formData, setFormData] = useState({
        medication: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: '',
        status: 'active'
    });

    useEffect(() => {
        dispatch(fetchPrescriptionsByPatient(patientId));
    }, [dispatch, patientId]);

    const handleOpenDialog = (prescription = null) => {
        if (prescription) {
            setSelectedPrescription(prescription);
            setFormData({
                medication: prescription.medication,
                dosage: prescription.dosage,
                frequency: prescription.frequency,
                duration: prescription.duration,
                instructions: prescription.instructions,
                status: prescription.status
            });
        } else {
            setSelectedPrescription(null);
            setFormData({
                medication: '',
                dosage: '',
                frequency: '',
                duration: '',
                instructions: '',
                status: 'active'
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedPrescription(null);
        setFormData({
            medication: '',
            dosage: '',
            frequency: '',
            duration: '',
            instructions: '',
            status: 'active'
        });
    };

    const handleSubmit = () => {
        const prescriptionData = {
            ...formData,
            patientId,
            date: new Date().toISOString()
        };
        if (selectedPrescription) {
            dispatch(updatePrescription({
                id: selectedPrescription.id,
                ...prescriptionData
            }));
        } else {
            dispatch(createPrescription(prescriptionData));
        }
        handleCloseDialog();
    };

    const handlePrint = (prescription) => {};

    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getStatusColorClass = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'completed':
                return 'bg-blue-100 text-blue-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-24">
                <p className="text-gray-500 text-sm">Loading prescriptions...</p>
            </div>
        );
    }

    return (
        <div className="p-3 bg-white rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-base font-semibold text-gray-900">Prescriptions</h2>
                <Button
                    variant="default"
                    className="px-2 py-1 flex items-center space-x-1 text-sm"
                    onClick={() => handleOpenDialog()}
                >
                    <AddIcon className="h-4 w-4" />
                    <span>New</span>
                </Button>
            </div>
            <div className="divide-y divide-gray-200">
                {prescriptions.map((prescription) => (
                    <div key={prescription.id} className="py-2">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm font-medium text-gray-900">
                                    {prescription.medication}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {formatDate(prescription.date)}
                                </p>
                                <div className="flex gap-1 mt-1">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColorClass(prescription.status)}`}>
                                        {prescription.status}
                                    </span>
                                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                        {`${prescription.dosage} - ${prescription.frequency}`}
                                    </span>
                                </div>
                            </div>
                            <div className="flex space-x-1">
                                <Button
                                    className="p-1 text-gray-500 hover:text-gray-700"
                                    variant="ghost"
                                    onClick={() => handleOpenDialog(prescription)}
                                >
                                    <EditIcon className="h-4 w-4" />
                                </Button>
                                <Button
                                    className="p-1 text-gray-500 hover:text-gray-700"
                                    variant="ghost"
                                    onClick={() => handlePrint(prescription)}
                                >
                                    <PrinterIcon className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-1">
                            <span className="text-xs text-gray-500">
                                Duration: {prescription.duration}
                            </span>
                            <span className="text-xs text-gray-500">
                                Instructions: {prescription.instructions}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            {openDialog && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-40 flex items-center justify-center z-50">
                    <div className="relative p-4 bg-white rounded-xl shadow-xl max-w-xs w-full mx-auto">
                        <h3 className="text-base font-semibold text-gray-900 mb-2">
                            {selectedPrescription ? 'Edit Prescription' : 'New Prescription'}
                        </h3>
                        <form className="space-y-2">
                            <div>
                                <label htmlFor="medication" className="block text-xs font-medium text-gray-700">Medication</label>
                                <input
                                    type="text"
                                    id="medication"
                                    className="mt-0.5 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-xs"
                                    value={formData.medication}
                                    onChange={(e) => setFormData({ ...formData, medication: e.target.value })}
                                />
                            </div>
                            <div>
                                <label htmlFor="dosage" className="block text-xs font-medium text-gray-700">Dosage</label>
                                <input
                                    type="text"
                                    id="dosage"
                                    className="mt-0.5 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-xs"
                                    value={formData.dosage}
                                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                                />
                            </div>
                            <div>
                                <label htmlFor="frequency" className="block text-xs font-medium text-gray-700">Frequency</label>
                                <input
                                    type="text"
                                    id="frequency"
                                    className="mt-0.5 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-xs"
                                    value={formData.frequency}
                                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                                />
                            </div>
                            <div>
                                <label htmlFor="duration" className="block text-xs font-medium text-gray-700">Duration</label>
                                <input
                                    type="text"
                                    id="duration"
                                    className="mt-0.5 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-xs"
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                />
                            </div>
                            <div>
                                <label htmlFor="instructions" className="block text-xs font-medium text-gray-700">Instructions</label>
                                <textarea
                                    id="instructions"
                                    rows="2"
                                    className="mt-0.5 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-xs"
                                    value={formData.instructions}
                                    onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                                ></textarea>
                            </div>
                            <div>
                                <label htmlFor="status" className="block text-xs font-medium text-gray-700">Status</label>
                                <select
                                    id="status"
                                    className="mt-0.5 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option key="active" value="active">Active</option>
                                    <option key="completed" value="completed">Completed</option>
                                    <option key="cancelled" value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </form>
                        <div className="mt-3 flex justify-end space-x-2">
                            <Button
                                type="button"
                                variant="outline"
                                className="px-3 py-1 text-xs"
                                onClick={handleCloseDialog}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="default"
                                className="px-3 py-1 text-xs"
                                onClick={handleSubmit}
                            >
                                {selectedPrescription ? 'Save' : 'Create'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Prescriptions;
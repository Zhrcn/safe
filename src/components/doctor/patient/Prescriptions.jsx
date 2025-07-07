import React, { useEffect, useState } from 'react';ButtonButtonButtonButtonButtonButtonButtonButtonButtonButtonButton
import { useDispatch, useSelector } from 'react-redux';
import {
    Plus as AddIcon,
    Edit as EditIcon,
    Printer as PrinterIcon
} from 'lucide-react';
import { fetchPrescriptionsByPatient, createPrescription, updatePrescription } from '../../../store/slices/doctor/doctorPrescriptionsSlice';
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
    const handlePrint = (prescription) => {
         
    };
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
            <div className="flex justify-center items-center h-48">
                <p className="text-gray-500">Loading prescriptions...</p>
            </div>
        );
    }
    return (
        <div className="p-4 bg-white rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Prescriptions</h2>
                <Button
                    className="px-4 py-2 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 flex items-center space-x-2"
                    onClick={() => handleOpenDialog()}
                >
                    <AddIcon className="h-5 w-5" />
                    <span>New Prescription</span>
                </Button>
            </div>
            <div className="divide-y divide-gray-200">
                {prescriptions.map((prescription, index) => (
                    <div key={prescription.id} className="py-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-lg font-medium text-gray-900">
                                    {prescription.medication}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Prescribed on: {formatDate(prescription.date)}
                                </p>
                                <div className="flex gap-2 mt-2">
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColorClass(prescription.status)}`}>
                                        {prescription.status}
                                    </span>
                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                        {`${prescription.dosage} - ${prescription.frequency}`}
                                    </span>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <Button
                                    className="p-1 text-gray-500 hover:text-gray-700"
                                    onClick={() => handleOpenDialog(prescription)}
                                >
                                    <EditIcon className="h-5 w-5" />
                                </Button>
                                <Button
                                    className="p-1 text-gray-500 hover:text-gray-700"
                                    onClick={() => handlePrint(prescription)}
                                >
                                    <PrinterIcon className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                            Duration: {prescription.duration}
                        </p>
                        <p className="text-sm text-gray-600">
                            Instructions: {prescription.instructions}
                        </p>
                    </div>
                ))}
            </div>
            {openDialog && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
                    <div className="relative p-6 bg-white rounded-2xl shadow-xl max-w-md mx-auto">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            {selectedPrescription ? 'Edit Prescription' : 'New Prescription'}
                        </h3>
                        <form className="space-y-4">
                            <div>
                                <label htmlFor="medication" className="block text-sm font-medium text-gray-700">Medication</label>
                                <input
                                    type="text"
                                    id="medication"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    value={formData.medication}
                                    onChange={(e) => setFormData({ ...formData, medication: e.target.value })}
                                />
                            </div>
                            <div>
                                <label htmlFor="dosage" className="block text-sm font-medium text-gray-700">Dosage</label>
                                <input
                                    type="text"
                                    id="dosage"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    value={formData.dosage}
                                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                                />
                            </div>
                            <div>
                                <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">Frequency</label>
                                <input
                                    type="text"
                                    id="frequency"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    value={formData.frequency}
                                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                                />
                            </div>
                            <div>
                                <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration</label>
                                <input
                                    type="text"
                                    id="duration"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                />
                            </div>
                            <div>
                                <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">Instructions</label>
                                <textarea
                                    id="instructions"
                                    rows="3"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    value={formData.instructions}
                                    onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                                ></textarea>
                            </div>
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                                <select
                                    id="status"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="active">Active</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </form>
                        <div className="mt-6 flex justify-end space-x-3">
                            <Button
                                type="button"
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                onClick={handleCloseDialog}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                onClick={handleSubmit}
                            >
                                {selectedPrescription ? 'Save Changes' : 'Create Prescription'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default Prescriptions; 
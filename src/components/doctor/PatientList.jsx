import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useGetPatientsQuery } from '@/store/services/doctor/doctorApi';
import {
    addPatientToFavorites,
    removePatientFromFavorites
} from '../../store/slices/doctor/doctorPatientsSlice';
import { Search, Star, StarBorder, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const PatientList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchQuery, setSearchQuery] = useState('');
    const { data: patients, isLoading, error } = useGetPatientsQuery();
    const favorites = useSelector(state => state.doctorPatients.favorites);
    const handlePatientClick = (patientId) => {
        navigate(`/doctor/patients/${patientId}`);
    };
    const handleFavoriteToggle = (patientId, e) => {
        e.stopPropagation();
        if (favorites.includes(patientId)) {
            dispatch(removePatientFromFavorites(patientId));
        } else {
            dispatch(addPatientToFavorites(patientId));
        }
    };
    const filteredPatients = patients?.filter(patient =>
        patient.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }
    if (error) {
        return (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-2xl">
                Error loading patients: {error.message}
            </div>
        );
    }
    return (
        <div className="bg-white rounded-2xl shadow-md p-4">
            <h2 className="text-xl font-semibold mb-4">
                Patients
            </h2>
            <div className="relative mb-4">
                <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Search patients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
            <div className="space-y-2">
                {filteredPatients?.map((patient) => (
                    <div
                        key={patient.id}
                        onClick={() => handlePatientClick(patient.id)}
                        className="flex items-center p-3 rounded-2xl hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                        <div className="flex-shrink-0 mr-4">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <User className="h-6 w-6 text-blue-500" />
                            </div>
                        </div>
                        <div className="flex-grow">
                            <div className="font-medium">
                                {patient.firstName} {patient.lastName}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm text-gray-500">
                                    {patient.email}
                                </span>
                                <span className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full border border-blue-200">
                                    {patient.bloodType}
                                </span>
                            </div>
                        </div>
                        <Button
                            onClick={(e) => handleFavoriteToggle(patient.id, e)}
                            className="p-2 text-blue-500 hover:text-blue-600 transition-colors"
                        >
                            {favorites.includes(patient.id) ? (
                                <Star className="h-5 w-5 fill-current" />
                            ) : (
                                <StarBorder className="h-5 w-5" />
                            )}
                        </Button>
                    </div>
                ))}
            </div>
            {filteredPatients?.length === 0 && (
                <div className="flex justify-center items-center min-h-[100px] text-gray-500">
                    No patients found
                </div>
            )}
            <Button
                onClick={handleAddPatient}
                variant="default"
                size="sm"
                className="ml-auto"
            >
                Add Patient
            </Button>
        </div>
    );
};
export default PatientList; 
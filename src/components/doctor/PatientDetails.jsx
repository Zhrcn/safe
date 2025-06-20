import React, { useEffect, useState } from 'react';ButtonButtonButtonButton
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    User as UserIcon,
    Star as StarIcon,
    StarHalf as StarHalfIcon,
    Phone as PhoneIcon,
    Mail as MailIcon,
    MapPin as MapPinIcon,
    Activity as ActivityIcon,
    FileText as ConsultationsIcon,
    Pill as PrescriptionsIcon,
    CalendarDays as AppointmentsIcon,
} from 'lucide-react';
import { fetchPatientDetails } from '../../store/slices/doctor/doctorPatientsSlice';
import { addPatientToFavorites, removePatientFromFavorites } from '../../store/slices/doctor/doctorPatientsSlice';
import MedicalHistory from './patient/MedicalHistory';
import Consultations from './patient/Consultations';
import Prescriptions from './patient/Prescriptions';
import Appointments from './patient/Appointments';
import { Card, CardContent } from '@/components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
const PatientDetails = () => {
    const { patientId } = useParams();
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState('medical-history');
    const { selectedPatient: patient, loading, favorites } = useSelector((state) => state.doctorPatients);
    useEffect(() => {
        dispatch(fetchPatientDetails(patientId));
    }, [dispatch, patientId]);
    const handleFavoriteToggle = () => {
        if (favorites.includes(patientId)) {
            dispatch(removePatientFromFavorites(patientId));
        } else {
            dispatch(addPatientToFavorites(patientId));
        }
    };
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }
    if (!patient) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-xl font-semibold text-gray-700">Patient not found</p>
            </div>
        );
    }
    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <Card className="mb-6">
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        <div className="md:col-span-8">
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="relative w-16 h-16 rounded-full bg-blue-200 flex items-center justify-center text-blue-800 text-3xl font-bold">
                                    <UserIcon className="w-10 h-10" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                        <h1 className="text-2xl font-bold text-gray-900">
                                            {patient.firstName} {patient.lastName}
                                        </h1>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={handleFavoriteToggle}
                                            className="text-gray-500 hover:text-yellow-500"
                                        >
                                            {favorites.includes(patientId) ? (
                                                <StarIcon className="w-5 h-5 fill-current text-yellow-400" />
                                            ) : (
                                                <StarIcon className="w-5 h-5" />
                                            )}
                                        </Button>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Patient ID: {patient.id}
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <div className="flex items-center space-x-2 mb-2">
                                        <PhoneIcon className="w-5 h-5 text-gray-500" />
                                        <p className="text-gray-700">{patient.phone}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <MailIcon className="w-5 h-5 text-gray-500" />
                                        <p className="text-gray-700">{patient.email}</p>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center space-x-2 mb-2">
                                        <MapPinIcon className="w-5 h-5 text-gray-500" />
                                        <p className="text-gray-700">{patient.address}</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                            {patient.gender}
                                        </span>
                                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                            Age: {patient.age}
                                        </span>
                                        <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                                            {patient.bloodType}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-4">
                        <TabsTrigger value="medical-history">
                            <ActivityIcon className="w-4 h-4 mr-2" />
                            Medical History
                        </TabsTrigger>
                        <TabsTrigger value="consultations">
                            <ConsultationsIcon className="w-4 h-4 mr-2" />
                            Consultations
                        </TabsTrigger>
                        <TabsTrigger value="prescriptions">
                            <PrescriptionsIcon className="w-4 h-4 mr-2" />
                            Prescriptions
                        </TabsTrigger>
                        <TabsTrigger value="appointments">
                            <AppointmentsIcon className="w-4 h-4 mr-2" />
                            Appointments
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="medical-history" className="p-6">
                        <MedicalHistory patientId={patientId} />
                    </TabsContent>
                    <TabsContent value="consultations" className="p-6">
                        <Consultations patientId={patientId} />
                    </TabsContent>
                    <TabsContent value="prescriptions" className="p-6">
                        <Prescriptions patientId={patientId} />
                    </TabsContent>
                    <TabsContent value="appointments" className="p-6">
                        <Appointments patientId={patientId} />
                    </TabsContent>
                </Tabs>
            </Card>
        </div>
    );
};
export default PatientDetails;
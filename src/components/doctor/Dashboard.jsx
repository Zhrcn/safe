import React, { useEffect } from 'react';rounded-2xlrounded-2xlrounded-2xlrounded-2xl
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchPatients,
    fetchConsultations,
    fetchPrescriptions
} from '../../store/slices/doctor/doctorPatientsSlice';
import {
    fetchAppointments
} from '../../store/slices/doctor/doctorScheduleSlice';
import PatientList from './PatientList';
import AppointmentCalendar from './AppointmentCalendar';
import RecentActivities from './RecentActivities';
import Statistics from './Statistics';
const Dashboard = () => {
    const dispatch = useDispatch();
    const { loading: patientsLoading } = useSelector((state) => state.doctorPatients);
    const { loading: appointmentsLoading } = useSelector((state) => state.doctorSchedule);
    const { loading: consultationsLoading } = useSelector((state) => state.doctorConsultations);
    const { loading: prescriptionsLoading } = useSelector((state) => state.doctorPrescriptions);
    useEffect(() => {
        dispatch(fetchPatients());
        dispatch(fetchAppointments());
        dispatch(fetchConsultations());
        dispatch(fetchPrescriptions());
    }, [dispatch]);
    if (patientsLoading || appointmentsLoading || consultationsLoading || prescriptionsLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }
    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">
                Doctor Dashboard
            </h1>
            <div className="grid grid-cols-1 gap-6">
                {}
                <div className="col-span-1">
                    <div className="bg-white rounded-lg shadow-md p-6 h-full">
                        <Statistics />
                    </div>
                </div>
                {}
                <div className="col-span-1 lg:col-span-8">
                    <div className="grid grid-cols-1 gap-6">
                        {}
                        <div className="col-span-1">
                            <div className="bg-white rounded-lg shadow-md p-6 h-full">
                                <h2 className="text-xl font-semibold mb-4">
                                    Recent Patients
                                </h2>
                                <PatientList />
                            </div>
                        </div>
                        {}
                        <div className="col-span-1">
                            <div className="bg-white rounded-lg shadow-md p-6 h-full">
                                <h2 className="text-xl font-semibold mb-4">
                                    Recent Activities
                                </h2>
                                <RecentActivities />
                            </div>
                        </div>
                    </div>
                </div>
                {}
                <div className="col-span-1 lg:col-span-4">
                    <div className="bg-white rounded-lg shadow-md p-6 h-full">
                        <h2 className="text-xl font-semibold mb-4">
                            Today's Appointments
                        </h2>
                        <AppointmentCalendar />
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Dashboard; 
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  UserPlus, 
  CalendarClock, 
  FileText, 
  MessageSquare, 
  Users, 
  ChevronRight 
} from 'lucide-react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import CalendarComponent from '@/components/CalendarComponent';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Mock data for charts
const mockAppointmentsData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Appointments',
      data: [12, 19, 15, 17, 14, 8, 5],
      backgroundColor: 'rgba(109, 87, 241, 0.6)',
      borderColor: 'rgb(109, 87, 241)',
      borderWidth: 1,
    },
  ],
};

const mockPatientDistributionData = {
  labels: ['New', 'Follow-up', 'Emergency', 'Regular'],
    datasets: [
      {
      data: [30, 25, 15, 30],
      backgroundColor: [
        'rgba(109, 87, 241, 0.6)',
        'rgba(16, 185, 129, 0.6)',
        'rgba(245, 158, 11, 0.6)',
        'rgba(239, 68, 68, 0.6)',
      ],
      borderColor: [
        'rgb(109, 87, 241)',
        'rgb(16, 185, 129)',
        'rgb(245, 158, 11)',
        'rgb(239, 68, 68)',
      ],
      borderWidth: 1,
      },
    ],
  };

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      grid: {
        display: true,
        color: 'rgba(255, 255, 255, 0.1)',
      },
        ticks: {
        color: 'rgb(209, 213, 219)',
      },
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: 'rgb(209, 213, 219)',
      },
    },
      },
  };

const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
      position: 'bottom',
      labels: {
        color: 'rgb(209, 213, 219)',
      },
    },
  },
};

export default function DoctorDashboard() {
  const [loading, setLoading] = useState(true);
  const [recentPatients, setRecentPatients] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setRecentPatients([
        { id: 1, name: 'John Doe', lastVisit: '2024-02-15' },
        { id: 2, name: 'Jane Smith', lastVisit: '2024-02-14' },
        { id: 3, name: 'Mike Johnson', lastVisit: '2024-02-13' },
      ]);
      setUpcomingAppointments([
        { id: 1, patientName: 'John Doe', time: '09:00 AM', status: 'Confirmed', date: '2024-02-28' },
        { id: 2, patientName: 'Jane Smith', time: '10:30 AM', status: 'Pending', date: '2024-02-29' },
        { id: 3, patientName: 'Mike Johnson', time: '02:00 PM', status: 'Confirmed', date: '2024-03-01' },
        { id: 4, patientName: 'Alice Brown', time: '03:00 PM', status: 'Confirmed', date: '2024-03-01' },
        { id: 5, patientName: 'Bob White', time: '04:00 PM', status: 'Pending', date: '2024-03-02' },
      ]);
        setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="p-8 bg-gray-950 min-h-screen text-gray-100 flex justify-center">
      <div className="w-full max-w-screen-xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-lg text-gray-400">Welcome back, Dr. Smith</p>
        </div>

        {/* First Row: Recent Patients, Quick Actions, Calendar */}
        <div className="grid grid-cols-12 gap-8 mb-8">
          {/* Recent Patients */}
          <div className="col-span-12 md:col-span-5 flex flex-col">
            <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 flex-grow">
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-white">Recent Patients</h2>
                  <Link 
                    href="/doctor/patients"
                    className="text-blue-400 hover:text-blue-300 text-base font-medium flex items-center gap-1 transition-colors duration-200"
                  >
                    View All
                    <ChevronRight size={18} />
                  </Link>
                </div>
                <div className="border-b border-gray-700 mb-4" />
                {loading ? (
                  <div className="py-8 text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-400 mx-auto" />
                  </div>
                ) : recentPatients.length === 0 ? (
                  <div className="py-8 text-center text-gray-500">
                    <Users size={64} className="mx-auto mb-4 opacity-50" />
                    <p className="text-base">No patients found</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 flex-grow">
                    {recentPatients.map((patient) => (
                      <div key={patient.id} className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-700/30 flex items-center justify-center text-blue-300 font-semibold text-lg">
                          {patient.name[0]}
                        </div>
                        <div className="flex-grow">
                          <p className="text-base font-medium text-white">{patient.name}</p>
                          <p className="text-sm text-gray-400">
                            Last visit: {new Date(patient.lastVisit).toLocaleDateString()}
                          </p>
                        </div>
                        <Link
                          href={`/doctor/patients/${patient.id}`}
                          className="text-blue-400 hover:text-blue-300 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                        >
                          View
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="col-span-12 md:col-span-3 flex flex-col">
            <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 flex-grow">
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-4 flex-grow">
                  <button className="flex flex-col items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-blue-600 text-blue-400 hover:bg-gray-700 transition-colors duration-200 text-sm font-medium h-24">
                    <UserPlus size={24} />
                    <span>New Patient</span>
                  </button>
                  <button className="flex flex-col items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-green-600 text-green-400 hover:bg-gray-700 transition-colors duration-200 text-sm font-medium h-24">
                    <CalendarClock size={24} />
                    <span>Schedule</span>
                  </button>
                  <button className="flex flex-col items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-yellow-600 text-yellow-400 hover:bg-gray-700 transition-colors duration-200 text-sm font-medium h-24">
                    <FileText size={24} />
                    <span>Prescription</span>
                  </button>
                  <button className="flex flex-col items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-red-600 text-red-400 hover:bg-gray-700 transition-colors duration-200 text-sm font-medium h-24">
                    <MessageSquare size={24} />
                    <span>Messages</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar */}
          <div className="col-span-12 md:col-span-4 flex flex-col">
            <CalendarComponent appointments={upcomingAppointments} />
          </div>
        </div>

        {/* Second Row: Charts */}
        <div className="grid grid-cols-12 gap-8">
          {/* Appointments Overview Chart */}
          <div className="col-span-12 md:col-span-7 flex flex-col">
            <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 flex-grow">
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-xl font-semibold text-white mb-4">Appointments Overview</h2>
                {loading ? (
                  <div className="flex-grow flex items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-400" />
                  </div>
                ) : (
                  <div className="flex-grow min-h-0">
                    <Bar data={mockAppointmentsData} options={chartOptions} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Patient Distribution Chart */}
          <div className="col-span-12 md:col-span-5 flex flex-col">
            <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 flex-grow">
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-xl font-semibold text-white mb-4">Patient Distribution</h2>
                {loading ? (
                  <div className="flex-grow flex items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-400" />
                  </div>
                ) : (
                  <div className="flex-grow min-h-0">
                    <Doughnut data={mockPatientDistributionData} options={doughnutOptions} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { setSelectedDate } from '@/lib/redux/dateSlice';
import { setSelectedPatient } from '@/lib/redux/patientSlice';
import { Typography, Card, CardContent, List, ListItem, ListItemText, Paper, Box, Divider, Grid, TextField, InputAdornment } from '@mui/material';
// Import Lucid Icons
import { CalendarDays, Building2 as Hospital, Search, User } from 'lucide-react';
// Import motion from framer-motion
import { motion } from 'framer-motion';

// We'll need to import patient and appointment data fetching logic here later

// Enhanced DoctorInfo Component
function DoctorInfo({
  doctor
}) {
  return (
    <Card className="mb-6 shadow-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
      <CardContent>
        <Box className="flex items-center">
          {/* Using Hospital icon from Lucid */}
          <Hospital size={40} strokeWidth={1.5} className="mr-4 text-blue-600 dark:text-blue-400" />
          <div>
            <Typography variant="h5" component="h2" className="font-bold text-gray-900 dark:text-white">
              Dr. {doctor?.name}
            </Typography>
            <Typography variant="body1" component="div" className="text-gray-700 dark:text-gray-300">
              Specialty: {doctor?.specialty}
            </Typography>
            <Typography variant="body1" component="div" className="text-gray-700 dark:text-gray-300">
              Contact: {doctor?.contact}
            </Typography>
          </div>
        </Box>
      </CardContent>
    </Card>
  );
}

// Enhanced PatientsList Component
function PatientsList({
  patients,
  onSelectPatient,
  selectedPatientId
}) {
  return (
    <Paper elevation={3} className="h-full flex flex-col bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <Box className="p-4 border-b border-gray-200 dark:border-gray-700">
        <Typography variant="h6" component="h3" className="font-semibold text-gray-900 dark:text-white">Patients Today</Typography>
      </Box>
      <Box className="p-4 border-b border-gray-200 dark:border-gray-700">
        <TextField
          fullWidth
          placeholder="Search Patient"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} className="text-gray-400 dark:text-gray-500" />
              </InputAdornment>
            ),
            style: { color: 'inherit' }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'rgba(0, 0, 0, 0.2)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(0, 0, 0, 0.4)',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#1976d2',
              },
            },
            '& input': {
              color: 'inherit',
            },
            '& input::placeholder': {
              color: '#a0a0a0',
            }
          }}
        />
      </Box>
      <div className="flex-1 overflow-y-auto">
        <List>
          {patients.length === 0 ? (
            <ListItem>
              <ListItemText primary="No appointments scheduled for this date." className="text-gray-500 dark:text-gray-400" />
            </ListItem>
          ) : (
            patients.map((patient) => (
              <ListItem
                button
                key={patient.id}
                onClick={() => onSelectPatient(patient)}
                selected={selectedPatientId === patient.id}
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: '#e0e0e0',
                  },
                  '&.Mui-selected:hover': {
                    backgroundColor: '#d5d5d5',
                  },
                }}
              >
                <ListItemText primary={patient.name} className="text-gray-900 dark:text-white" />
              </ListItem>
            ))
          )}
        </List>
      </div>
    </Paper>
  );
}

// Enhanced PatientDetails Component
function PatientDetails({
  patient
}) {
  if (!patient) {
    return (
      <Paper elevation={3} className="h-full flex items-center justify-center p-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <Typography variant="h6" color="text.secondary" className="text-gray-500 dark:text-gray-400">Select a patient to view details</Typography>
      </Paper>
    );
  }
  return (
    <Paper elevation={3} className="h-full flex flex-col bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
      <Box className="p-4 border-b border-gray-200 dark:border-gray-700">
        <Typography variant="h6" component="h3" className="font-semibold text-gray-900 dark:text-white">Patient Details</Typography>
      </Box>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <Typography variant="body1" component="div" className="text-gray-900 dark:text-white"><strong>Name:</strong> {patient.name}</Typography>
        <Typography variant="body1" component="div" className="text-gray-900 dark:text-white"><strong>Age:</strong> {patient.age}</Typography>
        <Typography variant="body1" component="div" className="text-gray-900 dark:text-white"><strong>Gender:</strong> {patient.gender}</Typography>
        <Typography variant="body1" component="div" className="text-gray-900 dark:text-white"><strong>Medical History:</strong> {patient.medicalHistory}</Typography>
        {/* Add more patient details as needed */}
      </div>
    </Paper>
  );
}

// Basic Calendar Component (can be enhanced further with a proper library)
function Calendar({
  selectedDate,
  onSelectDate
}) {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 for Sunday, 6 for Saturday
  const daysArray = Array.from({
    length: daysInMonth
  }, (_, i) => i + 1);

  const handleDayClick = (day) => {
    const month = (currentMonth + 1).toString().padStart(2, '0');
    const dayString = day.toString().padStart(2, '0');
    onSelectDate(`${currentYear}-${month}-${dayString}`);
  };

  // Create empty cells for days before the 1st
  const emptyCells = Array.from({
    length: firstDayOfMonth
  }, (_, i) => <div key={`empty-${i}`}></div>);

  return (
    <Paper elevation={3} className="h-full flex flex-col bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
      <Box className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
        {/* Using CalendarDays icon from Lucid */}
        <CalendarDays size={20} strokeWidth={1.5} className="mr-2 text-gray-700 dark:text-white" />
        <Typography variant="h6" className="font-semibold text-gray-900 dark:text-white">{today.toLocaleString('default', {
          month: 'long'
        })} {currentYear}</Typography>
      </Box>
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName) => (
            <div key={dayName} className="text-gray-600 dark:text-gray-400">{dayName}</div>
          ))}
          {emptyCells}
          {daysArray.map((day) => {
            const month = (currentMonth + 1).toString().padStart(2, '0');
            const dayString = day.toString().padStart(2, '0');
            const dayDate = `${currentYear}-${month}-${dayString}`;
            const isSelected = dayDate === selectedDate;
            const isToday = dayDate === new Date().toISOString().split('T')[0];

            return (
              <div
                key={day}
                className={`p-2 cursor-pointer rounded-md text-gray-900 dark:text-white
                  ${isSelected ? 'bg-blue-600 text-white dark:bg-blue-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
                  ${isToday && !isSelected ? 'border border-blue-500 dark:border-blue-400' : ''}
                  text-sm flex items-center justify-center
                `}
                onClick={() => handleDayClick(dayDate)}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>
    </Paper>
  );
}

export default function DoctorDashboard() {
  const dispatch = useAppDispatch();
  const selectedDate = useAppSelector(state => state?.date?.selectedDate || new Date().toISOString().split('T')[0]);
  const selectedPatient = useAppSelector(state => state?.patient?.selectedPatient || null);

  // Mock data - replace with API calls
  const doctor = {
    name: 'Ahmad Al-Ali',
    specialty: 'General Surgery',
    contact: 'ahmad.ali@example.com',
  };

  const patientsTodayMock = [
    { id: 1, name: 'Patient A', age: 45, gender: 'Male', medicalHistory: 'Hypertension' },
    { id: 2, name: 'Patient B', age: 30, gender: 'Female', medicalHistory: 'Diabetes' },
  ];

  useEffect(() => {
    // Initialize selected date if not already set
    if (!selectedDate) {
      const today = new Date().toISOString().split('T')[0];
      dispatch(setSelectedDate(today));
    }

    // Fetch data for the selected date - implement API call here
    // For now, just use mock data
    console.log(`Fetching data for date: ${selectedDate}`);

  }, [selectedDate, dispatch]);

  const handleSelectPatient = (patient) => {
    dispatch(setSelectedPatient(patient));
  };

  const handleDateChange = (date) => {
    dispatch(setSelectedDate(date));
    // Clear selected patient when date changes
    dispatch(setSelectedPatient(null));
  };

  // Define animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6" // Added spacing between sections
    >
      <DoctorInfo doctor={doctor} />

      <Grid container spacing={6}> {/* Increased spacing */}
        <Grid item xs={12} md={4}> {/* Adjusted grid size */}
          <Calendar selectedDate={selectedDate} onSelectDate={handleDateChange} />
        </Grid>
        <Grid item xs={12} md={4}> {/* Adjusted grid size */}
          <PatientsList
            patients={patientsTodayMock} // Use fetched data here
            onSelectPatient={handleSelectPatient}
            selectedPatientId={selectedPatient?.id}
          />
        </Grid>
        <Grid item xs={12} md={4}> {/* Adjusted grid size */}
          <PatientDetails patient={selectedPatient} />
        </Grid>
      </Grid>
    </motion.div>
  );
}
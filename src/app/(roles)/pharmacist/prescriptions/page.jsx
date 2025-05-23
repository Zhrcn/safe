'use client';

import { Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Card, CardContent, Button, TextField, InputAdornment } from '@mui/material';
import { FileText, Search, Eye, CheckCircle } from 'lucide-react';
import { useState } from 'react';

// Mock Prescriptions Data for Pharmacist (replace with actual data fetching)
const mockPharmacistPrescriptions = [
  { id: 1, patientName: 'Patient D', medication: 'Antibiotic X', dosage: '250 mg', frequency: 'Twice daily', issueDate: '2024-06-20', status: 'Pending' },
  { id: 2, patientName: 'Patient E', medication: 'Pain Reliever Y', dosage: '50 mg', frequency: 'As needed', issueDate: '2024-06-19', status: 'Pending' },
  { id: 3, patientName: 'Patient F', medication: 'Medication Z', dosage: '100 mg', frequency: 'Once daily', issueDate: '2024-06-18', status: 'Filled' },
  { id: 4, patientName: 'Patient G', medication: 'Antibiotic A', dosage: '500 mg', frequency: 'Three times daily', issueDate: '2024-06-20', status: 'Pending' },
];

export default function PharmacistPrescriptionsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPrescriptions = mockPharmacistPrescriptions.filter(prescription =>
    prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.medication.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (prescriptionId) => {
    console.log('View Prescription Details for ID:', prescriptionId);
    // Implement logic to view prescription details (e.g., open modal)
  };

  const handleMarkAsFilled = (prescriptionId) => {
    console.log('Mark as Filled for ID:', prescriptionId);
    // Implement logic to update prescription status (API call)
    // In a real app, you would likely refetch or update the state to reflect the change
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3 }} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-md min-h-[80vh]"> {/* Theme-aware background, shadow, and minimum height */}
        <Typography variant="h4" gutterBottom className="text-gray-900 dark:text-white font-bold"> {/* Theme-aware text color */}
          Prescription Management
        </Typography>
        <Typography paragraph className="text-gray-700 dark:text-gray-300 mb-6"> {/* Theme-aware text color */}
          View and manage prescriptions to be filled.
        </Typography>

        <Card className="shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"> {/* Theme-aware card styles */}
          <CardContent>
            <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-4 sm:space-y-0"> {/* Responsive layout and spacing */}
              <Typography variant="h5" component="h1" className="font-bold text-gray-900 dark:text-white">Prescriptions List</Typography> {/* Theme-aware text color */}
              <Box className="w-full sm:w-auto"> {/* Responsive width */}
                <TextField
                  variant="outlined"
                  size="small"
                  placeholder="Search Prescriptions"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                   className="w-full sm:w-auto" // Responsive width
                   InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search size={20} className="text-gray-500 dark:text-gray-400"/> {/* Theme-aware icon color */}
                      </InputAdornment>
                    ),
                    className: 'text-gray-900 dark:text-white', // Themed input text
                  }}
                  InputLabelProps={{
                     style: { color: 'inherit' },
                  }}
                   sx={{
                      '& .MuiOutlinedInput-root': { // Style the input border
                          fieldset: { borderColor: '#d1d5db' }, // Default border
                          '&:hover fieldset': { borderColor: '#9ca3af' }, // Hover border
                           '&.Mui-focused fieldset': { borderColor: '#3b82f6' }, // Focused border
                            '& .MuiOutlinedInput-notchedOutline': { // Dark theme borders
                                 borderColor: '#4b5563',
                           },
                           '&:hover .MuiOutlinedInput-notchedOutline': {
                                 borderColor: '#6b7280',
                           },
                           '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                 borderColor: '#60a5fa',
                           },
                      },
                       '& .MuiInputBase-input::placeholder': { // Themed placeholder color
                           color: '#9ca3af', // Default placeholder color
                           opacity: 1, // Ensure placeholder is visible
                           '.dark & ': { // Dark mode placeholder color
                                color: '#6b7280',
                           },
                       },
                       '& .MuiInputLabel-outlined': { // Themed label color
                            color: '#6b7280', // Default label color
                             '.dark & ': { // Dark mode label color
                                 color: '#9ca3af',
                           },
                       },
                   }}
                />
              </Box>
            </Box>

            <TableContainer component={Paper} elevation={2} className="bg-white dark:bg-gray-700 rounded-md"> {/* Themed table container */}
              <Table>
                <TableHead>
                  <TableRow className="bg-gray-100 dark:bg-gray-600"> {/* Themed table header */}
                    <TableCell className="text-gray-800 dark:text-gray-200 font-semibold">Patient</TableCell> {/* Themed text and font weight */}
                    <TableCell className="text-gray-800 dark:text-gray-200 font-semibold">Medication</TableCell> {/* Themed text and font weight */}
                    <TableCell className="text-gray-800 dark:text-gray-200 font-semibold">Dosage</TableCell> {/* Themed text and font weight */}
                     <TableCell className="text-gray-800 dark:text-gray-200 font-semibold">Frequency</TableCell> {/* Themed text and font weight */}
                    <TableCell className="text-gray-800 dark:text-gray-200 font-semibold">Issue Date</TableCell> {/* Themed text and font weight */}
                     <TableCell className="text-gray-800 dark:text-gray-200 font-semibold">Status</TableCell> {/* Themed text and font weight */}
                    <TableCell align="right" className="text-gray-800 dark:text-gray-200 font-semibold">Actions</TableCell> {/* Themed text and font weight */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPrescriptions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" className="text-gray-700 dark:text-gray-300"> {/* Themed text */}
                        No prescriptions found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPrescriptions.map((prescription) => (
                      <TableRow
                        key={prescription.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
                      >
                        <TableCell className="text-gray-900 dark:text-gray-100">{prescription.patientName}</TableCell> {/* Themed text */}
                        <TableCell className="text-gray-900 dark:text-gray-100">{prescription.medication}</TableCell> {/* Themed text */}
                        <TableCell className="text-gray-900 dark:text-gray-100">{prescription.dosage}</TableCell> {/* Themed text */}
                         <TableCell className="text-gray-900 dark:text-gray-100">{prescription.frequency}</TableCell> {/* Themed text */}
                        <TableCell className="text-gray-900 dark:text-gray-100">{prescription.issueDate}</TableCell> {/* Themed text */}
                        <TableCell className={`text-gray-900 dark:text-gray-100 ${prescription.status === 'Pending' ? 'text-yellow-600 dark:text-yellow-300' : 'text-green-600 dark:text-green-300'}`}> {/* Themed text and color based on status */}
                           {prescription.status}
                        </TableCell>
                        <TableCell align="right" className="space-x-2"> {/* Added spacing between buttons */}
                           <Button
                              variant="outlined"
                              size="small"
                              startIcon={<Eye size={16} />}
                              onClick={() => handleViewDetails(prescription.id)}
                              className="text-blue-600 dark:text-blue-300 border-blue-600 dark:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors duration-200" // Themed button
                            >
                              View
                            </Button>
                           {prescription.status === 'Pending' && (
                              <Button
                                 variant="contained"
                                 size="small"
                                 startIcon={<CheckCircle size={16} />}
                                 onClick={() => handleMarkAsFilled(prescription.id)}
                                 className="bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-600 text-white font-bold transition-colors duration-200" // Themed button
                              >
                                 Mark as Filled
                              </Button>
                           )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

          </CardContent>
        </Card>

        {/* Add filter options or other actions here later */}

      </Paper>
    </Box>
  );
} 
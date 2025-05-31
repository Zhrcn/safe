'use client';

import { Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Card, CardContent, Button, TextField, InputAdornment } from '@mui/material';
import { Users, Search, Edit, UserX } from 'lucide-react';
import { useState } from 'react';

const mockUsers = [
  { id: 1, name: 'Dr. Ahmad Al-Ali', role: 'Doctor', email: 'ahmad.ali@example.com', status: 'Active' },
  { id: 2, name: 'Patient A', role: 'Patient', email: 'patient.a@example.com', status: 'Active' },
  { id: 3, name: 'Fatima Al-Abbas', role: 'Pharmacist', email: 'fatima.abbas@example.com', status: 'Active' },
  { id: 4, name: 'Admin User', role: 'Admin', email: 'admin@example.com', status: 'Active' },
  { id: 5, name: 'Patient B', role: 'Patient', email: 'patient.b@example.com', status: 'Inactive' },
];

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditUser = (userId) => {
    console.log('Edit User clicked for ID:', userId);
  };

  const handleToggleUserStatus = (userId, currentStatus) => {
    console.log(`Toggle status for User ID: ${userId}, current status: ${currentStatus}`);
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3 }} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-md min-h-[80vh]">
        <Typography variant="h4" gutterBottom className="text-gray-900 dark:text-white font-bold">
          User Management
        </Typography>
        <Typography paragraph className="text-gray-700 dark:text-gray-300 mb-6">
          Manage users in the system (Doctors, Patients, Pharmacists, Admins).
        </Typography>

        <Card className="shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardContent>
            <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-4 sm:space-y-0">
              <Typography variant="h5" component="h1" className="font-bold text-gray-900 dark:text-white">Users List</Typography>
              <Box className="w-full sm:w-auto">
                <TextField
                  variant="outlined"
                  size="small"
                  placeholder="Search Users"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                   className="w-full sm:w-auto"
                   InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search size={20} className="text-gray-500 dark:text-gray-400"/>
                      </InputAdornment>
                    ),
                    className: 'text-gray-900 dark:text-white',
                  }}
                  InputLabelProps={{
                     style: { color: 'inherit' },
                  }}
                   sx={{
                      '& .MuiOutlinedInput-root': {
                          fieldset: { borderColor: '#d1d5db' },
                          '&:hover fieldset': { borderColor: '#9ca3af' },
                           '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                            '& .MuiOutlinedInput-notchedOutline': {
                                 borderColor: '#4b5563',
                           },
                           '&:hover .MuiOutlinedInput-notchedOutline': {
                                 borderColor: '#6b7280',
                           },
                           '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                 borderColor: '#60a5fa',
                           },
                      },
                       '& .MuiInputBase-input::placeholder': {
                           color: '#9ca3af',
                           opacity: 1,
                           '.dark & ': {
                                color: '#6b7280',
                           },
                       },
                       '& .MuiInputLabel-outlined': {
                            color: '#6b7280',
                             '.dark & ': {
                                 color: '#9ca3af',
                           },
                       },
                   }}
                />
              </Box>
            </Box>

            <TableContainer component={Paper} elevation={2} className="bg-white dark:bg-gray-700 rounded-md">
              <Table>
                <TableHead>
                  <TableRow className="bg-gray-100 dark:bg-gray-600">
                    <TableCell className="text-gray-800 dark:text-gray-200 font-semibold">Name</TableCell>
                    <TableCell className="text-gray-800 dark:text-gray-200 font-semibold">Role</TableCell>
                    <TableCell className="text-gray-800 dark:text-gray-200 font-semibold">Email</TableCell>
                    <TableCell className="text-gray-800 dark:text-gray-200 font-semibold">Status</TableCell>
                    <TableCell align="right" className="text-gray-800 dark:text-gray-200 font-semibold">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" className="text-gray-700 dark:text-gray-300">
                        No users found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow
                        key={user.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
                      >
                        <TableCell className="text-gray-900 dark:text-gray-100 flex items-center">
                           <Users size={20} className="mr-2 text-gray-600 dark:text-gray-300"/>
                           {user.name}
                        </TableCell>
                        <TableCell className="text-gray-900 dark:text-gray-100">{user.role}</TableCell>
                        <TableCell className="text-gray-900 dark:text-gray-100">{user.email}</TableCell>
                         <TableCell className={`text-gray-900 dark:text-gray-100 ${user.status === 'Active' ? 'text-green-600 dark:text-green-300' : 'text-red-600 dark:text-red-300'}`}>
                           {user.status}
                        </TableCell>
                        <TableCell align="right" className="space-x-2">
                           <Button
                              variant="outlined"
                              size="small"
                              startIcon={<Edit size={16} />}
                              onClick={() => handleEditUser(user.id)}
                              className="text-blue-600 dark:text-blue-300 border-blue-600 dark:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors duration-200"
                            >
                              Edit
                            </Button>
                           <Button
                              variant={user.status === 'Active' ? 'outlined' : 'contained'}
                               size="small"
                               startIcon={user.status === 'Active' ? <UserX size={16} /> : <Users size={16} />}
                               onClick={() => handleToggleUserStatus(user.id, user.status)}
                               className={`${user.status === 'Active' ? 'text-red-600 dark:text-red-300 border-red-600 dark:border-red-300 hover:bg-red-50 dark:hover:bg-red-900' : 'bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-600 text-white font-bold'} transition-colors duration-200`}
                            >
                               {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                            </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

          </CardContent>
        </Card>

      </Paper>
    </Box>
  );
} 
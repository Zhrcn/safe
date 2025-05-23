'use client';

import { Typography, Box, Paper, TextField, InputAdornment, List, ListItem, ListItemText } from '@mui/material';
import { Search, MapPin, Stethoscope, Pill } from 'lucide-react';
import { useState } from 'react';

// Mock Providers Data (replace with actual data fetching)
const mockProviders = [
  { id: 1, name: 'Dr. Ahmad Al-Ali', type: 'Doctor', specialty: 'General Surgery', location: 'Damascus' },
  { id: 2, name: 'Downtown Pharmacy', type: 'Pharmacy', location: 'Damascus' },
  { id: 3, name: 'Dr. Maria Garcia', type: 'Doctor', specialty: 'Pediatrics', location: 'Aleppo' },
  { id: 4, name: 'Central Hospital Pharmacy', type: 'Pharmacy', location: 'Aleppo' },
  { id: 5, name: 'Dr. Omar Hassan', type: 'Doctor', specialty: 'Internal Medicine', location: 'Damascus' },
];

export default function PatientProvidersPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProviders = mockProviders.filter(provider =>
    provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (provider.type === 'Doctor' && provider.specialty.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleProviderClick = (providerId) => {
    console.log('Provider clicked:', providerId);
    // Implement navigation to provider details page or other action
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3 }} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-md min-h-[80vh]">
        <Typography variant="h4" gutterBottom className="text-gray-900 dark:text-white font-bold">
          Find Providers
        </Typography>
        <Typography paragraph className="text-gray-700 dark:text-gray-300 mb-6">
          Search for doctors and pharmacies to connect with.
        </Typography>

        <Box className="mb-6">
          <TextField
            fullWidth
            variant="outlined"
            size="medium"
            placeholder="Search by name, location, or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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

        <Box>
          <Typography variant="h6" gutterBottom className="font-semibold mb-4 text-gray-900 dark:text-white">
            Providers
          </Typography>
          <List className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
            {filteredProviders.length === 0 ? (
              <ListItem>
                <ListItemText primary="No providers found." className="text-gray-700 dark:text-gray-300"/>
              </ListItem>
            ) : (
              filteredProviders.map((provider) => (
                <ListItem
                  button
                  key={provider.id}
                  onClick={() => handleProviderClick(provider.id)}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <ListItemText
                    primary={
                       <Box className="flex items-center">
                         {provider.type === 'Doctor' ? <Stethoscope size={20} className="mr-3 text-blue-600 dark:text-blue-400"/> : <Pill size={20} className="mr-3 text-green-600 dark:text-green-400"/>}
                         <Typography variant="body1" className="font-semibold text-gray-900 dark:text-white">{provider.name}</Typography>
                       </Box>
                    }
                    secondary={
                      <Box className="flex items-center mt-1 text-gray-700 dark:text-gray-300">
                         <MapPin size={16} className="mr-1 text-gray-500 dark:text-gray-400"/>
                         <Typography variant="body2">{provider.location}</Typography>
                         {provider.type === 'Doctor' && (
                           <Typography variant="body2" className="ml-4">Specialty: {provider.specialty}</Typography>
                         )}
                      </Box>
                    }
                  />
                </ListItem>
              ))
            )}
          </List>
        </Box>

         {/* Add filter options here later if needed */}

      </Paper>
    </Box>
  );
} 
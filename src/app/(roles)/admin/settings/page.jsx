'use client';

import { Typography, Box, Paper, Card, CardContent, Grid, TextField, Switch, FormControlLabel } from '@mui/material';
import { Settings, Palette, Database } from 'lucide-react';
import { useState } from 'react';

const mockSettings = {
  appName: 'SAFE Medical Service Platform',
  systemEmail: 'noreply@safemedical.com',
  enableDarkMode: false,
  databaseBackupSchedule: 'Daily',
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(mockSettings); 

  const handleSettingChange = (event) => {
    const { name, value, checked, type } = event.target;
    setSettings(prevSettings => ({
      ...prevSettings,
      [name]: type === 'checkbox' ? checked : value,
    }));
    console.log(`Setting '${name}' changed to: ${type === 'checkbox' ? checked : value}`);
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3 }} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-md min-h-[80vh]">
        <Typography variant="h4" gutterBottom className="text-gray-900 dark:text-white font-bold"> 
          Admin Settings
        </Typography>
        <Typography paragraph className="text-gray-700 dark:text-gray-300 mb-6"> 
          Manage system-wide application settings.
        </Typography>

        <Grid container spacing={3}> 

          <Grid item xs={12} md={6}>
            <Card className="h-full shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"> 
              <CardContent>
                 <Box className="flex items-center mb-4">
                     <Settings size={28} className="mr-4 text-red-600 dark:text-red-400"/> 
                     <Typography variant="h6" component="div" className="font-semibold text-gray-900 dark:text-white">General Settings</Typography> 
                 </Box>
                <Grid container spacing={2}>
                   <Grid item xs={12}>
                      <TextField
                        label="Application Name"
                        name="appName"
                        value={settings.appName}
                        onChange={handleSettingChange}
                        fullWidth
                        variant="outlined"
                        size="small"
                         InputLabelProps={{
                           style: { color: 'inherit' },
                        }}
                         InputProps={{
                           className: 'text-gray-900 dark:text-white',
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
                   </Grid>
                   <Grid item xs={12}> 
                       <TextField
                        label="System Email Address"
                        name="systemEmail"
                        value={settings.systemEmail}
                        onChange={handleSettingChange}
                        fullWidth
                        variant="outlined"
                        size="small"
                         InputLabelProps={{
                           style: { color: 'inherit' },
                        }}
                         InputProps={{
                           className: 'text-gray-900 dark:text-white', 
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
                   </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

  
           <Grid item xs={12} md={6}>
            <Card className="h-full shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"> 
              <CardContent>
                 <Box className="flex items-center mb-4">
                     <Palette size={28} className="mr-4 text-red-600 dark:text-red-400"/>
                     <Typography variant="h6" component="div" className="font-semibold text-gray-900 dark:text-white">Theme Settings</Typography>
                 </Box>
                 <FormControlLabel
                    control={
                      <Switch
                        checked={settings.enableDarkMode}
                        onChange={handleSettingChange}
                        name="enableDarkMode"
                        color="primary"
                      />
                    }
                    label={<Typography className="text-gray-900 dark:text-white">Enable Dark Mode</Typography>} 
                  />
              </CardContent>
            </Card>
          </Grid>

          
            <Grid item xs={12} md={6}> 
            <Card className="h-full shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"> 
              <CardContent>
                 <Box className="flex items-center mb-4">
                     <Database size={28} className="mr-4 text-red-600 dark:text-red-400"/> 
                     <Typography variant="h6" component="div" className="font-semibold text-gray-900 dark:text-white">Database Settings</Typography> 
                 </Box>
                 <TextField
                    label="Database Backup Schedule"
                    name="databaseBackupSchedule"
                    value={settings.databaseBackupSchedule}
                    onChange={handleSettingChange}
                    fullWidth
                    variant="outlined"
                    size="small"
                     InputLabelProps={{
                       style: { color: 'inherit' },
                    }}
                     InputProps={{
                       className: 'text-gray-900 dark:text-white',
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
              </CardContent>
            </Card>
          </Grid>

        </Grid>
      </Paper>
    </Box>
  );
} 
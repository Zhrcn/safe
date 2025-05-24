'use client';

import { Typography, Box, Paper, Card, CardContent, Grid, TextField, InputAdornment, Avatar } from '@mui/material';
import { User, Mail, Phone, Home, CalendarDays, FileText } from 'lucide-react';

// Mock Patient Profile Data (replace with actual data fetching)
const mockPatientProfile = {
     name: 'Patient A',
     age: 45,
     gender: 'Male',
     dateOfBirth: '1979-08-15',
     contact: {
          email: 'patient.a@example.com',
          phone: '+1 123 456 7890',
     },
     address: '123 Main St, Anytown, USA',
     medicalHistorySummary: 'Diagnosed with Hypertension in 2020. No known allergies. Current medications: Lisinopril.',
     // Add other profile details as needed
};

export default function PatientProfilePage() {
     const patient = mockPatientProfile; // In a real app, fetch authenticated patient's profile

     return (
          <Box>
               <Paper elevation={3} sx={{ p: 3 }} className="bg-card text-card-foreground rounded-lg shadow-md">
                    <Typography variant="h4" gutterBottom className="text-foreground font-bold">
                         Patient Profile
                    </Typography>
                    <Typography paragraph className="text-muted-foreground mb-6">
                         This page displays your personal and medical information.
                    </Typography>

                    <Grid container spacing={3}>
                         <Grid item xs={12} md={4}>
                              <Card className="h-full shadow-lg rounded-lg border border-border bg-card">
                                   <CardContent className="flex flex-col items-center text-center">
                                        <Avatar sx={{ bgcolor: 'primary.main', mb: 2, width: 80, height: 80 }} className="bg-primary text-primary-foreground">
                                             <User size={40} className="text-primary-foreground" />
                                        </Avatar>
                                        <Typography variant="h5" component="div" className="font-bold mb-1 text-foreground">{patient.name}</Typography>
                                        <Typography variant="body1" className="text-muted-foreground">Age: {patient.age}</Typography>
                                        <Typography variant="body1" className="text-muted-foreground">Gender: {patient.gender}</Typography>
                                   </CardContent>
                              </Card>
                         </Grid>

                         <Grid item xs={12} md={8}>
                              <Card className="h-full shadow-lg rounded-lg border border-border bg-card">
                                   <CardContent>
                                        <Typography variant="h6" gutterBottom className="font-semibold mb-4 text-foreground">Personal and Contact Information</Typography>
                                        <Grid container spacing={2}>
                                             <Grid item xs={12} sm={6}>
                                                  <TextField
                                                       label="Date of Birth"
                                                       value={patient.dateOfBirth}
                                                       fullWidth
                                                       InputProps={{ readOnly: true, startAdornment: (<InputAdornment position="start"><CalendarDays size={20} className="text-muted-foreground" /></InputAdornment>), className: 'text-foreground' }}
                                                       InputLabelProps={{
                                                            style: { color: 'inherit' },
                                                       }}
                                                       variant="outlined"
                                                       sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                 fieldset: { borderColor: 'var(--border)' },
                                                                 '&:hover fieldset': { borderColor: 'var(--border)' },
                                                                 '&.Mui-focused fieldset': { borderColor: 'var(--primary)' },
                                                                 '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border)' },
                                                                 '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border)' },
                                                                 '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--primary)' },
                                                            },
                                                            '& .MuiInputBase-input::placeholder': { color: 'var(--muted-foreground)', opacity: 1 },
                                                            '& .MuiInputLabel-outlined': { color: 'var(--muted-foreground)' },
                                                       }}
                                                  />
                                             </Grid>
                                             <Grid item xs={12} sm={6}>
                                                  <TextField
                                                       label="Email"
                                                       value={patient.contact.email}
                                                       fullWidth
                                                       InputProps={{ readOnly: true, startAdornment: (<InputAdornment position="start"><Mail size={20} className="text-muted-foreground" /></InputAdornment>), className: 'text-foreground' }}
                                                       InputLabelProps={{
                                                            style: { color: 'inherit' },
                                                       }}
                                                       variant="outlined"
                                                       sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                 fieldset: { borderColor: 'var(--border)' },
                                                                 '&:hover fieldset': { borderColor: 'var(--border)' },
                                                                 '&.Mui-focused fieldset': { borderColor: 'var(--primary)' },
                                                                 '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border)' },
                                                                 '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border)' },
                                                                 '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--primary)' },
                                                            },
                                                            '& .MuiInputBase-input::placeholder': { color: 'var(--muted-foreground)', opacity: 1 },
                                                            '& .MuiInputLabel-outlined': { color: 'var(--muted-foreground)' },
                                                       }}
                                                  />
                                             </Grid>
                                             <Grid item xs={12} sm={6}>
                                                  <TextField
                                                       label="Phone"
                                                       value={patient.contact.phone}
                                                       fullWidth
                                                       InputProps={{ readOnly: true, startAdornment: (<InputAdornment position="start"><Phone size={20} className="text-muted-foreground" /></InputAdornment>), className: 'text-foreground' }}
                                                       InputLabelProps={{
                                                            style: { color: 'inherit' },
                                                       }}
                                                       variant="outlined"
                                                       sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                 fieldset: { borderColor: 'var(--border)' },
                                                                 '&:hover fieldset': { borderColor: 'var(--border)' },
                                                                 '&.Mui-focused fieldset': { borderColor: 'var(--primary)' },
                                                                 '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border)' },
                                                                 '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border)' },
                                                                 '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--primary)' },
                                                            },
                                                            '& .MuiInputBase-input::placeholder': { color: 'var(--muted-foreground)', opacity: 1 },
                                                            '& .MuiInputLabel-outlined': { color: 'var(--muted-foreground)' },
                                                       }}
                                                  />
                                             </Grid>
                                             <Grid item xs={12}>
                                                  <TextField
                                                       label="Address"
                                                       value={patient.address}
                                                       fullWidth
                                                       InputProps={{ readOnly: true, startAdornment: (<InputAdornment position="start"><Home size={20} className="text-muted-foreground" /></InputAdornment>), className: 'text-foreground' }}
                                                       InputLabelProps={{
                                                            style: { color: 'inherit' },
                                                       }}
                                                       variant="outlined"
                                                       sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                 fieldset: { borderColor: 'var(--border)' },
                                                                 '&:hover fieldset': { borderColor: 'var(--border)' },
                                                                 '&.Mui-focused fieldset': { borderColor: 'var(--primary)' },
                                                                 '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border)' },
                                                                 '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border)' },
                                                                 '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--primary)' },
                                                            },
                                                            '& .MuiInputBase-input::placeholder': { color: 'var(--muted-foreground)', opacity: 1 },
                                                            '& .MuiInputLabel-outlined': { color: 'var(--muted-foreground)' },
                                                       }}
                                                  />
                                             </Grid>
                                        </Grid>
                                   </CardContent>
                              </Card>
                         </Grid>

                         <Grid item xs={12}>
                              <Card className="h-full shadow-lg rounded-lg border border-border bg-card">
                                   <CardContent>
                                        <Typography variant="h6" gutterBottom className="font-semibold mb-4 text-foreground">Medical History Summary</Typography>
                                        <Typography variant="body1" className="text-muted-foreground">{patient.medicalHistorySummary}</Typography>
                                   </CardContent>
                              </Card>
                         </Grid>
                    </Grid>
               </Paper>
          </Box>
     );
}

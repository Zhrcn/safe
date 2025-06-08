'use client';

import React, { useState, useEffect } from 'react';
import usePatient from '@/hooks/usePatient';
import {
    Typography, Box, TextField, InputAdornment, Avatar,
    CircularProgress, Chip, Fade, Paper, Divider
} from '@mui/material';
import {
    User, Mail, Phone, Home, CalendarDays, FileText, HeartPulse,
    DropletIcon, Edit, Save, X, AlertCircle, Check, MapPin,
    Shield, Stethoscope, Pill, Clock
} from 'lucide-react';
import { PatientPageContainer } from '@/components/patient/PatientComponents';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import PageHeader from '@/components/patient/PageHeader';
import FormLayout from '@/components/patient/FormLayout';
import LoadingState from '@/components/patient/LoadingState';
import ErrorState from '@/components/patient/ErrorState';
import { useNotification } from '@/components/ui/Notification';

const API_BASE_URL = 'http://localhost:5001/api';

function PatientProfilePage() {
    const {
        profile,
        loading,
        error,
        updatePatientProfile,
        fetchPatientData
    } = usePatient();

    const { showNotification } = useNotification();
    const [editMode, setEditMode] = useState(false);
    const [saving, setSaving] = useState(false);
    const [activeSection, setActiveSection] = useState('personal');
    
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: '',
        },
    });

    useEffect(() => {
        if (!loading && !error && profile) {
            const profileData = profile.data || profile;
            setFormData({
                firstName: profileData.firstName || '',
                lastName: profileData.lastName || '',
                email: profileData.email || '',
                phoneNumber: profileData.phoneNumber || '',
                address: profileData.address || {
                    street: '',
                    city: '',
                    state: '',
                    zipCode: '',
                    country: '',
                },
            });
        }
    }, [loading, error, profile]);

    const handleRefresh = () => {
        fetchPatientData();
    };

    const handleEditToggle = () => {
        if (editMode) {
            setFormData({
                firstName: profile.data?.firstName || profile.firstName || '',
                lastName: profile.data?.lastName || profile.lastName || '',
                email: profile.data?.email || profile.email || '',
                phoneNumber: profile.data?.phoneNumber || profile.phoneNumber || '',
                address: profile.data?.address || profile.address || {},
            });
        }
        setEditMode(!editMode);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('address.')) {
            const addressField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [addressField]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSave = async () => {
        if (!isFormValid()) {
            showNotification({
                message: 'Please fill in all required fields.',
                severity: 'warning',
            });
            return;
        }
        try {
            setSaving(true);
            
            const payload = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                address: formData.address,
            };
            
            const result = await updatePatientProfile(payload);
            
            if (result) {
                showNotification({
                    message: 'Profile updated successfully!',
                    severity: 'success',
                });
                setEditMode(false);
            } else {
                throw new Error('Failed to update profile');
            }
        } catch (err) {
            console.error('Error updating profile:', err);
            const errorMessage = err.data?.message || err.message || 'Failed to update profile. Please try again.';
            showNotification({
                message: errorMessage,
                severity: 'error',
            });
        } finally {
            setSaving(false);
        }
    };

    const isFormValid = () => {
        return (
            formData.firstName?.trim() !== '' &&
            formData.lastName?.trim() !== '' &&
            formData.email?.trim() !== '' &&
            formData.phoneNumber?.trim() !== '' &&
            formData.address?.street?.trim() !== '' &&
            formData.address?.city?.trim() !== '' &&
            formData.address?.state?.trim() !== '' &&
            formData.address?.zipCode?.trim() !== '' &&
            formData.address?.country?.trim() !== ''
        );
    };

    if (loading) {
        return (
            <PatientPageContainer>
                <LoadingState message="Loading your profile..." />
            </PatientPageContainer>
        );
    }

    if (error) {
        return (
            <PatientPageContainer>
                <ErrorState
                    title="Error Loading Profile"
                    message={error}
                    onRetry={handleRefresh}
                />
            </PatientPageContainer>
        );
    }

    if (!profile) {
        return (
            <PatientPageContainer>
                <ErrorState
                    title="No Profile Data"
                    message="No profile data available. Please try refreshing the page."
                    onRetry={fetchPatientData}
                />
            </PatientPageContainer>
        );
    }

    const renderProfileHeader = () => (
        <Card className="relative overflow-hidden">
            <Box className="flex flex-col md:flex-row items-center p-6 gap-6">
                <Avatar 
                    className="w-24 h-24 border-4 border-white shadow-lg"
                    src={profile.data?.profilePictureUrl || profile.profilePictureUrl}
                />
                <Box className="flex-1 text-center md:text-left">
                    <Typography variant="h4" className="font-bold mb-2">
                        {profile.data?.firstName || profile.firstName} {profile.data?.lastName || profile.lastName}
                    </Typography>
                    <Typography variant="body1" className="text-muted-foreground mb-4">
                        Patient ID: {profile.data?.userId || profile.userId}
                    </Typography>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        <Chip 
                            label="Patient" 
                            color="primary" 
                            size="small" 
                            className="bg-primary text-primary-foreground" 
                        />
                        <Chip 
                            label={profile.data?.gender || profile.gender || 'Not specified'} 
                            size="small" 
                            className="bg-secondary text-secondary-foreground" 
                        />
                    </div>
                </Box>
                {!editMode && (
                    <Button
                        variant="outlined"
                        startIcon={<Edit size={16} />}
                        onClick={handleEditToggle}
                        className="ml-auto"
                    >
                        Edit Profile
                    </Button>
                )}
            </Box>
        </Card>
    );

    const renderNavigation = () => (
        <Box className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {[
                { id: 'personal', label: 'Personal Info', icon: User },
                { id: 'medical', label: 'Medical Info', icon: Stethoscope },
                { id: 'insurance', label: 'Insurance', icon: Shield },
                { id: 'emergency', label: 'Emergency Contact', icon: AlertCircle },
            ].map(({ id, label, icon: Icon }) => (
                <Button
                    key={id}
                    variant={activeSection === id ? 'default' : 'outlined'}
                    startIcon={<Icon size={16} />}
                    onClick={() => setActiveSection(id)}
                    className="whitespace-nowrap"
                >
                    {label}
                </Button>
            ))}
        </Box>
    );

    const renderPersonalInfo = () => (
        <Fade in={activeSection === 'personal'}>
            <div>
                <FormLayout
                    title="Personal Information"
                    description="Update your personal details and contact information"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <TextField
                            label="First Name"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            fullWidth
                            InputProps={{
                                readOnly: !editMode,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <User size={20} className="text-muted-foreground" />
                                    </InputAdornment>
                                ) 
                            }}
                        />
                        <TextField
                            label="Last Name"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            fullWidth
                            InputProps={{
                                readOnly: !editMode,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <User size={20} className="text-muted-foreground" />
                                    </InputAdornment>
                                ) 
                            }}
                        />
                        <TextField
                            label="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            fullWidth
                            InputProps={{
                                readOnly: !editMode,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Mail size={20} className="text-muted-foreground" />
                                    </InputAdornment>
                                ) 
                            }}
                        />
                        <TextField
                            label="Phone Number"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            fullWidth
                            InputProps={{
                                readOnly: !editMode,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Phone size={20} className="text-muted-foreground" />
                                    </InputAdornment>
                                ) 
                            }}
                        />
                    </div>

                    <Divider className="my-6" />

                    <Typography variant="h6" className="mb-4 font-semibold">
                        Address Information
                    </Typography>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <TextField
                            label="Street"
                            name="address.street"
                            value={formData.address.street}
                            onChange={handleInputChange}
                            fullWidth
                            InputProps={{
                                readOnly: !editMode,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Home size={20} className="text-muted-foreground" />
                                    </InputAdornment>
                                ) 
                            }}
                        />
                        <TextField
                            label="City"
                            name="address.city"
                            value={formData.address.city}
                            onChange={handleInputChange}
                            fullWidth
                            InputProps={{
                                readOnly: !editMode,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <MapPin size={20} className="text-muted-foreground" />
                                    </InputAdornment>
                                ) 
                            }}
                        />
                        <TextField
                            label="State"
                            name="address.state"
                            value={formData.address.state}
                            onChange={handleInputChange}
                            fullWidth
                            InputProps={{
                                readOnly: !editMode,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <MapPin size={20} className="text-muted-foreground" />
                                    </InputAdornment>
                                ) 
                            }}
                        />
                        <TextField
                            label="Zip Code"
                            name="address.zipCode"
                            value={formData.address.zipCode}
                            onChange={handleInputChange}
                            fullWidth
                            InputProps={{
                                readOnly: !editMode,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <MapPin size={20} className="text-muted-foreground" />
                                    </InputAdornment>
                                ) 
                            }}
                        />
                        <TextField
                            label="Country"
                            name="address.country"
                            value={formData.address.country}
                            onChange={handleInputChange}
                            fullWidth
                            InputProps={{
                                readOnly: !editMode,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <MapPin size={20} className="text-muted-foreground" />
                                    </InputAdornment>
                                ) 
                            }}
                        />
                    </div>

                    {editMode && (
                        <Box className="flex justify-end gap-2 mt-6">
                            <Button
                                variant="outlined"
                                startIcon={<X size={16} />}
                                onClick={handleEditToggle}
                                disabled={saving}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="default"
                                startIcon={<Save size={16} />}
                                onClick={handleSave}
                                disabled={saving || !isFormValid()}
                                loading={saving}
                            >
                                Save Changes
                            </Button>
                        </Box>
                    )}
                </FormLayout>
            </div>
        </Fade>
    );

    const renderMedicalInfo = () => (
        <Fade in={activeSection === 'medical'}>
            <div>
                <FormLayout
                    title="Medical Information"
                    description="View your medical details and history"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <TextField
                            label="Date of Birth"
                            value={profile.data?.dateOfBirth || profile.dateOfBirth ? 
                                new Date(profile.data?.dateOfBirth || profile.dateOfBirth).toLocaleDateString() : 
                                'Not specified'}
                            fullWidth
                            InputProps={{
                                readOnly: true,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CalendarDays size={20} className="text-muted-foreground" />
                                    </InputAdornment>
                                ) 
                            }}
                        />
                        <TextField
                            label="Gender"
                            value={profile.data?.gender || profile.gender || 'Not specified'}
                            fullWidth
                            InputProps={{
                                readOnly: true,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <User size={20} className="text-muted-foreground" />
                                    </InputAdornment>
                                ) 
                            }}
                        />
                    </div>

                    <Divider className="my-6" />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <TextField
                            label="Medical Conditions"
                            value={(profile.data?.medicalFile?.medicalConditions || profile.medicalFile?.medicalConditions || []).join(', ') || 'None'}
                            fullWidth
                            multiline
                            rows={2}
                            InputProps={{
                                readOnly: true,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <HeartPulse size={20} className="text-muted-foreground" />
                                    </InputAdornment>
                                ) 
                            }}
                        />
                        <TextField
                            label="Allergies"
                            value={(profile.data?.medicalFile?.allergies || profile.medicalFile?.allergies || []).join(', ') || 'None'}
                            fullWidth
                            multiline
                            rows={2}
                            InputProps={{
                                readOnly: true,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AlertCircle size={20} className="text-muted-foreground" />
                                    </InputAdornment>
                                ) 
                            }}
                        />
                    </div>
                </FormLayout>
            </div>
        </Fade>
    );

    const renderInsuranceInfo = () => (
        <Fade in={activeSection === 'insurance'}>
            <div>
                <FormLayout
                    title="Insurance Information"
                    description="View your insurance details"
                >
                    {profile.data?.medicalFile?.insuranceDetails || profile.medicalFile?.insuranceDetails ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <TextField
                                label="Insurance Provider"
                                value={(profile.data?.medicalFile?.insuranceDetails || profile.medicalFile?.insuranceDetails).provider}
                                fullWidth
                                InputProps={{
                                    readOnly: true,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Shield size={20} className="text-muted-foreground" />
                                        </InputAdornment>
                                    ) 
                                }}
                            />
                            <TextField
                                label="Policy Number"
                                value={(profile.data?.medicalFile?.insuranceDetails || profile.medicalFile?.insuranceDetails).policyNumber}
                                fullWidth
                                InputProps={{
                                    readOnly: true,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <FileText size={20} className="text-muted-foreground" />
                                        </InputAdornment>
                                    ) 
                                }}
                            />
                            <TextField
                                label="Group Number"
                                value={(profile.data?.medicalFile?.insuranceDetails || profile.medicalFile?.insuranceDetails).groupNumber}
                                fullWidth
                                InputProps={{
                                    readOnly: true,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <FileText size={20} className="text-muted-foreground" />
                                        </InputAdornment>
                                    ) 
                                }}
                            />
                            <TextField
                                label="Expiry Date"
                                value={(profile.data?.medicalFile?.insuranceDetails || profile.medicalFile?.insuranceDetails).expiryDate ? 
                                    new Date((profile.data?.medicalFile?.insuranceDetails || profile.medicalFile?.insuranceDetails).expiryDate).toLocaleDateString() : 
                                    'N/A'}
                                fullWidth
                                InputProps={{
                                    readOnly: true,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Clock size={20} className="text-muted-foreground" />
                                        </InputAdornment>
                                    ) 
                                }}
                            />
                        </div>
                    ) : (
                        <Box className="text-center p-6 bg-muted/10 rounded-lg">
                            <Shield size={48} className="mx-auto text-muted-foreground mb-4" />
                            <Typography variant="h6" className="mb-2">
                                No Insurance Information
                            </Typography>
                            <Typography variant="body2" className="text-muted-foreground">
                                Your insurance details have not been added yet.
                            </Typography>
                        </Box>
                    )}
                </FormLayout>
            </div>
        </Fade>
    );

    const renderEmergencyContact = () => (
        <Fade in={activeSection === 'emergency'}>
            <div>
                <FormLayout
                    title="Emergency Contact"
                    description="View your emergency contact information"
                >
                    {profile.data?.medicalFile?.emergencyContact || profile.medicalFile?.emergencyContact ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <TextField
                                label="Contact Name"
                                value={(profile.data?.medicalFile?.emergencyContact || profile.medicalFile?.emergencyContact).name}
                                fullWidth
                                InputProps={{
                                    readOnly: true,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <User size={20} className="text-muted-foreground" />
                                        </InputAdornment>
                                    ) 
                                }}
                            />
                            <TextField
                                label="Relationship"
                                value={(profile.data?.medicalFile?.emergencyContact || profile.medicalFile?.emergencyContact).relationship}
                                fullWidth
                                InputProps={{
                                    readOnly: true,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <User size={20} className="text-muted-foreground" />
                                        </InputAdornment>
                                    ) 
                                }}
                            />
                            <TextField
                                label="Phone Number"
                                value={(profile.data?.medicalFile?.emergencyContact || profile.medicalFile?.emergencyContact).phone}
                                fullWidth
                                InputProps={{
                                    readOnly: true,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Phone size={20} className="text-muted-foreground" />
                                        </InputAdornment>
                                    ) 
                                }}
                            />
                            <TextField
                                label="Email"
                                value={(profile.data?.medicalFile?.emergencyContact || profile.medicalFile?.emergencyContact).email}
                                fullWidth
                                InputProps={{
                                    readOnly: true,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Mail size={20} className="text-muted-foreground" />
                                        </InputAdornment>
                                    ) 
                                }}
                            />
                        </div>
                    ) : (
                        <Box className="text-center p-6 bg-muted/10 rounded-lg">
                            <AlertCircle size={48} className="mx-auto text-muted-foreground mb-4" />
                            <Typography variant="h6" className="mb-2">
                                No Emergency Contact
                            </Typography>
                            <Typography variant="body2" className="text-muted-foreground">
                                Your emergency contact information has not been added yet.
                            </Typography>
                        </Box>
                    )}
                </FormLayout>
            </div>
        </Fade>
    );

    return (
        <PatientPageContainer>
            <PageHeader
                title="Profile"
                description="View and manage your personal information"
                breadcrumbs={[{ label: 'Profile', href: '/patient/profile' }]}
            />

            {renderProfileHeader()}
            {renderNavigation()}

            <div className="space-y-6">
                {renderPersonalInfo()}
                {renderMedicalInfo()}
                {renderInsuranceInfo()}
                {renderEmergencyContact()}
            </div>
        </PatientPageContainer>
    );
}

export default PatientProfilePage;

'use client';

import { useState } from 'react';
import { Box, Typography, Card, CardContent, Button, CircularProgress, Alert, Grid, IconButton } from '@mui/material';
import { useGetEmergencyContactsQuery, useAddEmergencyContactMutation, useUpdateEmergencyContactMutation, useDeleteEmergencyContactMutation } from '@/store/services/patient/patientApi';
import { User, Phone, Mail, MapPin, Edit2, Trash2, Plus } from 'lucide-react';
import PageHeader from '@/components/patient/PageHeader';

const ContactCard = ({ contact, onEdit, onDelete }) => (
    <Card>
        <CardContent>
            <Box className="flex items-center justify-between mb-4">
                <Box className="flex items-center gap-2">
                    <User className="text-primary" size={24} />
                    <Typography variant="h6" component="h3">
                        {contact.name}
                    </Typography>
                </Box>
                <Box className="flex items-center gap-2">
                    <IconButton
                        size="small"
                        onClick={() => onEdit(contact)}
                        className="text-primary"
                    >
                        <Edit2 size={18} />
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={() => onDelete(contact._id)}
                        className="text-error"
                    >
                        <Trash2 size={18} />
                    </IconButton>
                </Box>
            </Box>
            <Box className="space-y-2">
                <Box className="flex items-center gap-2">
                    <Phone size={18} className="text-muted-foreground" />
                    <Typography variant="body2">
                        {contact.phone}
                    </Typography>
                </Box>
                <Box className="flex items-center gap-2">
                    <Mail size={18} className="text-muted-foreground" />
                    <Typography variant="body2">
                        {contact.email}
                    </Typography>
                </Box>
                <Box className="flex items-center gap-2">
                    <MapPin size={18} className="text-muted-foreground" />
                    <Typography variant="body2">
                        {contact.address}
                    </Typography>
                </Box>
                <Box className="mt-2">
                    <Typography variant="body2" color="text.secondary">
                        Relationship: {contact.relationship}
                    </Typography>
                </Box>
            </Box>
        </CardContent>
    </Card>
);

export default function EmergencyContactsPage() {
    const { data: contacts, isLoading, error } = useGetEmergencyContactsQuery();
    const [addContact] = useAddEmergencyContactMutation();
    const [updateContact] = useUpdateEmergencyContactMutation();
    const [deleteContact] = useDeleteEmergencyContactMutation();
    const [isAddingContact, setIsAddingContact] = useState(false);

    if (isLoading) {
        return (
            <Box className="flex items-center justify-center min-h-[400px]">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box className="p-4">
                <Alert severity="error">
                    Error loading emergency contacts. Please try again later.
                </Alert>
            </Box>
        );
    }

    const handleAddContact = () => {
        setIsAddingContact(true);
        // TODO: Implement add contact form
    };

    const handleEditContact = (contact) => {
        // TODO: Implement edit contact form
    };

    const handleDeleteContact = async (contactId) => {
        if (window.confirm('Are you sure you want to delete this emergency contact?')) {
            try {
                await deleteContact(contactId).unwrap();
            } catch (error) {
                console.error('Failed to delete contact:', error);
            }
        }
    };

    return (
        <Box className="container mx-auto px-4 py-8">
            <PageHeader
                title="Emergency Contacts"
                description="Manage your emergency contact information"
            />

            <Box className="flex justify-end mb-6">
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Plus size={20} />}
                    onClick={handleAddContact}
                >
                    Add Emergency Contact
                </Button>
            </Box>

            <Grid container spacing={3}>
                {contacts?.map((contact) => (
                    <Grid item xs={12} md={6} key={contact._id}>
                        <ContactCard
                            contact={contact}
                            onEdit={handleEditContact}
                            onDelete={handleDeleteContact}
                        />
                    </Grid>
                ))}
            </Grid>

            {contacts?.length === 0 && (
                <Box className="text-center py-8">
                    <Typography variant="body1" color="text.secondary">
                        No emergency contacts added yet.
                    </Typography>
                </Box>
            )}
        </Box>
    );
} 
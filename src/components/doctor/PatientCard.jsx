'use client';

import { useState } from 'react';
import { 
    Box, 
    Card, 
    CardContent, 
    Typography, 
    Chip, 
    Button,
    IconButton, 
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Dialog,
    Avatar
} from '@mui/material';
import { 
    MoreVertical, 
    User, 
    Calendar, 
    FileText, 
    Pill, 
    Activity, 
    Send, 
    Edit, 
    Trash2, 
    MessageCircle 
} from 'lucide-react';
import { format } from 'date-fns';
import AddPatientForm from './AddPatientForm';
import PrescriptionForm from './PrescriptionForm';
import PatientConditionForm from './PatientConditionForm';
import ReferralForm from './ReferralForm';

export default function PatientCard({ patient }) {
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [activeDialog, setActiveDialog] = useState(null);
    
    const handleMenuOpen = (event) => {
        setMenuAnchor(event.currentTarget);
    };
    
    const handleMenuClose = () => {
        setMenuAnchor(null);
    };
    
    const handleOpenDialog = (dialogType) => {
        setActiveDialog(dialogType);
        handleMenuClose();
    };
    
    const handleCloseDialog = () => {
        setActiveDialog(null);
    };
    
    const getStatusChipProps = (status) => {
        switch(status.toLowerCase()) {
            case 'active':
                return { 
                    color: 'success', 
                    className: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                };
            case 'urgent':
                return { 
                    color: 'error', 
                    className: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
                };
            case 'inactive':
                return { 
                    color: 'default', 
                    className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                };
            default:
                return { 
                    color: 'default', 
                    className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                };
        }
    };
    
    const getInitials = (patient) => {
        const name = `${patient.user?.firstName || ''} ${patient.user?.lastName || ''}`.trim();
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase();
    };

    return (
        <>
            <Card className="border border-border hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                    <Box className="p-4 flex items-center border-b border-border">
                        <Avatar 
                            className="bg-primary text-primary-foreground"
                            sx={{ width: 40, height: 40 }}
                        >
                            {getInitials(patient)}
                        </Avatar>
                        <Box className="ml-3 flex-grow">
                            <Typography variant="h6" className="text-foreground font-medium">
                                {`${patient.user?.firstName || ''} ${patient.user?.lastName || ''}`.trim()}
                            </Typography>
                            <Typography variant="body2" className="text-muted-foreground">
                                {patient.age} years • {patient.gender}
                            </Typography>
                        </Box>
                        <Chip 
                            label={patient.user?.isActive ? 'active' : 'inactive'}
                            size="small"
                            {...getStatusChipProps(patient.user?.isActive ? 'active' : 'inactive')}
                        />
                    </Box>
                    
                    <Box className="p-4">
                        <Typography variant="body1" className="text-foreground font-medium mb-2">
                            Condition
                        </Typography>
                        <Typography variant="body2" className="text-muted-foreground mb-4">
                            {patient.condition}
                        </Typography>
                        
                        <Box className="grid grid-cols-2 gap-2 mb-4">
                            <Box>
                                <Typography variant="caption" className="text-muted-foreground">
                                    Medical ID
                                </Typography>
                                <Typography variant="body2" className="text-foreground">
                                    {patient.medicalId || 'N/A'}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" className="text-muted-foreground">
                                    Last Visit
                                </Typography>
                                <Typography variant="body2" className="text-foreground">
                                    {patient.lastAppointment || 'None'}
                                </Typography>
                            </Box>
                        </Box>
                        
                        <Box className="flex justify-between items-center">
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<Activity size={16} />}
                                onClick={() => handleOpenDialog('condition')}
                                className="text-primary border-primary hover:bg-primary/10"
                            >
                                Update
                            </Button>
                            
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<FileText size={16} />}
                                onClick={() => handleOpenDialog('prescription')}
                                className="text-primary border-primary hover:bg-primary/10"
                            >
                                Prescribe
                            </Button>
                            
                            <IconButton
                                size="small"
                                onClick={handleMenuOpen}
                                className="text-muted-foreground"
                            >
                                <MoreVertical size={18} />
                            </IconButton>
                            
                            <Menu
                                anchorEl={menuAnchor}
                                open={Boolean(menuAnchor)}
                                onClose={handleMenuClose}
                                PaperProps={{
                                    className: "bg-popover text-popover-foreground border border-border"
                                }}
                            >
                                <MenuItem onClick={() => handleOpenDialog('edit')}>
                                    <ListItemIcon>
                                        <Edit size={18} className="text-muted-foreground" />
                                    </ListItemIcon>
                                    <ListItemText>Edit Patient</ListItemText>
                                </MenuItem>
                                <MenuItem onClick={() => handleOpenDialog('referral')}>
                                    <ListItemIcon>
                                        <Send size={18} className="text-muted-foreground" />
                                    </ListItemIcon>
                                    <ListItemText>Create Referral</ListItemText>
                                </MenuItem>
                                <MenuItem onClick={() => window.location.href = `/doctor/messaging`}>
                                    <ListItemIcon>
                                        <MessageCircle size={18} className="text-muted-foreground" />
                                    </ListItemIcon>
                                    <ListItemText>Send Message</ListItemText>
                                </MenuItem>
                            </Menu>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
            
            {/* Edit Patient Dialog */}
            <Dialog
                open={activeDialog === 'edit'}
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    className: "bg-background"
                }}
            >
                <AddPatientForm 
                    onClose={handleCloseDialog} 
                    patientId={patient.id}
                    initialData={patient}
                    isEdit={true}
                />
            </Dialog>
            
            {/* Prescription Dialog */}
            <Dialog
                open={activeDialog === 'prescription'}
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    className: "bg-background"
                }}
            >
                <PrescriptionForm 
                    onClose={handleCloseDialog} 
                    patientId={patient.id}
                    patientName={patient.name}
                />
            </Dialog>
            
            {/* Condition Update Dialog */}
            <Dialog
                open={activeDialog === 'condition'}
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    className: "bg-background"
                }}
            >
                <PatientConditionForm 
                    onClose={handleCloseDialog} 
                    patientId={patient.id}
                    patientName={patient.name}
                    previousUpdates={patient.conditionUpdates}
                />
            </Dialog>
            
            {/* Referral Dialog */}
            <Dialog
                open={activeDialog === 'referral'}
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    className: "bg-background"
                }}
            >
                <ReferralForm 
                    onClose={handleCloseDialog} 
                    patientId={patient.id}
                    patientName={patient.name}
                    previousReferrals={patient.referrals}
                />
            </Dialog>
        </>
    );
} 
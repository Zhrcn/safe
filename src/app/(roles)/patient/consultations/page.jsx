'use client';

import React, { useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Grid,
    Chip,
    Stack,
    Avatar,
    Tooltip,
    useTheme,
    alpha,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from '@mui/material';
import {
    VideoCall as VideoCallIcon,
    Chat as ChatIcon,
    Person as UserIcon,
    AccessTime as ClockIcon,
    Download as DownloadIcon,
    AttachFile as AttachFileIcon,
    Check as CheckIcon,
    Close as CloseIcon,
    Send as SendIcon,
} from '@mui/icons-material';
import { mockPatientData } from '@/mockdata/patientData';
import PageHeader from '@/components/patient/PageHeader';

const ConsultationCard = ({ consultation, onOpenDialog }) => {
    const theme = useTheme();
    const statusColors = {
        scheduled: 'info',
        completed: 'success',
        cancelled: 'error',
    };

    const statusIcons = {
        scheduled: <ClockIcon />,
        completed: <CheckIcon />,
        cancelled: <CloseIcon />,
    };

    return (
        <Card 
            elevation={0}
            sx={{
                height: '100%',
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.1)}`,
                },
            }}
        >
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Avatar 
                            sx={{ 
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                color: theme.palette.primary.main,
                            }}
                        >
                            {consultation.type === 'video' ? <VideoCallIcon /> : <ChatIcon />}
                        </Avatar>
                        <Box>
                            <Typography variant="h6" fontWeight="bold">
                                {consultation.doctorName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {consultation.type.charAt(0).toUpperCase() + consultation.type.slice(1)} Consultation
                            </Typography>
                        </Box>
                    </Box>
                    <Chip
                        icon={statusIcons[consultation.status]}
                        label={consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
                        color={statusColors[consultation.status]}
                        size="small"
                    />
                </Box>

                <Stack spacing={2}>
                    <Box 
                        sx={{
                            p: 2,
                            borderRadius: 1,
                            bgcolor: alpha(theme.palette.background.default, 0.5),
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        }}
                    >
                        <Stack spacing={1}>
                            <Typography variant="body2">
                                <strong>Date:</strong> {new Date(consultation.date).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Time:</strong> {consultation.time}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Duration:</strong> {consultation.duration}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Reason:</strong> {consultation.reason}
                            </Typography>
                        </Stack>
                    </Box>

                    {consultation.notes && (
                        <Typography variant="body2" color="text.secondary">
                            <strong>Notes:</strong> {consultation.notes}
                        </Typography>
                    )}

                    {consultation.attachments && consultation.attachments.length > 0 && (
                        <Box>
                            <Typography variant="subtitle2" gutterBottom>
                                Attachments:
                            </Typography>
                            <Stack direction="row" spacing={1}>
                                {consultation.attachments.map((attachment, index) => (
                                    <Chip
                                        key={index}
                                        icon={<AttachFileIcon />}
                                        label={attachment.name}
                                        size="small"
                                        onClick={() => window.open(attachment.url, '_blank')}
                                    />
                                ))}
                            </Stack>
                        </Box>
                    )}
                </Stack>

                <Box display="flex" gap={1} mt={2}>
                    {consultation.status === 'scheduled' && (
                        <>
                            <Button
                                size="small"
                                variant="contained"
                                startIcon={<VideoCallIcon />}
                                sx={{ flex: 1 }}
                                onClick={() => onOpenDialog(consultation)}
                            >
                                Join {consultation.type === 'video' ? 'Video' : 'Chat'}
                            </Button>
                            <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                sx={{ flex: 1 }}
                            >
                                Cancel
                            </Button>
                        </>
                    )}
                    {consultation.status === 'completed' && (
                        <Button
                            size="small"
                            variant="outlined"
                            startIcon={<DownloadIcon />}
                            sx={{ flex: 1 }}
                        >
                            Download Summary
                        </Button>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

export default function ConsultationsPage() {
    const [consultations, setConsultations] = useState(mockPatientData.consultations);
    const [selectedConsultation, setSelectedConsultation] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [message, setMessage] = useState('');

    const handleOpenDialog = (consultation) => {
        setSelectedConsultation(consultation);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedConsultation(null);
        setMessage('');
    };

    const handleSendMessage = () => {
        if (message.trim()) {
            // Here you would typically send the message to your backend
            console.log('Sending message:', message);
            setMessage('');
        }
    };

    return (
        <Box className="container mx-auto px-4 py-8">
            <PageHeader
                title="Consultations"
                description="View and manage your medical consultations"
            />

            <Grid container spacing={3}>
                {consultations.map((consultation) => (
                    <Grid item xs={12} md={6} key={consultation.id}>
                        <ConsultationCard
                            consultation={consultation}
                            onOpenDialog={handleOpenDialog}
                        />
                    </Grid>
                ))}
            </Grid>

            <Dialog 
                open={dialogOpen} 
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {selectedConsultation?.type === 'video' ? 'Video Consultation' : 'Chat Consultation'}
                </DialogTitle>
                <DialogContent>
                    {selectedConsultation && (
                        <Stack spacing={2} sx={{ mt: 2 }}>
                            <Box display="flex" alignItems="center" gap={1}>
                                <Avatar>
                                    <UserIcon />
                                </Avatar>
                                <Typography variant="h6">
                                    Dr. {selectedConsultation.doctorName}
                                </Typography>
                            </Box>
                            
                            {selectedConsultation.type === 'chat' && (
                                <Box sx={{ mt: 2 }}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={4}
                                        variant="outlined"
                                        placeholder="Type your message..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    />
                                    <Box display="flex" justifyContent="flex-end" mt={1}>
                                        <Button
                                            variant="contained"
                                            endIcon={<SendIcon />}
                                            onClick={handleSendMessage}
                                        >
                                            Send Message
                                        </Button>
                                    </Box>
                                </Box>
                            )}
                        </Stack>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Close</Button>
                    {selectedConsultation?.type === 'video' && (
                        <Button 
                            variant="contained" 
                            startIcon={<VideoCallIcon />}
                        >
                            Start Video Call
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Box>
    );
}

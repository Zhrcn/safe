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
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Badge,
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
    Add as AddIcon,
    ChatBubble as MessageIcon,
    Description as FileTextIcon,
    Image as ImageIcon,
} from '@mui/icons-material';
import { mockPatientData } from '@/mockdata/patientData';
import PageHeader from '@/components/patient/PageHeader';

const ConsultationCard = ({ consultation, onOpenDialog }) => {
    const theme = useTheme();
    const statusColors = {
        scheduled: 'info',
        completed: 'success',
        cancelled: 'error',
        pending: 'warning',
    };

    const statusIcons = {
        scheduled: <ClockIcon />,
        completed: <CheckIcon />,
        cancelled: <CloseIcon />,
        pending: <ClockIcon />,
    };

    const getLastMessage = () => {
        if (!consultation?.messages?.length) {
            return "No messages yet";
        }
        const lastMessage = consultation.messages[consultation.messages.length - 1];
        return lastMessage.message || "No message content";
    };

    const getLastMessageTime = () => {
        if (!consultation?.messages?.length) {
            return new Date(consultation?.date || new Date()).toLocaleString();
        }
        const lastMessage = consultation.messages[consultation.messages.length - 1];
        return new Date(lastMessage.timestamp || consultation.date).toLocaleString();
    };

    const getUnreadCount = () => {
        if (!consultation?.messages?.length) return 0;
        return consultation.messages.filter(msg => !msg.isDoctor && !msg.read).length;
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
                        <Badge
                            badgeContent={getUnreadCount()}
                            color="primary"
                            overlap="circular"
                        >
                            <Avatar 
                                sx={{ 
                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                    color: theme.palette.primary.main,
                                }}
                            >
                                {consultation.type === 'video' ? <VideoCallIcon /> : <ChatIcon />}
                            </Avatar>
                        </Badge>
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
                            <Typography variant="body2" noWrap>
                                <strong>Last Message:</strong> {getLastMessage()}
            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {getLastMessageTime()}
            </Typography>
                        </Stack>
                    </Box>

                    {consultation.attachments && consultation.attachments.length > 0 && (
                        <Box>
                            <Typography variant="subtitle2" gutterBottom>
                                Attachments:
                </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
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
                    <Button
                        size="small"
                        variant="contained"
                        startIcon={<ChatIcon />}
                        sx={{ flex: 1 }}
                        onClick={() => onOpenDialog(consultation)}
                    >
                        {consultation.status === 'pending' ? 'View' : 'Continue'}
                    </Button>
                    {consultation.status === 'pending' && (
                        <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            sx={{ flex: 1 }}
                        >
                            Cancel
                        </Button>
            )}
                </Box>
        </CardContent>
    </Card>
);
};

const NewConsultationDialog = ({ open, onClose, onSubmit }) => {
    const [question, setQuestion] = useState('');
    const [attachments, setAttachments] = useState([]);
    const fileInputRef = React.useRef(null);

    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files);
        const newAttachments = files.map(file => ({
            name: file.name,
            type: file.type,
            size: file.size,
            file: file,
            url: URL.createObjectURL(file)
        }));
        setAttachments(prev => [...prev, ...newAttachments]);
    };

    const handleRemoveAttachment = (index) => {
        const attachment = attachments[index];
        if (attachment.url) {
            URL.revokeObjectURL(attachment.url);
        }
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        if (question.trim()) {
            onSubmit({
                question,
                attachments: attachments.map(att => ({
                    name: att.name,
                    type: att.type,
                    size: att.size,
                    url: att.url
                })),
                timestamp: new Date().toISOString(),
            });
            // Clean up object URLs
            attachments.forEach(att => {
                if (att.url) {
                    URL.revokeObjectURL(att.url);
                }
            });
            setQuestion('');
            setAttachments([]);
            onClose();
        }
    };

    const handleClose = () => {
        // Clean up object URLs before closing
        attachments.forEach(att => {
            if (att.url) {
                URL.revokeObjectURL(att.url);
            }
        });
        setQuestion('');
        setAttachments([]);
        onClose();
    };

    const getFileIcon = (fileType) => {
        if (fileType.startsWith('image/')) {
            return <ImageIcon />;
        }
        return <FileTextIcon />;
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>New Consultation Request</DialogTitle>
                <DialogContent>
                <Stack spacing={3} sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                        multiline
                        rows={4}
                        label="Your Question"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Describe your medical concern or question..."
                    />
                    
                    <Box>
                        <Typography variant="subtitle2" gutterBottom>
                            Attachments
                        </Typography>
                        <Stack spacing={1}>
                            {attachments.map((attachment, index) => (
                                <Chip
                                    key={index}
                                    label={`${attachment.name} (${(attachment.size / 1024).toFixed(1)} KB)`}
                                    onDelete={() => handleRemoveAttachment(index)}
                                    icon={getFileIcon(attachment.type)}
                                    sx={{ maxWidth: '100%' }}
                                />
                            ))}
                        </Stack>
                        <Button
                            startIcon={<AttachFileIcon />}
                            onClick={() => fileInputRef.current?.click()}
                            sx={{ mt: 1 }}
                        >
                            Add Attachment
                        </Button>
                        <input
                            type="file"
                            multiple
                            hidden
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            accept="image/*,.pdf,.doc,.docx,.txt"
                        />
                    </Box>
                </Stack>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button 
                    variant="contained" 
                    onClick={handleSubmit}
                    disabled={!question.trim()}
                >
                    Submit
                    </Button>
                </DialogActions>
        </Dialog>
    );
};

const ConsultationThread = ({ consultation, onReply }) => {
    const theme = useTheme();
    const [reply, setReply] = useState('');
    const messagesEndRef = React.useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    React.useEffect(() => {
        scrollToBottom();
    }, [consultation?.messages]);

    const handleSendReply = () => {
        if (reply.trim()) {
            onReply({
                message: reply,
                timestamp: new Date().toISOString(),
            });
            setReply('');
        }
    };

        return (
        <Box sx={{ height: '60vh', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ 
                flex: 1, 
                overflowY: 'auto', 
                p: 2,
                bgcolor: alpha(theme.palette.background.default, 0.5),
                borderRadius: 1,
            }}>
                <List>
                    {consultation?.messages?.map((message, index) => (
                        <ListItem
                            key={index}
                            alignItems="flex-start"
                            sx={{
                                flexDirection: message.isDoctor ? 'row-reverse' : 'row',
                                gap: 2,
                                mb: 2,
                            }}
                        >
                            <ListItemAvatar>
                                <Avatar
                                    sx={{
                                        bgcolor: message.isDoctor 
                                            ? alpha(theme.palette.primary.main, 0.1)
                                            : alpha(theme.palette.secondary.main, 0.1),
                                        color: message.isDoctor 
                                            ? theme.palette.primary.main
                                            : theme.palette.secondary.main,
                                    }}
                                >
                                    {message.isDoctor ? <UserIcon /> : <MessageIcon />}
                                </Avatar>
                            </ListItemAvatar>
                            <Box
                                sx={{
                                    maxWidth: '70%',
                                    bgcolor: message.isDoctor 
                                        ? alpha(theme.palette.primary.main, 0.1)
                                        : alpha(theme.palette.background.paper, 0.8),
                                    borderRadius: 2,
                                    p: 2,
                                    position: 'relative',
                                }}
                            >
                                <Typography variant="body1">{message.message}</Typography>
                                {message.attachments?.map((attachment, idx) => (
                                    <Chip
                                        key={idx}
                                        icon={<FileTextIcon />}
                                        label={attachment.name}
                                        size="small"
                                        sx={{ mt: 1, mr: 1 }}
                                        onClick={() => window.open(attachment.url, '_blank')}
                                    />
                                ))}
                                <Typography 
                                    variant="caption" 
                                    color="text.secondary" 
                                    sx={{ 
                                        display: 'block', 
                                        mt: 1,
                                        textAlign: message.isDoctor ? 'right' : 'left',
                                    }}
                                >
                                    {new Date(message.timestamp || consultation.date).toLocaleString()}
                                </Typography>
                            </Box>
                        </ListItem>
                    ))}
                    <div ref={messagesEndRef} />
                </List>
            </Box>
            <Box sx={{ 
                mt: 2, 
                p: 2, 
                borderTop: 1, 
                borderColor: 'divider',
                bgcolor: 'background.paper',
            }}>
                <Stack direction="row" spacing={1}>
                    <TextField
                        fullWidth
                        multiline
                        rows={2}
                        placeholder="Type your reply..."
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendReply();
                            }
                        }}
                    />
                    <Button
                        variant="contained"
                        onClick={handleSendReply}
                        disabled={!reply.trim()}
                        sx={{ minWidth: 100 }}
                    >
                        Send
                    </Button>
                </Stack>
            </Box>
            </Box>
        );
};

export default function ConsultationsPage() {
    const [consultations, setConsultations] = useState(mockPatientData.consultations.map(consultation => ({
        ...consultation,
        messages: consultation.messages || [],
    })));
    const [selectedConsultation, setSelectedConsultation] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newConsultationDialogOpen, setNewConsultationDialogOpen] = useState(false);

    const handleOpenDialog = (consultation) => {
        setSelectedConsultation(consultation);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedConsultation(null);
    };

    const handleNewConsultation = (consultationData) => {
        const newConsultation = {
            id: consultations.length + 1,
            doctorId: 1, // Default to primary doctor
            doctorName: "Dr. Sarah Johnson",
            date: new Date().toISOString(),
            type: "chat",
            status: "pending",
            messages: [{
                message: consultationData.question,
                timestamp: consultationData.timestamp,
                isDoctor: false,
                attachments: consultationData.attachments.map(att => ({
                    name: att.name,
                    type: att.type,
                    size: att.size,
                    url: att.url
                })),
            }],
        };
        setConsultations(prev => [newConsultation, ...prev]);
    };

    const handleReply = (replyData) => {
        setConsultations(prev => {
            const updatedConsultations = prev.map(consultation => {
                if (consultation.id === selectedConsultation.id) {
                    const updatedMessages = [
                        ...(consultation.messages || []),
                        {
                            ...replyData,
                            isDoctor: true,
                        },
                    ];
                    return {
                        ...consultation,
                        messages: updatedMessages,
                    };
                }
                return consultation;
            });
            
            // Update the selected consultation with the new message
            const updatedSelectedConsultation = updatedConsultations.find(
                c => c.id === selectedConsultation.id
            );
            setSelectedConsultation(updatedSelectedConsultation);
            
            return updatedConsultations;
        });
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1400px', margin: '0 auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <PageHeader
                    title="Consultations"
                    subtitle="Communicate with your healthcare providers"
                />
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setNewConsultationDialogOpen(true)}
                >
                    New Consultation
                </Button>
            </Box>

            <Grid container spacing={3}>
                {consultations.map((consultation) => (
                    <Grid 
                        key={consultation.id} 
                        sx={{ 
                            width: {
                                xs: '100%',
                                md: '50%',
                                lg: '33.33%'
                            }
                        }}
                    >
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
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        height: '80vh',
                        maxHeight: '800px',
                    }
                }}
            >
                <DialogTitle>
                    Consultation with {selectedConsultation?.doctorName}
                </DialogTitle>
                <DialogContent sx={{ p: 0 }}>
                    {selectedConsultation && (
                        <ConsultationThread
                consultation={selectedConsultation}
                            onReply={handleReply}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Close</Button>
                </DialogActions>
            </Dialog>

            <NewConsultationDialog
                open={newConsultationDialogOpen}
                onClose={() => setNewConsultationDialogOpen(false)}
                onSubmit={handleNewConsultation}
            />
        </Box>
    );
}

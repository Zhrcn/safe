import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    Divider,
    Chip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    AttachFile as AttachmentIcon
} from '@mui/icons-material';
import { fetchConsultationsByPatient } from '../../../store/slices/doctor/doctorConsultationsSlice';
import { createConsultation, updateConsultation, addConsultationNote } from '../../../store/slices/doctor/doctorConsultationsSlice';

const ConsultationPaper = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius
}));

const Consultations = ({ patientId }) => {
    const dispatch = useDispatch();
    const { consultations, loading } = useSelector((state) => state.doctorConsultations);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [selectedConsultation, setSelectedConsultation] = React.useState(null);
    const [note, setNote] = React.useState('');

    useEffect(() => {
        dispatch(fetchConsultationsByPatient(patientId));
    }, [dispatch, patientId]);

    const handleOpenDialog = (consultation = null) => {
        setSelectedConsultation(consultation);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedConsultation(null);
        setNote('');
    };

    const handleAddNote = () => {
        if (selectedConsultation && note.trim()) {
            dispatch(addConsultationNote({
                consultationId: selectedConsultation.id,
                note: note.trim()
            }));
            setNote('');
        }
    };

    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'scheduled':
                return 'primary';
            case 'in-progress':
                return 'warning';
            case 'completed':
                return 'success';
            case 'cancelled':
                return 'error';
            default:
                return 'default';
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
                <Typography>Loading consultations...</Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Consultations</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    New Consultation
                </Button>
            </Box>

            <List>
                {consultations.map((consultation, index) => (
                    <React.Fragment key={consultation.id}>
                        <ConsultationPaper>
                            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                <Box>
                                    <Typography variant="subtitle1">
                                        {formatDate(consultation.date)}
                                    </Typography>
                                    <Chip
                                        label={consultation.status}
                                        color={getStatusColor(consultation.status)}
                                        size="small"
                                        sx={{ mt: 1 }}
                                    />
                                </Box>
                                <Box>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleOpenDialog(consultation)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton size="small">
                                        <AttachmentIcon />
                                    </IconButton>
                                </Box>
                            </Box>

                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                {consultation.notes}
                            </Typography>

                            {consultation.attachments?.length > 0 && (
                                <Box mt={1}>
                                    <Typography variant="body2" color="text.secondary">
                                        Attachments:
                                    </Typography>
                                    <Box display="flex" gap={1} mt={0.5}>
                                        {consultation.attachments.map((attachment) => (
                                            <Chip
                                                key={attachment.id}
                                                label={attachment.name}
                                                size="small"
                                                icon={<AttachmentIcon />}
                                                onClick={() => window.open(attachment.url)}
                                            />
                                        ))}
                                    </Box>
                                </Box>
                            )}
                        </ConsultationPaper>
                        {index < consultations.length - 1 && <Divider />}
                    </React.Fragment>
                ))}
            </List>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {selectedConsultation ? 'Edit Consultation' : 'New Consultation'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Notes"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleAddNote} variant="contained">
                        {selectedConsultation ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Consultations; 
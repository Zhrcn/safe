import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    IconButton,
    TextField,
    InputAdornment,
    Chip,
    CircularProgress,
    Alert
} from '@mui/material';
import {
    Search as SearchIcon,
    Star as StarIcon,
    StarBorder as StarBorderIcon,
    Person as PersonIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useGetPatientsQuery } from '@/store/services/doctor/doctorApi';
import {
    addPatientToFavorites,
    removePatientFromFavorites
} from '../../store/slices/doctor/doctorPatientsSlice';

const PatientList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchQuery, setSearchQuery] = useState('');
    const { data: patients, isLoading, error } = useGetPatientsQuery();
    const favorites = useSelector(state => state.doctorPatients.favorites);

    const handlePatientClick = (patientId) => {
        navigate(`/doctor/patients/${patientId}`);
    };

    const handleFavoriteToggle = (patientId, e) => {
        e.stopPropagation();
        if (favorites.includes(patientId)) {
            dispatch(removePatientFromFavorites(patientId));
        } else {
            dispatch(addPatientToFavorites(patientId));
        }
    };

    const filteredPatients = patients?.filter(patient =>
        patient.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mt: 2 }}>
                Error loading patients: {error.message}
            </Alert>
        );
    }

    return (
        <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
                Patients
            </Typography>

            <TextField
                fullWidth
                variant="outlined"
                placeholder="Search patients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ mb: 2 }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    )
                }}
            />

            <List>
                {filteredPatients?.map((patient) => (
                    <ListItem
                        key={patient.id}
                        button
                        onClick={() => handlePatientClick(patient.id)}
                        sx={{
                            mb: 1,
                            borderRadius: 1,
                            '&:hover': {
                                bgcolor: 'action.hover'
                            }
                        }}
                    >
                        <ListItemAvatar>
                            <Avatar>
                                <PersonIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={`${patient.firstName} ${patient.lastName}`}
                            secondary={
                                <Box component="span" sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        {patient.email}
                                    </Typography>
                                    <Chip
                                        size="small"
                                        label={patient.bloodType}
                                        color="primary"
                                        variant="outlined"
                                    />
                                </Box>
                            }
                        />
                        <IconButton
                            onClick={(e) => handleFavoriteToggle(patient.id, e)}
                            color="primary"
                        >
                            {favorites.includes(patient.id) ? (
                                <StarIcon />
                            ) : (
                                <StarBorderIcon />
                            )}
                        </IconButton>
                    </ListItem>
                ))}
            </List>

            {filteredPatients?.length === 0 && (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight={100}
                >
                    <Typography color="text.secondary">
                        No patients found
                    </Typography>
                </Box>
            )}
        </Paper>
    );
};

export default PatientList; 
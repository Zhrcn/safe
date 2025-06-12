import React from 'react';
import { useSelector } from 'react-redux';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    Divider,
    Chip,
    Paper,
    Grid
} from '@mui/material';
import {
    LocalHospital as ConditionIcon,
    Warning as AllergyIcon,
    Vaccines as MedicationIcon,
    Timeline as TimelineIcon
} from '@mui/icons-material';

const SectionPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2)
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2)
}));

const MedicalHistory = ({ patientId }) => {
    const { selectedPatient: patient } = useSelector((state) => state.doctorPatients);

    if (!patient) return null;

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <Box>
            <Grid container spacing={3}>
                {/* Medical Conditions */}
                <Grid item xs={12} md={6}>
                    <SectionPaper>
                        <SectionTitle variant="h6">
                            <ConditionIcon color="primary" />
                            Medical Conditions
                        </SectionTitle>
                        <List>
                            {patient.medicalConditions?.map((condition, index) => (
                                <React.Fragment key={condition.id}>
                                    <ListItem>
                                        <ListItemText
                                            primary={condition.name}
                                            secondary={
                                                <>
                                                    <Typography
                                                        component="span"
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >
                                                        Diagnosed: {formatDate(condition.diagnosedDate)}
                                                    </Typography>
                                                    <br />
                                                    <Typography
                                                        component="span"
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >
                                                        Status: {condition.status}
                                                    </Typography>
                                                </>
                                            }
                                        />
                                    </ListItem>
                                    {index < patient.medicalConditions.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    </SectionPaper>
                </Grid>

                {/* Allergies */}
                <Grid item xs={12} md={6}>
                    <SectionPaper>
                        <SectionTitle variant="h6">
                            <AllergyIcon color="error" />
                            Allergies
                        </SectionTitle>
                        <Box display="flex" flexWrap="wrap" gap={1}>
                            {patient.allergies?.map((allergy) => (
                                <Chip
                                    key={allergy.id}
                                    label={allergy.name}
                                    color="error"
                                    variant="outlined"
                                    icon={<AllergyIcon />}
                                />
                            ))}
                        </Box>
                    </SectionPaper>
                </Grid>

                {/* Current Medications */}
                <Grid item xs={12} md={6}>
                    <SectionPaper>
                        <SectionTitle variant="h6">
                            <MedicationIcon color="secondary" />
                            Current Medications
                        </SectionTitle>
                        <List>
                            {patient.currentMedications?.map((medication, index) => (
                                <React.Fragment key={medication.id}>
                                    <ListItem>
                                        <ListItemText
                                            primary={medication.name}
                                            secondary={
                                                <>
                                                    <Typography
                                                        component="span"
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >
                                                        Dosage: {medication.dosage}
                                                    </Typography>
                                                    <br />
                                                    <Typography
                                                        component="span"
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >
                                                        Frequency: {medication.frequency}
                                                    </Typography>
                                                </>
                                            }
                                        />
                                    </ListItem>
                                    {index < patient.currentMedications.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    </SectionPaper>
                </Grid>

                {/* Family History */}
                <Grid item xs={12} md={6}>
                    <SectionPaper>
                        <SectionTitle variant="h6">
                            <TimelineIcon color="info" />
                            Family History
                        </SectionTitle>
                        <List>
                            {patient.familyHistory?.map((history, index) => (
                                <React.Fragment key={history.id}>
                                    <ListItem>
                                        <ListItemText
                                            primary={history.condition}
                                            secondary={
                                                <>
                                                    <Typography
                                                        component="span"
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >
                                                        Relation: {history.relation}
                                                    </Typography>
                                                    <br />
                                                    <Typography
                                                        component="span"
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >
                                                        Notes: {history.notes}
                                                    </Typography>
                                                </>
                                            }
                                        />
                                    </ListItem>
                                    {index < patient.familyHistory.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    </SectionPaper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default MedicalHistory; 
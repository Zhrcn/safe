'use client';
import React, { useState, useEffect } from 'react';
import { mockPatientData } from '@/mockdata/patientData';
import PageHeader from '@/components/patient/PageHeader';
import {
    AccessTime as AccessTimeIcon,
    Add as PlusIcon,
    Check as CheckIcon,
    Close as XIcon,
    Delete as TrashIcon,
    Edit as EditIcon,
    Event as CalendarIcon,
    LocationOn as LocationIcon,
    Person as PersonIcon,
    Search as SearchIcon,
    Warning as AlertCircleIcon,
    VideoCall as VideoCallIcon,
    Chat as ChatIcon,
    Send as SendIcon,
    LocalPharmacy as PharmacyIcon,
    MedicalServices as MedicalServicesIcon,
    Work as WorkIcon,
    School as SchoolIcon,
    Language as LanguageIcon,
    FilterList as FilterIcon,
    Sort as SortIcon,
} from '@mui/icons-material';
import {
    Box,
    Tabs,
    Tab,
    TextField,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Stack,
    Avatar,
    Typography,
    Card,
    CardContent,
    Chip,
    Rating,
    useTheme,
    alpha,
    InputAdornment,
    IconButton,
    Menu,
    MenuItem,
    CircularProgress,
    Fade,
    Tooltip,
    Divider,
    Alert,
    Snackbar,
} from '@mui/material';

const ProviderCard = ({ provider, type, onOpenDialog }) => {
    const theme = useTheme();
    const isDoctor = type === 'doctor';

    return (
        <Card
            elevation={1}
            sx={{
                height: '100%',
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                borderRadius: 2,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.1)}`,
                },
                bgcolor: theme.palette.background.paper,
            }}
        >
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box display="flex" alignItems="center" gap={2}>
                        <Avatar
                            sx={{
                                bgcolor: isDoctor ? alpha(theme.palette.primary.main, 0.1) : alpha(theme.palette.success.main, 0.1),
                                color: isDoctor ? theme.palette.primary.main : theme.palette.success.main,
                                width: 48,
                                height: 48,
                            }}
                        >
                            {isDoctor ? <MedicalServicesIcon fontSize="small" /> : <PharmacyIcon fontSize="small" />}
                        </Avatar>
                        <Box>
                            <Typography variant="h6" fontWeight="bold" color="text.primary">
                                {provider.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {isDoctor ? provider.specialty : provider.role}
                            </Typography>
                        </Box>
                    </Box>
                    <Box display="flex" alignItems="center" gap={0.5}>
                        <Rating value={provider.rating} readOnly size="small" />
                        <Typography variant="body2" color="text.secondary">
                            ({provider.rating})
                        </Typography>
                    </Box>
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
                            <Box display="flex" alignItems="center" gap={1}>
                                <LocationIcon color="action" fontSize="small" />
                                <Typography variant="body2" color="text.primary">
                                    {isDoctor ? provider.hospital : provider.pharmacy}
                                </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                                <WorkIcon color="action" fontSize="small" />
                                <Typography variant="body2" color="text.primary">
                                    {provider.experience} years experience
                                </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                                <SchoolIcon color="action" fontSize="small" />
                                <Typography variant="body2" color="text.primary">
                                    {provider.education && provider.education.length > 0 ?
                                        `${provider.education[provider.education.length - 1].degree} from ${provider.education[provider.education.length - 1].institution} (${provider.education[provider.education.length - 1].year})`
                                        : 'Education: N/A'}
                                </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                                <LanguageIcon color="action" fontSize="small" />
                                <Typography variant="body2" color="text.primary">
                                    {provider.languages.join(', ')}
                                </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                                <AccessTimeIcon color="action" fontSize="small" />
                                <Typography variant="body2" color="text.primary">
                                    {isDoctor ? 'Available for consultations' : `Working hours: ${provider.workingHours}`}
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>

                    {!isDoctor && provider.services && (
                        <Box>
                            <Typography variant="subtitle2" gutterBottom color="text.primary">
                                Services:
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                {provider.services.map((service, index) => (
                                    <Chip
                                        key={index}
                                        label={service}
                                        size="small"
                                        sx={{ m: 0.5 }}
                                    />
                                ))}
                            </Stack>
                        </Box>
                    )}
                </Stack>

                <Box display="flex" gap={1} mt={2}>
                    {isDoctor ? (
                        <>
                            <Button
                                size="small"
                                variant="contained"
                                startIcon={<VideoCallIcon />}
                                sx={{ flex: 1 }}
                                onClick={() => onOpenDialog(provider, 'appointment')}
                            >
                                Book Appointment
                            </Button>
                            <Button
                                size="small"
                                variant="outlined"
                                startIcon={<ChatIcon />}
                                sx={{ flex: 1 }}
                                onClick={() => onOpenDialog(provider, 'message')}
                            >
                                Message
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                size="small"
                                variant="contained"
                                startIcon={<PharmacyIcon />}
                                sx={{ flex: 1 }}
                                onClick={() => onOpenDialog(provider, 'medicine')}
                            >
                                Check Medicine
                            </Button>
                            <Button
                                size="small"
                                variant="outlined"
                                startIcon={<ChatIcon />}
                                sx={{ flex: 1 }}
                                onClick={() => onOpenDialog(provider, 'message')}
                            >
                                Message
                            </Button>
                        </>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

export default function ProvidersPage() {
    const [activeTab, setActiveTab] = useState(0);
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [sortAnchorEl, setSortAnchorEl] = useState(null);
    const [filterAnchorEl, setFilterAnchorEl] = useState(null);
    const [sortBy, setSortBy] = useState('rating');
    const [filterBy, setFilterBy] = useState('all');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const theme = useTheme();

    // Simulate loading state
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const handleTabChange = (_, newValue) => {
        setActiveTab(newValue);
        setSearchQuery('');
        setSortBy('rating');
        setFilterBy('all');
    };

    const handleOpenDialog = (provider, type) => {
        setSelectedProvider(provider);
        setDialogType(type);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedProvider(null);
        setDialogType('');
        setMessage('');
    };

    const handleSendMessage = () => {
        if (message.trim()) {
            setSnackbar({
                open: true,
                message: 'Message sent successfully!',
                severity: 'success'
            });
            setMessage('');
            handleCloseDialog();
        }
    };

    const handleSortClick = (event) => {
        setSortAnchorEl(event.currentTarget);
    };

    const handleFilterClick = (event) => {
        setFilterAnchorEl(event.currentTarget);
    };

    const handleSortClose = () => {
        setSortAnchorEl(null);
    };

    const handleFilterClose = () => {
        setFilterAnchorEl(null);
    };

    const handleSortSelect = (value) => {
        setSortBy(value);
        handleSortClose();
    };

    const handleFilterSelect = (value) => {
        setFilterBy(value);
        handleFilterClose();
    };

    const sortProviders = (providers) => {
        return [...providers].sort((a, b) => {
            switch (sortBy) {
                case 'rating':
                    return b.rating - a.rating;
                case 'experience':
                    return b.experience - a.experience;
                case 'name':
                    return a.name.localeCompare(b.name);
                default:
                    return 0;
            }
        });
    };

    const filterProviders = (providers) => {
        if (filterBy === 'all') return providers;
        return providers.filter(provider => {
            switch (filterBy) {
                case 'available':
                    return provider.available;
                case 'online':
                    return provider.online;
                default:
                    return true;
            }
        });
    };

    const filteredDoctors = filterProviders(
        sortProviders(
            mockPatientData.doctors.filter(doctor =>
                doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
                doctor.hospital.toLowerCase().includes(searchQuery.toLowerCase())
            )
        )
    );

    const filteredPharmacists = filterProviders(
        sortProviders(
            mockPatientData.pharmacists.filter(pharmacist =>
                pharmacist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (pharmacist.specialties && pharmacist.specialties.some(specialty => 
                    specialty.toLowerCase().includes(searchQuery.toLowerCase())
                )) ||
                pharmacist.pharmacy.toLowerCase().includes(searchQuery.toLowerCase())
            )
        )
    );

    const renderEmptyState = () => (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 8,
                px: 2,
                textAlign: 'center',
            }}
        >
            <Avatar
                sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    width: 64,
                    height: 64,
                    mb: 2,
                }}
            >
                {activeTab === 0 ? <MedicalServicesIcon /> : <PharmacyIcon />}
            </Avatar>
            <Typography variant="h6" color="text.primary" gutterBottom>
                No {activeTab === 0 ? 'Doctors' : 'Pharmacists'} Found
            </Typography>
            <Typography variant="body2" color="text.secondary">
                Try adjusting your search or filters to find what you're looking for.
            </Typography>
        </Box>
    );

    return (
        <Box sx={{ p: 3 }}>
            <PageHeader
                title="Healthcare Providers"
                subtitle="Find and connect with doctors and pharmacists"
                breadcrumbs={[
                    { label: 'Providers', href: '/patient/providers' },
                    { label: 'doctors', href: '/patient/dashboard' },
                ]}
            />

            <Box sx={{ mb: 3 }}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    sx={{
                        borderBottom: 1,
                        borderColor: 'divider',
                        mb: 3,
                    }}
                >
                    <Tab
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <MedicalServicesIcon fontSize="small" />
                                <Typography>Doctors</Typography>
                            </Box>
                        }
                    />
                    <Tab
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PharmacyIcon fontSize="small" />
                                <Typography>Pharmacists</Typography>
                            </Box>
                        }
                    />
                </Tabs>

                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <TextField
                        fullWidth
                        placeholder={`Search ${activeTab === 0 ? 'doctors' : 'pharmacists'}...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                            },
                        }}
                    />
                    <Tooltip title="Sort">
                        <IconButton
                            onClick={handleSortClick}
                            sx={{
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                '&:hover': {
                                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                                },
                            }}
                        >
                            <SortIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Filter">
                        <IconButton
                            onClick={handleFilterClick}
                            sx={{
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                '&:hover': {
                                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                                },
                            }}
                        >
                            <FilterIcon />
                        </IconButton>
                    </Tooltip>
                </Box>

                <Menu
                    anchorEl={sortAnchorEl}
                    open={Boolean(sortAnchorEl)}
                    onClose={handleSortClose}
                >
                    <MenuItem onClick={() => handleSortSelect('rating')}>
                        Sort by Rating
                    </MenuItem>
                    <MenuItem onClick={() => handleSortSelect('experience')}>
                        Sort by Experience
                    </MenuItem>
                    <MenuItem onClick={() => handleSortSelect('name')}>
                        Sort by Name
                    </MenuItem>
                </Menu>

                <Menu
                    anchorEl={filterAnchorEl}
                    open={Boolean(filterAnchorEl)}
                    onClose={handleFilterClose}
                >
                    <MenuItem onClick={() => handleFilterSelect('all')}>
                        All Providers
                    </MenuItem>
                    <MenuItem onClick={() => handleFilterSelect('available')}>
                        Available Now
                    </MenuItem>
                    <MenuItem onClick={() => handleFilterSelect('online')}>
                        Online
                    </MenuItem>
                </Menu>

                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {activeTab === 0 ? (
                            filteredDoctors.length > 0 ? (
                                filteredDoctors.map((doctor) => (
                                    <Grid item xs={12} sm={6} md={4} key={doctor.id}>
                                        <ProviderCard
                                            provider={doctor}
                                            type="doctor"
                                            onOpenDialog={handleOpenDialog}
                                        />
                                    </Grid>
                                ))
                            ) : (
                                <Grid item xs={12}>
                                    {renderEmptyState()}
                                </Grid>
                            )
                        ) : (
                            filteredPharmacists.length > 0 ? (
                                filteredPharmacists.map((pharmacist) => (
                                    <Grid item xs={12} sm={6} md={4} key={pharmacist.id}>
                                        <ProviderCard
                                            provider={pharmacist}
                                            type="pharmacist"
                                            onOpenDialog={handleOpenDialog}
                                        />
                                    </Grid>
                                ))
                            ) : (
                                <Grid item xs={12}>
                                    {renderEmptyState()}
                                </Grid>
                            )
                        )}
                    </Grid>
                )}
            </Box>

            <Dialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                    },
                }}
            >
                <DialogTitle>
                    <Box display="flex" alignItems="center" gap={1}>
                        {dialogType === 'appointment' && <CalendarIcon color="primary" />}
                        {dialogType === 'message' && <ChatIcon color="primary" />}
                        {dialogType === 'medicine' && <PharmacyIcon color="primary" />}
                        <Typography variant="h6">
                            {dialogType === 'appointment' && 'Book Appointment'}
                            {dialogType === 'message' && 'Send Message'}
                            {dialogType === 'medicine' && 'Check Medicine'}
                        </Typography>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {selectedProvider && (
                        <Box sx={{ py: 2 }}>
                            <Box display="flex" alignItems="center" gap={2} mb={3}>
                                <Avatar
                                    sx={{
                                        bgcolor: activeTab === 0
                                            ? alpha(theme.palette.primary.main, 0.1)
                                            : alpha(theme.palette.success.main, 0.1),
                                        color: activeTab === 0
                                            ? theme.palette.primary.main
                                            : theme.palette.success.main,
                                        width: 48,
                                        height: 48,
                                    }}
                                >
                                    {activeTab === 0 ? <MedicalServicesIcon /> : <PharmacyIcon />}
                                </Avatar>
                                <Box>
                                    <Typography variant="h6">{selectedProvider.name}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {activeTab === 0 ? selectedProvider.specialty : selectedProvider.role}
                                    </Typography>
                                </Box>
                            </Box>

                            {dialogType === 'message' && (
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    placeholder="Type your message..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    sx={{ mb: 2 }}
                                />
                            )}

                            {dialogType === 'appointment' && (
                                <Stack spacing={2}>
                                    <TextField
                                        fullWidth
                                        type="date"
                                        label="Preferred Date"
                                        InputLabelProps={{ shrink: true }}
                                    />
                                    <TextField
                                        fullWidth
                                        type="time"
                                        label="Preferred Time"
                                        InputLabelProps={{ shrink: true }}
                                    />
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        label="Reason for Visit"
                                        placeholder="Please describe your symptoms or reason for visit..."
                                    />
                                </Stack>
                            )}

                            {dialogType === 'medicine' && (
                                <Stack spacing={2}>
                                    <TextField
                                        fullWidth
                                        label="Medicine Name"
                                        placeholder="Enter the name of the medicine..."
                                    />
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        label="Additional Information"
                                        placeholder="Any specific concerns or questions about the medicine..."
                                    />
                                </Stack>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button
                        onClick={handleCloseDialog}
                        variant="outlined"
                        startIcon={<XIcon />}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={dialogType === 'message' ? handleSendMessage : handleCloseDialog}
                        variant="contained"
                        startIcon={dialogType === 'message' ? <SendIcon /> : <CheckIcon />}
                    >
                        {dialogType === 'message' ? 'Send' : 'Confirm'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
} 
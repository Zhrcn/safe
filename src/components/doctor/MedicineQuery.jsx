'use client';

import { useState } from 'react';
import { 
    Box, 
    Typography, 
    Paper, 
    TextField, 
    Button, 
    Grid, 
    Chip, 
    Alert, 
    CircularProgress,
    Autocomplete,
    Card,
    CardContent,
    Divider
} from '@mui/material';
import { Search, Check, X, AlertCircle } from 'lucide-react';
import { queryMedicineAvailability } from '@/services/doctorService';

const commonMedications = [
    'Lisinopril',
    'Metformin',
    'Atorvastatin',
    'Levothyroxine',
    'Amlodipine',
    'Omeprazole',
    'Simvastatin',
    'Metoprolol',
    'Albuterol',
    'Fluticasone',
    'Sertraline',
    'Gabapentin',
    'Hydrochlorothiazide',
    'Losartan',
    'Furosemide',
    'Escitalopram',
    'Pantoprazole',
    'Montelukast',
    'Prednisone',
    'Tramadol'
];

export default function MedicineQuery() {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState(null);
    const [searchHistory, setSearchHistory] = useState([]);

    const handleSearch = async () => {
        if (!query.trim()) {
            setError('Please enter a medicine name');
            return;
        }

        try {
            setIsLoading(true);
            setError('');
            setResult(null);
            
            const response = await queryMedicineAvailability(query);
            
            setResult(response);
            
            if (!searchHistory.some(item => item.medicine === response.medicine)) {
                setSearchHistory(prev => [response, ...prev].slice(0, 5)); 
            }
        } catch (err) {
            setError('Failed to query medicine availability');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleHistoryItemClick = (medicine) => {
        setQuery(medicine);
    };

    return (
        <Paper className="p-6 bg-card border border-border rounded-lg">
            <Typography variant="h5" component="h1" className="font-bold text-foreground mb-6">
                Medicine Availability Query
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Box className="flex gap-2">
                        <Autocomplete
                            freeSolo
                            options={commonMedications}
                            value={query}
                            onChange={(_, value) => setQuery(value || '')}
                            onInputChange={(_, value) => setQuery(value || '')}
                            renderInput={(params) => (
                                <TextField 
                                    {...params}
                                    label="Medicine Name"
                                    variant="outlined"
                                    fullWidth
                                    error={!!error}
                                    helperText={error}
                                    onKeyPress={handleKeyPress}
                                    className="bg-background"
                                    InputProps={{
                                        ...params.InputProps,
                                        className: "text-foreground"
                                    }}
                                    InputLabelProps={{
                                        className: "text-muted-foreground"
                                    }}
                                />
                            )}
                            className="flex-grow"
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSearch}
                            disabled={isLoading || !query.trim()}
                            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <Search />}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground whitespace-nowrap"
                        >
                            {isLoading ? 'Checking...' : 'Check Availability'}
                        </Button>
                    </Box>
                </Grid>

                {result && (
                    <Grid item xs={12}>
                        <Card 
                            className={`border ${
                                result.availability 
                                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                                    : 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                            }`}
                        >
                            <CardContent>
                                <Box className="flex items-center mb-3">
                                    {result.availability ? (
                                        <Check size={24} className="mr-2 text-green-500" />
                                    ) : (
                                        <AlertCircle size={24} className="mr-2 text-amber-500" />
                                    )}
                                    <Typography variant="h6" className="font-semibold">
                                        {result.medicine}
                                    </Typography>
                                    <Chip 
                                        label={result.availability ? 'Available' : 'Not Available'} 
                                        color={result.availability ? 'success' : 'warning'}
                                        size="small"
                                        className="ml-auto"
                                    />
                                </Box>
                                
                                <Typography variant="body1" className="mb-3">
                                    {result.message}
                                </Typography>
                                
                                {!result.availability && result.alternatives?.length > 0 && (
                                    <Box>
                                        <Typography variant="subtitle2" className="font-medium mb-2">
                                            Available Alternatives:
                                        </Typography>
                                        <Box className="flex flex-wrap gap-2">
                                            {result.alternatives.map((alt, index) => (
                                                <Chip 
                                                    key={index} 
                                                    label={alt} 
                                                    color="primary" 
                                                    variant="outlined"
                                                    onClick={() => setQuery(alt)}
                                                    clickable
                                                    className="cursor-pointer"
                                                />
                                            ))}
                                        </Box>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                )}

                {searchHistory.length > 0 && (
                    <Grid item xs={12}>
                        <Box className="mt-4">
                            <Typography variant="subtitle1" className="font-medium mb-2 text-foreground">
                                Recent Searches
                            </Typography>
                            <Divider className="mb-3" />
                            <Box className="flex flex-wrap gap-2">
                                {searchHistory.map((item, index) => (
                                    <Chip 
                                        key={index} 
                                        label={item.medicine} 
                                        onClick={() => handleHistoryItemClick(item.medicine)}
                                        icon={item.availability ? <Check size={16} /> : <X size={16} />}
                                        color={item.availability ? 'success' : 'default'}
                                        variant="outlined"
                                        className="cursor-pointer"
                                    />
                                ))}
                            </Box>
                        </Box>
                    </Grid>
                )}

                <Grid item xs={12}>
                    <Alert severity="info" className="mt-4">
                        <Typography variant="body2">
                            This tool allows you to check if specific medications are available at partner pharmacies.
                            For urgent medication needs, please contact the pharmacy directly.
                        </Typography>
                    </Alert>
                </Grid>
            </Grid>
        </Paper>
    );
} 
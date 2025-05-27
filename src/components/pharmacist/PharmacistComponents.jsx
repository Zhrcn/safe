'use client';

import { Typography, Box, Paper, Card, CardContent, TextField, InputAdornment } from '@mui/material';
import { Search } from 'lucide-react';

/**
 * PharmacistPageContainer - Consistent container for pharmacist pages
 */
export function PharmacistPageContainer({ title, description, children }) {
    return (
        <Box>
            <Paper elevation={3} sx={{ p: 3 }} className="bg-card text-card-foreground rounded-lg shadow-md min-h-[80vh]">
                <Typography variant="h4" gutterBottom className="text-foreground font-bold">
                    {title}
                </Typography>
                <Typography paragraph className="text-muted-foreground mb-6">
                    {description}
                </Typography>
                {children}
            </Paper>
        </Box>
    );
}

/**
 * PharmacistCard - Consistent card component for pharmacist pages
 */
export function PharmacistCard({ title, children, actions }) {
    return (
        <Card className="shadow-lg rounded-lg border border-border bg-card">
            <CardContent>
                <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-4 sm:space-y-0">
                    <Typography variant="h5" component="h1" className="font-bold text-foreground">{title}</Typography>
                    {actions && (
                        <Box className="flex items-center space-x-4 w-full sm:w-auto">
                            {actions}
                        </Box>
                    )}
                </Box>
                {children}
            </CardContent>
        </Card>
    );
}

/**
 * SearchField - Consistent search field for pharmacist pages
 */
export function SearchField({ value, onChange, placeholder = "Search..." }) {
    return (
        <TextField
            variant="outlined"
            size="small"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-full sm:w-auto"
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <Search size={20} className="text-muted-foreground" />
                    </InputAdornment>
                ),
                className: 'text-foreground',
            }}
            InputLabelProps={{
                style: { color: 'inherit' },
            }}
            sx={{
                '& .MuiOutlinedInput-root': {
                    fieldset: { borderColor: 'var(--border)' },
                    '&:hover fieldset': { borderColor: 'var(--border)' },
                    '&.Mui-focused fieldset': { borderColor: 'var(--primary)' },
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'var(--border)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'var(--border)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'var(--primary)',
                    },
                },
                '& .MuiInputBase-input::placeholder': {
                    color: 'var(--muted-foreground)',
                    opacity: 1,
                },
                '& .MuiInputLabel-outlined': {
                    color: 'var(--muted-foreground)',
                },
            }}
        />
    );
}

/**
 * DashboardCard - Card component for dashboard sections
 */
export function DashboardCard({ title, icon: IconComponent, children, actionButton }) {
    return (
        <Card className="h-full shadow-lg rounded-lg border border-border bg-card text-card-foreground transition-colors duration-200 hover:shadow-xl">
            <CardContent>
                <Box className="flex justify-between items-center mb-4">
                    <Box className="flex items-center">
                        <Box className="p-3 rounded-full bg-green-100 dark:bg-green-700 mr-4">
                            <IconComponent size={28} className="text-green-600 dark:text-green-200" />
                        </Box>
                        <Typography variant="h6" component="div" className="font-semibold text-foreground">
                            {title}
                        </Typography>
                    </Box>
                    {actionButton}
                </Box>
                <Box className="text-muted-foreground">
                    {children}
                </Box>
            </CardContent>
        </Card>
    );
} 
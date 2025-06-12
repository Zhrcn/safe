'use client';

import { Box, Card, Typography } from '@mui/material';
import { Calendar, Pill, Stethoscope } from 'lucide-react';

const iconMap = {
    calendar: Calendar,
    medication: Pill,
    stethoscope: Stethoscope,
};

export default function EnhancedStatCard({ title, value, icon, color }) {
    const Icon = iconMap[icon] || Calendar;

    return (
        <Card
            variant="outlined"
            sx={{
                p: 3,
                height: '100%',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3,
                },
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                    sx={{
                        backgroundColor: `${color}.light`,
                        color: `${color}.main`,
                        p: 2,
                        borderRadius: 2,
                        mr: 2,
                    }}
                >
                    <Icon size={24} />
                </Box>
                <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
                        {title}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5 }}>
                        {value}
                    </Typography>
                </Box>
            </Box>
        </Card>
    );
} 
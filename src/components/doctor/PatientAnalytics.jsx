'use client';

import { useState, useEffect } from 'react';
import { 
    Box, 
    Typography, 
    Paper, 
    Grid, 
    Card, 
    CardContent, 
    FormControl, 
    InputLabel, 
    Select, 
    MenuItem, 
    CircularProgress,
    Alert,
    Tabs,
    Tab
} from '@mui/material';
import { 
    BarChart, 
    Bar, 
    LineChart, 
    Line, 
    PieChart, 
    Pie, 
    Cell, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    Legend, 
    ResponsiveContainer 
} from 'recharts';
import { getAnalyticsData, getPatientStatistics } from '@/services/doctorService';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#ef4444', '#f59e0b', '#6366f1'];

export default function PatientAnalytics() {
    const [activeTab, setActiveTab] = useState('appointments');
    const [analyticsData, setAnalyticsData] = useState(null);
    const [patientStats, setPatientStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [timeRange, setTimeRange] = useState('year');

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError('');
                
                const [analytics, stats] = await Promise.all([
                    getAnalyticsData(),
                    getPatientStatistics()
                ]);
                
                setAnalyticsData(analytics);
                setPatientStats(stats);
            } catch (err) {
                setError('Failed to load analytics data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        
        loadData();
    }, []);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleTimeRangeChange = (event) => {
        setTimeRange(event.target.value);
    };

    const getAppointmentData = () => {
        if (!analyticsData) return [];
        
        if (timeRange === 'year') {
            return analyticsData.appointmentsByMonth;
        } else if (timeRange === 'quarter') {
            return analyticsData.appointmentsByMonth.slice(-3);
        } else {
            return analyticsData.appointmentsByMonth.slice(-6);
        }
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <Paper className="p-3 bg-background border border-border shadow-md">
                    <Typography variant="subtitle2" className="font-medium text-foreground">
                        {label}
                    </Typography>
                    {payload.map((entry, index) => (
                        <Typography 
                            key={`item-${index}`} 
                            variant="body2" 
                            className="text-foreground"
                            style={{ color: entry.color }}
                        >
                            {`${entry.name}: ${entry.value}`}
                        </Typography>
                    ))}
                </Paper>
            );
        }
        return null;
    };

    return (
        <Box>
            <Paper className="p-6 bg-card border border-border rounded-lg">
                <Box className="flex justify-between items-center mb-6">
                    <Typography variant="h5" component="h1" className="font-bold text-foreground">
                        Patient Analytics
                    </Typography>
                    <FormControl 
                        variant="outlined" 
                        size="small"
                        className="min-w-[150px]"
                    >
                        <InputLabel className="text-muted-foreground">Time Range</InputLabel>
                        <Select
                            value={timeRange}
                            onChange={handleTimeRangeChange}
                            label="Time Range"
                            className="text-foreground bg-background"
                        >
                            <MenuItem value="quarter">Last 3 Months</MenuItem>
                            <MenuItem value="half">Last 6 Months</MenuItem>
                            <MenuItem value="year">Last Year</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                {error && (
                    <Alert severity="error" className="mb-4">
                        {error}
                    </Alert>
                )}

                {loading ? (
                    <Box className="flex justify-center items-center py-12">
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {/* Patient Statistics Summary */}
                        {patientStats && (
                            <Grid container spacing={3} className="mb-6">
                                <Grid item xs={12} sm={6} md={3}>
                                    <Card className="border border-border shadow-sm">
                                        <CardContent>
                                            <Typography variant="subtitle2" className="text-muted-foreground">
                                                Total Patients
                                            </Typography>
                                            <Typography variant="h4" className="font-bold text-foreground mt-1">
                                                {patientStats.totalPatients}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Card className="border border-border shadow-sm">
                                        <CardContent>
                                            <Typography variant="subtitle2" className="text-muted-foreground">
                                                Active Patients
                                            </Typography>
                                            <Typography variant="h4" className="font-bold text-green-600 mt-1">
                                                {patientStats.activePatients}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Card className="border border-border shadow-sm">
                                        <CardContent>
                                            <Typography variant="subtitle2" className="text-muted-foreground">
                                                Urgent Cases
                                            </Typography>
                                            <Typography variant="h4" className="font-bold text-red-600 mt-1">
                                                {patientStats.urgentCases}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Card className="border border-border shadow-sm">
                                        <CardContent>
                                            <Typography variant="subtitle2" className="text-muted-foreground">
                                                Avg. Appointments/Patient
                                            </Typography>
                                            <Typography variant="h4" className="font-bold text-blue-600 mt-1">
                                                {(analyticsData?.appointmentsByMonth.reduce((sum, month) => sum + month.count, 0) / patientStats.totalPatients).toFixed(1)}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        )}

                        {/* Chart Tabs */}
                        <Box>
                            <Tabs
                                value={activeTab}
                                onChange={handleTabChange}
                                className="mb-6"
                                TabIndicatorProps={{ style: { backgroundColor: 'var(--primary)' } }}
                            >
                                <Tab 
                                    label="Appointments" 
                                    value="appointments" 
                                    className={activeTab === 'appointments' ? 'text-primary' : 'text-muted-foreground'}
                                />
                                <Tab 
                                    label="Prescriptions" 
                                    value="prescriptions" 
                                    className={activeTab === 'prescriptions' ? 'text-primary' : 'text-muted-foreground'}
                                />
                                <Tab 
                                    label="Demographics" 
                                    value="demographics" 
                                    className={activeTab === 'demographics' ? 'text-primary' : 'text-muted-foreground'}
                                />
                                <Tab 
                                    label="Conditions" 
                                    value="conditions" 
                                    className={activeTab === 'conditions' ? 'text-primary' : 'text-muted-foreground'}
                                />
                            </Tabs>

                            {/* Appointments Tab */}
                            {activeTab === 'appointments' && analyticsData && (
                                <Grid container spacing={4}>
                                    <Grid item xs={12} lg={8}>
                                        <Card className="border border-border shadow-sm p-4">
                                            <Typography variant="h6" className="font-medium text-foreground mb-4">
                                                Appointments Over Time
                                            </Typography>
                                            <Box className="h-80">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <LineChart
                                                        data={getAppointmentData()}
                                                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                                    >
                                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                                        <XAxis 
                                                            dataKey="month" 
                                                            stroke="var(--muted-foreground)"
                                                        />
                                                        <YAxis 
                                                            stroke="var(--muted-foreground)"
                                                        />
                                                        <Tooltip content={<CustomTooltip />} />
                                                        <Legend />
                                                        <Line 
                                                            type="monotone" 
                                                            dataKey="count" 
                                                            name="Appointments" 
                                                            stroke="#3b82f6" 
                                                            activeDot={{ r: 8 }} 
                                                        />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </Box>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} lg={4}>
                                        <Card className="border border-border shadow-sm p-4 h-full">
                                            <Typography variant="h6" className="font-medium text-foreground mb-4">
                                                Appointments by Patient
                                            </Typography>
                                            <Box className="h-80">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart
                                                        data={analyticsData.appointmentsByPatient}
                                                        layout="vertical"
                                                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                                    >
                                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                                        <XAxis 
                                                            type="number"
                                                            stroke="var(--muted-foreground)"
                                                        />
                                                        <YAxis 
                                                            dataKey="patient" 
                                                            type="category" 
                                                            width={100}
                                                            stroke="var(--muted-foreground)"
                                                            tick={{ fontSize: 12 }}
                                                        />
                                                        <Tooltip content={<CustomTooltip />} />
                                                        <Legend />
                                                        <Bar 
                                                            dataKey="count" 
                                                            name="Appointments" 
                                                            fill="#3b82f6" 
                                                        />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </Box>
                                        </Card>
                                    </Grid>
                                </Grid>
                            )}

                            {/* Prescriptions Tab */}
                            {activeTab === 'prescriptions' && analyticsData && (
                                <Grid container spacing={4}>
                                    <Grid item xs={12} md={6}>
                                        <Card className="border border-border shadow-sm p-4">
                                            <Typography variant="h6" className="font-medium text-foreground mb-4">
                                                Prescriptions by Patient
                                            </Typography>
                                            <Box className="h-80">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart
                                                        data={analyticsData.prescriptionsByPatient}
                                                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                                    >
                                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                                        <XAxis 
                                                            dataKey="patient" 
                                                            stroke="var(--muted-foreground)"
                                                            tick={{ fontSize: 12 }}
                                                            angle={-45}
                                                            textAnchor="end"
                                                            height={70}
                                                        />
                                                        <YAxis stroke="var(--muted-foreground)" />
                                                        <Tooltip content={<CustomTooltip />} />
                                                        <Legend />
                                                        <Bar 
                                                            dataKey="count" 
                                                            name="Prescriptions" 
                                                            fill="#8b5cf6" 
                                                        />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </Box>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Card className="border border-border shadow-sm p-4">
                                            <Typography variant="h6" className="font-medium text-foreground mb-4">
                                                Treatment Outcomes
                                            </Typography>
                                            <Box className="h-80">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart
                                                        data={analyticsData.treatmentOutcomes}
                                                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                                    >
                                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                                        <XAxis 
                                                            dataKey="condition" 
                                                            stroke="var(--muted-foreground)"
                                                        />
                                                        <YAxis stroke="var(--muted-foreground)" />
                                                        <Tooltip content={<CustomTooltip />} />
                                                        <Legend />
                                                        <Bar dataKey="improved" name="Improved" stackId="a" fill="#10b981" />
                                                        <Bar dataKey="unchanged" name="Unchanged" stackId="a" fill="#f59e0b" />
                                                        <Bar dataKey="worsened" name="Worsened" stackId="a" fill="#ef4444" />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </Box>
                                        </Card>
                                    </Grid>
                                </Grid>
                            )}

                            {/* Demographics Tab */}
                            {activeTab === 'demographics' && analyticsData && (
                                <Grid container spacing={4}>
                                    <Grid item xs={12} md={6}>
                                        <Card className="border border-border shadow-sm p-4">
                                            <Typography variant="h6" className="font-medium text-foreground mb-4">
                                                Patient Age Distribution
                                            </Typography>
                                            <Box className="h-80">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart
                                                        data={analyticsData.patientDemographics.ageGroups}
                                                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                                    >
                                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                                        <XAxis 
                                                            dataKey="group" 
                                                            stroke="var(--muted-foreground)"
                                                        />
                                                        <YAxis stroke="var(--muted-foreground)" />
                                                        <Tooltip content={<CustomTooltip />} />
                                                        <Legend />
                                                        <Bar 
                                                            dataKey="count" 
                                                            name="Patients" 
                                                            fill="#6366f1" 
                                                        />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </Box>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Card className="border border-border shadow-sm p-4">
                                            <Typography variant="h6" className="font-medium text-foreground mb-4">
                                                Gender Distribution
                                            </Typography>
                                            <Box className="h-80">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart>
                                                        <Pie
                                                            data={analyticsData.patientDemographics.gender}
                                                            cx="50%"
                                                            cy="50%"
                                                            labelLine={false}
                                                            outerRadius={80}
                                                            fill="#8884d8"
                                                            dataKey="value"
                                                            nameKey="name"
                                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                        >
                                                            {analyticsData.patientDemographics.gender.map((entry, index) => (
                                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip content={<CustomTooltip />} />
                                                        <Legend />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </Box>
                                        </Card>
                                    </Grid>
                                </Grid>
                            )}

                            {/* Conditions Tab */}
                            {activeTab === 'conditions' && patientStats && (
                                <Grid container spacing={4}>
                                    <Grid item xs={12}>
                                        <Card className="border border-border shadow-sm p-4">
                                            <Typography variant="h6" className="font-medium text-foreground mb-4">
                                                Patient Conditions
                                            </Typography>
                                            <Box className="h-80">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart>
                                                        <Pie
                                                            data={patientStats.byCondition}
                                                            cx="50%"
                                                            cy="50%"
                                                            labelLine={false}
                                                            outerRadius={100}
                                                            fill="#8884d8"
                                                            dataKey="count"
                                                            nameKey="condition"
                                                            label={({ condition, percent }) => `${condition}: ${(percent * 100).toFixed(0)}%`}
                                                        >
                                                            {patientStats.byCondition.map((entry, index) => (
                                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip content={<CustomTooltip />} />
                                                        <Legend />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </Box>
                                        </Card>
                                    </Grid>
                                </Grid>
                            )}
                        </Box>
                    </>
                )}
            </Paper>
        </Box>
    );
} 
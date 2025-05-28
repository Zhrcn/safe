'use client';

import { useState, useEffect } from 'react';
import { Typography, Grid, Box } from '@mui/material';
import { Activity, CalendarDays, Users, Pill, TrendingUp } from 'lucide-react';
import { DoctorPageContainer, DoctorCard, StatCard, ChartContainer } from '@/components/doctor/DoctorComponents';
import { getAnalyticsData } from '@/services/doctorService';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
const TREATMENT_COLORS = {
  improved: '#4CAF50',
  unchanged: '#FFC107',
  worsened: '#F44336'
};

export default function DoctorAnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        const data = await getAnalyticsData();
        setAnalytics(data);
      } catch (error) {
        console.error('Error loading analytics data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <DoctorPageContainer
        title="Analytics Dashboard"
        description="Loading analytics data..."
      >
        <Box className="flex justify-center items-center h-64">
          <Typography>Loading analytics data...</Typography>
        </Box>
      </DoctorPageContainer>
    );
  }

  // Calculate total appointments
  const totalAppointments = analytics.appointmentsByMonth.reduce((sum, item) => sum + item.count, 0);

  // Calculate total patients
  const totalPatients = analytics.patientDemographics.ageGroups.reduce((sum, item) => sum + item.count, 0);

  // Calculate most prescribed medication
  const mostPrescribed = analytics.prescriptionData.reduce((prev, current) =>
    (prev.count > current.count) ? prev : current
  );

  return (
    <DoctorPageContainer
      title="Analytics Dashboard"
      description="Visualize key metrics and trends to improve patient care."
    >
      {/* Key Metrics */}
      <Grid container spacing={3} className="mb-6">
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Appointments"
            value={totalAppointments}
            icon={CalendarDays}
            trend="up"
            trendValue="8% from last year"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Patients"
            value={totalPatients}
            icon={Users}
            trend="up"
            trendValue="12% from last year"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Most Prescribed"
            value={mostPrescribed.name}
            icon={Pill}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Avg. Treatment Success"
            value="70%"
            icon={Activity}
            trend="up"
            trendValue="5% improvement"
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <DoctorCard title="Detailed Analytics">
        <Grid container spacing={4}>
          {/* Appointments Chart */}
          <Grid item xs={12} md={6}>
            <ChartContainer title="Appointments by Month">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={analytics.appointmentsByMonth}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#3182CE"
                    fill="#3182CE"
                    fillOpacity={0.2}
                    name="Appointments"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </Grid>

          {/* Patient Demographics */}
          <Grid item xs={12} md={6}>
            <ChartContainer title="Patient Age Distribution">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analytics.patientDemographics.ageGroups}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="group" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)'
                    }}
                  />
                  <Bar dataKey="count" name="Patients" fill="#3182CE" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </Grid>

          {/* Gender Distribution */}
          <Grid item xs={12} md={6}>
            <ChartContainer title="Patient Gender Distribution">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.patientDemographics.gender}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {analytics.patientDemographics.gender.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </Grid>

          {/* Treatment Outcomes */}
          <Grid item xs={12} md={6}>
            <ChartContainer title="Treatment Outcomes by Condition">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analytics.treatmentOutcomes}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis type="number" stroke="var(--muted-foreground)" />
                  <YAxis dataKey="condition" type="category" stroke="var(--muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="improved" name="Improved" stackId="a" fill={TREATMENT_COLORS.improved} />
                  <Bar dataKey="unchanged" name="Unchanged" stackId="a" fill={TREATMENT_COLORS.unchanged} />
                  <Bar dataKey="worsened" name="Worsened" stackId="a" fill={TREATMENT_COLORS.worsened} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </Grid>

          {/* Prescription Data */}
          <Grid item xs={12}>
            <ChartContainer title="Top Prescriptions">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analytics.prescriptionData}
                  margin={{ top: 10, right: 30, left: 20, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="name"
                    stroke="var(--muted-foreground)"
                    angle={-45}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)'
                    }}
                  />
                  <Bar dataKey="count" name="Prescriptions" fill="#3182CE">
                    {analytics.prescriptionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </Grid>
        </Grid>
      </DoctorCard>
    </DoctorPageContainer>
  );
} 
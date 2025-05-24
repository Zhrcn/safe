'use client';

import { Typography, Card, CardContent, Box, Grid, Paper } from '@mui/material';
import { BarChart, PieChart, LineChart, Activity } from 'lucide-react';

// Placeholder for Analytics sections
function AnalyticsCard({
  title,
  icon: IconComponent,
  children
}) {
  return (
    <Card className="h-full shadow-lg rounded-lg border bg-card border-border transition-colors duration-200 hover:shadow-xl">
      <CardContent className="text-card-foreground">
        <Box className="flex items-center mb-4">
          <IconComponent size={24} className="mr-3 text-primary" />
          <Typography variant="h6" component="div" className="font-semibold text-foreground">
            {title}
          </Typography>
        </Box>
        {children}
      </CardContent>
    </Card>
  );
}

export default function DoctorAnalyticsPage() {
  return (
    <Box className="text-foreground bg-background">
      <Paper elevation={3} sx={{ p: 3 }} className="bg-card text-card-foreground rounded-lg shadow-md min-h-[80vh]">
        <Typography variant="h4" gutterBottom className="text-foreground font-bold">
          Doctor Analytics
        </Typography>
        <Typography paragraph className="text-muted-foreground mb-6">
          This page will display analytics and insights for the doctor.
        </Typography>
        <Card className="mb-6 shadow-lg bg-card">
          <CardContent>
            <Typography variant="h5" component="h1" className="font-bold mb-4 text-foreground">Doctor Analytics</Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <AnalyticsCard title="Appointments Overview" icon={CalendarDays}>
                  <Typography variant="body1">Summary of appointment trends over time.</Typography>
                  {/* Placeholder for a chart or key metrics */}
                  <Box sx={{ mt: 2, height: 150, bgcolor: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="body2" color="text.secondary">[ Appointments Chart Placeholder ]</Typography>
                  </Box>
                </AnalyticsCard>
              </Grid>

              <Grid item xs={12} md={6}>
                <AnalyticsCard title="Patient Demographics" icon={Users}>
                  <Typography variant="body1">Breakdown of patient age, gender, and location.</Typography>
                  {/* Placeholder for a chart or key metrics */}
                  <Box sx={{ mt: 2, height: 150, bgcolor: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="body2" color="text.secondary">[ Patient Demographics Chart Placeholder ]</Typography>
                  </Box>
                </AnalyticsCard>
              </Grid>

              <Grid item xs={12} md={6}>
                <AnalyticsCard title="Treatment Outcomes" icon={Activity}>
                  <Typography variant="body1">Analysis of treatment success rates for various conditions.</Typography>
                  {/* Placeholder for a chart or key metrics */}
                  <Box sx={{ mt: 2, height: 150, bgcolor: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="body2" color="text.secondary">[ Treatment Outcomes Data Placeholder ]</Typography>
                  </Box>
                </AnalyticsCard>
              </Grid>

              <Grid item xs={12} md={6}>
                <AnalyticsCard title="Prescription Patterns" icon={Pill}>
                  <Typography variant="body1">Insights into common prescriptions and medication usage.</Typography>
                  {/* Placeholder for a chart or key metrics */}
                  <Box sx={{ mt: 2, height: 150, bgcolor: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="body2" color="text.secondary">[ Prescription Patterns Data Placeholder ]</Typography>
                  </Box>
                </AnalyticsCard>
              </Grid>
              {/* Add more analytics sections as needed */}

            </Grid>

          </CardContent>
        </Card>
      </Paper>
    </Box>
  );
}

// Import additional Lucid Icons needed
import { CalendarDays, Users, Pill } from 'lucide-react'; 
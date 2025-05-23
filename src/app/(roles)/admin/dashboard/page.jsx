'use client';

import { Typography, Card, CardContent, Box, Grid, Button } from '@mui/material';
import { Users, BarChart, Settings, Hospital } from 'lucide-react';

// Placeholder Card Component for Dashboard sections
function DashboardCard({
  title,
  icon: IconComponent,
  children,
  actionButton
}) {
  return (
    <Card className="h-full shadow-lg">
      <CardContent>
        <Box className="flex justify-between items-center mb-4">
          <Box className="flex items-center">
             <IconComponent size={24} className="mr-3 text-purple-600" />
             <Typography variant="h6" component="div" className="font-semibold">
               {title}
             </Typography>
          </Box>
          {actionButton}
        </Box>
        {children}
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  // Mock Admin Data (replace with actual authenticated admin data fetching)
  const mockAdminData = {
    hospitalName: 'Syrian Central Hospital',
  };

  return (
    <div className="p-6 bg-gray-100 min-h-full">
      <Card className="mb-6 shadow-lg">
        <CardContent>
          <Box className="flex items-center mb-4">
             <Hospital size={40} className="mr-3 text-purple-600" />
             <Typography variant="h5" component="h1" className="font-bold">Admin Dashboard</Typography>
          </Box>
           <Typography variant="body1" color="text.secondary">Welcome, Administrator of {mockAdminData.hospitalName}!</Typography>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <DashboardCard
            title="User Management"
            icon={Users}
            actionButton={(
              <Button variant="outlined" size="small">Manage Users</Button>
            )}
          >
            <Typography variant="body2" color="text.secondary">Overview of registered users (Doctors, Patients, Pharmacists, Admins).</Typography>
             <Box sx={{ mt: 2, height: 100, bgcolor: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="body2" color="text.secondary">[ User Statistics Placeholder ]</Typography>
              </Box>
          </DashboardCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <DashboardCard
            title="System Overview"
            icon={Settings}
            actionButton={(
              <Button variant="outlined" size="small">System Settings</Button>
            )}
          >
            <Typography variant="body2" color="text.secondary">Monitoring system health, performance, and key metrics.</Typography>
             <Box sx={{ mt: 2, height: 100, bgcolor: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="body2" color="text.secondary">[ System Metrics Placeholder ]</Typography>
              </Box>
          </DashboardCard>
        </Grid>

         <Grid item xs={12} md={6}>
          <DashboardCard
            title="Reports and Analytics"
            icon={BarChart}
            actionButton={(
              <Button variant="outlined" size="small">View Reports</Button>
            )}
          >
             <Typography variant="body2" color="text.secondary">Access various reports on appointments, patients, inventory, etc.</Typography>
             <Box sx={{ mt: 2, height: 100, bgcolor: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="body2" color="text.secondary">[ Report Summaries Placeholder ]</Typography>
              </Box>
          </DashboardCard>
        </Grid>

        {/* Add more admin dashboard sections */}

      </Grid>
    </div>
  );
} 
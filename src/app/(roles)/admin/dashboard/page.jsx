'use client';

import { Typography, Card, CardContent, Box, Grid, Paper, Button } from '@mui/material';
import { Users, BarChart, Settings, Hospital, Eye } from 'lucide-react';
// Import motion from framer-motion
import { motion } from 'framer-motion';

// Mock Admin Data (replace with actual authenticated admin data fetching)
const mockAdminData = {
  hospitalName: 'Syrian Central Hospital',
};

// Placeholder Card Component for Dashboard sections
function DashboardCard({
  title,
  icon: IconComponent,
  children,
  actionButton
}) {
  return (
    <Card className="h-full shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"> {/* Added theme-aware borders and background */}
      <CardContent>
        <Box className="flex justify-between items-center mb-4">
          <Box className="flex items-center">
             <Box className="p-3 rounded-full bg-red-100 dark:bg-red-700 mr-4"> {/* Themed icon background with Admin color and spacing */}
                <IconComponent size={28} className="text-red-600 dark:text-red-200" /> {/* Themed icon color and size */}
             </Box>
             <Typography variant="h6" component="div" className="font-semibold">
               {title}
             </Typography>
          </Box>
          {actionButton}
        </Box>
         <Box className="text-gray-700 dark:text-gray-300"> {/* Themed text color for card content */}
             {children}
         </Box>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const admin = mockAdminData; // In a real app, fetch authenticated admin data

   // Define animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6" // Added spacing between sections
    >
      <Paper elevation={3} sx={{ p: 3 }} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-md"> {/* Theme-aware background and shadow */}
        <Typography variant="h4" gutterBottom className="text-gray-900 dark:text-white font-bold"> {/* Theme-aware text color */}
          Admin Dashboard
        </Typography>
         <Typography variant="body1" className="text-gray-700 dark:text-gray-300 mb-6"> {/* Theme-aware text color */}
           Welcome, Administrator of {admin.hospitalName}!
         </Typography>

        <Grid container spacing={3}> {/* Added spacing between grid items */}
          <Grid item xs={12} md={6}> {/* Made cards responsive */}
            <DashboardCard
              title="User Management"
              icon={Users}
              actionButton={(
                <Button variant="outlined" size="small" startIcon={<Eye size={16} />} className="text-red-600 dark:text-red-300 border-red-600 dark:border-red-300 hover:bg-red-50 dark:hover:bg-red-900 transition-colors duration-200">Manage Users</Button>
              )}
            >
              <Typography variant="body2" className="text-gray-700 dark:text-gray-300">Overview of registered users (Doctors, Patients, Pharmacists, Admins).</Typography>
               <Box sx={{ mt: 2, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="bg-gray-200 dark:bg-gray-600 rounded-md"> {/* Themed placeholder box */}
                    <Typography variant="body2" className="text-gray-700 dark:text-gray-300">[ User Statistics Placeholder ]</Typography>
               </Box>
            </DashboardCard>
          </Grid>

          <Grid item xs={12} md={6}> {/* Made cards responsive */}
            <DashboardCard
              title="System Overview"
              icon={Settings}
              actionButton={(
                <Button variant="outlined" size="small" startIcon={<Eye size={16} />} className="text-red-600 dark:text-red-300 border-red-600 dark:border-red-300 hover:bg-red-50 dark:hover:bg-red-900 transition-colors duration-200">System Settings</Button>
              )}
            >
              <Typography variant="body2" className="text-gray-700 dark:text-gray-300">Monitoring system health, performance, and key metrics.</Typography>
               <Box sx={{ mt: 2, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="bg-gray-200 dark:bg-gray-600 rounded-md"> {/* Themed placeholder box */}
                    <Typography variant="body2" className="text-gray-700 dark:text-gray-300">[ System Metrics Placeholder ]</Typography>
               </Box>
            </DashboardCard>
          </Grid>

           <Grid item xs={12} md={6}> {/* Made cards responsive */}
            <DashboardCard
              title="Reports and Analytics"
              icon={BarChart}
              actionButton={(
                <Button variant="outlined" size="small" startIcon={<Eye size={16} />} className="text-red-600 dark:text-red-300 border-red-600 dark:border-red-300 hover:bg-red-50 dark:hover:bg-red-900 transition-colors duration-200">View Reports</Button>
              )}
            >
               <Typography variant="body2" className="text-gray-700 dark:text-gray-300">Access various reports on appointments, patients, inventory, etc.</Typography>
               <Box sx={{ mt: 2, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="bg-gray-200 dark:bg-gray-600 rounded-md"> {/* Themed placeholder box */}
                    <Typography variant="body2" className="text-gray-700 dark:text-gray-300">[ Report Summaries Placeholder ]</Typography>
               </Box>
            </DashboardCard>
          </Grid>

          {/* Add more admin dashboard sections */}

        </Grid>
      </Paper>
    </motion.div>
  );
} 
'use client';

import { Typography, Card, CardContent, Box, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { Package, FileText, ShoppingCart, AlertCircle } from 'lucide-react';

// Mock Pharmacist Data (replace with actual authenticated pharmacist data fetching)
const mockPharmacistData = {
  name: 'Fatima Al-Abbas',
  location: 'Downtown Pharmacy',
};

// Mock Data for Pharmacist Dashboard
const mockInventorySummary = [
  { item: 'Amoxicillin (500mg)', stock: 150, lowStockThreshold: 50 },
  { item: 'Lisinopril (10mg)', stock: 30, lowStockThreshold: 40 }, // Example low stock
  { item: 'Ibuprofen (200mg)', stock: 250, lowStockThreshold: 100 },
];

const mockPrescriptionsToFill = [
  { id: 101, patientName: 'Patient D', medication: 'Antibiotic X', quantity: 1, date: '2024-06-18' },
  { id: 102, patientName: 'Patient E', medication: 'Pain Reliever Y', quantity: 2, date: '2024-06-18' },
];

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
             <IconComponent size={24} className="mr-3 text-green-600" />
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

export default function PharmacistDashboard() {
   const pharmacist = mockPharmacistData; // In a real app, fetch authenticated pharmacist data

  return (
    <div className="p-6 bg-gray-100 min-h-full">
      <Card className="mb-6 shadow-lg">
        <CardContent>
          <Box className="flex items-center mb-4">
             <Package size={40} className="mr-3 text-green-600" />
             <Typography variant="h5" component="h1" className="font-bold">Pharmacist Dashboard</Typography>
          </Box>
           <Typography variant="body1" color="text.secondary">Welcome, {pharmacist.name} ({pharmacist.location})!</Typography>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <DashboardCard
            title="Low Stock Items"
            icon={AlertCircle}
          >
            <TableContainer component={Paper} elevation={1}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell align="right">Stock</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockInventorySummary.filter(item => item.stock <= item.lowStockThreshold).length === 0 ? (
                     <TableRow>
                       <TableCell colSpan={2} align="center">No items currently low in stock.</TableCell>
                     </TableRow>
                  ) : (
                     mockInventorySummary.filter(item => item.stock <= item.lowStockThreshold).map((item, index) => (
                       <TableRow key={index}>
                         <TableCell>{item.item}</TableCell>
                         <TableCell align="right">{item.stock}</TableCell>
                       </TableRow>
                     ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </DashboardCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <DashboardCard
            title="Prescriptions to Fill"
            icon={FileText}
            actionButton={(
              <Button variant="outlined" size="small" startIcon={<Eye size={16} />}>View All</Button>
            )}
          >
             <TableContainer component={Paper} elevation={1}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Patient</TableCell>
                    <TableCell>Medication</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                   {mockPrescriptionsToFill.length === 0 ? (
                     <TableRow>
                       <TableCell colSpan={3} align="center">No prescriptions to fill.</TableCell>
                     </TableRow>
                   ) : (
                      mockPrescriptionsToFill.map((prescription) => (
                       <TableRow key={prescription.id}>
                         <TableCell>{prescription.patientName}</TableCell>
                         <TableCell>{prescription.medication}</TableCell>
                         <TableCell>{prescription.date}</TableCell>
                       </TableRow>
                     ))
                   )}
                </TableBody>
              </Table>
            </TableContainer>
          </DashboardCard>
        </Grid>

         <Grid item xs={12} md={6}>
          <DashboardCard
            title="Recent Orders"
            icon={ShoppingCart}
            actionButton={(
              <Button variant="outlined" size="small" startIcon={<Eye size={16} />}>View All</Button>
            )}
          >
             <Typography variant="body2" color="text.secondary">[ Placeholder for a list of recent medication orders ]</Typography>
             {/* Table or List of recent orders */}
             <Box sx={{ mt: 2, height: 100, bgcolor: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="body2" color="text.secondary">[ Recent Orders List Placeholder ]</Typography>
              </Box>
          </DashboardCard>
        </Grid>

        {/* Add more pharmacist dashboard sections */}

      </Grid>
    </div>
  );
}

import { Eye } from 'lucide-react'; // Ensure Eye icon is imported if used in actionButton 
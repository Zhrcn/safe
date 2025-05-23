'use client';

import { Typography, Card, CardContent, Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import { Package, FileText, ShoppingCart, AlertCircle, Eye } from 'lucide-react';

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
    <Card className="h-full shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200 hover:shadow-xl"> {/* Added theme-aware borders and background */}
      <CardContent>
        <Box className="flex justify-between items-center mb-4">
          <Box className="flex items-center">
             <Box className="p-3 rounded-full bg-green-100 dark:bg-green-700 mr-4"> {/* Themed icon background with Pharmacist color and spacing */}
                <IconComponent size={28} className="text-green-600 dark:text-green-200" /> {/* Themed icon color and size */}
             </Box>
             <Typography variant="h6" component="div" className="font-semibold text-gray-900 dark:text-white"> {/* Ensure Typography text is theme-aware */}
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

export default function PharmacistDashboardPage() {
   const pharmacist = mockPharmacistData; // In a real app, fetch authenticated pharmacist data

  return (
    <Box className="p-6 bg-gray-100 dark:bg-[#0f172a] min-h-screen"> {/* Add theme-aware background and padding to the main container */}
      <Paper elevation={3} sx={{ p: 3 }} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-md"> {/* Theme-aware background and shadow */}
        <Typography variant="h4" gutterBottom className="text-gray-900 dark:text-white font-bold"> {/* Theme-aware text color */}
          Pharmacist Dashboard
        </Typography>
         <Typography variant="body1" className="text-gray-700 dark:text-gray-300 mb-6"> {/* Theme-aware text color */}
           Welcome, {pharmacist.name} ({pharmacist.location})!
         </Typography>

        <Grid container spacing={3}> {/* Added spacing between grid items */}
          <Grid item xs={12} md={6}> {/* Made cards responsive */}
            <DashboardCard
              title="Low Stock Items"
              icon={AlertCircle}
            >
              <TableContainer component={Paper} elevation={1} className="bg-white dark:bg-gray-700 rounded-md"> {/* Themed table container */}
                <Table size="small">
                  <TableHead>
                    <TableRow className="bg-gray-100 dark:bg-gray-600"> {/* Themed table header */}
                      <TableCell className="text-gray-800 dark:text-gray-200 font-semibold">Item</TableCell> {/* Themed text and font weight */}
                      <TableCell align="right" className="text-gray-800 dark:text-gray-200 font-semibold">Stock</TableCell> {/* Themed text and font weight */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockInventorySummary.filter(item => item.stock <= item.lowStockThreshold).length === 0 ? (
                       <TableRow>
                         <TableCell colSpan={2} align="center" className="text-gray-700 dark:text-gray-300"> {/* Themed text */}
                           No items currently low in stock.
                         </TableCell>
                       </TableRow>
                    ) : (
                       mockInventorySummary.map((item, index) => (
                         <TableRow key={index} className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"> {/* Hover effect */}
                           <TableCell className="text-gray-900 dark:text-gray-100">{item.item}</TableCell> {/* Themed text */}
                           <TableCell align="right" className="text-gray-900 dark:text-gray-100">{item.stock}</TableCell> {/* Themed text */}
                         </TableRow>
                       ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </DashboardCard>
          </Grid>

          <Grid item xs={12} md={6}> {/* Made cards responsive */}
            <DashboardCard
              title="Prescriptions to Fill"
              icon={FileText}
              actionButton={(
                <Button variant="outlined" size="small" startIcon={<Eye size={16} />} className="text-green-600 dark:text-green-300 border-green-600 dark:border-green-300 hover:bg-green-50 dark:hover:bg-green-900 transition-colors duration-200">View All</Button>
              )}
            >
               <TableContainer component={Paper} elevation={1} className="bg-white dark:bg-gray-700 rounded-md"> {/* Themed table container */}
                <Table size="small">
                  <TableHead>
                    <TableRow className="bg-gray-100 dark:bg-gray-600"> {/* Themed table header */}
                      <TableCell className="text-gray-800 dark:text-gray-200 font-semibold">Patient</TableCell> {/* Themed text and font weight */}
                      <TableCell className="text-gray-800 dark:text-gray-200 font-semibold">Medication</TableCell> {/* Themed text and font weight */}
                      <TableCell className="text-gray-800 dark:text-gray-200 font-semibold">Date</TableCell> {/* Themed text and font weight */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                     {mockPrescriptionsToFill.length === 0 ? (
                       <TableRow>
                         <TableCell colSpan={3} align="center" className="text-gray-700 dark:text-gray-300"> {/* Themed text */}
                           No prescriptions to fill.
                         </TableCell>
                       </TableRow>
                     ) : (
                        mockPrescriptionsToFill.map((prescription) => (
                         <TableRow key={prescription.id} className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"> {/* Hover effect */}
                           <TableCell className="text-gray-900 dark:text-gray-100">{prescription.patientName}</TableCell> {/* Themed text */}
                           <TableCell className="text-gray-900 dark:text-gray-100">{prescription.medication}</TableCell> {/* Themed text */}
                           <TableCell className="text-gray-900 dark:text-gray-100">{prescription.date}</TableCell> {/* Themed text */}
                         </TableRow>
                       ))
                     )}
                  </TableBody>
                </Table>
              </TableContainer>
            </DashboardCard>
          </Grid>

           <Grid item xs={12} md={6}> {/* Made cards responsive */}
            <DashboardCard
              title="Recent Orders"
              icon={ShoppingCart}
              actionButton={(
                <Button variant="outlined" size="small" startIcon={<Eye size={16} />} className="text-green-600 dark:text-green-300 border-green-600 dark:border-green-300 hover:bg-green-50 dark:hover:bg-green-900 transition-colors duration-200">View All</Button>
              )}
            >
               <Typography variant="body2" className="text-gray-700 dark:text-gray-300">[ Placeholder for a list of recent medication orders ]</Typography> {/* Themed text */}
               {/* Table or List of recent orders */}
               <Box sx={{ mt: 2, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="bg-gray-200 dark:bg-gray-600 rounded-md"> {/* Themed placeholder box */}
                    <Typography variant="body2" className="text-gray-700 dark:text-gray-300">[ Recent Orders List Placeholder ]</Typography> {/* Themed text */}
               </Box>
            </DashboardCard>
          </Grid>

          {/* Add more pharmacist dashboard sections */}

        </Grid>
      </Paper>
    </Box>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { Typography, Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import { Package, FileText, ShoppingCart, AlertCircle, Eye } from 'lucide-react';
import { PharmacistPageContainer } from '@/components/pharmacist/PharmacistComponents';
import { DashboardCard } from '@/components/pharmacist/PharmacistComponents';
import { getInventory, getPrescriptions, getPharmacistProfile } from '@/services/pharmacistService';
import Link from 'next/link';

export default function PharmacistDashboardPage() {
  const [pharmacist, setPharmacist] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        const [pharmacistData, inventoryData, prescriptionsData] = await Promise.all([
          getPharmacistProfile(),
          getInventory(),
          getPrescriptions()
        ]);

        setPharmacist(pharmacistData);
        setInventory(inventoryData);
        setPrescriptions(prescriptionsData.filter(p => p.status === 'Pending'));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const lowStockItems = inventory.filter(item => item.stock <= item.lowStockThreshold);

  return (
    <PharmacistPageContainer
      title="Pharmacist Dashboard"
      description={pharmacist ? `Welcome, ${pharmacist.name} (${pharmacist.location})!` : "Loading..."}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <DashboardCard
            title="Low Stock Items"
            icon={AlertCircle}
          >
            <TableContainer component={Paper} elevation={1} className="bg-card rounded-md">
              <Table size="small">
                <TableHead>
                  <TableRow className="bg-muted">
                    <TableCell className="text-foreground font-semibold">Item</TableCell>
                    <TableCell align="right" className="text-foreground font-semibold">Stock</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={2} align="center" className="text-muted-foreground">
                        Loading inventory data...
                      </TableCell>
                    </TableRow>
                  ) : lowStockItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} align="center" className="text-muted-foreground">
                        No items currently low in stock.
                      </TableCell>
                    </TableRow>
                  ) : (
                    lowStockItems.map((item) => (
                      <TableRow key={item.id} className="hover:bg-muted/40 transition-colors duration-200">
                        <TableCell className="text-foreground">{item.name}</TableCell>
                        <TableCell align="right" className="text-foreground">{item.stock}</TableCell>
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
              <Link href="/pharmacist/prescriptions" passHref>
                <Button variant="outlined" size="small" startIcon={<Eye size={16} />} className="text-green-600 dark:text-green-300 border-green-600 dark:border-green-300 hover:bg-green-50 dark:hover:bg-green-900 transition-colors duration-200">
                  View All
                </Button>
              </Link>
            )}
          >
            <TableContainer component={Paper} elevation={1} className="bg-card rounded-md">
              <Table size="small">
                <TableHead>
                  <TableRow className="bg-muted">
                    <TableCell className="text-foreground font-semibold">Patient</TableCell>
                    <TableCell className="text-foreground font-semibold">Medication</TableCell>
                    <TableCell className="text-foreground font-semibold">Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center" className="text-muted-foreground">
                        Loading prescription data...
                      </TableCell>
                    </TableRow>
                  ) : prescriptions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center" className="text-muted-foreground">
                        No prescriptions to fill.
                      </TableCell>
                    </TableRow>
                  ) : (
                    prescriptions.map((prescription) => (
                      <TableRow key={prescription.id} className="hover:bg-muted/40 transition-colors duration-200">
                        <TableCell className="text-foreground">{prescription.patientName}</TableCell>
                        <TableCell className="text-foreground">{prescription.medication}</TableCell>
                        <TableCell className="text-foreground">{prescription.issueDate}</TableCell>
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
              <Link href="/pharmacist/orders" passHref>
                <Button variant="outlined" size="small" startIcon={<Eye size={16} />} className="text-green-600 dark:text-green-300 border-green-600 dark:border-green-300 hover:bg-green-50 dark:hover:bg-green-900 transition-colors duration-200">
                  View All
                </Button>
              </Link>
            )}
          >
            {loading ? (
              <Typography className="text-muted-foreground">Loading order data...</Typography>
            ) : (
              <Box className="text-muted-foreground">
                <Typography variant="body2">Recent medication orders will appear here.</Typography>
                <Box sx={{ mt: 2, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="bg-muted rounded-md">
                  <Typography variant="body2">[ Recent Orders List Placeholder ]</Typography>
                </Box>
              </Box>
            )}
          </DashboardCard>
        </Grid>
      </Grid>
    </PharmacistPageContainer>
  );
}
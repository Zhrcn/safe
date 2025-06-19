'use client';
import { useState, useEffect } from 'react';
import { Package, FileText, ShoppingCart, AlertCircle, Eye } from 'lucide-react';
import { PharmacistPageContainer } from '@/components/pharmacist/PharmacistComponents';
import { DashboardCard } from '@/components/pharmacist/PharmacistComponents';
import { getInventory, getPrescriptions, getPharmacistProfile } from '@/services/pharmacistService';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <DashboardCard
            title="Low Stock Items"
            icon={AlertCircle}
          >
            <div className="bg-card rounded-md">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted">
                    <TableHead className="text-foreground font-semibold">Item</TableHead>
                    <TableHead className="text-foreground font-semibold text-right">Stock</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center text-muted-foreground">
                        Loading inventory data...
                      </TableCell>
                    </TableRow>
                  ) : lowStockItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center text-muted-foreground">
                        No items currently low in stock.
                      </TableCell>
                    </TableRow>
                  ) : (
                    lowStockItems.map((item) => (
                      <TableRow key={item.id} className="hover:bg-muted/40 transition-colors duration-200">
                        <TableCell className="text-foreground">{item.name}</TableCell>
                        <TableCell className="text-foreground text-right">{item.stock}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </DashboardCard>
        </div>
        <div>
          <DashboardCard
            title="Prescriptions to Fill"
            icon={FileText}
            actionButton={(
              <Link href="/pharmacist/prescriptions" passHref>
                <Button variant="outline" size="sm" className="text-green-600 dark:text-green-300 border-green-600 dark:border-green-300 hover:bg-green-50 dark:hover:bg-green-900 transition-colors duration-200">
                  <Eye className="w-4 h-4 mr-2" />
                  View All
                </Button>
              </Link>
            )}
          >
            <div className="bg-card rounded-md">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted">
                    <TableHead className="text-foreground font-semibold">Patient</TableHead>
                    <TableHead className="text-foreground font-semibold">Medication</TableHead>
                    <TableHead className="text-foreground font-semibold">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground">
                        Loading prescription data...
                      </TableCell>
                    </TableRow>
                  ) : prescriptions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground">
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
            </div>
          </DashboardCard>
        </div>
        <div>
          <DashboardCard
            title="Recent Orders"
            icon={ShoppingCart}
            actionButton={(
              <Link href="/pharmacist/orders" passHref>
                <Button variant="outline" size="sm" className="text-green-600 dark:text-green-300 border-green-600 dark:border-green-300 hover:bg-green-50 dark:hover:bg-green-900 transition-colors duration-200">
                  <Eye className="w-4 h-4 mr-2" />
                  View All
                </Button>
              </Link>
            )}
          >
            {loading ? (
              <p className="text-muted-foreground">Loading order data...</p>
            ) : (
              <div className="text-muted-foreground">
                <p className="text-sm">Recent medication orders will appear here.</p>
                <div className="mt-4 h-[100px] flex items-center justify-center bg-muted rounded-md">
                  <p className="text-sm">[ Recent Orders List Placeholder ]</p>
                </div>
              </div>
            )}
          </DashboardCard>
        </div>
      </div>
    </PharmacistPageContainer>
  );
}
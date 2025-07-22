'use client';
import { Button } from '@/components/ui/Button';
import { useState, useEffect } from 'react';
import { Package, FileText, ShoppingCart, AlertCircle, Eye, CheckCircle, Box } from 'lucide-react';
import { PharmacistPageContainer } from '@/components/pharmacist/PharmacistComponents';
import { DashboardCard } from '@/components/pharmacist/PharmacistComponents';
import { getInventory, getPrescriptions, getPharmacistProfile, markPrescriptionFilled } from '@/services/pharmacistService';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Tooltip } from '@/components/ui/Tooltip';
import AddInventoryDialog from './AddInventoryDialog';
import { useDebounce } from '@/hooks/useAdvancedButton';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/Avatar';
import { Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PharmacistDashboardPage() {
  const [pharmacist, setPharmacist] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(0);
  const [prescriptionActionLoading, setPrescriptionActionLoading] = useState(null);
  const [prescriptionActionError, setPrescriptionActionError] = useState(null);
  const [inventorySearch, setInventorySearch] = useState('');
  const [prescriptionSearch, setPrescriptionSearch] = useState('');
  const debouncedInventorySearch = useDebounce(inventorySearch, 200);
  const debouncedPrescriptionSearch = useDebounce(prescriptionSearch, 200);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        setError(null);
        const [pharmacistData, inventoryData, prescriptionsData] = await Promise.all([
          getPharmacistProfile(),
          getInventory(),
          getPrescriptions()
        ]);
        setPharmacist(pharmacistData);
        setInventory(Array.isArray(inventoryData) ? inventoryData : []);
        setPrescriptions(Array.isArray(prescriptionsData) ? prescriptionsData.filter(p => p.status === 'active' || p.status === 'pending_review') : []);
      } catch (err) {
        setError('Error fetching dashboard data.');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, [refreshFlag]);

  const handleInventoryAdded = () => setRefreshFlag(f => f + 1);

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(debouncedInventorySearch.toLowerCase())
  );
  const filteredLowStockItems = filteredInventory.filter(item => item.stock <= item.lowStockThreshold);

  const filteredPrescriptions = prescriptions.filter(prescription =>
    (prescription.patientName || '').toLowerCase().includes(debouncedPrescriptionSearch.toLowerCase()) ||
    (Array.isArray(prescription.medications) && prescription.medications.some(med => med.name.toLowerCase().includes(debouncedPrescriptionSearch.toLowerCase())))
  );

  const handleMarkFilled = async (id) => {
    if (!window.confirm('Mark this prescription as filled?')) return;
    setPrescriptionActionLoading(id);
    setPrescriptionActionError(null);
    try {
      await markPrescriptionFilled(id);
      setRefreshFlag(f => f + 1);
    } catch (err) {
      setPrescriptionActionError('Failed to mark as filled.');
    } finally {
      setPrescriptionActionLoading(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Summary Header */}
      <Card className="mb-4 bg-gradient-to-r from-primary/10 via-card to-secondary/10 border-0 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between gap-4 p-6">
          <div>
            <CardTitle className="text-3xl font-bold">
              {pharmacist ? `Welcome, ${pharmacist.firstName} ${pharmacist.lastName}` : 'Pharmacist Dashboard'}
            </CardTitle>
            <CardDescription className="mt-2">
              {pharmacist?.pharmacyName && (
                <span className="font-semibold text-primary">{pharmacist.pharmacyName}</span>
              )}
              {pharmacist?.pharmacyAddress && (
                <span className="ml-2 text-muted-foreground">{pharmacist.pharmacyAddress}</span>
              )}
            </CardDescription>
          </div>
          <div className="flex items-center gap-6">
            {/* Notification Bell */}
            <div className="relative">
              <button
                className="relative p-2 rounded-full hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
                aria-label="View notifications"
                tabIndex={0}
              >
                <Bell className="w-6 h-6 text-primary" aria-hidden="true" />
                <span className="absolute -top-1 -right-1 bg-danger text-white text-xs rounded-full px-1.5 py-0.5 font-bold" aria-label="3 unread notifications">3</span>
              </button>
            </div>
            {/* Profile Avatar & Info */}
            <div className="flex items-center gap-3">
              <Avatar size="sm">
                <AvatarImage src={pharmacist?.profileImage} alt="Profile" />
                <AvatarFallback>{pharmacist ? `${pharmacist.firstName?.[0] || ''}${pharmacist.lastName?.[0] || ''}` : '?'}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-semibold text-foreground text-sm">{pharmacist ? `${pharmacist.firstName} ${pharmacist.lastName}` : ''}</span>
                <span className="text-xs text-muted-foreground">{pharmacist?.email}</span>
              </div>
              {/* Dropdown for profile/settings could go here */}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="flex flex-row items-center gap-4 p-4 bg-gradient-to-r from-primary/10 to-primary/5 border-0 shadow-md">
              <div className="p-2 rounded-full bg-primary/20 text-primary"><Package className="w-6 h-6" /></div>
              <div>
                <div className="text-lg font-bold">{inventory.length}</div>
                <div className="text-xs text-muted-foreground">Total Inventory</div>
              </div>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="flex flex-row items-center gap-4 p-4 bg-gradient-to-r from-warning/10 to-warning/5 border-0 shadow-md">
              <div className="p-2 rounded-full bg-warning/20 text-warning"><AlertCircle className="w-6 h-6" /></div>
              <div>
                <div className="text-lg font-bold">{filteredLowStockItems.length}</div>
                <div className="text-xs text-muted-foreground">Low Stock</div>
              </div>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7 }}
          >
            <Card className="flex flex-row items-center gap-4 p-4 bg-gradient-to-r from-primary/10 to-primary/5 border-0 shadow-md">
              <div className="p-2 rounded-full bg-primary/20 text-primary"><FileText className="w-6 h-6" /></div>
              <div>
                <div className="text-lg font-bold">{prescriptions.length}</div>
                <div className="text-xs text-muted-foreground">Prescriptions to Fill</div>
              </div>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="flex flex-row items-center gap-4 p-4 bg-gradient-to-r from-accent/10 to-accent/5 border-0 shadow-md">
              <div className="p-2 rounded-full bg-accent/20 text-accent"><ShoppingCart className="w-6 h-6" /></div>
              <div>
                <div className="text-lg font-bold">0</div>
                <div className="text-xs text-muted-foreground">Orders</div>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Low Stock Items Card */}
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-warning" />
              <CardTitle>Low Stock Items</CardTitle>
              <Tooltip content="Items at or below their low stock threshold.">
                <span className="ml-1 text-muted-foreground cursor-help">?</span>
              </Tooltip>
            </div>
            <AddInventoryDialog onAdd={handleInventoryAdded} />
          </CardHeader>
          <CardContent>
            <input
              type="text"
              placeholder="Search inventory..."
              value={inventorySearch}
              onChange={e => setInventorySearch(e.target.value)}
              className="mb-3 w-full border rounded-lg px-3 py-2 text-sm"
              aria-label="Search inventory"
            />
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-card">
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead className="text-right">Threshold</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">Loading inventory data...</TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-red-500">{error}</TableCell>
                  </TableRow>
                ) : filteredLowStockItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Box className="w-10 h-10 text-muted-foreground mb-2" />
                        <div>No items currently low in stock.</div>
                        <AddInventoryDialog onAdd={handleInventoryAdded} />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLowStockItems.map((item) => (
                    <motion.tr
                      key={item._id}
                      whileHover={{ scale: 1.01, backgroundColor: 'rgba(255, 193, 7, 0.08)' }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      className="hover:bg-warning/10 transition-colors duration-200"
                    >
                      <TableCell className="text-foreground font-semibold">{item.name}</TableCell>
                      <TableCell className="text-right">
                        {item.stock === 0 ? (
                          <Badge variant="danger">
                            <motion.span animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}>
                              Out of Stock
                            </motion.span>
                          </Badge>
                        ) : item.stock <= item.lowStockThreshold ? (
                          <Badge variant="warning">{item.stock}</Badge>
                        ) : (
                          <Badge variant="success">{item.stock}</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">{item.lowStockThreshold}</TableCell>
                    </motion.tr>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Prescriptions to Fill Card */}
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            <CardTitle>Prescriptions to Fill</CardTitle>
            <Tooltip content="Active and pending prescriptions assigned to you.">
              <span className="ml-1 text-muted-foreground cursor-help">?</span>
            </Tooltip>
            <div className="ml-auto">
              <Link href="/pharmacist/prescriptions" passHref legacyBehavior>
                <Button variant="glass" size="sm" className="border-primary text-primary hover:bg-primary/10">
                  <Eye className="w-4 h-4 mr-2" />
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <input
              type="text"
              placeholder="Search prescriptions..."
              value={prescriptionSearch}
              onChange={e => setPrescriptionSearch(e.target.value)}
              className="mb-3 w-full border rounded-lg px-3 py-2 text-sm"
              aria-label="Search prescriptions"
            />
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-card">
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Medications</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">Loading prescription data...</TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-red-500">{error}</TableCell>
                  </TableRow>
                ) : filteredPrescriptions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="w-10 h-10 text-muted-foreground mb-2" />
                        <div>No prescriptions to fill.</div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPrescriptions.map((prescription) => (
                    <motion.tr
                      key={prescription.id}
                      whileHover={{ scale: 1.01, backgroundColor: 'rgba(59, 130, 246, 0.06)' }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      className="hover:bg-primary/5 transition-colors duration-200"
                    >
                      <TableCell className="text-foreground font-semibold">{prescription.patientName || '-'}</TableCell>
                      <TableCell className="text-foreground">
                        {Array.isArray(prescription.medications) && prescription.medications.length > 0
                          ? prescription.medications.map(med => med.name).join(', ')
                          : '-'}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{prescription.date ? new Date(prescription.date).toLocaleDateString() : '-'}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            prescription.status === 'active' ? 'success'
                              : prescription.status === 'pending_review' ? 'warning'
                              : prescription.status === 'filled' ? 'secondary'
                              : 'outline'
                          }
                        >
                          {prescription.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="flex gap-2 items-center">
                        <Tooltip content="View Details">
                          <Link href={`/pharmacist/prescriptions/${prescription.id}`} passHref legacyBehavior>
                            <Button
                              variant="outline"
                              size="icon-sm"
                              className="border-primary text-primary"
                              aria-label="View Details"
                              tabIndex={0}
                            >
                              <Eye className="w-4 h-4" aria-hidden="true" />
                            </Button>
                          </Link>
                        </Tooltip>
                        {prescription.status !== 'filled' && (
                          <Tooltip content="Mark as Filled">
                            <Button
                              variant="success"
                              size="icon-sm"
                              loading={prescriptionActionLoading === prescription.id}
                              onClick={() => handleMarkFilled(prescription.id)}
                              aria-label="Mark as Filled"
                              tabIndex={0}
                            >
                              <CheckCircle className="w-4 h-4" aria-hidden="true" />
                            </Button>
                          </Tooltip>
                        )}
                      </TableCell>
                    </motion.tr>
                  ))
                )}
                {prescriptionActionError && (
                  <tr><td colSpan={5} className="text-center text-red-500">{prescriptionActionError}</td></tr>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Orders Card */}
        <Card className="shadow-lg md:col-span-2">
          <CardHeader className="flex flex-row items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-accent" />
            <CardTitle>Recent Orders</CardTitle>
            <Tooltip content="Recent medication orders placed by the pharmacy.">
              <span className="ml-1 text-muted-foreground cursor-help">?</span>
            </Tooltip>
            <div className="ml-auto">
              <Link href="/pharmacist/orders" passHref legacyBehavior>
                <Button variant="outline" size="sm" className="border-accent text-accent hover:bg-accent/10">
                  <Eye className="w-4 h-4 mr-2" />
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground">Loading order data...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <div className="text-muted-foreground">
                <p className="text-sm">Recent medication orders will appear here.</p>
                <div className="mt-4 h-[100px] flex items-center justify-center bg-muted rounded-md">
                  <p className="text-sm">[ Recent Orders List Placeholder ]</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
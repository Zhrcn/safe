"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { ShoppingCart, Package, ClipboardList, User } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';
import { getDistributorOrders, getDistributorProfile } from '@/store/services/distributorApi';

export default function DistributorDashboard() {
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [profileRes, ordersRes] = await Promise.all([
          getDistributorProfile(),
          getDistributorOrders()
        ]);
        setProfile(profileRes.data.data);
        setOrders(Array.isArray(ordersRes.data.data) ? ordersRes.data.data : []);
      } catch (err) {
        // handle error
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const acceptedOrders = orders.filter(o => o.status === 'accepted');

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <Card className="mb-4 bg-gradient-to-r from-primary/10 via-card to-secondary/10 border-0 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between gap-4 p-6">
          <div>
            <CardTitle className="text-3xl font-bold">
              {profile ? `Welcome, ${profile.companyName}` : 'Distributor Dashboard'}
            </CardTitle>
            <CardDescription className="mt-2">
              {profile?.contactName && (
                <span className="font-semibold text-primary">{profile.contactName}</span>
              )}
              {profile?.contactEmail && (
                <span className="ml-2 text-muted-foreground">{profile.contactEmail}</span>
              )}
            </CardDescription>
          </div>
          <div className="flex items-center gap-6">
            <User className="w-10 h-10 text-primary" />
          </div>
        </CardHeader>
      </Card>

      {/* Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        <AnimatePresence>
          <motion.div
            key="total-orders"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="flex flex-row items-center gap-4 p-4 bg-gradient-to-r from-primary/10 to-primary/5 border-0 shadow-md">
              <div className="p-2 rounded-full bg-primary/20 text-primary"><ShoppingCart className="w-6 h-6" /></div>
              <div>
                <div className="text-lg font-bold">{orders.length}</div>
                <div className="text-xs text-muted-foreground">Total Orders</div>
              </div>
            </Card>
          </motion.div>
          <motion.div
            key="accepted-orders"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="flex flex-row items-center gap-4 p-4 bg-gradient-to-r from-accent/10 to-accent/5 border-0 shadow-md">
              <div className="p-2 rounded-full bg-accent/20 text-accent"><Package className="w-6 h-6" /></div>
              <div>
                <div className="text-lg font-bold">{acceptedOrders.length}</div>
                <div className="text-xs text-muted-foreground">Accepted Orders</div>
              </div>
            </Card>
          </motion.div>
          <motion.div
            key="inventory-items"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7 }}
          >
            <Card className="flex flex-row items-center gap-4 p-4 bg-gradient-to-r from-secondary/10 to-secondary/5 border-0 shadow-md">
              <div className="p-2 rounded-full bg-secondary/20 text-secondary"><ClipboardList className="w-6 h-6" /></div>
              <div>
                <div className="text-lg font-bold">{profile?.inventory?.length ?? 0}</div>
                <div className="text-xs text-muted-foreground">Inventory Items</div>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
        <Link href="/distributor/orders">
          <Card className="hover:shadow-xl transition-all duration-300 rounded-2xl bg-card/90 border-none flex flex-col items-center p-6">
            <ShoppingCart className="w-8 h-8 text-primary mb-2" />
            <span className="font-semibold text-lg">Orders</span>
            <span className="text-sm text-muted-foreground mt-1">View and manage all orders</span>
          </Card>
        </Link>
        <Link href="/distributor/orders/accepted">
          <Card className="hover:shadow-xl transition-all duration-300 rounded-2xl bg-card/90 border-none flex flex-col items-center p-6">
            <Package className="w-8 h-8 text-accent mb-2" />
            <span className="font-semibold text-lg">Accepted Orders</span>
            <span className="text-sm text-muted-foreground mt-1">View accepted order packages</span>
          </Card>
        </Link>
        <Link href="/distributor/inventory">
          <Card className="hover:shadow-xl transition-all duration-300 rounded-2xl bg-card/90 border-none flex flex-col items-center p-6">
            <ClipboardList className="w-8 h-8 text-secondary mb-2" />
            <span className="font-semibold text-lg">Inventory</span>
            <span className="text-sm text-muted-foreground mt-1">Manage your inventory</span>
          </Card>
        </Link>
        <Link href="/distributor/profile">
          <Card className="hover:shadow-xl transition-all duration-300 rounded-2xl bg-card/90 border-none flex flex-col items-center p-6">
            <User className="w-8 h-8 text-primary mb-2" />
            <span className="font-semibold text-lg">Profile</span>
            <span className="text-sm text-muted-foreground mt-1">Edit your profile</span>
          </Card>
        </Link>
      </div>
    </div>
  );
} 
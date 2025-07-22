"use client";

import React, { useEffect, useState } from 'react';
import { getDistributorOrders, updateOrderStatus, sendOrderToDriver } from '@/store/services/distributorApi';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { ShoppingCart, CheckCircle, XCircle } from 'lucide-react';

export default function DistributorOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState('');
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    setLoading(true);
    getDistributorOrders()
      .then(res => setOrders(res.data.data))
      .catch(() => setError('Failed to load orders'))
      .finally(() => setLoading(false));
  };

  const handleAction = async (orderId, status) => {
    setActionLoading(orderId + status);
    setActionError('');
    try {
      await updateOrderStatus(orderId, status);
      fetchOrders();
    } catch {
      setActionError('Failed to update order status.');
    }
    setActionLoading('');
  };

  const handleSendToDriver = async (orderId) => {
    setActionLoading(orderId + 'send');
    setActionError('');
    try {
      // For demo, use a placeholder driverId. In production, select driver from UI.
      await sendOrderToDriver(orderId, 'driverId-placeholder');
      fetchOrders();
    } catch {
      setActionError('Failed to send order to driver.');
    }
    setActionLoading('');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': return <Badge variant="secondary">Pending</Badge>;
      case 'accepted': return <Badge variant="success">Accepted</Badge>;
      case 'rejected': return <Badge variant="destructive">Rejected</Badge>;
      case 'shipped': return <Badge variant="info">Shipped</Badge>;
      case 'completed': return <Badge variant="success">Completed</Badge>;
      case 'cancelled': return <Badge variant="destructive">Cancelled</Badge>;
      case 'sent_to_driver': return <Badge variant="info">Sent to Driver</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-xl">
        <CardHeader className="flex flex-row items-center gap-4 p-6">
          <ShoppingCart className="w-8 h-8 text-primary" />
          <CardTitle className="text-2xl font-bold">Incoming Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center text-muted-foreground py-8">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Pharmacist</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map(order => (
                  <TableRow key={order._id}>
                    <TableCell>{order._id}</TableCell>
                    <TableCell>{order.pharmacist?.user?.email || order.pharmacist?._id}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                    <TableCell>
                      {order.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            className="flex items-center gap-1 px-3 py-1 rounded bg-success/80 text-white hover:bg-success"
                            onClick={() => handleAction(order._id, 'accepted')}
                            disabled={actionLoading === order._id + 'accepted'}
                          >
                            <CheckCircle className="w-4 h-4" /> Accept
                          </button>
                          <button
                            className="flex items-center gap-1 px-3 py-1 rounded bg-destructive/80 text-white hover:bg-destructive"
                            onClick={() => handleAction(order._id, 'rejected')}
                            disabled={actionLoading === order._id + 'rejected'}
                          >
                            <XCircle className="w-4 h-4" /> Reject
                          </button>
                        </div>
                      )}
                      {order.status === 'accepted' && (
                        <button
                          className="flex items-center gap-1 px-3 py-1 rounded bg-primary/80 text-white hover:bg-primary"
                          onClick={() => handleSendToDriver(order._id)}
                          disabled={actionLoading === order._id + 'send'}
                        >
                          <ShoppingCart className="w-4 h-4" /> Send to Driver
                        </button>
                      )}
                      {actionError && <div className="text-red-500 text-xs mt-1">{actionError}</div>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 
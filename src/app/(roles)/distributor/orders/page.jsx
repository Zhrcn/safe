"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { getDistributorOrders, updateOrderStatus, sendOrderToDriver } from '@/store/services/distributorApi';
import { getPharmacists } from '@/services/pharmacistService';
import { getMedicines } from '@/store/services/doctor/medicineApi';
import { createOrder } from '@/store/services/orderApi';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { ShoppingCart, CheckCircle, XCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { toast } from 'react-hot-toast';

export default function DistributorOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState('');
  const [actionError, setActionError] = useState('');
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [pharmacists, setPharmacists] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [orderPharmacist, setOrderPharmacist] = useState('');
  const [orderItems, setOrderItems] = useState([{ medicine: '', quantity: 1, price: 0 }]);
  const [orderNotes, setOrderNotes] = useState('');
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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

  useEffect(() => {
    if (showCreateOrder) {
      getPharmacists().then(res => setPharmacists(res.data || res)).catch(() => setPharmacists([]));
      getMedicines().then(res => setMedicines(res.data || res)).catch(() => setMedicines([]));
    }
  }, [showCreateOrder]);

  const filteredOrders = useMemo(() => {
    let filtered = orders;
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    if (search) {
      filtered = filtered.filter(order =>
        (order.pharmacist?.user?.email || '').toLowerCase().includes(search.toLowerCase()) ||
        (order.items || []).some(item => (item.medicine?.name || '').toLowerCase().includes(search.toLowerCase()))
      );
    }
    return filtered;
  }, [orders, search, statusFilter]);

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
      await sendOrderToDriver(orderId, 'driverId-placeholder');
      fetchOrders();
    } catch {
      setActionError('Failed to send order to driver.');
    }
    setActionLoading('');
  };

  const handleOrderItemChange = (idx, field, value) => {
    setOrderItems(items => items.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };
  const addOrderItem = () => setOrderItems([...orderItems, { medicine: '', quantity: 1, price: 0 }]);
  const removeOrderItem = idx => setOrderItems(items => items.filter((_, i) => i !== idx));

  const validateOrder = () => {
    if (!orderPharmacist) return 'Please select a pharmacist.';
    if (orderItems.some(item => !item.medicine || !item.quantity)) return 'Please fill all item fields.';
    return '';
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    setOrderLoading(true);
    setOrderError('');
    setOrderSuccess('');
    const validationError = validateOrder();
    if (validationError) {
      setOrderError(validationError);
      setOrderLoading(false);
      return;
    }
    try {
      await createOrder({
        pharmacistId: orderPharmacist,
        items: orderItems.map(item => ({
          medicine: item.medicine,
          quantity: Number(item.quantity),
          price: Number(item.price)
        })),
        notes: orderNotes
      });
      setOrderSuccess('Order created successfully!');
      setShowCreateOrder(false);
      setOrderPharmacist('');
      setOrderItems([{ medicine: '', quantity: 1, price: 0 }]);
      setOrderNotes('');
      fetchOrders();
      toast.success('Order created successfully!');
    } catch (err) {
      setOrderError('Failed to create order.');
      toast.error('Failed to create order.');
    }
    setOrderLoading(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': return <Badge variant="secondary">Pending</Badge>;
      case 'accepted': return <Badge className="bg-green-100 text-green-700 border-green-200">Accepted</Badge>;
      case 'rejected': return <Badge className="bg-red-100 text-red-700 border-red-200">Rejected</Badge>;
      case 'shipped': return <Badge variant="info">Shipped</Badge>;
      case 'completed': return <Badge variant="success">Completed</Badge>;
      case 'cancelled': return <Badge variant="destructive">Cancelled</Badge>;
      case 'sent_to_driver': return <Badge variant="info">Sent to Driver</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold mb-1">Distributor Orders</h1>
          <p className="text-muted-foreground">Manage and track orders from pharmacists.</p>
        </div>
        <Button variant="primary" onClick={() => setShowCreateOrder(true)}>
          + New Order
        </Button>
      </div>
      <Card className="shadow-xl">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6">
          <div className="flex items-center gap-4">
            <ShoppingCart className="w-8 h-8 text-primary" />
            <CardTitle className="text-2xl font-bold">Orders</CardTitle>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 items-center">
            <Input
              placeholder="Search by pharmacist or medicine..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-48"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="sent_to_driver">Sent to Driver</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center text-muted-foreground py-8">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">No orders found.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Pharmacist</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map(order => (
                  <TableRow key={order._id}>
                    <TableCell>{order._id}</TableCell>
                    <TableCell>{order.pharmacist?.pharmacyName || order.pharmacist?.user?.email || order.pharmacist?._id}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                    <TableCell>
                      <ul className="list-disc ml-4">
                        {order.items.map((item, idx) => (
                          <li key={idx}>{item.medicine?.name || item.medicine || 'Unknown'} - Qty: {item.quantity} - Price: {item.price}</li>
                        ))}
                      </ul>
                    </TableCell>
                    <TableCell>
                      {order.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            variant="success"
                            className="flex items-center gap-1"
                            onClick={() => handleAction(order._id, 'accepted')}
                            disabled={actionLoading === order._id + 'accepted'}
                          >
                            <CheckCircle className="w-4 h-4 m-2" /> Accept
                          </Button>
                          <Button
                            variant="destructive"
                            className="flex items-center gap-1"
                            onClick={() => handleAction(order._id, 'rejected')}
                            disabled={actionLoading === order._id + 'rejected'}
                          >
                            <XCircle className="w-4 h-4 m-2" /> Reject
                          </Button>
                        </div>
                      )}
                      {order.status === 'accepted' && (
                        <Button
                          variant="primary"
                          className="flex items-center gap-1"
                          onClick={() => handleSendToDriver(order._id)}
                          disabled={actionLoading === order._id + 'send'}
                        >
                          <ShoppingCart className="w-4 h-4" /> Send to Driver
                        </Button>
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
      <Dialog open={showCreateOrder} onOpenChange={setShowCreateOrder}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Order</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateOrder} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Pharmacist</label>
              <Select value={orderPharmacist} onValueChange={setOrderPharmacist} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select pharmacist" />
                </SelectTrigger>
                <SelectContent>
                  {pharmacists.map(ph => (
                    <SelectItem key={ph._id || ph.id} value={ph._id || ph.id}>
                      {ph.pharmacyName ? `${ph.pharmacyName} ` : ph.user?.email || ph._id || ph.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block mb-1 font-medium">Order Items</label>
              {orderItems.map((item, idx) => (
                <div key={idx} className="flex gap-2 mb-2 items-center">
                  <Select value={item.medicine} onValueChange={val => handleOrderItemChange(idx, 'medicine', val)} required>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select medicine" />
                    </SelectTrigger>
                    <SelectContent>
                      {medicines.map(med => (
                        <SelectItem key={med._id || med.id} value={med._id || med.id}>
                          {med.name?.en || med.name || med._id || med.id}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={e => handleOrderItemChange(idx, 'quantity', e.target.value)}
                    placeholder="Qty"
                    className="w-20"
                    required
                  />
                  <Input
                    type="number"
                    min={0}
                    value={item.price}
                    onChange={e => handleOrderItemChange(idx, 'price', e.target.value)}
                    placeholder="Price"
                    className="w-24"
                  />
                  {orderItems.length > 1 && (
                    <Button type="button" variant="destructive" size="icon" onClick={() => removeOrderItem(idx)}>-</Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addOrderItem}>+ Add Item</Button>
            </div>
            <div>
              <label className="block mb-1 font-medium">Notes</label>
              <Input
                value={orderNotes}
                onChange={e => setOrderNotes(e.target.value)}
                placeholder="Order notes (optional)"
              />
            </div>
            <div className="bg-muted/30 rounded-xl p-3">
              <div className="font-semibold mb-1">Order Summary</div>
              <div className="text-sm text-muted-foreground">
                Pharmacist: {pharmacists.find(ph => (ph._id || ph.id) === orderPharmacist)?.pharmacyName || pharmacists.find(ph => (ph._id || ph.id) === orderPharmacist)?.user?.email || 'N/A'}<br />
                Items: {orderItems.map(item => `${medicines.find(med => (med._id || med.id) === item.medicine)?.name?.en || 'Unknown'} x${item.quantity}`).join(', ')}
                {orderNotes && (<><br />Notes: {orderNotes}</>)}
              </div>
            </div>
            {orderError && <div className="text-red-500 text-sm">{orderError}</div>}
            {orderSuccess && <div className="text-green-600 text-sm">{orderSuccess}</div>}
            <DialogFooter>
              <Button type="submit" variant="primary" disabled={orderLoading}>
                {orderLoading ? 'Creating...' : 'Create Order'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 
"use client";
import React, { useEffect, useState } from 'react';
import { getDistributorOrders } from '@/store/services/distributorApi';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Package } from 'lucide-react';

export default function AcceptedOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getDistributorOrders()
      .then(res => setOrders(res.data.data.filter(order => order.status === 'accepted')))
      .catch(() => setError('Failed to load accepted orders'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <Card className="shadow-xl">
        <CardHeader className="flex flex-row items-center gap-4 p-6">
          <Package className="w-8 h-8 text-accent" />
          <CardTitle className="text-2xl font-bold">Accepted Orders (Order Packages)</CardTitle>
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
                  <TableHead>Created</TableHead>
                  <TableHead>Items</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map(order => (
                  <TableRow key={order._id}>
                    <TableCell>{order._id}</TableCell>
                    <TableCell>{order.pharmacist?.user?.email || order.pharmacist?._id}</TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                    <TableCell>
                      <ul className="list-disc ml-4">
                        {order.items.map((item, idx) => (
                          <li key={idx}>{item.medicine?.name || item.medicine || 'Unknown'} - Qty: {item.quantity}</li>
                        ))}
                      </ul>
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
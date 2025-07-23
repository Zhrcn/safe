"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { getDistributorOrders } from '@/store/services/distributorApi';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Package, ClipboardList, CalendarDays } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

function getStatusBadge(status) {
  switch (status) {
    case 'accepted':
      return <Badge className="bg-green-100 text-green-700 border-green-200">Accepted</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
}

export default function AcceptedOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    getDistributorOrders()
      .then(res => {
        const allOrders = res.data.data;
        setOrders(allOrders.filter(order => order.status === 'accepted'));
      })
      .catch(() => setError('Failed to load accepted orders'))
      .finally(() => setLoading(false));
  }, []);

  const filteredOrders = useMemo(() => {
    if (!search) return orders;
    return orders.filter(order =>
      (order.pharmacist?.pharmacyName || order.pharmacist?.user?.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (order.items || []).some(item => (item.medicine?.name || '').toLowerCase().includes(search.toLowerCase()))
    );
  }, [orders, search]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
            <Package className="w-8 h-8 text-accent" />
            Accepted Orders
          </h1>
          <p className="text-muted-foreground">All accepted order packages from pharmacists.</p>
        </div>
        <Input
          placeholder="Search by pharmacy or medicine..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-60"
        />
      </div>
      <Card className="shadow-2xl border border-accent/30">
        <CardHeader className="flex flex-row items-center gap-4 p-6 bg-accent/10 rounded-t-xl">
          <ClipboardList className="w-8 h-8 text-accent" />
          <CardTitle className="text-2xl font-bold">Accepted Orders (Order Packages)</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mb-4"></span>
              <span className="text-muted-foreground">Loading accepted orders...</span>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Package className="w-10 h-10 text-muted-foreground mb-2" />
              <span className="text-muted-foreground">No accepted orders found.</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-32">Order ID</TableHead>
                    <TableHead>Pharmacy</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        <CalendarDays className="w-4 h-4" /> Created
                      </div>
                    </TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead className="w-24 text-center">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map(order => (
                    <React.Fragment key={order._id}>
                      <TableRow className="hover:bg-accent/10 transition">
                        <TableCell className="font-mono text-xs">{order._id}</TableCell>
                        <TableCell>
                          <div className="font-semibold">{order.pharmacist?.pharmacyName || order.pharmacist?.user?.email || order.pharmacist?._id}</div>
                          <div className="text-xs text-muted-foreground">{order.pharmacist?.user?.email}</div>
                        </TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell>
                          {new Date(order.createdAt).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <ul className="list-disc ml-4 space-y-1">
                            {order.items.slice(0, 2).map((item, idx) => (
                              <li key={idx} className="text-sm">
                                <span className="font-medium">{item.medicine?.name || item.medicine || 'Unknown'}</span>
                                <span className="ml-2 text-xs text-muted-foreground">Qty: {item.quantity}</span>
                              </li>
                            ))}
                            {order.items.length > 2 && (
                              <li className="text-xs text-muted-foreground">+{order.items.length - 2} more</li>
                            )}
                          </ul>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="outline"
                            size="sm"
                            className="px-3 py-1"
                            onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                          >
                            {expandedOrder === order._id ? "Hide" : "View"}
                          </Button>
                        </TableCell>
                      </TableRow>
                      {expandedOrder === order._id && (
                        <TableRow className="bg-muted/30">
                          <TableCell colSpan={6} className="p-4">
                            <div className="flex flex-col md:flex-row gap-6">
                              <div className="flex-1">
                                <h3 className="font-semibold mb-2 text-accent">Order Items</h3>
                                <ul className="space-y-2">
                                  {order.items.map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-4">
                                      <span className="font-medium">{item.medicine?.name || item.medicine || 'Unknown'}</span>
                                      <Badge variant="secondary" className="ml-2">Qty: {item.quantity}</Badge>
                                      {item.price !== undefined && (
                                        <span className="ml-2 text-xs text-muted-foreground">Price: {item.price}</span>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold mb-2 text-accent">Order Details</h3>
                                <div className="space-y-1 text-sm">
                                  <div>
                                    <span className="font-medium">Order ID:</span> <span className="font-mono">{order._id}</span>
                                  </div>
                                  <div>
                                    <span className="font-medium">Pharmacy:</span> {order.pharmacist?.pharmacyName || order.pharmacist?.user?.email || order.pharmacist?._id}
                                  </div>
                                  <div>
                                    <span className="font-medium">Created:</span> {new Date(order.createdAt).toLocaleString()}
                                  </div>
                                  {order.notes && (
                                    <div>
                                      <span className="font-medium">Notes:</span> {order.notes}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 
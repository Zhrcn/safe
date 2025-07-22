'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { ShoppingCart, Eye, CheckCircle, X, Search } from 'lucide-react';
import {
  PharmacistPageContainer,
  PharmacistCard,
} from '@/components/pharmacist/PharmacistComponents';
import { getOrders } from '@/services/pharmacistService';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/Dialog';
import { createOrder } from '@/store/services/orderApi';
import NewOrderDialog from '@/components/pharmacist/NewOrderDialog';

// Status configuration for easy extension and maintenance
const STATUS_CONFIG = {
  pending: {
    colorClass: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
    icon: <ClockIcon className="w-4 h-4 mr-1" />,
    label: 'Pending',
  },
  accepted: {
    colorClass: 'bg-blue-100 text-blue-800 border border-blue-300',
    icon: <CheckCircle className="w-4 h-4 mr-1" />,
    label: 'Accepted',
  },
  rejected: {
    colorClass: 'bg-red-100 text-red-800 border border-red-300',
    icon: <X className="w-4 h-4 mr-1" />,
    label: 'Rejected',
  },
  sent_to_driver: {
    colorClass: 'bg-purple-100 text-purple-800 border border-purple-300',
    icon: <ShoppingCart className="w-4 h-4 mr-1" />,
    label: 'Sent to Driver',
  },
  shipped: {
    colorClass: 'bg-indigo-100 text-indigo-800 border border-indigo-300',
    icon: <ShoppingCart className="w-4 h-4 mr-1" />,
    label: 'Shipped',
  },
  completed: {
    colorClass: 'bg-green-100 text-green-800 border border-green-300',
    icon: <CheckCircle className="w-4 h-4 mr-1" />,
    label: 'Completed',
  },
  cancelled: {
    colorClass: 'bg-gray-100 text-gray-800 border border-gray-300',
    icon: <X className="w-4 h-4 mr-1" />,
    label: 'Cancelled',
  },
};

function StatusChip({ status }) {
  const config = STATUS_CONFIG[status] || {
    colorClass: 'bg-gray-100 text-gray-800 border border-gray-300',
    icon: null,
    label: status,
  };
  return (
    <span className={`inline-flex items-center rounded-full font-medium px-2.5 py-0.5 text-xs ${config.colorClass}`}>
      {config.icon}
      {config.label}
    </span>
  );
}

function ClockIcon(props) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" strokeWidth="2" />
      <path strokeWidth="2" d="M12 6v6l4 2" />
    </svg>
  );
}

function OrderDetailDialog({ open, onClose, order }) {
  if (!order) return null;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground">Order ID</p>
            <p className="font-medium text-base">{order.id}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Items</p>
            <p className="font-medium text-base">{order.items}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Date</p>
            <p className="text-base">{order.date}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Status</p>
            <StatusChip status={order.status} />
          </div>
        </div>
        <DialogFooter>
          <Button className="rounded-md" variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function PharmacistOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [addOrderDialogOpen, setAddOrderDialogOpen] = useState(false);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const filteredOrders = useMemo(() => {
    if (!searchTerm) return orders;
    const lower = searchTerm.toLowerCase();
    return orders.filter(order =>
      (order.items && order.items.toLowerCase().includes(lower)) ||
      (order.id && order.id.toString().includes(lower))
    );
  }, [orders, searchTerm]);

  const handleViewDetails = useCallback((orderId) => {
    const order = orders.find(o => o.id === orderId);
    setSelectedOrder(order);
    setDetailDialogOpen(true);
  }, [orders]);

  return (
    <div className="container mx-auto py-8 px-2 md:px-0">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">My Orders</h1>
          <p className="text-muted-foreground">Manage and track your medication orders to distributors.</p>
        </div>
        <Button
          onClick={() => setAddOrderDialogOpen(true)}
          variant="primary"
          size="lg"
        >
          + New Order
        </Button>
      </div>
      <div className="mb-4 flex items-center gap-4">
        <div className="relative w-full max-w-md">
          <Input
            placeholder="Search by medicine, distributor, or ID"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10 pr-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/30 transition"
          />
          <Search className="absolute left-3 top-2.5 text-muted-foreground w-4 h-4" />
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-4 overflow-x-auto">
        <Table>
          <TableHead>
            <TableRow className="sticky top-0 bg-white z-10">
              <TableCell className="font-semibold text-sm">Order ID</TableCell>
              <TableCell className="font-semibold text-sm">Items</TableCell>
              <TableCell className="font-semibold text-sm">Date</TableCell>
              <TableCell className="font-semibold text-sm">Status</TableCell>
              <TableCell align="right" className="font-semibold text-sm">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" className="py-8 text-center text-muted-foreground">
                  Loading orders...
                </TableCell>
              </TableRow>
            ) : filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" className="py-8 text-center text-muted-foreground">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow
                  key={order.id}
                  className="hover:bg-primary/5 transition"
                >
                  <TableCell className="flex items-center gap-2 font-medium">
                    <span className="inline-flex items-center justify-center rounded-full bg-primary/10 text-primary w-8 h-8 mr-2">
                      <ShoppingCart size={18} />
                    </span>
                    {order.id}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{order.items}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    <StatusChip status={order.status} />
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      className="mr-2"
                      variant="outline"
                      onClick={() => handleViewDetails(order.id)}
                    >
                      <Eye size={16} className="mr-2" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <NewOrderDialog
        open={addOrderDialogOpen}
        onClose={() => setAddOrderDialogOpen(false)}
        onOrderCreated={loadOrders}
      />
      <OrderDetailDialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
}

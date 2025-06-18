'use client';
import { useState, useEffect } from 'react';
import { ShoppingCart, Eye, CheckCircle, X, Search } from 'lucide-react';
import {
  PharmacistPageContainer,
  PharmacistCard,
} from '@/components/pharmacist/PharmacistComponents';
import {
  getOrders,
  updateOrderStatus,
} from '@/services/pharmacistService';
import { SearchField } from '@/components/ui/SearchField';
import { TableContainer } from '@/components/ui/TableContainer';
import { Table } from '@/components/ui/Table';
import { TableHead } from '@/components/ui/TableHead';
import { TableBody } from '@/components/ui/TableBody';
import { TableRow } from '@/components/ui/TableRow';
import { TableCell } from '@/components/ui/TableCell';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Paper } from '@/components/ui/Paper';

function OrderDetailDialog({ open, onClose, order, onMarkAsProcessed }) {
  if (!order) return null;
  return (
    <div className={`fixed inset-0 z-50 ${open ? 'block' : 'hidden'}`}>
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold">Order Details</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <X size={20} />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Order ID</p>
            <p className="font-medium">{order.id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Items</p>
            <p className="font-medium">{order.items}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
            <p>{order.date}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
            <Chip label={order.status} color={getStatusColor(order.status)} size="small" />
          </div>
        </div>
        <div className="flex justify-end gap-2 p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
          >
            Close
          </button>
          {order.status !== 'Completed' && (
            <button
              onClick={() => {
                onMarkAsProcessed(order.id);
                onClose();
              }}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
            >
              <CheckCircle size={16} />
              {order.status === 'Pending' ? 'Start Processing' : 'Mark as Completed'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function getStatusColor(status) {
  switch (status) {
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'Processing':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'Completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }
}

export default function PharmacistOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  useEffect(() => {
    async function loadOrders() {
      try {
        setLoading(true);
        const data = await getOrders();
        setOrders(data);
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  const filteredOrders = searchTerm
    ? orders.filter(order =>
        order.items.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toString().includes(searchTerm.toLowerCase())
      )
    : orders;

  const handleViewDetails = (orderId) => {
    const order = orders.find(o => o.id === orderId);
    setSelectedOrder(order);
    setDetailDialogOpen(true);
  };

  const handleMarkAsProcessed = async (orderId) => {
    try {
      const order = orders.find(o => o.id === orderId);
      const nextStatus = order.status === 'Pending' ? 'Processing' : 'Completed';
      const updatedOrder = await updateOrderStatus(orderId, nextStatus);
      setOrders(prev => prev.map(o => (o.id === orderId ? updatedOrder : o)));
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <PharmacistPageContainer
      title="Order Management"
      description="View and manage medication orders."
    >
      <PharmacistCard
        title="Medication Orders"
        actions={
          <SearchField
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Orders"
          />
        }
      >
        <TableContainer component={Paper} elevation={2}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Loading orders...
                  </TableCell>
                </TableRow>
              ) : filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No orders found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="flex items-center">
                      <ShoppingCart size={18} className="mr-2" />
                      {order.id}
                    </TableCell>
                    <TableCell>{order.items}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>
                      <Chip label={order.status} color={getStatusColor(order.status)} size="small" />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleViewDetails(order.id)}
                        startIcon={<Eye size={16} />}
                      >
                        View
                      </Button>
                      {order.status !== 'Completed' && (
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleMarkAsProcessed(order.id)}
                          startIcon={<CheckCircle size={16} />}
                          className="ml-2 bg-green-600 hover:bg-green-700 text-white"
                        >
                          {order.status === 'Pending' ? 'Start Processing' : 'Mark as Completed'}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </PharmacistCard>
      <OrderDetailDialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        order={selectedOrder}
        onMarkAsProcessed={handleMarkAsProcessed}
      />
    </PharmacistPageContainer>
  );
}

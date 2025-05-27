'use client';

import { useState, useEffect } from 'react';
import { Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Chip } from '@mui/material';
import { ShoppingCart, Eye, CheckCircle, X } from 'lucide-react';
import { PharmacistPageContainer, PharmacistCard, SearchField } from '@/components/pharmacist/PharmacistComponents';
import { getOrders, updateOrderStatus } from '@/services/pharmacistService';

// Order Detail Dialog Component
function OrderDetailDialog({ open, onClose, order }) {
  if (!order) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle className="flex justify-between items-center">
        <Typography variant="h6" className="font-bold">
          Order Details
        </Typography>
        <IconButton onClick={onClose}>
          <X size={20} />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box className="mt-4 space-y-4">
          <Box className="space-y-1">
            <Typography variant="body2" className="text-muted-foreground">Order ID</Typography>
            <Typography variant="body1" className="font-medium">{order.id}</Typography>
          </Box>

          <Box className="space-y-1">
            <Typography variant="body2" className="text-muted-foreground">Items</Typography>
            <Typography variant="body1" className="font-medium">{order.items}</Typography>
          </Box>

          <Box className="space-y-1">
            <Typography variant="body2" className="text-muted-foreground">Date</Typography>
            <Typography variant="body1">{order.date}</Typography>
          </Box>

          <Box className="space-y-1">
            <Typography variant="body2" className="text-muted-foreground">Status</Typography>
            <Chip
              label={order.status}
              color={
                order.status === 'Pending' ? 'warning' :
                  order.status === 'Processing' ? 'info' :
                    'success'
              }
              size="small"
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} className="text-muted-foreground">
          Close
        </Button>
        {order.status !== 'Completed' && (
          <Button
            variant="contained"
            startIcon={<CheckCircle size={16} />}
            onClick={onClose}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Mark as Processed
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default function PharmacistOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  // Load orders data
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

  // Filter orders based on search term
  const filteredOrders = searchTerm
    ? orders.filter(order =>
      order.items.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toString().includes(searchTerm.toLowerCase())
    )
    : orders;

  const handleViewDetails = (orderId) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      setSelectedOrder(order);
      setDetailDialogOpen(true);
    }
  };

  const handleMarkAsProcessed = async (orderId) => {
    try {
      // Determine next status
      const order = orders.find(o => o.id === orderId);
      const nextStatus = order.status === 'Pending' ? 'Processing' : 'Completed';

      const updatedOrder = await updateOrderStatus(orderId, nextStatus);
      setOrders(prev => prev.map(order =>
        order.id === orderId ? updatedOrder : order
      ));
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  // Get status chip color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'warning';
      case 'Processing':
        return 'info';
      case 'Completed':
        return 'success';
      default:
        return 'default';
    }
  };

  // Get button text based on status
  const getActionButtonText = (status) => {
    return status === 'Pending' ? 'Start Processing' : 'Mark as Completed';
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
        <TableContainer component={Paper} elevation={2} className="bg-card rounded-md">
          <Table>
            <TableHead>
              <TableRow className="bg-muted">
                <TableCell className="text-foreground font-semibold">Order ID</TableCell>
                <TableCell className="text-foreground font-semibold">Items</TableCell>
                <TableCell className="text-foreground font-semibold">Date</TableCell>
                <TableCell className="text-foreground font-semibold">Status</TableCell>
                <TableCell align="right" className="text-foreground font-semibold">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" className="text-muted-foreground">
                    Loading orders data...
                  </TableCell>
                </TableRow>
              ) : filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" className="text-muted-foreground">
                    No orders found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow
                    key={order.id}
                    className="hover:bg-muted/40 transition-colors duration-200"
                  >
                    <TableCell className="text-foreground flex items-center">
                      <ShoppingCart size={20} className="mr-2 text-muted-foreground" />
                      {order.id}
                    </TableCell>
                    <TableCell className="text-foreground">{order.items}</TableCell>
                    <TableCell className="text-foreground">{order.date}</TableCell>
                    <TableCell>
                      <Chip
                        label={order.status}
                        color={getStatusColor(order.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right" className="space-x-2">
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Eye size={16} />}
                        onClick={() => handleViewDetails(order.id)}
                        className="text-blue-600 dark:text-blue-300 border-blue-600 dark:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900"
                      >
                        View
                      </Button>
                      {order.status !== 'Completed' && (
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<CheckCircle size={16} />}
                          onClick={() => handleMarkAsProcessed(order.id)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          {getActionButtonText(order.status)}
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

      {/* Order Detail Dialog */}
      <OrderDetailDialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        order={selectedOrder}
      />
    </PharmacistPageContainer>
  );
} 
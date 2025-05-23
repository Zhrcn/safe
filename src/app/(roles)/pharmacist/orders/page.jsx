'use client';

import { Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Card, CardContent, Button, TextField, InputAdornment } from '@mui/material';
import { ShoppingCart, Search, Eye, CheckCircle } from 'lucide-react';
import { useState } from 'react';

// Mock Orders Data for Pharmacist (replace with actual data fetching)
const mockPharmacistOrders = [
  { id: 201, items: 'Item A (50 units), Item B (100 units)', date: '2024-06-18', status: 'Processing' },
  { id: 202, items: 'Item C (20 units)', date: '2024-06-19', status: 'Pending' },
  { id: 203, items: 'Item A (30 units), Item D (50 units)', date: '2024-06-17', status: 'Completed' },
  { id: 204, items: 'Item E (100 units)', date: '2024-06-20', status: 'Pending' },
];

export default function PharmacistOrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = mockPharmacistOrders.filter(order =>
    order.items.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.toString().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (orderId) => {
    console.log('View Order Details for ID:', orderId);
    // Implement logic to view order details (e.g., open modal)
  };

  const handleMarkAsProcessed = (orderId) => {
    console.log('Mark as Processed for ID:', orderId);
    // Implement logic to update order status (API call)
    // In a real app, you would likely refetch or update the state to reflect the change
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3 }} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-md min-h-[80vh]">
        <Typography variant="h4" gutterBottom className="text-gray-900 dark:text-white font-bold">
          Order Management
        </Typography>
        <Typography paragraph className="text-gray-700 dark:text-gray-300 mb-6">
          View and manage medication orders.
        </Typography>

        <Card className="shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardContent>
            <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-4 sm:space-y-0">
              <Typography variant="h5" component="h1" className="font-bold text-gray-900 dark:text-white">Medication Orders</Typography>
              <Box className="w-full sm:w-auto">
                <TextField
                  variant="outlined"
                  size="small"
                  placeholder="Search Orders"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                   className="w-full sm:w-auto"
                   InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search size={20} className="text-gray-500 dark:text-gray-400"/>
                      </InputAdornment>
                    ),
                    className: 'text-gray-900 dark:text-white',
                  }}
                  InputLabelProps={{
                     style: { color: 'inherit' },
                  }}
                   sx={{
                      '& .MuiOutlinedInput-root': {
                          fieldset: { borderColor: '#d1d5db' },
                          '&:hover fieldset': { borderColor: '#9ca3af' },
                           '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                            '& .MuiOutlinedInput-notchedOutline': {
                                 borderColor: '#4b5563',
                           },
                           '&:hover .MuiOutlinedInput-notchedOutline': {
                                 borderColor: '#6b7280',
                           },
                           '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                 borderColor: '#60a5fa',
                           },
                      },
                       '& .MuiInputBase-input::placeholder': {
                           color: '#9ca3af',
                           opacity: 1,
                           '.dark & ': {
                                color: '#6b7280',
                           },
                       },
                       '& .MuiInputLabel-outlined': {
                            color: '#6b7280',
                             '.dark & ': {
                                 color: '#9ca3af',
                           },
                       },
                   }}
                />
              </Box>
            </Box>

            <TableContainer component={Paper} elevation={2} className="bg-white dark:bg-gray-700 rounded-md">
              <Table>
                <TableHead>
                  <TableRow className="bg-gray-100 dark:bg-gray-600">
                    <TableCell className="text-gray-800 dark:text-gray-200 font-semibold">Order ID</TableCell>
                    <TableCell className="text-gray-800 dark:text-gray-200 font-semibold">Items</TableCell>
                    <TableCell className="text-gray-800 dark:text-gray-200 font-semibold">Date</TableCell>
                     <TableCell className="text-gray-800 dark:text-gray-200 font-semibold">Status</TableCell>
                    <TableCell align="right" className="text-gray-800 dark:text-gray-200 font-semibold">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" className="text-gray-700 dark:text-gray-300">
                        No orders found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((order) => (
                      <TableRow
                        key={order.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
                      >
                        <TableCell className="text-gray-900 dark:text-gray-100 flex items-center">
                           <ShoppingCart size={20} className="mr-2 text-gray-600 dark:text-gray-300"/>
                           {order.id}
                        </TableCell>
                        <TableCell className="text-gray-900 dark:text-gray-100">{order.items}</TableCell>
                        <TableCell className="text-gray-900 dark:text-gray-100">{order.date}</TableCell>
                         <TableCell className={`text-gray-900 dark:text-gray-100 ${order.status === 'Pending' ? 'text-yellow-600 dark:text-yellow-300' : order.status === 'Processing' ? 'text-blue-600 dark:text-blue-300' : 'text-green-600 dark:text-green-300'}`}>
                           {order.status}
                        </TableCell>
                        <TableCell align="right" className="space-x-2">
                           <Button
                              variant="outlined"
                              size="small"
                              startIcon={<Eye size={16} />}
                              onClick={() => handleViewDetails(order.id)}
                              className="text-blue-600 dark:text-blue-300 border-blue-600 dark:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors duration-200"
                            >
                              View
                            </Button>
                           {order.status !== 'Completed' && (
                              <Button
                                 variant="contained"
                                 size="small"
                                 startIcon={<CheckCircle size={16} />}
                                 onClick={() => handleMarkAsProcessed(order.id)}
                                 className="bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-600 text-white font-bold transition-colors duration-200"
                              >
                                 Mark as Processed
                              </Button>
                           )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

          </CardContent>
        </Card>

      </Paper>
    </Box>
  );
} 
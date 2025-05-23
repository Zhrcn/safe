'use client';

import { Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Card, CardContent, Button, TextField, InputAdornment } from '@mui/material';
import { Package, Search, AlertCircle, PlusCircle } from 'lucide-react'; // Added PlusCircle icon
import { useState } from 'react';

// Mock Inventory Data (replace with actual data fetching)
const mockInventory = [
  { id: 1, name: 'Amoxicillin (500mg)', stock: 150, lowStockThreshold: 50 },
  { id: 2, name: 'Lisinopril (10mg)', stock: 30, lowStockThreshold: 40 },
  { id: 3, name: 'Ibuprofen (200mg)', stock: 250, lowStockThreshold: 100 },
  { id: 4, name: 'Aspirin (81mg)', stock: 80, lowStockThreshold: 50 },
  { id: 5, name: 'Cetirizine (10mg)', stock: 45, lowStockThreshold: 30 }, // Another low stock example
];

export default function PharmacistInventoryPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInventory = mockInventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddItem = () => {
    console.log('Add New Item clicked');
    // Implement logic to add new inventory item (e.g., open a modal/form)
  };

  const handleEditItem = (itemId) => {
    console.log('Edit Item clicked for ID:', itemId);
    // Implement logic to edit inventory item
  };

  // Function to determine row color based on stock level
  const getRowClassName = (item) => {
    if (item.stock <= item.lowStockThreshold) {
      return 'bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800'; // Highlight low stock
    }
    return 'hover:bg-gray-50 dark:hover:bg-gray-600'; // Default hover effect
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3 }} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-md min-h-[80vh]"> {/* Theme-aware background, shadow, and minimum height */}
        <Typography variant="h4" gutterBottom className="text-gray-900 dark:text-white font-bold"> {/* Theme-aware text color */}
          Inventory Management
        </Typography>
        <Typography paragraph className="text-gray-700 dark:text-gray-300 mb-6"> {/* Theme-aware text color */}
          Manage current medication stock and monitor low inventory items.
        </Typography>

        <Card className="shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"> {/* Theme-aware card styles */}
          <CardContent>
            <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-4 sm:space-y-0"> {/* Responsive layout and spacing */}
              <Typography variant="h5" component="h1" className="font-bold text-gray-900 dark:text-white">Medication Inventory</Typography> {/* Theme-aware text color */}
              <Box className="flex items-center space-x-4 w-full sm:w-auto"> {/* Responsive width */}
                <TextField
                  variant="outlined"
                  size="small"
                  placeholder="Search Inventory"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                   className="w-full sm:w-auto" // Responsive width
                   InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search size={20} className="text-gray-500 dark:text-gray-400"/> {/* Theme-aware icon color */}
                      </InputAdornment>
                    ),
                    className: 'text-gray-900 dark:text-white', // Themed input text
                  }}
                  InputLabelProps={{
                     style: { color: 'inherit' },
                  }}
                   sx={{
                      '& .MuiOutlinedInput-root': { // Style the input border
                          fieldset: { borderColor: '#d1d5db' }, // Default border
                          '&:hover fieldset': { borderColor: '#9ca3af' }, // Hover border
                           '&.Mui-focused fieldset': { borderColor: '#3b82f6' }, // Focused border
                            '& .MuiOutlinedInput-notchedOutline': { // Dark theme borders
                                 borderColor: '#4b5563',
                           },
                           '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#6b7280',
                           },
                           '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                 borderColor: '#60a5fa',
                           },
                      },
                       '& .MuiInputBase-input::placeholder': { // Themed placeholder color
                           color: '#9ca3af', // Default placeholder color
                           opacity: 1, // Ensure placeholder is visible
                           '.dark & ': { // Dark mode placeholder color
                                color: '#6b7280',
                           },
                       },
                       '& .MuiInputLabel-outlined': { // Themed label color
                            color: '#6b7280', // Default label color
                             '.dark & ': { // Dark mode label color
                                 color: '#9ca3af',
                           },
                       },
                   }}
                />
                <Button variant="contained" startIcon={<PlusCircle size={20} />} onClick={handleAddItem} className="bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-600 text-white font-bold transition-colors duration-200"> {/* Themed button with Pharmacist color */}
                  Add Item
                </Button>
              </Box>
            </Box>

            <TableContainer component={Paper} elevation={2} className="bg-white dark:bg-gray-700 rounded-md"> {/* Themed table container */}
              <Table>
                <TableHead>
                  <TableRow className="bg-gray-100 dark:bg-gray-600"> {/* Themed table header */}
                    <TableCell className="text-gray-800 dark:text-gray-200 font-semibold">Item</TableCell> {/* Themed text and font weight */}
                    <TableCell align="right" className="text-gray-800 dark:text-gray-200 font-semibold">Stock</TableCell> {/* Themed text and font weight */}
                    <TableCell align="right" className="text-gray-800 dark:text-gray-200 font-semibold">Low Stock Threshold</TableCell> {/* Themed text and font weight */}
                    <TableCell align="right" className="text-gray-800 dark:text-gray-200 font-semibold">Actions</TableCell> {/* Themed text and font weight */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredInventory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center" className="text-gray-700 dark:text-gray-300"> {/* Themed text */}
                        No inventory items found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredInventory.map((item) => (
                      <TableRow
                        key={item.id}
                        className={getRowClassName(item) + ' transition-colors duration-200'} // Apply themed row class and transition
                      >
                        <TableCell className="text-gray-900 dark:text-gray-100 flex items-center"> {/* Themed text */}
                           <Package size={20} className={`mr-2 ${item.stock <= item.lowStockThreshold ? 'text-red-600 dark:text-red-300' : 'text-gray-600 dark:text-gray-300'}`}/> {/* Themed icon based on stock */}
                           {item.name}
                        </TableCell>
                        <TableCell align="right" className={`text-gray-900 dark:text-gray-100 ${item.stock <= item.lowStockThreshold ? 'font-bold text-red-600 dark:text-red-300' : ''}`}> {/* Themed text, highlight low stock */}
                          {item.stock}
                        </TableCell>
                        <TableCell align="right" className="text-gray-900 dark:text-gray-100">{item.lowStockThreshold}</TableCell> {/* Themed text */}
                        <TableCell align="right">
                          {/* Add Edit/View buttons here */}
                           <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleEditItem(item.id)}
                              className="text-green-600 dark:text-green-300 border-green-600 dark:border-green-300 hover:bg-green-50 dark:hover:bg-green-900 transition-colors duration-200" // Themed button
                            >
                              Edit
                            </Button>
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
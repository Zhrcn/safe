'use client';

import { useState, useEffect } from 'react';
import { Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton } from '@mui/material';
import { Package, AlertCircle, PlusCircle, X } from 'lucide-react';
import { PharmacistPageContainer, PharmacistCard } from '@/components/pharmacist/PharmacistComponents';
import { SearchField } from '@/components/ui/Notification';
import { getInventory, addInventoryItem, updateInventoryItem } from '@/services/pharmacistService';

function InventoryItemDialog({ open, onClose, item, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    stock: 0,
    lowStockThreshold: 0
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setFormData(item || {
        name: '',
        stock: 0,
        lowStockThreshold: 0
      });
      setErrors({});
    }
  }, [open, item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'name' ? value : parseInt(value, 10) || 0
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (formData.stock < 0) {
      newErrors.stock = 'Stock cannot be negative';
    }

    if (formData.lowStockThreshold < 0) {
      newErrors.lowStockThreshold = 'Threshold cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle className="flex justify-between items-center">
        <Typography variant="h6" className="font-bold">
          {item?.id ? 'Edit Inventory Item' : 'Add New Inventory Item'}
        </Typography>
        <IconButton onClick={onClose}>
          <X size={20} />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box className="mt-4 space-y-4">
          <TextField
            label="Item Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            label="Current Stock"
            name="stock"
            type="number"
            value={formData.stock}
            onChange={handleChange}
            fullWidth
            error={!!errors.stock}
            helperText={errors.stock}
          />
          <TextField
            label="Low Stock Threshold"
            name="lowStockThreshold"
            type="number"
            value={formData.lowStockThreshold}
            onChange={handleChange}
            fullWidth
            error={!!errors.lowStockThreshold}
            helperText={errors.lowStockThreshold}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} className="text-muted-foreground">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          {item?.id ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function PharmacistInventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    async function loadInventory() {
      try {
        setLoading(true);
        const data = await getInventory();
        setInventory(data);
      } catch (error) {
        console.error('Error loading inventory:', error);
      } finally {
        setLoading(false);
      }
    }

    loadInventory();
  }, []);

  const filteredInventory = searchTerm
    ? inventory.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : inventory;

  const handleAddItem = () => {
    setSelectedItem(null);
    setDialogOpen(true);
  };

  const handleEditItem = (itemId) => {
    const item = inventory.find(i => i.id === itemId);
    if (item) {
      setSelectedItem(item);
      setDialogOpen(true);
    }
  };

  const handleSaveItem = async (itemData) => {
    try {
      let updatedItem;

      if (itemData.id) {
        updatedItem = await updateInventoryItem(itemData);
        setInventory(prev => prev.map(item =>
          item.id === updatedItem.id ? updatedItem : item
        ));
      } else {
        updatedItem = await addInventoryItem(itemData);
        setInventory(prev => [...prev, updatedItem]);
      }
    } catch (error) {
      console.error('Error saving inventory item:', error);
    }
  };

  const getRowClassName = (item) => {
    if (item.stock <= item.lowStockThreshold) {
      return 'bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-800/40';
    }
    return 'hover:bg-muted/40';
  };

  return (
    <PharmacistPageContainer
      title="Inventory Management"
      description="Manage current medication stock and monitor low inventory items."
    >
      <PharmacistCard
        title="Medication Inventory"
        actions={
          <>
            <SearchField
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Inventory"
            />
            <Button
              variant="contained"
              startIcon={<PlusCircle size={20} />}
              onClick={handleAddItem}
              className="bg-green-600 hover:bg-green-700 text-white font-bold"
            >
              Add Item
            </Button>
          </>
        }
      >
        <TableContainer component={Paper} elevation={2} className="bg-card rounded-md">
          <Table>
            <TableHead>
              <TableRow className="bg-muted">
                <TableCell className="text-foreground font-semibold">Item</TableCell>
                <TableCell align="right" className="text-foreground font-semibold">Stock</TableCell>
                <TableCell align="right" className="text-foreground font-semibold">Low Stock Threshold</TableCell>
                <TableCell align="right" className="text-foreground font-semibold">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" className="text-muted-foreground">
                    Loading inventory data...
                  </TableCell>
                </TableRow>
              ) : filteredInventory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" className="text-muted-foreground">
                    No inventory items found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredInventory.map((item) => (
                  <TableRow
                    key={item.id}
                    className={`${getRowClassName(item)} transition-colors duration-200`}
                  >
                    <TableCell className="text-foreground flex items-center">
                      <Package size={20} className={`mr-2 ${item.stock <= item.lowStockThreshold ? 'text-red-600 dark:text-red-300' : 'text-muted-foreground'}`} />
                      {item.name}
                    </TableCell>
                    <TableCell
                      align="right"
                      className={`text-foreground ${item.stock <= item.lowStockThreshold ? 'font-bold text-red-600 dark:text-red-300' : ''}`}
                    >
                      {item.stock}
                    </TableCell>
                    <TableCell align="right" className="text-foreground">{item.lowStockThreshold}</TableCell>
                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleEditItem(item.id)}
                        className="text-green-600 dark:text-green-300 border-green-600 dark:border-green-300 hover:bg-green-50 dark:hover:bg-green-900"
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
      </PharmacistCard>

      <InventoryItemDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        item={selectedItem}
        onSave={handleSaveItem}
      />
    </PharmacistPageContainer>
  );
} 
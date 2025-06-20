'use client';
import { useState, useEffect } from 'react';
import { Package, AlertCircle, PlusCircle, X, Edit, Trash2 } from 'lucide-react';
import { PharmacistPageContainer, PharmacistCard } from '@/components/pharmacist/PharmacistComponents';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{item?.id ? 'Edit Inventory Item' : 'Add New Inventory Item'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Item Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="col-span-3"
            />
            {errors.name && <p className="col-span-4 text-sm text-red-500 text-right">{errors.name}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="stock" className="text-right">Current Stock</Label>
            <Input
              id="stock"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              className="col-span-3"
            />
            {errors.stock && <p className="col-span-4 text-sm text-red-500 text-right">{errors.stock}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lowStockThreshold" className="text-right">Low Stock Threshold</Label>
            <Input
              id="lowStockThreshold"
              name="lowStockThreshold"
              type="number"
              value={formData.lowStockThreshold}
              onChange={handleChange}
              className="col-span-3"
            />
            {errors.lowStockThreshold && <p className="col-span-4 text-sm text-red-500 text-right">{errors.lowStockThreshold}</p>}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit}>{item?.id ? 'Update' : 'Add'}</Button>
        </DialogFooter>
      </DialogContent>
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
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Search Inventory"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Button onClick={handleAddItem}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>
        }
      >
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-right">Low Stock Threshold</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    Loading inventory data...
                  </TableCell>
                </TableRow>
              ) : filteredInventory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No inventory items found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredInventory.map((item) => (
                  <TableRow
                    key={item.id}
                    className={getRowClassName(item)}
                  >
                    <TableCell className="font-medium flex items-center">
                      <Package className="mr-2 h-5 w-5 text-gray-600" />
                      {item.name}
                    </TableCell>
                    <TableCell className="text-right">{item.stock}</TableCell>
                    <TableCell className="text-right">
                      {item.lowStockThreshold}
                      {item.stock <= item.lowStockThreshold && (
                        <AlertCircle className="ml-2 inline-block h-4 w-4 text-red-500" />
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditItem(item.id)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        {}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
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
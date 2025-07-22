import React, { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { addInventoryItem } from '@/services/pharmacistService';

export default function AddInventoryDialog({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', stock: 1, lowStockThreshold: 5, unit: '', category: '', manufacturer: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: (type === 'number' || name === 'stock' || name === 'lowStockThreshold') ? (value === '' ? 1 : Number(value)) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!form.stock || isNaN(form.stock) || form.stock < 1) {
      setError('Stock must be at least 1.');
      setLoading(false);
      return;
    }
    try {
      const data = {
        name: form.name,
        stock: Number(form.stock),
        lowStockThreshold: Number(form.lowStockThreshold),
        unit: form.unit,
        category: form.category,
        manufacturer: form.manufacturer
      };
      console.log('Submitting inventory:', data);
      await addInventoryItem(data);
      setOpen(false);
      setForm({ name: '', stock: 1, lowStockThreshold: 5, unit: '', category: '', manufacturer: '' });
      if (onAdd) onAdd();
    } catch (err) {
      setError('Failed to add inventory item.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="glass" size="sm" className="border-primary text-primary hover:bg-primary/10">
          + Add Inventory
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Inventory Item</DialogTitle>
          <DialogDescription>Fill in the details to add a new inventory item.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input name="name" value={form.name} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Stock</label>
              <input name="stock" type="number" min="1" value={form.stock || 1} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Low Stock Threshold</label>
              <input name="lowStockThreshold" type="number" min="0" value={form.lowStockThreshold || 5} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Unit</label>
              <input name="unit" value={form.unit} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Category</label>
              <input name="category" value={form.category} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Manufacturer</label>
            <input name="manufacturer" value={form.manufacturer} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <DialogFooter>
            <Button type="submit" variant="success" loading={loading} disabled={loading}>Add</Button>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 
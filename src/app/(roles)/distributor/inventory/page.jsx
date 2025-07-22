"use client";
import React, { useEffect, useState } from 'react';
import { getDistributorProfile, updateDistributorInventory } from '@/store/services/distributorApi';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { ClipboardList, Plus, Trash2 } from 'lucide-react';

export default function DistributorInventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newItem, setNewItem] = useState({ medicine: '', quantity: 0, price: 0 });

  useEffect(() => {
    getDistributorProfile()
      .then(res => setInventory(res.data.data.inventory || []))
      .catch(() => setError('Failed to load inventory'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (idx, field, value) => {
    setInventory(inv => inv.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };

  const handleRemove = idx => {
    setInventory(inv => inv.filter((_, i) => i !== idx));
  };

  const handleAdd = () => {
    if (!newItem.medicine || newItem.quantity < 0 || newItem.price < 0) return;
    setInventory(inv => [...inv, newItem]);
    setNewItem({ medicine: '', quantity: 0, price: 0 });
  };

  const handleSave = async () => {
    setSuccess('');
    setError('');
    try {
      await updateDistributorInventory(inventory);
      setSuccess('Inventory updated!');
    } catch {
      setError('Failed to update inventory.');
    }
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-xl">
        <CardHeader className="flex flex-row items-center gap-4 p-6">
          <ClipboardList className="w-8 h-8 text-secondary" />
          <CardTitle className="text-2xl font-bold">Inventory Management</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center text-muted-foreground py-8">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Medicine/Package</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Remove</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        <input
                          type="text"
                          value={item.medicine?.name || item.medicine || ''}
                          onChange={e => handleChange(idx, 'medicine', e.target.value)}
                          required
                          className="border rounded px-2 py-1 w-full"
                        />
                      </TableCell>
                      <TableCell>
                        <input
                          type="number"
                          min={0}
                          value={item.quantity}
                          onChange={e => handleChange(idx, 'quantity', e.target.value)}
                          required
                          className="border rounded px-2 py-1 w-full"
                        />
                      </TableCell>
                      <TableCell>
                        <input
                          type="number"
                          min={0}
                          value={item.price}
                          onChange={e => handleChange(idx, 'price', e.target.value)}
                          required
                          className="border rounded px-2 py-1 w-full"
                        />
                      </TableCell>
                      <TableCell>
                        <button onClick={() => handleRemove(idx)} className="text-red-500 hover:text-red-700"><Trash2 className="w-5 h-5" /></button>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell>
                      <input
                        type="text"
                        placeholder="New medicine/package"
                        value={newItem.medicine}
                        onChange={e => setNewItem({ ...newItem, medicine: e.target.value })}
                        className="border rounded px-2 py-1 w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        type="number"
                        min={0}
                        value={newItem.quantity}
                        onChange={e => setNewItem({ ...newItem, quantity: e.target.value })}
                        className="border rounded px-2 py-1 w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        type="number"
                        min={0}
                        value={newItem.price}
                        onChange={e => setNewItem({ ...newItem, price: e.target.value })}
                        className="border rounded px-2 py-1 w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <button type="button" onClick={handleAdd} className="text-green-600 hover:text-green-800"><Plus className="w-5 h-5" /></button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <button onClick={handleSave} className="mt-4 px-6 py-2 rounded bg-primary text-white hover:bg-primary/90">Save Inventory</button>
              {success && <div className="text-green-600 mt-2">{success}</div>}
              {error && <div className="text-red-500 mt-2">{error}</div>}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 
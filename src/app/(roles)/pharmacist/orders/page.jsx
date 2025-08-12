'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { ShoppingCart, Eye, CheckCircle, X, Search } from 'lucide-react';
import {
  PharmacistPageContainer,
  PharmacistCard,
} from '@/components/pharmacist/PharmacistComponents';
import { getOrders, getInventory, updateInventoryItem, addInventoryItem, updateOrderStatus, getDistributors, getMedicineById, deleteOrder } from '@/services/pharmacistService';
import axiosInstance from '@/store/services/axiosInstance';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/Dialog';
import { createOrder } from '@/store/services/orderApi';

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
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Order ID</p>
              <p className="font-semibold text-base">{order.id}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Date</p>
              <p className="text-base">{order.createdAt ? new Date(order.createdAt).toLocaleString() : order.date}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-muted-foreground">Status</p>
              <StatusChip status={order.status} />
            </div>
            <div className="col-span-2">
              <p className="text-xs text-muted-foreground mb-1">Distributor</p>
              <div className="bg-muted rounded-lg p-3">
                {order.distributor ? (
                  <div className="space-y-1">
                    <div><span className="font-semibold">{order.distributor.companyName || order.distributor.name}</span></div>
                    {order.distributor.contactName && <div>Contact: {order.distributor.contactName}</div>}
                    {order.distributor.contactEmail && <div>Email: {order.distributor.contactEmail}</div>}
                    {order.distributor.contactPhone && <div>Phone: {order.distributor.contactPhone}</div>}
                    {order.distributor.address && <div>Address: {order.distributor.address}</div>}
                  </div>
                ) : <span className="text-muted-foreground">No distributor info</span>}
              </div>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-muted-foreground mb-1">Items</p>
              <div className="bg-muted rounded-lg p-3">
                {order.items && Array.isArray(order.items)
                  ? order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between py-1 border-b last:border-b-0 border-border"
                      >
                        <span className="font-medium">
                          {item.medicine?.name || (typeof item.medicine === 'string' ? item.medicine : '') || 'Unknown'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Qty: <span className="font-semibold">{item.quantity}</span>
                          {item.price !== undefined && (
                            <>
                              {' '}
                              | Price: <span className="font-semibold">{item.price}</span>
                            </>
                          )}
                        </span>
                      </div>
                    ))
                  : <span className="text-muted-foreground">No items</span>}
              </div>
            </div>
            {order.notes && (
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground mb-1">Notes</p>
                <div className="bg-muted rounded-lg p-3 text-sm">{order.notes}</div>
              </div>
            )}
            {order.responseMessage && (
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground mb-1">Response Message</p>
                <div className="bg-muted rounded-lg p-3 text-sm">{order.responseMessage}</div>
              </div>
            )}
            {order.driver && (
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground mb-1">Driver</p>
                <div className="bg-muted rounded-lg p-3 text-sm">{order.driver}</div>
              </div>
            )}
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
  const [completingOrderId, setCompletingOrderId] = useState(null);
  const [completeError, setCompleteError] = useState(null);
  const [newOrderLoading, setNewOrderLoading] = useState(false);
  const [newOrderError, setNewOrderError] = useState(null);
  const [distributors, setDistributors] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [orderForm, setOrderForm] = useState({ distributorId: '', items: [], notes: '' });
  const [itemDraft, setItemDraft] = useState({ medicineId: '', quantity: 1 });
  const [medicineNames, setMedicineNames] = useState({});
  const [medicines, setMedicines] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  const fetchMedicineName = useCallback(async (id) => {
    if (!id || medicineNames[id]) return;
    try {
      const med = await getMedicineById(id);
      setMedicineNames(prev => ({ ...prev, [id]: med?.name || 'Unknown' }));
    } catch {
      setMedicineNames(prev => ({ ...prev, [id]: 'Unknown' }));
    }
  }, [medicineNames]);

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

  useEffect(() => {
    if (addOrderDialogOpen) {
      setNewOrderError(null);
      setOrderForm({ distributorId: '', items: [], notes: '' });
      setItemDraft({ medicineId: '', quantity: 1 });
      (async () => {
        try {
          const d = await getDistributors();
          setDistributors(d.data || d);
          const response = await axiosInstance.get('/medicines');
          setMedicines(response.data.data || response.data);
        } catch (err) {
          setNewOrderError('Failed to load distributors or medicines');
        }
      })();
    }
  }, [addOrderDialogOpen]);

  const filteredOrders = useMemo(() => {
    if (!searchTerm) return orders;
    const lower = searchTerm.toLowerCase();
    return orders.filter(order => {
      const itemsString = order.items && Array.isArray(order.items)
        ? order.items.map(item => item.medicine?.name || '').join(' ').toLowerCase()
        : '';
      const distributorString = order.distributor?.name?.toLowerCase?.() || '';
      return (
        itemsString.includes(lower) ||
        distributorString.includes(lower) ||
        (order.id && order.id.toString().includes(lower))
      );
    });
  }, [orders, searchTerm]);

  const handleViewDetails = useCallback((orderId) => {
    const order = orders.find(o => (o.id || o._id) === orderId);
    setSelectedOrder(order);
    setDetailDialogOpen(true);
  }, [orders]);

  async function completeOrder(order) {
    setCompletingOrderId(order.id || order._id);
    setCompleteError(null);
    try {
      await updateOrderStatus(order.id || order._id, 'completed');
      const inventory = await getInventory();
      for (const item of order.items || []) {
        const medicineName = item.medicine?.name?.trim().toLowerCase();
        const genericName = item.medicine?.genericName?.trim().toLowerCase();
        const category = item.medicine?.category?.trim().toLowerCase();
        if (!medicineName) continue;
        const existing = inventory.find(inv =>
          inv.name?.trim().toLowerCase() === medicineName &&
          (genericName ? inv.genericName?.trim().toLowerCase() === genericName : true) &&
          (category ? inv.category?.trim().toLowerCase() === category : true)
        );
        if (existing) {
          await updateInventoryItem({
            ...existing,
            stock: (existing.stock || 0) + (item.quantity || 0),
          });
        } else {
          await addInventoryItem({
            name: item.medicine?.name || 'Unknown',
            genericName: item.medicine?.genericName || '',
            category: item.medicine?.category || '',
            stock: item.quantity || 0,
            lowStockThreshold: 0,
          });
        }
      }
      await loadOrders();
    } catch (err) {
      setCompleteError('Failed to complete order: ' + (err?.message || err));
    } finally {
      setCompletingOrderId(null);
    }
  }

  const handleDeleteOrder = async () => {
    if (!orderToDelete) return;
    setDeleteError(null);
    try {
      await deleteOrder(orderToDelete);
      setDeleteDialogOpen(false);
      setOrderToDelete(null);
      await loadOrders();
    } catch (err) {
      setDeleteError('Failed to delete order: ' + (err?.message || err));
    }
  };

  const handleAddItem = () => {
    if (!itemDraft.medicineId || !itemDraft.quantity) return;
    const medicine = medicines.find(m => m._id === itemDraft.medicineId);
    if (!medicine) return;
    setOrderForm(f => ({
      ...f,
      items: [
        ...f.items,
        {
          medicine: medicine,
          medicineId: medicine._id,
          medicineName: medicine.name,
          quantity: itemDraft.quantity
        }
      ],
    }));
    setItemDraft({ medicineId: '', quantity: 1 });
  };

  const handleRemoveItem = idx => {
    setOrderForm(f => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));
  };

  const handleCreateOrder = async () => {
    setNewOrderLoading(true);
    setNewOrderError(null);
    try {
      if (!orderForm.distributorId || orderForm.items.length === 0) {
        setNewOrderError('Please select a distributor and add at least one item.');
        setNewOrderLoading(false);
        return;
      }
      const payload = {
        distributorId: orderForm.distributorId,
        items: orderForm.items.map(i => ({ medicine: i.medicineId, quantity: i.quantity })),
        notes: orderForm.notes,
      };
      console.log('Order payload:', payload);
      await createOrder(payload);
      setAddOrderDialogOpen(false);
      await loadOrders();
    } catch (err) {
      setNewOrderError('Failed to create order: ' + (err?.message || err));
    } finally {
      setNewOrderLoading(false);
    }
  };

  return (
    <PharmacistPageContainer>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-1 tracking-tight">My Orders</h1>
          <p className="text-muted-foreground text-base">Manage and track your medication orders to distributors.</p>
        </div>
        <Button
          onClick={() => setAddOrderDialogOpen(true)}
          variant="primary"
          size="lg"
          className="shadow-md"
        >
          <span className="text-lg font-semibold">+ New Order</span>
        </Button>
      </div>
      <div className="mb-6 flex items-center gap-4">
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
      <PharmacistCard className="p-4 overflow-x-auto">
        <table className="w-full text-sm relative min-w-max">
          <thead className="sticky top-0 bg-white z-20">
            <tr>
              <th className="font-semibold text-sm py-3 px-4 sticky top-0 bg-white z-20 text-left">Order ID</th>
              <th className="font-semibold text-sm py-3 px-4 sticky top-0 bg-white z-20 text-left">Items</th>
              <th className="font-semibold text-sm py-3 px-4 sticky top-0 bg-white z-20 text-left">Date</th>
              <th className="font-semibold text-sm py-3 px-4 sticky top-0 bg-white z-20 text-left">Distributor</th>
              <th className="font-semibold text-sm py-3 px-4 sticky top-0 bg-white z-20 text-left">Status</th>
              <th className="font-semibold text-sm py-3 px-2 sticky top-0 bg-white z-20 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} align="center" className="py-12 text-center text-muted-foreground px-4">
                  <div className="flex flex-col items-center gap-2">
                    <span className="animate-spin text-primary">
                      <ShoppingCart size={28} />
                    </span>
                    <span className="text-base">Loading orders...</span>
                  </div>
                </td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={6} align="center" className="py-12 text-center text-muted-foreground px-4">
                  <div className="flex flex-col items-center gap-2">
                    <X size={32} className="text-muted-foreground" />
                    <span className="text-base">No orders found.</span>
                  </div>
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id || order._id} className="hover:bg-primary/5 transition group">
                  <td className="flex items-center gap-2 font-medium py-4 px-4">
                    <span className="inline-flex items-center justify-center rounded-full bg-primary/10 text-primary w-8 h-8 mr-2 group-hover:bg-primary/20 transition">
                      <ShoppingCart size={18} />
                    </span>
                    <span className="tracking-wide">{order.id || order._id}</span>
                  </td>
                  <td className="max-w-xs truncate py-4 px-4">
                    {order.items && Array.isArray(order.items)
                      ? order.items.map((item, idx) => {
                          let displayName = 'Unknown';
                          if (item.medicine && typeof item.medicine === 'object') {
                            displayName = item.medicine.name || 'Unknown';
                          } else if (typeof item.medicine === 'string') {
                            displayName = medicineNames[item.medicine] || item.medicine;
                            if (!medicineNames[item.medicine]) fetchMedicineName(item.medicine);
                          }
                          return (
                            <span key={idx}>
                              {displayName} <span className="text-xs text-muted-foreground">({item.quantity})</span>
                              {idx < order.items.length - 1 ? ', ' : ''}
                            </span>
                          );
                        })
                      : <span className="text-muted-foreground">-</span>}
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-mono text-sm">{order.createdAt ? new Date(order.createdAt).toLocaleString() : order.date}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col text-xs">
                      <span className="font-semibold">{order.distributor?.companyName || order.distributor?.name || '-'}</span>
                      {order.distributor?.contactName && <span>{order.distributor.contactName}</span>}
                      {order.distributor?.contactEmail && <span>{order.distributor.contactEmail}</span>}
                      {order.distributor?.contactPhone && <span>{order.distributor.contactPhone}</span>}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <StatusChip status={order.status} />
                  </td>
                  <td align="right" className="py-4 px-2">
                    <Button
                      className="mr-2"
                      variant="outline"
                      onClick={() => handleViewDetails(order.id || order._id)}
                      size="sm"
                    >
                      <Eye size={16} className="mr-2" />
                      View
                    </Button>
                    {order.status === 'accepted' && (
                      <Button
                        variant="success"
                        size="sm"
                        disabled={!!completingOrderId}
                        onClick={() => completeOrder(order)}
                      >
                        {completingOrderId === (order.id || order._id) ? 'Completing...' : 'Complete'}
                      </Button>
                    )}
                    {order.status === 'pending' && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setOrderToDelete(order.id || order._id);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        Delete
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {completeError && (
          <div className="text-red-500 text-sm mt-2">{completeError}</div>
        )}
      </PharmacistCard>
      <OrderDetailDialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        order={selectedOrder}
      />
      <Dialog open={addOrderDialogOpen} onOpenChange={setAddOrderDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>New Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Distributor</label>
              <select
                className="w-full border rounded px-2 py-1"
                value={orderForm.distributorId}
                onChange={e => setOrderForm(f => ({ ...f, distributorId: e.target.value }))}
              >
                <option value="">Select distributor</option>
                {distributors.map(d => (
                  <option key={d.id || d._id} value={d.id || d._id}>
                    {d.companyName || d.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Add Item</label>
              <div className="flex gap-2">
                <select
                  className="flex-1 border rounded px-2 py-1"
                  value={itemDraft.medicineId}
                  onChange={e => setItemDraft(d => ({ ...d, medicineId: e.target.value }))}
                >
                  <option value="">Select medicine</option>
                  {medicines.map(m => (
                    <option key={m._id} value={m._id}>
                      {m.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min={1}
                  className="w-20 border rounded px-2 py-1"
                  value={itemDraft.quantity}
                  onChange={e => setItemDraft(d => ({ ...d, quantity: Number(e.target.value) }))}
                />
                <Button type="button" variant="outline" onClick={handleAddItem}>
                  Add
                </Button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Order Items</label>
              {orderForm.items.length === 0 ? (
                <div className="text-muted-foreground text-sm">No items added.</div>
              ) : (
                <ul className="space-y-1">
                  {orderForm.items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span>
                        {item.medicineName || item.medicine?.name || 'Unknown'}
                        {item.medicine?.genericName && (
                          <> | <span className="text-muted-foreground">{item.medicine.genericName}</span></>
                        )}
                        {item.medicine?.category && (
                          <> | <span className="text-muted-foreground">{item.medicine.category}</span></>
                        )}
                        (Qty: {item.quantity})
                      </span>
                      <Button type="button" size="xs" variant="destructive" onClick={() => handleRemoveItem(idx)}>
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea
                className="w-full border rounded px-2 py-1"
                value={orderForm.notes}
                onChange={e => setOrderForm(f => ({ ...f, notes: e.target.value }))}
                rows={2}
              />
            </div>
            {newOrderError && <div className="text-red-500 text-sm">{newOrderError}</div>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOrderDialogOpen(false)} disabled={newOrderLoading}>
              Cancel
            </Button>
            <Button onClick={handleCreateOrder} loading={newOrderLoading}>
              Create Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Order</DialogTitle>
          </DialogHeader>
          <div>Are you sure you want to delete this pending order?</div>
          {deleteError && <div className="text-red-500 text-sm mt-2">{deleteError}</div>}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteOrder}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PharmacistPageContainer>
  );
}

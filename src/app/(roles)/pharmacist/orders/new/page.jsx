import React, { useEffect, useState } from 'react';
import { getAllDistributors } from '@/store/services/distributorApi';
import { createOrder } from '@/store/services/orderApi';

export default function NewOrderPage() {
  const [distributors, setDistributors] = useState([]);
  const [selectedDistributor, setSelectedDistributor] = useState('');
  const [items, setItems] = useState([{ medicine: '', quantity: 1, price: 0 }]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getAllDistributors()
      .then(res => setDistributors(res.data.data))
      .catch(() => setError('Failed to load distributors'));
  }, []);

  const handleItemChange = (idx, field, value) => {
    setItems(items => items.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };

  const addItem = () => setItems([...items, { medicine: '', quantity: 1, price: 0 }]);
  const removeItem = idx => setItems(items => items.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    if (!selectedDistributor || items.some(item => !item.medicine || !item.quantity)) {
      setError('Please select a distributor and fill all item fields.');
      setLoading(false);
      return;
    }
    try {
      await createOrder({ distributorId: selectedDistributor, items, notes });
      setSuccess('Order placed successfully!');
      setItems([{ medicine: '', quantity: 1, price: 0 }]);
      setSelectedDistributor('');
      setNotes('');
    } catch (err) {
      setError('Failed to place order.');
    }
    setLoading(false);
  };

  return (
    <div>
      <h1>New Order to Distributor</h1>
      <form onSubmit={handleSubmit}>
        <label>Distributor:
          <select value={selectedDistributor} onChange={e => setSelectedDistributor(e.target.value)} required>
            <option value="">Select distributor</option>
            {distributors.map(d => (
              <option key={d._id} value={d._id}>{d.companyName || d.user?.email}</option>
            ))}
          </select>
        </label>
        <h3>Order Items</h3>
        {items.map((item, idx) => (
          <div key={idx} style={{ marginBottom: 8 }}>
            <input
              type="text"
              placeholder="Medicine/package name"
              value={item.medicine}
              onChange={e => handleItemChange(idx, 'medicine', e.target.value)}
              required
            />
            <input
              type="number"
              min={1}
              placeholder="Quantity"
              value={item.quantity}
              onChange={e => handleItemChange(idx, 'quantity', e.target.value)}
              required
            />
            <input
              type="number"
              min={0}
              placeholder="Price"
              value={item.price}
              onChange={e => handleItemChange(idx, 'price', e.target.value)}
            />
            {items.length > 1 && <button type="button" onClick={() => removeItem(idx)}>-</button>}
          </div>
        ))}
        <button type="button" onClick={addItem}>Add Item</button>
        <br />
        <label>Notes:
          <textarea value={notes} onChange={e => setNotes(e.target.value)} />
        </label>
        <br />
        <button type="submit" disabled={loading}>Submit Order</button>
      </form>
      {success && <div style={{ color: 'green' }}>{success}</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
} 
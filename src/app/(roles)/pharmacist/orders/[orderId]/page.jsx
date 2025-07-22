import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getOrderById, cancelOrder } from '@/store/services/orderApi';

export default function OrderDetailPage() {
  const router = useRouter();
  const { orderId } = router.query;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!orderId) return;
    getOrderById(orderId)
      .then(res => setOrder(res.data.data))
      .catch(() => setError('Failed to load order'))
      .finally(() => setLoading(false));
  }, [orderId]);

  const handleCancel = async () => {
    if (!orderId) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await cancelOrder(orderId);
      setSuccess('Order cancelled.');
      setOrder({ ...order, status: 'cancelled' });
    } catch {
      setError('Failed to cancel order.');
    }
    setLoading(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!order) return <div>Order not found.</div>;

  return (
    <div>
      <h1>Order Details</h1>
      <p><b>ID:</b> {order._id}</p>
      <p><b>Status:</b> {order.status}</p>
      <p><b>Distributor:</b> {order.distributor?.companyName || order.distributor?.user?.email}</p>
      <p><b>Created:</b> {new Date(order.createdAt).toLocaleString()}</p>
      <h3>Items</h3>
      <ul>
        {order.items.map((item, idx) => (
          <li key={idx}>
            {item.medicine?.name || item.medicine || 'Unknown'} - Qty: {item.quantity} - Price: {item.price}
          </li>
        ))}
      </ul>
      <p><b>Notes:</b> {order.notes}</p>
      {order.status === 'pending' && (
        <button onClick={handleCancel} disabled={loading}>Cancel Order</button>
      )}
      {success && <div style={{ color: 'green' }}>{success}</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
} 
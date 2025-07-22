import React, { useEffect, useState } from 'react';
import { getPharmacistOrders } from '@/store/services/orderApi';
import Link from 'next/link';

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getPharmacistOrders()
      .then(res => setOrders(res.data.data))
      .catch(() => setError('Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h1>Order History</h1>
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>ID</th>
            <th>Distributor</th>
            <th>Status</th>
            <th>Created</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.distributor?.companyName || order.distributor?.user?.email}</td>
              <td>{order.status}</td>
              <td>{new Date(order.createdAt).toLocaleString()}</td>
              <td>
                <Link href={`/app/(roles)/pharmacist/orders/${order._id}`}>View</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 
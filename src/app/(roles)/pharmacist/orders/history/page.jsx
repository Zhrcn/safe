import { getPharmacistOrders } from '@/store/services/orderApi';
import Link from 'next/link';

export default async function OrderHistoryPage() {
  let orders = [];
  let error = '';

  try {
    const res = await getPharmacistOrders();
    orders = res.data.data;
  } catch (e) {
    error = 'Failed to load orders';
  }

  if (error) {
    return <div style={{ color: 'red' }}>Failed to load orders</div>;
  }
}
import axios from './axiosInstance';

export const createOrder = (data) => axios.post('/orders', data);
export const getPharmacistOrders = () => axios.get('/orders');
export const getOrderById = (orderId) => axios.get(`/orders/${orderId}`);
export const cancelOrder = (orderId) => axios.patch(`/orders/${orderId}/cancel`); 
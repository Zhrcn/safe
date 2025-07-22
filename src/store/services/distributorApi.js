import axios from './axiosInstance';

export const getAllDistributors = () => axios.get('/distributors');
export const getDistributorProfile = () => axios.get('/distributors/profile');
export const updateDistributorProfile = (data) => axios.patch('/distributors/profile', data);
export const updateDistributorInventory = (inventory) => axios.patch('/distributors/inventory', { inventory });
export const getDistributorOrders = () => axios.get('/orders/distributor');
export const updateOrderStatus = (orderId, status, responseMessage) => axios.patch(`/orders/distributor/${orderId}/status`, { status, responseMessage });
export const sendOrderToDriver = (orderId, driverId) => axios.patch(`/orders/distributor/${orderId}/send-to-driver`, { driverId }); 
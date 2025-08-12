const Order = require('../models/Order');
const Distributor = require('../models/Distributor');
const Pharmacist = require('../models/Pharmacist');
const ApiResponse = require('../utils/apiResponse');
const Medicine = require('../models/Medicine');
const { createNotification } = require('../utils/notification.utils');

exports.createOrder = async (req, res) => {
  try {
    const { distributorId, pharmacistId, items, notes } = req.body;
    let distributor, pharmacist;

    if (req.user.role === 'pharmacist') {
      pharmacist = await Pharmacist.findOne({ user: req.user._id });
      distributor = await Distributor.findById(distributorId);
    } else if (req.user.role === 'distributor') {
      distributor = await Distributor.findOne({ user: req.user._id });
      pharmacist = await Pharmacist.findById(pharmacistId);
    }

    if (!pharmacist) {
      return res.status(404).json(new ApiResponse(404, null, 'Pharmacist not found'));
    }
    if (!distributor) {
      return res.status(404).json(new ApiResponse(404, null, 'Distributor not found'));
    }

    const order = await Order.create({
      pharmacist: pharmacist._id,
      distributor: distributor._id,
      items,
      notes
    });
    if (distributor.user) {
      await createNotification(
        distributor.user.toString(),
        'New Order Received',
        `A new order has been placed by a pharmacist.`,
        'general',
        order._id.toString(),
        'Order'
      );
    }
    res.status(201).json(new ApiResponse(201, order, 'Order created successfully.'));
  } catch (err) {
    res.status(500).json(new ApiResponse(500, null, 'Server error'));
  }
};

exports.getPharmacistOrders = async (req, res) => {
  try {
    const pharmacist = await Pharmacist.findOne({ user: req.user._id });
    if (!pharmacist) {
      return res.status(404).json(new ApiResponse(404, null, 'Pharmacist not found'));
    }
    let orders = await Order.find({ pharmacist: pharmacist._id }).populate('distributor items.medicine');
    for (const order of orders) {
      for (const item of order.items) {
        if (!item.medicine || !item.medicine.name) {
          const medDoc = await Medicine.findById(item.medicine);
          if (medDoc) item.medicine = medDoc;
        }
      }
    }
    res.status(200).json(new ApiResponse(200, orders, 'Orders fetched successfully.'));
  } catch (err) {
    res.status(500).json(new ApiResponse(500, null, 'Server error'));
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    let order = await Order.findById(orderId).populate('pharmacist distributor items.medicine');
    if (!order) {
      return res.status(404).json(new ApiResponse(404, null, 'Order not found'));
    }
    for (const item of order.items) {
      if (!item.medicine || !item.medicine.name) {
        const medDoc = await Medicine.findById(item.medicine);
        if (medDoc) item.medicine = medDoc;
      }
    }
    res.status(200).json(new ApiResponse(200, order, 'Order fetched successfully.'));
  } catch (err) {
    res.status(500).json(new ApiResponse(500, null, 'Server error'));
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    let order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json(new ApiResponse(404, null, 'Order not found'));
    }
    order.status = 'cancelled';
    await order.save();
    order = await Order.findById(orderId).populate('pharmacist distributor items.medicine');
    res.status(200).json(new ApiResponse(200, order, 'Order cancelled successfully.'));
  } catch (err) {
    res.status(500).json(new ApiResponse(500, null, 'Server error'));
  }
};

exports.getDistributorOrders = async (req, res) => {
  try {
    const distributor = await Distributor.findOne({ user: req.user._id });
    if (!distributor) {
      return res.status(404).json(new ApiResponse(404, null, 'Distributor not found'));
    }
    let orders = await Order.find({ distributor: distributor._id }).populate('pharmacist items.medicine');
    for (const order of orders) {
      for (const item of order.items) {
        if (!item.medicine || !item.medicine.name) {
          const medDoc = await Medicine.findById(item.medicine);
          if (medDoc) item.medicine = medDoc;
        }
      }
    }
    res.status(200).json(new ApiResponse(200, orders, 'Orders fetched successfully.'));
  } catch (err) {
    res.status(500).json(new ApiResponse(500, null, 'Server error'));
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, responseMessage } = req.body;
    const distributor = await Distributor.findOne({ user: req.user._id });
    if (!distributor) {
      return res.status(404).json(new ApiResponse(404, null, 'Distributor not found'));
    }
    const order = await Order.findOne({ _id: orderId, distributor: distributor._id });
    if (!order) {
      return res.status(404).json(new ApiResponse(404, null, 'Order not found'));
    }
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json(new ApiResponse(400, null, 'Invalid status update'));
    }
    order.status = status;
    if (responseMessage) order.responseMessage = responseMessage;
    await order.save();
    const pharmacist = await Pharmacist.findById(order.pharmacist);
    if (pharmacist && pharmacist.user) {
      await createNotification(
        pharmacist.user.toString(),
        `Order ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        `Your order has been ${status}. ${responseMessage || ''}`,
        'general',
        order._id.toString(),
        'Order'
      );
    }
    res.status(200).json(new ApiResponse(200, order, `Order ${status} successfully.`));
  } catch (err) {
    res.status(500).json(new ApiResponse(500, null, 'Server error'));
  }
};

exports.getAcceptedOrders = async (req, res) => {
  try {
    const distributor = await Distributor.findOne({ user: req.user._id });
    if (!distributor) {
      return res.status(404).json(new ApiResponse(404, null, 'Distributor not found'));
    }
    const orders = await Order.find({ distributor: distributor._id, status: 'accepted' }).populate('pharmacist items.medicine');
    res.status(200).json(new ApiResponse(200, orders, 'Accepted orders fetched successfully.'));
  } catch (err) {
    res.status(500).json(new ApiResponse(500, null, 'Server error'));
  }
};

exports.sendOrderToDriver = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { driverId } = req.body;
    const distributor = await Distributor.findOne({ user: req.user._id });
    if (!distributor) {
      return res.status(404).json(new ApiResponse(404, null, 'Distributor not found'));
    }
    const order = await Order.findOne({ _id: orderId, distributor: distributor._id });
    if (!order) {
      return res.status(404).json(new ApiResponse(404, null, 'Order not found'));
    }
    order.status = 'sent_to_driver';
    order.driver = driverId;
    await order.save();
    res.status(200).json(new ApiResponse(200, order, 'Order sent to driver successfully.'));
  } catch (err) {
    res.status(500).json(new ApiResponse(500, null, 'Server error'));
  }
};

exports.completeOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json(new ApiResponse(404, null, 'Order not found'));
    }
    order.status = 'completed';
    await order.save();
    res.status(200).json(new ApiResponse(200, order, 'Order marked as completed.'));
  } catch (err) {
    res.status(500).json(new ApiResponse(500, null, 'Server error'));
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json(new ApiResponse(404, null, 'Order not found'));
    }
    if (order.status !== 'pending') {
      return res.status(400).json(new ApiResponse(400, null, 'Only pending orders can be deleted'));
    }
    const pharmacist = await Pharmacist.findOne({ user: req.user._id });
    if (!pharmacist || !order.pharmacist.equals(pharmacist._id)) {
      return res.status(403).json(new ApiResponse(403, null, 'Not authorized to delete this order'));
    }
    await order.deleteOne();
    res.status(200).json(new ApiResponse(200, null, 'Order deleted successfully'));
  } catch (err) {
    res.status(500).json(new ApiResponse(500, null, 'Server error'));
  }
}; 
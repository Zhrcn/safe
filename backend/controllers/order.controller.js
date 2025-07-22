const Order = require('../models/Order');
const Distributor = require('../models/Distributor');
const Pharmacist = require('../models/Pharmacist');
const ApiResponse = require('../utils/apiResponse');

// Pharmacist creates an order to a distributor
exports.createOrder = async (req, res) => {
  try {
    const { distributorId, items, notes } = req.body;
    const pharmacist = await Pharmacist.findOne({ user: req.user._id });
    if (!pharmacist) {
      return res.status(404).json(new ApiResponse(404, null, 'Pharmacist not found'));
    }
    const distributor = await Distributor.findById(distributorId);
    if (!distributor) {
      return res.status(404).json(new ApiResponse(404, null, 'Distributor not found'));
    }
    const order = await Order.create({
      pharmacist: pharmacist._id,
      distributor: distributor._id,
      items,
      notes
    });
    res.status(201).json(new ApiResponse(201, order, 'Order created successfully.'));
  } catch (err) {
    res.status(500).json(new ApiResponse(500, null, 'Server error'));
  }
};

// Pharmacist views their orders
exports.getPharmacistOrders = async (req, res) => {
  try {
    const pharmacist = await Pharmacist.findOne({ user: req.user._id });
    if (!pharmacist) {
      return res.status(404).json(new ApiResponse(404, null, 'Pharmacist not found'));
    }
    const orders = await Order.find({ pharmacist: pharmacist._id }).populate('distributor items.medicine');
    res.status(200).json(new ApiResponse(200, orders, 'Orders fetched successfully.'));
  } catch (err) {
    res.status(500).json(new ApiResponse(500, null, 'Server error'));
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate('pharmacist distributor items.medicine');
    if (!order) {
      return res.status(404).json(new ApiResponse(404, null, 'Order not found'));
    }
    res.status(200).json(new ApiResponse(200, order, 'Order fetched successfully.'));
  } catch (err) {
    res.status(500).json(new ApiResponse(500, null, 'Server error'));
  }
};

// Pharmacist cancels an order
exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json(new ApiResponse(404, null, 'Order not found'));
    }
    order.status = 'cancelled';
    await order.save();
    res.status(200).json(new ApiResponse(200, order, 'Order cancelled successfully.'));
  } catch (err) {
    res.status(500).json(new ApiResponse(500, null, 'Server error'));
  }
};

// Distributor views their orders
exports.getDistributorOrders = async (req, res) => {
  try {
    const distributor = await Distributor.findOne({ user: req.user._id });
    if (!distributor) {
      return res.status(404).json(new ApiResponse(404, null, 'Distributor not found'));
    }
    const orders = await Order.find({ distributor: distributor._id }).populate('pharmacist items.medicine');
    res.status(200).json(new ApiResponse(200, orders, 'Orders fetched successfully.'));
  } catch (err) {
    res.status(500).json(new ApiResponse(500, null, 'Server error'));
  }
};

// Distributor accepts or rejects an order
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
    res.status(200).json(new ApiResponse(200, order, `Order ${status} successfully.`));
  } catch (err) {
    res.status(500).json(new ApiResponse(500, null, 'Server error'));
  }
};

// Distributor views accepted orders
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

// Distributor marks order as sent to driver
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
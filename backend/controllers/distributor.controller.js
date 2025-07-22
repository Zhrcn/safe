const Distributor = require('../models/Distributor');
const Order = require('../models/Order');
const ApiResponse = require('../utils/apiResponse');
const User = require('../models/User');

exports.getDistributorProfile = async (req, res) => {
  try {
    const distributor = await Distributor.findOne({ user: req.user._id }).populate('user');
    if (!distributor) {
      return res.status(404).json(new ApiResponse(404, null, 'Distributor not found'));
    }
    res.status(200).json(new ApiResponse(200, distributor, 'Distributor profile fetched successfully.'));
  } catch (err) {
    res.status(500).json(new ApiResponse(500, null, 'Server error'));
  }
};

exports.updateDistributorProfile = async (req, res) => {
  try {
    const distributor = await Distributor.findOneAndUpdate(
      { user: req.user._id },
      req.body,
      { new: true }
    );
    if (!distributor) {
      return res.status(404).json(new ApiResponse(404, null, 'Distributor not found'));
    }
    res.status(200).json(new ApiResponse(200, distributor, 'Distributor profile updated successfully.'));
  } catch (err) {
    res.status(500).json(new ApiResponse(500, null, 'Server error'));
  }
};

exports.getAllDistributors = async (req, res) => {
  try {
    const distributors = await Distributor.find().populate('user');
    res.status(200).json(new ApiResponse(200, distributors, 'Distributors fetched successfully.'));
  } catch (err) {
    res.status(500).json(new ApiResponse(500, null, 'Server error'));
  }
};

// Inventory management (add/remove/update inventory items)
exports.updateInventory = async (req, res) => {
  try {
    const { inventory } = req.body;
    const distributor = await Distributor.findOneAndUpdate(
      { user: req.user._id },
      { inventory },
      { new: true }
    );
    if (!distributor) {
      return res.status(404).json(new ApiResponse(404, null, 'Distributor not found'));
    }
    res.status(200).json(new ApiResponse(200, distributor, 'Inventory updated successfully.'));
  } catch (err) {
    res.status(500).json(new ApiResponse(500, null, 'Server error'));
  }
};

// Orders for distributor
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

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, responseMessage } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json(new ApiResponse(404, null, 'Order not found'));
    }
    order.status = status;
    if (responseMessage) order.responseMessage = responseMessage;
    await order.save();
    res.status(200).json(new ApiResponse(200, order, 'Order status updated successfully.'));
  } catch (err) {
    res.status(500).json(new ApiResponse(500, null, 'Server error'));
  }
}; 
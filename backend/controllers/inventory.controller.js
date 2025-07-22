const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
const Inventory = require('../models/Inventory');

// Get all inventory items for the current pharmacist
exports.getInventory = asyncHandler(async (req, res) => {
  const pharmacistId = req.user.role === 'pharmacist' ? req.user._id : null;
  if (!pharmacistId) {
    return res.status(403).json(new ApiResponse(403, null, 'Not authorized.'));
  }
  const items = await Inventory.find({ pharmacist: pharmacistId });
  res.status(200).json(new ApiResponse(200, items, 'Inventory fetched successfully.'));
});

// Get a single inventory item by ID
exports.getInventoryItem = asyncHandler(async (req, res) => {
  const item = await Inventory.findById(req.params.id);
  if (!item) {
    return res.status(404).json(new ApiResponse(404, null, 'Inventory item not found.'));
  }
  res.status(200).json(new ApiResponse(200, item, 'Inventory item fetched successfully.'));
});

// Create a new inventory item
exports.createInventoryItem = asyncHandler(async (req, res) => {
  const pharmacistId = req.user.role === 'pharmacist' ? req.user._id : null;
  if (!pharmacistId) {
    return res.status(403).json(new ApiResponse(403, null, 'Not authorized.'));
  }
  // Force stock and lowStockThreshold to numbers
  const body = { ...req.body };
  if (body.stock !== undefined) body.stock = Number(body.stock);
  if (body.lowStockThreshold !== undefined) body.lowStockThreshold = Number(body.lowStockThreshold);
  console.log('INVENTORY CREATE BODY:', body);
  const item = await Inventory.create({ ...body, pharmacist: pharmacistId });
  res.status(201).json(new ApiResponse(201, item, 'Inventory item created successfully.'));
});

// Update an inventory item
exports.updateInventoryItem = asyncHandler(async (req, res) => {
  const item = await Inventory.findById(req.params.id);
  if (!item) {
    return res.status(404).json(new ApiResponse(404, null, 'Inventory item not found.'));
  }
  // Only allow the pharmacist who owns the item to update
  if (item.pharmacist.toString() !== req.user._id.toString()) {
    return res.status(403).json(new ApiResponse(403, null, 'Not authorized.'));
  }
  Object.assign(item, req.body);
  await item.save();
  res.status(200).json(new ApiResponse(200, item, 'Inventory item updated successfully.'));
});

// Delete an inventory item
exports.deleteInventoryItem = asyncHandler(async (req, res) => {
  const item = await Inventory.findById(req.params.id);
  if (!item) {
    return res.status(404).json(new ApiResponse(404, null, 'Inventory item not found.'));
  }
  if (item.pharmacist.toString() !== req.user._id.toString()) {
    return res.status(403).json(new ApiResponse(403, null, 'Not authorized.'));
  }
  await item.deleteOne();
  res.status(200).json(new ApiResponse(200, null, 'Inventory item deleted successfully.'));
});

// Get low stock items for the current pharmacist
exports.getLowStockItems = asyncHandler(async (req, res) => {
  const pharmacistId = req.user.role === 'pharmacist' ? req.user._id : null;
  if (!pharmacistId) {
    return res.status(403).json(new ApiResponse(403, null, 'Not authorized.'));
  }
  const items = await Inventory.find({ pharmacist: pharmacistId, $expr: { $lte: ["$stock", "$lowStockThreshold"] } });
  res.status(200).json(new ApiResponse(200, items, 'Low stock items fetched successfully.'));
}); 
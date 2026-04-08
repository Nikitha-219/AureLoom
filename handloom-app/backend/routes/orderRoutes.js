const express = require("express");
const router = express.Router();
const { placeOrder, getOrders, getOrderById, updateOrderStatus } = require("../controllers/orderController");
const { protect, artisanOnly } = require("../middleware/auth");

// All order routes are protected
router.use(protect);

// POST /api/orders (checkout)
router.post("/", placeOrder);

// GET /api/orders (order history)
router.get("/", getOrders);

// GET /api/orders/:id
router.get("/:id", getOrderById);

// PUT /api/orders/:id/status (Artisan only)
router.put("/:id/status", artisanOnly, updateOrderStatus);

module.exports = router;

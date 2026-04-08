const express = require("express");
const router = express.Router();
const { getCart, addToCart, updateCartItem, removeFromCart, clearCart } = require("../controllers/cartController");
const { protect } = require("../middleware/auth");

// All cart routes are protected
router.use(protect);

// GET /api/cart
router.get("/", getCart);

// POST /api/cart/add
router.post("/add", addToCart);

// PUT /api/cart/update
router.put("/update", updateCartItem);

// DELETE /api/cart/remove/:productId
router.delete("/remove/:productId", removeFromCart);

// DELETE /api/cart/clear
router.delete("/clear", clearCart);

module.exports = router;

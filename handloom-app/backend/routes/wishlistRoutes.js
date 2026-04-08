const express = require("express");
const router = express.Router();
const { getWishlist, toggleWishlist } = require("../controllers/wishlistController");
const { protect } = require("../middleware/auth");

// All wishlist routes are protected
router.use(protect);

// GET /api/wishlist
router.get("/", getWishlist);

// POST /api/wishlist/toggle/:productId
router.post("/toggle/:productId", toggleWishlist);

module.exports = router;

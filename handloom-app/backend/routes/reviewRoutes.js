const express = require("express");
const router = express.Router();
const { addReview, getProductReviews } = require("../controllers/reviewController");
const { protect } = require("../middleware/auth");

// POST /api/reviews/:productId (Protected)
router.post("/:productId", protect, addReview);

// GET /api/reviews/:productId (Public)
router.get("/:productId", getProductReviews);

module.exports = router;

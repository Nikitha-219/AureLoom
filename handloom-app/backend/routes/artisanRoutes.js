const express = require("express");
const router = express.Router();
const { getArtisans, getArtisanById, updateArtisan, createArtisan } = require("../controllers/artisanController");
const { protect, artisanOnly } = require("../middleware/auth");

// GET /api/artisans
router.get("/", getArtisans);

// GET /api/artisans/:id
router.get("/:id", getArtisanById);

// POST /api/artisans (Create artisan profile)
router.post("/", protect, createArtisan);

// PUT /api/artisans/:id (Update artisan profile)
router.put("/:id", protect, artisanOnly, updateArtisan);

module.exports = router;

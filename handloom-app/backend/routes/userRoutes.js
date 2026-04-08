const express = require("express");
const router = express.Router();
const { getProfile, updateProfile, updateProfileImage, changePassword } = require("../controllers/userController");
const { protect } = require("../middleware/auth");

// GET /api/users/profile
router.get("/profile", protect, getProfile);

// PUT /api/users/profile
router.put("/profile", protect, updateProfile);

// PUT /api/users/profile/image
router.put("/profile/image", protect, updateProfileImage);

// PUT /api/users/password
router.put("/password", protect, changePassword);

module.exports = router;

const express = require("express");
const router = express.Router();
const { register, login, verifyRegisterOtp, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const { registerValidation, loginValidation } = require("../utils/validators");

// POST /api/auth/register
router.post("/register", registerValidation, register);

// POST /api/auth/login
router.post("/login", loginValidation, login);

// POST /api/auth/verify-register-otp
router.post("/verify-register-otp", verifyRegisterOtp);

// GET /api/auth/me
router.get("/me", protect, getMe);

module.exports = router;

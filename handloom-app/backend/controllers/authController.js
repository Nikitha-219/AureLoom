const { User } = require("../models");
const generateToken = require("../utils/generateToken");
const { validationResult } = require("express-validator");
const sendEmail = require("../utils/sendEmail");
const sendSms = require("../utils/sendSms");

// @desc    Register a new user
const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { name, email, phone, password, role } = req.body;

    let user = await User.findOne({ where: { email } });
    if (user) {
      if (user.isVerified) {
        return res.status(400).json({ message: "User already exists." });
      }
      // If unverified, we update their info
      user.name = name;
      user.phone = phone;
      user.password = password; 
      user.role = role || "buyer";
    } else {
      user = await User.create({ name, email, phone, password, role: role || "buyer", isVerified: false });
    }

    // Generate random 6 DB OTPs
    const emailOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.emailOtp = emailOtp;
    user.otpExpires = otpExpires;
    
    await user.save();

    // Send email
    await sendEmail({
      email: user.email,
      subject: "AureLoom Registration Verification Code",
      message: `Your registration verification code is ${emailOtp}. It is valid for 10 minutes.`
    });


    const isSimulated = !process.env.SMTP_HOST || !process.env.SMTP_USER;

    res.status(201).json({
      message: isSimulated ? "OTP Generated (Simulated)" : "OTP Sent",
      userId: user.id,
      // Dev helper: return OTP if SMTP is missing
      debugOtp: isSimulated ? { emailOtp } : null
    });
  } catch (error) { next(error); }
};

// @desc    Login user
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(401).json({ message: "Email does not exist in our system" });
    }

    if (!(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    if (!user.isVerified) {
       return res.status(401).json({ message: "Please verify your account first. Register again to receive a new OTP." });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      image: user.image,
      token: generateToken(user.id)
    });
  } catch (error) { next(error); }
};

// @desc    Verify OTP for Registration
const verifyRegisterOtp = async (req, res, next) => {
  try {
    const { userId, emailOtp } = req.body;
    
    const user = await User.findByPk(userId);
    if (!user) return res.status(400).json({ message: "User not found" });

    if (!user.emailOtp) {
       return res.status(400).json({ message: "No OTP session found. Please register again." });
    }

    if (new Date() > user.otpExpires) {
       return res.status(400).json({ message: "OTPs have expired. Please register again." });
    }

    if (user.emailOtp !== emailOtp) {
       return res.status(400).json({ message: "Invalid Email OTP" });
    }

    // Clear OTPs and set verified
    user.emailOtp = null;
    user.otpExpires = null;
    user.isVerified = true;
    await user.save();

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      image: user.image,
      token: generateToken(user.id)
    });

  } catch (error) { next(error); }
};

// @desc    Get current logged-in user
const getMe = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
    res.json(user);
  } catch (error) { next(error); }
};

module.exports = { register, login, verifyRegisterOtp, getMe };

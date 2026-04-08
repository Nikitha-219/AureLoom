const { body } = require("express-validator");

const registerValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("role").optional().isIn(["buyer", "artisan"]).withMessage("Role must be buyer or artisan")
];

const loginValidation = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required")
];

const productValidation = [
  body("name").trim().notEmpty().withMessage("Product name is required"),
  body("price").isNumeric().withMessage("Price must be a number"),
  body("image").notEmpty().withMessage("Image URL is required")
];

module.exports = { registerValidation, loginValidation, productValidation };

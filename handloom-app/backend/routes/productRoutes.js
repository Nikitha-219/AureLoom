const express = require("express");
const router = express.Router();
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getByCategory } = require("../controllers/productController");
const { protect, artisanOnly } = require("../middleware/auth");
const { productValidation } = require("../utils/validators");

// GET /api/products
router.get("/", getProducts);

// GET /api/products/category/:category
router.get("/category/:category", getByCategory);

// GET /api/products/:id
router.get("/:id", getProductById);

// POST /api/products (Artisan only)
router.post("/", protect, artisanOnly, productValidation, createProduct);

// PUT /api/products/:id (Artisan only)
router.put("/:id", protect, artisanOnly, updateProduct);

// DELETE /api/products/:id (Artisan only)
router.delete("/:id", protect, artisanOnly, deleteProduct);

module.exports = router;

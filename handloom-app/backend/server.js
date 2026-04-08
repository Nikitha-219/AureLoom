const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load env variables BEFORE imports that rely on it
dotenv.config({ path: __dirname + "/.env" });

const { connectDB, sequelize } = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

 

connectDB().then(() => {
  sequelize.sync({ alter: true });
  console.log("✅ Models synced");
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/artisans", require("./routes/artisanRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/wishlist", require("./routes/wishlistRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "AureLoom API is running" });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🧵 AureLoom Server running on http://localhost:${PORT}`);
  console.log(`📡 API Health: http://localhost:${PORT}/api/health\n`);
});

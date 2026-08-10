require("dns").setDefaultResultOrder("ipv4first");

const dotenv = require("dotenv");

// Load environment variables first
dotenv.config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./database/db");

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes = require("./routes/adminRoutes");

// ==========================================
// Connect Database
// ==========================================

connectDB();

const app = express();

// ==========================================
// Middleware
// ==========================================

app.use(cors());

app.use(express.json());

// ==========================================
// Routes
// ==========================================

app.use("/api/users", userRoutes);

app.use("/api/products", productRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/payments", paymentRoutes);

app.use("/api/admin", adminRoutes);

// ==========================================
// Test Route
// ==========================================

app.get("/", (req, res) => {
  res.send("API Running...");
});

// ==========================================
// Server
// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `✅ Server is running on http://localhost:${PORT}`
  );
});
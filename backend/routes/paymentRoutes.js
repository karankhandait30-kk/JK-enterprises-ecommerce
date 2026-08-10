const express = require("express");

const router = express.Router();

const {
  createPayment,
  verifyPayment,
} = require("../controllers/paymentController");

const protect = require("../middlewares/authMiddleware");

// Create Razorpay payment
router.post("/create", protect, createPayment);

// Verify Razorpay payment
router.post("/verify", protect, verifyPayment);

module.exports = router;
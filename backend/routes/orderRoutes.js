const express = require("express");

const router = express.Router();

const {
  createOrder,
  getMyOrders,
} = require("../controllers/orderController");

const protect = require("../middlewares/authMiddleware");


// Place Order
router.post("/", protect, createOrder);


// Get My Orders
router.get("/my-orders", protect, getMyOrders);


module.exports = router;
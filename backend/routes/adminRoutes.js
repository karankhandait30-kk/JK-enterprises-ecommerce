const express = require("express");

const router = express.Router();

const {
  adminTest,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/adminController");

const protect = require("../middlewares/authMiddleware");
const admin = require("../middlewares/adminMiddleware");

// ==========================================
// ADMIN TEST
// ==========================================

router.get(
  "/test",
  protect,
  admin,
  adminTest
);

// ==========================================
// GET ALL ORDERS
// ==========================================

router.get(
  "/orders",
  protect,
  admin,
  getAllOrders
);

// ==========================================
// UPDATE ORDER STATUS
// ==========================================

router.put(
  "/orders/:id/status",
  protect,
  admin,
  updateOrderStatus
);

module.exports = router;
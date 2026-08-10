const express = require("express");

const router = express.Router();

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const protect = require("../middlewares/authMiddleware");
const admin = require("../middlewares/adminMiddleware");


// ======================================================
// PUBLIC PRODUCT ROUTES
// ======================================================

// Get all products
router.get("/", getProducts);

// Get single product
router.get("/:id", getProductById);


// ======================================================
// ADMIN PRODUCT ROUTES
// ======================================================

// Create product
router.post(
  "/",
  protect,
  admin,
  createProduct
);

// Update product
router.put(
  "/:id",
  protect,
  admin,
  updateProduct
);

// Delete product
router.delete(
  "/:id",
  protect,
  admin,
  deleteProduct
);


module.exports = router;
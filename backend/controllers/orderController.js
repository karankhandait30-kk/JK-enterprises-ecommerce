const Order = require("../models/Order");

// ==========================================
// CREATE ORDER
// ==========================================
const createOrder = async (req, res) => {
  try {
    const shippingDetails = req.body.shippingDetails;
    const items = req.body.items;
    const totalAmount = req.body.totalAmount;

    // Check shipping details
    if (!shippingDetails) {
      return res.status(400).json({
        success: false,
        message: "Shipping details are required",
      });
    }

    if (
      !shippingDetails.name ||
      !shippingDetails.phone ||
      !shippingDetails.address ||
      !shippingDetails.city ||
      !shippingDetails.pincode
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all shipping details",
      });
    }

    // Check products
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one product",
      });
    }

    // Check total amount
    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid total amount",
      });
    }

    // Create order
    const order = await Order.create({
      user: req.user.id,

      shippingDetails: {
        name: shippingDetails.name,
        phone: shippingDetails.phone,
        address: shippingDetails.address,
        city: shippingDetails.city,
        pincode: shippingDetails.pincode,
      },

      items: items,

      totalAmount: totalAmount,

      // Payment starts as Pending
      paymentStatus: "Pending",

      paymentId: null,

      // Order starts as Pending
      status: "Pending",
    });

    return res.status(201).json({
      success: true,
      message: "Order Created Successfully",
      order: order,
    });
  } catch (error) {
    console.log("Create Order Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// UPDATE PAYMENT STATUS
// ==========================================
const updatePaymentStatus = async (req, res) => {
  try {
    const { orderId, paymentId, paymentStatus } = req.body;

    // Check required fields
    if (!orderId || !paymentStatus) {
      return res.status(400).json({
        success: false,
        message: "Order ID and payment status are required",
      });
    }

    // Find order belonging to logged-in user
    const order = await Order.findOne({
      _id: orderId,
      user: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Successful payment
    if (paymentStatus === "Paid") {
      order.paymentStatus = "Paid";
      order.paymentId = paymentId || null;

      await order.save();

      return res.status(200).json({
        success: true,
        message: "Payment marked as successful",
        order: order,
      });
    }

    // Failed payment
    if (paymentStatus === "Failed") {
      order.paymentStatus = "Failed";
      order.paymentId = paymentId || null;

      await order.save();

      return res.status(200).json({
        success: true,
        message: "Payment marked as failed",
        order: order,
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid payment status",
    });

  } catch (error) {
    console.log("Update Payment Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// GET MY ORDERS
// ==========================================
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders: orders,
    });
  } catch (error) {
    console.log("Get Orders Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// EXPORT
// ==========================================
module.exports = {
  createOrder,
  updatePaymentStatus,
  getMyOrders,
};
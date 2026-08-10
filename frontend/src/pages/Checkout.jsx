import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { CartContext } from "../context/CartContext";

function Checkout() {
  const { cartItems, clearCart } = useContext(CartContext);

  const navigate = useNavigate();

  const [details, setDetails] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleChange = (e) => {
    setDetails({
      ...details,
      [e.target.name]: e.target.value,
    });
  };

  // Load Razorpay
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");

      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => {
        resolve(true);
      };

      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };

  const placeOrder = async () => {
    if (
      !details.name ||
      !details.phone ||
      !details.address ||
      !details.city ||
      !details.pincode
    ) {
      alert("Please fill all details");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login before placing an order.");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      // ==========================================
      // STEP 1: Load Razorpay
      // ==========================================

      const razorpayLoaded = await loadRazorpayScript();

      if (!razorpayLoaded) {
        alert("Razorpay failed to load.");
        setLoading(false);
        return;
      }

      // ==========================================
      // STEP 2: Create Order in Database
      // ==========================================

      const orderItems = cartItems.map((item) => ({
        product: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      }));

      const orderResponse = await axios.post(
        "http://localhost:5000/api/orders",
        {
          shippingDetails: details,
          items: orderItems,
          totalAmount: totalAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const databaseOrder = orderResponse.data.order;

      console.log("Database Order:", databaseOrder);

      // ==========================================
      // STEP 3: Create Razorpay Order
      // ==========================================

      const paymentResponse = await axios.post(
        "http://localhost:5000/api/payments/create",
        {
          amount: totalAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const razorpayOrder = paymentResponse.data.order;

      console.log("Razorpay Order:", razorpayOrder);

      // ==========================================
      // STEP 4: Open Razorpay
      // ==========================================

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,

        amount: razorpayOrder.amount,

        currency: razorpayOrder.currency,

        name: "J&K Enterprises",

        description: "E-Commerce Order",

        order_id: razorpayOrder.id,

        handler: async function (response) {
          try {
            // ==========================================
            // STEP 5: Verify Payment
            // ==========================================

            const verifyResponse = await axios.post(
              "http://localhost:5000/api/payments/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,

                // Database Order ID
                orderId: databaseOrder._id,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (!verifyResponse.data.success) {
              alert("Payment verification failed.");
              setLoading(false);
              return;
            }

            console.log(
              "Payment Verified:",
              verifyResponse.data
            );

            // ==========================================
            // STEP 6: Clear Cart
            // ==========================================

            clearCart();

            // ==========================================
            // STEP 7: Success
            // ==========================================

            alert(
              "Payment successful! Order placed successfully."
            );

            navigate("/orders");

          } catch (error) {
            console.log(
              "Payment Verification Error:",
              error
            );

            alert(
              error.response?.data?.message ||
                "Payment verification failed."
            );

            setLoading(false);
          }
        },

        // ==========================================
        // Payment Window Closed
        // ==========================================

        modal: {
          ondismiss: function () {
            setLoading(false);

            alert("Payment cancelled.");
          },
        },

        prefill: {
          name: details.name,
        },

        theme: {
          color: "#2563eb",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.open();

    } catch (error) {
      console.log("Order/Payment Error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to place order."
      );

      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <div className="max-w-6xl mx-auto p-10">

        <h1 className="text-4xl font-bold text-center mb-8">
          Checkout
        </h1>

        <div className="grid md:grid-cols-2 gap-8">

          {/* Shipping Details */}

          <div className="bg-white p-6 rounded-xl shadow">

            <h2 className="text-2xl font-bold mb-5">
              Shipping Details
            </h2>

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={details.name}
              onChange={handleChange}
              className="w-full border p-3 mb-4 rounded"
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={details.phone}
              onChange={handleChange}
              className="w-full border p-3 mb-4 rounded"
            />

            <textarea
              name="address"
              placeholder="Address"
              value={details.address}
              onChange={handleChange}
              className="w-full border p-3 mb-4 rounded"
            />

            <input
              type="text"
              name="city"
              placeholder="City"
              value={details.city}
              onChange={handleChange}
              className="w-full border p-3 mb-4 rounded"
            />

            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              value={details.pincode}
              onChange={handleChange}
              className="w-full border p-3 rounded"
            />

          </div>


          {/* Order Summary */}

          <div className="bg-white p-6 rounded-xl shadow">

            <h2 className="text-2xl font-bold mb-5">
              Order Summary
            </h2>

            {cartItems.length === 0 ? (

              <p>Your cart is empty.</p>

            ) : (

              cartItems.map((item) => (

                <div
                  key={item._id}
                  className="flex justify-between border-b py-2"
                >

                  <span>
                    {item.name} × {item.quantity}
                  </span>

                  <span>
                    ₹{item.price * item.quantity}
                  </span>

                </div>

              ))

            )}

            <div className="mt-5 text-xl font-bold">
              Total: ₹{totalAmount}
            </div>

            <button
              onClick={placeOrder}
              disabled={loading}
              className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading
                ? "Processing Payment..."
                : "Pay Now"}
            </button>

          </div>

        </div>

      </div>

      <Footer />

    </div>
  );
}

export default Checkout;
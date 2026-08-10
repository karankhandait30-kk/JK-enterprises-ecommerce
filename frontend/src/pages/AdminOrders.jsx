import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function AdminOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const token = localStorage.getItem("token");

  // ==========================================
  // GET ALL ORDERS
  // ==========================================

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://localhost:5000/api/admin/orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(response.data.orders || []);
    } catch (error) {
      console.log("Fetch Orders Error:", error);

      if (error.response?.status === 401) {
        alert("Please login again.");
        navigate("/login");
        return;
      }

      if (error.response?.status === 403) {
        alert("Access denied. Admin only.");
        navigate("/");
        return;
      }

      alert(
        error.response?.data?.message ||
          "Failed to load orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    fetchOrders();
  }, []);

  // ==========================================
  // UPDATE ORDER STATUS
  // ==========================================

  const updateStatus = async (orderId, status) => {
    try {
      setUpdatingId(orderId);

      await axios.put(
        `http://localhost:5000/api/admin/orders/${orderId}/status`,
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Order status updated successfully.");

      await fetchOrders();
    } catch (error) {
      console.log("Update Order Error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to update order status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto p-8">

        {/* HEADER */}

        <div className="flex justify-between items-center mb-8">

          <div>
            <h1 className="text-4xl font-bold">
              Manage Orders
            </h1>

            <p className="text-gray-600 mt-2">
              View and manage customer orders.
            </p>
          </div>

          <button
            onClick={() => navigate("/admin")}
            className="bg-gray-700 text-white px-5 py-2 rounded-lg hover:bg-gray-800"
          >
            Back to Dashboard
          </button>

        </div>

        {/* LOADING */}

        {loading ? (

          <div className="bg-white rounded-xl shadow p-8 text-center">
            <p className="text-gray-600">
              Loading orders...
            </p>
          </div>

        ) : orders.length === 0 ? (

          <div className="bg-white rounded-xl shadow p-8 text-center">

            <h2 className="text-2xl font-semibold">
              No Orders Yet
            </h2>

            <p className="text-gray-600 mt-2">
              No customer orders have been placed.
            </p>

          </div>

        ) : (

          <div className="space-y-8">

            {orders.map((order) => (

              <div
                key={order._id}
                className="bg-white rounded-xl shadow-lg p-6"
              >

                {/* ORDER HEADER */}

                <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-5">

                  <div>

                    <h2 className="text-xl font-bold">
                      Order #{String(order._id).slice(-6)}
                    </h2>

                    <p className="text-gray-500 mt-1">
                      {new Date(
                        order.createdAt
                      ).toLocaleString()}
                    </p>

                  </div>

                  <div className="text-right">

                    <p className="text-2xl font-bold">
                      ₹{order.totalAmount}
                    </p>

                    <p className="text-sm text-gray-600 mt-1">
                      Payment: {order.paymentStatus}
                    </p>

                  </div>

                </div>

                <hr className="mb-5" />

                {/* CUSTOMER */}

                <div className="mb-5">

                  <h3 className="text-lg font-bold mb-2">
                    Customer
                  </h3>

                  <p>
                    <strong>Name:</strong>{" "}
                    {order.user?.name || "N/A"}
                  </p>

                  <p>
                    <strong>Email:</strong>{" "}
                    {order.user?.email || "N/A"}
                  </p>

                </div>

                {/* SHIPPING */}

                <div className="mb-5">

                  <h3 className="text-lg font-bold mb-2">
                    Shipping Details
                  </h3>

                  <p>
                    <strong>Name:</strong>{" "}
                    {order.shippingDetails?.name}
                  </p>

                  <p>
                    <strong>Phone:</strong>{" "}
                    {order.shippingDetails?.phone}
                  </p>

                  <p>
                    <strong>Address:</strong>{" "}
                    {order.shippingDetails?.address}
                  </p>

                  <p>
                    <strong>City:</strong>{" "}
                    {order.shippingDetails?.city}
                  </p>

                  <p>
                    <strong>Pincode:</strong>{" "}
                    {order.shippingDetails?.pincode}
                  </p>

                </div>

                <hr className="my-5" />

                {/* PRODUCTS */}

                <h3 className="text-lg font-bold mb-4">
                  Products
                </h3>

                <div className="space-y-3">

                  {order.items?.map((item, index) => (

                    <div
                      key={`${order._id}-${index}`}
                      className="flex items-center justify-between border-b pb-3"
                    >

                      <div className="flex items-center gap-4">

                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        )}

                        <div>

                          <p className="font-semibold">
                            {item.name}
                          </p>

                          <p className="text-gray-500">
                            ₹{item.price} ×{" "}
                            {item.quantity}
                          </p>

                        </div>

                      </div>

                      <p className="font-semibold">
                        ₹
                        {item.price *
                          item.quantity}
                      </p>

                    </div>

                  ))}

                </div>

                {/* STATUS */}

                <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                  <div>

                    <span className="font-bold">
                      Current Status:
                    </span>{" "}

                    <span className="px-3 py-1 rounded-lg bg-yellow-100 text-yellow-700 font-semibold">
                      {order.status}
                    </span>

                  </div>

                  <div className="flex items-center gap-3">

                    <label className="font-semibold">
                      Update Status:
                    </label>

                    <select
                      value={order.status}
                      disabled={
                        updatingId === order._id
                      }
                      onChange={(e) =>
                        updateStatus(
                          order._id,
                          e.target.value
                        )
                      }
                      className="border p-2 rounded-lg"
                    >

                      <option value="Pending">
                        Pending
                      </option>

                      <option value="Processing">
                        Processing
                      </option>

                      <option value="Shipped">
                        Shipped
                      </option>

                      <option value="Delivered">
                        Delivered
                      </option>

                      <option value="Cancelled">
                        Cancelled
                      </option>

                    </select>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

      <Footer />
    </>
  );
}

export default AdminOrders;
import { useContext } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { OrderContext } from "../context/OrderContext";

function Orders() {
  const { orders } = useContext(OrderContext);

  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <div className="max-w-6xl mx-auto p-8">

        <h1 className="text-4xl font-bold mb-8 text-center">
          My Orders
        </h1>

        {orders.length === 0 ? (

          <div className="bg-white rounded-xl shadow p-8 text-center">

            <h2 className="text-2xl font-semibold">
              No Orders Yet
            </h2>

            <p className="text-gray-600 mt-3">
              You haven't placed any orders.
            </p>

          </div>

        ) : (

          orders.map((order, index) => {

            // Support both MongoDB orders and older local orders
            const orderId =
              order._id ||
              order.id ||
              `ORDER-${index + 1}`;

            const orderDate =
              order.createdAt ||
              order.date ||
              new Date().toISOString();

            const shipping =
              order.shippingDetails ||
              order.customer ||
              {};

            const products =
              order.items ||
              order.products ||
              [];

            const total =
              order.totalAmount ??
              order.total ??
              0;

            const paymentStatus =
              order.paymentStatus ||
              "Pending";

            const orderStatus =
              order.status ||
              "Pending";

            return (

              <div
                key={orderId}
                className="bg-white rounded-xl shadow-lg p-6 mb-8"
              >

                {/* Order Header */}

                <div className="flex justify-between items-start mb-4">

                  <div>

                    <h2 className="text-xl font-bold">
                      Order #
                      {String(orderId).slice(-6)}
                    </h2>

                    <p className="text-gray-500 mt-2">
                      {new Date(orderDate).toLocaleString()}
                    </p>

                  </div>

                  <div className="text-right">

                    <h2 className="text-xl font-bold text-green-600">
                      ₹{total}
                    </h2>

                    {/* Order Status */}

                    <span
                      className={`inline-block mt-2 px-4 py-2 rounded-lg font-semibold ${
                        orderStatus === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : orderStatus === "Shipped"
                          ? "bg-blue-100 text-blue-700"
                          : orderStatus === "Cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      Order: {orderStatus}
                    </span>

                    {/* Payment Status */}

                    <div className="mt-2">

                      <span
                        className={`inline-block px-4 py-2 rounded-lg font-semibold ${
                          paymentStatus === "Paid"
                            ? "bg-green-100 text-green-700"
                            : paymentStatus === "Failed"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        Payment: {paymentStatus}
                      </span>

                    </div>

                  </div>

                </div>

                <hr className="mb-5" />


                {/* Shipping Details */}

                <h3 className="font-bold text-lg mb-3">
                  Shipping Details
                </h3>

                <p>
                  <strong>Name:</strong>{" "}
                  {shipping.name || "N/A"}
                </p>

                <p>
                  <strong>Phone:</strong>{" "}
                  {shipping.phone || "N/A"}
                </p>

                <p>
                  <strong>Address:</strong>{" "}
                  {shipping.address || "N/A"}
                </p>

                <p>
                  <strong>City:</strong>{" "}
                  {shipping.city || "N/A"}
                </p>

                <p>
                  <strong>Pincode:</strong>{" "}
                  {shipping.pincode || "N/A"}
                </p>


                <hr className="my-5" />


                {/* Products */}

                <h3 className="font-bold text-lg mb-3">
                  Products
                </h3>

                {products.map((item, itemIndex) => {

                  const itemId =
                    item._id ||
                    item.product ||
                    item.id ||
                    itemIndex;

                  return (

                    <div
                      key={itemId}
                      className="flex items-center justify-between py-3 border-b"
                    >

                      <div className="flex items-center gap-4">

                        {item.image && (

                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />

                        )}

                        <div>

                          <p className="font-semibold">
                            {item.name}
                          </p>

                          <p className="text-gray-500">
                            ₹{item.price} × {item.quantity}
                          </p>

                        </div>

                      </div>

                      <p className="font-semibold">
                        ₹{item.price * item.quantity}
                      </p>

                    </div>

                  );
                })}

              </div>

            );
          })

        )}

      </div>

      <Footer />

    </div>
  );
}

export default Orders;
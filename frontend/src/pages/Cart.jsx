import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CartContext } from "../context/CartContext";

function Cart() {

  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useContext(CartContext);

  const navigate = useNavigate();

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <section className="max-w-6xl mx-auto p-10">

        <h1 className="text-4xl font-bold mb-8">
          Shopping Cart
        </h1>

        {cartItems.length === 0 ? (

          <h2 className="text-xl text-gray-600">
            Your cart is empty.
          </h2>

        ) : (

          <>
            <div className="space-y-6">

              {cartItems.map((item) => (

                <div
                  key={item._id}
                  className="bg-white p-6 rounded-xl shadow-md flex justify-between items-center"
                >

                  <div className="flex items-center gap-6">

                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />

                    <div>

                      <h2 className="text-xl font-semibold">
                        {item.name}
                      </h2>

                      <p className="text-gray-600">
                        ₹{item.price}
                      </p>

                      <div className="flex items-center gap-3 mt-3">

                        <button
                          onClick={() => decreaseQuantity(item._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                          -
                        </button>

                        <span className="text-lg font-semibold">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => increaseQuantity(item._id)}
                          className="bg-green-500 text-white px-3 py-1 rounded"
                        >
                          +
                        </button>

                      </div>

                    </div>

                  </div>

                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700"
                  >
                    Remove
                  </button>

                </div>

              ))}

            </div>

            <div className="mt-10 text-right">

              <h2 className="text-3xl font-bold">
                Total: ₹{totalPrice}
              </h2>

              <button
                onClick={() => navigate("/checkout")}
                className="mt-6 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700"
              >
                Proceed to Checkout
              </button>

            </div>

          </>

        )}

      </section>

      <Footer />

    </div>
  );
}

export default Cart;
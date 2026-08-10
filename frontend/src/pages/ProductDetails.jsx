import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CartContext } from "../context/CartContext";

function ProductDetails() {

  const { id } = useParams();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {

      const res = await axios.get(
        `http://localhost:5000/api/products/${id}`
      );

      setProduct(res.data.product);

    } catch (error) {
      console.log("Error loading product:", error);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />

        <div className="text-center py-20">
          <h1 className="text-4xl font-bold text-red-600">
            Product Not Found
          </h1>
        </div>

        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    alert("Product added to cart successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <section className="max-w-6xl mx-auto p-10 grid grid-cols-1 md:grid-cols-2 gap-10">

        <img
          src={product.image}
          alt={product.name}
          className="w-full rounded-xl shadow-lg"
        />

        <div className="flex flex-col justify-center">

          <h1 className="text-4xl font-bold">
            {product.name}
          </h1>

          <p className="text-3xl text-blue-600 mt-4">
            ₹{product.price}
          </p>

          <p className="text-gray-600 mt-6 leading-7">
            {product.description}
          </p>

          <p className="text-green-600 font-semibold mt-4">
            Stock: {product.stock}
          </p>

          <button
            onClick={handleAddToCart}
            className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 w-fit"
          >
            Add to Cart
          </button>

        </div>

      </section>

      <Footer />

    </div>
  );
}

export default ProductDetails;
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/products"
      );

      setProducts(res.data.products);
    } catch (error) {
      console.log(error);
      alert("Failed to load products");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar />

      {/* Hero Section */}

      <section className="text-center py-20 bg-white">

        <h1 className="text-5xl font-bold text-gray-800">
          Welcome to J&K Enterprises
        </h1>

        <p className="text-lg text-gray-600 mt-5">
          Your trusted online shopping partner
        </p>

        <button
          onClick={() =>
            (window.location.href = "/products")
          }
          className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700"
        >
          Shop Now
        </button>

      </section>


      {/* Featured Products */}

      <section className="p-10">

        <h2 className="text-3xl font-bold mb-8">
          Featured Products
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}

        </div>

      </section>


      <Footer />

    </div>
  );
}

export default Home;
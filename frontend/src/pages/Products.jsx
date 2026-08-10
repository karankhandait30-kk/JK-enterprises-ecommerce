import { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";


function Products() {

  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");



  useEffect(() => {

    fetchProducts();

  }, []);



  const fetchProducts = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/products"
      );


      console.log("Products API:", res.data);


      setProducts(res.data.products);


    } catch (error) {

      console.log(error);

      setError("Failed to load products");

    }

  };



  return (

    <div className="min-h-screen bg-gray-100">


      <Navbar />


      <section className="max-w-7xl mx-auto p-10">


        <h1 className="text-4xl font-bold text-center mb-10">

          All Products

        </h1>



        {error && (

          <h2 className="text-center text-red-600 text-xl">

            {error}

          </h2>

        )}



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


export default Products;
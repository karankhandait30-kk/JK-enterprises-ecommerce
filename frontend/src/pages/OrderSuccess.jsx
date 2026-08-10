import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


function OrderSuccess() {


  return (

    <div className="min-h-screen bg-gray-100">


      <Navbar />


      <section className="flex justify-center items-center py-20">


        <div className="bg-white p-10 rounded-xl shadow-md text-center">


          <h1 className="text-4xl font-bold text-green-600 mb-5">
            Order Placed Successfully 🎉
          </h1>


          <p className="text-gray-600 text-lg mb-8">
            Thank you for shopping with J&K Enterprises.
          </p>



          <div className="flex gap-4 justify-center">


            <Link

              to="/products"

              className="bg-blue-600 text-white px-6 py-3 rounded-lg"

            >

              Continue Shopping

            </Link>



            <Link

              to="/"

              className="bg-gray-200 px-6 py-3 rounded-lg"

            >

              Go Home

            </Link>


          </div>


        </div>


      </section>


      <Footer />


    </div>

  );

}


export default OrderSuccess;
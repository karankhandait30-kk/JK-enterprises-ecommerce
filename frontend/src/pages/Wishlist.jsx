import { useContext } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { WishlistContext } from "../context/WishlistContext";


function Wishlist() {


  const {
    wishlist,
    removeFromWishlist
  } = useContext(WishlistContext);



  return (

    <div className="min-h-screen bg-gray-100">

      <Navbar />


      <section className="p-10">


        <h1 className="text-4xl font-bold text-center mb-8">
          My Wishlist ❤️
        </h1>



        {
          wishlist.length === 0 ? (

            <p className="text-center text-xl text-gray-600">
              Your wishlist is empty
            </p>

          ) : (


            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">


              {
                wishlist.map((product) => (

                  <div
                    key={product.id}
                    className="bg-white rounded-xl shadow-md p-5"
                  >


                    <img

                      src={product.image}

                      alt={product.name}

                      className="w-full h-52 object-cover rounded-lg"

                    />



                    <h2 className="text-xl font-bold mt-4">
                      {product.name}
                    </h2>



                    <p className="text-gray-600 mt-2">
                      ₹{product.price}
                    </p>



                    <button

                      onClick={() =>
                        removeFromWishlist(product.id)
                      }

                      className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg"

                    >

                      Remove

                    </button>



                  </div>

                ))

              }


            </div>


          )

        }



      </section>


      <Footer />


    </div>

  );

}


export default Wishlist;
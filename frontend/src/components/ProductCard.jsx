import { Link } from "react-router-dom";
import { useContext } from "react";

import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";


function ProductCard({ product }) {


  const { addToCart } = useContext(CartContext);


  const {
    addToWishlist,
    removeFromWishlist,
    wishlist
  } = useContext(WishlistContext);



  const isWishlisted = wishlist.some(
    (item) => item._id === product._id
  );



  return (

    <div className="bg-white rounded-xl shadow-md p-5">


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



      <div className="flex gap-3 mt-4">


        <button

          onClick={() => addToCart(product)}

          className="bg-blue-600 text-white px-4 py-2 rounded-lg"

        >

          Add to Cart

        </button>



        <button

          onClick={() =>
            isWishlisted
              ? removeFromWishlist(product._id)
              : addToWishlist(product)
          }

          className={`px-4 py-2 rounded-lg ${
            isWishlisted
              ? "bg-red-500 text-white"
              : "bg-gray-200"
          }`}

        >

          ❤️

        </button>


      </div>



      <Link

        to={`/product/${product._id}`}

        className="block text-center mt-4 text-blue-600"

      >

        View Details

      </Link>


    </div>

  );

}


export default ProductCard;
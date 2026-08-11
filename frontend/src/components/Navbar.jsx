import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";

import { AuthContext } from "../context/AuthContext";
import { WishlistContext } from "../context/WishlistContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { wishlist } = useContext(WishlistContext);

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md">

      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}

        <Link
          to="/"
          className="text-2xl font-bold text-blue-600"
        >
          J&amp;K Enterprises
        </Link>


        {/* Navigation Links */}

        <div className="flex items-center gap-6">

          <Link
            to="/"
            className="text-gray-700 hover:text-blue-600"
          >
            Home
          </Link>


          <Link
            to="/products"
            className="text-gray-700 hover:text-blue-600"
          >
            Products
          </Link>


          <Link
            to="/cart"
            className="text-gray-700 hover:text-blue-600"
          >
            Cart
          </Link>


          <Link
            to="/wishlist"
            className="text-gray-700 hover:text-blue-600"
          >
            Wishlist ❤️ ({wishlist.length})
          </Link>


          {/* My Orders */}

          {user && (
            <Link
              to="/orders"
              className="text-gray-700 hover:text-blue-600"
            >
              My Orders
            </Link>
          )}


          {/* =================================
              ADMIN DASHBOARD
          ================================= */}

          {user && user.isAdmin === true && (
            <Link
              to="/admin"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 font-medium"
            >
              Admin Dashboard
            </Link>
          )}


          {/* =================================
              USER SECTION
          ================================= */}

          {user ? (
            <>
              <span className="font-medium text-green-600">
                Welcome {user.name}
              </span>

              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="text-gray-700 hover:text-blue-600"
              >
                Register
              </Link>
            </>
          )}

        </div>

      </div>

    </nav>
  );
}

export default Navbar;
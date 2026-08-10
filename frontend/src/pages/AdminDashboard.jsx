import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function AdminDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first.");
        navigate("/login");
        return;
      }

      const res = await axios.get(
        "http://localhost:5000/api/admin/test",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setUser(res.data.user);
      }

    } catch (error) {
      console.log("Admin Error:", error);

      if (error.response?.status === 403) {
        alert("Access denied. Admin only.");
      } else {
        alert(
          error.response?.data?.message ||
            "Unable to access admin dashboard."
        );
      }

      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-2xl font-semibold">
          Checking admin access...
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <div className="max-w-7xl mx-auto p-8">

        <h1 className="text-4xl font-bold mb-2">
          Admin Dashboard
        </h1>

        {user && (
          <p className="text-gray-600 mb-8">
            Welcome, {user.name}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Products */}

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-bold mb-2">
              Products
            </h2>

            <p className="text-gray-600 mb-5">
              Manage your products.
            </p>

            <button
              onClick={() => navigate("/admin/products")}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
            >
              Manage Products
            </button>

          </div>


          {/* Orders */}

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-bold mb-2">
              Orders
            </h2>

            <p className="text-gray-600 mb-5">
              View and manage customer orders.
            </p>

            <button
              onClick={() => navigate("/admin/orders")}
              className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
            >
              Manage Orders
            </button>

          </div>


          {/* Users */}

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-bold mb-2">
              Users
            </h2>

            <p className="text-gray-600 mb-5">
              View registered users.
            </p>

            <button
              onClick={() => navigate("/admin/users")}
              className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700"
            >
              Manage Users
            </button>

          </div>

        </div>

      </div>

      <Footer />

    </div>
  );
}

export default AdminDashboard;
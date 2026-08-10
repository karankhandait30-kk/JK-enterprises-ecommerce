import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function AdminProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    stock: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("token");

  // ==========================================
  // GET PRODUCTS
  // ==========================================

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://localhost:5000/api/products"
      );

      setProducts(response.data.products || []);
    } catch (error) {
      console.log("Fetch Products Error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to load products."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      image: "",
      stock: "",
    });

    setEditingId(null);
  };

  // ==========================================
  // ADD / UPDATE PRODUCT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.category ||
      !formData.image
    ) {
      alert("Please fill all required fields.");
      return;
    }

    if (!token) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    try {
      setSaving(true);

      const productData = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        image: formData.image,
        stock: Number(formData.stock) || 0,
      };

      let response;

      // UPDATE
      if (editingId) {
        response = await axios.put(
          `http://localhost:5000/api/products/${editingId}`,
          productData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert("Product updated successfully.");
      }

      // CREATE
      else {
        response = await axios.post(
          "http://localhost:5000/api/products",
          productData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert("Product created successfully.");
      }

      resetForm();
      await fetchProducts();
    } catch (error) {
      console.log("Save Product Error:", error);

      if (error.response?.status === 401) {
        alert("Please login again.");
        navigate("/login");
        return;
      }

      if (error.response?.status === 403) {
        alert("Access denied. Admin only.");
        navigate("/");
        return;
      }

      alert(
        error.response?.data?.message ||
          "Failed to save product."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // EDIT PRODUCT
  // ==========================================

  const handleEdit = (product) => {
    setEditingId(product._id);

    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      category: product.category || "",
      image: product.image || "",
      stock: product.stock || 0,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // DELETE PRODUCT
  // ==========================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    if (!token) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5000/api/products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Product deleted successfully.");

      await fetchProducts();
    } catch (error) {
      console.log("Delete Product Error:", error);

      if (error.response?.status === 401) {
        alert("Please login again.");
        navigate("/login");
        return;
      }

      if (error.response?.status === 403) {
        alert("Access denied. Admin only.");
        navigate("/");
        return;
      }

      alert(
        error.response?.data?.message ||
          "Failed to delete product."
      );
    }
  };

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto p-8">

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">
              Manage Products
            </h1>

            <p className="text-gray-600 mt-2">
              Add, edit and delete products.
            </p>
          </div>

          <button
            onClick={() => navigate("/admin")}
            className="bg-gray-700 text-white px-5 py-2 rounded-lg hover:bg-gray-800"
          >
            Back to Dashboard
          </button>
        </div>

        {/* ==========================================
            PRODUCT FORM
        ========================================== */}

        <div className="bg-white rounded-xl shadow-md p-6 mb-10">

          <h2 className="text-2xl font-bold mb-6">
            {editingId
              ? "Edit Product"
              : "Add New Product"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid md:grid-cols-2 gap-4"
          >

            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={formData.name}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <input
              type="text"
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <input
              type="number"
              name="stock"
              placeholder="Stock"
              value={formData.stock}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <input
              type="text"
              name="image"
              placeholder="Image URL"
              value={formData.image}
              onChange={handleChange}
              className="border p-3 rounded-lg md:col-span-2"
            />

            <textarea
              name="description"
              placeholder="Product Description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="border p-3 rounded-lg md:col-span-2"
            />

            <div className="md:col-span-2 flex gap-4">

              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Product"
                  : "Add Product"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
                >
                  Cancel Edit
                </button>
              )}

            </div>

          </form>

        </div>

        {/* ==========================================
            PRODUCT LIST
        ========================================== */}

        <div>

          <h2 className="text-2xl font-bold mb-5">
            Existing Products
          </h2>

          {loading ? (

            <p className="text-gray-600">
              Loading products...
            </p>

          ) : products.length === 0 ? (

            <div className="bg-white rounded-xl shadow p-8 text-center">
              <p className="text-gray-600">
                No products found.
              </p>
            </div>

          ) : (

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

              {products.map((product) => (

                <div
                  key={product._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                >

                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />

                  <div className="p-5">

                    <h3 className="text-xl font-bold">
                      {product.name}
                    </h3>

                    <p className="text-gray-500 mt-1">
                      {product.category}
                    </p>

                    <p className="text-lg font-semibold mt-3">
                      ₹{product.price}
                    </p>

                    <p className="text-gray-600 mt-1">
                      Stock: {product.stock ?? 0}
                    </p>

                    <p className="text-gray-600 mt-3 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex gap-3 mt-5">

                      <button
                        onClick={() => handleEdit(product)}
                        className="flex-1 bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(product._id)
                        }
                        className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

      <Footer />
    </>
  );
}

export default AdminProducts;
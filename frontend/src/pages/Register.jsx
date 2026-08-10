import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      alert("Please fill all details");
      return;
    }

    try {
      console.log("Sending Data:", formData);

      const res = await axios.post(
        "http://localhost:5000/api/users/register",
        formData
      );

      console.log("Response:", res.data);

      alert(res.data.message);

      setFormData({
        name: "",
        email: "",
        password: "",
      });

      navigate("/login");
    } catch (error) {
      console.log("Full Error:", error);

      if (error.response) {
        console.log("Response Data:", error.response.data);
        console.log("Status:", error.response.status);
      }

      alert(error.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <section className="flex justify-center py-16">
        <div className="bg-white p-8 rounded-xl shadow-md w-96">
          <h1 className="text-3xl font-bold text-center mb-6">
            Create Account
          </h1>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg mb-4"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg mb-4"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg mb-4"
          />

          <button
            onClick={handleRegister}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            Register
          </button>

          <p className="text-center mt-5">
            Already have an account?
            <Link to="/login" className="text-blue-600 ml-2">
              Login
            </Link>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Register;
import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const OrderContext = createContext();

function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // GET MY ORDERS FROM BACKEND
  // ==========================================

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await axios.get(
        "http://localhost:5000/api/orders/my-orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(response.data.orders || []);
    } catch (error) {
      console.log("Fetch Orders Error:", error);

      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD ORDERS
  // ==========================================

  useEffect(() => {
    fetchOrders();
  }, []);

  // ==========================================
  // ADD ORDER
  // ==========================================

  const addOrder = (order) => {
    setOrders((previousOrders) => [
      order,
      ...previousOrders,
    ]);
  };

  // ==========================================
  // REFRESH ORDERS
  // ==========================================

  const refreshOrders = () => {
    fetchOrders();
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        loading,
        addOrder,
        refreshOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export default OrderProvider;
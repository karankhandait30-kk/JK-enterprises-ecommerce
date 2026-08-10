import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import { BrowserRouter } from "react-router-dom";

import AuthProvider from "./context/AuthContext";
import CartProvider from "./context/CartContext";
import WishlistProvider from "./context/WishlistContext";
import OrderProvider from "./context/OrderContext";

import "./index.css";


ReactDOM.createRoot(document.getElementById("root")).render(

  <React.StrictMode>

    <BrowserRouter>

      <AuthProvider>

        <CartProvider>

          <WishlistProvider>

            <OrderProvider>

              <App />

            </OrderProvider>

          </WishlistProvider>

        </CartProvider>

      </AuthProvider>

    </BrowserRouter>

  </React.StrictMode>

);
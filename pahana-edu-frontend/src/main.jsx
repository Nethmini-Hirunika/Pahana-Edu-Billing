import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import AppRouter from "./routes/AppRouter";
import { CartProvider } from "./store/CartContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CartProvider>
      <AppRouter />
    </CartProvider>
  </React.StrictMode>
);





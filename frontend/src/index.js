import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ContentProvider } from "./context/ContentContext";
import { CartProvider } from "./context/CartContext";
import { NotificationProvider } from "./context/NotificationContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  
  <React.StrictMode>
    <BrowserRouter>
    <CartProvider>
      <AuthProvider>
        <ContentProvider>
        <NotificationProvider>
          <App />
          </NotificationProvider>
        </ContentProvider>
      </AuthProvider>
       </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
);

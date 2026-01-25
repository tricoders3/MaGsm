import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ContentProvider } from "./context/ContentContext";
import { CartProvider } from "./context/CartContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  
  <React.StrictMode>
    <BrowserRouter>
    <CartProvider>
      <AuthProvider>
        <ContentProvider>
          
          <App />
         
        </ContentProvider>
      </AuthProvider>
       </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
);

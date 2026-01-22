// AuthContext.js or CartContext.js
import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);

  return (
    <CartContext.Provider value={{ cartCount, setCartCount, favoritesCount, setFavoritesCount }}>
      {children}
    </CartContext.Provider>
  );
};

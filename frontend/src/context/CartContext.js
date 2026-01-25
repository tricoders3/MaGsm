import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../constante";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(() =>
    Number(localStorage.getItem("cartCount")) || 0
  );
  const [favoritesCount, setFavoritesCount] = useState(() =>
    Number(localStorage.getItem("favoritesCount")) || 0
  );

  // 🔹 Fetch cart & favorites on app start
  useEffect(() => {
    const fetchCartAndFavorites = async () => {
      try {
        // Cart
        const cartRes = await axios.get(`${BASE_URL}/api/cart`, { withCredentials: true });
        const cartTotal = cartRes.data.cart.items.reduce((sum, i) => sum + i.quantity, 0);
        setCartCount(cartTotal);
        localStorage.setItem("cartCount", cartTotal);

        // Favorites
        const favRes = await axios.get(`${BASE_URL}/api/favorites`, { withCredentials: true });
        const favTotal = favRes.data.length;
        setFavoritesCount(favTotal);
        localStorage.setItem("favoritesCount", favTotal);
      } catch (err) {
        console.error("Error fetching cart/favorites", err);
      }
    };

    fetchCartAndFavorites();
  }, []);

  // Persist to localStorage
  useEffect(() => localStorage.setItem("cartCount", cartCount), [cartCount]);
  useEffect(() => localStorage.setItem("favoritesCount", favoritesCount), [favoritesCount]);

  const resetCart = () => {
    setCartCount(0);
    setFavoritesCount(0);
    localStorage.removeItem("cartCount");
    localStorage.removeItem("favoritesCount");
  };

  return (
    <CartContext.Provider
      value={{
        cartCount,
        setCartCount,
        favoritesCount,
        setFavoritesCount,
        resetCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

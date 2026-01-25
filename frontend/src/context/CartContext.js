import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../constante";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]); // ✅ store full cart
  const [cartCount, setCartCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);

  // Fetch cart & favorites on app start
  useEffect(() => {
    const fetchCartAndFavorites = async () => {
      try {
        // Cart
        const cartRes = await axios.get(`${BASE_URL}/api/cart`, { withCredentials: true });
        const cartItems = cartRes.data.cart?.items || [];
        setCart(cartItems);
        const cartTotal = cartItems.reduce((sum, i) => sum + i.quantity, 0);
        setCartCount(cartTotal);

        // Favorites
        const favRes = await axios.get(`${BASE_URL}/api/favorites`, { withCredentials: true });
        const favTotal = favRes.data.length;
        setFavoritesCount(favTotal);
      } catch (err) {
        console.error("Error fetching cart/favorites", err);
      }
    };

    fetchCartAndFavorites();
  }, []);

  const resetCart = () => {
    setCart([]);
    setCartCount(0);
    setFavoritesCount(0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
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
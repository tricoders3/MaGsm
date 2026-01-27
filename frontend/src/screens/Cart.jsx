import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { FaTrash, FaMinus, FaPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../constante";
import EmptyCart from "../assets/images/empty_cart.png";
import { useCart } from "../context/CartContext";
import AlertToast from "../components/AlertToast";

export default function Cart() {
  const navigate = useNavigate();
  const { cart, setCart, cartCount, setCartCount } = useCart();

  const [loading, setLoading] = useState(true);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Fetch cart on mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/api/cart`, { withCredentials: true });
        const items = res.data.cart?.items || [];
        setCart(items); // ✅ store full cart in context
        setCartCount(items.reduce((sum, i) => sum + i.quantity, 0));
      } catch (error) {
        console.error("Erreur en récupérant le panier :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [setCart, setCartCount]);

  // Increase quantity
  const increaseQuantity = async (productId) => {
    const item = cart.find((i) => i.product._id === productId);
    if (!item) return;
    const newQty = item.quantity + 1;
    try {
      await axios.put(`${BASE_URL}/api/cart/${productId}`, { quantity: newQty }, { withCredentials: true });
      const newCart = cart.map((i) =>
        i.product._id === productId ? { ...i, quantity: newQty } : i
      );
      setCart(newCart);
      setCartCount(newCart.reduce((sum, i) => sum + i.quantity, 0));
    } catch (error) {
      console.error("Erreur en augmentant la quantité :", error);
    }
  };

  // Decrease quantity
  const decreaseQuantity = async (productId) => {
    const item = cart.find((i) => i.product._id === productId);
    if (!item || item.quantity <= 1) return;
    const newQty = item.quantity - 1;
    try {
      await axios.put(`${BASE_URL}/api/cart/${productId}`, { quantity: newQty }, { withCredentials: true });
      const newCart = cart.map((i) =>
        i.product._id === productId ? { ...i, quantity: newQty } : i
      );
      setCart(newCart);
      setCartCount(newCart.reduce((sum, i) => sum + i.quantity, 0));
    } catch (error) {
      console.error("Erreur en diminuant la quantité :", error);
    }
  };

  // Remove item
  const removeItem = async (productId) => {
    try {
      await axios.delete(`${BASE_URL}/api/cart/${productId}`, { withCredentials: true });
      const newCart = cart.filter((i) => i.product._id !== productId);
      setCart(newCart);
      setCartCount(newCart.reduce((sum, i) => sum + i.quantity, 0));
    } catch (error) {
      console.error("Erreur en supprimant le produit :", error);
    }
  };

  // Total price
  const totalPrice = cart?.reduce((sum, item) => sum + item.product.price * item.quantity, 0) || 0;

  // Navigate to checkout
  const handleCreateOrder = () => {
    if (!cart || cart.length === 0) return;
    navigate("/checkout");
  };

  if (loading) return null;

  if (!cart || cart.length === 0) {
    return (
      <div className="text-center mt-5">
        <h2>Votre panier est vide</h2>
        <img src={EmptyCart} alt="Empty Cart" style={{ width: 200 }} />
        <div className="mt-3">
          <Link to="/" className="btn btn-dark">
            Continuer vos achats
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5">
      <h3 className="mb-4 text-dark">Votre Panier</h3>
      <div className="row">
        <div className="col-md-8">
          {cart.map((item) => (
            <div
              key={item.product._id}
              className="d-flex align-items-center justify-content-between mb-3 p-3 bg-white rounded shadow-sm"
            >
              <div className="d-flex align-items-center">
                <img
                  src={item.product.images?.[0]?.url || "https://via.placeholder.com/100"}
                  alt={item.product.name}
                  className="img-fluid"
                  style={{ width: 100, height: 100, objectFit: "contain" }}
                />
                <div className="ms-3">
                  <h5 className="text-dark">{item.product.name}</h5>
                  <p className="text-secondary mb-1">Prix: {item.product.price} TND</p>
                  <div className="d-flex align-items-center gap-2">
                    <Button size="sm" variant="secondary" onClick={() => decreaseQuantity(item.product._id)}>
                      <FaMinus />
                    </Button>
                    <span className="text-dark">{item.quantity}</span>
                    <Button size="sm" variant="secondary" onClick={() => increaseQuantity(item.product._id)}>
                      <FaPlus />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="text-end">
                <h5 className="text-dark">{item.product.price * item.quantity} TND</h5>
                <Button variant="danger" size="sm" className="mt-2" onClick={() => removeItem(item.product._id)}>
                  <FaTrash />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="col-md-4">
          <div className="p-3 bg-white rounded shadow-sm">
            <Button
              variant="dark"
              className="w-100 mb-2"
              onClick={handleCreateOrder}
              disabled={creatingOrder || loading || cart.length === 0} 
            >
              {creatingOrder ? "Création de la commande..." : "Acheter maintenant"}
            </Button>

            <Link to="/" className="btn btn-outline-secondary w-100">
              Continuer vos achats
            </Link>
          </div>
        </div>
      </div>

      <AlertToast
        show={showToast}
        onClose={() => setShowToast(false)}
        type="success"
        message="Commande créée avec succès ! Paiement à la livraison."
      />
    </div>
  );
}
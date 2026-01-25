import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { Spinner } from "react-bootstrap";
import { FaTrash, FaMinus, FaPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../constante";
import EmptyCart from "../assets/images/empty_cart.png";
import { useCart } from "../context/CartContext";

function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const { setCartCount } = useCart();

  // Fetch cart from backend on mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/cart`, { withCredentials: true });
        setCart(res.data.cart.items || []);
        const count = res.data.cart.items.reduce(
  (sum, item) => sum + item.quantity,
  0
);

setCartCount(count);

        setLoading(false);
      } catch (error) {
        console.error("Erreur en récupérant le panier :", error);
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const increaseQuantity = async (productId) => {
    const item = cart.find((i) => i.product._id === productId);
    const newQty = item.quantity + 1;

    try {
      await axios.put(
        `${BASE_URL}/api/cart/${productId}`,
        { quantity: newQty },
        { withCredentials: true }
      );

      setCart((prev) =>
        prev.map((i) =>
          i.product._id === productId ? { ...i, quantity: newQty } : i
        )
      );
      setCartCount(cart.reduce((sum, i) => sum + (i.product._id === productId ? newQty : i.quantity), 0));
    } catch (error) {
      console.error("Erreur en augmentant la quantité :", error);
    }
  };

  const decreaseQuantity = async (productId) => {
    const item = cart.find((i) => i.product._id === productId);
    if (item.quantity <= 1) return;

    const newQty = item.quantity - 1;

    try {
      await axios.put(
        `${BASE_URL}/api/cart/${productId}`,
        { quantity: newQty },
        { withCredentials: true }
      );

      setCart((prev) =>
        prev.map((i) =>
          i.product._id === productId ? { ...i, quantity: newQty } : i
        )
      );
      setCartCount(cart.reduce((sum, i) => sum + (i.product._id === productId ? newQty : i.quantity), 0));
    } catch (error) {
      console.error("Erreur en diminuant la quantité :", error);
    }
  };

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

  const totalPrice = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleCreateOrder = async () => {
    if (cart.length === 0) return;
    setCreatingOrder(true);

    try {
      // Create order 
      const { data } = await axios.post(
        `${BASE_URL}/api/orders`,
        {},
        { withCredentials: true }
      );

      setCart([]);
      setCartCount(0); // clear badge instantly
      alert("Commande créée avec succès ! Paiement à la livraison.");
      const newOrderId = data?.order?._id;
      if (newOrderId) {
        navigate(`/order-confirmation/${newOrderId}`);
      } else {
        navigate("/orders");
      }
    } catch (error) {
      console.error("Erreur lors de la création de la commande :", error);
      alert("Impossible de créer la commande, réessayez !");
    } finally {
      setCreatingOrder(false);
    }
  };

  if (loading) return null;


  if (cart.length === 0) {
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
            <div className="d-flex align-items-center justify-content-between mb-3 p-3 bg-white rounded shadow-sm" key={item.product._id}>
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
            <ul className="list-unstyled mb-3">
              <li className="d-flex justify-content-between text-dark">Sous-total: <span>{totalPrice} TND</span></li>
              <li className="d-flex justify-content-between text-dark">Livraison: <span>10 TND</span></li>
              <li className="d-flex justify-content-between text-dark">Taxes: <span>10 TND</span></li>
              <hr />
              <li className="d-flex justify-content-between fw-bold text-dark">Total: <span>{totalPrice + 20} TND</span></li>
            </ul>

            <Button variant="dark" className="w-100 mb-2" onClick={handleCreateOrder} disabled={creatingOrder}>
              {creatingOrder ? "Création de la commande..." : "Acheter maintenant"}
            </Button>

            <Link to="/" className="btn btn-outline-secondary w-100">
              Continuer vos achats
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;

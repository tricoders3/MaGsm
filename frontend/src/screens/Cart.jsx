import React, { useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { FaTrash, FaMinus, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../constante";
import EmptyCart from "../assets/images/empty_cart.png";

function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch cart from backend
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/cart`, {
          withCredentials: true,
        });
        setCart(res.data.cart.items || []);
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
    } catch (error) {
      console.error("Erreur en diminuant la quantité :", error);
    }
  };

  const removeItem = async (productId) => {
    try {
      await axios.delete(`${BASE_URL}/api/cart/${productId}`, {
        withCredentials: true,
      });
      setCart((prev) => prev.filter((i) => i.product._id !== productId));
    } catch (error) {
      console.error("Erreur en supprimant le produit :", error);
    }
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="text-center mt-5">
        <h2>Votre panier est vide</h2>
        <img src={EmptyCart} alt="Empty Cart" style={{ width: 200 }} />
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-dark">🛒 Votre Panier</h3>
      <div className="row">
        {/* Produits */}
        <div className="col-md-8">
          {cart.map((item) => (
            <div
              className="d-flex align-items-center justify-content-between mb-3 p-3 bg-white rounded shadow-sm"
              key={item.product._id}
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
                  <p className="text-secondary mb-1">
                    Prix: {item.product.price} TND
                  </p>
                  <div className="d-flex align-items-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => decreaseQuantity(item.product._id)}
                    >
                      <FaMinus />
                    </Button>
                    <span className="text-dark">{item.quantity}</span>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => increaseQuantity(item.product._id)}
                    >
                      <FaPlus />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="text-end">
                <h5 className="text-dark">
                  {item.product.price * item.quantity} TND
                </h5>
                <Button
                  variant="danger"
                  size="sm"
                  className="mt-2"
                  onClick={() => removeItem(item.product._id)}
                >
                  <FaTrash />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Récapitulatif */}
        <div className="col-md-4">
          <div className="p-3 bg-white rounded shadow-sm">
            <ul className="list-unstyled mb-3">
              <li className="d-flex justify-content-between text-dark">
                Sous-total: <span>{totalPrice} TND</span>
              </li>
              <li className="d-flex justify-content-between text-dark">
                Livraison: <span>10 TND</span>
              </li>
              <li className="d-flex justify-content-between text-dark">
                Taxes: <span>10 TND</span>
              </li>
              <hr />
              <li className="d-flex justify-content-between fw-bold text-dark">
                Total: <span>{totalPrice + 20} TND</span>
              </li>
            </ul>

            <Button variant="dark" className="w-100 mb-2">
              Acheter maintenant
            </Button>
            <Button variant="outline-secondary" className="w-100">
              <Link to={"/"} className="text-decoration-none">
                Continuer vos achats
              </Link>
            </Button>

            <div className="d-flex justify-content-center gap-2 mt-3">
              <img
                src="https://readymadeui.com/images/master.webp"
                alt="card1"
                style={{ width: 40 }}
              />
              <img
                src="https://readymadeui.com/images/visa.webp"
                alt="card2"
                style={{ width: 40 }}
              />
              <img
                src="https://readymadeui.com/images/american-express.webp"
                alt="card3"
                style={{ width: 40 }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;

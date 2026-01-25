import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../constante";
import { useCart } from "../context/CartContext";
import AlertToast from "../components/AlertToast";

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, setCart, setCartCount } = useCart();

  const SHIPPING_FEE = 20;

  const [form, setForm] = useState({
    fullAddress: "",
    street: "",
    postalCode: "",
    city: "",
    region: "",
    country: "Tunisie",
  });

  const [loading, setLoading] = useState(true); // 🔹 loading state
  const [submitting, setSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Fetch cart if empty
  useEffect(() => {
    const fetchCart = async () => {
      if (!cart || cart.length === 0) {
        try {
          setLoading(true);
          const res = await axios.get(`${BASE_URL}/api/cart`, { withCredentials: true });
          const items = res.data.cart?.items || [];
          setCart(items);
          setCartCount(items.reduce((sum, i) => sum + i.quantity, 0));
        } catch (err) {
          console.error("Erreur en récupérant le panier :", err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchCart();
  }, [cart, setCart, setCartCount]);

  const isValid = form.fullAddress && form.street && form.postalCode && form.city;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirm = async () => {
    if (!isValid || !cart || cart.length === 0) return;
    setSubmitting(true);

    try {
      const { data } = await axios.post(
        `${BASE_URL}/api/orders`,
        {
          shippingAddress: form,
          items: cart.map((i) => ({
            product: i.product._id,
            quantity: i.quantity,
            name: i.product.name,
            price: i.product.price,
          })),
        },
        { withCredentials: true }
      );

      const newOrderId = data?.order?._id;

      // Clear cart
      setCart([]);
      setCartCount(0);

      // Show success toast
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
        if (newOrderId) navigate(`/order-confirmation/${newOrderId}`);
        else navigate("/orders");
      }, 1500);
    } catch (error) {
      console.error("Erreur lors de la création de la commande :", error);
      alert("Impossible de créer la commande, réessayez !");
    } finally {
      setSubmitting(false);
    }
  };

  const totalPrice = cart?.reduce((sum, item) => sum + (item.product.price || 0) * item.quantity, 0) || 0;

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-dark" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
        <p className="mt-3">Chargement du panier...</p>
      </div>
    );
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="text-center mt-5">
        <h2>Votre panier est vide</h2>
        <p>Ajoutez des produits avant de passer à la livraison.</p>
        <button className="btn btn-dark" onClick={() => navigate("/")}>
          Continuer vos achats
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5">
      <div className="row g-4">

        {/* LEFT — SHIPPING FORM */}
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <h4 className="fw-bold mb-3">Adresse de livraison</h4>

            <input type="text" name="fullAddress" value={form.fullAddress} onChange={handleChange} className="form-control mb-3" placeholder="Adresse complète" required />
            <input type="text" name="street" value={form.street} onChange={handleChange} className="form-control mb-3" placeholder="Rue" required />
            <input type="text" name="postalCode" value={form.postalCode} onChange={handleChange} className="form-control mb-3" placeholder="Code postal" required />
            <input type="text" name="city" value={form.city} onChange={handleChange} className="form-control mb-3" placeholder="Ville" required />
            <input type="text" name="region" value={form.region} onChange={handleChange} className="form-control mb-3" placeholder="Région (optionnel)" />
            <input type="text" name="country" value={form.country} onChange={handleChange} className="form-control mb-3" placeholder="Pays" />

            <button
                className="btn btn-dark w-100 mt-3"
                disabled={!isValid || submitting}
                onClick={handleConfirm} 
                >
                {submitting ? "Création de la commande..." : "Confirmer la commande"}
            </button>
          </div>
        </div>

        {/* RIGHT — ORDER SUMMARY */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <h5 className="fw-bold mb-3">Résumé de la commande</h5>

            {cart.map((item) => (
              <div key={item.product._id} className="d-flex justify-content-between mb-2">
                <span>{item.product.name} × {item.quantity}</span>
                <span>{(item.product.price || 0) * item.quantity} TND</span>
              </div>
            ))}

            <hr />
            <div className="d-flex justify-content-between fw-bold text-dark">
              <span>Total</span>
              <span>{totalPrice} TND</span>
            </div>
          </div>
        </div>
      </div>

      {/* SUCCESS TOAST */}
      <AlertToast show={showToast} onClose={() => setShowToast(false)} type="success" message="Commande créée avec succès !" />
    </div>
  );
}
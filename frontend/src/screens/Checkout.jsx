// src/pages/Checkout.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../constante";
import { useCart } from "../context/CartContext";
import AlertToast from "../components/AlertToast";

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, total, setCart, setCartCount } = useCart();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    note: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const isValid =
    form.fullName && form.phone && form.address && form.city;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirm = async () => {
    if (!isValid || cart.length === 0) return;
    setSubmitting(true);

    try {
      const { data } = await axios.post(
        `${BASE_URL}/api/orders`,
        { shipping: form, items: cart, total },
        { withCredentials: true }
      );

      const newOrderId = data?.order?._id;

      // Clear cart
      setCart([]);
      setCartCount(0);

      // Show success toast
      setShowToast(true);

      // Redirect after short delay
      setTimeout(() => {
        setShowToast(false);
        if (newOrderId) {
          navigate(`/order-confirmation/${newOrderId}`);
        } else {
          navigate("/orders");
        }
      }, 1500);
    } catch (error) {
      console.error("Erreur lors de la création de la commande :", error);
      alert("Impossible de créer la commande, réessayez !");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="row g-4">

        {/* LEFT — SHIPPING FORM */}
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <h4 className="fw-bold mb-3">Adresse de livraison</h4>

            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className="form-control mb-3"
              placeholder="Nom complet"
              required
            />

            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="form-control mb-3"
              placeholder="Téléphone"
              required
            />

            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              className="form-control mb-3"
              placeholder="Adresse complète"
              required
            />

            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              className="form-control mb-3"
              placeholder="Ville"
              required
            />



            <button
              className="btn btn-primary-redesign w-100 mt-3"
              disabled={!isValid || submitting}
              onClick={handleConfirm}
            >
              {submitting ? "Envoi..." : "Confirmer la commande"}
            </button>
          </div>
        </div>

        {/* RIGHT — ORDER SUMMARY */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <h5 className="fw-bold text-dark mb-3">Résumé de la commande</h5>

         

            <hr />
            <div className="d-flex justify-content-between fw-bold">
              <span>Total</span>
              <span>{total} TND</span>
            </div>
          </div>
        </div>
      </div>

      {/* SUCCESS TOAST */}
      <AlertToast
        show={showToast}
        onClose={() => setShowToast(false)}
        type="success"
        message="Commande créée avec succès !"
      />
    </div>
  );
}
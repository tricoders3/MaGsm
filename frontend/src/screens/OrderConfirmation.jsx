import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../constante";
import { FiCheckCircle, FiPackage, FiArrowRight } from "react-icons/fi";
export default function OrderConfirmation() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        // Use user orders endpoint, then find by id on the client side
        const { data } = await axios.get(`${BASE_URL}/api/orders`, { withCredentials: true });
        const found = (data || []).find((o) => String(o._id) === String(orderId));
        if (!found) {
          setError("Commande introuvable");
        } else {
          setOrder(found);
        }
      } catch (e) {
        setError("Impossible de charger la commande");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [orderId]);

const deliveryFee = order?.deliveryFee || 7; // frais de livraison par défaut
const discount = order?.discount || 0;       // remise appliquée
const subTotal = (order?.items || []).reduce(
  (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
  0
);
const totalAfterDiscount = subTotal + deliveryFee - discount;

  if (loading) return null;

  if (error) {
    return (
      <div className="container mt-5">
        <div className="text-center text-muted">
          <p>{error}</p>
          <Link to="/orders" className="btn btn-primary-redesign mt-3">Voir mes commandes</Link>
        </div>
      </div>
    );
 




  }

  return (
    <div className="container mt-md-5 mb-5">
    <div className="card border-0 shadow-lg rounded-5 overflow-hidden">
      <div className="p-4 text-center">
        <FiCheckCircle size={40} className="text-success mb-2" />
        <h4 className="fw-bold text-dark mb-1">Commande confirmée</h4>
        <p className="text-muted mb-0">
          Merci pour votre achat. Votre commande a bien été enregistrée.
        </p>
        <span className="badge bg-dark-subtle text-dark mt-3 me-2">
          Commande #{order._id?.slice(-6)}
        </span>
      </div>
  
      <div className="card-body p-4 p-md-5">
  
        {/* SUMMARY */}
    
        {/* PRODUCTS */}
        <h6 className="fw-bold text-dark d-flex align-items-center gap-2 mb-3">
          <FiPackage /> Produits commandés
        </h6>
  
        <div className="product-list mb-4">
          {(order.items || []).map((it, idx) => (
            <div
              key={idx}
              className="d-flex justify-content-between align-items-center py-3 border-bottom"
            >
              <div>
                <div className="fw-semibold">
                  {it.product?.name || "Produit"}
                </div>
                <small className="text-muted">
                  Quantité : {it.quantity}
                </small>
              </div>
              <strong>
                {(it.price || 0) * (it.quantity || 0)} TND
              </strong>
            </div>
          ))}
        </div>
<h6 className="fw-bold text-dark d-flex align-items-center gap-2 mb-3">
  Détails de facturation
</h6>
<div className="billingDetails mb-4 p-3 bg-light rounded">
  <div><strong>Nom :</strong> {order.billingDetails?.name}</div>
  <div><strong>Email :</strong> {order.billingDetails?.email}</div>
  <div><strong>Téléphone :</strong> {order.billingDetails?.phone}</div>
</div>

<h6 className="fw-bold text-dark d-flex align-items-center gap-2 mb-3 mt-4">
  Adresse de livraison
</h6>
<div className="shipping-address mb-4 p-3 bg-light rounded">
  <div><strong>Rue :</strong> {order.shippingAddress?.street}</div>
  <div><strong>Code postal :</strong> {order.shippingAddress?.postalCode}</div>
  <div><strong>Ville :</strong> {order.shippingAddress?.city}</div>
  {order.shippingAddress?.region && <div><strong>Région :</strong> {order.shippingAddress.region}</div>}
  <div><strong>Pays :</strong> {order.shippingAddress?.country || "Tunisie"}</div>
</div>
        <div className="row g-4 mb-4">
          <div className="col-md-5">
            <div className="summary-box">
              <span>Statut</span>
              <strong
                className={`status-badge ${
                  order.status === "shipped"
                    ? "status-shipped"
                    : order.status === "delivered"
                    ? "status-delivered"
                    : order.status === "cancelled"
                    ? "status-cancelled"
                    : "status-pending"
                }`}
              >
                {order.status}
              </strong>
            </div>
          </div>

  
          <div className="col-md-6">
  <div className="summary-box">
    <span>Total de la commande</span>
    <div className="d-flex flex-column">
      <small>Sous-total : {subTotal} TND</small>
      <small>Livraison : {deliveryFee} TND</small>
      {discount > 0 && (
        <small className="text-success">Remise fidélité : -{discount} TND</small>
      )}
      <strong>Total à payer : {totalAfterDiscount} TND</strong>
    </div>
  </div>
</div>

        </div>
  
        {/* ACTIONS */}
        <div className="d-flex flex-column flex-sm-row gap-3 justify-content-end">
          <Link to="/products" className="btn btn-outline-secondary px-4">
            Continuer vos achats
          </Link>
          <Link
            to="/profile?tab=orders"
            className="btn btn-primary-redesign px-4"
            >
            Voir mes commandes
            </Link>

        </div>
      </div>
    </div>
  </div>
  );
}

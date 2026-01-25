import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../constante";

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
    <div className="container mt-5 mb-5">
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Commande confirmée</h5>
          <span className="count-pill">#{order._id?.slice(-6)}</span>
        </div>
        <div className="card-body">
          <p className="mb-2 text-muted">Merci pour votre achat. Votre commande a été créée avec succès.</p>
          <div className="mb-3">
            <div className="d-flex justify-content-between"><span>Statut</span><strong>{order.status}</strong></div>
            <div className="d-flex justify-content-between"><span>Articles</span><strong>{order.items?.length || 0}</strong></div>
            <div className="d-flex justify-content-between"><span>Total</span><strong>{order.total} TND</strong></div>
          </div>
          <h6 className="mt-4">Produits</h6>
          <ul className="list-unstyled">
            {(order.items || []).map((it, idx) => (
              <li key={idx} className="d-flex justify-content-between border-bottom py-2">
                <span>{it.product?.name || "Produit"} × {it.quantity}</span>
                <span>{(it.price || 0) * (it.quantity || 0)} TND</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 d-flex gap-2">
            <Link to="/products" className="btn btn-outline-secondary">Continuer vos achats</Link>
            <Link to="/orders" className="btn btn-primary-redesign">Voir mes commandes</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

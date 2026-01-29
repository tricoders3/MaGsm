import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../constante";
import { toast } from "react-toastify";

const HistoriqueCommandes = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(
          `${BASE_URL}/api/orders/my`,
          { withCredentials: true }
        );

        setOrders(data || []);
      } catch (err) {
        toast.error("Erreur lors du chargement des commandes");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="card shadow-lg rounded-4 border-0">
          <div className="card-body p-4">
            <h4 className="card-title mb-4">Historique des commandes</h4>

            {orders.length === 0 ? (
              <p className="text-muted">Aucune commande trouvée.</p>
            ) : (
              <ul className="list-unstyled">
                {orders.map((order) => (
                  <li
                    key={order._id}
                    className="mb-3 p-3 rounded-3"
                    style={{ backgroundColor: "#f8f9fa" }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>Commande #{order._id.slice(-6)}</strong>
                        <br />
                        <small className="text-muted">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </small>
                      </div>

       <div className="text-end d-flex align-items-center justify-content-end gap-3">
  <div className="fw-bold text-primary">
    {order.total} TND
  </div>

  <button
    className="btn btn-sm btn-outline-primary"
    onClick={() =>
      setSelectedOrder(
        selectedOrder?._id === order._id ? null : order
      )
    }
  >
    {selectedOrder?._id === order._id
      ? "Masquer"
      : "Voir détails"}
  </button>
</div>
</div>

                    {/* 🔽 Détails */}
                    {selectedOrder?._id === order._id && (
                      <div className="mt-4 border-top pt-3">
                        <h6 style={{ color: "#070707" }}>📦 Produits</h6>
                        {order.items.map((item) => (
                          <div key={item._id} className="mb-2">
                            <strong>{item.name}</strong>
                            <br />
                            Quantité : {item.quantity} <br />
                            Prix : {item.price} TND
                          </div>
                        ))}

                        <hr />

                        <h6 style={{ color: "#070707" }}>📍 Adresse de livraison</h6>
                        <p className="mb-1">
                          {order.shippingAddress.street},{" "}
                          {order.shippingAddress.city}
                        </p>
                        <p className="mb-1">
                          {order.shippingAddress.postalCode},{" "}
                          {order.shippingAddress.country}
                        </p>

                        <hr />

                        <h6   style={{ color: "#070707" }}>🧾 Informations</h6>
                        <p>Statut : <strong>{order.status}</strong></p>
                        <p>Total : <strong>{order.total} TND</strong></p>
                        <p>Points gagnés : <strong>{order.pointsEarned}</strong></p>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoriqueCommandes;

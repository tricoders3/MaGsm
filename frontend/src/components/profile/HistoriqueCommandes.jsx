import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../constante";
import { toast } from "react-toastify";

const HistoriqueCommandes = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/orders/my`, {
          withCredentials: true,
        });
        setOrders(data.orders || []);
      } catch (err) {
        toast.error(err.response?.data?.message || "Erreur lors du chargement des commandes");
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
            <p className="text-muted">Vous n’avez passé aucune commande pour le moment.</p>
          ) : (
            <ul className="list-unstyled">
              {orders.map((order) => (
                <li
                  key={order._id}
                  className="d-flex justify-content-between align-items-center mb-3 p-3 rounded-3"
                  style={{ backgroundColor: "#f8f9fa" }}
                >
                  <div>
                    <strong>Commande #{order._id.slice(-6)}</strong>
                    <br />
                    <small className="text-muted">{new Date(order.createdAt).toLocaleDateString()}</small>
                  </div>
                  <span className="fw-semibold text-primary">{order.total} TND</span>
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

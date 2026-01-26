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
        const { data } = await axios.get(`${BASE_URL}/api/user/orders`, {
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
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body">
        <h5 className="card-title mb-3">Historique des commandes</h5>
        {loading ? (
          <p>Chargement...</p>
        ) : orders.length === 0 ? (
          <p>Aucune commande trouvée.</p>
        ) : (
          <ul className="list-group list-group-flush">
            {orders.map((order) => (
              <li key={order._id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>Commande #{order._id.slice(-6)}</strong>
                  <br />
                  <small>{new Date(order.createdAt).toLocaleDateString()}</small>
                </div>
                <span>{order.total} €</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default HistoriqueCommandes;

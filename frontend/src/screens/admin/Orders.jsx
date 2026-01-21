import { useEffect, useState } from "react";
import axios from "axios";
import { FiTrash2 } from "react-icons/fi"; // trash icon
import BASE_URL from "../../constante";

const statusOptions = ["pending", "delivered", "cancelled"];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.get(`${BASE_URL}/api/orders`, { withCredentials: true });
      setOrders(data);
    } catch (err) {
      setError("Erreur lors du chargement des commandes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(
        `${BASE_URL}/api/orders/${orderId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      setOrders(prev => prev.map(o => (o._id === orderId ? { ...o, status: newStatus } : o)));
    } catch (err) {
      alert("Impossible de mettre à jour le statut");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette commande ?")) return;

    try {
      await axios.delete(`${BASE_URL}/api/orders/${orderId}`, { withCredentials: true });
      setOrders(prev => prev.filter(o => o._id !== orderId));
      alert("Commande supprimée avec succès !");
    } catch (err) {
      alert("Impossible de supprimer la commande");
    }
  };

  const handleDeleteAllOrders = async () => {
    if (!window.confirm("Voulez-vous vraiment supprimer toutes les commandes ?")) return;

    try {
      await axios.delete(`${BASE_URL}/api/orders`, { withCredentials: true });
      setOrders([]);
      alert("Toutes les commandes ont été supprimées !");
    } catch (err) {
      alert("Impossible de supprimer toutes les commandes");
    }
  };

  return (
    <div className="container py-4">
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
          <div>
            <h5 className="text-dark fw-bold mb-0 d-flex align-items-center gap-2">
              Commandes
              <span className="users-count-pill">{orders.length}</span>
            </h5>
            <small className="text-muted">Gérez les commandes et leurs statuts.</small>
          </div>
          <button
            className="btn btn-danger btn-sm"
            onClick={handleDeleteAllOrders}
          >
            Supprimer toutes les commandes
          </button>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" />
              <p className="mt-2 mb-0 text-muted">Chargement des commandes…</p>
            </div>
          ) : error ? (
            <p className="text-danger p-4">{error}</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover table-sm align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4">ID</th>
                    <th>Client</th>
                    <th>Produits</th>
                    <th className="text-center">Quantité</th>
                    <th>Total (TND)</th>
                    <th className="text-center">Statut</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => {
                    const totalQuantity = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

                    return (
                      <tr key={order._id}>
                        <td className="ps-4">{order._id.slice(-6)}</td>
                        <td>
                          {order.user ? (
                            <div>
                              <div className="fw-semibold">{order.user.name}</div>
                              <small className="text-muted">{order.user.email}</small>
                            </div>
                          ) : (
                            <span className="text-muted">Utilisateur</span>
                          )}
                        </td>
                        <td>
                          {order.items?.length > 0 ? (
                            <ul className="list-unstyled mb-0">
                              {order.items.map((item, index) => (
                                <li key={index} className="small">
                                  {item.product?.name || "Produit"}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </td>
                        <td className="text-center fw-semibold">{totalQuantity}</td>
                        <td className="fw-semibold">{order.total?.toFixed(2)} TND</td>
                        <td className="text-center">
                          <select
                            className="form-select form-select-sm mx-auto"
                            style={{ width: "140px" }}
                            value={order.status}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          >
                            {statusOptions.map(opt => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>{new Date(order.createdAt).toLocaleString()}</td>
                        <td className="text-center">
                          <FiTrash2
                            className="text-secondary"
                            style={{ cursor: "pointer" }}
                            size={18}
                            onClick={() => handleDeleteOrder(order._id)}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;

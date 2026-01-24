import { useEffect, useState } from "react";
import axios from "axios";
import { FiEdit2, FiTrash2, FiSearch, FiDelete } from "react-icons/fi";
import BASE_URL from "../../constante";
import ConfirmModal from "../../components/ConfirmModal";

const statusOptions = ["pending", "delivered", "cancelled"];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMode, setConfirmMode] = useState(null); 
  const [targetOrderId, setTargetOrderId] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const ordersPerPage = 10; 

  const totalPages = Math.ceil(orders.length / ordersPerPage);

  // Slice orders for current page
  const paginatedOrders = orders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );
  
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

  const handleDeleteOrder = (orderId) => {
    setConfirmMode('single');
    setTargetOrderId(orderId);
    setConfirmOpen(true);
  };

  const handleDeleteAllOrders = () => {
    setConfirmMode('all');
    setTargetOrderId(null);
    setConfirmOpen(true);
  };

  const performConfirm = async () => {
    try {
      setConfirmLoading(true);
      if (confirmMode === 'single' && targetOrderId) {
        await axios.delete(`${BASE_URL}/api/orders/${targetOrderId}`, { withCredentials: true });
        setOrders(prev => prev.filter(o => o._id !== targetOrderId));
      } else if (confirmMode === 'all') {
        await axios.delete(`${BASE_URL}/api/orders`, { withCredentials: true });
        setOrders([]);
      }
      setConfirmOpen(false);
      setConfirmMode(null);
      setTargetOrderId(null);
    } catch (err) {
      setError("Opération de suppression échouée");
    } finally {
      setConfirmLoading(false);
    }
  };
  if (loading) return null;
  if (error) return null;
  return (
    <>
    <div className="container mt-4">
    <div className="card border-0 shadow-sm rounded-4">
    <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
    <div>
        <h5 className="text-dark fw-bold mb-0 d-flex align-items-center gap-2">
            Commandes
            <span className="count-pill">
            {orders.length} {orders.length === 1 ? "commande" : "commandes"}
          </span>

          </h5>
          <small className="text-muted d-none d-md-block">Gérez les commandes et leurs statuts.</small>
        </div>
        <button
          className="btn btn-light btn-sm border text-danger d-flex align-items-center gap-1 px-3"
          onClick={handleDeleteAllOrders}
        >
          <FiTrash2 size={14} />
          Supprimer tout
        </button>
      </div>

      <div className="card-body p-0">
  
          <>
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
                  {paginatedOrders.map(order => {
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
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        </td>
                        <td>{new Date(order.createdAt).toLocaleString()}</td>
                        <td className="text-center">
                          <button
                            className="btn btn-sm btn-light border text-danger action-btn"
                            title="Supprimer"
                            onClick={() => handleDeleteOrder(order._id)}
                          >
                              <FiTrash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {orders.length > ordersPerPage && (
              <div className="d-flex justify-content-center align-items-center gap-2 mt-4 mb-3 flex-wrap">
                <button
                  className={`btn btn-outline-secondary btn-sm ${currentPage === 1 ? "disabled" : ""}`}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                >
                  Préc
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    className={`btn btn-outline-primary btn-sm ${currentPage === p ? "active" : ""}`}
                    onClick={() => setCurrentPage(p)}
                  >
                    {p}
                  </button>
                ))}

                <button
                  className={`btn btn-outline-secondary btn-sm ${currentPage === totalPages ? "disabled" : ""}`}
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                >
                  Suiv
                </button>
              </div>
            )}
          </>
       
      </div>
    </div>
  </div>
    <ConfirmModal
  open={confirmOpen}
  title="Confirmer la suppression"
  description="Voulez-vous vraiment supprimer cet élément ?"
  confirmText="Supprimer"
  cancelText="Annuler"
  loading={confirmLoading}
  danger
  onConfirm={performConfirm}
  onCancel={() => {
    if (!confirmLoading) {
      setConfirmOpen(false);
      setConfirmMode(null);
      setTargetOrderId(null);
    }
  }}
/>

 
 
  </>
  );
};

export default Orders;

import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../constante";
import { toast } from "react-toastify";
import { FiBox, FiMapPin, FiFileText, FiChevronDown } from "react-icons/fi";

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
    <div className="container">
      <div className="row justify-content-center">
        <div className="card shadow-sm rounded-4 border-0">
          <div className="card-body p-4">
          <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between mb-4 gap-2">
  <h4 className="card-title mb-0">
    Historique des commandes
  </h4>

  <span className="count-pill">
    {orders.length} {orders.length === 1 ? "commande" : "commandes"}
  </span>
</div>


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
        <button
        className="btn btn-sm border-0 d-flex align-items-center justify-content-center"
        onClick={() =>
          setSelectedOrder(
            selectedOrder?._id === order._id ? null : order
          )
        }
        aria-label="Afficher détails"
      >
        <FiChevronDown
          size={20}
          style={{
            transition: "transform 0.25s ease",
            transform:
              selectedOrder?._id === order._id
                ? "rotate(180deg)"
                : "rotate(0deg)",
          }}
        />
      </button>

</div>
</div>

                    {/* Détails */}
                    {selectedOrder?._id === order._id && (
                    <div className="mt-4 border-top pt-3">
                      
                      <h6 className="text-dark d-flex align-items-center gap-2">
                        <FiBox size={16} />
                        Produits
                      </h6>

                      {order.items.map((item) => (
                        <div key={item._id} className="mb-2">
                          <strong>{item.name}</strong>
                          <br />
                          Quantité : {item.quantity} <br />
                          Prix : {item.price} TND
                        </div>
                      ))}

                      <hr />

                      <h6  className="text-dark d-flex align-items-center gap-2">
                        <FiMapPin size={16} />
                        Adresse de livraison
                      </h6>

                      <p className="text-dark mb-1">
                        {order.shippingAddress.street},{" "}
                        {order.shippingAddress.city}
                      </p>
                      <p className="text-dark mb-1">
                        {order.shippingAddress.postalCode},{" "}
                        {order.shippingAddress.country}
                      </p>

                      <hr />

                      <h6  className="text-dark d-flex align-items-center gap-2">
                        <FiFileText size={16} />
                        Informations
                      </h6>
                      <p className="text-dark">Statut :  <strong
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
              </strong></p>
                      <p className="text-dark">Total : <strong>{order.total} TND</strong></p>
                      <p className="text-dark">Points gagnés : <strong>{order.pointsEarned} Points</strong></p>

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

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BsBox, BsTags, BsPercent, BsPeople } from "react-icons/bs";
import BASE_URL from "../../constante";

export default function Dashboard() {
  const [counts, setCounts] = useState({
    products: 0,
    categories: 0,
    promotions: 0,
    users: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
 const [topProducts, setTopProducts] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchCounts = async () => {
    try {
      setLoading(true);
      setError(null);
      const [productsRes, categoriesRes, promotionsRes, usersRes, ordersRes] =
      await Promise.all([
        axios.get(`${BASE_URL}/api/products`, { withCredentials: true }),
        axios.get(`${BASE_URL}/api/categories`, { withCredentials: true }),
        axios.get(`${BASE_URL}/api/promotions`, { withCredentials: true }),
        axios.get(`${BASE_URL}/api/user`, { withCredentials: true }),
        axios.get(`${BASE_URL}/api/orders`, { withCredentials: true }), // admin endpoint
      ]);

      setCounts({
        products: productsRes.data.length,
        categories: categoriesRes.data.length,
        promotions: promotionsRes.data.length,
        users: usersRes.data.length,
      });
      // Recent orders (backend sorts desc by createdAt)
const recent = Array.isArray(ordersRes.data) ? ordersRes.data.slice(0, 5) : [];
setRecentOrders(recent);

// Aggregate top products by quantity
const productMap = new Map();
(ordersRes.data || []).forEach(order => {
  (order.items || []).forEach(it => {
    const p = it.product || {};
    const key = p._id || p.name || `key-${Math.random()}`;
    const name = p.name || "Produit";
    const prev = productMap.get(key) || { name, quantity: 0 };
    const qty = typeof it.quantity === "number" ? it.quantity : 0;
    productMap.set(key, { ...prev, quantity: prev.quantity + qty });
  });
});
const top = Array.from(productMap.values())
  .sort((a, b) => b.quantity - a.quantity)
  .slice(0, 5);
setTopProducts(top);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la récupération des données du tableau de bord");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  if (loading) return null;
  if (error) return null;

  // Map your counts to modern dashboard cards
  const stats = [
    {
      title: "Produits",
      value: counts.products,
      icon: <BsBox size={22} />,
      bg: "bg-success-subtle",
      text: "text-success",
    },
    {
      title: "Catégories",
      value: counts.categories,
      icon: <BsTags size={22} />,
      bg: "bg-primary-subtle",
      text: "text-primary",
    },
    {
      title: "Promotions",
      value: counts.promotions,
      icon: <BsPercent size={22} />,
      bg: "bg-warning-subtle",
      text: "text-warning",
    },
    {
      title: "Utilisateurs",
      value: counts.users,
      icon: <BsPeople size={22} />,
      bg: "bg-danger-subtle",
      text: "text-danger",
    },
  ];

  return (
   <div className="container mt-4 mb-4">
      {/* Header */}
      <div className="mb-4">
        <h2 className="fw-semibold">Tableau de bord</h2>
        <p className="text-muted">
          Bienvenue ! Voici un aperçu de votre activité récente.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        {stats.map((item, index) => (
          <div className="col-12 col-md-6 col-xl-3" key={index}>
             <div
        className="card border-0 shadow-sm h-100"
        style={{ cursor: "pointer" }} 
        onClick={() => {
          if (item.title === "Produits") navigate("/admin/products");
          else if (item.title === "Catégories") navigate("/admin/categories");
          else if (item.title === "Promotions")  navigate("/admin/promos");
          else if (item.title === "Utilisateurs") navigate("/admin/users");
        }}
      >
              <div className="card-body d-flex justify-content-between">
                <div>
                  <small className="text-muted">{item.title}</small>
                  <h4 className="fw-bold mt-1">{item.value}</h4>
                </div>
                <div
                  className={`d-flex align-items-center justify-content-center rounded-3 ${item.bg} ${item.text}`}
                  style={{ width: 42, height: 42 }}
                >
                  {item.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Example Tables */}
      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
            <h6 className="text-dark fw-semibold mb-3">Dernières commandes</h6>
            <table className="table align-middle table-hover">
  <thead className="table-light">
    <tr>
      <th>Client</th>
      <th>Total</th>
      <th>Statut</th>
      <th>Date</th>
    </tr>
  </thead>
  <tbody>
    {recentOrders.length > 0 ? (
      recentOrders.map((o) => {
        const userName = o.user?.name || "Utilisateur";
        const userEmail = o.user?.email || "";
        const total = typeof o.total === "number" ? o.total.toFixed(2) : "0.00";
        const created = o.createdAt ? new Date(o.createdAt).toLocaleString() : "";
        const status = o.status || "pending";

     
        return (
          <tr key={o._id}>
            <td>
              <div className="fw-semibold">{userName}</div>
              <small className="text-muted">{userEmail}</small>
            </td>
            <td>{total} TND</td>
            
  
            <td className="text-center">
  <span
    className={`status-badge ${
      status === "paid"
        ? "status-paid"
        : status === "shipped"
        ? "status-shipped"
        : status === "delivered"
        ? "status-delivered"
        : status === "cancelled"
        ? "status-cancelled"
        : "status-pending"
    }`}
  >
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </span>
</td>


            <td>{created}</td>
          </tr>
        );
      })
    ) : (
      <tr>
        <td colSpan={4} className="text-center text-muted py-3">
          Aucune commande récente.
        </td>
      </tr>
    )}
  </tbody>
</table>


            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
            <h6 className="text-dark fw-semibold mb-3">Top Produits</h6>
<ul className="list-group list-group-flush">
  {topProducts.map((p, idx) => (
    <li key={idx} className="list-group-item d-flex justify-content-between">
      {p.name}
      <span>{p.quantity} pcs</span>
    </li>
  ))}
  {topProducts.length === 0 && (
    <li className="list-group-item text-muted">Pas de ventes récentes.</li>
  )}
</ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

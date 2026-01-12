import { useEffect, useState } from "react";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCounts = async () => {
    try {
      setLoading(true);
      setError(null);
      const [productsRes, categoriesRes, promotionsRes, usersRes] =
        await Promise.all([
          axios.get(`${BASE_URL}/api/products`),
          axios.get(`${BASE_URL}/api/categories`),
          axios.get(`${BASE_URL}/api/promotions`),
          axios.get(`${BASE_URL}/api/user`),
        ]);

      setCounts({
        products: productsRes.data.length,
        categories: categoriesRes.data.length,
        promotions: promotionsRes.data.length,
        users: usersRes.data.length,
      });
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

  if (loading) return <p>Chargement du tableau de bord...</p>;
  if (error) return <p className="text-danger">{error}</p>;

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
    <div className="container mt-4">
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
            <div className="card border-0 shadow-sm h-100">
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
              <h6 className="fw-semibold mb-3">Dernières commandes</h6>
              <table className="table align-middle">
                <tbody>
                  <tr>
                    <td>John Doe</td>
                    <td>Wireless Headphones</td>
                    <td>$129.99</td>
                    <td>
                      <span className="badge bg-success">Completed</span>
                    </td>
                  </tr>
                  <tr>
                    <td>Jane Smith</td>
                    <td>Smart Watch</td>
                    <td>$299.99</td>
                    <td>
                      <span className="badge bg-warning text-dark">Pending</span>
                    </td>
                  </tr>
                  <tr>
                    <td>Bob Johnson</td>
                    <td>Laptop Stand</td>
                    <td>$49.99</td>
                    <td>
                      <span className="badge bg-success">Completed</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="fw-semibold mb-3">Top Produits</h6>
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between">
                  Wireless Headphones <span>$160,410</span>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  Smart Watch <span>$296,003</span>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  USB-C Hub <span>$51,901</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

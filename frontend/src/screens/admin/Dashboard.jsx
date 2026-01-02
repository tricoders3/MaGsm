import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../constante";

const Dashboard = () => {
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

      const [productsRes, categoriesRes, promotionsRes, usersRes] = await Promise.all([
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

  // Modern soft colors
  const cardStyles = [
    { backgroundColor: "#ffffffff", color: "#1C1C1C" }, 
    { backgroundColor: "#ffffffff", color: "#1C1C1C" }, 
    { backgroundColor: "#ffffffff", color: "#1C1C1C" }, 
    { backgroundColor: "#ffffffff", color: "#1C1C1C" }, 
  ];

  const titles = ["Produits", "Catégories", "Promotions", "Utilisateurs"];
  const values = [
    counts.products,
    counts.categories,
    counts.promotions,
    counts.users,
  ];

  return (
    <div className="container py-4">
      <h3 className="mb-4">Tableau de bord</h3>
      <div className="row g-4">
        {titles.map((title, index) => (
          <div className="col-md-3" key={index}>
            <div
              className="card shadow-sm rounded-3"
              style={{
                backgroundColor: cardStyles[index].backgroundColor,
                color: cardStyles[index].color,
                minHeight: "120px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div className="card-body text-center">
                <h5 className="card-title mb-2">{title}</h5>
                <p className="card-text fs-4 fw-bold">{values[index]}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

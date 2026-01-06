import { useEffect, useState } from "react";
import axios from "axios";
import { BsBox, BsTags, BsPercent, BsPeople } from "react-icons/bs";
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

  const cards = [
    { title: "Produits", value: counts.products, icon: <BsBox size={30} />, cssClass: "card-products" },
    { title: "Catégories", value: counts.categories, icon: <BsTags size={30} />, cssClass: "card-categories" },
    { title: "Promotions", value: counts.promotions, icon: <BsPercent size={30} />, cssClass: "card-promotions" },
    { title: "Utilisateurs", value: counts.users, icon: <BsPeople size={30} />, cssClass: "card-users" },
  ];

  return (
    <div className="container dashboard-container">
      <h3 className="dashboard-title">Tableau de bord</h3>
      <div className="row g-4">
        {cards.map((card, index) => (
          <div className="col-md-3" key={index}>
            <div className={`dashboard-card ${card.cssClass}`}>
              <div className="dashboard-card-header">
                <div className="dashboard-card-icon">{card.icon}</div>
                <div>
                  <h5 className="dashboard-card-title">{card.title}</h5>
                  <p className="dashboard-card-value">{card.value}</p>
                </div>
              </div>
              <a href={`/${card.title.toLowerCase()}`} className="dashboard-card-details">
                Voir les détails →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

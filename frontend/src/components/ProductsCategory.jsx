import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../constante";

const ProductsCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/categories`);
        setCategories(res.data || []);
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Return nothing while loading or if error occurred
  if (loading || error ) return null;

  return (
    <section className="category-editorial py-5">
      <div className="container">
        <div className="mb-4">
          <h2 className="section-title">Catégories de produits</h2>
          <p className="section-subtitle d-inline">
            Découvrez nos univers soigneusement sélectionnés pour répondre à tous vos besoins.
          </p>
        </div>

        <div className="row g-4">
  {categories.map((cat) => (
    <div key={cat._id} className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
      <div
        className="category-white-card"
        onClick={() => navigate(`/category/${cat._id}`)}
      >
        {/* TEXT */}
        <div className="category-text">
          <h3 className="product-title">{cat.name}</h3>
          <p className="product-description">
            {cat.description || "Explore collection"}
          </p>
        </div>

        {/* IMAGE */}
        <div className="category-img">
          {cat.image ? (
            <img src={cat.image} alt={cat.name} />
          ) : (
            <div className="category-img-placeholder" />
          )}
        </div>
      </div>
    </div>
  ))}
</div>

      </div>
    </section>
  );
};

export default ProductsCategory;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import axios from "axios";
import BASE_URL from "../constante";
import ProductCard from "../components/ProductCard";

const BestSeller = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/promotions/promos`);

        const productsData = response.data.map((p) => ({
          id: p._id,
          name: p.name,
          image: p.image || "/assets/images/default.png",
          category: p.category,
          subCategory: p.subCategory,
          originalPrice: p.originalPrice,
          discountedPrice: p.discountedPrice,
          promotion: p.promotion,
        }));

        setProducts(productsData);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load promotions");
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  if (loading) return null;
  if (error) return <p>{error}</p>;

  const previewProducts = products.slice(0, 4);

  return (
    <section className="features-section py-5">
      <div className="container">
        <div className="mb-4">
          <h2 className="section-title">Offres spéciales</h2>
          <p className="section-subtitle">
            Des réductions exclusives à ne pas manquer
          </p>
        </div>

        <div className="row g-4">
          {previewProducts.map((product) => (
            <div key={product.id}  className="col-12 col-sm-6 col-md-3">
              <ProductCard product={product} badgeType="promo" />
            </div>
          ))}
        </div>

        <div className="text-center mt-4">
          <button
            className="btn-plus flex items-center gap-2"
            onClick={() => navigate("/offers")}
          >
            Voir plus <FiArrowRight />
          </button>
          
        </div>
      </div>
    </section>
  );
};

export default BestSeller;

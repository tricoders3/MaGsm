import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import axios from "axios";
import BASE_URL from "../constante";
import ProductCard from "./ProductCard";


const BestSeller = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const { data } = await axios.get(
          `${BASE_URL}/api/promotions/promos`
        );
        const formatted = data.map((p) => ({
          id: p._id,
          name: p.name,
          images: p.images || [],
          category: p.category,
          subCategory: p.subCategory,
          price: p.price,
          promotion: p.promotion || null,
          discountedPrice: p.promotion?.discountedPrice || p.price,
          hasPromotion: !!p.promotion,
          countInStock: p.countInStock,
        }));
        

        setProducts(formatted);
      } catch (err) {
        console.error(err);
        setError("Failed to load promotions");
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);


  if (loading) return null;
  if (error) return null;

  const previewProducts = products.slice(0, 4);
  if (previewProducts.length === 0) return null;
  return (
    <section className="features-section py-5">
      <div className="container">
        <div className="mb-4">
          <h2 className="section-title">Offres spéciales</h2>
          <p className="section-subtitle">
            Des réductions exclusives à ne pas manquer
          </p>
        </div>

        <div className="row g-3">
          {previewProducts.map((product) => (
            <div key={product.id} className="col-6 col-sm-6 col-md-4 col-lg-3">
              <ProductCard 
              product={product}
              badgeType="promo" 
              stockCount={product.countInStock} />
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

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart, FiArrowRight } from "react-icons/fi";
import axios from "axios";
import BASE_URL from "../constante";

const BestSeller = () => {
  const [products, setProducts] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        // 1️⃣ Get products with active promotions
        const response = await axios.get(`${BASE_URL}/api/promotions/promos`);
        const productsData = response.data.map((p) => ({
          id: p._id,
          name: p.name,
          image: p.image || '/assets/images/default.png',
          category: p.category,
          subCategory: p.subCategory,
          originalPrice: p.originalPrice,
          discountedPrice: p.discountedPrice,
          promotion: p.promotion,
        }));
        setProducts(productsData);

  
        const promoResp = await axios.get(`${BASE_URL}/api/promotions`);
        setPromotions(promoResp.data.filter((p) => p.isActive));

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to load promotions');
        setLoading(false);
      }
    };
    fetchPromotions();
  }, []);


  if (loading) return null;
  if (error) return <p>{error}</p>;

  // show only first 4 products 
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
  
      <div className="row">
        {previewProducts.map((product) => (
          <div key={product.id} className="col-6 col-md-3 mb-4">
            <div className="product-card h-100">
  
              {/* Badges (SAME STRUCTURE) */}
              <div className="card-badges">
                {product.promotion && (
                  <span className="badge-offer">
                    {product.promotion.discountType === "percentage"
                      ? `-${product.promotion.discountValue}%`
                      : `-${product.promotion.discountValue} DT`}
                  </span>
                )}
  
                <button className="cart-btn">
                  <FiShoppingCart size={18} />
                </button>
              </div>
  
              {/* Image */}
              <div className="product-image mt-4">
                <img src={product.image} alt={product.name} />
              </div>
  
              {/* Content */}
              <div className="product-content text-center">
                <h6 className="product-title">{product.name}</h6>
                <p className="product-category">{product.category}</p>
                <p className="product-description">{product.description}</p>
  
                <p className="product-price">
                  <span className="original-price">
                    {product.originalPrice} DT
                  </span>{" "}
                  <span className="discounted-price">
                    {product.discountedPrice} DT
                  </span>
                </p>
  
                <button
                  className="btn-redesign btn-primary-redesign"
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  Découvrir les détails
                </button>
              </div>
  
            </div>
          </div>
        ))}
      </div>
  
      <div className="text-center mt-4">
        <button
          className="btn-plus flex items-center gap-2"
          onClick={() => navigate("/products")}
        >
          Voir plus <FiArrowRight />
        </button>
      </div>
    </div>
  </section>
  
  );
};

export default BestSeller;

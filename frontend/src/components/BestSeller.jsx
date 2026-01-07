import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart, FiArrowRight } from "react-icons/fi";
import axios from "axios";
import BASE_URL from "../constante";

const BestSeller = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/products`);
        const productsData = response.data.map((product) => ({
          id: product._id,
          name: product.name,
          description: product.description,
          price: product.price,
          image:
            product.images && product.images.length > 0
              ? product.images[0].url
              : "/assets/images/default.png",
          countInStock: product.countInStock,
          category: product.category?.name || "Uncategorized",
        }));

        setProducts(productsData);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load products");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return null;
  if (error) return <p>{error}</p>;

  // Optional: show only first 4 products as preview
  const previewProducts = products.slice(0, 4);

  return (
    <section className="features-section py-5">
      <div className="container">
        <div className="mb-4">
          <h2 className="section-title">Meilleures ventes</h2>
          <p className="section-subtitle">
            Découvrez nos produits les plus populaires
          </p>
        </div>

        <div className="row">
          {previewProducts.map((product) => (
            <div key={product.id} className="col-6 col-md-3 mb-4">
              <div className="product-card h-100">
                {/* Badges */}
                <div className="card-badges">
                  {product.countInStock > 0 ? (
                    <span className="badge-stock">EN STOCK</span>
                  ) : (
                    <span className="badge-stock out-of-stock">RUPTURE</span>
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
                  <p className="product-price">{product.price} DT</p>

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
            Voir plus
            <FiArrowRight />
          </button>
        </div>
      </div>
    </section>
  );
};

export default BestSeller;

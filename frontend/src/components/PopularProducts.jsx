import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import axios from "axios";
import BASE_URL from "../constante";
import ProductCard from "../components/ProductCard";
import { useGlobalSearch } from "../context/SearchContext";

const PopularProducts = () => {
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { query } = useGlobalSearch();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/products/most-purchased`);

        const productsData = response.data.map((product) => ({
          id: product._id,
          name: product.name,
          description: product.description,
          price: product.price,
          image:
            product.images?.length > 0
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

  const toggleFavorite = (productId) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  if (loading) return null;
  if (error) return null;

  return (
    <section className="features-section py-5">
      <div className="container">
        <div className="mb-4">
          <h2 className="section-title">Produits Populaires</h2>
          <p className="section-subtitle">
            Découvrez nos produits les plus populaires
          </p>
        </div>

        <div className="row g-4">
          {products
            .slice(0, 4)
            .filter((p) => p.name?.toLowerCase().includes(query.toLowerCase()))
            .map((product) => (
            <div key={product.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
            <ProductCard
                product={product}
                badgeType="stock"
                stockCount={product.countInStock}
                isFavorite={favorites.includes(product.id)}
                onFavoriteSuccess={(id) =>
                  setFavorites((prev) => [...new Set([...prev, id])])
                }
              />

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

export default PopularProducts;

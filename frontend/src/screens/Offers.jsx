import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../constante";
import ProductCard from "../components/ProductCard";

export default function OfferPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8; // nombre de cartes par page

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/promotions/promos`);
        const productsData = res.data.map((p) => ({
          id: p._id,
          name: p.name,
          image: p.image || "/assets/images/default.png",
          category: p.category,
          subCategory: p.subCategory,
          originalPrice: p.originalPrice,
          discountedPrice: p.discountedPrice,
          promotion: p.promotion,
          countInStock: p.countInStock || 1,
        }));
        setProducts(productsData);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les promotions");
        setLoading(false);
      }
    };
    fetchPromotions();
  }, []);

  // Pagination logic
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = products.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };
  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  if (loading)
    return <p className="text-center py-5">Chargement des promotions...</p>;
  if (error)
    return (
      <p className="text-center py-5 text-danger">
        {error}
      </p>
    );

  return (
    <section className="offer-page py-5">
      <div className="container">
        <div className="mb-4">
          <h2 className="section-title">Offres Spéciales</h2>
          <p className="section-subtitle">
            Profitez de nos meilleures promotions sur nos produits populaires
          </p>
        </div>

        {/* Grid des produits */}
        <div className="row g-4">
          {currentProducts.map((product) => (
            <div key={product.id} className="col-12 col-sm-6 col-md-3">
              <ProductCard
                product={product}
                badgeType="promo"
                stockCount={product.countInStock}
                isFavorite={favorites.includes(product.id)}
                onFavoriteSuccess={(id) =>
                  setFavorites((prev) => [...new Set([...prev, id])])
                }
              />
            </div>
          ))}
        </div>

        {/* Pagination */}
        {products.length > productsPerPage && (
        <div className="d-flex justify-content-center align-items-center gap-2 mt-4 flex-wrap">
        {/* Previous */}
        <button
          className={`pagination-btn ${currentPage === 1 ? "disabled" : ""}`}
          onClick={handlePrev}
        >
          Préc
        </button>
    
        {/* Page Numbers */}
        {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
          <button
            key={page}
            className={`pagination-btn ${currentPage === page ? "active" : ""}`}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        ))}
    
        {/* Next */}
        <button
          className={`pagination-btn ${currentPage === totalPages ? "disabled" : ""}`}
          onClick={handleNext}
        >
          Suiv
        </button>
      </div>
        )}
      </div>
    </section>
  );
}

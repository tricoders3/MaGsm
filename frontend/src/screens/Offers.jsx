import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../constante";
import ProductCard from "../components/ProductCard";
import "swiper/css";
import { useGlobalSearch } from "../context/SearchContext";
import ProductFilters from "../components/ProductFilters";

export default function OfferPage() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const { query, categoryId, subCategoryId } = useGlobalSearch();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/promotions/promos`);
        const productsData = response.data.map((p) => ({
          id: p._id,
          name: p.name,
          description: p.description,
          image: p.image || "/assets/images/default.png",
          category: p.category,
          subCategory: p.subCategory,
          originalPrice: p.originalPrice,
          discountedPrice: p.discountedPrice,
          promotion: p.promotion,
          countInStock: p.countInStock || 1,
        }));
        setProducts(productsData);

        const promoResp = await axios.get(`${BASE_URL}/api/promotions`);
        setPromotions(promoResp.data.filter((p) => p.isActive));

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load promotions");
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  // Reset to first page when filters change (must be before any early returns)
  useEffect(() => {
    setCurrentPage(1);
  }, [query, categoryId, subCategoryId]);

  if (loading) return null;
  if (error) return null;

  const heroPromotion = promotions[0];

  const formatTimeLeft = (endDate) => {
    if (!endDate) return "";
    const diff = new Date(endDate) - new Date();
    if (diff <= 0) return "Terminé";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    return days > 0 ? `${days}j ${hours}h restants` : `${hours}h restants`;
  };

  // Pagination 
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = products.slice(indexOfFirst, indexOfLast);
  const filteredCurrent = currentProducts.filter((p) => {
    const q = (query || "").toLowerCase();
    const matchQuery = p.name?.toLowerCase().includes(q);
    const matchCategory = categoryId ? String(p.category) === String(categoryId) : true;
    const matchSub = subCategoryId ? String(p.subCategory) === String(subCategoryId) : true;
    return matchQuery && matchCategory && matchSub;
  });
  const totalPages = Math.ceil(products.length / productsPerPage);


  return (
    <section className="offer-page">
      <div className="container py-5">
        {heroPromotion && (
          <div className="rounded-4 shadow-soft p-4 p-lg-5 mb-5 offer-hero">
            <div className="row align-items-center g-4">
              <div className="col-lg-8">
                <h1 className="display-5 fw-bold mb-3">{heroPromotion.name}</h1>
                <p className="lead mb-4">
                  {heroPromotion.description || "Profitez de remises exclusives sur nos produits"}
                </p>
                <div className="d-flex gap-3">
                  <button
                    className="btn-redesign btn-primary-redesign"
                    onClick={() => navigate("/products")}
                  >
                    Voir tout
                  </button>
                  <button
                    className="btn-redesign btn-outline-secondary"
                    onClick={() => navigate("/")}
                  >
                    Retour à l'accueil
                  </button>
                </div>
              </div>

              <div className="col-lg-4 text-lg-end">
                <div className="d-inline-flex align-items-center gap-2 p-2 px-3 bg-white rounded-4 shadow-soft">
                  <span className="offer-badge bg-success-subtle text-success fw-semibold">
                    {heroPromotion.discountType === "percentage"
                      ? `${heroPromotion.discountValue}%`
                      : `${heroPromotion.discountValue} DT`}
                  </span>
                  <span className="text-muted">
                    {formatTimeLeft(heroPromotion.endDate)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

       
        <div className="mb-4">
          <h2 className="section-title">Offres Spéciales</h2>
          <p className="section-subtitle">
            Profitez de nos meilleures offres sur les produits populaires
          </p>
        </div>

        {/* Filters */}
        <div className="row">
      {/* FILTER */}
      <div className="col-12 col-md-3 mb-4">
        <ProductFilters />
      </div>
      <div className="col-12 col-md-9">
      <div className="row g-4">
          {filteredCurrent.map((product) => (
            <div key={product.id} className="col-12 col-sm-6 col-md-4 col-lg-4">
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
        {filteredCurrent.length === 0 && (
          <p className="text-center text-muted mt-3">Aucune offre correspondante.</p>
        )}

        {/* PAGINATION */}
        {products.length > productsPerPage && (
          <div className="d-flex justify-content-center align-items-center gap-2 mt-5 flex-wrap">
            <button
              className={`pagination-btn ${currentPage === 1 ? "disabled" : ""}`}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            >
              Préc
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`pagination-btn ${currentPage === p ? "active" : ""}`}
                onClick={() => setCurrentPage(p)}
              >
                {p}
              </button>
            ))}

            <button
              className={`pagination-btn ${currentPage === totalPages ? "disabled" : ""}`}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            >
              Suiv
            </button>
          </div>
        )}
    </div>
    </div>
  </div>
    </section>
  );
}

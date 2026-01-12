import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiShoppingCart } from 'react-icons/fi';
import BASE_URL from '../constante';
import 'swiper/css';

export default function OfferPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products with promotion
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

        // 2️⃣ Get active promotions for banner
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

  if (loading) return <p className="text-center py-5">Chargement des promotions...</p>;
  if (error) return <p className="text-center py-5 text-danger">{error}</p>;

  // Take the first active promotion for the hero banner
  const heroPromotion = promotions[0];
const formatTimeLeft = (endDate) => {
  if (!endDate) return '';
  const now = new Date();
  const end = new Date(endDate);
  const diff = end - now; // en ms
  if (diff <= 0) return 'Terminé';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  return days > 0 ? `${days}j ${hours}h restants` : `${hours}h restants`;
};
  return (
    <section className="offer-page">
      <div className="container py-5">

        {/* Dynamic Hero Banner */}
        {heroPromotion && (
          <div className="rounded-4 shadow-soft p-4 p-lg-5 mb-5 position-relative offer-hero">
            <div className="row align-items-center g-4">
              <div className="col-lg-8">
                <h1 className="display-5 fw-bold hero-heading mb-3">{heroPromotion.name}</h1>
                <p className="lead mb-4">{heroPromotion.description || "Profitez de remises exclusives sur nos produits"}</p>
                <div className="d-flex gap-3">
                  <button className="btn-redesign btn-primary-redesign" onClick={() => navigate('/products')}>
                    Voir tout
                  </button>
                  <button className="btn-redesign btn-outline-secondary" onClick={() => navigate('/')}>
                    Retour à l'accueil
                  </button>
                </div>
              </div>
            <div className="col-lg-4 text-lg-end">
  <div className="d-inline-flex align-items-center gap-2 p-2 px-3 bg-white rounded-4 shadow-soft">
    <span className="offer-badge bg-success-subtle text-success fw-semibold">
      {heroPromotion.discountType === "percentage"
        ? `${heroPromotion.discountValue}% `
        : `${heroPromotion.discountValue} DT `}
    </span>
    {/* Temps limité dynamique */}
    <span className="text-muted">{formatTimeLeft(heroPromotion.endDate)}</span>
  </div>
</div>
            </div>
          </div>
        )}

        {/* Section Title */}
        <div className="mb-4 text-center">
          <h2 className="section-title">Offres Spéciales</h2>
          <p className="section-subtitle">Profitez de nos meilleures offres sur les produits populaires</p>
        </div>

        {/* Products Grid */}
        <div className="row">
          {products.map((product) => (
            <div key={product.id} className="col-6 col-md-3 mb-4">
              <div className="product-card h-100">
                {product.promotion && (
                  <div className="card-badges position-absolute top-0 start-0 m-2">
                    <span className="badge-offer bg-danger text-white px-2 py-1 rounded">
                      {product.promotion.discountType === 'percentage'
                        ? `${product.promotion.discountValue}% OFF`
                        : `${product.promotion.discountValue} DT OFF`}
                    </span>
                  </div>
                )}

                <div className="product-image mt-4 text-center">
                  <img src={product.image} alt={product.name} className="img-fluid" style={{ height: 150, objectFit: 'cover' }} />
                </div>

                <div className="product-content text-center mt-3">
                  <h6 className="product-title">{product.name}</h6>
                  <p className="product-category text-muted">{product.category}</p>
                  <p className="product-price mt-2">
                    <span className="original-price text-decoration-line-through">{product.originalPrice} DT</span>{' '}
                    <span className="discounted-price fw-bold">{product.discountedPrice} DT</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiShoppingCart, FiArrowRight, FiCheckCircle, FiShield, FiTruck, FiRefreshCcw } from 'react-icons/fi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode, A11y } from 'swiper/modules';
import 'swiper/css';
import BASE_URL from '../constante';

export default function OfferPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/products`);
        const productsData = response.data.map((product) => ({
          id: product._id,
          name: product.name,
          description: product.description,
          price: product.price,
          image: product.images && product.images.length > 0 ? product.images[0].url : '/assets/images/default.png',
          countInStock: product.countInStock,
          category: product.category?.name || 'Uncategorized',
        }));
        setProducts(productsData);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to load products');
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return ['Tous', ...Array.from(set)];
  }, [products]);

  const hotDeals = useMemo(() => {
    return products
      .filter((p) => (p.countInStock ?? 0) > 0)
      .sort((a, b) => (a.price ?? 0) - (b.price ?? 0))
      .slice(0, 12);
  }, [products]);

  if (loading) return <p className="text-center py-5">Chargement des produits...</p>;
  if (error) return <p className="text-center py-5 text-danger">{error}</p>;

  return (
    <section className="offer-page">
      <div className="container py-5">
        {/* Featured Banner */}
        <div className="rounded-4 shadow-soft p-4 p-lg-5 mb-5 position-relative offer-hero" >
          <div className="row align-items-center g-4">
            <div className="col-lg-8">
              <h1 className="display-5 fw-bold hero-heading mb-3">Offres Spéciales</h1>
              <p className="lead mb-4">Profitez de remises exclusives sur les accessoires GSM les plus demandés.</p>
              <div className="d-flex gap-3">
                <button className="btn-redesign btn-primary-redesign" onClick={() => navigate('/products')}>Voir tout</button>
                <button className="btn-redesign btn-outline-promo" onClick={() => navigate('/')}>Retour à l'accueil</button>
              </div>
            </div>
           <div className="col-lg-4 text-lg-end">
  <div className="d-inline-flex align-items-center gap-2 p-2 px-3 bg-white rounded-4 shadow-soft">
    <span className="offer-badge bg-success-subtle text-success fw-semibold">Jusqu'à -40%</span>
    <span className="text-muted">Temps limité</span>
  </div>
</div>

          </div>
        </div>

        {/* Category Chips */}
        <div className="subcategory-filter d-flex mb-4">
          {categories.map((cat) => (
            <button key={cat} className="btn btn-outline-promo btn-sm">{cat}</button>
          ))}
        </div>

        {/* Existing Offers Grid (kept as-is) */}
        <div className="mb-4 text-center">
          <h2 className="section-title">Offres Spéciales</h2>
          <p className="section-subtitle">Profitez de nos meilleures offres sur les produits populaires</p>
        </div>

        <div className="row">
          {products.map((product) => (
            <div key={product.id} className="col-6 col-md-3 mb-4">
              <div className="product-card h-100 position-relative">
                {/* Static Offer Badge */}
                <div className="card-badges">
                  <span className="badge-offer">20% OFF</span>
                  <button className="cart-btn" aria-label={`Ajouter ${product.name} au panier`}>
                    <FiShoppingCart size={18} />
                  </button>
                </div>

                {/* Product Image */}
                <div className="product-image mt-4 text-center">
                  <img src={product.image} alt={product.name} className="img-fluid" loading="lazy" decoding="async" />
                </div>

                {/* Product Content */}
                <div className="product-content text-center mt-3">
                  <h6 className="product-title">{product.name}</h6>
                  <p className="product-category">{product.category}</p>
                  <p className="product-description">{product.description}</p>

                  {/* Price with Static Discount */}
                  <p className="product-price">
                    <span className="original-price">{product.price} DT</span>{' '}
                    <span className="discounted-price">{(product.price * 0.8).toFixed(2)} DT</span>
                  </p>

                  {/* Product Details Button */}
                  <button className="btn-redesign btn-primary-redesign" onClick={() => navigate(`/products/${product.id}`)}>
                    Découvrir les détails
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>


    

        {/* Benefits Section 
        <div className="row g-3 g-md-4 mt-5">
          <div className="col-6 col-lg-3">
            <div className="rounded-4 shadow-soft p-3 h-100 bg-white d-flex align-items-center gap-3">
              <FiShield className="text-success" size={24} />
              <div>
                <strong>Qualité garantie</strong>
                <div className="text-muted small">Produits vérifiés et notés</div>
              </div>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div className="rounded-4 shadow-soft p-3 h-100 bg-white d-flex align-items-center gap-3">
              <FiTruck className="text-primary" size={24} />
              <div>
                <strong>Livraison rapide</strong>
                <div className="text-muted small">Partout en Tunisie</div>
              </div>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div className="rounded-4 shadow-soft p-3 h-100 bg-white d-flex align-items-center gap-3">
              <FiRefreshCcw className="text-info" size={24} />
              <div>
                <strong>Retours faciles</strong>
                <div className="text-muted small">Sous 14 jours</div>
              </div>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div className="rounded-4 shadow-soft p-3 h-100 bg-white d-flex align-items-center gap-3">
              <FiCheckCircle className="text-warning" size={24} />
              <div>
                <strong>Meilleurs prix</strong>
                <div className="text-muted small">Jusqu'à -60%</div>
              </div>
            </div>
          </div>
        </div>
*/}
     
        {/* Newsletter CTA */}
        <div className="rounded-4 shadow-soft mt-5 p-4 p-md-5" style={{
          background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
        }}>
          <div className="row align-items-center g-3">
            <div className="col-md-8">
              <h3 className="mb-2">Recevez nos meilleures offres</h3>
              <p className="mb-0">Inscrivez-vous pour ne rien rater des promotions exclusives.</p>
            </div>
            <div className="col-md-4 text-md-end mt-3 mt-md-0">
              <button className="btn-redesign btn-primary">S'inscrire</button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

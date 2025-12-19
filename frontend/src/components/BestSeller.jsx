import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode, A11y } from "swiper/modules";
import "swiper/css";
import { FiShoppingCart } from "react-icons/fi";
import axios from "axios";
import BASE_URL from "../constante";

const BestSeller = () => {
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
  if (error) return null;

  return (
    <section className="features-section py-5">
      <div className="container">
        <div className="mb-4">
          <h2 className="section-title">Meilleures ventes</h2>
          <p className="section-subtitle">
            Découvrez nos produits les plus populaires
          </p>
        </div>

        <Swiper
          modules={[Autoplay, FreeMode, A11y]}
          className="best-seller-swiper"
          loop={true}
          freeMode={true}
          speed={6000}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          allowTouchMove={false}
          spaceBetween={10}
          breakpoints={{
            0: { slidesPerView: 1.4 },
            576: { slidesPerView: 2.2 },
            768: { slidesPerView: 3 },
            1200: { slidesPerView: 4 },
          }}
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
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
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                </div>

                {/* Content */}
                <div className="product-content text-center">
                  <h6 className="product-title">{product.name}</h6>
                  <p className="product-category">{product.category}</p>
                  <p className="product-description">
                    {product.description}
                  </p>
                  <p className="product-price">{product.price} DT</p>

                  <button className="btn-redesign btn-primary-redesign">
                    Découvrir les détails
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default BestSeller;

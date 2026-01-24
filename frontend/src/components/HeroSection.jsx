import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import axios from "axios";
import BASE_URL from "../constante";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const HeroSlider = () => {
  const [products, setProducts] = useState([]);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        // 1️⃣ Get products with promotions
        const response = await axios.get(`${BASE_URL}/api/promotions/promos`);
        const productsData = response.data.map((p) => ({
          id: p._id,
          name: p.name,
          description: p.description,
          image: p.image || "/assets/images/default.png",
          promotion: p.promotion, // promotion object is already included
        }));
        setProducts(productsData);

        // 2️⃣ Optional: get all active promotions if needed elsewhere
        const promoResp = await axios.get(`${BASE_URL}/api/promotions`);
        const activePromotions = promoResp.data.filter((p) => p.isActive);

        // 3️⃣ Build slides
        const slidesData = productsData.map((p) => {
          const promo = p.promotion; // use promotion directly
          let discountText = "-";
          if (promo) {
            discountText =
              promo.discountType === "percentage"
                ? `-${promo.discountValue}%`
                : `-${promo.discountValue} DT`;
          }

        

          return {
            title: p.name,
            subtitle: p.description || "Offre spéciale !",
            image: p.image,
            discount: discountText,
          };
        });

        // Take first 3 randomly
        const shuffled = slidesData.sort(() => 0.5 - Math.random());
        setSlides(shuffled.slice(0, 3));

        setLoading(false);
      } catch (err) {
        console.error("Failed to load promotions:", err);
        setError("Impossible de charger les promotions");
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  if (loading) return null;
  if (error) return null;

  return (
    <section className="hero-section overflow-hidden">
    <div className="container">
  
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        autoplay={{ delay: 7000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        effect="fade"
        loop
        className="hero-swiper"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="row align-items-center min-vh-50">
  
              {/* LEFT – INTRO */}
              <div className="col-lg-6">
                <div className="hero-intro">
                  <span className="hero-tag">Offre Limitée</span>
  
                  <h1 className="hero-heading">
                    Découvrez nos <br /> meilleures promotions
                  </h1>
  
                  <p className="hero-description">
                    Des offres sélectionnées pour vous
                  </p>
  
                  <Link
                    to="/products"
                    className="btn-redesign btn-primary-redesign btn-lg-redesign"
                  >
                    En savoir plus
                  </Link>
                </div>
              </div>
  
              {/* RIGHT – PRODUCT */}
              <div className="col-lg-6">
              <div className="hero-product">
  <div className="hero-product-wrapper">
    <div className="badge-container">
      <span className="promo-badge">{slide.discount}</span>
      <img
        src={slide.image}
        alt={slide.title}
        className="hero-product-image"
      />
    </div>
  </div>
  <h2 className="hero-title mt-4">{slide.title}</h2>
  <p className="hero-subtitle mb-5">{slide.subtitle}</p>
</div>

              </div>
  
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
  
    </div>
  </section>
  
  
  
  
  
  );
};

export default HeroSlider;

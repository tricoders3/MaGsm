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
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasPromotion, setHasPromotion] = useState(false); // ✅ track if promos exist

;

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const promoRes = await axios.get(`${BASE_URL}/api/promotions/promos`);

        if (promoRes.data && promoRes.data.length > 0) {
          setHasPromotion(true); // ✅ promotions exist

          const promoSlides = promoRes.data.map((p) => {
            const promo = p.promotion;
            const discount =
              promo?.discountType === "percentage"
                ? `-${promo.discountValue}%`
                : `-${promo?.discountValue} DT`;

            return {
              title: p.name,
              subtitle:
                promo?.description || "Offre spéciale à durée limitée",
              image: p.images?.[0]?.url || "/assets/images/default.png",
              badge: discount,
            };
          });

          setSlides(shuffle(promoSlides).slice(0, 3));
        } else {
          setHasPromotion(false); // ❌ no promotions

          const productRes = await axios.get(`${BASE_URL}/api/products`);

          const productSlides = productRes.data.map((p) => ({
            title: p.name,
            subtitle: p.description || "Découvrez ce produit",
            image: p.images?.[0]?.url || "/assets/images/default.png",
            badge: null,
          }));

          setSlides(shuffle(productSlides).slice(0, 3));
        }
      } catch (err) {
        console.error("Hero slider error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);
  
 

  if (loading || !slides.length) return null;

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

                {/* LEFT - STATIC LAYOUT, TEXT CHANGES DYNAMICALLY */}
                <div className="col-lg-6">
                  <div className="hero-intro">

                    <span className="hero-tag">
                      {hasPromotion ? "Offre Limitée" : "Nouveauté"}
                    </span>

                    <h1 className="hero-heading">
                      {hasPromotion
                        ? <>Découvrez nos <br /> meilleures offres</>
                        : <>Découvrez nos <br /> meilleurs produits</>}
                    </h1>

                    <p className="hero-description">
                      {hasPromotion
                        ? "Des offres sélectionnées pour vous"
                        : "Des produits soigneusement sélectionnés pour vous"}
                    </p>

                    <Link
                      to="/products"
                      className="btn-redesign btn-primary-redesign btn-lg-redesign mb-2"
                    >
                      En savoir plus
                    </Link>

                  </div>
                </div>

                {/* RIGHT - Dynamic content */}
                <div className="col-lg-6">
                  <div className="hero-product">
                    <div className="hero-product-wrapper">
                      <div className="badge-container">
                        {slide.badge && (
                          <span className="promo-badge">{slide.badge}</span>
                        )}
                        <img
                          src={slide.image}
                          alt={slide.title}
                          className="hero-product-image"
                        />
                      </div>
                    </div>

                    <h2 className="hero-title mt-3">{slide.title}</h2>
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

// Shuffle helper
const shuffle = (array) => [...array].sort(() => 0.5 - Math.random());

export default HeroSlider;
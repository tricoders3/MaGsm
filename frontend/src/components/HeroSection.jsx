import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import camera from "../assets/images/camera.png";
import headphone from "../assets/images/holder.png";
import charger from "../assets/images/charger.png";

const slides = [
  {
    title: "Find the Best Prices",
    subtitle:
      "Compare prices across thousands of suppliers and save up to 60% instantly.",
    image: camera,
    discount: "-50%",
  },
  {
    title: "Mega Deals on Audio",
    subtitle:
      "Premium wireless headphones with unbeatable discounts.",
    image: headphone,
    discount: "-40%",
  },
  {
    title: "Fast Charging Essentials",
    subtitle:
      "High-quality chargers for all your devices at the best price.",
    image: charger,
    discount: "-30%",
  },
];

const HeroSlider = () => {
  return (
    <section className="hero-section position-relative overflow-hidden">
      <div className="hero-background"></div>

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
            <div className="container">
              <div className="row align-items-center py-5 custom-height">

                {/* LEFT TEXT */}
                <div className="col-lg-6 hero-text">

                  <span className="hero-badge">Limited Offer</span>

                  <h1 className="hero-title mt-3 mb-4">
                    {slide.title}
                  </h1>

                  <p className="hero-subtitle mb-5">
                    {slide.subtitle}
                  </p>

                  <Link
                    to="/products"
                    className="btn-redesign btn-primary-redesign btn-lg-redesign"
                  >
                    En Savoir Plus
                  </Link>
                </div>

                {/* RIGHT PRODUCT */}
                <div className="col-lg-6 d-flex justify-content-center hero-product">
  <div className="hero-product-wrapper">
    <span className="promo-badge">{slide.discount}</span>
    <img
      src={slide.image}
      alt="Product"
      className="hero-product-image"
    />
  </div>
</div>



              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default HeroSlider;

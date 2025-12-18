import React from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaChartLine, FaShieldAlt, FaBolt, FaUsers, FaStar,  } from 'react-icons/fa';
import BestSeller from '../components/BestSeller';
import PopularProducts from '../components/PopularProducts';
import ProductsCategory from '../components/ProductsCategory';
import Brands from '../components/Brands';
import camera from '../assets/images/camera.png';
const Home = () => {
 
        
  return (
    <div className="home-redesign">
      {/* Hero Section */}
      <section className="hero-section position-relative overflow-hidden">
        <div className="hero-background"></div>
        <div className="container">
          <div className="row align-items-center min-vh-100 py-5">
            <div className="col-lg-6 animate-fadeInUp">
              <h1 className="hero-title mb-4">
                Find the Best Prices
                {/*<span className="text-gradient d-block">Instantly</span>*/}
              </h1>
              <p className="hero-subtitle mb-5">
                Compare prices across thousands of suppliers and save up to 60% on your purchases. 
                Smart shopping made simple with AI-powered price intelligence.
              </p>
              <div className="hero-actions d-flex flex-column flex-sm-row gap-3">
                <Link to="/products" className="btn-redesign btn-primary-redesign btn-lg-redesign">
                  En Savoir Plus
                </Link>
              </div>
              <div className="hero-stats mt-5">
                <div className="row g-4">
                  <div className="col-4">
                    <div className="stat-item text-center">
                      <h3 className="stat-number text-gradient">50K+</h3>
                      <p className="stat-label">Products</p>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="stat-item text-center">
                      <h3 className="stat-number text-gradient">1000+</h3>
                      <p className="stat-label">Suppliers</p>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="stat-item text-center">
                      <h3 className="stat-number text-gradient">60%</h3>
                      <p className="stat-label">Avg Savings</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 animate-slideInRight">
              <div className="hero-image-container">
                <div className="floating-card  ">
                <img src={camera} alt="Camera" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*Best Seller Section */}
   

<BestSeller />
      {/* How It Works Section */}
 <ProductsCategory />

      {/* Testimonials Section */}
    <PopularProducts />
      {/* CTA Section */}
    <Brands />
    </div>
  );
};

export default Home;

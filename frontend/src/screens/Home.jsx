import React from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaChartLine, FaShieldAlt, FaBolt, FaUsers, FaStar } from 'react-icons/fa';

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
                <span className="text-gradient d-block">Instantly</span>
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
                <div className="floating-card card-redesign glass-effect">
                  <div className="card-body-redesign">
                    <div className="d-flex align-items-center mb-3">
                      <div className="product-image bg-gradient rounded me-3" style={{width: '60px', height: '60px'}}></div>
                      <div>
                        <h6 className="mb-1">iPhone 15 Pro</h6>
                        <small className="text-muted">Comparing 15 suppliers...</small>
                      </div>
                    </div>
                    <div className="price-comparison">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="text-muted">Best Price:</span>
                        <span className="h5  mb-0">$999</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-muted">You Save:</span>
                        <span className="fw-bold">$200</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">Why Choose PriceFinder?</h2>
            <p className="section-subtitle">Powerful features that make price comparison effortless</p>
          </div>
          <div className="row g-4">
            <div className="col-lg-4 col-md-6">
              <div className="feature-card card-redesign hover-lift">
                <div className="card-body-redesign text-center">
                  <div className="feature-icon mb-4">
                    <FaBolt />
                  </div>
                  <h5 className="feature-title">Lightning Fast</h5>
                  <p className="feature-description">
                    Get instant price comparisons across thousands of suppliers in seconds.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="feature-card card-redesign hover-lift">
                <div className="card-body-redesign text-center">
                  <div className="feature-icon mb-4">
                    <FaChartLine />
                  </div>
                  <h5 className="feature-title">Smart Analytics</h5>
                  <p className="feature-description">
                    AI-powered insights help you make informed purchasing decisions.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="feature-card card-redesign hover-lift">
                <div className="card-body-redesign text-center">
                  <div className="feature-icon mb-4">
                    <FaShieldAlt />
                  </div>
                  <h5 className="feature-title">Trusted Suppliers</h5>
                  <p className="feature-description">
                    All suppliers are verified and rated by our community of users.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Three simple steps to better prices</p>
          </div>
          <div className="row g-4">
            <div className="col-lg-4">
              <div className="step-card text-center">
                <div className="step-number">1</div>
                <h5 className="step-title">Search Product</h5>
                <p className="step-description">
                  Enter the product name or upload an image to start your search.
                </p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="step-card text-center">
                <div className="step-number">2</div>
                <h5 className="step-title">Compare Prices</h5>
                <p className="step-description">
                  View real-time prices from multiple verified suppliers instantly.
                </p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="step-card text-center">
                <div className="step-number">3</div>
                <h5 className="step-title">Save Money</h5>
                <p className="step-description">
                  Choose the best deal and save up to 60% on your purchase.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">What Our Users Say</h2>
            <p className="section-subtitle">Join thousands of satisfied customers</p>
          </div>
          <div className="row g-4">
            <div className="col-lg-4">
              <div className="testimonial-card card-redesign">
                <div className="card-body-redesign">
                  <div className="stars mb-3">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="text-warning" />
                    ))}
                  </div>
                  <p className="testimonial-text">
                    "PriceFinder saved me over $500 on my last electronics purchase. The interface is so easy to use!"
                  </p>
                  <div className="testimonial-author">
                    <strong>Sarah Johnson</strong>
                    <small className="text-muted d-block">Verified Buyer</small>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="testimonial-card card-redesign">
                <div className="card-body-redesign">
                  <div className="stars mb-3">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="text-warning" />
                    ))}
                  </div>
                  <p className="testimonial-text">
                    "As a business owner, this tool helps me find the best deals for bulk purchases. Highly recommended!"
                  </p>
                  <div className="testimonial-author">
                    <strong>Mike Chen</strong>
                    <small className="text-muted d-block">Business Owner</small>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="testimonial-card card-redesign">
                <div className="card-body-redesign">
                  <div className="stars mb-3">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="text-warning" />
                    ))}
                  </div>
                  <p className="testimonial-text">
                    "The real-time price updates and supplier ratings make shopping decisions so much easier."
                  </p>
                  <div className="testimonial-author">
                    <strong>Emily Davis</strong>
                    <small className="text-muted d-block">Tech Enthusiast</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-5">
        <div className="container">
          <div className="cta-card card-redesign glass-effect text-center">
            <div className="card-body-redesign py-5">
              <h2 className="cta-title text-white mb-4">Ready to Start Saving?</h2>
              <p className="cta-subtitle text-white mb-4">
                Join over 100,000 smart shoppers who save money every day with PriceFinder.
              </p>
              <Link to="/price" className="btn-redesign btn-glass-redesign btn-xl-redesign">
                <FaSearch className="me-2" />
                Start Comparing Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

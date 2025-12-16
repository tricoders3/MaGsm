
import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaPinterestP, FaStore } from "react-icons/fa";

function Footer(props) {
  return (
    <footer className="footer-redesign">
      <div className="container">
        <div className="footer-content">
          <div className="row">
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="footer-brand">
                <div className="footer-logo">
                  <FaStore className="me-2" />
                  <span>PriceFinder</span>
                </div>
                <p className="footer-description">
                  Compare prices across multiple suppliers and find the best deals for your business needs.
                </p>
              </div>
            </div>
            
            <div className="col-lg-2 col-md-6 mb-4">
              <h5 className="footer-title">Quick Links</h5>
              <ul className="footer-links">
                <li><a href="/">Home</a></li>
                <li><a href="/price">Compare Prices</a></li>
                <li><a href="/products">Products</a></li>
                <li><a href="/favorites">Favorites</a></li>
              </ul>
            </div>
            
            <div className="col-lg-2 col-md-6 mb-4">
              <h5 className="footer-title">Support</h5>
              <ul className="footer-links">
                <li><a href="#">Help Center</a></li>
                <li><a href="#">FAQs</a></li>
                <li><a href="#">Contact Us</a></li>
                <li><a href="#">Blog</a></li>
              </ul>
            </div>
            
            <div className="col-lg-4 col-md-6 mb-4">
              <h5 className="footer-title">Follow Us</h5>
              <div className="footer-social">
                <a href="#" className="social-link">
                  <FaFacebookF />
                </a>
                <a href="#" className="social-link">
                  <FaTwitter />
                </a>
                <a href="#" className="social-link">
                  <FaInstagram />
                </a>
                <a href="#" className="social-link">
                  <FaPinterestP />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="row align-items-center">
            <div className="col-md-6">
              <p className="copyright">
                © 2024 PriceFinder. All rights reserved.
              </p>
            </div>
            <div className="col-md-6">
              <div className="footer-bottom-links">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
 
 export default Footer;
 
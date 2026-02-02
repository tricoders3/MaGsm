
import React from "react";
import { FaFacebookF,  FaInstagram, FaWhatsapp, FaTiktok } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo.png"; 
import { useAuth } from "../context/AuthContext";

function Footer(props) {
  const { isAuthenticated } = useAuth();
  return (
<footer className="footer-redesign">
  <div className="container">
    <div className="footer-content py-4">
      <div className="row">

        {/* Branding */}
        <div className="col-lg-4 col-md-6 mb-4">
          <div className="footer-brand d-flex flex-column align-items-start">
            <Link to="/" className="navbar-brand-redesign d-flex align-items-center mb-2">
              <img src={logo} alt="MA GSM Logo" style={{ height: 50, width: 'auto', marginRight: 10 }} />
              <span>MA GSM</span>
            </Link>
            <p className="footer-description">
            Votre boutique de confiance pour accessoires, outils et pièces détachées GSM. Qualité, choix et prix compétitifs pour tous vos besoins mobiles.
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="col-lg-2 col-md-6 mb-2">
          <h5 className="footer-title">Navigation</h5>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/offers">Offres</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* User Actions */}
        <div className="col-lg-3 col-md-6 mb-2">
          <h5 className="footer-title">Mon Compte</h5>
          <ul className="footer-links">
            {isAuthenticated ? (
              <>
                <li><Link to="/profile">Profil</Link></li>
                <li><Link to="/cart">Panier</Link></li>
                <li><Link to="/favoris">Favoris</Link></li>
              </>
            ) : (
              <li><Link to="/login">Se connecter</Link></li>
            )}
          </ul>
        </div>

        {/* Social Media */}
        <div className="col-lg-3 col-md-6 mb-2">
          <h5 className="footer-title">Suivez-nous</h5>
          <div className="footer-social d-flex gap-3">
          <a
            href="https://www.facebook.com/share/1HkBqAnKHi/?mibextid=wwXIfr"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link text-light"
            ><FaFacebookF /></a>
            <a href="https://www.instagram.com/ma_gsm_/" target="_blank" rel="noopener noreferrer" className="social-link"><FaInstagram /></a>
            <a href="https://www.tiktok.com/@ma_gsm" target="_blank" rel="noopener noreferrer" className="social-link"><FaTiktok /></a>
            <a
                  href="https://wa.me/21620771717?text=مرحبا%20👋%20نحب%20نستفسر%20على%20منتجاتكم%20من%20فضلكم" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link text-light"
                >
                  <FaWhatsapp />
                </a>
          </div>
        </div>

      </div>
    </div>

    {/* Footer Bottom */}
    <div className="footer-bottom py-2 border-top d-flex justify-content-between align-items-center">
      <p className="copyright mb-0">
        © {new Date().getFullYear()} MA GSM. All rights reserved.
      </p>
      <div className="footer-bottom-links d-flex gap-3">
        <Link to="#">Privacy Policy</Link>
        <Link to="#">Terms of Service</Link>
      </div>
    </div>
  </div>
</footer>
  );
}
 
 export default Footer;
 
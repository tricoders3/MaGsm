import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaUser,
  FaShoppingBag,
  FaBars,
} from "react-icons/fa";
import { FiLogOut,FiUser } from "react-icons/fi";
import logo from "../assets/images/logo.png";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import BASE_URL from "../constante";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar"; 
import Badge from "./Badge"; 
import { useCart } from "../context/CartContext";

function NavBar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const isAdmin = isAuthenticated && user?.role === "admin";
  const menuRef = useRef(null);
    const { cartCount, favoritesCount } = useCart();



  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      navigate("/admin");
    }
  }, [isAuthenticated, user, navigate]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/categories`);
        setCategories(res.data);
      } catch (err) {
        console.error("Error fetching categories", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);


  return (
    <>

      <nav className={`navbar-redesign ${isScrolled ? "scrolled" : ""}`}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center w-100 py-md-3 py-0">

            {/* Logo */}
            <Link to="/" className="navbar-brand-redesign d-flex align-items-center">
              <img src={logo} alt="MA GSM" style={{ height: 60, marginRight: 10 }} />
              <span>MA GSM</span>
            </Link>

            {/* Desktop Links */}
            <div className="d-none d-lg-flex align-items-center">
              <Link to="/" className="nav-link-redesign mx-3">Home</Link>
              <Link to="/about" className="nav-link-redesign mx-3">About Us</Link>
              <Link to="/offers" className="nav-link-redesign mx-3">Offres</Link>
              <Link to="/contact" className="nav-link-redesign mx-3">Contact</Link>
              
            </div>

            {/* Actions */}
            <div className="d-flex align-items-center gap-3">

              {/* Auth */}
          
 {/* Cart */}
 {isAuthenticated && (
      <div className="position-relative">
        <button className="nav-icon-redesign" onClick={() => navigate("/cart")}>
          <FaShoppingBag />
        </button>
        <Badge count={cartCount} />
      </div>
 )}
      {/* Favorites */}
      <div className="position-relative">
        <button className="nav-icon-redesign" onClick={() => navigate("/favoris")}>
          <FaHeart />
        </button>
        <Badge count={favoritesCount} />
      </div>

      <div className="d-none d-lg-flex">
                {isAuthenticated ?  (
                  <div className="nav-avatar-wrapper" ref={menuRef}>
                    <button
                      className="nav-avatar"
                      onClick={() => setShowMenu((prev) => !prev)}
                    >
                      {user?.name?.charAt(0).toUpperCase()}
                    </button>

                    {showMenu && ( 
                      <div className="nav-avatar-menu">
                      <div className="nav-avatar-user"> 
                      <div>
                     <div className="nav-avatar-name">{user.name}</div>
                     <div className="nav-avatar-email">{user.email}</div> 
                    </div> 
                    </div> 
                
                                <button
                                     onClick={() => {
                                      navigate("/profile");
                                      setShowMenu(false);
                                    }}
                                  >
                                    <FiUser /> Profil
                                  </button>

                    <button className="logout d-none d-md-block"
                    onClick={() => 
                    { logout(); 
                    setShowMenu(false); 
                    navigate("/");
                     toast.success("Déconnexion réussie"); }} > 
                    <FiLogOut size={18} /> Déconnexion </button> 
                    </div> 
                  )}
                  </div>
                ) : (
                  <button
                    className="nav-icon-redesign"
                    onClick={() => navigate("/login")}
                  >
                    <FaUser />
                  </button>
                )}
              </div>
              {/* Mobile Menu */}
              <button
                className="nav-icon-redesign"
                data-bs-toggle="offcanvas"
                data-bs-target="#mobileMenu"
              >
                <FaBars />
              </button>
            </div>
          </div>
        </div>
      </nav>
      <Sidebar categories={categories} loading={loading} />
    </>
  );
}

export default NavBar;

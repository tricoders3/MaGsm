import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaSearch, FaUser, FaShoppingBag, FaBars, FaStore } from "react-icons/fa";
import logo from "../assets/images/logo.png"; 
import { useAuth } from "../context/AuthContext";
import { FiLogOut } from "react-icons/fi";


function NavBar() {

  const { user, isAuthenticated, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const navigate = useNavigate ();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
  
  return (
    <>
    <nav className={`navbar-redesign ${isScrolled ? "scrolled" : ""}`}>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center w-100 py-3">
          {/* Logo */}
          <div className="d-flex align-items-center">
  <Link to="/" className="navbar-brand-redesign d-flex align-items-center">
    <img 
      src={logo} 
      alt="PriceFinder Logo" 
      style={{ height: "60px", width: "auto", marginRight: "10px" }} 
    />
<span>
  MA GSM
</span>


  </Link>
</div>


          {/* Navigation Links (desktop only) */}
          <div className="d-none d-lg-flex align-items-center">
            <Link to="/" className="nav-link-redesign mx-3">
              Home
            </Link>
            <Link to="/about" className="nav-link-redesign mx-3">
              About US
            </Link>
            <Link to="/news" className="nav-link-redesign mx-3">
              News
            </Link>
            <Link to="/contact" className="nav-link-redesign mx-3">
              Contact
            </Link>
          </div>

          {/* Action Icons */}
   
          <div className="d-flex align-items-center gap-3">
            <div className="d-none d-lg-flex align-items-center gap-3">

         {isAuthenticated ? (
  <div className="nav-avatar-wrapper" ref={menuRef}>
    <button
      className="nav-avatar"
      onClick={() => setShowMenu((prev) => !prev)}
      title="Account"
    >
      {user.name.charAt(0).toUpperCase()}
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
  className="nav-avatar-logout"
  onClick={() => {
    logout();
    setShowMenu(false);
    navigate("/");
  }}
>
  <FiLogOut size={18} />
 Déconnexion
</button>

      </div>
    )}
  </div>
) : (
  <button
    className="nav-icon-redesign"
    title="Account"
    onClick={() => navigate("/login")}
  >
    <FaUser />
  </button>
)}



            </div>
            {/* Favorites */}
            <button
              className="nav-icon-redesign position-relative"
              title="Favorites"
            >
              <FaHeart />
              {/* <span className="nav-badge-redesign"></span> */}
            </button>

           
           
         
            {/* Cart */}
            <button
              className="nav-icon-redesign position-relative"
              title="Shopping Cart"
            >
              <FaShoppingBag />
             {/* <span className="nav-badge-redesign"></span> */}
            </button>
          
            {/* Mobile Menu Toggle */}
            <button
              className="nav-icon-redesign "
              data-bs-toggle="offcanvas"
              data-bs-target="#mobileMenu"
              aria-controls="mobileMenu"
              title="Menu"
            >
              <FaBars />
            </button>
          </div>
        </div>
      </div>
    </nav>

 
    {/* Mobile Menu Offcanvas */}
    <div
 className="offcanvas offcanvas-start"
  tabIndex="-1"
  id="mobileMenu"
  aria-labelledby="mobileMenuLabel"
>
<div className="offcanvas-header d-flex align-items-center justify-content-between">
    
    {/* Mobile Brand Logo */}
    <Link to="/" className="d-flex align-items-center">
      <img 
        src={logo} 
        alt="MA GSM Logo" 
        style={{ height: "50px", width: "auto", marginRight: "10px" }} 
      />
      <span style={{ fontWeight: 600, color: "var(--primary-color)" }}>
        MA GSM
      </span>
    </Link>

    <button
      type="button"
      className="btn-close"
      data-bs-dismiss="offcanvas"
    ></button>
  </div>

  <div className="offcanvas-body d-flex flex-column gap-1">

    {/* Mobile-only search input */}
    <div className="mobile-search-wrapper d-lg-none">
      <input
        type="text"
        placeholder="Rechercher..."
        className="mobile-search-input"
      />
      <FaSearch className="mobile-search-icon" />
    </div>

    {/* Categories */}
    <div className="categories-section d-flex flex-column gap-1">
      <Link to="/category/phones" className="nav-link-sidebar" data-bs-dismiss="offcanvas">
         Phones
      </Link>
      <Link to="/category/laptops" className="nav-link-sidebar" data-bs-dismiss="offcanvas">
         Laptops
      </Link>
      <Link to="/category/accessories" className="nav-link-sidebar" data-bs-dismiss="offcanvas">
         Accessories
      </Link>
      <Link to="/category/smart-home" className="nav-link-sidebar" data-bs-dismiss="offcanvas">
         Smart Home
      </Link>
    </div>

    {/* Mobile links */}
    <div className="d-lg-none d-flex flex-column gap-2">
      <Link to="/home" className="nav-link-sidebar" data-bs-dismiss="offcanvas">
        Home
      </Link>
      <Link to="/about" className="nav-link-sidebar" data-bs-dismiss="offcanvas">
        About US
      </Link>
      <Link to="/news" className="nav-link-sidebar" data-bs-dismiss="offcanvas">
        News
      </Link>
      <Link to="/contact" className="nav-link-sidebar" data-bs-dismiss="offcanvas">
        Contact
      </Link>
      <Link to="/login" className="nav-link-sidebar" data-bs-dismiss="offcanvas">
        S'inscrire
      </Link>
      <Link to="/register" className="nav-link-sidebar" data-bs-dismiss="offcanvas">
        Se Connecter
      </Link>
    </div>

  </div>
</div>

 
  </>
  );
}

export default NavBar;
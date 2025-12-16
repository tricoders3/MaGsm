import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaSearch, FaUser, FaShoppingBag, FaBars, FaStore } from "react-icons/fa";

function NavBar() {

 
  const [isScrolled, setIsScrolled] = useState(false);



  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar-redesign ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center w-100 py-3">
          {/* Logo Section */}
          <div className="d-flex align-items-center">
            <Link to="/" className="navbar-brand-redesign d-flex align-items-center">
              <FaStore className="me-2" style={{ fontSize: '1.5rem' }} />
              <span>PriceFinder</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="d-none d-lg-flex align-items-center">
            <Link to="/" className="nav-link-redesign mx-3">
              Home
            </Link>
            <Link to="/price" className="nav-link-redesign mx-3">
              Compare Prices
            </Link>
            <Link to="/products" className="nav-link-redesign mx-3">
              Products
            </Link>
            <Link to="/smart-navigator" className="nav-link-redesign mx-3">
              Smart Navigator
            </Link>
            <Link to="/contact" className="nav-link-redesign mx-3">
              Contact
            </Link>
          </div>

          {/* Action Icons */}
          <div className="d-flex align-items-center gap-3">
            {/* Search Icon */}
            <button 
              className="nav-icon-redesign"
              
              title="Search"
            >
              <FaSearch />
            </button>

            {/* Favorites Icon */}
            <button 
              className="nav-icon-redesign position-relative"
     
              title="Favorites"
            >
              <FaHeart />
             
                <span className="nav-badge-redesign">
                
                </span>
            
            </button>

            {/* User Icon */}
            <button 
              className="nav-icon-redesign"
           
              title="Account"
            >
              <FaUser />
            </button>

            {/* Cart Icon */}
            <button 
              className="nav-icon-redesign position-relative"
           
              title="Shopping Cart"
              style={{ 
                background: 'var(--primary-gradient)',
                color: 'var(--white)',
                border: 'none'
              }}
            >
              <FaShoppingBag />
           
                <span className="nav-badge-redesign">
               
                </span>
          
            </button>

            {/* Mobile Menu Toggle */}
            <button 
              className="nav-icon-redesign d-lg-none"
              data-bs-toggle="offcanvas" 
              data-bs-target="#mobileMenu"
              title="Menu"
            >
              <FaBars />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Offcanvas */}
      <div className="offcanvas offcanvas-end" tabIndex="-1" id="mobileMenu">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title text-gradient">Menu</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
        </div>
        <div className="offcanvas-body">
          <div className="d-flex flex-column gap-3">
            <Link to="/home" className="nav-link-redesign" data-bs-dismiss="offcanvas">
              Home
            </Link>
            <Link to="/price" className="nav-link-redesign" data-bs-dismiss="offcanvas">
              Compare Prices
            </Link>
            <Link to="/products" className="nav-link-redesign" data-bs-dismiss="offcanvas">
              Products
            </Link>
            <Link to="/smart-navigator" className="nav-link-redesign" data-bs-dismiss="offcanvas">
              Smart Navigator
            </Link>
            <Link to="/contact" className="nav-link-redesign" data-bs-dismiss="offcanvas">
              Contact
            </Link>
            <hr />
            <Link to="/search" className="nav-link-redesign" data-bs-dismiss="offcanvas">
              Search
            </Link>
            <Link to="/favorites" className="nav-link-redesign" data-bs-dismiss="offcanvas">
              Favorites
            </Link>
            <Link to="/login" className="nav-link-redesign" data-bs-dismiss="offcanvas">
              Account
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
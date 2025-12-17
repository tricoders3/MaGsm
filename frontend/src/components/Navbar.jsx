import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaSearch, FaUser, FaShoppingBag, FaBars, FaStore } from "react-icons/fa";
import logo from "../assets/images/logo.png"; 


function NavBar() {

 
  const [isScrolled, setIsScrolled] = useState(false);
  const [showCategories, setShowCategories] = useState(false);



  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
            {/* Categories Sidebar Icon */}
          

            {/* Search */}
            <button className="nav-icon-redesign" title="Search">
              <FaSearch />
            </button>

            {/* Favorites */}
            <button
              className="nav-icon-redesign position-relative"
              title="Favorites"
            >
              <FaHeart />
              <span className="nav-badge-redesign"></span>
            </button>

            {/* User */}
            <button className="nav-icon-redesign" title="Account">
              <FaUser />
            </button>

            {/* Cart */}
            <button
              className="nav-icon-redesign position-relative"
              title="Shopping Cart"
              style={{
                background: "var(--primary-gradient)",
                color: "var(--white)",
                border: "none",
              }}
            >
              <FaShoppingBag />
              <span className="nav-badge-redesign"></span>
            </button>
            <button
              className="nav-icon-redesign"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#categoriesSidebar"
              aria-controls="categoriesSidebar"
              title="Categories"
            >
              <FaBars />
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

    {/* Categories Sidebar Offcanvas */}
    <div
      className="offcanvas offcanvas-start categories-sidebar"
      tabIndex="-1"
      id="categoriesSidebar"
      aria-labelledby="categoriesSidebarLabel"
    >
      <div className="offcanvas-header">
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>

      <div className="offcanvas-body">
        <ul className="list-unstyled">
          {/* Empty for now, will fill with API data later */}
        </ul>
      </div>
    </div>
 
    {/* Mobile Menu Offcanvas */}
    <div
      className="offcanvas offcanvas-end"
      tabIndex="-1"
      id="mobileMenu"
      aria-labelledby="mobileMenuLabel"
    >
      <div className="offcanvas-header">
        <h5 className="offcanvas-title text-gradient" id="mobileMenuLabel">
          Menu
        </h5>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="offcanvas"
        ></button>
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
  </>
  );
}

export default NavBar;
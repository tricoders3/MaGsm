import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaChevronDown, FaChevronRight } from "react-icons/fa";
import axios from "axios";
import BASE_URL from "../constante";
import logo from "../assets/images/logo.png";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ categories, loading }) => {
  const [openCategoryId, setOpenCategoryId] = useState(null);
  const [subcategories, setSubcategories] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();


  const hideOffcanvas = () => {
    const el = document.getElementById("mobileMenu");
    if (!el) return;
    const instance = window.bootstrap?.Offcanvas.getInstance(el) || (window.bootstrap ? new window.bootstrap.Offcanvas(el) : null);
    if (instance) instance.hide();
    else {
      el.classList.remove("show");
      document.body.classList.remove("offcanvas-backdrop");
    }
  };

  const handleNav = (to) => {
    navigate(to);
    hideOffcanvas();
  };

  const fetchSubcategories = async (categoryId) => {
    try {
      if (subcategories[categoryId]) return;

      const res = await axios.get(
        `${BASE_URL}/api/categories/${categoryId}/subcategories`
      );

      setSubcategories((prev) => ({
        ...prev,
        [categoryId]: res.data,
      }));
    } catch (err) {
      console.error("Error fetching subcategories", err);
    }
  };
      const handleLogout = () => {
  logout();               // clears context + localStorage
  handleNav("/login");    // redirect
};
  const handleSearch = async () => {
    const trimmedQuery = searchQuery.trim().toLowerCase();
    if (!trimmedQuery) return;
    
    
    try {
    const [productsRes, promosRes] = await Promise.all([
    axios.get(`${BASE_URL}/api/products`, {
    params: { search: trimmedQuery },
    }),
    axios.get(`${BASE_URL}/api/promotions/promos`, {
    params: { search: trimmedQuery },
    }),
    ]);


    
    navigate("/recherche", {
    state: {
    products: productsRes.data || [],
    promotions: promosRes.data || [],
    },
    });
    hideOffcanvas(); 
    } catch (e) {
    console.error("Erreur lors de la recherche mobile:", e);
    navigate("/recherche", { state: { products: [], promotions: [] } });
    hideOffcanvas();
    }
    };
  return (
    <div
      className="offcanvas offcanvas-start"
      tabIndex="-1"
      id="mobileMenu"
      data-bs-backdrop="false" 
      aria-labelledby="mobileMenuLabel"
    >
      {/* Header */}
      <div className="offcanvas-header d-flex align-items-center justify-content-between">
            <Link to="/" className="d-flex align-items-center gap-2 logo-link" onClick={(e) => { e.preventDefault(); handleNav("/"); }}>
            <img
                src={logo}
                alt="MA GSM Logo"
                className="logo-img"
            />
            <span className="logo-text">MA GSM</span>
        </Link>

        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="offcanvas"
          style={{ filter: "invert(1)"}}
        />
      </div>

      {/* Body */}
      <div className="offcanvas-body d-flex flex-column gap-2">

        {/* Search */}
        <div className="mobile-search-wrapper d-lg-none">
            <input
            type="text"
            placeholder="Rechercher un produit ou promotion..."
            className="mobile-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <FaSearch
            className="mobile-search-icon"
            onClick={handleSearch}
            style={{ cursor: "pointer" }}
            />
            </div>

        {/* Categories */}
        <div className="categories-section d-flex flex-column gap-1">
          {loading ? (
            <p>Loading categories...</p>
          ) : (
            categories.map((category) => (
              <div key={category._id}>
                <button
                  className="nav-link-sidebar d-flex justify-content-between align-items-center w-100"
                  onClick={() => {
                    const isOpen = openCategoryId === category._id;
                    setOpenCategoryId(isOpen ? null : category._id);
                    fetchSubcategories(category._id);
                  }}
                >
                  <span>{category.name}</span>
                  {openCategoryId === category._id ? (
                    <FaChevronDown size={14} />
                  ) : (
                    <FaChevronRight size={14} />
                  )}
                </button>

                {openCategoryId === category._id && (
                  <div className="subcategory-list ps-3">
                    {subcategories[category._id]?.map((sub) => (
                      <Link
                        key={sub._id}
                        to={`/products/subcategory/${sub._id}`}
                        className="nav-sublink-sidebar"
                        onClick={(e) => { e.preventDefault(); handleNav(`/products/subcategory/${sub._id}`); }}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Links */}
       <div className="d-lg-none d-flex flex-column gap-2 mt-2">
  <Link
    to="/"
    className="nav-link-sidebar"
    onClick={(e) => { e.preventDefault(); handleNav("/"); }}
  >
    Home
  </Link>

  <Link
    to="/about"
    className="nav-link-sidebar"
    onClick={(e) => { e.preventDefault(); handleNav("/about"); }}
  >
    About Us
  </Link>

  <Link
    to="/offers"
    className="nav-link-sidebar"
    onClick={(e) => { e.preventDefault(); handleNav("/offers"); }}
  >
    Offres
  </Link>

  <Link
    to="/contact"
    className="nav-link-sidebar"
    onClick={(e) => { e.preventDefault(); handleNav("/contact"); }}
  >
    Contact
  </Link>

  {isAuthenticated ? (
    <>
      {/* ✅ LOGGED IN */}
      <Link
        to="/profile"
        className="nav-link-sidebar"
        onClick={(e) => { e.preventDefault(); handleNav("/profile"); }}
      >
        Profil
      </Link>

      <button
        className="nav-link-sidebar text-danger text-start bg-transparent border-0"
        onClick={handleLogout}
      >
        Se déconnecter
      </button>
    </>
  ) : (
    <>
      {/* ❌ NOT LOGGED IN */}
      <Link
        to="/login"
        className="nav-link-sidebar"
        onClick={(e) => { e.preventDefault(); handleNav("/login"); }}
      >
        Se connecter
      </Link>

      <Link
        to="/register"
        className="nav-link-sidebar"
        onClick={(e) => { e.preventDefault(); handleNav("/register"); }}
      >
        S’inscrire
      </Link>
    </>
  )}
</div>

      </div>
    </div>
  );
};

export default Sidebar;

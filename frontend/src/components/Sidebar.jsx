import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaChevronDown, FaChevronRight } from "react-icons/fa";
import axios from "axios";
import BASE_URL from "../constante";
import logo from "../assets/images/logo.png";

const Sidebar = ({ categories, loading }) => {
  const [openCategoryId, setOpenCategoryId] = useState(null);
  const [subcategories, setSubcategories] = useState({});

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

  return (
    <div
      className="offcanvas offcanvas-start"
      tabIndex="-1"
      id="mobileMenu"
      aria-labelledby="mobileMenuLabel"
    >
      {/* Header */}
      <div className="offcanvas-header d-flex align-items-center justify-content-between">
        <Link to="/" className="d-flex align-items-center">
          <img
            src={logo}
            alt="MA GSM Logo"
            style={{ height: "50px", marginRight: "10px" }}
          />
          <span style={{ fontWeight: 600, color: "var(--primary-color)" }}>MA GSM</span>
        </Link>

        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="offcanvas"
        />
      </div>

      {/* Body */}
      <div className="offcanvas-body d-flex flex-column gap-2">

        {/* Search */}
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
                        data-bs-dismiss="offcanvas"
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
          <Link to="/" className="nav-link-sidebar" data-bs-dismiss="offcanvas">
            Home
          </Link>
          <Link to="/about" className="nav-link-sidebar" data-bs-dismiss="offcanvas">
            About Us
          </Link>
          <Link to="/offers" className="nav-link-sidebar" data-bs-dismiss="offcanvas">
            Offres
          </Link>
          <Link to="/contact" className="nav-link-sidebar" data-bs-dismiss="offcanvas">
            Contact
          </Link>
          <Link to="/login" className="nav-link-sidebar" data-bs-dismiss="offcanvas">
            Se connecter
          </Link>
          <Link to="/register" className="nav-link-sidebar" data-bs-dismiss="offcanvas">
            S’inscrire
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

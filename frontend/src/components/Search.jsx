import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import BASE_URL from "../constante";
import { useGlobalSearch } from "../context/SearchContext";

export default function GlobalSearch() {
  const { query, setQuery, categoryId, setCategoryId, subCategoryId, setSubCategoryId } = useGlobalSearch();
  const navigate = useNavigate();
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const isCategoryPage = location.pathname.startsWith("/category");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/categories`);
        setCategories(data);
      } catch (e) {
        // silent fail
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const loadSubs = async () => {
      // Always reset subcategory when category changes to avoid stale filters
      setSubCategoryId("");
      if (!categoryId) {
        setSubCategories([]);
        return;
      }
      try {
        const { data } = await axios.get(`${BASE_URL}/api/categories/${categoryId}/subcategories`);
        setSubCategories(data);
      } catch (e) {
        setSubCategories([]);
      }
    };
    loadSubs();
  }, [categoryId]);
    
  const handleSearch = () => {
    const onListingPage =
      location.pathname.startsWith("/products") ||
      location.pathname.startsWith("/offers") ||
      location.pathname.startsWith("/category");

    if (onListingPage) {
      // Stay on the same page; filtering happens in-page via context consumers
      return;
    }

    if (query.trim().length > 0 || categoryId || subCategoryId) {
      navigate("/recherche");
    }
  };

  return (
    <div className="global-search-wrapper">
      <div className="container">
        <div className="global-search-box w-100">
          {/* Category */}
          <select
            className="form-select me-2"
            style={{ maxWidth: 180, height: 40, borderRadius: 9999 }}
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            disabled={isCategoryPage}
          >
            <option value="">Toutes catégories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>

          {/* Subcategory */}
          <select
            className="form-select me-2"
            style={{ maxWidth: 220, height: 40, borderRadius: 9999 }}
            value={subCategoryId}
            onChange={(e) => setSubCategoryId(e.target.value)}
            disabled={isCategoryPage || !categoryId}
          >
            <option value="">Toutes sous-catégories</option>
            {subCategories.map((sc) => (
              <option key={sc._id} value={sc._id}>{sc.name}</option>
            ))}
          </select>
<div className="search-input-wrapper flex-grow-1">
          {/* Search input */}
          <input
            type="search"
            className="global-search-input flex-grow-1"
            placeholder="Rechercher un produit par nom..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
</div>
          {/* Search icon as button on the right */}
          <button
            type="button"
            className="search-button"
            onClick={handleSearch}
            aria-label="Rechercher"
            title="Rechercher"
          >
            <FiSearch size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

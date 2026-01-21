import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import BASE_URL from "../constante";
import { useGlobalSearch } from "../context/SearchContext";

export default function GlobalSearch() {
  const { query, setQuery, categoryId, setCategoryId, subCategoryId, setSubCategoryId } = useGlobalSearch();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

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
      if (!categoryId) {
        setSubCategories([]);
        setSubCategoryId("");
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
            disabled={!categoryId}
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

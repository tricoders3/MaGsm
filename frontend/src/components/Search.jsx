import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import BASE_URL from "../constante";
import { useGlobalSearch } from "../context/SearchContext";

export default function GlobalSearch() {
  const {
    query,
    setQuery,
    categoryId,
    setCategoryId,
    subCategoryId,
    setSubCategoryId,
  } = useGlobalSearch();
  
  const navigate = useNavigate();
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const isCategoryPage = location.pathname.startsWith("/category");

  // 🔹 Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/categories`);
        setCategories(data);
      } catch (e) {
        console.error(e);
      }
    };
    loadCategories();
  }, []);

  // 🔹 Load subcategories when category changes
  useEffect(() => {
    setSubCategoryId("");
    if (!categoryId) {
      setSubCategories([]);
      return;
    }
    const loadSubs = async () => {
      try {
        const { data } = await axios.get(
          `${BASE_URL}/api/categories/${categoryId}/subcategories`
        );
        setSubCategories(data);
      } catch (e) {
        setSubCategories([]);
      }
    };
    loadSubs();
  }, [categoryId]);

  // 🔹 Handle search
  const handleSearch = async () => {
    const trimmedQuery = query.trim().toLowerCase();

    const onListingPage =
      location.pathname.startsWith("/products") ||
      location.pathname.startsWith("/offers") ||
      location.pathname.startsWith("/category");

    if (onListingPage) {
      // Stay on the page; filtering will happen in-page via context consumers
      return;
    }

    try {
      // Fetch products + promotions filtered by category / subcategory / query
      const [productsRes, promosRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/products`, {
          params: {
            categoryId: categoryId || undefined,
            subCategoryId: subCategoryId || undefined,
            search: trimmedQuery || undefined,
          },
        }),
        axios.get(`${BASE_URL}/api/promotions/promos`, {
          params: {
            categoryId: categoryId || undefined,
            subCategoryId: subCategoryId || undefined,
            search: trimmedQuery || undefined,
          },
        }),
      ]);

      const productsData = productsRes.data || [];
      const promosData = promosRes.data || [];

      // Navigate to results page with state
      navigate("/recherche", {
        state: { products: productsData, promotions: promosData },
      });
    } catch (e) {
      console.error("Erreur lors de la recherche globale:", e);
      navigate("/recherche", { state: { products: [], promotions: [] } });
    }
  };

  return (
    <div className="global-search-wrapper">
      <div className="container">
        <div className="global-search-box w-100 d-flex align-items-center">
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

          {/* Search input */}
          <div className="search-input-wrapper flex-grow-1">
            <input
              type="search"
              className="global-search-input flex-grow-1"
              placeholder="Rechercher un produit ou promotion..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>

          {/* Search button */}
          <button
            type="button"
            className="search-button ms-2"
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

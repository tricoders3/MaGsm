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


  const HIDE_CATEGORY_FILTERS_ROUTES = [
    "/offers",
    "/top-products",
    "/products",
    "/checkout",
    "/profile",
    "/admin",
  ];

  const hideCategoryFilters = HIDE_CATEGORY_FILTERS_ROUTES.some((path) =>
    location.pathname.startsWith(path)
  );

  const isCategoryPage = location.pathname.startsWith("/category");

  useEffect(() => {
    if (!location.pathname.startsWith("/recherche")) {
    setQuery("");
    setCategoryId("");
    setSubCategoryId("");
    }
    }, [location.pathname]);

  useEffect(() => {
    if (hideCategoryFilters) return;

    const loadCategories = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/categories`);
        setCategories(data);
      } catch (e) {
        console.error(e);
      }
    };

    loadCategories();
  }, [hideCategoryFilters]);



  useEffect(() => {
    setSubCategoryId("");

    if (!categoryId || hideCategoryFilters) {
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
  }, [categoryId, hideCategoryFilters]);



  const handleSearch = async () => {
    const trimmedQuery = query.trim().toLowerCase();

    try {
      const [productsRes, promosRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/products`, {
          params: {
            categoryId: hideCategoryFilters ? undefined : categoryId,
            subCategoryId: hideCategoryFilters ? undefined : subCategoryId,
            search: trimmedQuery || undefined,
          },
        }),
        axios.get(`${BASE_URL}/api/promotions/promos`, {
          params: {
            categoryId: hideCategoryFilters ? undefined : categoryId,
            subCategoryId: hideCategoryFilters ? undefined : subCategoryId,
            search: trimmedQuery || undefined,
          },
        }),
      ]);

      navigate("/recherche", {
        state: {
          products: productsRes.data || [],
          promotions: promosRes.data || [],
        },
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

          {/* CATEGORY */}
          {!hideCategoryFilters && (
            <select
              className="form-select me-2"
              style={{ maxWidth: 180, height: 40, borderRadius: 9999 }}
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={isCategoryPage}
            >
              <option value="">Toutes catégories</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}

          {!hideCategoryFilters && (
            <select
              className="form-select me-2"
              style={{ maxWidth: 220, height: 40, borderRadius: 9999 }}
              value={subCategoryId}
              onChange={(e) => setSubCategoryId(e.target.value)}
              disabled={isCategoryPage || !categoryId}
            >
              <option value="">Toutes sous-catégories</option>
              {subCategories.map((sc) => (
                <option key={sc._id} value={sc._id}>
                  {sc.name}
                </option>
              ))}
            </select>
          )}

  
          <div className="search-input-wrapper flex-grow-1">
            <input
              type="search"
              className="global-search-input"
              placeholder="Rechercher un produit ou promotion..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>

          {/* SEARCH BUTTON */}
          <button
            type="button"
            className="search-button ms-2"
            onClick={handleSearch}
            aria-label="Rechercher"
          >
            <FiSearch size={20} />
          </button>

        </div>
      </div>
    </div>
  );
}
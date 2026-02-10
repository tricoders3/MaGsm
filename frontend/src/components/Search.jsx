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
    fromSidebar,
    setFromSidebar
  } = useGlobalSearch();

  const navigate = useNavigate();
  const location = useLocation();


  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [showDropdown, setShowDropdown] = useState(false);


  const HIDE_CATEGORY_FILTERS_ROUTES = [
    "/offers",
    "/top-products",
    "/products",
  ];

  const HIDE_SEARCH_ROUTES = [
    "/admin",
    "/profile",
    "/login",
    "/register",
    "/checkout",
    "/order-confirmation",
    "/reset-password",
    "/forgot-password",
    "/not-found",
  ];

  const hideSearch = HIDE_SEARCH_ROUTES.some((path) =>
    location.pathname.startsWith(path)
  );

  const hideCategoryFilters = HIDE_CATEGORY_FILTERS_ROUTES.some((path) =>
    location.pathname.startsWith(path)
  );

  const isCategoryPage = location.pathname.startsWith("/category");
  

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!query.trim() || hideSearch || location.state?.fromSidebar) {
      setSuggestions([]);
      setShowDropdown(false);
      setSelectedSuggestionIndex(-1);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        setLoadingSuggestions(true);
        const { data } = await axios.get(`${BASE_URL}/api/products`, {
          params: {
            search: query.trim().toLowerCase(),
            limit: 8,
          },
        });
        
        // Filter results to ensure they match the search query
        const filteredSuggestions = (data || []).filter(product => 
          product.name && product.name.toLowerCase().includes(query.trim().toLowerCase())
        );
        
        setSuggestions(filteredSuggestions);
        setShowDropdown(true);
        setSelectedSuggestionIndex(-1);
      } catch (e) {
        console.error('Search error:', e);
        setSuggestions([]);
        setShowDropdown(false);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 200);

    return () => clearTimeout(delay);
  }, [query, hideSearch, location.state?.fromSidebar ]);

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

  const hideFilters = hideCategoryFilters || isMobile || hideSearch;

  const handleSearch = async () => {
    setShowDropdown(false);
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

  const handleKeyDown = (e) => {
    if (!showDropdown || suggestions.length === 0) {
      if (e.key === "Enter") {
        handleSearch();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedSuggestionIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedSuggestionIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          navigate(`/product/${suggestions[selectedSuggestionIndex]._id}`);
        } else {
          handleSearch();
        }
        break;
      case "Escape":
        setShowDropdown(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  const handleSuggestionClick = (product) => {
    setShowDropdown(false);
    setSelectedSuggestionIndex(-1);
    navigate(`/product/${product._id}`);
  };

  const handleInputFocus = () => {
    if (query.trim() && suggestions.length > 0) {
      setShowDropdown(true);
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setShowDropdown(false);
      setSelectedSuggestionIndex(-1);
    }, 150);
  };

  const highlightMatchingText = (text, query) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? <strong key={index}>{part}</strong> : part
    );
  };

  if (hideSearch) return null;

  return (
    <div className="global-search-wrapper">
      <div className="container">
        <div className="global-search-box w-100 d-flex align-items-center">
          {/* CATEGORY */}
          {!hideFilters && (
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

          {/* SUBCATEGORY */}
          {!hideFilters && (
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

          <div className="search-input-wrapper flex-grow-1 position-relative">
            <input
              type="search"
              className="global-search-input"
              placeholder="Rechercher un produit ou promotion..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              autoComplete="off"
            />

            {showDropdown && (
              <div className="search-dropdown shadow">
                {loadingSuggestions ? (
                  <div className="search-loading">
                    Chargement...
                  </div>
                ) : suggestions.length > 0 ? (
                  suggestions.map((p, index) => (
                    <div
                      key={p._id}
                      className={`search-card ${index === selectedSuggestionIndex ? 'keyboard-selected' : ''}`}
                      onClick={() => {
                        navigate(`/products/${encodeURIComponent(p.name)}`);
                        setShowDropdown(false);
                      }}
                      onMouseEnter={() => setSelectedSuggestionIndex(index)}
                    >
                
                      <img
                        src={p.images?.[0]?.url || "https://via.placeholder.com/60"}
                        alt={p.name}
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/60";
                        }}
                      />
                      <div className="search-card-body">
                        <div className="search-card-title text-dark">
                          {highlightMatchingText(p.name, query)}
                        </div>
                        <div className="product-description">{p.description}</div>
                      </div>
                    </div>
                  ))
                ) : query.trim() ? (
                  <div className="search-no-results text-muted">
                    Aucun produit trouvé pour "{query.trim()}"
                  </div>
                ) : null}
              </div>
            )}
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
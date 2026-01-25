import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import BASE_URL from "../constante";

export default function ProductPromoFilters({ onFilter }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [categoryId, setCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");

  const [loading, setLoading] = useState(true);
  const [subLoading, setSubLoading] = useState(false);

  // 🔹 Load promo products
  useEffect(() => {
    const loadPromos = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/promotions/promos`);
        setProducts(res.data || []);
      } finally {
        setLoading(false);
      }
    };
    loadPromos();
  }, []);

  // 🔹 Extract unique categories
  useEffect(() => {
    const uniqueCats = [
      ...new Set(products.map((p) => (p.category?._id || p.category)))
    ];
    setCategories(uniqueCats);
  }, [products]);

  // 🔹 Sub categories based on selected category
  useEffect(() => {
    setSubCategories([]);
    setSubCategoryId("");
    if (!categoryId) return;

    setSubLoading(true);
    const subs = [
      ...new Set(
        products
          .filter((p) => (p.category?._id || p.category) === categoryId)
          .map((p) => (p.subCategory?._id || p.subCategory))
      )
    ];
    setSubCategories(subs);
    setSubLoading(false);
  }, [categoryId, products]);

  // 🔹 Filter logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (categoryId && (p.category?._id || p.category) !== categoryId) return false;
      if (subCategoryId && (p.subCategory?._id || p.subCategory) !== subCategoryId) return false;
      return true;
    });
  }, [products, categoryId, subCategoryId]);

  // 🔹 Send filtered products to parent
  useEffect(() => {
    onFilter(filteredProducts);
  }, [filteredProducts, onFilter]);

  return (
    <div className="pf-wrap">
      <div className="pf-bar">
        <div className="pf-row">

          {/* Categories */}
          <div className="pf-section">
            <div className="pf-label">Catégories</div>
            <div className="pf-chips">
              <button
                className={`pf-chip ${!categoryId ? "active" : ""}`}
                onClick={() => {
                  setCategoryId("");
                  setSubCategoryId("");
                }}
              >
                Toutes
              </button>

              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`pf-chip ${categoryId === cat ? "active" : ""}`}
                  onClick={() => setCategoryId(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Sub-categories */}
          <div className="pf-section">
            <div className="pf-label">Sous-catégories</div>
            <div className="pf-chips">
              <button
                className={`pf-chip ${!subCategoryId ? "active" : ""}`}
                onClick={() => setSubCategoryId("")}
                disabled={!categoryId || subLoading || subCategories.length === 0}
              >
                Toutes
              </button>

              {subCategories.map((sub) => (
                <button
                  key={sub}
                  className={`pf-chip ${subCategoryId === sub ? "active" : ""}`}
                  onClick={() => setSubCategoryId(sub)}
                >
                  {sub}
                </button>
              ))}
              {categoryId && subLoading && <span className="pf-hint">Chargement…</span>}
              {categoryId && !subLoading && subCategories.length === 0 && (
                <span className="pf-hint">Aucune sous-catégorie</span>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Optional: Loading */}
      {loading && <p className="text-center mt-3">Chargement des promotions...</p>}
      {!loading && filteredProducts.length === 0 && (
        <p className="text-center mt-3">Aucune promotion correspondante.</p>
      )}
    </div>
  );
}

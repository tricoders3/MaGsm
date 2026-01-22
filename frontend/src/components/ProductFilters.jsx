import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import BASE_URL from "../constante";
import { useGlobalSearch } from "../context/SearchContext";

export default function ProductFilters() {
  const {
    categoryId,
    setCategoryId,
    subCategoryId,
    setSubCategoryId,
  } = useGlobalSearch();

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subLoading, setSubLoading] = useState(false);

  useEffect(() => {
    const loadCats = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/categories`);
        setCategories(data);
      } finally {
        setLoading(false);
      }
    };
    loadCats();
  }, []);

  useEffect(() => {
    const loadSubs = async () => {
      setSubCategories([]);
      setSubCategoryId("");
      if (!categoryId) return;
      try {
        setSubLoading(true);
        const { data } = await axios.get(
          `${BASE_URL}/api/categories/${categoryId}/subcategories`
        );
        setSubCategories(data);
      } finally {
        setSubLoading(false);
      }
    };
    loadSubs();
  }, [categoryId, setSubCategoryId]);

  const activeCat = useMemo(
    () => categories.find((c) => c._id === categoryId) || null,
    [categories, categoryId]
  );

  return (
    <div className="pf-wrap">
      <div className="pf-bar">
        <div className="pf-row">
          <div className="pf-section">
            <div className="pf-label">Catégories</div>
            <div className="pf-chips">
              <button
                type="button"
                className={`pf-chip ${!categoryId ? "active" : ""}`}
                onClick={() => {
                  setCategoryId("");
                  setSubCategoryId("");
                }}
              >
                Toutes
              </button>
              {!loading &&
                categories.map((c) => (
                  <button
                    key={c._id}
                    className={`pf-chip ${categoryId === c._id ? "active" : ""}`}
                    onClick={() => setCategoryId(c._id)}
                  >
                    {c.name}
                  </button>
                ))}
            </div>
          </div>

          <div className="pf-section">
            <div className="pf-label">Sous-catégories</div>
            <div className="pf-chips">
              <button
                type="button"
                className={`pf-chip ${!subCategoryId ? "active" : ""}`}
                onClick={() => setSubCategoryId("")}
                disabled={!categoryId || subLoading || subCategories.length === 0}
              >
                Toutes
              </button>
              {!!categoryId && !subLoading &&
                subCategories.map((sc) => (
                  <button
                    key={sc._id}
                    className={`pf-chip ${subCategoryId === sc._id ? "active" : ""}`}
                    onClick={() => setSubCategoryId(sc._id)}
                  >
                    {sc.name}
                  </button>
                ))}
              {categoryId && subLoading && (
                <span className="pf-hint">Chargement…</span>
              )}
              {categoryId && !subLoading && subCategories.length === 0 && (
                <span className="pf-hint">Aucune sous-catégorie</span>
              )}
            </div>
          </div>
        </div>

        <div className="pf-actions">
          {(categoryId || subCategoryId) && (
            <button
              type="button"
              className="pf-clear"
              onClick={() => {
                setCategoryId("");
                setSubCategoryId("");
              }}
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      </div>

    </div>
  );
}

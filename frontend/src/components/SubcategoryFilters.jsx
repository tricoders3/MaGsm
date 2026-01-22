import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../constante";
import { useGlobalSearch } from "../context/SearchContext";

export default function SubcategoryFilters({ categoryId: forcedCategoryId }) {
  const { subCategoryId, setSubCategoryId } = useGlobalSearch();
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const categoryId = forcedCategoryId;

  useEffect(() => {
    const loadSubs = async () => {
      setSubCategories([]);
      if (!categoryId) return;
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${BASE_URL}/api/categories/${categoryId}/subcategories`
        );
        setSubCategories(data || []);
      } finally {
        setLoading(false);
      }
    };
    loadSubs();
  }, [categoryId]);

  return (
    <div className="pf-wrap">
      <div className="pf-bar">
        <div className="pf-row">
          <div className="pf-section">
            <div className="pf-label">Sous-catégories</div>
            <div className="pf-chips">
              <button
                type="button"
                className={`pf-chip ${!subCategoryId ? "active" : ""}`}
                onClick={() => setSubCategoryId("")}
                disabled={!categoryId || loading || subCategories.length === 0}
              >
                Toutes
              </button>
              {!!categoryId && !loading &&
                subCategories.map((sc) => (
                  <button
                    key={sc._id}
                    className={`pf-chip ${subCategoryId === sc._id ? "active" : ""}`}
                    onClick={() => setSubCategoryId(sc._id)}
                  >
                    {sc.name}
                  </button>
                ))}
              {categoryId && loading && (
                <span className="pf-hint">Chargement…</span>
              )}
              {categoryId && !loading && subCategories.length === 0 && (
                <span className="pf-hint">Aucune sous-catégorie</span>
              )}
            </div>
          </div>
        </div>
        {/* Actions */}
        <div className="pf-actions">
          {subCategoryId && (
            <button
              type="button"
              className="pf-clear"
              onClick={() => setSubCategoryId("")}
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

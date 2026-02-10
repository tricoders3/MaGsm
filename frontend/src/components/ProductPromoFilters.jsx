import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import BASE_URL from "../constante";

export default function ProductPromoFilters({ onFilter, products }) {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [categoryId, setCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");

  const [loading, setLoading] = useState(true);
  const [subLoading, setSubLoading] = useState(false);

  // 🔹 Set loading state based on products prop
  useEffect(() => {
    setLoading(!products || products.length === 0);
  }, [products]);

  // 🔹 Extract unique categories with names
  useEffect(() => {
    const uniqueCats = products.reduce((acc, p) => {
      const catName = p.category; // category is already a string name
      if (catName && !acc.find(c => c.name === catName)) {
        acc.push({ id: catName, name: catName }); // use name as both id and name
      }
      return acc;
    }, []);
    setCategories(uniqueCats);
  }, [products]);

  // 🔹 Sub categories based on selected category
  useEffect(() => {
    setSubCategories([]);
    setSubCategoryId("");
    if (!categoryId) return;

    setSubLoading(true);
    const subs = products
      .filter((p) => p.category === categoryId) // compare with string category name
      .reduce((acc, p) => {
        const subName = p.subCategory; // subCategory is already a string name
        if (subName && !acc.find(s => s.name === subName)) {
          acc.push({ id: subName, name: subName }); // use name as both id and name
        }
        return acc;
      }, []);
    setSubCategories(subs);
    setSubLoading(false);
  }, [categoryId, products]);

  // 🔹 Filter logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (categoryId && p.category !== categoryId) return false; // compare with string
      if (subCategoryId && p.subCategory !== subCategoryId) return false; // compare with string
      return true;
    });
  }, [products, categoryId, subCategoryId]);

  // 🔹 Send filtered products to parent
  useEffect(() => {
    onFilter(filteredProducts);
  }, [filteredProducts, onFilter]);

  if (loading) return null;


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
                  key={cat.id}
                  className={`pf-chip ${categoryId === cat.id ? "active" : ""}`}
                  onClick={() => setCategoryId(cat.id)}
                >
                  {cat.name}
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
                  key={sub.id}
                  className={`pf-chip ${subCategoryId === sub.id ? "active" : ""}`}
                  onClick={() => setSubCategoryId(sub.id)}
                >
                  {sub.name}
                </button>
              ))}

              {categoryId && !subLoading && subCategories.length === 0 && (
                <span className="pf-hint">Aucune sous-catégorie</span>
              )}
            </div>
          </div>

        </div>
      </div>

 
    </div>
  );
}

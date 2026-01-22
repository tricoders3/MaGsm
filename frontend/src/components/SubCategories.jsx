import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import BASE_URL from "../constante";
import ProductCard from "../components/ProductCard";
import { useGlobalSearch } from "../context/SearchContext";

const PRODUCTS_PER_PAGE = 8;

const CategoryView = () => {
  const { categoryId } = useParams();

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [activeSubcategory, setActiveSubcategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { query, setCategoryId, setSubCategoryId } = useGlobalSearch();

 
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${BASE_URL}/api/products/category/${categoryId}`
        );

        setProducts(res.data || []);
        setCategory(res.data[0]?.category || null);
        setActiveSubcategory("all");
        setCurrentPage(1);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  // Sync global search selected category to the clicked category page
  useEffect(() => {
    setCategoryId(categoryId);
    setSubCategoryId("");
  }, [categoryId, setCategoryId, setSubCategoryId]);

 
  const filteredProducts = useMemo(() => {
    const q = (query || "").toLowerCase();
    const bySub = activeSubcategory === "all"
      ? products
      : products.filter((p) => p.subCategory === activeSubcategory);
    if (!q) return bySub;
    return bySub.filter((p) => p.name?.toLowerCase().includes(q));
  }, [products, activeSubcategory, query]);


  const totalPages = Math.ceil(
    filteredProducts.length / PRODUCTS_PER_PAGE
  );

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const end = start + PRODUCTS_PER_PAGE;
    return filteredProducts.slice(start, end);
  }, [filteredProducts, currentPage]);

  
  useEffect(() => {
    setCurrentPage(1);
  }, [activeSubcategory, query]);

  
  if (loading) return <p className="text-center py-5">Loading...</p>;
  if (!category) return <p className="text-center py-5">No category found</p>;

  return (
    <section className="py-5">
      <div className="container">
        <h2 className="section-title mb-4">{category.name}</h2>

        {/* FILTER */}
        <div className="d-flex gap-2 flex-wrap mb-4">
          <button
            className={`filter-btn ${activeSubcategory === "all" ? "active" : ""}`}
            onClick={() => setActiveSubcategory("all")}
          >
            Tous
          </button>

          {category.subCategories?.map((sub) => (
            <button
              key={sub._id}
              className={`filter-btn ${activeSubcategory === sub._id ? "active" : ""}`}
              onClick={() => setActiveSubcategory(sub._id)}
            >
              {sub.name}
            </button>
          ))}
        </div>

        {/* PRODUCTS */}
        <div className="row g-4">
          {paginatedProducts.map((product) => (
            <div key={product._id} className="col-12 col-sm-6 col-md-3">
              <ProductCard
                product={{
                  id: product._id,
                  name: product.name,
                  price: product.price,
                  image: product.images?.[0]?.url || "/assets/images/default.png",
                  countInStock: product.countInStock,
                  description: product.description,
                  promotion: product.promotion || null,
                }}
                badgeType={product.promotion ? "promo" : "stock"}
                isFavorite={favorites.includes(product._id)}
                onFavoriteSuccess={(id) =>
                  setFavorites((prev) => [...new Set([...prev, id])])
                }
              />
            </div>
          ))}
        </div>

        {/* EMPTY */}
        {filteredProducts.length === 0 && (
          <p className="text-center mt-4">Aucun produit trouvé.</p>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
  <div className="d-flex justify-content-center align-items-center gap-2 mt-4 flex-wrap">
    <button
      className={`pagination-btn ${currentPage === 1 ? "disabled" : ""}`}
      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
      disabled={currentPage === 1}
    >
      Préc
    </button>

    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
      <button
        key={p}
        className={`pagination-btn ${currentPage === p ? "active" : ""}`}
        onClick={() => setCurrentPage(p)}
        disabled={currentPage === p}
      >
        {p}
      </button>
    ))}

    <button
      className={`pagination-btn ${currentPage === totalPages ? "disabled" : ""}`}
      onClick={() => setCurrentPage((p) =>
        Math.min(p + 1, totalPages)
      )}
      disabled={currentPage === totalPages}
    >
      Suiv
    </button>
  </div>
)}

      </div>
    </section>
  );
};

export default CategoryView;

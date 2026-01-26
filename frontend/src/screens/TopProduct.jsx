
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Spinner, Button } from "react-bootstrap";
import BASE_URL from "../constante";
import ProductCard from "../components/ProductCard";
import ProductFilters from "../components/ProductFilters";
import { useGlobalSearch } from "../context/SearchContext";

function Products() {
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { query, categoryId, subCategoryId } = useGlobalSearch();
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8; // nombre de produits par page

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/products/most-purchased`);

        const productsData = response.data.map((product) => {
            let originalPrice = product.price;
            let discountedPrice = null;
          
            if (product.promotion?.isActive) {
              if (product.promotion.discountType === "percentage") {
                discountedPrice = product.price - (product.price * product.promotion.discountValue) / 100;
              } else if (product.promotion.discountType === "fixed") {
                discountedPrice = product.price - product.promotion.discountValue;
              }
            }
          
            return {
              id: product._id,
              name: product.name,
              description: product.description,
              price: discountedPrice ? null : product.price, // keep null if promotion exists
              originalPrice: discountedPrice ? originalPrice : null,
              discountedPrice: discountedPrice ? discountedPrice : null,
              images: product.images || [],
              countInStock: product.countInStock,
              category: product.category?.name || "Uncategorized",
              promotion: product.promotion || null,
            };
          });
        setProducts(productsData);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load products");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  
  // Filtering then pagination
  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return products.filter((p) => {
      const matchesName = p.name?.toLowerCase().includes(q);
      const matchesCat = !categoryId || p.categoryId === categoryId;
      const matchesSub = !subCategoryId || p.subCategoryId === subCategoryId;
      return matchesName && matchesCat && matchesSub;
    });
  }, [products, query, categoryId, subCategoryId]);

  const totalPages = Math.ceil(filtered.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const paginated = filtered.slice(indexOfFirstProduct, indexOfLastProduct);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [query, categoryId, subCategoryId]);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  if (loading) return null;
  if (error) return null;
  return (
<div className="container my-5">
    <h2 className="mb-4">Nos Produits</h2>

    <div className="row">
      {/* LEFT SIDEBAR FILTERS */}
      <div className="col-12 col-md-3 mb-4">
        <ProductFilters />
      </div>
      <div className="col-12 col-md-9">
      <div className="row g-4">
        {paginated.map((product) => (
          <div key={product.id} className="col-12 col-sm-6 col-md-4 col-lg-4">
            <ProductCard
              product={product}
              badgeType="stock"
              promoPrice={product.promoPrice}
              stockCount={product.countInStock}
              isFavorite={favorites.includes(product.id)}
              onFavoriteSuccess={(id) =>
                setFavorites((prev) => [...new Set([...prev, id])])
              }
            />
          </div>
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="text-center text-muted mt-3">Aucun produit correspondant.</p>
      )}

      {/* Pagination Controls */}
     {/* Modern Pagination */}
{totalPages > 1 && (
  <div className="d-flex justify-content-center align-items-center gap-2 mt-4 flex-wrap">
    {/* Previous */}
    <button
      className={`pagination-btn ${currentPage === 1 ? "disabled" : ""}`}
      onClick={handlePrev}
    >
      Préc
    </button>

    {/* Page Numbers */}
    {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
      <button
        key={page}
        className={`pagination-btn ${currentPage === page ? "active" : ""}`}
        onClick={() => setCurrentPage(page)}
      >
        {page}
      </button>
    ))}

    {/* Next */}
    <button
      className={`pagination-btn ${currentPage === totalPages ? "disabled" : ""}`}
      onClick={handleNext}
    >
      Suiv
    </button>
    </div>
        )}
      </div>
    </div>
  </div>
  );
}

export default Products;

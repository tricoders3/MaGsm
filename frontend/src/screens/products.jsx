
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Spinner, Button } from "react-bootstrap";
import BASE_URL from "../constante";
import ProductCard from "../components/ProductCard";
import { useGlobalSearch } from "../context/SearchContext";

function Products() {
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { query } = useGlobalSearch();
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8; // nombre de produits par page

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/products`);

        const mappedProducts = res.data.map((product) => ({
          id: product._id,
          name: product.name,
          description: product.description,
          category: product.category?.name || "N/A",
          image: product.images?.[0]?.url || "/assets/images/default.png",
          price: product.price,
          originalPrice: product.promotion ? product.price : null,
          discountedPrice: product.promotion
            ? product.promotion.discountType === "percentage"
              ? Math.round(product.price * (1 - product.promotion.discountValue / 100))
              : product.price - product.promotion.discountValue
            : null,
          promotion: product.promotion,
          countInStock: product.countInStock || 1,
        }));

        setProducts(mappedProducts);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement des produits");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const filteredCurrent = currentProducts.filter((p) =>
    p.name?.toLowerCase().includes(query.toLowerCase())
  );
  const totalPages = Math.ceil(products.length / productsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-5 text-danger">
        <h3>{error}</h3>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2 className="mb-4">Nos Produits</h2>

      <div className="row g-4">
        {filteredCurrent.map((product) => (
          <div key={product.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
            <ProductCard
              product={product}
              badgeType={product.promotion ? "promo" : "stock"}
              stockCount={product.countInStock}
              isFavorite={favorites.includes(product.id)}
              onFavoriteSuccess={(id) =>
                setFavorites((prev) => [...new Set([...prev, id])])
              }
            />
          </div>
        ))}
      </div>
      {filteredCurrent.length === 0 && (
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
  );
}

export default Products;

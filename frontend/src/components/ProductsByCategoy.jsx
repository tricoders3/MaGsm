import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from "../constante";
import ProductCard from "./ProductCard";

const ITEMS_PER_PAGE = 8;

const SubcategoryProducts = () => {
  const { subcategoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/products/subcategory/${subcategoryId}`
        );
        setProducts(response.data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [subcategoryId]);

  if (error) return null;

  if (!products.length)
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-lg rounded-4 border-0 p-4">
              <h5 className="card-title mb-2">Aucun produit trouvé</h5>
              <p className="text-muted">
                Aucun produit n’est disponible dans cette sous-catégorie pour le moment.
              </p>
            </div>
          </div>
        </div>
      </div>
    );

  /* Pagination logic */
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = products.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };
  
  return (
    <section className="products-section py-5">
      <div className="container">
        <h2 className="section-title mb-3">Produits</h2>

        <div className="row g-3">
          {paginatedProducts.map((p) => (
            <div key={p._id} className="col-6 col-sm-6 col-md-4 col-lg-3">
              <ProductCard
                product={{
                  id: p._id,
                  name: p.name,
                  images: p.images?.length
                    ? p.images
                    : [{ url: "/assets/images/default.png" }],
                  description: p.description,
                  price: p.price,
                  discountedPrice: p.discountedPrice,
                  hasPromotion: p.hasPromotion,
                  promotion: p.promotion,
                  countInStock: p.countInStock,
                }}
                badgeType={p.hasPromotion ? "promo" : "stock"}
                stockCount={p.countInStock}
              />
            </div>
          ))}
        </div>

        {/* Pagination */}
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
      className={`pagination-btn ${
        currentPage === totalPages ? "disabled" : ""
      }`}
      onClick={handleNext}
    >
      Suiv
    </button>
  </div>
)}

      </div>
    </section>
  );
};

export default SubcategoryProducts;

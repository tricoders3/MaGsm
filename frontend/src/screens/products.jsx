import React, { useEffect, useState } from "react";
import axios from "axios";
import { Spinner, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../constante"; // your backend URL

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/products`); // or /api/promotions/promos
        setProducts(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Erreur fetching products");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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

      {/* Products Grid */}
      <div className="row">
        {products.map((product) => (
          <div key={product._id} className="col-6 col-md-3 mb-4">
            <div className="product-card h-100 position-relative shadow-sm rounded-4 p-3 bg-white">
              {/* Promo Badge */}
              {product.promotion && (
                <div className="card-badges position-absolute top-0 start-0 m-2">
                  <span className="badge-offer bg-danger text-white px-2 py-1 rounded">
                    {product.promotion.discountType === "percentage"
                      ? `${product.promotion.discountValue}% `
                      : `${product.promotion.discountValue} DT `}
                  </span>
                </div>
              )}

              {/* Product Image */}
              <div className="product-image mt-4 text-center">
                <img
                  src={product.images?.[0]?.url || ""}
                  alt={product.name}
                  className="img-fluid"
                  style={{ height: 150, objectFit: "cover" }}
                  onClick={() => navigate(`/products/${product._id}`)}
                />
              </div>

              {/* Product Content */}
              <div className="product-content text-center mt-3">
                <h6 className="product-title">{product.name}</h6>
                <p className="product-category text-muted">{product.category?.name || "N/A"}</p>
                <p className="product-price mt-2">
                  {product.promotion ? (
                    <>
                      <span className="original-price text-decoration-line-through">
                        {product.price} DT
                      </span>{" "}
                      <span className="discounted-price fw-bold">
                        {product.promotion.discountType === "percentage"
                          ? Math.round(product.price * (1 - product.promotion.discountValue / 100))
                          : product.price - product.promotion.discountValue}{" "}
                        DT
                      </span>
                    </>
                  ) : (
                    <span className="fw-bold">{product.price} DT</span>
                  )}
                </p>

                {/* Voir détails button */}
                <Button
                  variant="primary"
                  size="sm"
                  className="mt-2"
                  onClick={() => navigate(`/products/${product._id}`)}
                >
                  Voir détails
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;

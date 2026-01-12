import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // for getting productId from URL
import axios from "axios";
import { Button, Spinner, Badge } from "react-bootstrap";
import { FiShoppingCart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

import BASE_URL from "../constante"; // your backend URL

function ProductDetails() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [promotion, setPromotion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductAndPromo = async () => {
      try {
        const resProduct = await axios.get(`${BASE_URL}/api/products/${productId}`);
        setProduct(resProduct.data);

        const resPromo = await axios.get(`${BASE_URL}/api/promotions/product/${productId}`);
        setPromotion(resPromo.data.promotion || null);

        setLoading(false);
      } catch (error) {
        console.error("Erreur fetching product or promotion:", error);
        setLoading(false);
      }
    };

    fetchProductAndPromo();
  }, [productId]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center mt-5">
        <h3>Produit introuvable</h3>
      </div>
    );
  }

  // calculate discounted price
  let discountedPrice = product.price;
  let promoText = "";
  if (promotion) {
    if (promotion.discountType === "percentage") {
      discountedPrice = product.price - (product.price * promotion.discountValue) / 100;
      promoText = `-${promotion.discountValue}%`;
    } else if (promotion.discountType === "fixed") {
      discountedPrice = product.price - promotion.discountValue;
      promoText = `-${promotion.discountValue} DT`;
    }
    discountedPrice = Math.max(discountedPrice, 0);
  }

  return (
    <div className="container my-5">
      <div className="row g-4">
        {/* Product Images */}
        <div className="col-md-6 text-center">
          <div className="product-card h-100">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0].url}
                alt={product.name}
                className="img-fluid rounded-3"
                style={{ maxHeight: "400px", objectFit: "contain" }}
              />
            ) : (
              <div className="bg-light p-5 rounded-3">No image available</div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="col-md-6">
          <h2 className="fw-bold">{product.name}</h2>
          <p className="text-muted mb-1">
            <strong>Marque:</strong> {product.brand}
          </p>
          <p className="text-muted mb-3">
            <strong>Catégorie:</strong> {product.category?.name || "N/A"}
          </p>

          {promotion && (
            <Badge bg="danger" className="mb-3">
              Promo! {promoText}
            </Badge>
          )}

          <div className="mb-3">
            {promotion && (
              <span className="text-decoration-line-through me-2 text-muted">
                {product.price} DT
              </span>
            )}
            <span className="h4 fw-bold text-success">
              {discountedPrice} DT
            </span>
          </div>

          <p className="mb-4">{product.description}</p>

          <div className="d-flex gap-3 mb-3">
            <Button variant="primary" className="d-flex align-items-center gap-2">
              <FiShoppingCart /> Ajouter au panier
            </Button>
            <Button variant="btn btn-primary-redesign" className="d-flex align-items-center gap-2">
            <FaHeart /> Ajouter aux favoris
            </Button>
          </div>

          <div>
            <strong className="text-muted">Disponibilité:</strong>{" "}
            {product.countInStock > 0 ? (
              <span className="text-success">En stock</span>
            ) : (
              <span className="text-danger">Rupture de stock</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;

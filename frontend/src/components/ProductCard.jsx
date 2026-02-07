import React, { useState } from "react";
import { FiShoppingCart, FiHeart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import BASE_URL from "../constante";
import AlertToast from "./AlertToast";
import { useCart } from "../context/CartContext";
import PriceModal from "./PriceModal";

const ProductCard = ({ product, badgeType, stockCount, isFavorite, onFavoriteSuccess }) => {
const { cartCount, setCartCount, favoritesCount, setFavoritesCount } = useCart();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [showPriceModal, setShowPriceModal] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

 const handleAddToFavorites = async (e) => {
    e.stopPropagation();

    try {
      await axios.post(`${BASE_URL}/api/favorites/${product.id}`, {}, { withCredentials: true });

      // **Update favorites badge instantly**
      setFavoritesCount(favoritesCount + 1);

      onFavoriteSuccess?.(product.id);

      setToast({ show: true, message: "Ajouté aux favoris", type: "favorite" });
      setTimeout(() => setToast({ ...toast, show: false }), 1500);
    } catch (error) {
      const errMsg = error.response?.data?.message || "";

      if (error.response?.status === 401) navigate("/login");
      else if (
        error.response?.status === 409 ||
        errMsg.toLowerCase().includes("already in favorites") ||
        errMsg.toLowerCase().includes("déjà dans vos favoris")
      ) {
        setToast({ show: true, message: "Produit déjà dans vos favoris", type: "favorite" });
        setTimeout(() => setToast({ ...toast, show: false }), 1500);
      } else {
        setToast({ show: true, message: "Impossible d'ajouter aux favoris", type: "favorite" });
        setTimeout(() => setToast({ ...toast, show: false }), 1500);
      }
    }
  };
const getProductPrice = (product) => {
  if (product.promotion) {
    if (product.promotion.discountType === "percentage") {
      return (
        product.price -
        (product.price * product.promotion.discountValue) / 100
      );
    }

    if (product.promotion.discountType === "fixed") {
      return product.price - product.promotion.discountValue;
    }
  }

  return product.price;
};

  // Cart
  const handleAddToCart = async (e) => {
  e.stopPropagation();

  if (stockCount === "out") {
    setToast({
      show: true,
      message: "Produit en rupture de stock",
      type: "cart",
    });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 1500);
    return;
  }

  try {
    await axios.post(
      `${BASE_URL}/api/cart`,
      { productId: product.id, quantity: 1 },
      { withCredentials: true }
    );

    setCartCount(cartCount + 1);

    setToast({ show: true, message: "Produit ajouté au panier", type: "cart" });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 1500);
  } catch (error) {
    if (error.response?.status === 401) navigate("/login");
  }
};


  // Render badge

const renderBadge = () => {
    if (badgeType === "stock") {
      return stockCount > 0 ? (
        <span className="badge-stock">EN STOCK</span>
      ) : (
        <span className="out-of-stock">
          RUPTURE
        </span>
      );
    }
    if (badgeType === "promo" && product.promotion) {
      return (
        <span className="badge-offer">
          {product.promotion.discountType === "percentage"
            ? `-${product.promotion.discountValue}%`
            : `-${product.promotion.discountValue} DT`}
        </span>
      );
    }
    return null;
  };
  
  
  return (
    <>
    <div className="product-card h-100 d-flex flex-column">
      {/* Badges & Actions */}
      <div className="card-badges">
  {renderBadge()}

 
    <div className="card-actions">
      <button
        className={`favorite-btn ${isFavorite ? "active" : ""}`}
        onClick={handleAddToFavorites}
      >
        <FiHeart />
      </button>
      {isAuthenticated && (
      <button className="cart-btn" onClick={handleAddToCart}
      disabled={stockCount === "out"}
      title={stockCount === "out" ? "Produit en rupture de stock" : "Ajouter au panier"}>
        <FiShoppingCart/>
      </button>
       )}
    </div>
 
</div>

      {/* Image */}
      <div
  className="product-image mt-3 flex-shrink-0"
  onClick={() =>
    navigate(`/products/${encodeURIComponent(product.name)}`)
  }
>

       <img
  src={product.images?.[0]?.url || "/assets/images/default.png"}
  alt={product.name}
/>

      </div>

      {/* Content */}
      <div className="product-content text-center d-flex flex-column flex-grow-1 justify-content-end mt-3">
        <h6 className="product-title">{product.name}</h6>
        <p className="product-category">{product.category}</p>
        {product.description && <p className="product-description">{product.description}</p>}
        {!isAuthenticated ? (
  <>
    {/* Voir prix */}
    <p className="product-price">
      <button
        className="btn-redesign btn-price mt-auto"
        onClick={() => setShowPriceModal(true)}
      >
        Voir prix
      </button>
    </p>
  </>
    
) : (
  <>
    {/* Price */}
    <p className="product-price">
  {product.price ? (
    `${product.price} DT`
  ) : (
    <>
      <span className="original-price">{product.originalPrice} DT</span>{" "}
      <span className="discounted-price">{product.discountedPrice} DT</span>
    </>
  )}
</p>

    {/* Details button */}
    <button
      className="btn-redesign btn-primary-redesign"
     onClick={() => navigate(`/products/${encodeURIComponent(product.name)}`)}

    >
      Découvrir les détails
    </button>
  </>
)}

      </div>

      {/* Modern AlertToast */}
      <AlertToast show={toast.show} onClose={() => setToast({ ...toast, show: false })} type={toast.type} message={toast.message} />
      
    </div>
    <PriceModal
        show={showPriceModal}
        onClose={() => setShowPriceModal(false)}
        productName={product.name}
      />
    </>
  );
};

export default ProductCard;

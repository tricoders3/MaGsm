import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import { FaHeartBroken } from "react-icons/fa";
import axios from "axios";
import BASE_URL from "../constante";
import EmptyFavorite from "../assets/images/empty_favorite.svg";
import AlertToast from "../components/AlertToast";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Favorites = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "", type: "favorite" });
const { favoritesCount, setFavoritesCount } = useCart();

useEffect(() => {
  const fetchFavorites = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/favorites`, { withCredentials: true });

      const favProducts = await Promise.all(
        res.data.map(async (fav) => {
          let promotion = null;
          try {
            const promoRes = await axios.get(`${BASE_URL}/api/promotions/product/${fav._id}`);
            promotion = promoRes.data.promotion || null;
          } catch (err) {}
          return { ...fav, promotion };
        })
      );

      setFavorites(favProducts);
      setFavoritesCount(favProducts.length); // ✅ update the badge instantly
    } catch (error) {
      console.error("Erreur favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchFavorites();
}, []);

// Remove favorite
const handleRemoveFavorite = async (productId) => {
  try {
    await axios.delete(`${BASE_URL}/api/favorites/${productId}`, { withCredentials: true });
    const updatedFavorites = favorites.filter((p) => p._id !== productId);
    setFavorites(updatedFavorites);

    // ✅ Update global badge
    setFavoritesCount(updatedFavorites.length);

    setToast({ show: true, message: "Retiré des favoris", type: "favorite" });
    setTimeout(() => setToast({ ...toast, show: false }), 1500);
  } catch (error) {
    console.error("Erreur remove favorite:", error);
  }
};



  const handleAddToCart = async (product) => {
    if (product.countInStock === 0) {
      setToast({ show: true, message: "Produit en rupture de stock", type: "cart" });
      setTimeout(() => setToast({ ...toast, show: false }), 1500);
      return;
    }

    try {
      await axios.post(
        `${BASE_URL}/api/cart`,
        { productId: product._id, quantity: 1 },
        { withCredentials: true }
      );
      setToast({ show: true, message: "Produit ajouté au panier", type: "cart" });
      setTimeout(() => setToast({ ...toast, show: false }), 1500);
    } catch (error) {
      if (error.response?.status === 401) navigate("/login");
      else {
        setToast({ show: true, message: "Impossible d'ajouter au panier", type: "cart" });
        setTimeout(() => setToast({ ...toast, show: false }), 1500);
      }
    }
  };

  const renderBadge = (product) => {
    if (product.promotion) {
      const promo = product.promotion;
      const promoText =
        promo.discountType === "percentage"
          ? `-${promo.discountValue}%`
          : `-${promo.discountValue} DT`;
      return <span className="badge-offer">{promoText}</span>;
    }
    return null;
  };

  const calculateDiscountedPrice = (product) => {
    let price = product.price;
    if (product.promotion) {
      const promo = product.promotion;
      if (promo.discountType === "percentage") {
        price = price - (price * promo.discountValue) / 100;
      } else {
        price = price - promo.discountValue;
      }
      price = Math.max(price, 0);
    }
    return price;
  };

  if (loading) return null;



  return (
    <div className="container mt-4 mb-5">
    {favorites.length > 0 && <h3 className="mb-4 text-dark">Mes Favoris</h3>}
  

    {favorites.length === 0 ? (
      <div className="text-center mt-5">
        <h2>Favoris est vide</h2>
        <img  className="mb-3" src={EmptyFavorite} alt="Empty Cart" style={{ width: 140 }}/>
        <p className="text-muted">Ajoutez des produits à vos favoris pour les retrouver ici</p>
      </div>
    ) : (
      <div className="row g-4">
        {favorites.map((product) => (
          <div className="col-12 col-sm-6 col-md-3" key={product._id}>
            <div className="product-card h-100">
              {/* Badges & Actions */}
              <div className="card-badges">
                {renderBadge(product)}
                <div className="card-actions">
                  <button
                    className="favorite-btn active"
                    onClick={() => handleRemoveFavorite(product._id)}
                  >
                    <FaHeartBroken />
                  </button>
                  {isAuthenticated && (
                  <button className="cart-btn" onClick={() => handleAddToCart(product)}>
                    <FiShoppingCart size={18} />
                  </button>
                  )}
                </div>
              </div>
  
              {/* Image */}
              <div
                className="product-image mt-4"
                onClick={() => navigate(`/products/${product._id}`)}
              >
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0].url}
                    alt={product.name}
                    style={{
                      cursor: "pointer",
                      maxHeight: "180px",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <div className="bg-light p-5 rounded-3">No image available</div>
                )}
              </div>
  
              {/* Content */}
              <div className="product-content text-center">
                <h6 className="product-title">{product.name}</h6>
                <p className="product-category">{product.brand}</p>
                {isAuthenticated && (    
                <p className="product-price">
                  {product.promotion && (
                    <span className="original-price text-decoration-line-through me-2 text-muted">
                      {product.price} DT
                    </span>
                  )}
                  <span className="discounted-price fw-bold text-success">
                    {calculateDiscountedPrice(product)} DT
                  </span>
                </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  
    <AlertToast
      show={toast.show}
      onClose={() => setToast({ ...toast, show: false })}
      type={toast.type}
      message={toast.message}
    />
  </div>
  
  );
};

export default Favorites;

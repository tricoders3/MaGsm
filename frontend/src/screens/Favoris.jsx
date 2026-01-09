import React, { useEffect, useState } from "react";
import { Button, Spinner, Badge } from "react-bootstrap";
import { FaHeartBroken } from "react-icons/fa";
import axios from "axios";
import BASE_URL from "../constante";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch favorites with promotions
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/favorites`, {
          withCredentials: true, // 🔹 cookie HttpOnly
        });

        const favProducts = await Promise.all(
          res.data.map(async (fav) => {
            // Pour chaque produit, récupérer la promotion si elle existe
            let promotion = null;
            try {
              const promoRes = await axios.get(
                `${BASE_URL}/api/promotions/product/${fav._id}`
              );
              promotion = promoRes.data.promotion || null;
            } catch (err) {
              console.log("No promotion for product:", fav._id);
            }
            return { ...fav, promotion };
          })
        );

        setFavorites(favProducts);
        setLoading(false);
      } catch (error) {
        console.error("Erreur favorites:", error);
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (productId) => {
    try {
      await axios.delete(`${BASE_URL}/api/favorites/${productId}`, {
        withCredentials: true,
      });
      setFavorites((prev) => prev.filter((p) => p._id !== productId));
    } catch (error) {
      console.error("Erreur remove favorite:", error);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center mt-5">
        <h3>Vous n'avez aucun favori pour le moment </h3>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-dark">❤️ Mes Favoris</h3>
      <div className="row g-4">
        {favorites.map((product) => {
          // Calcul du prix avec promotion
          let discountedPrice = product.price;
          let promoText = "";
          if (product.promotion) {
            const promo = product.promotion;
            if (promo.discountType === "percentage") {
              discountedPrice =
                product.price - (product.price * promo.discountValue) / 100;
              promoText = `-${promo.discountValue}%`;
            } else if (promo.discountType === "fixed") {
              discountedPrice = product.price - promo.discountValue;
              promoText = `-${promo.discountValue} DT`;
            }
            discountedPrice = Math.max(discountedPrice, 0);
          }

          return (
            <div className="col-md-4" key={product._id}>
              <div className="border rounded-4 p-3 shadow-sm bg-white text-center h-100 d-flex flex-column">
                {/* Image */}
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0].url}
                    alt={product.name}
                    className="img-fluid rounded-3 mb-3"
                    style={{ maxHeight: "300px", objectFit: "contain" }}
                  />
                ) : (
                  <div className="bg-light p-5 rounded-3 mb-3">
                    No image available
                  </div>
                )}

                {/* Infos produit */}
                <h5 className="text-dark">{product.name}</h5>
                <p className="text-secondary">{product.brand}</p>

                {product.promotion && (
                  <Badge bg="danger" className="mb-2">
                    Promo! {promoText}
                  </Badge>
                )}

                <div className="mb-3">
                  {product.promotion && (
                    <span className="text-decoration-line-through me-2 text-muted">
                      {product.price} DT
                    </span>
                  )}
                  <span className="fw-bold text-success">{discountedPrice} DT</span>
                </div>

                <div className="mt-auto d-flex justify-content-between align-items-center">
                  <span className="fw-bold text-dark">
                    {product.countInStock > 0 ? "En stock" : "Rupture"}
                  </span>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleRemoveFavorite(product._id)}
                  >
                    <FaHeartBroken /> Retirer
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Favorites;

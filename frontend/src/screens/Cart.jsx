import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { FaTrash, FaMinus, FaPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../constante";
import EmptyCart from "../assets/images/empty_cart.svg";
import { useCart } from "../context/CartContext";
import AlertToast from "../components/AlertToast";

export default function Cart() {
  const navigate = useNavigate();
  const { cart, setCart, cartCount, setCartCount } = useCart();

  const [loading, setLoading] = useState(true);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const getDiscountedPrice = (product, promotion) => {
    if (!promotion) return product.price;

    let discounted = product.price;

    if (promotion.discountType === "percentage") {
      discounted =
        product.price - (product.price * promotion.discountValue) / 100;
    } else {
      discounted = product.price - promotion.discountValue;
    }

    return Math.max(discounted, 0);
  };

  /* ================================
     FETCH CART + PROMOTIONS
  ================================== */
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);

        const res = await axios.get(`${BASE_URL}/api/cart`, {
          withCredentials: true,
        });

        const rawItems = res.data.cart?.items || [];

        // 🔥 Fetch promotion per product (same as ProductDetails)
        const itemsWithPromos = await Promise.all(
          rawItems.map(async (item) => {
            try {
              const promoRes = await axios.get(
                `${BASE_URL}/api/promotions/product/${item.product._id}`
              );
              return {
                ...item,
                promotion: promoRes.data.promotion || null,
              };
            } catch {
              return { ...item, promotion: null };
            }
          })
        );

        setCart(itemsWithPromos);
        setCartCount(
          itemsWithPromos.reduce((sum, i) => sum + i.quantity, 0)
        );
      } catch (error) {
        console.error("Erreur en récupérant le panier :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [setCart, setCartCount]);


  // Increase quantity
  const increaseQuantity = async (productId) => {
    const item = cart.find((i) => i.product._id === productId);
    if (!item) return;
    const newQty = item.quantity + 1;
    try {
      await axios.put(`${BASE_URL}/api/cart/${productId}`, { quantity: newQty }, { withCredentials: true });
      const newCart = cart.map((i) =>
        i.product._id === productId ? { ...i, quantity: newQty } : i
      );
      setCart(newCart);
      setCartCount(newCart.reduce((sum, i) => sum + i.quantity, 0));
    } catch (error) {
      console.error("Erreur en augmentant la quantité :", error);
    }
  };

  // Decrease quantity
  const decreaseQuantity = async (productId) => {
    const item = cart.find((i) => i.product._id === productId);
    if (!item || item.quantity <= 1) return;
    const newQty = item.quantity - 1;
    try {
      await axios.put(`${BASE_URL}/api/cart/${productId}`, { quantity: newQty }, { withCredentials: true });
      const newCart = cart.map((i) =>
        i.product._id === productId ? { ...i, quantity: newQty } : i
      );
      setCart(newCart);
      setCartCount(newCart.reduce((sum, i) => sum + i.quantity, 0));
    } catch (error) {
      console.error("Erreur en diminuant la quantité :", error);
    }
  };

  // Remove item
  const removeItem = async (productId) => {
    try {
      await axios.delete(`${BASE_URL}/api/cart/${productId}`, { withCredentials: true });
      const newCart = cart.filter((i) => i.product._id !== productId);
      setCart(newCart);
      setCartCount(newCart.reduce((sum, i) => sum + i.quantity, 0));
    } catch (error) {
      console.error("Erreur en supprimant le produit :", error);
    }
  };

  // Total price
  const totalPrice = cart.reduce(
    (sum, item) =>
      sum +
      getDiscountedPrice(item.product, item.promotion) * item.quantity,
    0
  );


  // Navigate to checkout
  const handleCreateOrder = () => {
    if (!cart || cart.length === 0) return;
    navigate("/checkout");
  };

  if (loading) return null;

  if (!cart || cart.length === 0) {
    return (
      <div className="text-center mt-5">
        <h2>Votre panier est vide</h2>
        <img className="mb-3" src={EmptyCart} alt="Empty Cart" style={{ width: 200 }} />
        <div className="mt-3">
          <Link to="/" className="btn btn-dark">
            Continuer vos achats
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5">
       <div className="mt-5">
    <h2>Votre panier</h2>
    </div>
    <div className="row">
      {/* Cart Items */}
      <div className="col-12 col-md-8">
          {cart.map((item) => (
            <div
              key={item.product._id}
              className="mb-3 p-3 bg-white rounded shadow-sm"
            >
              {/* Desktop Layout */}
              <div className="d-none d-md-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <img
                    src={item.product.images?.[0]?.url || "https://via.placeholder.com/100"}
                    alt={item.product.name}
                    className="img-fluid"
                    style={{ width: 100, height: 100, objectFit: "contain" }}
                  />
                  <div className="ms-3">
                    <h5 className="text-dark">{item.product.name}</h5>
                    <div className="mb-1">
  {item.promotion ? (
    <>
      <span className="text-decoration-line-through text-muted me-2">
        {item.product.price} TND
      </span>
      <span className="fw-bold text-danger">
        {getDiscountedPrice(item.product, item.promotion)} TND
      </span>
    </>
  ) : (
    <span className="text-secondary">
      Prix: {item.product.price} TND
    </span>
  )}
</div>

                    <div className="d-flex align-items-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => decreaseQuantity(item.product._id)}
                      >
                        <FaMinus />
                      </Button>
                      <span className="text-dark">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => increaseQuantity(item.product._id)}
                      >
                        <FaPlus />
                      </Button>
                    </div>
                  </div>
                </div>
  
                <div className="text-end">
                <h5 className="text-dark">
  {getDiscountedPrice(item.product, item.promotion) * item.quantity} TND
</h5>

                  <Button
                    variant="danger"
                    size="sm"
                    className="mt-2"
                    onClick={() => removeItem(item.product._id)}
                  >
                    <FaTrash />
                  </Button>
                </div>
              </div>
  
              {/* Mobile Layout */}
              <div className="d-md-none">
                {/* Image */}
                <img
                  src={item.product.images?.[0]?.url || "https://via.placeholder.com/100"}
                  alt={item.product.name}
                  className="img-fluid mb-2"
                  style={{ width: "100%", height: 200, objectFit: "contain" }}
                />
  
                {/* Product Name */}
                <h5 className="text-dark">{item.product.name}</h5>
  
                {/* Price */}
                <div className="mb-2">
  {item.promotion ? (
    <>
      <span className="text-decoration-line-through text-muted me-2">
        {item.product.price} TND
      </span>
      <span className="fw-bold text-danger">
        {getDiscountedPrice(item.product, item.promotion)} TND
      </span>
    </>
  ) : (
    <span className="text-secondary">
      Prix: {item.product.price} TND
    </span>
  )}
</div>

  
           {/* Quantity + Delete inline row */}
           <div className="d-flex flex-column gap-2">
  {/* Quantity Controls */}
  <div className="justify-content-center align-items-center gap-2 mb-4">
  <Button
    size="sm"
    variant="secondary"
    onClick={() => decreaseQuantity(item.product._id)}
  >
    <FaMinus />
  </Button>

  <span className="text-dark mx-2">{item.quantity}</span>

  <Button
    size="sm"
    variant="secondary"
    onClick={() => increaseQuantity(item.product._id)}
  >
    <FaPlus />
  </Button>
</div>

 
</div>


  
                {/* Total Price */}
                <div className="d-flex align-items-center">
                <h5 className="text-dark">
  {getDiscountedPrice(item.product, item.promotion) * item.quantity} TND
</h5>

                <Button
    variant="danger"
    size="sm"
    className="ms-auto flex-shrink-0"
    onClick={() => removeItem(item.product._id)}
  >
    <FaTrash />
  </Button>
  </div>             
              </div>
              
            </div>
          ))
        }
      </div>
  
      {/* Order Summary */}
      <div className="col-12 col-md-4 mt-4 mt-md-0">
      <div className="mb-2 p-3">
  <span className="fw-semibold text-dark d-block">Total</span>
  <span className="fw-bold fs-5 text-dark d-block">
    {totalPrice.toFixed(2)} TND
  </span>
</div>

        <div className="p-3 bg-white rounded shadow-sm d-flex flex-column gap-2">
          <Button
            variant="dark"
            className="w-100 mb-2"
            onClick={handleCreateOrder}
            disabled={creatingOrder || loading || cart.length === 0}
          >
            {creatingOrder ? "Création de la commande..." : "Acheter maintenant"}
          </Button>
  
          <Link to="/" className="btn btn-outline-secondary w-100">
            Continuer vos achats
          </Link>
        </div>
      </div>
    </div>
  
    {/* Toast */}
    <AlertToast
      show={showToast}
      onClose={() => setShowToast(false)}
      type="success"
      message="Commande créée avec succès ! Paiement à la livraison."
    />
  </div>
  
  
  );
}
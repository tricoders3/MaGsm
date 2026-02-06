import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../constante";
import { useCart } from "../context/CartContext";
import AlertToast from "../components/AlertToast";

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, setCart, setCartCount } = useCart();

  const [usePoints, setUsePoints] = useState(false);
  const [userLoyaltyPoints, setUserLoyaltyPoints] = useState(0);
  const canUsePoints = userLoyaltyPoints >= 1000;

 const [billing, setBilling] = useState({
  name: "",
  email: "",
  phone: "",
});

const [form, setForm] = useState({
  street: "",
  postalCode: "",
  city: "",
  country: "Tunisie",
});

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
const isValid =
  billing.name &&
  billing.email &&
  billing.phone &&
  form.street &&
  form.postalCode &&
  form.city &&
  form.country;

  // 🔹 Fetch cart if empty
   useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // ✅ USER
        const userRes = await axios.get(`${BASE_URL}/api/user/me`, {
          withCredentials: true,
        });

        const user = userRes.data;

        setBilling({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
        });

        if (user.address) {
          setForm({
            street: user.address.street || "",
            postalCode: user.address.postalCode || "",
            city: user.address.city || "",
            region: user.address.region || "",
            country: user.address.country || "Tunisie",
          });
        }
        setUserLoyaltyPoints(user.loyaltyPoints || 0);

        // ✅ CART
        if (!cart || cart.length === 0) {
          const cartRes = await axios.get(`${BASE_URL}/api/cart`, {
            withCredentials: true,
          });
          const items = cartRes.data.cart?.items || [];
          setCart(items);
          setCartCount(items.reduce((s, i) => s + i.quantity, 0));
        }
      } catch (err) {
        console.error("Erreur chargement checkout :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


 const handleConfirm = async () => {
  if (!isValid || !cart || cart.length === 0) return;
  setSubmitting(true);

  try {
    // Construire le payload avec shippingAddress et billingDetails
 const payload = {
  shippingAddress: {
    street: form.street,
    postalCode: form.postalCode,
    city: form.city,
    region: form.region,
    country: form.country,
  },
  billingDetails: {
    name: billing.name,
    email: billing.email,
    phone: billing.phone,
  },
  useLoyaltyPoints: usePoints, // 🔹 nouveau
};


    const { data } = await axios.post(`${BASE_URL}/api/orders`, payload, {
      withCredentials: true,
    });

    const newOrderId = data?.order?._id;
    setShowToast(true);

    setTimeout(() => {
    setShowToast(false);
    
    

    setCart([]);
    setCartCount(0);
    
    
    if (newOrderId) navigate(`/order-confirmation/${newOrderId}`);
    else navigate("/orders");
    });
  } catch (error) {
    console.error("Erreur lors de la création de la commande :", error);
    alert("Impossible de créer la commande, réessayez !");
  } finally {
    setSubmitting(false);
  }
};

// Calculs sous-total et total avec livraison
const DELIVERY_FEE = 7; // Livraison à domicile
const subTotal = cart?.reduce(
  (sum, item) => sum + (item.product.price || 0) * item.quantity,
  0
) || 0;

const totalWithDelivery = subTotal + DELIVERY_FEE;

// Points fidélité
const pointsPer100DT = 10;
const earnedPoints = Math.floor((totalWithDelivery / 100) * pointsPer100DT);
// 🔹 Remise si utilisation des points fidélité
const discount = usePoints && userLoyaltyPoints >= 1000
  ? Math.floor(userLoyaltyPoints / 1000) * 10
  : 0;

// 🔹 Total final après remise
const totalAfterDiscount = totalWithDelivery - discount;


 
if (loading) return null;

  if (!cart || cart.length === 0) {
    return (
      <div className="text-center mt-5">
        <h2>Votre panier est vide</h2>
        <p>Ajoutez des produits avant de passer à la livraison.</p>
        <button className="btn btn-dark" onClick={() => navigate("/")}>
          Continuer vos achats
        </button>
      </div>
    );
  }

  return (
<div className="container mt-5 mb-5">
  <div className="row g-4">


    <div className="col-lg-7">
      <div className="card p-4 shadow-sm rounded-4">
        <h4 className="fw-bold mb-4 text-dark border-bottom pb-2">
          Détails de facturation
        </h4>

        <input
  type="text"
  name="name"
  value={billing.name}
  onChange={(e) =>
    setBilling({ ...billing, name: e.target.value })
  }
  className="form-control mb-3"
  placeholder="Nom complet"
/>

<input
  type="email"
  name="email"
  value={billing.email}
  onChange={(e) =>
    setBilling({ ...billing, email: e.target.value })
  }
  className="form-control mb-3"
  placeholder="Adresse email"
/>

<input
  type="tel"
  name="phone"
  value={billing.phone}
  onChange={(e) =>
    setBilling({ ...billing, phone: e.target.value })
  }
  className="form-control mb-4"
  placeholder="Téléphone"
/>

        <h5 className="fw-bold text-dark mb-3">Adresse de livraison</h5>

        <input
          type="text"
          name="street"
          value={form.street}
          onChange={(e) =>
             setForm({ ...form, street: e.target.value })
                 } 
          className="form-control mb-3"
          placeholder="Rue"
          required
        />

        <input
          type="text"
          name="postalCode"
          value={form.postalCode}
          onChange={(e) =>
             setForm({ ...form, postalCode: e.target.value })
                 } 
          className="form-control mb-3"
          placeholder="Code postal"
          required
        />

        <input
          type="text"
          name="city"
          value={form.city}
          onChange={(e) =>
             setForm({ ...form, city: e.target.value })
                 } 
          className="form-control mb-3"
          placeholder="Ville"
          required
        />


        <input
          type="text"
          name="country"
          value={form.country}
          onChange={(e) =>
             setForm({ ...form, country: e.target.value })
                 } 
          className="form-control"
          placeholder="Pays"
        />
      </div>
    </div>

    {/* ===================== */}
    {/* 🛒 VOTRE COMMANDE */}
    {/* ===================== */}
    <div className="col-lg-5">
      <div className="card p-4 shadow-sm rounded-4">
        <h4 className="fw-bold mb-4 text-dark border-bottom pb-2">
          Votre commande
        </h4>

        {cart.map((item) => (
          <div
            key={item.product._id}
            className="d-flex justify-content-between mb-2"
          >
            <span>
              {item.product.name} × {item.quantity}
            </span>
            <span>
              {(item.product.price || 0) * item.quantity} DT
            </span>
          </div>
        ))}

        <hr />

        <div className="d-flex justify-content-between">
  <span>Sous-total</span>
  <span>{subTotal} DT</span>
</div>

<div className="d-flex justify-content-between">
  <span>Livraison à domicile</span>
  <span>{DELIVERY_FEE} DT</span>
</div>


{/* 🎁 Remise fidélité */}
{usePoints && discount > 0 && (
  <div className="d-flex justify-content-between text-success fw-bold">
    <span>Remise fidélité</span>
    <span>-{discount} DT</span>
  </div>
)}
<div className="mt-2 text-muted" style={{ fontSize: "13px" }}>
  🚚 Livraison estimée entre <strong style={{ color: "#000" }}>24 et 72 heures</strong>
</div>

<hr />

<div className="d-flex justify-content-between fw-bold fs-5 mt-2">
  <span>Total à payer</span>
  <span>{totalAfterDiscount} DT</span>
</div>
{/* 🚚 Délai de livraison */}

{/* 🎁 POINTS FIDÉLITÉ */} {earnedPoints > 0 && ( <div className="mt-3 p-3 bg-light border rounded-3 text-center"> <small> 🎁 Terminez votre commande et gagnez{" "} <strong>{earnedPoints} points</strong> pour une remise sur un prochain achat </small> </div> )}
       
{canUsePoints && (
  <div className="mt-3 form-check">
    <input
      type="checkbox"
      className="form-check-input"
      id="useLoyaltyPoints"
      checked={usePoints}
      onChange={() => setUsePoints(!usePoints)}
    />

    <label className="form-check-label" htmlFor="useLoyaltyPoints">
      Utiliser vos points fidélité pour une remise
      {` (${userLoyaltyPoints} pts disponibles)`}
    </label>
  </div>
)}


<button
  className="btn btn-dark w-100 mt-4 d-flex justify-content-center align-items-center"
  disabled={submitting || !isValid}
  onClick={handleConfirm}
>
  {submitting ? (
    <>
      <span
        className="spinner-border spinner-border-sm me-2"
        role="status"
        aria-hidden="true"
      ></span>
      Création de la commande
    </>
  ) : (
    "Confirmer la commande"
  )}
</button>
        {!isValid && (
  <small className="text-danger d-block mt-2">
    Veuillez remplir tous les champs requis pour continuer.
  </small>
)}
      </div>
    </div>
  </div>

  {/* TOAST SUCCESS */}
  <AlertToast
    show={showToast}
    onClose={() => setShowToast(false)}
    type="success"
    message="Commande créée avec succès !"
  />
</div>


  );
}
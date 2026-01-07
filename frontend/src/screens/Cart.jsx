



import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import EmptyCart from "../assets/images/empty_cart.png";
import { Link } from "react-router-dom";

// Panier initial avec products
const initialCart = [
  {
    product: {
      _id: "1",
      name: "iPhone 17",
      price: 120,
      image: "data:image/jpeg;base64,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",
    },
    quantity: 2,
  },
  {
    product: {
      _id: "2",
      name: "Anker USB-C Charger 65W",
      price: 70,
      image: "https://data:image/jpeg;base64,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.data:image/jpeg;base64,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.webp",
    },
    quantity: 1,
  },
  {
    product: {
      _id: "3",
      name: "Round Sony WH-1000XM5",
      price: 20,
      image:
        "https://cdn.lesnumeriques.com/optim/product/45/45685/6d0cf76c-wh-1000xm3__1200_678__overflow.jpg",
    },
    quantity: 1,
  },
];

function ShoppingCart() {
  const [cart, setCart] = useState(initialCart);

  // Augmenter quantité
  const increaseQuantity = (id) => {
    const newCart = cart.map((item) =>
      item.product._id === id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    setCart(newCart);
  };

  // Diminuer quantité
  const decreaseQuantity = (id) => {
    const newCart = cart.map((item) =>
      item.product._id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCart(newCart);
  };

  // Supprimer item
  const removeItem = (id) => {
    const newCart = cart.filter((item) => item.product._id !== id);
    setCart(newCart);
  };

  // Calculer total
  const totalPrice = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  // Afficher message si panier vide
  if (cart.length === 0) {
    return (
      <div className="text-center mt-5">
        <h2>Votre panier est vide</h2>
        <img src={EmptyCart} alt="Empty Cart" style={{ width: 200 }} />
      </div>
    );
  }

  return (
    <div className="container mt-4">
  <h3 className="mb-4 text-dark">🛒 Votre Panier</h3>
  <div className="row">
    {/* Produits */}
    <div className="col-md-8">
      {cart.map((item) => (
        <div
          className="d-flex align-items-center justify-content-between mb-3 p-3 bg-white rounded shadow-sm"
          key={item.product._id}
        >
          <div className="d-flex align-items-center">
            <img
              src={item.product.image || "https://via.placeholder.com/100"}
              alt={item.product.name}
              className="img-fluid"
              style={{ width: 100, height: 100, objectFit: "contain" }}
            />
            <div className="ms-3">
              <h5 className="text-dark">{item.product.name}</h5>
              <p className="text-secondary mb-1">Prix:{item.product.price} TND</p>
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
            <h5 className="text-dark">{item.product.price * item.quantity} TND</h5>
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
      ))}
    </div>

    {/* Récapitulatif */}
    <div className="col-md-4">
      <div className="p-3 bg-white rounded shadow-sm">
        <ul className="list-unstyled mb-3">
          <li className="d-flex justify-content-between text-dark">
            Sous-total: <span>{totalPrice}TND</span>
          </li>
          <li className="d-flex justify-content-between text-dark">
            Livraison: <span>10 TND</span>
          </li>
          <li className="d-flex justify-content-between text-dark">
            Taxes: <span>10 TND</span>
          </li>
          <hr />
          <li className="d-flex justify-content-between fw-bold text-dark">
            Total: <span>{totalPrice + 20} TND</span>
          </li>
        </ul>

        <Button variant="dark" className="w-100 mb-2">
          Acheter maintenant
        </Button>
        <Button variant="outline-secondary" className="w-100">
          <Link to={"/"}>
          Continuer vos achats
          </Link>
        </Button>

        <div className="d-flex justify-content-center gap-2 mt-3">
          <img
            src="https://readymadeui.com/images/master.webp"
            alt="card1"
            style={{ width: 40 }}
          />
          <img
            src="https://readymadeui.com/images/visa.webp"
            alt="card2"
            style={{ width: 40 }}
          />
          <img
            src="https://readymadeui.com/images/american-express.webp"
            alt="card3"
            style={{ width: 40 }}
          />
        </div>
      </div>
    </div>
  </div>
</div>

  );
}

export default ShoppingCart;

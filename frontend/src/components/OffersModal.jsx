import { useEffect, useState } from "react";
import offerSvg from "../assets/images/Offer.svg"

const OffersModal = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Always show modal on load (design phase)
    setTimeout(() => setShow(true), 800);
  }, []);

  if (!show) return null;

  return (
    <div className="offers-overlay">
      <div className="offers-modal">
        <button className="close-btn" onClick={() => setShow(false)}>✕</button>

        <div className="offer-visual">
        <img src={offerSvg} alt="Offers" className="offer-img" />
 

        </div>

<h2>
  Mega Deals <span>Up to 50% OFF</span>
</h2>


        <p>
          Discover unbeatable discounts on GSM accessories, chargers,
          headphones, smart gadgets & more.
        </p>

        <div className="actions">
          <button
            className="btn-primary-offer"
            onClick={() => window.location.href = "/products"}
          >
            Voir les offres
          </button>
          <button className="btn-secondary" onClick={() => setShow(false)}>
            Plus tard
          </button>
        </div>
      </div>
    </div>
  );
};

export default OffersModal;

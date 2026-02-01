import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import { FiUserPlus, FiX } from "react-icons/fi";

const WHATSAPP_NUMBER = "21620771717"; // number

const PriceModal = ({ show, onClose, productName }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!show) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show, onClose]);

  if (!show) return null;

  const openWhatsapp = () => {
    const text = `Bonjour MA GSM, je souhaite connaître le prix de ${productName ?? "ce produit"}.`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return createPortal(
    <div className="offers-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="offers-modal card border-0 shadow-lg animate-in" onClick={(e) => e.stopPropagation()}>
        <div className="d-flex justify-content-end">
          <button aria-label="Fermer" className="btn btn-link p-2 text-dark" onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>

        <div className="text-center px-4 pb-4">
          <h2 className="offer-headline mb-2">Voir le prix</h2>
          <p className="offer-subtext mb-4">
            Pour consulter le prix, choisissez une option ci-dessous.
          </p>

          <div className="d-flex flex-wrap gap-3 justify-content-center">
            <button
              className="offer-btn offer-btn-primary d-inline-flex align-items-center gap-2"
              onClick={() => navigate("/register")}
            >
              <FiUserPlus />
              Demande inscription
            </button>

            <button
              className="offer-btn offer-btn-secondary d-inline-flex align-items-center gap-2"
              onClick={openWhatsapp}
            >
              <FaWhatsapp />
              Contacter MA GSM sur WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PriceModal;

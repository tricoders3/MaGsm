import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import BASE_URL from "../constante";

const OffersModal = () => {
  const [show, setShow] = useState(false);
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const TODAY_KEY = "offers_modal_last_shown";

  const getToday = () => {
    return new Date().toISOString().split("T")[0]; 
  };
  // Show modal on load
  useEffect(() => {
    const lastShown = localStorage.getItem(TODAY_KEY);
    const today = getToday();
  
    if (lastShown !== today) {
      setTimeout(() => {
        setShow(true);
        localStorage.setItem(TODAY_KEY, today);
      }, 800);
    }
  }, []);
  // Close on ESC
  useEffect(() => {
    if (!show) return;
    const onKey = (e) => e.key === "Escape" && setShow(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show]);

  // Fetch promotions
  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/promotions/promos`
        );
        setPromos(res.data || []);
      } catch (err) {
        console.error("Failed to load promotions", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPromos();
  }, []);

  // Get highest discount percentage
  const maxDiscount = useMemo(() => {
    if (!promos.length) return null;
    return Math.max(
      ...promos
        .filter(p => p.promotion?.discountType === "percentage")
        .map(p => p.promotion.discountValue)
    );
  }, [promos]);

  // Get first active promotion 
  const activePromo = useMemo(() => {
    return promos.find(p => p.promotion?.isActive)?.promotion;
  }, [promos]);

  if (!show || loading || !maxDiscount) return null;

  return (
    <div
      className="offers-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="offers-title"
      onClick={() => setShow(false)}
    >
      <div
        className="offers-modal card border-0 shadow-lg animate-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="row g-4 align-items-center justify-content-center">
          <div className="col-12 col-lg-10">
            <div className="offer-hero text-center">
              <div className="offer-kicker">
                {activePromo?.name || "Offres Spéciales"}
              </div>

              <h1 id="offers-title" className="offer-headline">
                Jusqu’à{" "}
                <span className="gradient-text">
                  -{maxDiscount}%
                </span>
              </h1>

              <p className="offer-subtext mt-3">
                {activePromo?.description ||
                  "Des remises limitées sur les meilleurs accessoires et gadgets."}
              </p>

              <div className="d-flex flex-wrap gap-2 mt-4 justify-content-center">
                <button
                  className="offer-btn offer-btn-primary"
                  onClick={() => (window.location.href = "/products")}
                >
                  Voir les offres
                </button>

                <button
                  className="offer-btn offer-btn-secondary"
                  onClick={() => setShow(false)}
                >
                  Plus tard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OffersModal;
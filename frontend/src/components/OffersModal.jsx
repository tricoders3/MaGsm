import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../constante";

const OffersModal = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  const [show, setShow] = useState(false);
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);

  const TODAY_KEY = "offers_modal_last_shown";

  const getToday = () => new Date().toISOString().split("T")[0];

  // Cookie helpers
  const getCookie = (name) => {
    const parts = document.cookie.split("; ");
    for (const part of parts) {
      if (part.startsWith(name + "=")) {
        return decodeURIComponent(part.split("=")[1]);
      }
    }
    return null;
  };

  const setCookie = (name, value, days) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(
      value
    )}; expires=${expires}; path=/`;
  };

  // Show once per day 
  useEffect(() => {
    if (isAdminRoute) return;

    const today = getToday();
    const lastShown = getCookie(TODAY_KEY);

    if (lastShown !== today) {
      const t = setTimeout(() => {
        setShow(true);
        setCookie(TODAY_KEY, today, 7);
      }, 800);

      return () => clearTimeout(t);
    }
  }, [isAdminRoute]);

  // ESC close
  useEffect(() => {
    if (!show) return;

    const onKey = (e) => e.key === "Escape" && setShow(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show]);

  // Fetch promotions (but NOT on admin routes)
  useEffect(() => {
    if (isAdminRoute) return;

    const fetchPromos = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/promotions/promos`);
        setPromos(res.data || []);
      } catch (err) {
        console.error("Failed to load promotions", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPromos();
  }, [isAdminRoute]);

  const maxDiscount = useMemo(() => {
    if (!promos.length) return null;

    const percentages = promos
      .filter((p) => p.promotion?.discountType === "percentage")
      .map((p) => p.promotion.discountValue);

    return percentages.length ? Math.max(...percentages) : null;
  }, [promos]);

  const activePromo = useMemo(() => {
    return promos.find((p) => p.promotion?.isActive)?.promotion;
  }, [promos]);

  // ✅ Final render condition (AFTER hooks)
  if (isAdminRoute || !show || loading || !maxDiscount) return null;

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
        <div className="text-center p-4">
          <div className="offer-kicker">
            {activePromo?.name || "Offres Spéciales"}
          </div>

          <h1 id="offers-title" className="offer-headline">
            Jusqu’à{" "}
            <span className="gradient-text">-{maxDiscount}%</span>
          </h1>

          <p className="mt-3">
            {activePromo?.description ||
              "Des remises limitées sur les meilleurs accessoires."}
          </p>

          <div className="d-flex gap-2 mt-4 justify-content-center">
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
  );
};

export default OffersModal;

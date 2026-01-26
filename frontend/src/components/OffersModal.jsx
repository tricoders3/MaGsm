import { useEffect, useMemo, useState } from "react";

const OffersModal = () => {
  const [show, setShow] = useState(false);
  const DAYS_BEFORE_RESHOW = 3; // nombre de jours avant de réafficher

  useEffect(() => {
    const lastSeen = localStorage.getItem("offersModalLastSeen");
    const now = new Date().getTime();

    if (!lastSeen || now - Number(lastSeen) > DAYS_BEFORE_RESHOW * 24 * 60 * 60 * 1000) {
      // Afficher le modal après 0.8s
      setTimeout(() => setShow(true), 800);
      localStorage.setItem("offersModalLastSeen", now.toString());
    }
  }, []);

  // Fermer modal avec Escape
  useEffect(() => {
    if (!show) return;
    const onKey = (e) => {
      if (e.key === "Escape") setShow(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show]);

  const chips = useMemo(() => {
    const picks = [10, 20, 30, 40, 50, 60, 70];
    return Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      value: picks[Math.floor(Math.random() * picks.length)],
      left: Math.random() * 90 + 5,
      delay: Math.random() * 3,
      duration: 6 + Math.random() * 4,
    }));
  }, []);

  if (!show) return null;

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
              <div className="offer-kicker">Offres Spéciales</div>
              <h1 id="offers-title" className="offer-headline">
                Jusqu’à <span className="gradient-text">-70%</span>
              </h1>
              <p className="offer-subtext mt-3">
                Des remises limitées sur les meilleurs accessoires et gadgets.
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
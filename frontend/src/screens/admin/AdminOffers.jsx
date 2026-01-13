import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../constante";

export default function AdminOffers() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [active, setActive] = useState(true);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await axios.get(`${BASE_URL}/api/site-settings`, { withCredentials: true });
        const offers = data?.offers || {};
        setTitle(offers.title || "");
        setDescription(offers.description || "");
        setActive(offers.active ?? true);
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement des offres");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      await axios.put(`${BASE_URL}/api/site-settings/offers`, { title, description, active }, { withCredentials: true });
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la mise à jour des offres");
    }
  };

  return (
    <div className="container mt-4">
      <div className="mb-4">
        <h2 className="fw-semibold">Manage Offers</h2>
        <p className="text-muted">Create or update promotional offers.</p>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          {loading && <div>Chargement…</div>}
          {error && <div className="text-danger mb-2">{error}</div>}
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Offer title"
              />
            </div>
            <div className="col-12">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description"
              />
            </div>
            <div className="col-12 d-flex align-items-center gap-2">
              <input
                id="offerActive"
                type="checkbox"
                className="form-check-input"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
              />
              <label htmlFor="offerActive" className="form-check-label">Active</label>
            </div>
            <div className="col-12 d-flex align-items-center gap-3">
              <button type="submit" className="btn btn-primary">Save</button>
              {saved && <span className="text-success">Saved!</span>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

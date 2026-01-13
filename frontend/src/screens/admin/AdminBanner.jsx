import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../constante";

export default function AdminBanner() {
  const [headline, setHeadline] = useState("");
  const [subtext, setSubtext] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      await axios.put(`${BASE_URL}/api/site-settings/banner`, { headline, subtext, imageUrl }, { withCredentials: true });
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la mise à jour de la bannière");
    }
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await axios.get(`${BASE_URL}/api/site-settings`, { withCredentials: true });
        const banner = data?.banner || {};
        setHeadline(banner.headline || "");
        setSubtext(banner.subtext || "");
        setImageUrl(banner.imageUrl || "");
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement des paramètres du site");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  return (
    <div className="container mt-4">
      <div className="mb-4">
        <h2 className="fw-semibold">Homepage Banner</h2>
        <p className="text-muted">Update the main banner headline, subtext and image URL.</p>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          {loading && <div>Chargement…</div>}
          {error && <div className="text-danger mb-2">{error}</div>}
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label">Headline</label>
              <input
                type="text"
                className="form-control"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Banner headline"
              />
            </div>
            <div className="col-12">
              <label className="form-label">Subtext</label>
              <textarea
                className="form-control"
                rows={4}
                value={subtext}
                onChange={(e) => setSubtext(e.target.value)}
                placeholder="Additional text"
              />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label">Image URL</label>
              <input
                type="url"
                className="form-control"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
              />
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

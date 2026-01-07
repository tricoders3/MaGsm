import React, { useEffect, useState } from "react";
import { useContent } from "../../context/ContentContext";

export default function AdminOffers() {
  const { content, updateOffers } = useContent();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [active, setActive] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (content?.offers) {
      setTitle(content.offers.title || "");
      setDescription(content.offers.description || "");
      setActive(!!content.offers.active);
    }
  }, [content]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateOffers({ title, description, active });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="container mt-4">
      <div className="mb-4">
        <h2 className="fw-semibold">Manage Offers</h2>
        <p className="text-muted">Create or update promotional offers.</p>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
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

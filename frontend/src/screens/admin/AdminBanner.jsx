import React, { useEffect, useState } from "react";
import { useContent } from "../../context/ContentContext";

export default function AdminBanner() {
  const { content, updateBanner } = useContent();
  const [headline, setHeadline] = useState("");
  const [subtext, setSubtext] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateBanner({ headline, subtext, imageUrl });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  useEffect(() => {
    if (content?.banner) {
      setHeadline(content.banner.headline || "");
      setSubtext(content.banner.subtext || "");
      setImageUrl(content.banner.imageUrl || "");
    }
  }, [content]);

  return (
    <div className="container mt-4">
      <div className="mb-4">
        <h2 className="fw-semibold">Homepage Banner</h2>
        <p className="text-muted">Update the main banner headline, subtext and image URL.</p>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
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

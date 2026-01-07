import React, { useEffect, useState } from "react";
import { useContent } from "../../context/ContentContext";

export default function AdminAbout() {
  const { content: store, updateAbout } = useContent();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (store?.about) {
      setTitle(store.about.title || "");
      setContent(store.about.content || "");
    }
  }, [store]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateAbout({ title, content });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="container mt-4">
      <div className="mb-4">
        <h2 className="fw-semibold">Edit About Us</h2>
        <p className="text-muted">Update the About Us section content.</p>
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
                placeholder="Section title"
              />
            </div>
            <div className="col-12">
              <label className="form-label">Content</label>
              <textarea
                className="form-control"
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write the About Us content here..."
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

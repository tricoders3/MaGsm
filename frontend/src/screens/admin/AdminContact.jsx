import React, { useEffect, useState } from "react";
import { useContent } from "../../context/ContentContext";

export default function AdminContact() {
  const { content, updateContact } = useContent();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [mapEmbedUrl, setMapEmbedUrl] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateContact({ email, phone, address, mapEmbedUrl });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  useEffect(() => {
    if (content?.contact) {
      setEmail(content.contact.email || "");
      setPhone(content.contact.phone || "");
      setAddress(content.contact.address || "");
      setMapEmbedUrl(content.contact.mapEmbedUrl || "");
    }
  }, [content]);

  return (
    <div className="container mt-4">
      <div className="mb-4">
        <h2 className="fw-semibold">Contact Information</h2>
        <p className="text-muted">Update contact details displayed on the site.</p>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@example.com"
              />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label">Phone</label>
              <input
                type="tel"
                className="form-control"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+212 ..."
              />
            </div>
            <div className="col-12">
              <label className="form-label">Address</label>
              <input
                type="text"
                className="form-control"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street, City, Country"
              />
            </div>
            <div className="col-12">
              <label className="form-label">Google Maps Embed URL</label>
              <input
                type="url"
                className="form-control"
                value={mapEmbedUrl}
                onChange={(e) => setMapEmbedUrl(e.target.value)}
                placeholder="https://maps.google.com/..."
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

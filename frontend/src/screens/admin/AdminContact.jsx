import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../constante";
import { useAuth } from "../../context/AuthContext"; 

export default function AdminContact() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [hours, setHours] = useState("");
  const [mapEmbedUrl, setMapEmbedUrl] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!user || user.role !== "admin") {
      setError("Accès refusé : administrateur requis.");
      return;
    }

    try {
      setError(null);

      await axios.put(
        `${BASE_URL}/api/site-settings/contact`,
        { title, description, phone, email, address, hours, mapEmbedUrl },
        { withCredentials: true }
      );

      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } catch (err) {
      console.error(err);
      if (err?.response?.status === 403) {
        setError("Accès refusé : droits administrateur requis.");
      } else {
        setError("Erreur lors de la mise à jour des informations de contact");
      }
    }
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await axios.get(`${BASE_URL}/api/site-settings`, { withCredentials: true });
        const contact = data?.contact || {};

        setTitle(contact.title || "Contactez-nous");
        setDescription(contact.description || "Notre équipe vous répond rapidement");
        setPhone(contact.phone || "+216 00 000 003");
        setEmail(contact.email || "contact@magsm.tn");
        setAddress(contact.address || "Tunis, Tunisie");
        setHours(contact.hours || "Lun - Sam: 9h - 18h");
        setMapEmbedUrl(contact.mapEmbedUrl || "");
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement des contacts");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);
  
  if (loading) return null;

  return (
    <div className="container mt-4">
      <div className="mb-4">
        <h2 className="fw-semibold">Contact Information</h2>
        <p className="text-muted">Update contact details displayed on the site.</p>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          {error && <div className="text-danger mb-2">{error}</div>}

          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contactez-nous"
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Description</label>
              <input
                type="text"
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Notre équipe vous répond rapidement"
              />
            </div>

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
                placeholder="+216 ..."
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

            <div className="col-12 col-md-6">
              <label className="form-label">Hours</label>
              <input
                type="text"
                className="form-control"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="Lun - Sam: 9h - 18h"
              />
            </div>

            <div className="col-12 col-md-6">
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

import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../constante";
import { FiBox, FiUsers, FiZap } from "react-icons/fi";

export default function AdminAbout() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  // Hero, About, Features, Map
  const [heroImage, setHeroImage] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [features, setFeatures] = useState([
    { icon: "FiBox", title: "Curated Products", description: "" },
    { icon: "FiUsers", title: "Customer First", description: "" },
    { icon: "FiZap", title: "Fast Service", description: "" },
  ]);
  const [mapUrl, setMapUrl] = useState("");

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await axios.get(`${BASE_URL}/api/site-settings`, { withCredentials: true });
        const about = data?.about || {};

        setHeroImage(about.heroImage || "");
        setTitle(about.title || "");
        setContent(about.content || "");
        setFeatures(
          about.features || [
            { icon: "FiBox", title: "Curated Products", description: "" },
            { icon: "FiUsers", title: "Customer First", description: "" },
            { icon: "FiZap", title: "Fast Service", description: "" },
          ]
        );
        setMapUrl(about.mapUrl || "https://www.google.com/maps?q=123%20Avenue%20Centrale&output=embed");
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement de la section À propos");
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  const handleFeatureChange = (index, key, value) => {
    const updated = [...features];
    updated[index][key] = value;
    setFeatures(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      await axios.put(
        `${BASE_URL}/api/site-settings/about`,
        { heroImage, title, content, features, mapUrl },
        { withCredentials: true }
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la mise à jour de la section À propos");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="fw-semibold mb-3">Edit About Us (Admin)</h2>
      {loading && <div>Chargement…</div>}
      {error && <div className="text-danger mb-2">{error}</div>}

      <form onSubmit={handleSubmit} className="mb-5">
        {/* About Title & Content */}
        <div className="mb-3">
          <label className="form-label">About Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="About Us"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">About Content</label>
          <textarea
            className="form-control"
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write the About Us content..."
          />
        </div>

        {/* Features / Cards */}
        <div className="mb-3">
          <label className="form-label">Features / Cards</label>
          {features.map((f, i) => (
            <div key={i} className="mb-2 p-3 border rounded">
              <div className="mb-2">
                <input
                  type="text"
                  className="form-control"
                  value={f.title}
                  onChange={(e) => handleFeatureChange(i, "title", e.target.value)}
                  placeholder="Feature Title"
                />
              </div>
              <div>
                <textarea
                  className="form-control"
                  rows={2}
                  value={f.description}
                  onChange={(e) => handleFeatureChange(i, "description", e.target.value)}
                  placeholder="Feature Description"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Map URL */}
        <div className="mb-3">
          <label className="form-label">Google Map Embed URL</label>
          <input
            type="text"
            className="form-control"
            value={mapUrl}
            onChange={(e) => setMapUrl(e.target.value)}
            placeholder="https://www.google.com/maps?q=..."
          />
        </div>

        <button type="submit" className="btn btn-primary">
          {loading ? "Saving..." : "Save Changes"}
        </button>
        {saved && <span className="text-success ms-3">Saved!</span>}
      </form>

   
    </div>
  );
}

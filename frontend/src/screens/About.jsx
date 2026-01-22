import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../constante";
import { FiBox, FiUsers, FiZap } from "react-icons/fi";

export default function About() {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await axios.get(`${BASE_URL}/api/site-settings/about`);
        setAbout(data);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger la page À propos");
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  const features = about?.features || [];
  const icons = [FiBox, FiUsers, FiZap];
  const ICONS = { FiBox, FiUsers, FiZap };

  return (
    <main>
      {/* Hero Section */}
      <section className="py-0">
        <div className="container-fluid px-0">
          <img alt="About MA GSM cover" className="w-100" style={{ display: 'block', objectFit: 'cover', maxHeight: 420, width: '100%' }} />
        </div>
      </section>
      <section className="py-4">
        <div className="container">
          {loading && <p className="text-muted mb-0">Chargement…</p>}
          {error && <p className="text-danger mb-0">{error}</p>}
          {!loading && !error && (
            <>
              <h2 className="fw-bold mb-2">{about?.title || 'About Us'}</h2>
              <p className="text-muted mb-0">{about?.content || 'Carefully selected products, customer-first support and fast service.'}</p>
            </>
          )}
        </div>
      </section>
      {/* Values / Features */}
      <section className="py-5">
        <div className="container">
          <div className="row g-4">
            {!loading && !error && features.length > 0 ? (
              features.map((f, i) => {
                const Icon = (f.icon && ICONS[f.icon]) ? ICONS[f.icon] : icons[i % icons.length];
                return (
                  <div key={i} className="col-12 col-md-6 col-lg-4">
                    <div className="p-4 h-100 rounded-4 shadow-sm" style={{ background: "#fff" }}>
                      <div className="mb-3 d-inline-flex align-items-center justify-content-center" style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(1,171,171,0.1)" }}>
                        <Icon style={{ fontSize: 22, color: "#01ABAB" }} />
                      </div>
                      <h5 className="fw-semibold mb-2">{f.title || 'Feature'}</h5>
                      <p className="text-muted mb-0">{f.description || ''}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <>
                <div className="col-12 col-md-6 col-lg-4">
                  <div className="p-4 h-100 rounded-4 shadow-sm" style={{ background: "#fff" }}>
                    <div className="mb-3 d-inline-flex align-items-center justify-content-center" style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(1,171,171,0.1)" }}>
                      <FiBox style={{ fontSize: 22, color: "#01ABAB" }} />
                    </div>
                    <h5 className="text-dark fw-semibold mb-2">Curated Products</h5>
                    <p className="text-muted mb-0">Carefully selected phones, laptops, and accessories from trusted brands.</p>
                  </div>
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                  <div className="p-4 h-100 rounded-4 shadow-sm" style={{ background: "#fff" }}>
                    <div className="mb-3 d-inline-flex align-items-center justify-content-center" style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(1,171,171,0.1)" }}>
                      <FiUsers style={{ fontSize: 22, color: "#01ABAB" }} />
                    </div>
                    <h5 className="text-dark fw-semibold mb-2">Customer First</h5>
                    <p className="text-muted mb-0">Friendly support and guidance before and after your purchase.</p>
                  </div>
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                  <div className="p-4 h-100 rounded-4 shadow-sm" style={{ background: "#fff" }}>
                    <div className="mb-3 d-inline-flex align-items-center justify-content-center" style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(1,171,171,0.1)" }}>
                      <FiZap style={{ fontSize: 22, color: "#01ABAB" }} />
                    </div>
                    <h5 className="text-dark fw-semibold mb-2">Fast Service</h5>
                    <p className="text-muted mb-0">Quick order handling and reliable fulfillment you can count on.</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Address and Contact */}
      <section id="location" className="py-5" style={{ background: "#f8f9fa" }}>
        <div className="container">
          <div className="row g-4">
            <div className="col">
              <h2 className="fw-bold mb-3">Our Address</h2>
              <p className="text-muted mb-4">
                Find us at our store. We’re happy to welcome you and help you choose the right products.
              </p>
            </div>
            <div className="col-12 col-lg-7">
              <div className="ratio ratio-4x3 rounded-4 overflow-hidden shadow bg-white">
                <iframe
                  title="MA GSM Location"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={"https://www.google.com/maps?q=35.67322432149297,10.098604243817753&output=embed"}
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}

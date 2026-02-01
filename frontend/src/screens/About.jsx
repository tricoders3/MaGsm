import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../constante";
import { FiBox, FiUsers, FiZap } from "react-icons/fi";
import Image from "../assets/images/about.jpeg";
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
        setError(err?.friendlyMessage || "Something went wrong. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);


  if (loading) return null;
  if (error) return null;

  return (
    <main>
      {/* Hero Section */}
      <section className="py-0">
        <div className="container-fluid px-0">
        <img 
  src={Image} 
  alt="About MA GSM cover" 
  className="w-100" 
  style={{ 
    display: 'block', 
    objectFit: 'cover', 
    objectPosition: '50% 75%',   
    maxHeight: 380, 
    width: '100%' 
  }} 
/>

        </div>
      </section>
      <section className="py-4 mt-2">
        <div className="container">
      
          {!loading && !error && (
            <>
              <h2 className="fw-bold mb-2">{about?.title || 'Qui Sommes-nous?'}</h2>
              <p className="text-muted mb-0">{about?.content || 'Carefully selected products, customer-first support and fast service.'}</p>
            </>
          )}
        </div>
      </section>
      {/* Values / Features */}
      <section className="py-5">
  <div className="container">
    <div className="row g-4">

      <div className="col-12 col-md-6 col-lg-4">
        <div className="p-4 h-100 rounded-4 shadow-sm" style={{ background: "#fff" }}>
          <div className="mb-3 d-inline-flex align-items-center justify-content-center" 
               style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(1,171,171,0.1)" }}>
            <FiBox style={{ fontSize: 22, color: "#01ABAB" }} />
          </div>
          <h5 className="text-dark fw-semibold mb-2">Produits Sélectionnés</h5>
          <p className="text-muted mb-0">Tools, accessoires et pièces de rechanges soigneusement sélectionnés parmi des marques fiables.</p>
        </div>
      </div>

      <div className="col-12 col-md-6 col-lg-4">
        <div className="p-4 h-100 rounded-4 shadow-sm" style={{ background: "#fff" }}>
          <div className="mb-3 d-inline-flex align-items-center justify-content-center" 
               style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(1,171,171,0.1)" }}>
            <FiUsers style={{ fontSize: 22, color: "#01ABAB" }} />
          </div>
          <h5 className="text-dark fw-semibold mb-2">Client d’Abord</h5>
          <p className="text-muted mb-0">Support amical et conseils avant et après votre achat.</p>
        </div>
      </div>

      <div className="col-12 col-md-6 col-lg-4">
        <div className="p-4 h-100 rounded-4 shadow-sm" style={{ background: "#fff" }}>
          <div className="mb-3 d-inline-flex align-items-center justify-content-center" 
               style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(1,171,171,0.1)" }}>
            <FiZap style={{ fontSize: 22, color: "#01ABAB" }} />
          </div>
          <h5 className="text-dark fw-semibold mb-2">Service Rapide</h5>
          <p className="text-muted mb-0">Traitement rapide des commandes et exécution fiable sur laquelle vous pouvez compter.</p>
        </div>
      </div>

    </div>
  </div>
</section>
      {/* Address and Contact */}
      <section id="location" className="py-5" style={{ background: "#f8f9fa" }}>
        <div className="container">
          <div className="row g-4">
            <div className="col">
            <h2 className="fw-bold mb-3">Notre Adresse</h2>
<p className="text-muted mb-4">
  Retrouvez-nous dans notre magasin. Nous serons ravis de vous accueillir et de vous aider à choisir les produits adaptés.
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

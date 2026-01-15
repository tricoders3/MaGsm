import React from "react";
import { useContent } from "../context/ContentContext";
import { FiBox, FiUsers, FiZap, FiMapPin, FiClock, FiPhone, FiMail } from "react-icons/fi";

export default function About() {
  const { content } = useContent();
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
          <h2 className="fw-bold mb-2">{content?.about?.title || 'About Us'}</h2>
          <p className="text-muted mb-0">{content?.about?.content || 'Carefully selected products, customer-first support and fast service.'}</p>
        </div>
      </section>
      {/* Values / Features */}
      <section className="py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-12 col-md-6 col-lg-4">
              <div className="p-4 h-100 rounded-4 shadow-sm" style={{ background: "#fff" }}>
                <div className="mb-3 d-inline-flex align-items-center justify-content-center" style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(1,171,171,0.1)" }}>
                  <FiBox style={{ fontSize: 22, color: "#01ABAB" }} />
                </div>
                <h5 className="fw-semibold mb-2">Curated Products</h5>
                <p className="text-muted mb-0">
                  Carefully selected phones, laptops, and accessories from trusted brands.
                </p>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <div className="p-4 h-100 rounded-4 shadow-sm" style={{ background: "#fff" }}>
                <div className="mb-3 d-inline-flex align-items-center justify-content-center" style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(1,171,171,0.1)" }}>
                  <FiUsers style={{ fontSize: 22, color: "#01ABAB" }} />
                </div>
                <h5 className="fw-semibold mb-2">Customer First</h5>
                <p className="text-muted mb-0">
                  Friendly support and guidance before and after your purchase.
                </p>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <div className="p-4 h-100 rounded-4 shadow-sm" style={{ background: "#fff" }}>
                <div className="mb-3 d-inline-flex align-items-center justify-content-center" style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(1,171,171,0.1)" }}>
                  <FiZap style={{ fontSize: 22, color: "#01ABAB" }} />
                </div>
                <h5 className="fw-semibold mb-2">Fast Service</h5>
                <p className="text-muted mb-0">
                  Quick order handling and reliable fulfillment you can count on.
                </p>
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
                  src="https://www.google.com/maps?q=Rue%20Ali%20Belhouane%2C%20Kairouan%203190%2C%20Tunisia&output=embed"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}

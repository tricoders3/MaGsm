import React from 'react'
import { FiShoppingCart, FiEye } from "react-icons/fi";
import camera from '../assets/images/camera.png'; 
const BestSeller = () => {
       const products = [
            {
              id: 1,
              name: "Smartphone XYZ",
              description: "Un smartphone puissant avec un excellent appareil photo.",
              price: 1200,
              image: "/images/smartphone.jpg"
            },
            {
              id: 2,
              name: "Laptop ABC",
              description: "Portable léger et rapide pour tous vos besoins professionnels.",
              price: 2500,
              image: "/images/laptop.jpg"
            },
            {
              id: 3,
              name: "Casque Audio",
              description: "Profitez d'un son clair et immersif.",
              price: 300,
              image: "/images/headphones.jpg"
            }
          ];
  return (
    <section className="features-section py-5">
    <div className="container">
      <div className="mb-5">
        <h2 className="section-title">Meilleures ventes</h2>
        <p className="section-subtitle">Découvrez nos produits les plus populaires</p>
      </div>
  
      <div className="row g-4 justify-content-center">
        {products.map((product) => (
          <div key={product.id} className="col-xl-3 col-lg-4 col-md-6">
            <div className="product-card h-100">
              
              {/* Top badges */}
              <div className="card-badges">
                <span className="badge-stock">EN STOCK</span>
                <button className="cart-btn">
    <FiShoppingCart size={18} />
  </button>
  
              </div>
  
              {/* Image */}
              <div className="product-image">
                <img src={camera} alt={product.name} />
              </div>
  
              {/* Content */}
              <div className="product-content text-center">
                <h6 className="product-title">{product.name}</h6>
                <p className="product-category">{product.description}</p>
  
                <button className="btn-redesign btn-primary-redesign">
                  Découvrir les détails
                </button>
              </div>
  
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
  )
}

export default BestSeller

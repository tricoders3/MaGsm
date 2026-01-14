import React from "react";
import huawei from "../assets/images/Huawei-Logo.png";
import apple from "../assets/images/Apple-Logo.png";
import oppo from "../assets/images/oppo-logo.png";

const Brands = () => {
  const brands = [
    { id: 1, name: "Huawei", image: huawei },
    { id: 2, name: "Apple", image: apple },
    { id: 3, name: "Oppo", image: oppo },
  ];

  return (
    <section className="brands-section py-5">
      <div className="container text-center mb-5">
        <h2 className="section-title">Our Brands</h2>
        <p className="section-subtitle">Discover our trusted brand partners</p>
      </div>

      <div className="brands-slider">
        <div className="brands-track">
          {brands.map((brand) => (
            <div key={brand.id} className="brand-slide">
              <img src={brand.image} alt={brand.name} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Brands;

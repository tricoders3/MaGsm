import React from 'react';
import huawei from "../assets/images/Huawei-Logo.png";
import samsung from "../assets/images/Samsung-Logo.png";
import apple from "../assets/images/Apple-Logo.png";
import oppo from "../assets/images/oppo-logo.png";


const Brands = () => {
    const brands = [
        { id: 1, name: "Huawei", image: huawei },
        { id: 3, name: "Apple", image: apple },
        { id: 4, name: "Oppo", image: oppo },
      ];
      
      
  return (
    <section className="brands-section py-5">
  <div className="container">
    <div className="mb-5">
      <h2 className="section-title">Our Brands</h2>
      <p className="section-subtitle">Discover our trusted brand partners</p>
    </div>

    <div className="row g-4 justify-content-center align-items-center">
      {brands.map((brand) => (
        <div key={brand.id} className="col-6 col-md-3 col-lg-2 text-center">
          <div className="brand-card">
            <img 
              src={brand.image} 
              alt={brand.name} 
              className="img-fluid brand-logo" 
            />
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

  )
}

export default Brands

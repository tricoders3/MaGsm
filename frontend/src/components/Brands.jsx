import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../constante";


const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/brands`);
        setBrands(res.data);
      } catch (error) {
        console.error("Error fetching brands:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);



  if (!brands.length) {
    return null;
  }

  return (
    <section className="brands-section py-md-3 py-0">
      <div className="container">
        <div className="mb-3">
          <h2 className="section-title">Nos Marques</h2>
          <p className="section-subtitle">
            Découvrez nos marques partenaires de confiance
          </p>
        </div>

        <div className="brands-slider mb-3">
          <div className="brands-track">
            {brands.map((brand) => (
              <div key={brand._id} className="brand-slide">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Brands;

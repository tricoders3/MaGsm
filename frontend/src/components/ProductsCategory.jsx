import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../constante";

// FRONTEND IMAGE MAP
import phones from "../assets/images/phones.png";
import laptops from "../assets/images/laptops.png";
import accessories from "../assets/images/accessories.png";


const categoryImages = {
  phones,
  laptops,
  accessories
};

const ProductsCategory = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${BASE_URL}/api/categories`).then((res) => {
      setCategories(res.data);
    });
  }, []);

  return (
    <section className="category-editorial py-5">
      <div className="container">
      <div className="mb-4">
      <h2 className="section-title">Catégories de produits</h2>
      <p className="section-subtitle d-inline">
        Découvrez nos univers soigneusement sélectionnés pour répondre à tous vos besoins.
      </p>

        </div>


        <div className="row g-4">
          {categories.map((cat) => {
            const key = cat.name.toLowerCase();
            const image = categoryImages[key];

            return (
              <div key={cat._id} className="col-lg-4 col-md-6">
                <div
                  className="category-white-card"
                  onClick={() => navigate(`/category/${cat._id}`)}
                >
                  {/* TEXT */}
                  <div className="category-text">
                    <h3 className="product-title">{cat.name}</h3>
                    <p className="product-description">{cat.description || "Explore collection"}</p>
                 
                  </div>

                  {/* IMAGE */}
                  <div className="category-img">
                    <img src={image} alt={cat.name} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductsCategory;

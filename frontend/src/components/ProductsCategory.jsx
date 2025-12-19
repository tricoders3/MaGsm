import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import axios from 'axios';
import BASE_URL from "../constante";

const ProductsCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/categories`);
        setCategories(response.data);
        console.log(response.data)
        setLoading(false);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories');
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section className="categories-section py-5">
      <div className="container">
        <div className="mb-5">
          <h2 className="section-title">Product Categories</h2>
        </div>
        <div className="row g-4">
          {categories.map((category) => (
            <div key={category.id} className="col-lg-4 col-md-6"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(`/category/${category._id}`)}>
              <div className="category-card card-redesign h-100">
                <div className="card-body-redesign text-center">
                  {/* Category Image 
                  <div className="category-image mb-3">
                    <img
                      src={category.image || '/assets/images/default.png'} // fallback image
                      alt={category.name}
                      className="img-fluid rounded-circle"
                      style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                    />
                  </div>
*/}
                  {/* Category Name */}
                  <h4 className="category-title mb-2">{category.name}</h4>

                  {/* Optional Description */}
                  {category.description && (
                    <p className="category-description text-light">{category.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsCategory;

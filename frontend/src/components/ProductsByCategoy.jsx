import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from "../constante";

const SubcategoryProducts = () => {
  const { subcategoryId } = useParams(); // updated param
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch products by subcategory
        const response = await axios.get(`${BASE_URL}/api/products/subcategory/${subcategoryId}`);
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [subcategoryId]);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;
  if (!products.length) return <p>No products found in this subcategory.</p>;

  return (
    <section className="products-section py-5">
      <div className="container">
        <h2 className="section-title mb-5">Products</h2>
        <div className="row g-4">
          {products.map(product => (
            <div key={product._id} className="col-xl-3 col-lg-4 col-md-6">
              <div className="product-card h-100">
                <div className="product-image">
                  <img src={product.images?.[0]?.url || '/assets/images/default.png'} alt={product.name} />
                </div>
                <div className="product-content text-center">
                  <h6 className="product-title">{product.name}</h6>
                  <p className="product-description">{product.description}</p>
                  <p className="product-price">{product.price} DT</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SubcategoryProducts;

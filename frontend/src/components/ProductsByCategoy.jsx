import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from "../constante";
import ProductCard from "./ProductCard";


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


  if (error) return null;

  if (!products.length) 
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-lg rounded-4 border-0 p-4">
              <h5 className="card-title mb-2">Aucun produit trouvé</h5>
              <p className="text-muted">
                Aucun produit n’est disponible dans cette sous-catégorie pour le moment.
              </p>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <section className="products-section py-5">
      <div className="container">
        <h2 className="section-title mb-3">Produits</h2>
        <div className="row g-3">
        {products.map((p) => (
  <div key={p.id} className="col-6 col-sm-6 col-md-4 col-lg-3">
    <ProductCard
      product={{
        id: p.id,
        name: p.name,
        images: p.images?.length
          ? p.images
          : [{ url: "/assets/images/default.png" }],
        description: p.description,
        price: p.price,
        discountedPrice: p.hasPromotion ? p.discountedPrice : null,
        hasPromotion: p.hasPromotion,
      }}
      badgeType={p.hasPromotion ? "promo" : "stock"}
      stockCount={p.countInStock}
    />
  </div>
))}

        </div>
      </div>
    </section>
  );
};

export default SubcategoryProducts;

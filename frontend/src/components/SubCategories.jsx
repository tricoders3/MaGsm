import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import BASE_URL from "../constante";

const CategoryView = () => {
  const { categoryId } = useParams();

  const [category, setCategory] = useState(null); // full category info
  const [products, setProducts] = useState([]);
  const [activeSubcategory, setActiveSubcategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1️⃣ Get all products of this category
        const prodRes = await axios.get(`${BASE_URL}/api/products/category/${categoryId}`);

        // 2️⃣ Assume category info is inside products[0].category
        const categoryInfo = prodRes.data[0]?.category || { subCategories: [] };

        setCategory(categoryInfo);
        setProducts(prodRes.data);
      } catch (err) {
        console.error("Error fetching category data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  // Filter products by selected subcategory
  const filteredProducts =
    activeSubcategory === "all"
      ? products
      : products.filter(p => p.subCategory === activeSubcategory);

  if (loading) return <p>Loading...</p>;
  if (!category) return <p>No category found.</p>;

  return (
    <section className="py-5">
      <div className="container">
        <h2 className="section-title mb-4">{category.name}</h2>

        {/* SUBCATEGORY FILTER */}

<div className="subcategory-filter d-flex gap-2 flex-wrap mb-4">
  <button
    className={`filter-btn ${activeSubcategory === "all" ? "active" : ""}`}
    onClick={() => setActiveSubcategory("all")}
  >
    All
  </button>

  {category.subCategories.map(sub => (
    <button
      key={sub._id}
      className={`filter-btn ${activeSubcategory === sub._id ? "active" : ""}`}
      onClick={() => setActiveSubcategory(sub._id)}
    >
      {sub.name}
    </button>
  ))}
</div>

        {/* PRODUCTS */}
        <div className="row g-4">
          {filteredProducts.map(product => (
            <div key={product._id} className="col-6 col-md-3 mb-4">
              <div className="product-card card-redesign h-100">
                <div className="card-body-redesign text-center">
                  {product.images[0]?.url ? (
                    <img
                      src={product.images[0].url}
                      alt={product.name}
                      className="mb-3 img-fluid"
                    />
                  ) : (
                    <div className="mb-3" style={{ height: "150px", background: "#f0f0f0" }} />
                  )}
                  <h5 className="product-title">{product.name}</h5>
                  <p>{product.price} €</p>
                  <p className="text-muted">{product.subCategoryName}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <p className="text-center mt-4">No products found.</p>
        )}
      </div>
    </section>
  );
};

export default CategoryView;

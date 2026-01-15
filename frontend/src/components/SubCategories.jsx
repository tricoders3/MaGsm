import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import BASE_URL from "../constante";
import ProductCard from "../components/ProductCard"; // reusable card


const CategoryView = () => {
  const { categoryId } = useParams();

  const [category, setCategory] = useState(null); 
  const [products, setProducts] = useState([]);
  const [activeSubcategory, setActiveSubcategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get all products of this category
        const prodRes = await axios.get(
          `${BASE_URL}/api/products/category/${categoryId}`
        );

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
      : products.filter((p) => p.subCategory === activeSubcategory);

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
            Tous
          </button>

          {category.subCategories.map((sub) => (
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
          {filteredProducts.map((product) => (
       <div key={product._id} className="col-12 col-sm-6 col-md-3 mb-4">
       <ProductCard
         product={{
           id: product._id,
           name: product.name,
           price: product.price,
           image: product.images?.[0]?.url || "/assets/images/default.png",
           category: product.subCategoryName || "N/A",
           countInStock: product.countInStock,
           description: product.description,
         }}
         badgeType="stock"
         stockCount={product.countInStock}
         isFavorite={favorites.includes(product._id)}
         onFavoriteSuccess={(id) =>
           setFavorites((prev) => [...new Set([...prev, id])])
         }
       />
     </div>
     
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <p className="text-center mt-4">Aucun produit trouvé.</p>
        )}
      </div>
    </section>
  );
};

export default CategoryView;

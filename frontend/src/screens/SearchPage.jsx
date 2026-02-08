import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import BASE_URL from "../constante";
import ProductCard from "../components/ProductCard";
import { useGlobalSearch } from "../context/SearchContext";

export default function Recherche() {
  const { query, categoryId, subCategoryId,
    setSubCategoryId } = useGlobalSearch();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("relevance"); 

  useEffect(() => {
    setSubCategoryId("");
  }, [categoryId]);
  

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`${BASE_URL}/api/products`);
        const mapped = res.data.map((product) => ({
          id: product._id,
          name: product.name,
          description: product.description,
          category: product.category?.name || "N/A",
          categoryId: product.category?._id || product.category || "",
          subCategoryId: product.subCategory || product.subCategory?._id || "",
          images: product.images?.length ? product.images : [{ url: "/assets/images/default.png" }],
          price: product.price,
          promotion: product.promotion,
          discountedPrice: product.discountedPrice,
          hasPromotion: product.hasPromotion,
          countInStock: product.countInStock || 1,
        }));
        setProducts(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filtered = useMemo(() => {
    let arr = products.filter((p) => {
      const matchesName = p.name?.toLowerCase().includes(query.toLowerCase());
      const matchesCat = !categoryId || p.categoryId === categoryId;
      const matchesSub = !subCategoryId || p.subCategoryId === subCategoryId;
      const effectivePrice = p.discountedPrice || p.price;
      const matchesMin = minPrice === "" || Number(effectivePrice) >= Number(minPrice);
      const matchesMax = maxPrice === "" || Number(effectivePrice) <= Number(maxPrice);
      const matchesStock = !inStockOnly || (p.countInStock ?? 0) > 0;
      return matchesName && matchesCat && matchesSub && matchesMin && matchesMax && matchesStock;
    });

    // Sorting
    if (sortBy === "name_asc") {
      arr = [...arr].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "price_asc") {
      arr = [...arr].sort((a, b) => {
        const priceA = a.discountedPrice || a.price || 0;
        const priceB = b.discountedPrice || b.price || 0;
        return priceA - priceB;
      });
    } else if (sortBy === "price_desc") {
      arr = [...arr].sort((a, b) => {
        const priceA = a.discountedPrice || a.price || 0;
        const priceB = b.discountedPrice || b.price || 0;
        return priceB - priceA;
      });
    }
    // relevance keeps original order
    return arr;
  }, [products, query, categoryId, subCategoryId, minPrice, maxPrice, inStockOnly, sortBy]);



  if (loading) return null;
  if (error) return null;

  return (
    <div className="container my-5 recherche-page">
      {/* Header */}
      <div className="search-header d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-3">
        <div>
          <h2 className="mb-1 search-title">Résultats de recherche</h2>
          <p className="text-muted mb-0 search-subtitle">
            {query?.trim() ? (
              <>Requête: <strong>{query}</strong></>
            ) : (
              <>Affichage de tous les produits selon vos recherche</>
            )}
          </p>
        </div>
        <div className="text-muted small search-stats">{filtered.length} résultats trouvés</div>
      </div>


      <div className="row g-3">
        {filtered.map((product) => (
          <div key={product.id} className="col-6 col-sm-6 col-md-4 col-lg-3">
            <ProductCard
              product={product}
              badgeType={product.promotion ? "promo" : "stock"}
              stockCount={product.countInStock}
            />
          </div>
        ))}
      </div>

      {filtered.length === 0 && query.trim().length > 0 && (
        <p className="text-center text-muted mt-3">Aucun produit correspondant.</p>
      )}
    </div>
  );
}

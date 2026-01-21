import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import BASE_URL from "../constante";
import ProductCard from "../components/ProductCard";
import { useGlobalSearch } from "../context/SearchContext";

export default function Recherche() {
  const { query, categoryId, subCategoryId, setQuery, setCategoryId, setSubCategoryId } = useGlobalSearch();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("relevance"); 

  useEffect(() => {
    return () => {
      setQuery("");
      setCategoryId("");
      setSubCategoryId("");
    };
  }, []);

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
          image: product.images?.[0]?.url || "/assets/images/default.png",
          price: product.price,
          promotion: product.promotion,
          countInStock: product.countInStock || 1,
        }));
        setProducts(mapped);
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement des produits");
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
      const matchesMin = minPrice === "" || Number(p.price) >= Number(minPrice);
      const matchesMax = maxPrice === "" || Number(p.price) <= Number(maxPrice);
      const matchesStock = !inStockOnly || (p.countInStock ?? 0) > 0;
      return matchesName && matchesCat && matchesSub && matchesMin && matchesMax && matchesStock;
    });

    // Sorting
    if (sortBy === "name_asc") {
      arr = [...arr].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "price_asc") {
      arr = [...arr].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    } else if (sortBy === "price_desc") {
      arr = [...arr].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    }
    // relevance keeps original order
    return arr;
  }, [products, query, categoryId, subCategoryId, minPrice, maxPrice, inStockOnly, sortBy]);



  if (loading) return <div className="container py-5">Chargement…</div>;
  if (error) return <div className="container py-5 text-danger">{error}</div>;

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


      <div className="row g-4">
        {filtered.map((product) => (
          <div key={product.id} className="col-12 col-sm-6 col-md-3">
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

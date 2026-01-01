import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../constante";
import ProductForm from "../../components/ProductForm";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = async () => {
    const { data } = await axios.get(`${BASE_URL}/api/products`);
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id) => {
    if (!window.confirm("Supprimer ce produit ?")) return;
    await axios.delete(`${BASE_URL}/api/products/${id}`);
    fetchProducts();
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // Helper to calculate discounted price if promo exists
  const getDiscountedPrice = (product) => {
    if (!product.promotion || !product.promotion.isActive) return product.price;
    const promo = product.promotion;
    if (promo.discountType === "percentage") {
      return product.price - (product.price * promo.discountValue) / 100;
    } else if (promo.discountType === "fixed") {
      return product.price - promo.discountValue;
    }
    return product.price;
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between mb-3">
        <h4>Produits</h4>
        <button
          className="btn btn-primary"
          onClick={() => {
            setSelectedProduct(null);
            setShowForm(true);
          }}
        >
          Ajouter produit
        </button>
      </div>

      <input
        className="form-control mb-3"
        placeholder="Recherche..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <ProductForm
        show={showForm}
        product={selectedProduct}
        onClose={() => setShowForm(false)}
        onSaved={fetchProducts}
      />

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Produit</th>
            <th>Image</th>
            <th>Prix</th>
            <th>Prix Promo</th>
            <th>Promo</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map(p => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>
                {p.images?.[0]?.url && (
                  <img
                    src={p.images[0].url}
                    alt={p.name}
                    style={{ width: "50px", height: "50px", objectFit: "cover" }}
                  />
                )}
              </td>
              <td>{p.price.toFixed(2)} TND</td>
              <td>
                {p.promotion?.isActive
                  ? getDiscountedPrice(p).toFixed(2) + " TND"
                  : "-"}
              </td>
              <td>{p.promotion?.isActive ? p.promotion.name : "Non"}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => {
                    setSelectedProduct(p);
                    setShowForm(true);
                  }}
                >
                  <i className="fas fa-pen"></i>
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => deleteProduct(p._id)}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Products;

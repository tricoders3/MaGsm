import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../constante";
import ProductForm from "../../components/ProductForm";
import { FiPlus } from "react-icons/fi";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // New state for loading and error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products with loading & error handling
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.get(`${BASE_URL}/api/products`);
      setProducts(data);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la récupération des produits.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id) => {
    if (!window.confirm("Supprimer ce produit ?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression du produit");
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

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
    <div className="container py-4">
      <div className="card border-0 shadow-sm rounded-4">
        {/* Header */}
        <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
          <div>
            <h5 className="text-dark fw-bold mb-0 d-flex align-items-center gap-2">
              Produits
              <span className="users-count-pill">
                {filteredProducts.length} produits
              </span>
            </h5>
          </div>

          <div className="d-flex gap-2 align-items-center mb-3">
  <input
    className="form-control rounded-pill ps-4"
    placeholder="Recherche par nom…"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    style={{ height: '42px' }} // explicitly set input height
  />

  <button
    className="btn btn-add-primary d-flex align-items-center justify-content-center gap-1"
    onClick={() => {
      setSelectedProduct(null);
      setShowForm(true);
    }}
    style={{ height: '42px' }} // match input height
  >
    <FiPlus /> Ajouter
  </button>
</div>

        </div>

        {/* Body */}
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" />
              <p className="mt-2 mb-0 text-muted">Chargement des produits…</p>
            </div>
          ) : error ? (
            <p className="text-danger p-4">{error}</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover table-sm align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Produit</th>
                    <th>Image</th>
                    <th>Prix</th>
                    <th>Prix Promo</th>
                    <th>Promo</th>
                    <th className="text-end pe-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p) => (
                    <tr key={p._id}>
                      <td>{p.name}</td>
                      <td>
                        {p.images?.[0]?.url && (
                          <img
                            src={p.images[0].url}
                            alt={p.name}
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                              borderRadius: "0.25rem",
                            }}
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
                      <td className="text-end pe-4">
                        <button
                          className="btn btn-sm btn-light border me-2 action-btn"
                          title="Modifier"
                          onClick={() => {
                            setSelectedProduct(p);
                            setShowForm(true);
                          }}
                        >
                          <i className="fas fa-pen"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-light border text-danger action-btn"
                          title="Supprimer"
                          onClick={() => deleteProduct(p._id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && !loading && (
                    <tr>
                      <td colSpan="6" className="text-center text-muted py-3">
                        Aucun produit trouvé
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Product Form Modal */}
      <ProductForm
        show={showForm}
        product={selectedProduct}
        onClose={() => setShowForm(false)}
        onSaved={fetchProducts}
      />
    </div>
  );
};

export default Products;

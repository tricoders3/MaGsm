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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
            <small className="text-muted">Gérez vos produits, photos, prix et promotions.</small>
          </div>

          <div className="d-flex gap-2 align-items-center mb-3">
            <input
              className="form-control rounded-pill ps-4"
              placeholder="Recherche par nom…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1); // Reset page when searching
              }}
              style={{ height: "42px" }}
            />
            <button
              className="btn btn-add-primary d-flex align-items-center justify-content-center gap-1"
              onClick={() => {
                setSelectedProduct(null);
                setShowForm(true);
              }}
              style={{ height: "42px" }}
            >
              <FiPlus /> Ajouter
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="card-body mb-4">
          <ProductForm
            show={showForm}
            product={selectedProduct}
            onClose={() => setShowForm(false)}
            onSaved={fetchProducts}
          />
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" />
              <p className="mt-2 mb-0 text-muted">Chargement des produits…</p>
            </div>
          ) : error ? (
            <p className="text-danger p-4">{error}</p>
          ) : (
            <>
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
                    {paginatedProducts.map((p) => (
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
                            <i className="fas fa-pen" aria-hidden="true"></i>
                            <span className="visually-hidden">Modifier</span>
                          </button>
                          <button
                            className="btn btn-sm btn-light border text-danger action-btn"
                            title="Supprimer"
                            onClick={() => deleteProduct(p._id)}
                          >
                            <i className="fas fa-trash" aria-hidden="true"></i>
                            <span className="visually-hidden">Supprimer</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredProducts.length === 0 && !loading && (
                      <tr>
                        <td colSpan="6" className="py-4">
                          <div className="text-center">
                            <p className="text-muted mb-3">Aucun produit trouvé.</p>
                            <button
                              className="btn btn-primary"
                              onClick={() => {
                                setSelectedProduct(null);
                                setShowForm(true);
                              }}
                            >
                              Ajouter un produit
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center align-items-center gap-2 mt-3 mb-2">
                  <button
                    className="pagination-btn"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                  >
                    Préc
                  </button>
                  {[...Array(totalPages)].map((_, idx) => (
                    <button
                      key={idx}
                      className={`pagination-btn ${
                        currentPage === idx + 1 ? "btn-primary" : "btn-outline-primary"
                      }`}
                      onClick={() => setCurrentPage(idx + 1)}
                    >
                      {idx + 1}
                    </button>
                  ))}
                  <button
                    className="pagination-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                  >
                    Suiv
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;

import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../constante";
import ProductForm from "../../components/ProductForm";
import { FiEdit2, FiTrash2, FiSearch, FiPlus } from "react-icons/fi";
import ConfirmModal from "../../components/ConfirmModal";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [targetProductId, setTargetProductId] = useState(null);
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
    try {
      await axios.delete(`${BASE_URL}/api/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression du produit");
    }
  };

  // Handle delete via confirm modal
  const handleDeleteProduct = (productId) => {
    setTargetProductId(productId);
    setConfirmOpen(true);
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
  if (loading) return null;
  if (error) return null;
  return (
    <div className="container mt-4">
         <ProductForm
            show={showForm}
            product={selectedProduct}
            onClose={() => setShowForm(false)}
            onSaved={fetchProducts}
          />
      <div className="card border-0 shadow-sm rounded-4">
        {/* Header */}
        <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
          <div>
            <h5 className="text-dark fw-bold mb-0 d-flex align-items-center gap-2">
              Produits
              <span className="count-pill">
              {filteredProducts.length} {filteredProducts.length === 1 ? "produit" : "produits"}
            </span>

            </h5>
            <small className="text-muted d-none d-md-block">Gérez vos produits, photos, prix et promotions.</small>
          </div>

          <div className="d-flex gap-2 align-items-center mb-3">
          <div className="position-relative w-100 d-none d-md-block">
    <FiSearch
      className="search-icon"
     
    />
    <input
      className="form-control rounded-pill ps-5"
      placeholder="Recherche par nom…"
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
        setCurrentPage(1); // Reset page when searching
      }}
      style={{ height: "42px" }}
    />
  </div>
            <button
              className="btn btn-add-primary  d-flex align-items-center justify-content-center gap-1"
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
        <div className="card-body mb-2">
       
         
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
                            <FiEdit2 size={16} />
                            <span className="visually-hidden">Modifier</span>
                          </button>
                          <button
                            className="btn btn-sm btn-light border text-danger action-btn"
                            title="Supprimer"
                            onClick={() => handleDeleteProduct(p._id)}
                          >
                               <FiTrash2 size={16} />
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
         
        </div>
      </div>
      <ConfirmModal
        open={confirmOpen}
        loading={confirmLoading}
        onConfirm={async () => {
          setConfirmLoading(true);
          await deleteProduct(targetProductId);
          setConfirmLoading(false);
          setConfirmOpen(false);
          setTargetProductId(null);
        }}
        onCancel={() => {
          setConfirmOpen(false);
          setTargetProductId(null);
        }}
      />
    </div>
  );
};

export default Products;

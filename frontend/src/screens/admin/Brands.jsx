import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../constante";
import BrandForm from "../../components/BrandForm";
import { FiEdit2, FiTrash2, FiSearch, FiPlus } from "react-icons/fi";
import ConfirmModal from "../../components/ConfirmModal";
import { toast } from "react-toastify";

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [targetBrandId, setTargetBrandId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchBrands = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.get(`${BASE_URL}/api/brands`);
      setBrands(data);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la récupération des marques.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const deleteBrand = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/brands/${id}`);
      fetchBrands();
      toast.success("Marque supprimée avec succès ✅");
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la suppression de la marque");
    }
  };

  const handleDeleteBrand = (id) => {
    setTargetBrandId(id);
    setConfirmOpen(true);
  };

  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredBrands.length / itemsPerPage);
  const paginatedBrands = filteredBrands.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return null;
  if (error) return null;

  return (
    <div className="container mt-4">
      <BrandForm
        show={showForm}
        brand={selectedBrand}
        onClose={() => setShowForm(false)}
        onSaved={fetchBrands}
      />

      <div className="card border-0 shadow-sm rounded-4 mb-4">
        {/* Header */}
        <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
          <div>
            <h5 className="text-dark fw-bold mb-0 d-flex align-items-center gap-2">
              Marques
              <span className="count-pill">
                {filteredBrands.length} {filteredBrands.length === 1 ? "marque" : "marques"}
              </span>
            </h5>
            <small className="text-muted d-none d-md-block">
              Gérez vos marques et leurs images.
            </small>
          </div>

          <div className="d-flex gap-2 align-items-center mb-3">
            <div className="position-relative w-100 d-none d-md-block">
              <FiSearch className="search-icon" />
              <input
                className="form-control rounded-pill ps-5"
                placeholder="Recherche par nom…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                style={{ height: "42px" }}
              />
            </div>

            <button
              className="btn btn-add-primary d-flex align-items-center justify-content-center gap-1"
              onClick={() => {
                setSelectedBrand(null);
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
          <div className="table-responsive">
            <table className="table table-hover table-sm align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Marque</th>
                  <th>Logo</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedBrands.map((b) => (
                  <tr key={b._id}>
                    <td>{b.name}</td>
                    <td className="text-center">
                      {b.image?.url && (
                        <img
                          src={b.image.url}
                          alt={b.name}
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                            borderRadius: "0.25rem",
                          }}
                        />
                      )}
                    </td>
                    <td className="text-end pe-4">
                      <button
                        className="btn btn-sm btn-light border me-2 action-btn"
                        title="Modifier"
                        onClick={() => {
                          setSelectedBrand(b);
                          setShowForm(true);
                        }}
                      >
                        <FiEdit2 size={16} />
                        <span className="visually-hidden">Modifier</span>
                      </button>
                      <button
                        className="btn btn-sm btn-light border text-danger action-btn"
                        title="Supprimer"
                        onClick={() => handleDeleteBrand(b._id)}
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredBrands.length === 0 && !loading && (
                  <tr>
                    <td colSpan="3" className="py-4">
                      <div className="text-center">
                        <p className="text-muted mb-3">Aucune marque trouvée.</p>
                        <button
                          className="btn btn-primary"
                          onClick={() => {
                            setSelectedBrand(null);
                            setShowForm(true);
                          }}
                        >
                          Ajouter une marque
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
        </div>
      </div>

      <ConfirmModal
        open={confirmOpen}
        loading={confirmLoading}
        onConfirm={async () => {
          setConfirmLoading(true);
          await deleteBrand(targetBrandId);
          setConfirmLoading(false);
          setConfirmOpen(false);
          setTargetBrandId(null);
        }}
        onCancel={() => {
          setConfirmOpen(false);
          setTargetBrandId(null);
        }}
      />
    </div>
  );
};

export default Brands;

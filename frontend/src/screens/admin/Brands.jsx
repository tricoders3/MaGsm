import { useState, useEffect, useRef } from "react";
import axios from "axios";
import BASE_URL from "../../constante";
import { toast } from "react-toastify";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import ConfirmModal from "../../components/ConfirmModal";

const ITEMS_PER_PAGE = 10;

const BrandPage = () => {
  const fileInputRef = useRef(null);
  const [brands, setBrands] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [paginatedBrands, setPaginatedBrands] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);

  const [name, setName] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [targetBrandId, setTargetBrandId] = useState(null);

  // Fetch brands
  const fetchBrands = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/brands`, {
        withCredentials: true,
      });
      setBrands(data);
      setFilteredBrands(data);
      setTotalPages(Math.ceil(data.length / ITEMS_PER_PAGE));
      setPaginatedBrands(data.slice(0, ITEMS_PER_PAGE));
    } catch {
      toast.error("Erreur lors du chargement des marques");
    }
  };
  useEffect(() => {
    fetchBrands();
  }, []);

  // Filter & paginate
  useEffect(() => {
    const filtered = brands.filter((b) =>
      b.name.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredBrands(filtered);
    setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE));
    setPaginatedBrands(
      filtered.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
      )
    );
  }, [search, brands, currentPage]);

  // Open form for edit
  useEffect(() => {
    if (selectedBrand) {
      setName(selectedBrand.name || "");
      setLogoPreview(selectedBrand.logo || null);
      setLogoFile(null);
    }
  }, [selectedBrand]);
  // File change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setLogoFile(file || null);

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setLogoPreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setLogoPreview(selectedBrand?.logo || null);
    }
  };
  const resetForm = () => {
    setShowForm(false);
    setSelectedBrand(null);
    setName("");
    setLogoFile(null);
    setLogoPreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  // Add brand
  const handleAddBrand = async () => {
    if (!name.trim()) return toast.error("Le nom est obligatoire");

    const formData = new FormData();
    formData.append("name", name);
    if (logoFile) formData.append("logo", logoFile);

    try {
      setSubmitLoading(true);
      await axios.post(`${BASE_URL}/api/brands`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Marque ajoutée");
      fetchBrands();
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de l'enregistrement");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Update brand
  const handleUpdateBrand = async () => {
    if (!name.trim()) return toast.error("Le nom est obligatoire");

    const formData = new FormData();
    formData.append("name", name);
    if (logoFile) formData.append("logo", logoFile);

    try {
      setSubmitLoading(true);
      await axios.put(
        `${BASE_URL}/api/brands/${selectedBrand._id}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success("Marque mise à jour");
      fetchBrands();
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de l'enregistrement");
    } finally {
      setSubmitLoading(false);
    }
  };
  // Close form
  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedBrand(null);
    setName("");
    setLogoFile(null);
    setLogoPreview(null);
  };

  // Delete brand
  const handleDeleteBrand = (id) => {
    setConfirmOpen(true);
    setTargetBrandId(id);
  };

  const deleteBrand = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/brands/${id}`, { withCredentials: true });
      toast.success("Marque supprimée ✅");
      fetchBrands();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de la suppression");
    }
  };

  return (
    <div className="container mt-4">
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
              Gérez vos marques et leurs logos.
            </small>
          </div>

          <button
            className="btn btn-add-primary ms-5 ms-md-0"
            onClick={() => {
              setSelectedBrand(null);
              setShowForm(true);
            }}
          >
            Ajouter une marque
          </button>
        </div>

        {/* Body */}
        <div className="card-body mb-2">
          {/* Inline Brand Form */}
          {showForm && (
  <div className="mb-3">
    {/* Inputs */}
    <div className="d-flex gap-2 align-items-center mb-2">
      <input
        className="form-control ps-3"
        placeholder="Nom de la marque"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="file"
        onChange={handleFileChange}
        className="form-control form-control-sm"
        style={{ maxWidth: "400px" }}
      />

      {logoPreview && (
        <img
          src={logoPreview}
          alt="preview"
          style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 6 }}
        />
      )}
    </div>

    {/* Buttons under the inputs, aligned right */}
    <div className="d-flex gap-2 justify-content-end">
    <button
  className="btn btn-primary-redesign btn-sm"
  disabled={submitLoading}
  onClick={selectedBrand ? handleUpdateBrand : handleAddBrand}
>
  {submitLoading && (
    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
  )}
  {submitLoading ? "Enregistrement" : "Enregistrer"}
</button>


      <button className="btn btn-outline-secondary btn-sm" onClick={handleCloseForm}>
        Annuler
      </button>
    </div>
  </div>
)}


          {/* Brand list */}
          <ul className="list-group list-group-flush">
            {paginatedBrands.map((b) => (
              <li
                key={b._id}
                className="list-group-item d-flex justify-content-between align-items-center shadow-sm rounded-3 mb-2"
              >
                <div className="d-flex align-items-center gap-2">
                  {b.logo && (
                    <img
                      src={b.logo}
                      alt={b.name}
                      style={{ width: 50, height: 50, borderRadius: 6, objectFit: "cover" }}
                    />
                  )}
                  <span className="fw-medium">{b.name}</span>
                </div>

                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-light border action-btn"
                    title="Modifier"
                    onClick={() => {
                      setSelectedBrand(b);
                      setShowForm(true);
                    }}
                  >
                    <FiEdit2 size={16} />
                  </button>

                  <button
                    className="btn btn-sm btn-light border text-danger action-btn"
                    title="Supprimer"
                    onClick={() => handleDeleteBrand(b._id)}
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
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

export default BrandPage;

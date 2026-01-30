import { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../constante";
import { toast } from "react-toastify";

const BrandForm = ({ show, onClose, onSaved, brand }) => {
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (brand) {
      setName(brand.name || "");
      setImagePreview(brand.image?.url || null);
      setImageFile(null);
    } else {
      setName("");
      setImagePreview(null);
      setImageFile(null);
    }
  }, [brand]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(brand?.image?.url || null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Le nom est obligatoire");

    const formData = new FormData();
    formData.append("name", name);
    if (imageFile) formData.append("image", imageFile);

    try {
      setLoading(true);

      if (brand) {
        // Update
        await axios.put(`${BASE_URL}/api/brands/${brand._id}`, formData, {
          withCredentials: true,
        });
        toast.success("Marque mise à jour ✅");
      } else {
        // Create
        await axios.post(`${BASE_URL}/api/brands`, formData, {
          withCredentials: true,
        });
        toast.success("Marque ajoutée ✅");
      }

      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-dialog">
        <div className="modal-content p-4">
          <h5 className="mb-3">{brand ? "Modifier la marque" : "Ajouter une marque"}</h5>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nom de la marque</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nom"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Logo (optionnel)</label>
              <input type="file" accept="image/*" onChange={handleFileChange} />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="preview"
                  className="mt-2"
                  style={{ width: 80, height: 80, objectFit: "contain", borderRadius: 4 }}
                />
              )}
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Annuler
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Enregistrement..." : brand ? "Modifier" : "Ajouter"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BrandForm;

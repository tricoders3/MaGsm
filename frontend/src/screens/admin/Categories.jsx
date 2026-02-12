import { useEffect, useState } from "react";
import axios from "axios";
import { FiEdit2, FiTrash2, FiSearch, FiList } from "react-icons/fi";
import BASE_URL from "../../constante";
import ConfirmModal from "../../components/ConfirmModal";

const Categories = () => {
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categorySaving, setCategorySaving] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [subName, setSubName] = useState("");
  const [subEditId, setSubEditId] = useState(null);
  const [showSubCategoryForm, setShowSubCategoryForm] = useState(false);
  const [subCategorySaving, setSubCategorySaving] = useState(false);

  // Confirm modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState({ type: null, id: null });

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/categories`);
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Add new category with image
  const addCategory = async () => {
    if (!name || !imageFile) return;
    try {
      setCategorySaving(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("image", imageFile);

      await axios.post(`${BASE_URL}/api/categories`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setName("");
      setImageFile(null);
      setEditId(null);
      setShowCategoryForm(false);
      fetchCategories();
    } catch (error) {
      console.error(error);
    } finally {
      setCategorySaving(false);
    }
  };

  // Update category (name + optional new image)
  const updateCategory = async (id) => {
    if (!name) return;
    try {
      setCategorySaving(true);
      const formData = new FormData();
      formData.append("name", name);
      if (imageFile) formData.append("image", imageFile);

      await axios.put(`${BASE_URL}/api/categories/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setName("");
      setImageFile(null);
      setEditId(null);
      setShowCategoryForm(false);
      fetchCategories();
    } catch (error) {
      console.error(error);
    } finally {
      setCategorySaving(false);
    }
  };

  const deleteCategory = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/categories/${id}`);
      fetchCategories();
    } catch (error) {
      console.error(error);
    }
  };

  // SubCategory logic remains the same
  const fetchSubCategories = async (categoryId) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/categories/${categoryId}/subcategories`);
      setSubCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  const addSubCategory = async () => {
    if (!subName || !selectedCategory) return;
    try {
      setSubCategorySaving(true);
      await axios.post(`${BASE_URL}/api/categories/${selectedCategory}/subcategory`, { name: subName });
      setSubName("");
      setSubEditId(null);
      setShowSubCategoryForm(false);
      fetchSubCategories(selectedCategory);
    } catch (error) {
      console.error(error);
    } finally {
      setSubCategorySaving(false);
    }
  };

  const updateSubCategory = async () => {
    if (!subName || !selectedCategory || !subEditId) return;
    try {
      setSubCategorySaving(true);
      await axios.delete(`${BASE_URL}/api/categories/${selectedCategory}/subcategories/${subEditId}`);
      await axios.post(`${BASE_URL}/api/categories/${selectedCategory}/subcategory`, { name: subName });
      setSubName("");
      setSubEditId(null);
      setShowSubCategoryForm(false);
      fetchSubCategories(selectedCategory);
    } catch (error) {
      console.error(error);
    } finally {
      setSubCategorySaving(false);
    }
  };

  const deleteSubCategory = async (subId) => {
    try {
      await axios.delete(`${BASE_URL}/api/categories/${selectedCategory}/subcategories/${subId}`);
      fetchSubCategories(selectedCategory);
    } catch (error) {
      console.error(error);
    }
  };

  // Open confirm for category deletion
  const handleConfirmDeleteCategory = (id) => {
    setConfirmTarget({ type: "category", id });
    setConfirmOpen(true);
  };

  // Open confirm for subcategory deletion
  const handleConfirmDeleteSubcategory = (id) => {
    setConfirmTarget({ type: "subcategory", id });
    setConfirmOpen(true);
  };

  // Perform deletion after confirmation
  const performConfirm = async () => {
    try {
      setConfirmLoading(true);
      if (confirmTarget.type === "category" && confirmTarget.id) {
        await deleteCategory(confirmTarget.id);
      } else if (confirmTarget.type === "subcategory" && confirmTarget.id) {
        await deleteSubCategory(confirmTarget.id);
      }
      setConfirmOpen(false);
      setConfirmTarget({ type: null, id: null });
    } catch (e) {
      // already logged inside delete functions
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleEditCategory = (cat) => {
    setEditId(cat._id);
    setName(cat.name);
    setShowCategoryForm(true);
  };

  const handleEditSub = (sc) => {
    setSubEditId(sc._id);
    setSubName(sc.name);
    setShowSubCategoryForm(true);
  };

  const handleSub = (catId) => {
    setSelectedCategory(catId);
    fetchSubCategories(catId);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="container mt-4">
      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-header bg-white border-0">
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <h4 className="mb-0">Categories</h4>
            
            <span className="count-pill">
              {categories.length} {categories.length === 1 ? "catégorie" : "catégories"}
            </span>
          </div>
          <small className="text-muted d-none d-md-block mb-2">Gérez les catégories principales de la boutique</small>
          <button className="btn btn-primary d-inline-flex align-items-center gap-2 mt-2" onClick={() => { setShowCategoryForm(true); setEditId(null); setName(""); setImageFile(null); }}>
             Ajouter
          </button>
        </div>
    <ConfirmModal
      open={confirmOpen}
      title="Confirmer la suppression"
      description="Voulez-vous vraiment supprimer cet élément ?"
      confirmText="Supprimer"
      cancelText="Annuler"
      loading={confirmLoading}
      danger
      onConfirm={performConfirm}
      onCancel={() => {
        if (!confirmLoading) {
          setConfirmOpen(false);
          setConfirmTarget({ type: null, id: null });
        }
      }}
    />

        <div className="card-body">
          {/* Input Category Form */}
          {showCategoryForm && (
             <div className="d-flex gap-2 align-items-center mb-2">
              <input
                className="form-control  ps-3"
                placeholder="Category name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            
              />
              <input
                type="file"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="form-control form-control-sm"
              />

              {editId ? (
                <button className="btn btn-primary-redesign btn-sm" disabled={categorySaving} onClick={() => updateCategory(editId)}>
                  {categorySaving ? <span className="spinner-border spinner-border-sm me-1" /> : null}
                  Enregistrer
                </button>
              ) : (
                <button className="btn btn-primary-redesign btn-sm" disabled={categorySaving} onClick={addCategory}>
                  {categorySaving ? <span className="spinner-border spinner-border-sm me-1" /> : null}
                  Enregistrer
                </button>
              )}
              <button className="btn btn-outline-secondary btn-sm" onClick={() => { setShowCategoryForm(false); setEditId(null); setName(""); setImageFile(null); }}>
                Annuler
              </button>
            </div>
          )}

          {/* Categories List */}
          <ul className="list-group list-group-flush">
            {categories.map((cat) => (
              <li key={cat._id} className="list-group-item d-flex justify-content-between align-items-center shadow-sm rounded-3 mb-2">
                <div className="d-flex align-items-center gap-2">
                  {cat.image && (
                    <img src={cat.image} alt={cat.name} style={{ width: 50, height: 50, borderRadius: 6 }} />
                  )}
                  <span>{cat.name}</span>
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-light border action-btn" onClick={() => handleEditCategory(cat)}>
                  <FiEdit2 size={16} />
                  </button>
                  <button className="btn btn-sm btn-light border action-btn text-danger" onClick={() => handleConfirmDeleteCategory(cat._id)}>
                  <FiTrash2 size={16} />
                  </button>
                  <button className="btn btn-sm btn-light border action-btn" onClick={() => handleSub(cat._id)}>
                    
                  <FiList  size={16}/>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* SubCategories */}
      {selectedCategory && (
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-header bg-white border-0">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Subcategories</h5>
              
              <span className="count-pill">{subCategories.length} subcategories</span>
            </div>
            <small className="text-muted d-none d-md-block mb-2">Ajoutez ou modifiez les sous-catégories pour cette catégorie</small>
            <button className="btn btn-primary d-inline-flex align-items-center gap-2 mt-2" onClick={() => { setShowSubCategoryForm(true); setSubEditId(null); setSubName(""); }}>
              Ajouter
            </button>
          </div>

          <div className="card-body">
            {/* SubCategory Form */}
            {showSubCategoryForm && (
              <div className="d-flex mb-3 gap-2">
                <input
                  className="form-control ps-3"
                  placeholder="Subcategory name"
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
               
                />
                {subEditId ? (
                  <button className="btn btn-primary-redesign btn-sm d-inline-flex align-items-center gap-2" disabled={subCategorySaving} onClick={updateSubCategory}>
                    {subCategorySaving ? <span className="spinner-border spinner-border-sm me-1" /> : null}
                    Enregistrer
                  </button>
                ) : (
                  <button className="btn btn-primary-redesign btn-sm d-inline-flex align-items-center gap-2" disabled={subCategorySaving} onClick={addSubCategory}>
                    {subCategorySaving ? <span className="spinner-border spinner-border-sm me-1" /> : null}
                    Enregistrer
                  </button>
                )}
                <button className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-2" onClick={() => { setShowSubCategoryForm(false); setSubEditId(null); setSubName(""); }}>
                  Annuler
                </button>
              </div>
            )}

            <ul className="list-group list-group-flush">
              {subCategories.map((sc) => (
                <li key={sc._id} className="list-group-item d-flex justify-content-between align-items-center shadow-sm rounded-3 mb-2">
                  <span>{sc.name}</span>
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-light border action-btn" onClick={() => handleEditSub(sc)}>
                    <FiEdit2 size={16} />
                    </button>
                    <button className="btn btn-sm btn-light border text-danger action-btn" onClick={() => handleConfirmDeleteSubcategory(sc._id)}>
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;

import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../constante";

const Categories = () => {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [subName, setSubName] = useState("");
  const [subEditId, setSubEditId] = useState(null);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/categories`);
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  const addCategory = async () => {
    if (!name) return;
    try {
      await axios.post(`${BASE_URL}/api/categories`, { name });
      setName("");
      fetchCategories();
    } catch (error) {
      console.error(error);
    }
  };

  const updateCategory = async (id) => {
    if (!name) return;
    try {
      await axios.put(`${BASE_URL}/api/categories/${id}`, { name });
      setName("");
      setEditId(null);
      fetchCategories();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Supprimer cette catégorie ?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/categories/${id}`);
      fetchCategories();
    } catch (error) {
      console.error(error);
    }
  };

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
      await axios.post(`${BASE_URL}/api/categories/${selectedCategory}/subcategory`, { name: subName });
      setSubName("");
      setSubEditId(null);
      fetchSubCategories(selectedCategory);
    } catch (error) {
      console.error(error);
    }
  };

  const updateSubCategory = async () => {
    if (!subName || !selectedCategory || !subEditId) return;
    try {
      await axios.delete(`${BASE_URL}/api/categories/${selectedCategory}/subcategories/${subEditId}`);
      await axios.post(`${BASE_URL}/api/categories/${selectedCategory}/subcategory`, { name: subName });
      setSubName("");
      setSubEditId(null);
      fetchSubCategories(selectedCategory);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteSubCategory = async (subId) => {
    if (!window.confirm("Supprimer cette sous-catégorie ?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/categories/${selectedCategory}/subcategories/${subId}`);
      fetchSubCategories(selectedCategory);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditCategory = (cat) => {
    setEditId(cat._id);
    setName(cat.name);
  };

  const handleEditSub = (sc) => {
    setSubEditId(sc._id);
    setSubName(sc.name);
  };

  const handleSub = (catId) => {
    setSelectedCategory(catId);
    fetchSubCategories(catId);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
<div className="container py-4">
  <div className="card border-0 shadow-sm rounded-4 mb-4">
    <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
      <h4 className="mb-0">Catégories</h4>
      <span className="badge bg-primary-soft">{categories.length} catégories</span>
    </div>

    <div className="card-body">
      {/* Input Category */}
      <div className="d-flex mb-3 gap-2">
        <input
          className="form-control rounded-pill ps-3"
          placeholder="Nom catégorie"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ height: "40px" }}
        />
        {editId ? (
          <button
            className="btn btn-success btn-pill shadow-sm"
            style={{ height: "40px" }}
            onClick={() => updateCategory(editId)}
            title="Modifier"
          >
            <i className="fas fa-pen"></i> Modifier
          </button>
        ) : (
          <button
            className="btn btn-primary btn-pill shadow-sm"
            style={{ height: "40px" }}
            onClick={addCategory}
            title="Ajouter"
          >
            <i className="fas fa-plus"></i> Ajouter
          </button>
        )}
      </div>

      {/* Categories List */}
      <ul className="list-group list-group-flush">
        {categories.map((cat) => (
          <li
            key={cat._id}
            className="list-group-item d-flex justify-content-between align-items-center shadow-sm rounded-3 mb-2"
          >
            <span>{cat.name}</span>
            <div className="d-flex gap-2">
  <button
    className="btn btn-sm btn-light border action-btn"
    onClick={() => handleEditCategory(cat)}
    title="Modifier"
  >
    <i className="fas fa-pen"></i>
  </button>
  <button
    className="btn btn-sm btn-light border action-btn text-danger"
    onClick={() => deleteCategory(cat._id)}
    title="Supprimer"
  >
    <i className="fas fa-trash"></i>
  </button>
  <button
    className="btn btn-sm btn-light border action-btn"
    onClick={() => handleSub(cat._id)}
    title="Gérer Sub"
  >
    <i className="fas fa-list"></i>
  </button>
</div>

          </li>
        ))}
      </ul>
    </div>
  </div>

  {/* SubCategories */}
  {selectedCategory && (
    <div className="card border-0 shadow-sm rounded-4">
      <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Sous-catégories de {selectedCategory.name}</h5>
        <span className="badge bg-info-soft">{subCategories.length} sous-catégories</span>
      </div>

      <div className="card-body">
        <div className="d-flex mb-3 gap-2">
          <input
            className="form-control rounded-pill ps-3"
            placeholder="Nom sous-catégorie"
            value={subName}
            onChange={(e) => setSubName(e.target.value)}
            style={{ height: "40px" }}
          />
          {subEditId ? (
            <button
              className="btn btn-success btn-pill shadow-sm"
              style={{ height: "40px" }}
              onClick={updateSubCategory}
              title="Modifier Sub"
            >
              <i className="fas fa-pen"></i> Modifier
            </button>
          ) : (
            <button
              className="btn btn-primary btn-pill shadow-sm"
              style={{ height: "40px" }}
              onClick={addSubCategory}
              title="Ajouter Sub"
            >
              <i className="fas fa-plus"></i> Ajouter
            </button>
          )}
        </div>

        <ul className="list-group list-group-flush">
          {subCategories.map((sc) => (
            <li
              key={sc._id}
              className="list-group-item d-flex justify-content-between align-items-center shadow-sm rounded-3 mb-2"
            >
              <span>{sc.name}</span>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-sm btn-outline-warning"
                  onClick={() => handleEditSub(sc)}
                  title="Modifier"
                >
                  <i className="fas fa-pen"></i>
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => deleteSubCategory(sc._id)}
                  title="Supprimer"
                >
                  <i className="fas fa-trash"></i>
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

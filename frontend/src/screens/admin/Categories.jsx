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
    <div className="container">
      <h4>Catégories</h4>
      {/* Input Category */}
      <div className="input-group mb-3">
        <input
          className="form-control w-100"
          placeholder="Nom catégorie"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ height: "38px" }}
        />
        {editId ? (
          <button className="btn btn-success" style={{ height: "38px" }} onClick={() => updateCategory(editId)} title="Modifier">
            <i className="fas fa-pen"></i>
          </button>
        ) : (
          <button className="btn btn-primary" style={{ height: "38px" }} onClick={addCategory} title="Ajouter">
            Ajoute
          </button>
        )}
      </div>

      {/* Categories List */}
      <ul className="list-group mb-4">
        {categories.map((cat) => (
          <li key={cat._id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{cat.name}</span>
            <div>
              <button className="btn btn-sm btn-warning me-2" onClick={() => handleEditCategory(cat)} title="Modifier">
                <i className="fas fa-pen"></i>
              </button>
              <button className="btn btn-sm btn-danger me-2" onClick={() => deleteCategory(cat._id)} title="Supprimer">
                <i className="fas fa-trash"></i>
              </button>
              <button className="btn btn-sm btn-info" onClick={() => handleSub(cat._id)} title="Gérer Sub">
                <i className="fas fa-list"></i>
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* SubCategories */}
      {selectedCategory && (
        <div>
          <h5>Sous-catégories</h5>
          <div className="d-flex mb-3">
            <input
              className="form-control me-2"
              placeholder="Nom sous-catégorie"
              value={subName}
              onChange={(e) => setSubName(e.target.value)}
              style={{ height: "38px" }}
            />
            {subEditId ? (
              <button className="btn btn-success" style={{ height: "38px" }} onClick={updateSubCategory} title="Modifier Sub">
                <i className="fas fa-pen"></i>
              </button>
            ) : (
              <button className="btn btn-primary" style={{ height: "38px" }} onClick={addSubCategory} title="Ajouter Sub">
               Ajoute
              </button>
            )}
          </div>

          <ul className="list-group">
            {subCategories.map((sc) => (
              <li key={sc._id} className="list-group-item d-flex justify-content-between align-items-center">
                <span>{sc.name}</span>
                <div>
                  <button className="btn btn-sm btn-warning me-2" onClick={() => handleEditSub(sc)} title="Modifier">
                    <i className="fas fa-pen"></i>
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => deleteSubCategory(sc._id)} title="Supprimer">
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Categories;

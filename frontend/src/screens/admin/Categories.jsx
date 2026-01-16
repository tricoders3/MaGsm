import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../constante";

const Categories = () => {
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [subName, setSubName] = useState("");
  const [subEditId, setSubEditId] = useState(null);

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
      const formData = new FormData();
      formData.append("name", name);
      formData.append("image", imageFile);

      await axios.post(`${BASE_URL}/api/categories`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setName("");
      setImageFile(null);
      fetchCategories();
    } catch (error) {
      console.error(error);
    }
  };

  // Update category (name + optional new image)
  const updateCategory = async (id) => {
    if (!name) return;
    try {
      const formData = new FormData();
      formData.append("name", name);
      if (imageFile) formData.append("image", imageFile);

      await axios.put(`${BASE_URL}/api/categories/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setName("");
      setImageFile(null);
      setEditId(null);
      fetchCategories();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;
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
    if (!window.confirm("Delete this subcategory?")) return;
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
          <h4 className="mb-0">Categories</h4>
          <span className="badge bg-primary-soft">{categories.length} categories</span>
        </div>

        <div className="card-body">
          {/* Input Category */}
          <div className="d-flex mb-3 gap-2 align-items-center">
            <input
              className="form-control rounded-pill ps-3"
              placeholder="Category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ height: "40px" }}
            />
            <input
              type="file"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="form-control form-control-sm"
            />

            {editId ? (
              <button className="btn btn-add-primary d-inline-flex align-items-center gap-2"
                      onClick={() => updateCategory(editId)}>
                <i className="fas fa-pen"></i> Update
              </button>
            ) : (
              <button className="btn btn-add-primary d-inline-flex align-items-center gap-2"
                      onClick={addCategory}>
                <i className="fas fa-plus"></i> Add
              </button>
            )}
          </div>

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
                    <i className="fas fa-pen"></i>
                  </button>
                  <button className="btn btn-sm btn-light border action-btn text-danger" onClick={() => deleteCategory(cat._id)}>
                    <i className="fas fa-trash"></i>
                  </button>
                  <button className="btn btn-sm btn-light border action-btn" onClick={() => handleSub(cat._id)}>
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
            <h5 className="mb-0">Subcategories</h5>
            <span className="badge bg-info-soft">{subCategories.length} subcategories</span>
          </div>

          <div className="card-body">
            <div className="d-flex mb-3 gap-2">
              <input
                className="form-control rounded-pill ps-3"
                placeholder="Subcategory name"
                value={subName}
                onChange={(e) => setSubName(e.target.value)}
                style={{ height: "40px" }}
              />
              {subEditId ? (
                <button className="btn btn-add-primary d-inline-flex align-items-center gap-2"
                        onClick={updateSubCategory}>
                  <i className="fas fa-pen"></i> Update
                </button>
              ) : (
                <button className="btn btn-add-primary d-inline-flex align-items-center gap-2"
                        onClick={addSubCategory}>
                  <i className="fas fa-plus"></i> Add
                </button>
              )}
            </div>

            <ul className="list-group list-group-flush">
              {subCategories.map((sc) => (
                <li key={sc._id} className="list-group-item d-flex justify-content-between align-items-center shadow-sm rounded-3 mb-2">
                  <span>{sc.name}</span>
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-light border action-btn" onClick={() => handleEditSub(sc)}>
                      <i className="fas fa-pen"></i>
                    </button>
                    <button className="btn btn-sm btn-light border action-btn text-danger" onClick={() => deleteSubCategory(sc._id)}>
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

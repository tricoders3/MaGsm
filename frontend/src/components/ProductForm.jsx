import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../constante";

const ProductForm = ({ show, onClose, onSaved, product }) => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [name, setName] = useState("");
  const [model, setModel] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [description, setDescription] = useState("");

  const [price, setPrice] = useState("");
  const [countInStock, setCountInStock] = useState("");

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // ---------------- FETCH CATEGORIES ----------------
  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await axios.get(`${BASE_URL}/api/categories`);
      setCategories(data);
    };
    fetchCategories();
  }, []);

  // ---------------- SUBCATEGORIES ----------------
  useEffect(() => {
    if (category) {
      const cat = categories.find((c) => c._id === category);
      setSubCategories(cat?.subCategories || []);
    }
  }, [category, categories]);

  // ---------------- EDIT MODE ----------------
  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setModel(product.model || "");
      setBrand(product.brand || "");
      setCategory(product.category?._id || product.category || "");
      setSubCategory(product.subCategory || "");
      setDescription(product.description || "");
      setPrice(product.price || "");
      setCountInStock(product.countInStock || "");
      setImagePreview(product.images?.[0]?.url || null);
    }
  }, [product]);

  if (!show) return null;

  // ---------------- IMAGE HANDLER ----------------
  const imageChangeHandler = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // ---------------- SUBMIT ----------------
  const submitHandler = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("model", model);
    formData.append("brand", brand);
    formData.append("category", category);
    formData.append("subCategory", subCategory);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("countInStock", countInStock);

     if (imageFile) formData.append("image", imageFile);

    if (product) {
      await axios.put(
        `${BASE_URL}/api/products/${product._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
    } else {
      await axios.post(
        `${BASE_URL}/api/products`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
    }

    onSaved();
    onClose();
  };

  return (
    <div className="card border-0 shadow-sm rounded-4 mb-4">
      <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
        <h5 className="mb-0 fw-semibold">{product ? "Modifier produit" : "Ajouter produit"}</h5>
        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={onClose}>Fermer</button>
      </div>

      <div className="card-body">
        <div className="row g-3">
          {/* BASIC INFO */}
          <div className="col-12 col-md-4">
            <label className="form-label">Nom</label>
            <input className="form-control" placeholder="Nom" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label">Modèle</label>
            <input className="form-control" placeholder="Modèle" value={model} onChange={e => setModel(e.target.value)} />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label">Marque</label>
            <input className="form-control" placeholder="Marque" value={brand} onChange={e => setBrand(e.target.value)} />
          </div>

          {/* CATEGORY */}
          <div className="col-12 col-md-6">
            <label className="form-label">Catégorie</label>
            <select className="form-select" value={category} onChange={e => { setCategory(e.target.value); setSubCategory(""); }}>
              <option value="">Choisir catégorie</option>
              {categories.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">Sous-catégorie</label>
            <select className="form-select" value={subCategory} onChange={e => setSubCategory(e.target.value)} disabled={!category}>
              <option value="">Choisir sous-catégorie</option>
              {subCategories.map(sc => (
                <option key={sc._id} value={sc._id}>{sc.name}</option>
              ))}
            </select>
          </div>

          {/* DESCRIPTION */}
          <div className="col-12">
            <label className="form-label">Description</label>
            <textarea className="form-control" rows={4} placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
          </div>

          {/* IMAGE */}
          <div className="col-12 col-md-6">
            <label className="form-label">Image du produit</label>
            <input type="file" className="form-control" accept="image/*" onChange={imageChangeHandler} />
          </div>
          {imagePreview && (
            <div className="col-12 col-md-6 d-flex align-items-end">
              <img src={imagePreview} alt="preview" style={{ width: "120px", height: "120px", objectFit: "cover" }} className="rounded" />
            </div>
          )}

          {/* PRICE & STOCK */}
          <div className="col-12 col-md-6">
            <label className="form-label">Prix (TND)</label>
            <input className="form-control" type="number" placeholder="Prix" value={price} onChange={e => setPrice(e.target.value)} />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">Stock</label>
            <input className="form-control" type="number" placeholder="Stock" value={countInStock} onChange={e => setCountInStock(e.target.value)} />
          </div>
        </div>

        <div className="d-flex justify-content-end gap-2 mt-4">
          <button className="btn btn-outline-secondary" onClick={onClose}>Annuler</button>
          <button className="btn btn-primary-redesign" onClick={submitHandler}>{product ? "Mettre à jour" : "Créer"}</button>
        </div>
      
      </div>
    </div>
  );
};

export default ProductForm;

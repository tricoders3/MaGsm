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

    if (imageFile) {
      formData.append("image", imageFile); // ⚠️ نفس الاسم في backend
    }

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
    <div className="card card-body mb-4">
      <h5 className="mb-3">
        {product ? "Modifier produit" : "Ajouter produit"}
      </h5>

      {/* BASIC INFO */}
      <div className="d-flex gap-2 mb-2">
        <input className="form-control" placeholder="Nom" value={name} onChange={e => setName(e.target.value)} />
        <input className="form-control" placeholder="Model" value={model} onChange={e => setModel(e.target.value)} />
        <input className="form-control" placeholder="Brand" value={brand} onChange={e => setBrand(e.target.value)} />
      </div>

      {/* CATEGORY */}
      <div className="d-flex gap-2 mb-2">
        <select className="form-select" value={category} onChange={e => {
          setCategory(e.target.value);
          setSubCategory("");
        }}>
          <option value="">Choisir catégorie</option>
          {categories.map(c => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>

        <select
          className="form-select"
          value={subCategory}
          onChange={e => setSubCategory(e.target.value)}
          disabled={!category}
        >
          <option value="">Choisir sous-catégorie</option>
          {subCategories.map(sc => (
            <option key={sc._id} value={sc._id}>{sc.name}</option>
          ))}
        </select>
      </div>

      {/* DESCRIPTION */}
      <textarea
        className="form-control mb-2"
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />

      {/* IMAGE */}
      <input
        type="file"
        className="form-control mb-2"
        accept="image/*"
        onChange={imageChangeHandler}
      />

      {imagePreview && (
        <img
          src={imagePreview}
          alt="preview"
          style={{ width: "120px", height: "120px", objectFit: "cover" }}
          className="mb-2 rounded"
        />
      )}

      {/* PRICE & ACTION */}
      <div className="d-flex gap-2">
        <input className="form-control" type="number" placeholder="Prix" value={price} onChange={e => setPrice(e.target.value)} />
        <input className="form-control" type="number" placeholder="Stock" value={countInStock} onChange={e => setCountInStock(e.target.value)} />

        <button className="btn btn-success" onClick={submitHandler}>
          {product ? "Mettre à jour" : "Créer"}
        </button>

        <button className="btn btn-secondary" onClick={onClose}>
          Annuler
        </button>
      </div>
    </div>
  );
};

export default ProductForm;

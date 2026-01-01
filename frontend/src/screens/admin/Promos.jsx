import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../constante";

const Promotions = () => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [productsWithPromo, setProductsWithPromo] = useState([]);

  const [form, setForm] = useState({
    name: "",
    discountType: "percentage",
    discountValue: "",
    category: "",
    subCategory: "",
    startDate: "",
    endDate: "",
  });

  const [editingPromoId, setEditingPromoId] = useState(null);

  /* ---------------- FETCH DATA ---------------- */

  const fetchCategories = async () => {
    const { data } = await axios.get(`${BASE_URL}/api/categories`);
    setCategories(data);
  };

  const fetchSubCategories = async (categoryId) => {
    if (!categoryId) return setSubCategories([]);
    const { data } = await axios.get(
      `${BASE_URL}/api/categories/${categoryId}/subcategories`
    );
    setSubCategories(data);
  };

  const fetchPromotions = async () => {
    const { data } = await axios.get(`${BASE_URL}/api/promotions`);
    setPromotions(data);
  };

  const fetchProductsWithPromo = async () => {
    const { data } = await axios.get(`${BASE_URL}/api/promotions/promos`);
    setProductsWithPromo(data);
  };

  useEffect(() => {
    fetchCategories();
    fetchPromotions();
    fetchProductsWithPromo();
  }, []);

  useEffect(() => {
    fetchSubCategories(form.category);
    setForm({ ...form, subCategory: "" });
    // eslint-disable-next-line
  }, [form.category]);

  /* ---------------- FORM HANDLERS ---------------- */

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitHandler = async () => {
    if (!form.name || !form.discountValue || !form.startDate || !form.endDate) {
      alert("All required fields must be filled");
      return;
    }

    const payload = {
      ...form,
      discountValue: Number(form.discountValue),
    };

    try {
      if (editingPromoId) {
        await axios.put(
          `${BASE_URL}/api/promotions/${editingPromoId}`,
          payload
        );
        alert("Promotion updated");
      } else {
        await axios.post(`${BASE_URL}/api/promotions/apply`, payload);
        alert("Promotion created");
      }

      setEditingPromoId(null);
      setForm({
         name: form.name,
  discountType: form.discountType,
  discountValue: Number(form.discountValue),
  category: form.category || null,
  subCategory: form.subCategory || null,
  startDate: form.startDate,
  endDate: form.endDate,
      });

      fetchPromotions();
      fetchProductsWithPromo();
    } catch (error) {
      console.error(error);
      alert("Error saving promotion");
    }
  };

  const editPromotion = (promo) => {
    setEditingPromoId(promo._id);
    setForm({
      name: promo.name,
      discountType: promo.discountType,
      discountValue: promo.discountValue,
      category: promo.category || "",
      subCategory: promo.subCategory || "",
      startDate: promo.startDate.slice(0, 10),
      endDate: promo.endDate.slice(0, 10),
    });
  };

  const deletePromotion = async (id) => {
    if (!window.confirm("Delete this promotion?")) return;
    await axios.delete(`${BASE_URL}/api/promotions/${id}`);
    fetchPromotions();
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="container mt-4">
      <h3>Promotions Management</h3>

      {/* FORM */}
      <div className="card p-3 mb-4">
        <input
          className="form-control mb-2"
          placeholder="Promotion name"
          name="name"
          value={form.name}
          onChange={handleChange}
        />

        <select
          className="form-select mb-2"
          name="discountType"
          value={form.discountType}
          onChange={handleChange}
        >
          <option value="percentage">Percentage</option>
          <option value="fixed">Fixed</option>
        </select>

        <input
          type="number"
          className="form-control mb-2"
          placeholder="Discount value"
          name="discountValue"
          value={form.discountValue}
          onChange={handleChange}
        />

        <select
          className="form-select mb-2"
          name="category"
          value={form.category}
          onChange={handleChange}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          className="form-select mb-2"
          name="subCategory"
          value={form.subCategory}
          onChange={handleChange}
          disabled={!form.category}
        >
          <option value="">All sub-categories</option>
          {subCategories.map((sc) => (
            <option key={sc._id} value={sc._id}>
              {sc.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          className="form-control mb-2"
          name="startDate"
          value={form.startDate}
          onChange={handleChange}
        />
        <input
          type="date"
          className="form-control mb-2"
          name="endDate"
          value={form.endDate}
          onChange={handleChange}
        />

        <button className="btn btn-success" onClick={submitHandler}>
          {editingPromoId ? "Update Promotion" : "Create Promotion"}
        </button>
      </div>

      {/* PROMOTIONS LIST */}
      <h4>Promotions List</h4>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Discount</th>
            <th>Period</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {promotions.map((p) => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>
                {p.discountValue}{" "}
                {p.discountType === "percentage" ? "%" : "TND"}
              </td>
              <td>
                {new Date(p.startDate).toLocaleDateString()} →{" "}
                {new Date(p.endDate).toLocaleDateString()}
              </td>
              <td>
                <button
                  className="btn btn-sm btn-primary me-2"
                  onClick={() => editPromotion(p)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => deletePromotion(p._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

     {/* PRODUCTS */}
<h4>Products with Promotion</h4>
<table className="table table-bordered">
  <thead>
    <tr>
      <th>Product</th>
      <th>Original</th>
      <th>Promo Price</th>
      
      <th>Promotion</th>
    </tr>
  </thead>
  <tbody>
    {productsWithPromo.map((p) => (
      <tr key={p._id}>
        <td>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {p.image && (
              <img
                src={p.image}
                alt={p.name}
                style={{ width: "50px", height: "50px", objectFit: "cover" }}
              />
            )}
            <span>{p.name}</span>
          </div>
        </td>
        <td>{p.originalPrice.toFixed(2)} TND</td>
        <td>{p.discountedPrice.toFixed(2)} TND</td>
       
        <td>{p.promotion?.name || "-"}</td>
      </tr>
    ))}
  </tbody>
</table>

    </div>
  );
};

export default Promotions;

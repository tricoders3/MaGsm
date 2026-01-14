import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../constante";

const Promotions = () => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [productsWithPromo, setProductsWithPromo] = useState([]);
  const [showForm, setShowForm] = useState(false);


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

 

  return (
    <div className="container mt-4">
      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
          <div>
            <h5 className="text-dark fw-bold mb-0">Promotions</h5>
            <small className="text-muted">Gérez les promotions actives et leurs remises.</small>
          </div>
          <div>
            <button
              className="btn btn-primary"
              onClick={() => {
                setShowForm(true);
                setEditingPromoId(null);
                setForm({
                  name: "",
                  discountType: "percentage",
                  discountValue: "",
                  category: "",
                  subCategory: "",
                  startDate: "",
                  endDate: "",
                });
              }}
            >
              + Create Promotion
            </button>
          </div>
        </div>
      </div>
  {showForm && (

     <div className="card shadow-sm border-0 mb-4">
  <div className="card-body">
    <h5 className="fw-semibold mb-3">
      {editingPromoId ? "Edit Promotion" : "Create Promotion"}
    </h5>

    <div className="row g-3">
      {/* Name */}
      <div className="col-md-6">
        <label className="form-label">Promotion Name</label>
        <input
          className="form-control"
          placeholder="Summer Sale"
          name="name"
          value={form.name}
          onChange={handleChange}
        />
      </div>

      {/* Discount Type */}
      <div className="col-md-3">
        <label className="form-label">Discount Type</label>
        <select
          className="form-select"
          name="discountType"
          value={form.discountType}
          onChange={handleChange}
        >
          <option value="percentage">Percentage (%)</option>
          <option value="fixed">Fixed (TND)</option>
        </select>
      </div>

      {/* Discount Value */}
      <div className="col-md-3">
        <label className="form-label">Value</label>
        <input
          type="number"
          className="form-control"
          placeholder="20"
          name="discountValue"
          value={form.discountValue}
          onChange={handleChange}
        />
      </div>

      {/* Category */}
      <div className="col-md-6">
        <label className="form-label">Category</label>
        <select
          className="form-select"
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
      </div>

      {/* SubCategory */}
      <div className="col-md-6">
        <label className="form-label">Sub-category</label>
        <select
          className="form-select"
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
      </div>

      {/* Dates */}
      <div className="col-md-6">
        <label className="form-label">Start Date</label>
        <input
          type="date"
          className="form-control"
          name="startDate"
          value={form.startDate}
          onChange={handleChange}
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">End Date</label>
        <input
          type="date"
          className="form-control"
          name="endDate"
          value={form.endDate}
          onChange={handleChange}
        />
      </div>
    </div>

    {/* Actions */}
    <div className="d-flex justify-content-end gap-2 mt-4">
      <button
        className="btn btn-outline-secondary"
        onClick={() => setShowForm(false)}
      >
        Cancel
      </button>

      <button
        className="btn btn-primary-redesign px-4"
        onClick={submitHandler}
      >

        {editingPromoId ? "Update" : "Create"}
      </button>
    </div>
  </div>
</div>

)}
      {/* PROMOTIONS LIST */}
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-sm align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Name</th>
                  <th>Discount</th>
                  <th>Period</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {promotions.map((p) => (
                  <tr key={p._id}>
                    <td className="ps-4 fw-semibold">{p.name}</td>
                    <td className="text-muted">
                      {p.discountValue}
                      {p.discountType === "percentage" ? "%" : " TND"}
                    </td>
                    <td className="text-muted">
                      {new Date(p.startDate).toLocaleDateString()} → {new Date(p.endDate).toLocaleDateString()}
                    </td>
                    <td className="text-end pe-4">
                      <button
                        className="btn btn-sm btn-light border me-2 action-btn"
                        onClick={() => editPromotion(p)}
                        title="Modifier"
                      >
                        <i className="fas fa-pen" aria-hidden="true"></i>
                        <span className="visually-hidden">Modifier</span>
                      </button>
                      <button
                        className="btn btn-sm btn-light border text-danger action-btn"
                        onClick={() => deletePromotion(p._id)}
                        title="Supprimer"
                      >
                        <i className="fas fa-trash" aria-hidden="true"></i>
                        <span className="visually-hidden">Supprimer</span>
                      </button>
                    </td>
                  </tr>
                ))}
                {!promotions.length && (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-muted">Aucune promotion.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

           {/* PRODUCTS */}
      <div className="card border-0 shadow-sm rounded-4 mt-4">
        <div className="card-header bg-white border-0">
          <h6 className="mb-0 fw-semibold">Products with Promotion</h6>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-sm align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Product</th>
                  <th>Original</th>
                  <th>Promo Price</th>
                  <th>Promotion</th>
                </tr>
              </thead>
              <tbody>
                {productsWithPromo.map((p) => (
                  <tr key={p._id}>
                    <td className="ps-4">
                      <div className="d-flex align-items-center gap-3">
                        {p.image && (
                          <img
                            src={p.image}
                            alt={p.name}
                            className="rounded"
                            style={{ width: "40px", height: "40px", objectFit: "cover" }}
                          />
                        )}
                        <div className="fw-semibold">{p.name}</div>
                      </div>
                    </td>
                    <td className="text-muted">{p.originalPrice.toFixed(2)} TND</td>
                    <td className="text-muted">
  <span className="text-success">{p.discountedPrice.toFixed(2)} TND</span> 
</td>

                    <td className="text-muted">{p.promotion?.name || "-"}</td>
                  </tr>
                ))}
                {!productsWithPromo.length && (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-muted">Aucun produit en promotion.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>


    </div>
  );
};

export default Promotions;

import { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import { FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import ConfirmModal from "../../components/ConfirmModal";
import BASE_URL from "../../constante";
import { toast } from "react-toastify";
const Promotions = () => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [productsWithPromo, setProductsWithPromo] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [products, setProducts] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [targetPromotionId, setTargetPromotionId] = useState(null);
  const [currentPagePromo, setCurrentPagePromo] = useState(1);
  const itemsPerPage = 5;
 
  const totalPagesPromo = Math.ceil(productsWithPromo.length / itemsPerPage);

// Slice products for current page
const paginatedProductsWithPromo = productsWithPromo.slice(
  (currentPagePromo - 1) * itemsPerPage,
  currentPagePromo * itemsPerPage
);
const [currentPagePromosTable, setCurrentPagePromosTable] = useState(1);
const itemsPerPagePromosTable = 2; 

const totalPagesPromosTable = Math.ceil(
  promotions.length / itemsPerPagePromosTable
);

const paginatedPromotionsTable = promotions.slice(
  (currentPagePromosTable - 1) * itemsPerPagePromosTable,
  currentPagePromosTable * itemsPerPagePromosTable
);
const fetchProducts = async () => {
  const { data } = await axios.get(`${BASE_URL}/api/products`);
  setProducts(data);
};

  const [form, setForm] = useState({
    name: "",
    description: "",
    discountType: "percentage",
    discountValue: "",
    category: "",
    subCategory: "",
    productId: "",
    startDate: "",
    endDate: "",
  });

  const [editingPromoId, setEditingPromoId] = useState(null);

  
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
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchSubCategories(form.category);
    setForm({ ...form, subCategory: "" });
    
  }, [form.category]);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitHandler = async () => {
    if (!form.name || !form.discountValue || !form.startDate || !form.endDate) {
      toast.error("All required fields must be filled");
      return;
    }

    const payload = {
      ...form,
      discountValue: Number(form.discountValue),
      category: form.category || null,
      subCategory: form.subCategory || null,
      description: form.description || "",
      productId: form.productId || null,
    };

    try {
      if (editingPromoId) {
        await axios.put(`${BASE_URL}/api/promotions/${editingPromoId}`, payload);
        toast.success("Promotion updated");
      } else {
        await axios.post(`${BASE_URL}/api/promotions/apply`, payload);
        toast.success("Promotion created");
      }

      setEditingPromoId(null);
      setForm({
        name: "",
        description: "",
        discountType: "percentage",
        discountValue: "",
        category: "",
        subCategory: "",
        startDate: "",
        endDate: "",
      });

      fetchPromotions();
      fetchProductsWithPromo();
    } catch (error) {
      console.error(error);
      toast.error("Error saving promotion");
    }
  };

  const editPromotion = (promo) => {
    setEditingPromoId(promo._id);
    setForm({
      name: promo.name,
      description: promo.description || "",
      discountType: promo.discountType,
      discountValue: promo.discountValue,
      category: promo.category || "",
      subCategory: promo.subCategory || "",
      startDate: promo.startDate.slice(0, 10),
      endDate: promo.endDate.slice(0, 10),
    });
    setShowForm(true);
  };

  const handleDeletePromotion = (id) => {
    setTargetPromotionId(id);
    setConfirmOpen(true);
  };

  const deletePromotion = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/promotions/${id}`);
      fetchPromotions();
      fetchProductsWithPromo();
    } catch (error) {
      console.error(error);
      toast.error("Error deleting promotion");
    }
  };

  return (
    <div className="container mt-4 mb-4">
      {/* Header */}
      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
          <div>
            <h5 className="text-dark fw-bold mb-0">Promotions</h5>
            <small className="text-muted">
              Gérer les promotions actives et leurs remises.
            </small>
          </div>
          <div>
            <button
              className="btn btn-add-primary"
              onClick={() => {
                setShowForm(true);
                setEditingPromoId(null);
                setForm({
                  name: "",
                  description: "",
                  discountType: "percentage",
                  discountValue: "",
                  category: "",
                  subCategory: "",
                  productId: "",
                  startDate: "",
                  endDate: "",
                  productId: "",
                });
              }}
            >
              + Create Promotion
            </button>
          </div>
        </div>
      </div>

      {/* Form */}
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

              {/* Description */}
              <div className="col-12">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  placeholder="Enter promotion description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
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
{/* Product */}
<div className="col-md-6">
  <label className="form-label">Product (optional)</label>

  <Select
    options={products.map((p) => ({
      value: p._id,
      label: p.name,
    }))}
    value={
      form.productId
        ? {
            value: form.productId,
            label: products.find((p) => p._id === form.productId)?.name,
          }
        : null
    }
    onChange={(selected) =>
      setForm({
        ...form,
        productId: selected ? selected.value : "",
        category: "",
        subCategory: "",
      })
    }
    isClearable
    placeholder="Search product..."
  />

  {form.productId && (
    <small className="text-muted">
      Promotion will apply only to this product.
    </small>
  )}
</div>


              {/* Category */}
              <div className="col-md-6">
                <label className="form-label">Category</label>
               <select
  className="form-select"
  name="category"
  value={form.category}
  onChange={handleChange}
  disabled={!!form.productId}
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
  disabled={!form.category || !!form.productId}
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
              <button className="btn btn-primary-redesign px-4" onClick={submitHandler}>
                {editingPromoId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Promotions List */}
      <div className="card border-0 shadow-sm rounded-4 mb-4">
  <div className="card-body p-0">
    <div className="table-responsive">
      <table className="table table-hover table-sm align-middle mb-0">
        <thead className="table-light">
          <tr>
          <th className="ps-4">Nom</th>
          <th>Description</th>
          <th>Remise</th>
          <th>Période</th>
          <th className="text-end pe-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedPromotionsTable.map((p) => (
            <tr key={p._id}>
              <td className="ps-4 fw-semibold">{p.name}</td>
              <td className="text-muted" style={{ maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {p.description || "-"}
              </td>

              <td className="text-muted text-center">
                {p.discountValue}
                {p.discountType === "percentage" ? "%" : " TND"}
              </td>
              <td className="text-muted text-center">
                {new Date(p.startDate).toLocaleDateString()} →{" "}
                {new Date(p.endDate).toLocaleDateString()}
              </td>
              <td className="text-end pe-4">
                          <button
                            className="btn btn-sm btn-light border me-2 action-btn"
                            title="Modifier"
                            onClick={() => editPromotion(p)}
                          >
                          <FiEdit2 size={16} />
                            <span className="visually-hidden">Modifier</span>
                          </button>
                        <button
                  className="btn btn-sm btn-light border text-danger action-btn"
                  title="Supprimer"
                  onClick={() => handleDeletePromotion(p._id)}
                >
                 <FiTrash2 size={16} />
                </button>
                        </td>
            </tr>
          ))}
          {!promotions.length && (
            <tr>
              <td colSpan={5} className="py-4 text-center text-muted">
              Aucune promotion.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    {/* Pagination */}
    {promotions.length > itemsPerPagePromosTable && (
      <div className="d-flex justify-content-center align-items-center gap-2 mt-3 mb-4 flex-wrap">
        <button
          className={`pagination-btn ${
            currentPagePromosTable === 1 ? "disabled" : ""
          }`}
          onClick={() =>
            setCurrentPagePromosTable((p) => Math.max(p - 1, 1))
          }
        >
          Préc
        </button>

        {Array.from({ length: totalPagesPromosTable }, (_, i) => i + 1).map(
          (p) => (
            <button
              key={p}
              className={`pagination-btn ${
                currentPagePromosTable === p ? "active" : ""
              }`}
              onClick={() => setCurrentPagePromosTable(p)}
            >
              {p}
            </button>
          )
        )}

        <button
          className={`pagination-btn ${
            currentPagePromosTable === totalPagesPromosTable ? "disabled" : ""
          }`}
          onClick={() =>
            setCurrentPagePromosTable((p) =>
              Math.min(p + 1, totalPagesPromosTable)
            )
          }
        >
          Suiv
        </button>
      </div>
    )}
  </div>
</div>


      {/* Products with Promotion */}
      <div className="card border-0 shadow-sm rounded-4 mt-4">
  <div className="card-header bg-white border-0">
    <h6 className="mb-0 fw-semibold">Produits en promotion</h6>
  </div>
  <div className="card-body p-0">
    <div className="table-responsive">
      <table className="table table-hover table-sm align-middle mb-0">
        <thead className="table-light">
          <tr>
            <th className="ps-4">Produit</th>
            <th>Prix initial</th>
            <th>Prix promo</th>
            <th>Offre</th>
          </tr>
        </thead>
        <tbody>
          {paginatedProductsWithPromo.map((p) => (
            <tr key={p._id}>
              <td className="ps-4">
                <div className="d-flex align-items-center gap-3">
                  {p.image && (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="rounded"
                      style={{
                        width: "40px",
                        height: "40px",
                        objectFit: "cover",
                      }}
                    />
                  )}
                  <div className="fw-semibold">{p.name}</div>
                </div>
              </td>
              <td className="text-muted text-center">{p.price.toFixed(2)} TND</td>
              <td className="text-success text-center">{p.promotion.discountedPrice.toFixed(2)} TND</td>
              <td className="text-muted text-center">{p.promotion?.name || "-"}</td>
            </tr>
          ))}
          {!productsWithPromo.length && (
            <tr>
             <td colSpan={4} className="py-4 text-center text-muted">
              Aucun produit en promotion.
            </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    {/* Pagination */}
    {productsWithPromo.length > itemsPerPage && (
      <div className="d-flex justify-content-center align-items-center gap-2 mt-3 mb-2 flex-wrap">
        <button
          className={`pagination-btn ${currentPagePromo === 1 ? "disabled" : ""}`}
          onClick={() => setCurrentPagePromo((p) => Math.max(p - 1, 1))}
        >
          Préc
        </button>

        {Array.from({ length: totalPagesPromo }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            className={`pagination-btn ${currentPagePromo === p ? "active" : ""}`}
            onClick={() => setCurrentPagePromo(p)}
          >
            {p}
          </button>
        ))}

        <button
          className={`pagination-btn ${currentPagePromo === totalPagesPromo ? "disabled" : ""}`}
          onClick={() => setCurrentPagePromo((p) => Math.min(p + 1, totalPagesPromo))}
        >
          Suiv
        </button>
      </div>
    )}
  </div>
</div>
<ConfirmModal
        open={confirmOpen}
        loading={confirmLoading}
        onConfirm={async () => {
          setConfirmLoading(true);
          await deletePromotion(targetPromotionId);
          setConfirmLoading(false);
          setConfirmOpen(false);
          setTargetPromotionId(null);
        }}
        onCancel={() => {
          setConfirmOpen(false);
          setTargetPromotionId(null);
        }}
      />
    </div>
  );
};

export default Promotions;

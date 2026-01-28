import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../constante"; 
import { FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import ConfirmModal from "../../components/ConfirmModal";
import { toast } from "react-toastify";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [targetUserId, setTargetUserId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: ""
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.get(`${BASE_URL}/api/user`);
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la récupération des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete user
  const deleteUser = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/user/${id}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la suppression de l'utilisateur");
    }
  };


  const handleDeleteUser = (userId) => {
    setTargetUserId(userId);
    setConfirmOpen(true);
  };


  // Open modal
  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  // Form change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Update user
  const handleUpdateUser = async () => {
    try {
      await axios.put(`${BASE_URL}/api/user/${selectedUser._id}`, formData);
      toast.success("Utilisateur mis à jour avec succès");
      closeModal();
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la mise à jour de l'utilisateur");
    }
  };

  // Filter users by name or email
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  if (loading) return null;
  if (error) return null;
  return (
   <div className="container mt-4">
  <div className="card border-0 shadow-sm">
    {/* Header */}
    <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center flex-wrap">
      <div>
        <h5 className="text-dark fw-bold mb-0 d-flex align-items-center gap-2">
          Utilisateurs
          <span className="count-pill">
        {filteredUsers.length} {filteredUsers.length === 1 ? "user" : "users"}
      </span>

        </h5>
        <small className="text-muted d-none d-md-block">Gérez les comptes et les rôles des utilisateurs.</small>
      </div>

      <div className="col-md-4 position-relative mt-3 mt-md-0 d-none d-md-block">
        <FiSearch className="search-icon" />
        <input
          className="form-control rounded-pill ps-5"
          placeholder="Rechercher par nom ou email…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>
    </div>

    {/* Body */}
    <div className="card-body p-0">
      {filteredUsers.length === 0 ? (
        <div className="py-5 text-center text-muted">Aucun utilisateur trouvé.</div>
      ) : (
        <>
      <div className="table-responsive">
        <table className="table table-hover table-sm align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th className="ps-4">
                <input type="checkbox" className="form-check-input" />
              </th>
              <th>Nom</th>
              <th>Rôle</th>
              <th className="d-none d-md-table-cell">Email</th>
              <th className="text-end pe-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedUsers.map((u) => (
              <tr key={u._id}>
                <td className="ps-4">
                  <input type="checkbox" className="form-check-input" />
                </td>

                <td data-label="Nom">
                  <div className="d-flex align-items-center gap-3">
                    <div className="avatar-circle">{u.name.charAt(0)}</div>
                    <div>
                      <div className="fw-semibold">{u.name}</div>
                      <small className="text-muted">@{u.name.toLowerCase()}</small>
                    </div>
                  </div>
                </td>

                <td data-label="Rôle" className="text-muted text-center">
                  <span className="status-pill">{u.role}</span>
                </td>

                <td data-label="Email" className="d-none d-md-table-cell text-muted text-truncate text-center" style={{ maxWidth: "180px" }}>
                  {u.email}
                </td>

                <td data-label="Actions" className="text-end pe-4">
                  <button
                    className="btn btn-sm btn-light border me-2 action-btn"
                    title="Modifier"
                    onClick={() => openEditModal(u)}
                  >
                    <FiEdit2 size={16} />
                    <span className="visually-hidden">Modifier</span>
                  </button>

                  <button
                    className="btn btn-sm btn-light border text-danger action-btn"
                    title="Supprimer"
                    onClick={() => handleDeleteUser(u._id)}
                  >
                    <FiTrash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredUsers.length > itemsPerPage && (
        <div className="d-flex justify-content-center align-items-center gap-2 mt-3 mb-4">
          <button
            className={`pagination-btn ${currentPage === 1 ? "disabled" : ""}`}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          >
            Préc
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`pagination-btn ${currentPage === p ? "active" : ""}`}
              onClick={() => setCurrentPage(p)}
            >
              {p}
            </button>
          ))}

          <button
            className={`pagination-btn ${currentPage === totalPages ? "disabled" : ""}`}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          >
            Suiv
          </button>
        </div>
         )}
         </>
       )}
     </div>
   </div>
   {showModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Modifier l'utilisateur</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Nom</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Rôle</label>
                  <select
                    className="form-select"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="user">Utilisateur</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-outline-secondary" onClick={closeModal}>
                  Annuler
                </button>
                <button className="btn btn-primary-redesign" onClick={handleUpdateUser}>
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

   <ConfirmModal
        open={confirmOpen}
        loading={confirmLoading}
        onConfirm={async () => {
          setConfirmLoading(true);
          await deleteUser(targetUserId);
          setConfirmLoading(false);
          setConfirmOpen(false);
          setTargetUserId(null);
        }}
        onCancel={() => {
          setConfirmOpen(false);
          setTargetUserId(null);
        }}
      />

 </div>

  );
};

export default Users;

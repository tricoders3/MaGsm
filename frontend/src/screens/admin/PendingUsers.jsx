import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../constante";
import { FiCheck, FiTrash2, FiSearch } from "react-icons/fi";
import ConfirmModal from "../../components/ConfirmModal";

const PendingUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [targetUserId, setTargetUserId] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchPendingUsers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/auth/pending-requests`, { withCredentials: true });
      setUsers(res.data);
    } catch (error) {
      console.error("Erreur chargement:", error);
    } finally {
      setLoading(false);
    }
  };

  const approveUser = async (id) => {
    setActionLoading(id);
    try {
      await axios.post(`${BASE_URL}/api/auth/approve-user/${id}`, {}, { withCredentials: true });
      fetchPendingUsers();
    } catch (error) {
      alert("Erreur lors de l’approbation");
    } finally {
      setActionLoading(null);
    }
  };

  const deleteUser = async (id) => {
    setActionLoading(id);
    try {
      await axios.delete(`${BASE_URL}/api/user/${id}`, { withCredentials: true });
      fetchPendingUsers();
    } catch (error) {
      alert("Erreur lors de la suppression");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = (id) => {
    setTargetUserId(id);
    setConfirmOpen(true);
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  // Filter by search
  const filteredUsers = users.filter(
    (u) => u.name.toLowerCase().includes(search.toLowerCase()) ||
           u.email.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  if (loading) return null;

  return (
    <div className="container py-4">
      <div className="card border-0 shadow-sm rounded-4">
        {/* Header */}
        <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
          <div>
            <h5 className="text-dark fw-bold mb-0 d-flex align-items-center gap-2">
              Demandes d’inscription
              <span className="count-pill">{filteredUsers.length} demandes</span>
            </h5>
            <small className="text-muted">Gérez les inscriptions en attente.</small>
          </div>

          {/* Optional search bar like Users page */}
          <div className="col-md-4 position-relative">
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

        {/* Table */}
        <div className="card-body p-0">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-4 text-muted">
              Aucune demande en attente
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-hover table-sm align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">Nom</th>
                      <th>Email</th>
                      <th className="text-end pe-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedUsers.map((u) => (
                      <tr key={u._id}>
                        <td className="ps-4">
                          <div className="d-flex align-items-center gap-3">
                            <div className="avatar-circle">{u.name.charAt(0)}</div>
                            <div className="fw-semibold">{u.name}</div>
                          </div>
                        </td>
                        <td className="text-muted">{u.email}</td>
                        <td className="text-end pe-4">
                          <div className="d-flex gap-2 justify-content-end">
                            <button
                              className="btn btn-light btn-sm border text-success d-flex align-items-center gap-1 px-3"
                              disabled={actionLoading === u._id}
                              onClick={() => approveUser(u._id)}
                            >
                              {actionLoading === u._id ? (
                                <span className="spinner-border spinner-border-sm text-light" />
                              ) : (
                                <>
                                  <FiCheck size={16} />
                                 
                                </>
                              )}
                            </button>

                            <button
                              className="btn btn-light btn-sm border text-danger d-flex align-items-center gap-1 px-3"
                              disabled={actionLoading === u._id}
                              onClick={() => handleDeleteUser(u._id)}
                            >
                              {actionLoading === u._id ? (
                                <span className="spinner-border spinner-border-sm text-danger" />
                              ) : (
                                <>
                                  <FiTrash2 size={16} />
                              
                                </>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {filteredUsers.length > itemsPerPage && (
                <div className="d-flex justify-content-center align-items-center gap-2 mt-3 mb-4 flex-wrap">
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

      {/* Confirm delete modal */}
      <ConfirmModal
        open={confirmOpen}
        loading={actionLoading === targetUserId}
        onConfirm={async () => {
          setActionLoading(targetUserId);
          await deleteUser(targetUserId);
          setActionLoading(null);
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

export default PendingUsers;

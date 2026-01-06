import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../constante"; 
import { FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    if (!window.confirm("Supprimer cet utilisateur ?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression de l'utilisateur");
    }
  };

  // Filter users by name or email
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container py-4">
    <div className="card border-0 shadow-sm rounded-4">
      {/* Header */}
      <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
      <div>
  <h5 className="text-dark fw-bold mb-0 d-flex align-items-center gap-2">
    Utilisateurs

    <span className="users-count-pill">
      {filteredUsers.length} users
    </span>
  </h5>
</div>

        <div className="col-md-4 position-relative">
  <FiSearch className="search-icon" />

  <input
    className="form-control rounded-pill ps-5"
    placeholder="Rechercher par nom ou email…"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
</div>

      </div>
  
      {/* Body */}
      <div className="card-body p-0">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" />
            <p className="mt-2 mb-0 text-muted">
              Chargement des utilisateurs…
            </p>
          </div>
        ) : error ? (
          <p className="text-danger p-4">{error}</p>
        ) : (
          <div className="table-responsive">
          <table className="table table-hover table-sm align-middle mb-0">

              <thead className="table-light">
                <tr>
                  <th className="ps-4">
                    <input type="checkbox" className="form-check-input" />
                  </th>
                  <th>Nom</th>
                  <th>Rôle</th>
                  <th>Email</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
  
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u._id}>
                    {/* Checkbox */}
                    <td className="ps-4">
                      <input type="checkbox" className="form-check-input" />
                    </td>
  
                    {/* User */}
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <div className="avatar-circle">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <div className="fw-semibold">{u.name}</div>
                          <small className="text-muted">@{u.name.toLowerCase()}</small>
                        </div>
                      </div>
                    </td>
  
  
  
                    {/* Role */}
                    <td className="text-muted">
                    <span className="status-pill">
                    {u.role}
                    </span>
                    
                    </td>
  
                    {/* Email */}
                    <td className="text-muted">{u.email}</td>
  
                    {/* Teams */}
                
  
                    {/* Actions */}
                    <td className="text-end pe-4">
                    <button
                      className="btn btn-sm btn-light border me-2 action-btn"
                      title="Modifier"
                    >
                      <FiEdit2 size={16} />
                    </button>

                    <button
                      className="btn btn-sm btn-light border text-danger action-btn"
                      title="Supprimer"
                      onClick={() => deleteUser(u._id)}
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  </div>
  
  );
};

export default Users;

import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../constante"; 

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
    <div className="container">
      <h4>Utilisateurs</h4>

      <input
        className="form-control mb-3"
        placeholder="Rechercher par nom ou email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p>Chargement des utilisateurs...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => deleteUser(u._id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Users;

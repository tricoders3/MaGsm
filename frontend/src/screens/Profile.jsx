import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import BASE_URL from "../constante";
import { toast } from "react-toastify";
import { FiUser, FiLock } from "react-icons/fi";

const Profile = () => {
  const { user, updateUser } = useAuth();

  const [profil, setProfil] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfil({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleProfilChange = (e) =>
    setProfil({ ...profil, [e.target.name]: e.target.value });

  const handlePasswordChange = (e) =>
    setPassword({ ...password, [e.target.name]: e.target.value });

  // Mise à jour des informations
  const updateProfil = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.put(
        `${BASE_URL}/users/profile`,
        { name: profil.name, phone: profil.phone },
        { withCredentials: true }
      );
      updateUser(data.user);
      toast.success("Profil mis à jour avec succès");
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  // Mise à jour du mot de passe
  const updatePassword = async (e) => {
    e.preventDefault();

    if (password.newPassword !== password.confirmPassword) {
      return toast.error("Les mots de passe ne correspondent pas");
    }

    try {
      setLoading(true);
      await axios.put(
        `${BASE_URL}/users/update-password`,
        {
          currentPassword: password.currentPassword,
          newPassword: password.newPassword,
        },
        { withCredentials: true }
      );
      toast.success("Mot de passe modifié avec succès");
      setPassword({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors du changement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="mb-4">
            <h2 className="fw-bold">Mon profil</h2>
            <p className="text-muted">
              Gérez vos informations personnelles et votre sécurité
            </p>
          </div>

          <div className="row g-4">
            {/* Informations personnelles */}
            <div className="col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-4">
                    <div
                      className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{ width: 48, height: 48 }}
                    >
                      <FiUser size={22} />
                    </div>
                    <div>
                      <h5 className="mb-0">Informations personnelles</h5>
                      <small className="text-muted">
                        Modifier vos informations
                      </small>
                    </div>
                  </div>

                  <form onSubmit={updateProfil}>
                    <div className="mb-3">
                      <label className="form-label">Nom</label>
                      <input
                        className="form-control"
                        name="name"
                        value={profil.name}
                        onChange={handleProfilChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input
                        className="form-control"
                        value={profil.email}
                        disabled
                      />
                    </div>

                    <div className="mb-4">
                      <label className="form-label">Téléphone</label>
                      <input
                        className="form-control"
                        name="phone"
                        value={profil.phone}
                        onChange={handleProfilChange}
                      />
                    </div>

                    <button
                      className="btn btn-primary w-100"
                      disabled={loading}
                    >
                      Enregistrer les modifications
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Sécurité */}
            <div className="col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-4">
                    <div
                      className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{ width: 48, height: 48 }}
                    >
                      <FiLock size={22} />
                    </div>
                    <div>
                      <h5 className="mb-0">Sécurité</h5>
                      <small className="text-muted">
                        Modifier votre mot de passe
                      </small>
                    </div>
                  </div>

                  <form onSubmit={updatePassword}>
                    <div className="mb-3">
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Mot de passe actuel"
                        name="currentPassword"
                        value={password.currentPassword}
                        onChange={handlePasswordChange}
                      />
                    </div>

                    <div className="mb-3">
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Nouveau mot de passe"
                        name="newPassword"
                        value={password.newPassword}
                        onChange={handlePasswordChange}
                      />
                    </div>

                    <div className="mb-4">
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Confirmer le nouveau mot de passe"
                        name="confirmPassword"
                        value={password.confirmPassword}
                        onChange={handlePasswordChange}
                      />
                    </div>

                    <button
                      className="btn btn-primary-redesign w-100"
                      disabled={loading}
                    >
                      Mettre à jour le mot de passe
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;

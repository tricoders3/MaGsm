import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import BASE_URL from "../constante";
import { toast } from "react-toastify";
import { FiUser, FiLock } from "react-icons/fi";

const Profile = () => {
  const { user, updateUser } = useAuth(); // 

  const [profil, setProfil] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  // 🔹 populate form when user is loaded
  useEffect(() => {
    if (user) {
      setProfil({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleProfilChange = (e) =>
    setProfil({ ...profil, [e.target.name]: e.target.value });

  const handlePasswordChange = (e) =>
    setPassword({ ...password, [e.target.name]: e.target.value });

  // ✅ update profile
  const updateProfil = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const { data } = await axios.put(
        `${BASE_URL}/api/user/me`,
        {
          name: profil.name,
          email: profil.email,
          phone: profil.phone,
          address: profil.address,
        },
        { withCredentials: true }
      );

      updateUser(data.user); // 🔹 update context + localStorage
      toast.success("Profil mis à jour avec succès ✅");
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  // 🔐 update password
 const updatePassword = async (e) => {
  e.preventDefault();

  if (password.newPassword !== password.confirmPassword) {
    return toast.error("Les mots de passe ne correspondent pas");
  }

  try {
    setLoading(true);

    // Determine if the user is local or social
    const payload =
      user.provider === "local"
        ? { currentPassword: password.currentPassword, newPassword: password.newPassword }
        : { newPassword: password.newPassword }; // social users don't need currentPassword

    await axios.put(`${BASE_URL}/api/auth/update-password`, payload, {
      withCredentials: true,
    });

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
          <h2 className="fw-bold mb-2">Mon profil</h2>
          <p className="text-muted">
            Gérez vos informations personnelles et votre sécurité
          </p>

          <div className="row g-4">
            {/* PROFILE */}
            <div className="col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <form onSubmit={updateProfil}>
                    <div className="mb-3">
                      <label className="form-label">Nom</label>
                      <input
                        className="form-control"
                        name="name"
                        value={profil.name}
                        onChange={handleProfilChange}
                        placeholder="Votre nom"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input
                        className="form-control"
                        name="email"
                        value={profil.email}
                        onChange={handleProfilChange}
                        placeholder="email@example.com"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Téléphone</label>
                      <input
                        className="form-control"
                        name="phone"
                        value={profil.phone}
                        onChange={handleProfilChange}
                        placeholder="+216 XX XXX XXX"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="form-label">Adresse</label>
                      <input
                        className="form-control"
                        name="address"
                        value={profil.address}
                        onChange={handleProfilChange}
                        placeholder="Votre adresse"
                      />
                    </div>

                    <button className="btn btn-primary w-100" disabled={loading}>
                      Enregistrer les modifications
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* PASSWORD */}
 {/* PASSWORD */}
<div className="col-md-6">
  <div className="card border-0 shadow-sm">
    <div className="card-body">
      <form onSubmit={updatePassword}>

        {/* Current password only for local users */}
        {user?.provider === "local" && (
          <input
            type="password"
            className="form-control mb-3"
            placeholder="Mot de passe actuel"
            name="currentPassword"
            value={password.currentPassword}
            onChange={handlePasswordChange}
          />
        )}

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Nouveau mot de passe"
          name="newPassword"
          value={password.newPassword}
          onChange={handlePasswordChange}
        />

        <input
          type="password"
          className="form-control mb-4"
          placeholder="Confirmer le mot de passe"
          name="confirmPassword"
          value={password.confirmPassword}
          onChange={handlePasswordChange}
        />

        <button className="btn btn-primary-redesign w-100">
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

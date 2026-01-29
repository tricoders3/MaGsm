import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import BASE_URL from "../../constante";
import { toast } from "react-toastify";

const PasswordForm = () => {
  const { user } = useAuth();
  const [password, setPassword] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setPassword({ ...password, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.newPassword !== password.confirmPassword) {
      return toast.error("Les mots de passe ne correspondent pas");
    }

    try {
      setLoading(true);
      const payload =
        user.provider === "local"
          ? { currentPassword: password.currentPassword, newPassword: password.newPassword }
          : { newPassword: password.newPassword };

      await axios.put(`${BASE_URL}/api/auth/update-password`, payload, { withCredentials: true });
      toast.success("Mot de passe modifié avec succès");
      setPassword({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors du changement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
    <div className="row justify-content-center">
    <div className="col-12 col-sm-10 col-md-8 col-lg-6">
    <div className="card shadow-sm rounded-4 border-0">
    <div className="card-body p-4">
    <h4 className="card-title text-center mb-4">Modifier le mot de passe</h4>
        <form onSubmit={handleSubmit}>
          {user?.provider === "local" && (
            <input type="password" className="form-control mb-3" name="currentPassword" value={password.currentPassword} onChange={handleChange} placeholder="Mot de passe actuel" />
          )}
          <input type="password" className="form-control mb-3" name="newPassword" value={password.newPassword} onChange={handleChange} placeholder="Nouveau mot de passe" />
          <input type="password" className="form-control mb-4" name="confirmPassword" value={password.confirmPassword} onChange={handleChange} placeholder="Confirmer le mot de passe" />
          <button className="btn btn-primary-redesign w-100" disabled={loading}>
            {loading ? "Chargement..." : "Mettre à jour le mot de passe"}
          </button>
        </form>
        </div>
</div>
</div>
</div>
</div>
  
  );
};

export default PasswordForm;

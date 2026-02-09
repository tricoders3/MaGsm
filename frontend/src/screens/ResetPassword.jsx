// src/pages/ResetPassword.jsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import BASE_URL from "../constante";

const ResetPassword = () => {
  const { token } = useParams(); // récupère le token depuis l'URL
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/api/auth/reset-password/${token}`, {
        newPassword: password,
      });
      toast.success("Mot de passe réinitialisé avec succès !");
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la réinitialisation du mot de passe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-7">
            <div className="auth-card animate-scaleIn">
              <div className="card-header-redesign text-center">
                <h3 className="text-gradient mb-2">Réinitialiser le mot de passe</h3>
              </div>
              <div className="card-body-redesign">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Nouveau mot de passe</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Entrez votre nouveau mot de passe"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <button className="btn btn-primary w-100" type="submit" disabled={loading}>
                    {loading ? "Réinitialisation…" : "Réinitialiser le mot de passe"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

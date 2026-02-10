import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import BASE_URL from "../constante";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/api/auth/forgot-password`, { email });
      toast.success("Si cet email existe, vous recevrez un lien de réinitialisation");
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'envoi de l'email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center mt-4">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-7">
            <div className="auth-card animate-scaleIn">
              <div className="card-header-redesign text-center">
                <h3 className="text-gradient mb-2">Mot de passe oublié</h3>
              </div>
              <div className="card-body-redesign">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Adresse e-mail</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Entrez votre e-mail"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <button className="btn btn-primary w-100" type="submit" disabled={loading}>
                    {loading ? "Envoi…" : "Envoyer le lien de réinitialisation"}
                  </button>
                </form>

                <div className="text-center mt-3">
                  <p className="text-muted">
                    Retour à la <Link to="/login">connexion</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

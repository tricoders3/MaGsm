import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import BASE_URL from "../constante";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ✅ Register classique
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${BASE_URL}/api/auth/register`,
        {
          name,
          email,
password        },
        { withCredentials: true }
      );

      toast.success(res.data.message || "Inscription réussie");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Erreur lors de l'inscription"
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ Google register
  const registerWithGoogle = () => {
    window.location.href = `${BASE_URL}/api/auth/google`;
  };

  // ✅ Facebook register
  const registerWithFacebook = () => {
    window.location.href = `${BASE_URL}/api/auth/facebook`;
  };

  return (
    <div className="auth-page d-flex align-items-center">
      <div className="container mb-4">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-7">
            <div className="auth-card animate-scaleIn">

              {/* Header */}
              <div className="card-header-redesign text-center">
                <h3 className="text-gradient mb-2">Créer un compte</h3>
              </div>

              {/* Body */}
              <div className="card-body-redesign">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Nom complet</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Entrez votre nom complet"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

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

                  <div className="mb-3">
                    <label className="form-label">Mot de passe</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Créer un mot de passe"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label">
                      Confirmer le mot de passe
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Confirmez le mot de passe"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>

                  <button
                    className="btn btn-primary w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? "Inscription..." : "S’inscrire"}
                  </button>
                </form>

                <div className="text-center mb-2 text-muted">OU</div>

                {/* Google */}
                <button
                  className="btn btn-google w-100 mb-2 social-btn gap-2"
                  onClick={registerWithGoogle}
                >
                  Continuer avec Google
                </button>

                {/* Facebook */}
                <button
                  className="btn btn-facebook w-100 mb-2 social-btn gap-2"
                  onClick={registerWithFacebook}
                >
                  Continuer avec Facebook
                </button>

                {/* Footer */}
                <div className="text-center mt-3">
                  <p className="text-muted auth-text">
                    Déjà un compte ?{" "}
                    <Link to="/login" className="fw-semibold">
                      Se connecter
                    </Link>
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

export default Register;

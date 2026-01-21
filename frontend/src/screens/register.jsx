import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import BASE_URL from "../constante";
const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  // Backend URL (mettre dans .env frontend)


  // Register classique
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      const res = await axios.post(
        `${BASE_URL}/api/auth/register`,
        { name, email, password },
        { withCredentials: true }
      );

      alert(res.data.message);
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Erreur lors de l'inscription");
    }
  };



  // Connexion Google
  const registerWithGoogle = () => {
    window.location.href = `${BASE_URL}/api/auth/google`;
  };

  // Connexion Facebook
  const registerWithFacebook = () => {
    window.location.href = `${BASE_URL}/api/auth/facebook`;
  };


  return (
    <div className="auth-page min-vh-100 d-flex align-items-center">
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-5 col-md-7">
          <div className="auth-card animate-scaleIn">
  
            {/* Header */}
            <div className="card-header-redesign text-center">
              <h3 className="text-gradient mb-2">Créer un compte</h3>
              {/*<p className="text-muted mb-0">Remplissez vos informations pour vous inscrire</p>*/}
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
                  <label className="form-label">Confirmer le mot de passe</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Confirmez le mot de passe"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
  
                <button className="btn btn-primary w-100 mb-4">
                  S’inscrire
                </button>
              </form>
  
                  {/* Google */}
                  <button
                  className="btn btn-google w-100 mb-4 d-flex align-items-center justify-content-center gap-2"
                  onClick={registerWithGoogle}
                >
                  <svg width="18" height="18" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.7 1.22 9.2 3.6l6.9-6.9C35.9 2.3 30.4 0 24 0 14.6 0 6.5 5.4 2.6 13.3l8.5 6.6C13.1 13.2 18.1 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-2.8-.4-4.1H24v7.8h12.8c-.5 3-2.1 5.6-4.6 7.3l7.1 5.5c4.2-3.9 6.8-9.6 6.8-16.5z"/>
                    <path fill="#FBBC05" d="M11.1 28.1c-.6-1.7-.9-3.5-.9-5.6s.3-3.9.9-5.6L2.6 13.3C.9 16.6 0 20.2 0 24s.9 7.4 2.6 10.7l8.5-6.6z"/>
                    <path fill="#34A853" d="M24 48c6.4 0 11.8-2.1 15.7-5.8l-7.1-5.5c-2 1.3-4.6 2.1-8.6 2.1-5.9 0-10.9-3.7-12.9-9l-8.5 6.6C6.5 42.6 14.6 48 24 48z"/>
                  </svg>
                  Continuer avec Google
                </button>

                {/* Facebook */}
                <button
                  className="btn btn-google w-100 mb-4 d-flex align-items-center justify-content-center gap-2"
                  onClick={registerWithFacebook}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                    <path d="M22.675 0h-21.35C.594 0 0 .593 0 1.326v21.348C0 23.406.594 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.658-4.788 1.325 0 2.463.099 2.795.143v3.24h-1.918c-1.504 0-1.796.715-1.796 1.763v2.313h3.588l-.467 3.622h-3.121V24h6.116c.73 0 1.324-.594 1.324-1.326V1.326C24 .593 23.406 0 22.675 0z"/>
                  </svg>
                  Continuer avec Facebook
                </button>
           
              {/* Footer */}
              <div className="text-center mb-3">
                <p className="text-muted">
                  Déjà un compte ?{" "}
                  <Link to="/login" className="text-decoration-none fw-semibold">
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

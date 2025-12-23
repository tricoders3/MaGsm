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
  
              {/* Google Button */}
           
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

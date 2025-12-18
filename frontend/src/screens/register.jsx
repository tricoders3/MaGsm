import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

  // Register/Login avec Google
  const registerWithGoogle = () => {
    window.open(`${BASE_URL}/api/auth/google`, "_self");
  };

  // Placeholder Facebook
  const registerWithFacebook = () => {
    alert("Facebook non implémenté pour le moment");
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-4" style={{ width: "420px" }}>
        <h3 className="text-center mb-4">Créer un compte</h3>

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

          <div className="mb-3">
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

          <button className="btn btn-primary w-100 mb-3">
            S’inscrire
          </button>
        </form>


       

        <p className="text-center mt-3 mb-0">
          Déjà un compte ?{" "}
          <a href="/login" className="text-decoration-none">
            Se connecter
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;

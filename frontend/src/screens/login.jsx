




// src/pages/Login.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import BASE_URL from "../constante";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Connexion classique (email/password)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${BASE_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      if (res.data.user) {
        // Stocke l'utilisateur dans le state (optionnel)
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      alert("Email ou mot de passe incorrect");
    }
  };

  // Connexion Google
const loginWithGoogle = () => {
  window.location.href = `${BASE_URL}/api/auth/google`;
};


  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-4" style={{ width: "400px" }}>
        <h3 className="text-center mb-4">Connexion</h3>

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

          <div className="mb-3">
            <label className="form-label">Mot de passe</label>
            <input
              type="password"
              className="form-control"
              placeholder="Entrez votre mot de passe"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="btn btn-primary w-100 mb-3">Se connecter</button>
        </form>

        <div className="text-center mb-3 text-muted">OU</div>

        <button
          className="btn btn-outline-danger w-100 mb-2 d-flex align-items-center justify-content-center gap-2"
          onClick={loginWithGoogle}
        >
          <FaGoogle /> Continuer avec Google
        </button>

        <p className="text-center mt-3 mb-0">
          Pas encore de compte ? <Link to="/register">Créer un compte</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
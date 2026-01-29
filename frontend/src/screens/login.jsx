
// src/pages/Login.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import  BASE_URL from "../constante";
import { useAuth } from "../context/AuthContext";




const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

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
        login(res.data.user); 
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      toast.error("Email ou mot de passe incorrect");
    }
  };

const contactViaWhatsapp = () => {
    window.open(
      `https://wa.me/21620771717?text=${encodeURIComponent(
        "Bonjour, j’aimerais avoir plus d’informations 👋"
      )}`,
      "_blank"
    );
  };
  // Connexion Google
const loginWithGoogle = () => {
  toast.info("Redirection vers Google…");
  window.location.href = `${BASE_URL}/api/auth/google`;
};
  // Connexion Facebook
  const loginWithFacebook = () => {
    toast.info("Redirection vers Facebook…");
    window.location.href = `https://0dd4d5a2ec44.ngrok-free.app/api/auth/facebook`;
  };


  return (
    <div className="auth-page min-vh-100 d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-7">
            <div className="auth-card animate-scaleIn">
              <div className="card-header-redesign text-center">
                <h3 className="text-gradient mb-2">Se connecter</h3>
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

                {/* Google */}
                <button
                  className="btn btn-google w-100 mb-4 d-flex align-items-center justify-content-center gap-2"
                  onClick={loginWithGoogle}
                >
                  {/* SVG Google */}
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
  onClick={loginWithFacebook}
>
  {/* SVG Facebook icon in blue */}
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M22.675 0h-21.35C.594 0 0 .593 0 1.326v21.348C0 23.406.594 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.658-4.788 1.325 0 2.463.099 2.795.143v3.24h-1.918c-1.504 0-1.796.715-1.796 1.763v2.313h3.588l-.467 3.622h-3.121V24h6.116c.73 0 1.324-.594 1.324-1.326V1.326C24 .593 23.406 0 22.675 0z"/>
  </svg>
  Continuer avec Facebook
</button>
{/* WhatsApp */}
<button
  className="btn btn-google w-100  mb-4 d-flex align-items-center justify-content-center gap-2"
  onClick={contactViaWhatsapp}
 
>
    <svg width="24" height="24" viewBox="0 0 24 24" >
      <path
        fill="#25D366"
        d="M12.04 2C6.52 2 2 6.48 2 12c0 2.11.55 4.16 1.6 5.97L2 22l4.19-1.56A9.94 9.94 0 0 0 12.04 22C17.56 22 22 17.52 22 12S17.56 2 12.04 2z"
      />
      <path
        fill="white"
        d="M15.52 13.61c-.2-.1-1.18-.58-1.36-.65-.18-.07-.31-.1-.44.1-.13.2-.5.65-.62.78-.11.13-.23.15-.43.05-.2-.1-.85-.31-1.62-.99-.6-.53-1-1.19-1.11-1.39-.12-.2-.01-.31.09-.41.09-.09.2-.23.31-.34.1-.12.13-.2.2-.34.07-.13.03-.26-.01-.36-.05-.1-.43-1.04-.59-1.43-.16-.38-.32-.33-.44-.33h-.38c-.13 0-.34.05-.52.26-.18.2-.69.67-.69 1.64 0 .97.7 1.91.8 2.04.1.13 1.38 2.1 3.33 2.95.47.2.83.32 1.11.41.46.14.88.12 1.22.07.37-.06 1.19-.49 1.35-.95.17-.47.17-.86.12-.95-.05-.08-.18-.13-.38-.23z"
      />
    </svg>
      Contacter MA GSM sur WhatsApp
    </button>
                <div className="text-center mb-3">
                  <p className="text-muted">
                    Pas encore de compte ? <Link to="/register" className="text-decoration-none fw-semibold">Créer un compte</Link>
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

export default Login;
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuthSuccess = ({ setUser }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      // Décodage du JWT
      const payload = JSON.parse(atob(token.split(".")[1]));

      // Mettre les infos utilisateur dans le state
      setUser({
        id: payload.id,
        role: payload.role,
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
      });

      // Stockage local pour persistance
      localStorage.setItem("user", JSON.stringify(payload));

      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, [navigate, setUser]);

  return <div>Connexion réussie, redirection...</div>;
};

export default OAuthSuccess;
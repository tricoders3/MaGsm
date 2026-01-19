import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const executedRef = useRef(false); // ✅ track if effect has already run

  useEffect(() => {
    if (executedRef.current) return; // skip second mount
    executedRef.current = true;

    console.log("OAuthSuccess mounted");

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    console.log("Token from URL:", token);

    if (token) {
      try {
        const base64Payload = token.split(".")[1];
        const payload = JSON.parse(atob(base64Payload));
        console.log("Decoded payload:", payload);

        login({
          id: payload.id,
          name: payload.name,
          email: payload.email,
          role: payload.role,
          picture: payload.picture || null,
        });

        navigate("/");
        toast.success("Connexion réussie !");
      } catch (err) {
        console.error("Failed to parse token:", err);
        navigate("/login");
      }
    } else {
      console.log("No token found, redirecting to login");
      navigate("/login");
    }
  }, [login, navigate]);

  return <div>Connexion réussie, redirection...</div>;
};

export default OAuthSuccess;

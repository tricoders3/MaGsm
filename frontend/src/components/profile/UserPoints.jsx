
import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../constante";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const UserPoints = () => {
  const { user } = useAuth(); 
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchPoints = async () => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/user/me`,
        { withCredentials: true }
      );

      setPoints(data.loyaltyPoints || 0);

    } catch (err) {
      toast.error("Erreur lors du chargement des points");
    } finally {
      setLoading(false);
    }
  };

  fetchPoints();
}, []);


  return (
<div className="container py-5">
  <div className="row justify-content-center">
      <div className="card shadow-lg rounded-4 border-0  p-4" style={{ backgroundColor: "#f8f9fa" }}>
      <h4 className="card-title mb-4">Mes Points</h4>

        {points > 0 ? (
          <>
            <p className="display-3 fw-bold text-primary mb-2">{points}</p>
            <p className="text-muted">Vous avez accumulé ces points grâce à vos achats.</p>
          </>
        ) : (
          <p className="text-muted">Vous n’avez aucun point pour le moment.</p>
        )}
      </div>
    </div>
  </div>

  );
};

export default UserPoints;

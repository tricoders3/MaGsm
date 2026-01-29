
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
        <div className="card shadow-lg rounded-4 border-0">
          <div className="card-body p-4">
        
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="card-title mb-0">Mes Points</h4>
          <span className="badge-points">
            Points fidélité
          </span>
        </div>

        {points > 0 ? (
          <>
            <div className="mb-2 points-label">
            <p className="text-muted mb-2">
              Vous avez accumulé ces points grâce à vos achats.
            </p>
              {points}
              <span> pts</span>
            </div>
         
          </>
        ) : (
          <p className="text-muted mb-0">
            Vous n’avez aucun point pour le moment.
          </p>
        )}
      </div>
    </div>
  </div>
  </div>


  );
};

export default UserPoints;

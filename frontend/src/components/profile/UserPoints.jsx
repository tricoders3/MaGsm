
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

    } finally {
      setLoading(false);
    }
  };

  fetchPoints();
}, []);


  return (
    <div className="container">
    <div className="row justify-content-center">
      <div className="card shadow-sm rounded-4 border-0">
        <div className="card-body px-4 py-4">
  
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="card-title mb-0 fw-bold">Mes Points</h4>
            <span className="badge-points px-3">
              {points} pts
            </span>
          </div>
  
          {points > 0 ? (
            <>
              <p className="text-muted mb-2" style={{ fontSize: "0.9rem" }}>
                Vous avez accumulé ces points grâce à vos achats.
              </p>
  
              {/* Info box */}
              <div
                className="d-flex align-items-start bg-light border-start border-4 border-primary rounded-3 p-2 mb-0"
                dir="rtl"
                style={{ fontSize: "0.85rem", gap: "0.5rem" }}
              >
                <span style={{ fontSize: "1rem" }}>ℹ️</span>
                <span>
                  🎁 تنجم تستعمل <strong>Points fidélité</strong> متاعك كي توصل على الأقل 500 points 😉
                </span>
              </div>
            </>
          ) : (
            <p className="text-muted mb-0">Vous n’avez aucun point pour le moment.</p>
          )}
  
        </div>
      </div>
    </div>
  </div>
  


  );
};

export default UserPoints;

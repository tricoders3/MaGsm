
import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../constante";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const UserPoints = () => {
  const { user } = useAuth(); // ✅ get user from context
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchPoints = async () => {
      try {
        const { data } = await axios.get(
          `${BASE_URL}/api/user/me`,
          { withCredentials: true }
        );

        setPoints(data.user?.loyaltyPoints || 0);
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Erreur lors du chargement des points"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPoints();
  }, [user]);

  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body text-center">
        <h5 className="card-title">Mes Points</h5>
        {loading ? (
          <p>Chargement...</p>
        ) : (
          <p className="display-4 fw-bold text-primary">
            {points}
          </p>
        )}
      </div>
    </div>
  );
};

export default UserPoints;

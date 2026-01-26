import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../constante";
import { toast } from "react-toastify";

const UserPoints = () => {
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user?.id) throw new Error("Utilisateur non trouvé");

        const { data } = await axios.get(
          `${BASE_URL}/api/user/loyalty-points`,
          { withCredentials: true }
        );

        setPoints(data.points || 0);
      } catch (err) {
        toast.error(err.response?.data?.message || err.message || "Erreur lors du chargement des points");
      } finally {
        setLoading(false);
      }
    };

    fetchPoints();
  }, []);

  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body text-center">
        <h5 className="card-title">Mes Points</h5>
        {loading ? <p>Chargement...</p> : <p className="display-4 fw-bold">{points}</p>}
      </div>
    </div>
  );
};

export default UserPoints;

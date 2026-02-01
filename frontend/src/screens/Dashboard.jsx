import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = ({ user: propUser }) => {
  const [user, setUser] = useState(propUser || null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      const userFromStorage = JSON.parse(localStorage.getItem("user"));
      if (userFromStorage) {
        setUser(userFromStorage);
      } else {
        navigate("/login");
      }
    }
  }, [user, navigate]);




  return (
    <div className="container mt-5 text-center">
      <h1>Bienvenue, {user.name || user.email} !</h1>
      <img
        src={user.picture || "https://via.placeholder.com/120"}
        alt={user.name}
        className="rounded-circle mt-3 mb-3"
        style={{ width: "120px", height: "120px" }}
      />
      <p>Email : {user.email}</p>
      
    </div>
  );
};

export default Dashboard;

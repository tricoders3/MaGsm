import { useState } from "react";
import PasswordForm from "../components/profile/PasswordForm";
import ProfileDataForm from "../components/profile/ProfileDataForm";
import HistoriqueCommandes from "../components/profile/HistoriqueCommandes";
import UserPoints from "../components/profile/UserPoints";

const UserProfile = () => {
  const [selected, setSelected] = useState("profile"); // default selection

  return (
    <div className="container-fluid py-4">
      <div className="row">
        {/* 🔹 Sidebar */}
        <div className="col-md-3 col-lg-2 mb-4">
          <div className="list-group">
            <button
              className={`list-group-item list-group-item-action ${
                selected === "profile" ? "active" : ""
              }`}
              onClick={() => setSelected("profile")}
            >
              Informations personnelles
            </button>
            <button
              className={`list-group-item list-group-item-action ${
                selected === "password" ? "active" : ""
              }`}
              onClick={() => setSelected("password")}
            >
              Changer mot de passe
            </button>
            <button
              className={`list-group-item list-group-item-action ${
                selected === "orders" ? "active" : ""
              }`}
              onClick={() => setSelected("orders")}
            >
              Historique des commandes
            </button>
            <button
              className={`list-group-item list-group-item-action ${
                selected === "points" ? "active" : ""
              }`}
              onClick={() => setSelected("points")}
            >
              Mes points
            </button>
          </div>
        </div>

        {/* 🔹 Main content */}
        <div className="col-md-9 col-lg-10">
          {selected === "profile" && <ProfileDataForm />}
          {selected === "password" && <PasswordForm />}
          {selected === "orders" && <HistoriqueCommandes />}
          {selected === "points" && <UserPoints />}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

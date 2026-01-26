import { useState } from "react";
import {
  FiUser,
  FiLock,
  FiShoppingBag,
  FiStar
} from "react-icons/fi";

import PasswordForm from "../components/profile/PasswordForm";
import ProfileDataForm from "../components/profile/ProfileDataForm";
import HistoriqueCommandes from "../components/profile/HistoriqueCommandes";
import UserPoints from "../components/profile/UserPoints";

const UserProfile = () => {
  const [selected, setSelected] = useState("profile");

  return (
    <div className="container-fluid py-4">
      <div className="row">

        {/* Sidebar */}
        <div className="col-md-3 col-lg-2">
          <div className="card shadow-sm">
            <div className="card-body p-2">

              <button
                className={`list-group-item list-group-item-action d-flex align-items-center gap-2 ${
                  selected === "profile" ? "active" : ""
                }`}
                onClick={() => setSelected("profile")}
              >
                <FiUser /> Profil
              </button>

              <button
                className={`list-group-item list-group-item-action d-flex align-items-center gap-2 ${
                  selected === "password" ? "active" : ""
                }`}
                onClick={() => setSelected("password")}
              >
                <FiLock /> Mot de passe
              </button>

              <button
                className={`list-group-item list-group-item-action d-flex align-items-center gap-2 ${
                  selected === "orders" ? "active" : ""
                }`}
                onClick={() => setSelected("orders")}
              >
                <FiShoppingBag /> Commandes
              </button>

              <button
                className={`list-group-item list-group-item-action d-flex align-items-center gap-2 ${
                  selected === "points" ? "active" : ""
                }`}
                onClick={() => setSelected("points")}
              >
                <FiStar /> Points
              </button>

            </div>
          </div>
        </div>

        {/* Content */}
        <div className="col-md-9 col-lg-10">
          <div className="card shadow-sm p-4">
            {selected === "profile" && <ProfileDataForm />}
            {selected === "password" && <PasswordForm />}
            {selected === "orders" && <HistoriqueCommandes />}
            {selected === "points" && <UserPoints />}
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserProfile;

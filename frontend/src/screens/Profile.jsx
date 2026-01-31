import { useState, useEffect } from "react";
import {
  FiUser,
  FiLock,
  FiShoppingBag,
  FiStar, 
  FiMapPin
  
} from "react-icons/fi";
import { useLocation } from "react-router-dom";
import PasswordForm from "../components/profile/PasswordForm";
import ProfileDataForm from "../components/profile/ProfileDataForm";
import HistoriqueCommandes from "../components/profile/HistoriqueCommandes";
import UserPoints from "../components/profile/UserPoints";
import AddressForm from "../components/profile/AddressForm";

const UserProfile = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialTab = params.get("tab") || "profile";

  const [selected, setSelected] = useState(initialTab);

  // Update selected tab if the query param changes
  useEffect(() => {
    setSelected(initialTab);
  }, [initialTab]);

      return (
        <div className="container-fluid py-4">
          <div className="row">
    
            {/* Sidebar */}
            <div className="col-md-3 col-lg-2">
              <div className="d-flex flex-column rounded-4 shadow-sm p-2 mb-4">
                {[
                  { key: "profile", icon: <FiUser />, label: "Profil" },
                  { key: "password", icon: <FiLock />, label: "Mot de passe" },
                  { key: "address", icon: <FiMapPin />, label: "Adresse" },
                  { key: "orders", icon: <FiShoppingBag />, label: "Commandes" },
                  { key: "points", icon: <FiStar />, label: "Points" },
                ].map((item) => (
                  <button
                    key={item.key}
                    className={`btn btn-light text-start d-flex align-items-center gap-2 mb-2 ${
                      selected === item.key ? "active-sidebar" : "hover-sidebar"
                    }`}
                    onClick={() => setSelected(item.key)}
                    style={{ borderRadius: "12px" }}
                  >
                    {item.icon} <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
    
            {/* Content */}
            <div className="col-md-9 col-lg-10">
              <div>
                {selected === "profile" && <ProfileDataForm />}
                {selected === "password" && <PasswordForm />}
                {selected === "address" && <AddressForm />}
                {selected === "orders" && <HistoriqueCommandes />}
                {selected === "points" && <UserPoints />}
              </div>
            </div>
    
          </div>
        </div>
      );
    };
    

export default UserProfile;

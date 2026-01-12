import React, { useState, useRef, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { FiLogOut, FiUser } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminNavBar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);

  /* Close dropdown on outside click */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav className="admin-navbar">
        <div className="container-fluid d-flex justify-content-between align-items-center px-4">

          {/* Left */}
          <div className="d-flex align-items-center gap-3">
            <FaBars
              size={20}
              className="admin-toggle"
              onClick={onToggleSidebar}
            />
          </div>

          {/* Right */}
          <div className="admin-user-wrapper" ref={menuRef}>
            <button
              className="admin-user-btn"
              onClick={() => setOpenMenu(!openMenu)}
            >
              <div className="admin-avatar">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="admin-username">
                {user?.name}
              </span>
            </button>

            {openMenu && (
              <div className="admin-user-menu">
                <button
                  onClick={() => navigate("/admin/profile")}
                >
                  <FiUser /> Profil
                </button>

                <button
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="logout"
                >
                  <FiLogOut /> Déconnexion
                </button>
              </div>
            )}
          </div>

        </div>
      </nav>
    </>
  );
};

export default AdminNavBar;

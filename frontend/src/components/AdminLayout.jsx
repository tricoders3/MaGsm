import React from "react";
import { Outlet } from "react-router-dom";
import AdminNavBar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";


const AdminLayout = () => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  return (
    <div className={`admin-layout ${isCollapsed ? "is-collapsed" : ""}`}>
      <AdminSidebar onToggleSidebar={toggleSidebar} />
      <div className="admin-main">
        <AdminNavBar onToggleSidebar={toggleSidebar} />
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

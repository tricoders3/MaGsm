import React from "react";
import { Outlet } from "react-router-dom";
import AdminNavBar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";
import { LoadingProvider } from "../context/LoadingContext";
import LoadingBinder from "./LoadingBinder";

const AdminLayout = () => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  return (
      <LoadingProvider>
       <LoadingBinder />
       <div className="app-layout d-flex flex-column min-vh-100">
    <div className={`admin-layout ${isCollapsed ? "is-collapsed" : ""}`}>
      <AdminSidebar onToggleSidebar={toggleSidebar} />
      <div className="admin-main">
        <AdminNavBar onToggleSidebar={toggleSidebar} />
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
    </div>  
    </LoadingProvider>
  );
};

export default AdminLayout;

import { Outlet, NavLink } from "react-router-dom";
import { BsSpeedometer2, BsTags, BsBox, BsPercent, BsPeople } from "react-icons/bs";


const AdminLayout = () => {
  return (
    <div className="admin-layout d-flex">
      {/* Sidebar */}
      <nav className="sidebar bg-dark text-white">
        <div className="sidebar-header px-3 py-4">
          <h4 className="mb-0">Admin Dashboard</h4>
        </div>
        <ul className="nav flex-column sidebar-nav">
          <li className="nav-item">
            <NavLink className="nav-link" to="/admin">
              <BsSpeedometer2 className="me-2" /> Dashboard
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/admin/categories">
              <BsTags className="me-2" /> Catégories
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/admin/products">
              <BsBox className="me-2" /> Produits
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/admin/promos">
              <BsPercent className="me-2" /> Promotions
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/admin/users">
              <BsPeople className="me-2" /> Utilisateurs
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="content flex-grow-1 p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;

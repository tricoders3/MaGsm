import { Outlet, Link } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="bg-dark text-white p-3" style={{ width: "220px", minHeight: "100vh" }}>
        <h5 className="mb-4">Admin Dashboard</h5>
        <ul className="nav flex-column">
          <li className="nav-item"><Link className="nav-link text-white" to="/admin">Dashboard</Link></li>
          <li className="nav-item"><Link className="nav-link text-white" to="/admin/categories">Categories</Link></li>
          <li className="nav-item"><Link className="nav-link text-white" to="/admin/products">Produits</Link></li>
          <li className="nav-item"><Link className="nav-link text-white" to="/admin/promos">Promotions</Link></li>
          <li className="nav-item"><Link className="nav-link text-white" to="/admin/users">Utilisateurs</Link></li>
        </ul>
      </div>

      {/* Content */}
      <div className="p-4 w-100">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;

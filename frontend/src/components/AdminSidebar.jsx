
import React from "react";
import { NavLink } from "react-router-dom";
import {
    FiHome,
    FiUsers,
    FiBox,
    FiLayers,
    FiTag,
    FiInfo,
    FiPhone,
    FiShoppingCart,
    FiUserPlus,FiStar
  } from "react-icons/fi";


  
const AdminSidebar = ({ onToggleSidebar }) => {

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header d-flex align-items-center justify-content-between px-3 py-3">
        <h5 className="brand mb-0">Admin Menu</h5>
        <button
          type="button"
          className="btn btn-sm btn-light d-lg-none"
          onClick={onToggleSidebar}
        >
          ×
        </button>
      </div>

      <nav className="sidebar-nav px-2">
        <NavLink to="/admin" className={({isActive}) => `nav-link${isActive ? ' active' : ''}`} end>
          <FiHome size={18} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/admin/users" className={({isActive}) => `nav-link${isActive ? ' active' : ''}`}>
          <FiUsers size={18} />
          <span>Users</span>
        </NavLink>


 <NavLink to="/admin/pending-users" className={({ isActive }) => `nav-link position-relative${isActive ? " active" : ""}`}>
          <FiUserPlus size={18} />
          <span className="ms-2">Demandes</span>
        </NavLink>



        <NavLink to="/admin/products" className={({isActive}) => `nav-link${isActive ? ' active' : ''}`}>
          <FiBox size={18} />
          <span>Products</span>
        </NavLink>
        <NavLink to="/admin/brands" className={({isActive}) => `nav-link${isActive ? ' active' : ''}`}>
          <FiStar size={18} />
          <span>Marques</span>
        </NavLink>
         <NavLink to="/admin/orders" className={({isActive}) => `nav-link position-relative${isActive ? ' active' : ''}`}>
          <FiShoppingCart size={18} />
          <span className="ms-2">Orders</span>
        </NavLink>
        <NavLink to="/admin/categories" className={({isActive}) => `nav-link${isActive ? ' active' : ''}`}>
          <FiLayers size={18} />
          <span>Categories</span>
        </NavLink>

        <NavLink to="/admin/promos" className={({isActive}) => `nav-link${isActive ? ' active' : ''}`}>
          <FiTag size={18} />
          <span>Promotions</span>
        </NavLink>


 

        <NavLink to="/admin/about" className={({isActive}) => `nav-link${isActive ? ' active' : ''}`}>
          <FiInfo size={18} />
          <span>About Us</span>
        </NavLink>

        <NavLink to="/admin/contact" className={({isActive}) => `nav-link${isActive ? ' active' : ''}`}>
          <FiPhone size={18} />
          <span>Contact</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default AdminSidebar;


import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
    FiHome,
    FiUsers,
    FiBox,
    FiLayers,
    FiTag,
    FiImage,
    FiInfo,
    FiPhone,
    FiShoppingCart,
    FiUserPlus
  } from "react-icons/fi";
  import axios from "axios";
  import BASE_URL from "../constante";

  
const AdminSidebar = ({ onToggleSidebar }) => {
const [pendingUsersCount, setPendingUsersCount] = useState(0);
const [pendingOrdersCount, setPendingOrdersCount] = useState(0);


  // Récupérer le nombre de demandes en attente
  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/auth/pending-requests`,
          { withCredentials: true }
        );
        setPendingUsersCount(res.data.length);
      } catch (error) {
        console.error("Erreur lors de la récupération des demandes en attente");
      }
    };

    fetchPending();

    // Optionnel : refresh toutes les 30 secondes
    const interval = setInterval(fetchPending, 30000);
    return () => clearInterval(interval);
  }, []);
    useEffect(() => {
    const fetchPendingOrders = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/orders`, { withCredentials: true });
        // Count only pending orders
        const pending = res.data.filter(order => order.status === "pending").length;
        setPendingOrdersCount(pending);
      } catch (err) {
        console.error("Erreur lors du chargement des commandes");
      }
    };

    fetchPendingOrders();
    const interval = setInterval(fetchPendingOrders, 30000);
    return () => clearInterval(interval);
  }, []);
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

        <NavLink to="/admin/banner" className={({isActive}) => `nav-link${isActive ? ' active' : ''}`}>
          <FiImage size={18} />
          <span>Banner</span>
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

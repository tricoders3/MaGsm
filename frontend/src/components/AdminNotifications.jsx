import React, { useEffect, useRef, useState } from "react";
import { FiBell } from "react-icons/fi";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import BASE_URL from "../constante";

export default function AdminNotifications() {
  const [open, setOpen] = useState(false);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [pendingUsers, setPendingUsers] = useState(0);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch counts from backend
  const fetchCounts = async () => {
    try {
      // --- ORDERS ---
      const { data: orders } = await axios.get(`${BASE_URL}/api/orders`, { withCredentials: true });
      console.log("Orders fetched:", orders);

      // Get last seen time
      const lastSeenOrders = Number(localStorage.getItem("lastSeenOrders") || 0);

      // Count only new pending orders
      const newOrdersCount = (orders || []).filter(order => {
        const created = new Date(order.createdAt).getTime();
        return (order.orderStatus || "pending").toLowerCase() === "pending" && created > lastSeenOrders;
      }).length;

      // --- USERS ---
      const { data: users } = await axios.get(`${BASE_URL}/api/auth/pending-requests`, { withCredentials: true });
      console.log("Pending users fetched:", users);

      const lastSeenUsers = Number(localStorage.getItem("lastSeenUsers") || 0);

      const newUsersCount = (users || []).filter(user => {
        const created = new Date(user.createdAt).getTime();
        return created > lastSeenUsers;
      }).length;

      setPendingOrders(location.pathname !== "/admin/orders" ? newOrdersCount : 0);
      setPendingUsers(location.pathname !== "/admin/pending-users" ? newUsersCount : 0);

    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  // --- Polling + refresh ---
  useEffect(() => {
    fetchCounts();
    const interval = setInterval(fetchCounts, 30000);
    return () => clearInterval(interval);
  }, [location.pathname]);

  // --- Reset counts on route visit ---
  useEffect(() => {
    if (location.pathname === "/admin/orders") {
      localStorage.setItem("lastSeenOrders", Date.now());
      setPendingOrders(0);
    }

    if (location.pathname === "/admin/pending-users") {
      localStorage.setItem("lastSeenUsers", Date.now());
      setPendingUsers(0);
    }
  }, [location.pathname]);

  // --- Close dropdown when clicking outside ---
  useEffect(() => {
    const handleClickOutside = e => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const total = pendingOrders + pendingUsers;

  return (
    <div className="admin-notifications" ref={menuRef}>
      <button
        className="admin-bell-btn"
        onClick={() => setOpen(v => !v)}
        aria-label="Notifications"
      >
        <FiBell size={20} />
        {total > 0 && <span className="badge-dot">{total}</span>}
      </button>

      {open && (
        <div className="admin-bell-menu">
          <div className="menu-header">Notifications</div>

          {pendingOrders > 0 && (
            <button
              className="menu-item"
              onClick={() => {
                localStorage.setItem("lastSeenOrders", Date.now());
                setPendingOrders(0);
                setOpen(false);
                navigate("/admin/orders");
              }}
            >
              Commandes en attente
              <span className="count-pill ms-auto">{pendingOrders}</span>
            </button>
          )}

          {pendingUsers > 0 && (
            <button
              className="menu-item"
              onClick={() => {
                localStorage.setItem("lastSeenUsers", Date.now());
                setPendingUsers(0);
                setOpen(false);
                navigate("/admin/pending-users");
              }}
            >
              Demandes d'inscription
              <span className="count-pill ms-auto">{pendingUsers}</span>
            </button>
          )}

          {total === 0 && <div className="menu-empty">Aucune notification</div>}
        </div>
      )}
    </div>
  );
}
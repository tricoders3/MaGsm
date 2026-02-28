import React, { useEffect, useRef, useState } from "react";
import { FiBell } from "react-icons/fi";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../constante";

export default function AdminNotifications() {
  const [open, setOpen] = useState(false);
  // Displayed counts (after applying 'seen' offsets)
  const [pendingOrders, setPendingOrders] = useState(0);
  const [pendingUsers, setPendingUsers] = useState(0);
  // Raw counts from backend
  const rawOrdersRef = useRef(0);
  const rawUsersRef = useRef(0);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const fetchCounts = async () => {
    try {
      // Orders
      const { data: orders } = await axios.get(`${BASE_URL}/api/orders`, { withCredentials: true });
      const pOrders = (orders || []).filter(o => (o.status || "").toLowerCase() === "pending").length;
      rawOrdersRef.current = pOrders;

      const seenOrders = Number(localStorage.getItem("notif_seen_orders") || 0);
      setPendingOrders(Math.max(0, pOrders - seenOrders));

      // Pending user requests
      const { data: users } = await axios.get(`${BASE_URL}/api/auth/pending-requests`, { withCredentials: true });
      const pUsers = Array.isArray(users) ? users.length : 0;
      rawUsersRef.current = pUsers;

      const seenUsers = Number(localStorage.getItem("notif_seen_users") || 0);
      setPendingUsers(Math.max(0, pUsers - seenUsers));
    } catch (e) {
      // silent fail
    }
  };

  useEffect(() => {
    fetchCounts();
    const id = setInterval(fetchCounts, 30000); 
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onDocClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const total = pendingOrders + pendingUsers;

  return (
    <div className="admin-notifications" ref={menuRef}>
      <button className="admin-bell-btn" onClick={() => setOpen(v => !v)} aria-label="Notifications">
        <FiBell size={20} />
        {total > 0 && <span className="badge-dot">{total}</span>}
      </button>

      {open && (
        <div className="admin-bell-menu">
          <div className="menu-header">Notifications</div>
          {pendingOrders > 0 && (
          <button className="menu-item" onClick={() => {
      
            localStorage.setItem("notif_seen_orders", String(rawOrdersRef.current || 0));
            setPendingOrders(0);
            setOpen(false);
            navigate("/admin/orders");
          }}>
            Commandes en attente
            {pendingOrders > 0 && <span className="count-pill ms-auto">{pendingOrders}</span>}
          </button>
          )}
          {pendingUsers > 0 && (
          <button className="menu-item" onClick={() => {
      
            localStorage.setItem("notif_seen_users", String(rawUsersRef.current || 0));
            setPendingUsers(0);
            setOpen(false);
            navigate("/admin/pending-users");
          }}>
            Demandes d'inscription
            {pendingUsers > 0 && <span className="count-pill ms-auto">{pendingUsers}</span>}
          </button>
          )}
          {total === 0 && <div className="menu-empty">Aucune notification</div>}
        </div>
      )}
     
    </div>
  );
}

import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "./components/Navbar";
import TopBar from "./components/TopBar";
import Footer from "./components/Footer";
import OAuthSuccess from "./components/OAuthSuccess";
import Home from "./screens/Home";
import Login from "./screens/login";
import Register from "./screens/register";
import Dashboard from "./screens/Dashboard";
import './assets/css/style.css';
import './assets/css/responsive.css';
import '@fortawesome/fontawesome-free/css/all.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './assets/styles/index.css';
import './assets/styles/modern-theme.css';
import './assets/styles/complete-redesign.css';



function App() {
  const [user, setUser] = useState(null);




  return (
    <>
      <TopBar />
      <Navbar />
      <div className="main-content">
       <Routes>
         <Route path="/" element={<Home />} />
  <Route path="/register" element={<Register />} />
  <Route path="/login" element={<Login setUser={setUser} />} />

  <Route path="/dashboard" element={<Dashboard user={user} />} />
  <Route path="/oauth-success" element={<OAuthSuccess setUser={setUser} />} />
</Routes>

       
      </div>
      <Footer />
    </>
  );
}

export default App;

import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import OAuthSuccess from "./components/OAuthSuccess";
import Home from "./screens/Home";
import Login from "./screens/login";
import Register from "./screens/register";
import Dashboard from "./screens/Dashboard";
import Layout from "./components/Layout";
import About from "./screens/About";
import ProductsCategory from "./components/ProductsCategory";
import ProductsByCategory from "./components/ProductsByCategoy";
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
       <Routes>
       <Route element={<Layout />}>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
  <Route path="/register" element={<Register />} />
  <Route path="/login" element={<Login setUser={setUser} />} />

  <Route path="/dashboard" element={<Dashboard user={user} />} />
  <Route path="/oauth-success" element={<OAuthSuccess setUser={setUser} />} />
  <Route path="/" element={<ProductsCategory />} />
  <Route path="/category/:categoryId" element={<ProductsByCategory />} />
  
  </Route>
</Routes>      
    </>

  );
}

export default App;

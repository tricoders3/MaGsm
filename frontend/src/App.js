import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import OAuthSuccess from "./components/OAuthSuccess";
import Home from "./screens/Home";
import Login from "./screens/login";
import Register from "./screens/register";
import Dashboard from "./screens/Dashboard";
import Layout from "./components/Layout";
import About from "./screens/About";
import Contact from "./screens/Contact";
import SubCategories from "./components/SubCategories";
import ProductsCategory from "./components/ProductsCategory";
import ProductsByCategory from "./components/ProductsByCategoy";
import OffersModal from "./components/OffersModal";
import Offer from "./screens/Offers";
import Cart from "./screens/Cart";
import Favoris from "./screens/Favoris";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./screens/admin/Dashboard";
import Categories from "./screens/admin/Categories";
import ProductsAdmin from "./screens/admin/Products";
import Promos from "./screens/admin/Promos";
import Products from "./screens/products.jsx";
import Users from "./screens/admin/Users";
import ProductDetails from "./screens/ProductDetails.jsx";
import './assets/css/style.css';
import './assets/css/responsive.css';
import '@fortawesome/fontawesome-free/css/all.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './assets/styles/index.css';
import './assets/styles/modern-theme.css';
import './assets/styles/complete-redesign.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";



function App() {
  const [user, setUser] = useState(null);




  return (
    <>
     <OffersModal />
     <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />

       <Routes>
       <Route element={<Layout />}>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/offers" element={<Offer />} />
  <Route path="/register" element={<Register />} />
  <Route path="/login" element={<Login setUser={setUser} />} />
  <Route path="/cart" element={<Cart />} />
  <Route path="/favoris" element={<Favoris />} />
  <Route path="/dashboard" element={<Dashboard user={user} />} />
  <Route path="/oauth-success" element={<OAuthSuccess setUser={setUser} />} />
  <Route path="/category/:categoryId" element={<SubCategories />} />
  <Route path="/products/category" element={<ProductsCategory />} />
    <Route path="/products" element={<Products />} />
  <Route
  path="/products/subcategory/:subcategoryId"
  element={<ProductsByCategory />}
/>
<Route path="/products/:productId" element={<ProductDetails />} />

<Route path="/admin" element={<AdminLayout />}>
    <Route index element={<AdminDashboard />} />
    <Route path="categories" element={<Categories />} />
 
    <Route path="products" element={<ProductsAdmin />} />
    <Route path="promos" element={<Promos />} />
    <Route path="users" element={<Users />} />
  </Route>
  
  </Route>
</Routes>      
    </>

  );
}

export default App;
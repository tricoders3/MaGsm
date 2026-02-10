import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import OAuthSuccess from "./components/OAuthSuccess";
import Home from "./screens/Home";
import Login from "./screens/login";
import Register from "./screens/register";
import Dashboard from "./screens/Dashboard";
import SearchPage from "./screens/SearchPage";
import Checkout from "./screens/Checkout"
import TopProduct from "./screens/TopProduct"
import OrderConfirmation from "./screens/OrderConfirmation";
import Layout from "./components/Layout";
import About from "./screens/About";
import Contact from "./screens/Contact";
import NotFound from "./screens/NotFound";
import SubCategories from "./components/SubCategories";
import ProductsCategory from "./components/ProductsCategory";
import ProductsByCategory from "./components/ProductsByCategoy";
import OffersModal from "./components/OffersModal";
import AdminProfile from "./screens/admin/AdminProfile"
import Offer from "./screens/Offers";
import Cart from "./screens/Cart";
import Favoris from "./screens/Favoris";
import AdminLayout from "./components/AdminLayout";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./screens/admin/Dashboard";
import Categories from "./screens/admin/Categories";
import Orders from "./screens/admin/Orders";
import ProductsAdmin from "./screens/admin/Products";
import Promos from "./screens/admin/Promos";
import Products from "./screens/products.jsx";
import Users from "./screens/admin/Users";
import WaitingApproval from "./screens/waiting-approval.jsx";
import ForgotPassword from "./screens/ForgotPassword.jsx";
import AdminAbout from "./screens/admin/AdminAbout";
import Brands from "./screens/admin/Brands.jsx";
import AdminContact from "./screens/admin/AdminContact";
import Profile from "./screens/Profile.jsx";
import PendingUsers from "./screens/admin/PendingUsers.jsx";
import ProductDetails from "./screens/ProductDetails.jsx";
import ResetPassword from "./screens/ResetPassword.jsx";
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
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    // Define all admin routes
    const adminPaths = ["/admin"];
    
    // Pages where search is hidden
    const noSearchPaths = [  
      "/profile",
      "/login",
      "/register",
      "/checkout",
      "/order-confirmation",
      "/not-found"
    ];
  
    // Check current path
    const isAdminPage = adminPaths.some(path =>
      location.pathname.startsWith(path)
    );
    const isNoSearchPage = noSearchPaths.some(path =>
      location.pathname.startsWith(path)
    );
  
    if (!isAdminPage) {
      document.body.classList.add("user-page");
  
      // Add a class to remove search bar padding
      if (isNoSearchPage) {
        document.body.classList.add("no-search");
      } else {
        document.body.classList.remove("no-search");
      }
    } else {
      document.body.classList.remove("user-page", "no-search");
    }
  }, [location.pathname]);
  

  return (
    <>
     {!user?.isAdmin && <OffersModal />}
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
       <Route path="/waiting-approval" element={<WaitingApproval/>} />
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />     
      <Route path="/contact" element={<Contact />} />
      <Route path="/offers" element={<Offer />} />
  <Route path="/register" element={<Register />} />
  <Route path="/login" element={<Login setUser={setUser} />} />
  <Route path="/cart" element={<Cart />} />
  <Route path="/favoris" element={<Favoris />} />
  <Route path="/checkout" element={<Checkout />} />
  <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
  <Route path="/dashboard" element={<Dashboard user={user} />} />
  <Route path="/oauth-success" element={<OAuthSuccess setUser={setUser} />} />
  <Route path="/category/:categoryId" element={<SubCategories />} />
  <Route path="/products/category" element={<ProductsCategory />} />
    <Route path="/products" element={<Products />} />
    <Route path="/top-products" element={<TopProduct />} />
    <Route path="/recherche" element={<SearchPage />} />
    <Route path="/profile" element={<Profile />} />


  <Route
  path="/products/subcategory/:subcategoryId"
  element={<ProductsByCategory />}
/>
<Route path="/products/:productName" element={<ProductDetails />} />
<Route path="/not-found" element={<NotFound />} />
<Route path="*" element={<Navigate to="/not-found" />} />
<Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password/:token" element={<ResetPassword />} />
  </Route>

<Route element={<AdminRoute />}>
    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<AdminDashboard />} />
      <Route path="profile" element={<AdminProfile />} />
      <Route path="categories" element={<Categories />} />
      <Route path="products" element={<ProductsAdmin />} />
      <Route path="promos" element={<Promos />} />
      <Route path="orders" element={<Orders />} />
      <Route path="users" element={<Users />} />
      <Route path="brands" element={<Brands />} />
  <Route path="about" element={<AdminAbout />} />
  <Route path="contact" element={<AdminContact />} />
  <Route path="pending-users" element={<PendingUsers />} />
    </Route>

  </Route>
</Routes>      
    </>

  );
}

export default App;
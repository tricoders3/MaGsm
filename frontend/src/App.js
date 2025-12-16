import Navbar from "./components/Navbar";
import { Outlet } from 'react-router-dom';
import Footer from "./components/Footer";
import Home from "./screens/Home";
import { Routes, Route } from "react-router-dom";
import './assets/css/style.css';
import './assets/css/responsive.css';
import '@fortawesome/fontawesome-free/css/all.css';
import "bootstrap/dist/css/bootstrap.min.css";
// import './assets/styles/bootstrap.custom.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './assets/styles/index.css';
import './assets/styles/modern-theme.css';
import './assets/styles/complete-redesign.css';
function App() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Routes>
        <Route path="/" element={<Home />} />
       
      </Routes>
      <Footer />
    </>
  );
}

export default App;

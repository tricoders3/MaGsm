import { Outlet } from "react-router-dom";
import TopBar from "./TopBar";
import Navbar from "./Navbar";      
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="app-layout d-flex flex-column min-vh-100">
    <TopBar />
    <Navbar />
    <main className="flex-grow-1">
      <Outlet />
    </main>
    <Footer />
  </div>
  
  );
}

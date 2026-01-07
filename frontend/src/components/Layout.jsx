import { Outlet } from "react-router-dom";
import TopBar from "./TopBar";
import Navbar from "./Navbar";      
import Footer from "./Footer";

export default function Layout() {
  return (
    <>
      <TopBar />
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

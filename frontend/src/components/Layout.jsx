import { Outlet, useLocation } from "react-router-dom";
import TopBar from "./TopBar";
import Navbar from "./Navbar";      
import Footer from "./Footer";
import GlobalSearch from "./Search";
import { SearchProvider } from "../context/SearchContext";
import { useAuth } from "../context/AuthContext"; 
import { LoadingProvider } from "../context/LoadingContext";
import LoadingBinder from "./LoadingBinder";

export default function Layout() {


  return (
    <LoadingProvider>
      <SearchProvider>
        <LoadingBinder />
        <div className="app-layout d-flex flex-column min-vh-100">
          <TopBar />
          <Navbar />
           <GlobalSearch />
          <main className="flex-grow-1">
            <Outlet />
          </main>
          <Footer />
        </div>
      </SearchProvider>
    </LoadingProvider>
  );
}

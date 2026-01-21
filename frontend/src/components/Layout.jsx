import { Outlet } from "react-router-dom";
import TopBar from "./TopBar";
import Navbar from "./Navbar";      
import Footer from "./Footer";
import GlobalSearch from "./Search";
import { SearchProvider } from "../context/SearchContext";
import { useAuth } from "../context/AuthContext"; 

export default function Layout() {
  const { user } = useAuth();
  return (
    <SearchProvider>
      <div className="app-layout d-flex flex-column min-vh-100">
        <TopBar />
        <Navbar />
        {user && <GlobalSearch />}
        <main className="flex-grow-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </SearchProvider>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaChartLine, FaShieldAlt, FaBolt, FaUsers, FaStar,  } from 'react-icons/fa';
import BestSeller from '../components/BestSeller';
import PopularProducts from '../components/PopularProducts';
import HeroCarousel from '../components/HeroSection';
import ProductsCategory from '../components/ProductsCategory';
import Brands from '../components/Brands';
import camera from '../assets/images/camera.png';
const Home = () => {
 
        
  return (
    <div className="home-redesign">
      {/* Hero Section */}
    <HeroCarousel />

      {/*Best Seller Section */}
   

<BestSeller />
      {/* How It Works Section */}
 <ProductsCategory />

      {/* Testimonials Section */}
    <PopularProducts />
      {/* CTA Section */}
    <Brands />
    </div>
  );
};

export default Home;

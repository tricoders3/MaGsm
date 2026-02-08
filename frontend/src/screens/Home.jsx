import React from 'react';
import BestSeller from '../components/BestOffer';
import PopularProducts from '../components/PopularProducts';
import HeroCarousel from '../components/HeroSection';
import ProductsCategory from '../components/ProductsCategory';
import Brands from '../components/Brands';

const Home = () => {
   
  return (
    <div className="home-redesign">
      {/* Hero Section */}
    <HeroCarousel />

<BestSeller />

 <ProductsCategory />
    <PopularProducts />
    <Brands />
    </div>
  );
};

export default Home;

import React from 'react';
import BestOffer from '../components/BestOffer';
import PopularProducts from '../components/PopularProducts';
import HeroCarousel from '../components/HeroSection';
import ProductsCategory from '../components/ProductsCategory';
import Brands from '../components/Brands';

const Home = () => {
   
  return (
    <div className="home-redesign">
      {/* Hero Section */}
    <HeroCarousel />

<BestOffer />

 <ProductsCategory />
    <PopularProducts />
    <Brands />
    </div>
  );
};

export default Home;

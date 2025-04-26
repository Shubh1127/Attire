import React from 'react';
import { Link } from 'react-router-dom';
import { useProductStore } from '../store/productStore';
import ProductGrid from '../components/product/ProductGrid';
import Button from '../components/ui/Button';
import { ShoppingBag, TrendingUp, Star } from 'lucide-react';
import { useTheme } from '../Context/ThemeContext';

const HomePage: React.FC = () => {
  const { getFeaturedProducts, getNewArrivals } = useProductStore();
  const { theme } = useTheme();
  
  const featuredProducts = getFeaturedProducts();
  const newArrivals = getNewArrivals();
  
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Hero Section */}
      <section className="relative h-screen bg-gray-900 flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('https://images.pexels.com/photos/5325588/pexels-photo-5325588.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
            backgroundPosition: "center 30%"
          }}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Elevate Your Style with Premium Fashion
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Discover the latest trends and timeless classics for every occasion.
              Quality clothing designed for comfort and sophistication.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/category/men">
                <Button size="lg" variant="primary">
                  Shop Men's Collection
                </Button>
              </Link>
              <Link to="/category/women">
                <Button size="lg" variant="secondary">
                  Shop Women's Collection
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className={`py-16 ${theme === 'dark' ? 'bg-navy-900' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4">
          <h2 className={`text-3xl font-bold text-center mb-12 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Shop by Category
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Men's Category */}
            <Link 
              to="/category/men" 
              className="relative overflow-hidden rounded-lg group h-80"
            >
              <img 
                src="https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="Men's Collection" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900 to-transparent opacity-80"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-2xl font-bold text-white mb-2">Men</h3>
                <span className="inline-flex items-center text-white text-sm font-medium">
                  Shop Now
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </span>
              </div>
            </Link>
            
            {/* Women's Category */}
            <Link 
              to="/category/women" 
              className="relative overflow-hidden rounded-lg group h-80"
            >
              <img 
                src="https://images.pexels.com/photos/974911/pexels-photo-974911.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="Women's Collection" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900 to-transparent opacity-80"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-2xl font-bold text-white mb-2">Women</h3>
                <span className="inline-flex items-center text-white text-sm font-medium">
                  Shop Now
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </span>
              </div>
            </Link>
            
            {/* Kids' Category */}
            <Link 
              to="/category/kids" 
              className="relative overflow-hidden rounded-lg group h-80"
            >
              <img 
                src="https://images.pexels.com/photos/5693890/pexels-photo-5693890.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="Kids' Collection" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900 to-transparent opacity-80"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-2xl font-bold text-white mb-2">Kids</h3>
                <span className="inline-flex items-center text-white text-sm font-medium">
                  Shop Now
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </span>
              </div>
            </Link>
            
            {/* Footwear Category */}
            <Link 
              to="/category/footwear" 
              className="relative overflow-hidden rounded-lg group h-80"
            >
              <img 
                src="https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="Footwear Collection" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900 to-transparent opacity-80"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-2xl font-bold text-white mb-2">Footwear</h3>
                <span className="inline-flex items-center text-white text-sm font-medium">
                  Shop Now
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className={`py-16 ${theme === 'dark' ? 'bg-navy-800' : ''}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Star className="h-6 w-6 text-amber-500 mr-2" />
              <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Featured Products
              </h2>
            </div>
            <Link 
              to="/featured" 
              className={`font-medium ${
                theme === 'dark' ? 'text-amber-400 hover:text-amber-300' : 'text-navy-600 hover:text-navy-800'
              }`}
            >
              View All
            </Link>
          </div>
          
          <ProductGrid  />
        </div>
      </section>
      
      {/* New Arrivals */}
      <section className={`py-16 ${theme === 'dark' ? 'bg-navy-900' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <TrendingUp className="h-6 w-6 text-amber-500 mr-2" />
              <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                New Arrivals
              </h2>
            </div>
            <Link 
              to="/new-arrivals" 
              className={`font-medium ${
                theme === 'dark' ? 'text-amber-400 hover:text-amber-300' : 'text-navy-600 hover:text-navy-800'
              }`}
            >
              View All
            </Link>
          </div>
          
          <ProductGrid products={newArrivals.slice(0, 4)} />
        </div>
      </section>
      
      {/* Call to Action */}
      <section className={`py-24 ${theme === 'dark' ? 'bg-navy-950' : 'bg-navy-800'} text-white`}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Fashion Community</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and get 10% off your first purchase,
            plus exclusive access to new arrivals and special offers.
          </p>
          
          <div className="max-w-md mx-auto">
            <div className="flex">
              <input
                type="email"
                placeholder="Your email address"
                className={`px-4 py-3 w-full rounded-l-md focus:outline-none ${
                  theme === 'dark' ? 'bg-navy-800 text-white placeholder-gray-400' : 'text-gray-900'
                }`}
              />
              <button className={`px-6 py-3 rounded-r-md font-medium transition-colors ${
                theme === 'dark' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-amber-500 hover:bg-amber-600'
              }`}>
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section className={`py-16 ${theme === 'dark' ? 'bg-navy-800' : ''}`}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Free Shipping */}
            <div className="text-center p-6">
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                theme === 'dark' ? 'bg-navy-700' : 'bg-gray-100'
              }`}>
                <ShoppingBag className={`h-8 w-8 ${
                  theme === 'dark' ? 'text-amber-400' : 'text-navy-800'
                }`} />
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Free Shipping</h3>
              <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                On all orders above ₹999
              </p>
            </div>
            
            {/* Easy Returns */}
            <div className="text-center p-6">
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                theme === 'dark' ? 'bg-navy-700' : 'bg-gray-100'
              }`}>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${
                  theme === 'dark' ? 'text-amber-400' : 'text-navy-800'
                }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3" />
                </svg>
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Easy Returns</h3>
              <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                30-day return policy
              </p>
            </div>
            
            {/* Secure Payment */}
            <div className="text-center p-6">
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                theme === 'dark' ? 'bg-navy-700' : 'bg-gray-100'
              }`}>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${
                  theme === 'dark' ? 'text-amber-400' : 'text-navy-800'
                }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Secure Payment</h3>
              <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                100% secure payments
              </p>
            </div>
            
            {/* 24/7 Support */}
            <div className="text-center p-6">
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                theme === 'dark' ? 'bg-navy-700' : 'bg-gray-100'
              }`}>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${
                  theme === 'dark' ? 'text-amber-400' : 'text-navy-800'
                }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>24/7 Support</h3>
              <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                Dedicated customer support
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
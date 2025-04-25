import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const totalItems = useCartStore(state => state.totalItems());
  const location = useLocation();

  // Navigation items
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Men', path: '/category/men' },
    { name: 'Women', path: '/category/women' },
    { name: 'Kids', path: '/category/kids' },
    { name: 'Footwear', path: '/category/footwear' },
  ];

  // Check if scrolled for changing header style
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when location changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled 
          ? 'bg-white shadow-md py-2' 
          : 'bg-transparent py-4'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-2xl font-bold text-navy-800"
          >
            Attire
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-navy-800',
                  location.pathname === item.path
                    ? 'text-navy-800 border-b-2 border-amber-500 pb-1'
                    : isScrolled ? 'text-gray-700' : 'text-gray-800'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center space-x-4">
            <Link to="/search" className="text-gray-700 hover:text-navy-800">
              <Search className="h-5 w-5" />
            </Link>
            
            <Link to="/cart" className="text-gray-700 hover:text-navy-800 relative">
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            
            <Link 
              to={isAuthenticated ? '/profile' : '/login'} 
              className="text-gray-700 hover:text-navy-800"
            >
              <User className="h-5 w-5" />
            </Link>
            
            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-700 hover:text-navy-800"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute top-full left-0 w-full">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    'text-sm font-medium py-2 transition-colors',
                    location.pathname === item.path
                      ? 'text-navy-800 border-l-4 border-amber-500 pl-4'
                      : 'text-gray-700 pl-4'
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <div className="border-t border-gray-200 pt-4">
                {isAuthenticated ? (
                  <>
                    <p className="text-sm text-gray-600 pl-4">Hello, {user?.name}</p>
                    <Link
                      to="/orders"
                      className="block text-sm font-medium py-2 text-gray-700 hover:text-navy-800 pl-4"
                    >
                      Your Orders
                    </Link>
                    <Link
                      to="/profile"
                      className="block text-sm font-medium py-2 text-gray-700 hover:text-navy-800 pl-4"
                    >
                      Profile
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="block text-sm font-medium py-2 text-gray-700 hover:text-navy-800 pl-4"
                  >
                    Sign In / Register
                  </Link>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, X, Sun, Moon, Package } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useCartStore } from '../../store/cartStore';
import { useTheme } from '../../Context/ThemeContext';
import { useBuyerContext } from '../../Context/BuyerContext';
import supabase from '../../Auth/SupabaseClient';
import { getCookie } from '../../utils/cookies';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { buyer, getProfile } = useBuyerContext();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const totalItems = useCartStore((state) => state.totalItems());
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = getCookie('token');
        const { data: { session }, error: supabaseError } = await supabase.auth.getSession();
        
        if (supabaseError) throw supabaseError;
        
        setIsAuthenticated(!!(token || session?.user));
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Men', path: '/category/men' },
    { name: 'Women', path: '/category/women' },
    { name: 'Kids', path: '/category/kids' },
    { name: 'Footwear', path: '/category/footwear' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white dark:bg-navy-900 shadow-md py-2'
          : 'bg-transparent py-4',
        theme === 'dark' && !isScrolled ? 'bg-opacity-90' : ''
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-navy-800 dark:text-white"
          >
            DS kadianBoutique
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-navy-800 dark:hover:text-amber-400',
                  location.pathname === item.path
                    ? 'text-navy-800 dark:text-amber-400 border-b-2 border-amber-500 pb-1'
                    : isScrolled
                    ? 'text-gray-700 dark:text-gray-300'
                    : 'text-gray-800 dark:text-gray-200'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center space-x-4">
            <Link
              to="/search"
              className="text-gray-700 dark:text-gray-100 hover:text-navy-800 dark:hover:text-amber-400"
            >
              <Search className="h-5 w-5" />
            </Link>

            {isAuthenticated && (
              <Link
                to="/orders"
                className="text-gray-700 dark:text-gray-100 hover:text-navy-800 dark:hover:text-amber-400 relative"
              >
                <Package className="h-5 w-5" />
              </Link>
            )}

            <Link
              to="/cart"
              className="text-gray-700 dark:text-gray-100 hover:text-navy-800 dark:hover:text-amber-400 relative"
            >
              <ShoppingBag className="h-5 w-5" />
              {buyer?.cart?.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {buyer?.cart?.length}
                </span>
              )}
            </Link>

            <Link
              to={isAuthenticated ? '/profile' : '/signup'}
              className="text-gray-700 dark:text-gray-100 hover:text-navy-800 dark:hover:text-amber-400"
            >
              <User className="h-5 w-5" />
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="text-gray-700 dark:text-gray-100 hover:text-navy-800 dark:hover:text-amber-400"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-700 dark:text-gray-300 hover:text-navy-800 dark:hover:text-amber-400"
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
        <div className="md:hidden bg-white dark:bg-navy-900 shadow-lg absolute top-full left-0 w-full">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    'text-sm font-medium py-2 transition-colors',
                    location.pathname === item.path
                      ? 'text-navy-800 dark:text-amber-400 border-l-4 border-amber-500 pl-4'
                      : 'text-gray-700 dark:text-gray-300 pl-4 hover:text-navy-800 dark:hover:text-amber-400'
                  )}
                >
                  {item.name}
                </Link>
              ))}

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                {isAuthenticated ? (
                  <>
                    <p className="text-sm text-gray-600 dark:text-gray-400 pl-4">
                      Hello, {buyer?.name || 'User'}
                    </p>
                    <Link
                      to="/orders"
                      className="block text-sm font-medium py-2 text-gray-700 dark:text-gray-300 hover:text-navy-800 dark:hover:text-amber-400 pl-4"
                    >
                      Your Orders
                    </Link>
                    <Link
                      to="/profile"
                      className="block text-sm font-medium py-2 text-gray-700 dark:text-gray-300 hover:text-navy-800 dark:hover:text-amber-400 pl-4"
                    >
                      Profile
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/signup"
                    className="block text-sm font-medium py-2 text-gray-700 dark:text-gray-300 hover:text-navy-800 dark:hover:text-amber-400 pl-4"
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
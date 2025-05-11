import React, { useContext, useState } from 'react';
import { Bell, Search, HelpCircle, Sun, Moon, Menu, X } from 'lucide-react';
import { ThemeContext } from '../Context/ThemeContext';

const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className={`border-b h-16 flex items-center px-4 sm:px-6 ${
        theme === 'dark' 
          ? 'bg-gray-900 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        {/* Mobile menu button - only shows on small screens */}
        <div className="sm:hidden mr-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-1.5 rounded-lg ${
              theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
          >
            {mobileMenuOpen ? (
              <X size={20} className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} />
            ) : (
              <Menu size={20} className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} />
            )}
          </button>
        </div>

        {/* Search bar - hidden on mobile when not active */}
        <div className={`${searchOpen ? 'block' : 'hidden'} sm:block flex-1`}>
          <div className="relative w-full max-w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={18} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
            </div>
            <input
              type="text"
              className={`border text-sm rounded-lg block w-full pl-10 p-2.5 focus:outline-none focus:ring-1 ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-gray-500'
                  : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-gray-300'
              }`}
              placeholder="Search..."
            />
          </div>
        </div>

        {/* Mobile search button - only shows on small screens */}
        <div className="sm:hidden ml-auto mr-2">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className={`p-1.5 rounded-lg ${
              theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
          >
            <Search size={20} className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} />
          </button>
        </div>

        {/* Desktop icons - hidden on mobile when menu is open */}
        <div className={`${mobileMenuOpen ? 'hidden' : 'flex'} items-center space-x-4`}>
          <button 
            className={`p-1.5 rounded-lg relative hidden sm:block ${
              theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
          >
            <Bell size={20} className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} />
            <span className="absolute top-0 right-0 block w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <button 
            className={`p-1.5 rounded-lg hidden sm:block ${
              theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
          >
            <HelpCircle size={20} className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} />
          </button>
          
          <button
            onClick={toggleTheme}
            className={`p-1.5 rounded-lg ${
              theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
          >
            {theme === 'dark' ? (
              <Sun size={20} className="text-yellow-400" />
            ) : (
              <Moon size={20} className="text-gray-600" />
            )}
          </button>
          
          <div className={`h-8 w-px hidden sm:block ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
          }`}></div>
          
          <div className="hidden sm:flex items-center space-x-2">
            <span className={`text-sm font-medium ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Today, {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>
      </header>

      {/* Mobile menu - appears when menu button is clicked */}
      {mobileMenuOpen && (
        <div className={`sm:hidden border-b ${
          theme === 'dark' 
            ? 'bg-gray-900 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="px-4 py-3 flex flex-col space-y-3">
            <button 
              className={`p-2 rounded-lg flex items-center space-x-2 ${
                theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            >
              <Bell size={20} className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} />
              <span className={`text-sm ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>Notifications</span>
              <span className="block w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <button 
              className={`p-2 rounded-lg flex items-center space-x-2 ${
                theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            >
              <HelpCircle size={20} className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} />
              <span className={`text-sm ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>Help</span>
            </button>
            
            <div className={`p-2 rounded-lg flex items-center space-x-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <span className="text-sm">
                Today, {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
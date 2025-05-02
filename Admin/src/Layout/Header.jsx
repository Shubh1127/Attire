import React, { useContext } from 'react';
import { Bell, Search, HelpCircle, Sun, Moon } from 'lucide-react';
import { ThemeContext } from '../Context/ThemeContext'; // Adjust the path as needed

const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <header className={`border-b h-16 flex items-center px-6 ${
      theme === 'dark' 
        ? 'bg-gray-900 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="flex-1 flex items-center">
        <div className="relative w-64">
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
      
      <div className="flex items-center space-x-4">
        <button 
          className={`p-1.5 rounded-lg relative ${
            theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
          }`}
        >
          <Bell size={20} className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} />
          <span className="absolute top-0 right-0 block w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <button 
          className={`p-1.5 rounded-lg ${
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
        
        <div className={`h-8 w-px ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
        }`}></div>
        
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-medium ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Today, {new Date().toLocaleDateString()}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
import React from 'react';
import { Bell, Search, HelpCircle } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center px-6">
      <div className="flex-1 flex items-center">
        <div className="relative w-64">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5 focus:outline-none focus:ring-1 focus:ring-gray-300"
            placeholder="Search..."
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="p-1.5 rounded-lg hover:bg-gray-100 relative">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-0 right-0 block w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button className="p-1.5 rounded-lg hover:bg-gray-100">
          <HelpCircle size={20} className="text-gray-600" />
        </button>
        <div className="h-8 w-px bg-gray-200"></div>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Today, {new Date().toLocaleDateString()}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
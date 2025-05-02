import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './SideBar';
import Header from './Header';
import { ThemeContext } from '../Context/ThemeContext'; // Adjust the path as needed

const Layout = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={`flex h-screen ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className={`flex-1 overflow-auto p-6 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
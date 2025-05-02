import React, { useContext } from 'react';
import SalesOverview from '../Dashboard/SalesOverview';
import SalesChart from '../Dashboard/SalesChart';
import RecentOrders from '../Dashboard/RecentOrders';
import TopSellingProducts from '../Dashboard/TopSelling';
import { ThemeContext } from '../Context/ThemeContext'; // Adjust the path as needed

const Dashboard = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl font-semibold ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Dashboard
        </h1>
        <p className={`mt-1 text-sm ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`}>
          Overview of your store's performance and recent activity
        </p>
      </div>
      
      <SalesOverview />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <div>
          <TopSellingProducts />
        </div>
      </div>
      
      <RecentOrders />
    </div>
  );
};

export default Dashboard;
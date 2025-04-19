import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import Footer from "./Footer";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <ShoppingBag className="h-8 w-8 text-gray-900" />
              <span className="ml-2 text-xl font-semibold text-gray-900">ATTIRE</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/auth">
                <button className="bg-black p-2 rounded-md hover:bg-gray-800 cursor-pointer text-white">Sign In</button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow">
        <div className="text-center py-24">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Manage Your Fashion Store
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Powerful dashboard to manage your fashion business. Track sales, manage inventory, and grow your brand.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <Link to="/auth">
              <button
                size="lg"
                className="bg-blue-600 text-white px-4 py-2 cursor-pointer rounded-md shadow-md hover:bg-blue-400"
              >
                Get Started
              </button>
            </Link>
          </div>
        </div>

        <div className="py-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-900">Sales Analytics</h3>
              <p className="mt-2 text-gray-500">
                Track your sales performance with detailed analytics and insights.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-900">Inventory Management</h3>
              <p className="mt-2 text-gray-500">
                Manage your product inventory efficiently with real-time updates.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-900">Order Processing</h3>
              <p className="mt-2 text-gray-500">
                Process and track orders seamlessly from a single dashboard.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
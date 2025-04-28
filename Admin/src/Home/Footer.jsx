import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} ATTIRE. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-sm hover:underline">
              Privacy Policy
            </a>
            <a href="#" className="text-sm hover:underline">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
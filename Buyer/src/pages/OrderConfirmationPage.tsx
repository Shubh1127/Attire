import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ShoppingBag } from 'lucide-react';
import Button from '../components/ui/Button';

const OrderConfirmationPage: React.FC = () => {
  // Generate a random order number
  const orderNumber = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
  
  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
      <div className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-xl text-gray-600">
            Your order #{orderNumber} has been placed successfully.
          </p>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Order Number</h3>
                <p className="text-base text-gray-900">#{orderNumber}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Order Date</h3>
                <p className="text-base text-gray-900">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Payment Method</h3>
                <p className="text-base text-gray-900">Credit Card (Razorpay)</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Shipping Method</h3>
                <p className="text-base text-gray-900">Standard Delivery (2-4 days)</p>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Shipping Address</h3>
              <p className="text-base text-gray-900">John Doe</p>
              <p className="text-sm text-gray-600">
                123 Main St, Mumbai, Maharashtra, 400001
              </p>
              <p className="text-sm text-gray-600">+91 9876543210</p>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-gray-600 mb-6">
            A confirmation email has been sent to your registered email address 
            with all the order details. You can also track your order in the 
            "My Orders" section of your account.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/profile">
              <Button variant="outline" className="flex items-center justify-center min-w-[180px]">
                <ShoppingBag className="h-5 w-5 mr-2" />
                View Your Orders
              </Button>
            </Link>
            <Link to="/">
              <Button className="flex items-center justify-center min-w-[180px]">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
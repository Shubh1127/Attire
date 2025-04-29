import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, ShoppingBag } from 'lucide-react';
import Button from '../components/ui/Button';
import { useBuyerContext } from '../Context/BuyerContext';
import { useTheme } from '../Context/ThemeContext';
import { formatDate } from '../lib/utils';
import { cn } from '../lib/utils';

const OrderConfirmationPage: React.FC = () => {
  const { theme } = useTheme();
  const { state } = useLocation();
  const { buyer, getOrderDetails } = useBuyerContext();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (state?.orderId) {
        const orderData = await getOrderDetails(state.orderId);
        setOrder(orderData);
      }
      setLoading(false);
    };
    
    fetchOrder();
  }, [state?.orderId, getOrderDetails]);

  if (loading) {
    return (
      <div className={cn(
        "min-h-screen pt-24 pb-16 flex items-center justify-center",
        theme === 'dark' ? 'bg-navy-900' : 'bg-gray-50'
      )}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className={cn(
        "min-h-screen pt-24 pb-16 flex items-center justify-center",
        theme === 'dark' ? 'bg-navy-900' : 'bg-gray-50'
      )}>
        <div className="text-center">
          <h1 className={cn(
            "text-2xl font-bold mb-4",
            theme === 'dark' ? 'text-green-400' : 'text-gray-900'
          )}>
            Order Not Found
          </h1>
          <Link to="/">
            <Button className={theme === 'dark' ? 'bg-green-600 hover:bg-green-700' : ''}>
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-screen pt-24 pb-16 flex items-center justify-center",
      theme === 'dark' ? 'bg-navy-900' : 'bg-gray-50'
    )}>
      <div className={cn(
        "w-full max-w-3xl p-8 rounded-lg shadow-md",
        theme === 'dark' ? 'bg-navy-800 border-navy-700 border' : 'bg-white border-gray-200 border'
      )}>
        <div className="text-center mb-8">
          <div className={cn(
            "inline-flex items-center justify-center w-20 h-20 rounded-full mb-6",
            theme === 'dark' ? 'bg-green-900' : 'bg-green-100'
          )}>
            <CheckCircle className={cn(
              "h-12 w-12",
              theme === 'dark' ? 'text-green-400' : 'text-green-600'
            )} />
          </div>
          <h1 className={cn(
            "text-3xl font-bold mb-2",
            theme === 'dark' ? 'text-green-400' : 'text-gray-900'
          )}>
            Order Confirmed!
          </h1>
          <p className={cn(
            "text-xl",
            theme === 'dark' ? 'text-green-300' : 'text-gray-600'
          )}>
            Your order #{order.orderNumber} has been placed successfully.
          </p>
        </div>
        
        <div className={cn(
          "border rounded-lg p-6 mb-8",
          theme === 'dark' ? 'border-navy-700' : 'border-gray-200'
        )}>
          <h2 className={cn(
            "text-lg font-semibold mb-4",
            theme === 'dark' ? 'text-green-400' : 'text-gray-900'
          )}>
            Order Details
          </h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className={cn(
                  "text-sm font-medium",
                  theme === 'dark' ? 'text-green-300' : 'text-gray-500'
                )}>
                  Order Number
                </h3>
                <p className={cn(
                  "text-base",
                  theme === 'dark' ? 'text-green-400' : 'text-gray-900'
                )}>
                  #{order.orderNumber}
                </p>
              </div>
              <div>
                <h3 className={cn(
                  "text-sm font-medium",
                  theme === 'dark' ? 'text-green-300' : 'text-gray-500'
                )}>
                  Order Date
                </h3>
                <p className={cn(
                  "text-base",
                  theme === 'dark' ? 'text-green-400' : 'text-gray-900'
                )}>
                  {formatDate(order.createdAt)}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className={cn(
                  "text-sm font-medium",
                  theme === 'dark' ? 'text-green-300' : 'text-gray-500'
                )}>
                  Payment Method
                </h3>
                <p className={cn(
                  "text-base",
                  theme === 'dark' ? 'text-green-400' : 'text-gray-900'
                )}>
                  {order.payment.method === 'card' ? 'Credit/Debit Card' : 'Cash on Delivery'}
                </p>
              </div>
              <div>
                <h3 className={cn(
                  "text-sm font-medium",
                  theme === 'dark' ? 'text-green-300' : 'text-gray-500'
                )}>
                  Status
                </h3>
                <p className={cn(
                  "text-base capitalize",
                  theme === 'dark' ? 'text-green-400' : 'text-gray-900'
                )}>
                  {order.status}
                </p>
              </div>
            </div>
            
            <div className={cn(
              "border-t pt-4",
              theme === 'dark' ? 'border-navy-700' : 'border-gray-200'
            )}>
              <h3 className={cn(
                "text-sm font-medium mb-2",
                theme === 'dark' ? 'text-green-300' : 'text-gray-500'
              )}>
                Shipping Address
              </h3>
              <p className={cn(
                "text-base",
                theme === 'dark' ? 'text-green-400' : 'text-gray-900'
              )}>
                {order.shippingAddress.fullName}
              </p>
              <p className={cn(
                "text-sm",
                theme === 'dark' ? 'text-green-300' : 'text-gray-600'
              )}>
                {order.shippingAddress.street}, {order.shippingAddress.city},<br />
                {order.shippingAddress.state}, {order.shippingAddress.postalCode}
              </p>
              <p className={cn(
                "text-sm",
                theme === 'dark' ? 'text-green-300' : 'text-gray-600'
              )}>
                {order.shippingAddress.phone}
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <p className={cn(
            "mb-6",
            theme === 'dark' ? 'text-green-300' : 'text-gray-600'
          )}>
            A confirmation email has been sent to <span className={theme === 'dark' ? 'text-green-400' : 'text-navy-700'}>{buyer?.email}</span> with all the order details.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/profile/orders">
              <Button
                variant="outline"
                className={cn(
                  "flex items-center justify-center min-w-[180px]",
                  theme === 'dark' ? 'text-green-400 border-green-400 hover:bg-navy-700' : ''
                )}
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                View Your Orders
              </Button>
            </Link>
            <Link to="/">
              <Button className={cn(
                "flex items-center justify-center min-w-[180px]",
                theme === 'dark' ? 'bg-green-600 hover:bg-green-700' : ''
              )}>
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
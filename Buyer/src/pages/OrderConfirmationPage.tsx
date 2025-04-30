import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, ShoppingBag } from 'lucide-react';
import Button from '../components/ui/Button';
import { useTheme } from '../Context/ThemeContext';
import { formatDate } from '../lib/utils';
import { cn } from '../lib/utils';

const OrderConfirmationPage: React.FC = () => {
  const { theme } = useTheme();
  const { state } = useLocation();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (state?.order) {
      setOrder(state.order);
    }
  }, [state?.order]);

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

  const orderTotal = order.subtotal + order.shippingCost + order.tax;

  return (
    <div className={cn(
      "min-h-screen pt-24 pb-16",
      theme === 'dark' ? 'bg-navy-900' : 'bg-gray-50'
    )}>
      <div className="container mx-auto px-4">
        <div className={cn(
          "max-w-3xl mx-auto p-8 rounded-lg shadow-md",
          theme === 'dark' ? 'bg-navy-800 border-navy-700 border' : 'bg-white border-gray-200 border'
        )}>
          {/* Confirmation Header */}
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
              Thank you for your purchase!
            </p>
          </div>

          {/* Order Summary */}
          <div className={cn(
            "border rounded-lg p-6 mb-8",
            theme === 'dark' ? 'border-navy-700' : 'border-gray-200'
          )}>
            <h2 className={cn(
              "text-xl font-semibold mb-4",
              theme === 'dark' ? 'text-green-400' : 'text-gray-900'
            )}>
              Order Summary
            </h2>

            <div className="space-y-4">
              {order.items.map((item: any) => (
                <div key={item.product_id} className="flex py-4 border-b last:border-b-0">
                  <div className="flex-shrink-0 h-16 w-16 overflow-hidden rounded-md border">
                    <img
                      src={item.photo}
                      alt={item.name}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between">
                      <h3 className={cn(
                        "text-sm font-medium",
                        theme === 'dark' ? 'text-green-400' : 'text-gray-900'
                      )}>
                        {item.name}
                      </h3>
                      <p className={cn(
                        "ml-4 text-sm",
                        theme === 'dark' ? 'text-green-400' : 'text-gray-900'
                      )}>
                        {item.price * item.quantity}
                      </p>
                    </div>
                    <p className={cn(
                      "text-xs mt-1",
                      theme === 'dark' ? 'text-green-300' : 'text-gray-500'
                    )}>
                      Qty: {item.quantity} | Size: {item.size} | Color: {item.color}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
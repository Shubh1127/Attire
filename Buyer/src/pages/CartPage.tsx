import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useBuyerContext } from '../Context/BuyerContext';
import CartItem from '../components/cart/CartItem';
import Button from '../components/ui/Button';
import { useTheme } from '../Context/ThemeContext';
import { formatPrice,cn } from '../lib/utils';

const CartPage: React.FC = () => {
  const { theme } = useTheme();
  const { buyer, fetchCart } = useBuyerContext();
  console.log(buyer)
  const shippingCost = buyer?.cart?.reduce((total, item) => total + item.quantity * 99, 0) > 999 ? 0 : 99;
  const subtotal = buyer?.cart?.reduce((total, item) => total + item.quantity * item.price, 0) || 0;
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shippingCost + tax;

  useEffect(() => {
    const fetchCartData = async () => {
      await fetchCart();
    };
    fetchCartData();
  }, []);

  if (!buyer?.cart || buyer.cart.length === 0) {
    return (
      <div className={`min-h-screen pt-24 pb-16 flex items-center justify-center ${theme === 'dark' ? 'bg-navy-900' : 'bg-gray-50'}`}>
        <div className="text-center p-8">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${theme === 'dark' ? 'bg-navy-700' : 'bg-gray-100'
            }`}>
            <ShoppingBag className={`h-10 w-10 ${theme === 'dark' ? 'text-green-400' : 'text-gray-500'
              }`} />
          </div>
          <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-green-400' : 'text-gray-900'
            }`}>
            Your cart is empty
          </h2>
          <p className={`mb-6 ${theme === 'dark' ? 'text-green-300' : 'text-gray-600'
            }`}>
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link to="/">
            <Button className={`${theme === 'dark' ? 'bg-green-600 hover:bg-green-700' : 'bg-navy-700 hover:bg-navy-600'
              } text-white`}>
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-24 pb-16 ${theme === 'dark' ? 'bg-navy-900' : 'bg-gray-50'
      }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-green-400' : 'text-gray-900'
            }`}>
            Shopping Cart
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className={`rounded-lg shadow-sm border p-6 ${theme === 'dark' ? 'bg-navy-800 border-navy-700' : 'bg-white border-gray-200'
              }`}>
              {buyer.cart.map((item) => (
                <CartItem key={item._id} item={item} />
              ))}
            </div>
          </div>

          {/* Order Summary */}
          {/* Order Summary */}
          <div>
            <div className={`rounded-lg shadow-sm border p-6 ${theme === 'dark' ? 'bg-navy-800 border-navy-700' : 'bg-white border-gray-200'
              }`}>
              <h2 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-green-400' : 'text-gray-900'
                }`}>
                Order Summary
              </h2>

              <div className="space-y-4">
                <div className={`flex justify-between ${theme === 'dark' ? 'text-green-300' : 'text-gray-600'
                  }`}>
                  <span>Items ({buyer.cart.reduce((total, item) => total + item.quantity, 0)})</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                <div className={`flex justify-between ${theme === 'dark' ? 'text-green-300' : 'text-gray-600'
                  }`}>
                  <span>Shipping</span>
                  <span>
                    {shippingCost === 0 ? (
                      <span className={theme === 'dark' ? 'text-green-400' : 'text-navy-600'}>Free</span>
                    ) : (
                      formatPrice(shippingCost)
                    )}
                  </span>
                </div>

                <div className={`flex justify-between ${theme === 'dark' ? 'text-green-300' : 'text-gray-600'
                  }`}>
                  <span>GST (18%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>

                <div className={`border-t pt-4 ${theme === 'dark' ? 'border-navy-700' : 'border-gray-200'
                  }`}>
                  <div className={`flex justify-between text-lg font-bold ${theme === 'dark' ? 'text-green-400' : 'text-gray-900'
                    }`}>
                    <span>Total Amount</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-green-300' : 'text-gray-500'
                    }`}>
                    Including all taxes and duties
                  </p>
                </div>

                <Link to="/checkout">
                  <Button
                    fullWidth
                    size="lg"
                    className={cn(
                      theme === 'dark'
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-navy-700 hover:bg-navy-800 text-white'
                    )}
                  >
                    Proceed to Checkout
                  </Button>
                </Link>

                <div className={`text-center text-sm mt-4 ${theme === 'dark' ? 'text-green-300' : 'text-gray-500'
                  }`}>
                  <Link
                    to="/"
                    className={cn(
                      'underline hover:no-underline',
                      theme === 'dark'
                        ? 'text-green-400 hover:text-green-300'
                        : 'text-navy-600 hover:text-navy-800'
                    )}
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
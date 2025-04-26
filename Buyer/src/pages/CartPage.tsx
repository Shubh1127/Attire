import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import CartItem from '../components/cart/CartItem';
import Button from '../components/ui/Button';
import { useTheme } from '../Context/ThemeContext';
import { formatPrice } from '../lib/utils';

const CartPage: React.FC = () => {
  const {theme} = useTheme();
  const { items, totalPrice, clearCart } = useCartStore();
  
  const shippingCost = totalPrice() > 999 ? 0 : 99;
  const subtotal = totalPrice();
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shippingCost + tax;
  
  if (items.length === 0) {
    return (
      <div className={`min-h-screen pt-24 pb-16 flex items-center justify-center ${theme === 'dark' ? 'bg-navy-900' : 'bg-gray-50'}`}>
        <div className="text-center p-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
            <ShoppingBag className="h-10 w-10 text-gray-500" />
          </div>
          <h2 className={`text-2xl font-bold text-gray-900 mb-4 ${
                  theme === 'dark' ? 'text-green-400' : 'text-gray-600'
                }`}>Your cart is empty</h2>
          <p className={`text-gray-600 mb-6 ${
                  theme === 'dark' ? 'text-green-400' : 'text-gray-600'
                }`}>
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link to="/">
            <Button className={`bg-navy-700 hover:bg-navy-600 text-white ${
                  theme === 'dark' ? 'text-white' : 'text-gray-200'
                }` }>
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <button 
            onClick={clearCart}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Clear Cart
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          </div>
          
          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>
                    {shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}
                  </span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>GST (18%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Including all taxes and duties
                  </p>
                </div>
                
                <Link to="/checkout">
                  <Button fullWidth size="lg">
                    Checkout
                  </Button>
                </Link>
                
                <p className="text-center text-sm text-gray-500 mt-4">
                  <Link to="/" className="text-navy-600 hover:text-navy-800">
                    Continue Shopping
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
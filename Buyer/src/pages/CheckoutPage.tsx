import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, CheckSquare } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import AddressForm from '../components/checkout/AddressForm';
import RazorpayCheckout from '../components/checkout/RazorpayCheckout';
import Button from '../components/ui/Button';
import { formatPrice } from '../lib/utils';
import { Address } from '../types';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { items, totalPrice } = useCartStore();
  
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    user?.addresses.find(addr => addr.isDefault)?.id || null
  );
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod'>('card');

  // Calculate order totals
  const subtotal = totalPrice();
  const shippingCost = subtotal > 999 ? 0 : 99;
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shippingCost + tax;

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    navigate('/login?redirect=checkout');
    return null;
  }

  // Redirect to cart if empty
  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const selectedAddress = user?.addresses.find(addr => addr.id === selectedAddressId);

  const handlePaymentSuccess = () => {
    // In a real app, this would create an order in the database
    navigate('/order-confirmation');
  };

  const handlePaymentFailure = (error: Error) => {
    console.error('Payment failed:', error);
    // Show error message to user
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Truck className="h-5 w-5 text-navy-600 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">Shipping Address</h2>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowAddressForm(true)}
                >
                  Add New Address
                </Button>
              </div>
              
              {showAddressForm ? (
                <AddressForm onClose={() => setShowAddressForm(false)} />
              ) : (
                <div>
                  {user?.addresses.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">You don't have any saved addresses yet.</p>
                      <Button onClick={() => setShowAddressForm(true)}>
                        Add Your First Address
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {user?.addresses.map((address) => (
                        <div 
                          key={address.id} 
                          className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                            selectedAddressId === address.id
                              ? 'border-navy-600 bg-navy-50'
                              : 'border-gray-200 hover:border-navy-300'
                          }`}
                          onClick={() => setSelectedAddressId(address.id)}
                        >
                          <div className="flex justify-between">
                            <div className="flex items-center">
                              <input
                                type="radio"
                                name="address"
                                checked={selectedAddressId === address.id}
                                onChange={() => setSelectedAddressId(address.id)}
                                className="h-4 w-4 text-navy-600 focus:ring-navy-500"
                              />
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">
                                  {address.title}
                                  {address.isDefault && (
                                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                      Default
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-2 pl-7">
                            <p className="text-sm text-gray-900">{address.fullName}</p>
                            <p className="text-sm text-gray-500">
                              {address.street}, {address.city}, {address.state}, {address.postalCode}
                            </p>
                            <p className="text-sm text-gray-500">{address.phone}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <CreditCard className="h-5 w-5 text-navy-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">Payment Method</h2>
              </div>
              
              <div className="space-y-4">
                <div 
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    paymentMethod === 'card'
                      ? 'border-navy-600 bg-navy-50'
                      : 'border-gray-200 hover:border-navy-300'
                  }`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="h-4 w-4 text-navy-600 focus:ring-navy-500"
                    />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Credit/Debit Card (Razorpay)</p>
                      <p className="text-xs text-gray-500">Securely pay with your credit or debit card</p>
                    </div>
                  </div>
                </div>
                
                <div 
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    paymentMethod === 'cod'
                      ? 'border-navy-600 bg-navy-50'
                      : 'border-gray-200 hover:border-navy-300'
                  }`}
                  onClick={() => setPaymentMethod('cod')}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="h-4 w-4 text-navy-600 focus:ring-navy-500"
                    />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Cash on Delivery</p>
                      <p className="text-xs text-gray-500">Pay with cash when your order is delivered</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="max-h-60 overflow-y-auto mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex py-2 border-b border-gray-100 last:border-b-0">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-sm font-medium text-gray-900">
                          <h3 className="line-clamp-1">{item.name}</h3>
                          <p className="ml-4">
                            {item.discountPrice 
                              ? formatPrice(item.discountPrice * item.quantity)
                              : formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          {item.size} | {item.color} | Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span>
                    {shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm text-gray-600">
                  <span>GST (18%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-base font-bold">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Including all taxes and duties
                  </p>
                </div>
              </div>
              
              {selectedAddress ? (
                paymentMethod === 'card' ? (
                  <RazorpayCheckout
                    amount={total}
                    customerName={selectedAddress.fullName}
                    customerEmail={user?.email || ''}
                    customerPhone={selectedAddress.phone}
                    shippingAddress={selectedAddress}
                    onSuccess={handlePaymentSuccess}
                    onFailure={handlePaymentFailure}
                  />
                ) : (
                  <Button
                    fullWidth
                    size="lg"
                    className="mt-4"
                    onClick={handlePaymentSuccess}
                  >
                    Place Order
                  </Button>
                )
              ) : (
                <Button
                  fullWidth
                  size="lg"
                  className="mt-4"
                  disabled
                >
                  Select an Address to Continue
                </Button>
              )}
              
              <div className="mt-4 text-sm text-gray-500 flex items-center justify-center">
                <CheckSquare className="h-4 w-4 mr-2 text-navy-600" />
                Your information is secure and encrypted
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
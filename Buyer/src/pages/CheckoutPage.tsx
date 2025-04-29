import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, CheckSquare } from 'lucide-react';
import { useBuyerContext } from '../Context/BuyerContext';
import AddressForm from '../components/checkout/AddressForm';
import Button from '../components/ui/Button';
import { formatPrice, cn } from '../lib/utils';
import { useTheme } from '../Context/ThemeContext';
import supabase from '../Auth/SupabaseClient';

interface Address {
  _id: string;
  title: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
}

interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  photo: string[];
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { 
    buyer, 
    fetchCart, 
    getProfile, 
    createOrder,
    initiateRazorpayPayment
  } = useBuyerContext();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod'>('card');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const subtotal = buyer?.cart?.reduce((total: number, item: CartItem) => total + item.quantity * item.price, 0) || 0;
  const shippingCost = subtotal > 999 ? 0 : 99;
  const tax = subtotal * 0.18;
  const total = subtotal + shippingCost + tax;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data: session } = await supabase.auth.getSession();
        
        if (!token && !session?.session?.user) {
          navigate('/signup');
          return;
        }
        
        setIsAuthenticated(true);
        if (!buyer || !buyer.addresses?.length) {
          await getProfile();
        }
      } catch (err) {
        setError('Failed to authenticate');
        navigate('/signup');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate, getProfile, buyer]);
  console.log('Buyer:', buyer);
  const selectedAddress = buyer?.addresses?.find((addr: Address) => addr._id === selectedAddressId);

  const handlePlaceOrder = async () => {
    if (!selectedAddressId || !buyer?.cart?.length) return;
    
    try {
      setError(null);
      setIsLoading(true);
      
      const orderData = {
        items: buyer.cart.map((item: CartItem) => ({
          product_id: item._id,
          quantity: item.quantity,
          size: item.size,
          color: item.color
        })),
        shippingAddress: selectedAddressId,
        paymentMethod
      };

      if (paymentMethod === 'cod') {
        const order = await createOrder(orderData);
        navigate('/order-confirmation', { state: { orderId: order._id } });
      } else {
        await handleRazorpayPayment();
      }
    } catch (error) {
      setError('Failed to place order. Please try again.');
      console.error('Order failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRazorpayPayment = async () => {
    if (!selectedAddressId || !selectedAddress) return;
    
    try {
      setError(null);
      setIsLoading(true);
      
      const paymentData = await initiateRazorpayPayment({
        amount: total,
        currency: 'INR',
        buyerId: buyer?._id || '',
        shippingAddress: selectedAddress,
        cartItems: buyer?.cart || []
      });

      const options = {
        ...paymentData,
        handler: async (response: any) => {
          try {
            const orderData = {
              items: buyer?.cart?.map((item: CartItem) => ({
                product_id: item._id,
                quantity: item.quantity,
                size: item.size,
                color: item.color
              })) || [],
              shippingAddress: selectedAddressId,
              paymentMethod: 'card',
              razorpayPaymentId: response.razorpay_payment_id
            };
            
            const order = await createOrder(orderData);
            navigate('/order-confirmation', { state: { orderId: order._id } });
          } catch (error) {
            setError('Order creation failed after payment');
            console.error('Order creation after payment failed:', error);
          }
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
            setError('Payment was cancelled');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      setError('Payment initiation failed');
      console.error('Payment initiation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen pt-24 pb-16 flex items-center justify-center ${
        theme === 'dark' ? 'bg-navy-900' : 'bg-gray-50'
      }`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-24 pb-16 ${theme === 'dark' ? 'bg-navy-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4">
        {error && (
          <div className={`mb-4 p-4 rounded-lg ${
            theme === 'dark' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
          }`}>
            {error}
          </div>
        )}

        <h1 className={`text-3xl font-bold mb-8 ${theme === 'dark' ? 'text-green-400' : 'text-gray-900'}`}>
          Checkout
        </h1>

        {/* Rest of your JSX remains the same */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Address */}
            <div className={`rounded-lg shadow-sm border p-6 ${theme === 'dark' ? 'bg-navy-800 border-navy-700' : 'bg-white border-gray-200'
              }`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Truck className={`h-5 w-5 mr-2 ${theme === 'dark' ? 'text-green-400' : 'text-navy-600'
                    }`} />
                  <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-green-400' : 'text-gray-900'
                    }`}>
                    Shipping Address
                  </h2>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddressForm(true)}
                  className={theme === 'dark' ? 'text-green-400 border-green-400 hover:bg-navy-700' : ''}
                >
                  Add New Address
                </Button>
              </div>

              {showAddressForm ? (
                <AddressForm
                  onClose={() => {
                    setShowAddressForm(false);
                    getProfile(); // Refresh addresses after adding a new one
                  }}
                />
              ) : (
                <div>
                  {buyer?.addresses?.length === 0 ? (
                    <div className={`text-center py-8 ${theme === 'dark' ? 'text-green-300' : 'text-gray-600'
                      }`}>
                      <p className="mb-4">You don't have any saved addresses yet.</p>
                      <Button
                        onClick={() => setShowAddressForm(true)}
                        className={theme === 'dark' ? 'bg-green-600 hover:bg-green-700' : ''}
                      >
                        Add Your First Address
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {buyer?.addresses?.map((address) => (
                        <div
                          key={address._id}
                          className={cn(
                            `border rounded-lg p-4 cursor-pointer transition-colors ${selectedAddressId === address._id
                              ? theme === 'dark'
                                ? 'border-green-400 bg-navy-700'
                                : 'border-navy-600 bg-navy-50'
                              : theme === 'dark'
                                ? 'border-navy-700 hover:border-green-400'
                                : 'border-gray-200 hover:border-navy-300'
                            }`
                          )}
                          onClick={() => setSelectedAddressId(address._id)}
                        >
                          <div className="flex justify-between">
                            <div className="flex items-center">
                              <input
                                type="radio"
                                name="address"
                                checked={selectedAddressId === address._id}
                                onChange={() => setSelectedAddressId(address._id)}
                                className={cn(
                                  'h-4 w-4 focus:ring-2',
                                  theme === 'dark'
                                    ? 'text-green-400 focus:ring-green-400'
                                    : 'text-navy-600 focus:ring-navy-500'
                                )}
                              />
                              <div className="ml-3">
                                <p className={cn(
                                  'text-sm font-medium',
                                  theme === 'dark' ? 'text-green-400' : 'text-gray-900'
                                )}>
                                  {address.title}
                                  {address.isDefault && (
                                    <span className={cn(
                                      'ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                                      theme === 'dark'
                                        ? 'bg-green-900 text-green-300'
                                        : 'bg-green-100 text-green-800'
                                    )}>
                                      Default
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="mt-2 pl-7">
                            <p className={cn(
                              'text-sm',
                              theme === 'dark' ? 'text-green-300' : 'text-gray-900'
                            )}>
                              {address.fullName}
                            </p>
                            <p className={cn(
                              'text-sm',
                              theme === 'dark' ? 'text-green-300' : 'text-gray-500'
                            )}>
                              {address.street}, {address.city}, {address.state}, {address.postalCode}
                            </p>
                            <p className={cn(
                              'text-sm',
                              theme === 'dark' ? 'text-green-300' : 'text-gray-500'
                            )}>
                              {address.phone}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Rest of your component remains the same... */}
            <div className={`rounded-lg shadow-sm border p-6 ${theme === 'dark' ? 'bg-navy-800 border-navy-700' : 'bg-white border-gray-200'
              }`}>
              <div className="flex items-center mb-6">
                <CreditCard className={`h-5 w-5 mr-2 ${theme === 'dark' ? 'text-green-400' : 'text-navy-600'
                  }`} />
                <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-green-400' : 'text-gray-900'
                  }`}>
                  Payment Method
                </h2>
              </div>

              <div className="space-y-4">
                <div
                  className={cn(
                    `border rounded-lg p-4 cursor-pointer transition-colors ${paymentMethod === 'card'
                      ? theme === 'dark'
                        ? 'border-green-400 bg-navy-700'
                        : 'border-navy-600 bg-navy-50'
                      : theme === 'dark'
                        ? 'border-navy-700 hover:border-green-400'
                        : 'border-gray-200 hover:border-navy-300'
                    }`
                  )}
                  onClick={() => setPaymentMethod('card')}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className={cn(
                        'h-4 w-4 focus:ring-2',
                        theme === 'dark'
                          ? 'text-green-400 focus:ring-green-400'
                          : 'text-navy-600 focus:ring-navy-500'
                      )}
                    />
                    <div className="ml-3">
                      <p className={cn(
                        'text-sm font-medium',
                        theme === 'dark' ? 'text-green-400' : 'text-gray-900'
                      )}>
                        Credit/Debit Card (Razorpay)
                      </p>
                      <p className={cn(
                        'text-xs',
                        theme === 'dark' ? 'text-green-300' : 'text-gray-500'
                      )}>
                        Securely pay with your credit or debit card
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className={cn(
                    `border rounded-lg p-4 cursor-pointer transition-colors ${paymentMethod === 'cod'
                      ? theme === 'dark'
                        ? 'border-green-400 bg-navy-700'
                        : 'border-navy-600 bg-navy-50'
                      : theme === 'dark'
                        ? 'border-navy-700 hover:border-green-400'
                        : 'border-gray-200 hover:border-navy-300'
                    }`
                  )}
                  onClick={() => setPaymentMethod('cod')}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className={cn(
                        'h-4 w-4 focus:ring-2',
                        theme === 'dark'
                          ? 'text-green-400 focus:ring-green-400'
                          : 'text-navy-600 focus:ring-navy-500'
                      )}
                    />
                    <div className="ml-3">
                      <p className={cn(
                        'text-sm font-medium',
                        theme === 'dark' ? 'text-green-400' : 'text-gray-900'
                      )}>
                        Cash on Delivery
                      </p>
                      <p className={cn(
                        'text-xs',
                        theme === 'dark' ? 'text-green-300' : 'text-gray-500'
                      )}>
                        Pay with cash when your order is delivered
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Section */}
          <div>
            <div className={`rounded-lg shadow-sm border p-6 sticky top-24 ${theme === 'dark' ? 'bg-navy-800 border-navy-700' : 'bg-white border-gray-200'
              }`}>
              <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-green-400' : 'text-gray-900'
                }`}>
                Order Summary
              </h2>

              <div className={`max-h-60 overflow-y-auto mb-4 ${theme === 'dark' ? 'scrollbar-thumb-navy-600' : ''
                }`}>
                {buyer?.cart?.map((item) => (
                  <div key={item._id} className={`flex py-2 border-b ${theme === 'dark' ? 'border-navy-700' : 'border-gray-100'
                    } last:border-b-0`}>
                    <div className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border ${theme === 'dark' ? 'border-navy-700' : 'border-gray-200'
                      }`}>
                      <img
                        src={item.photo[0]}
                        alt={item.name}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-sm font-medium">
                          <h3 className={`line-clamp-1 ${theme === 'dark' ? 'text-green-400' : 'text-gray-900'
                            }`}>
                            {item.name}
                          </h3>
                          <p className={`ml-4 ${theme === 'dark' ? 'text-green-400' : 'text-gray-900'
                            }`}>
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                        <p className={cn(
                          'mt-1 text-xs',
                          theme === 'dark' ? 'text-green-300' : 'text-gray-500'
                        )}>
                          {item.size} | {item.color} | Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className={`space-y-3 border-t ${theme === 'dark' ? 'border-navy-700' : 'border-gray-200'
                } pt-4`}>
                <div className={`flex justify-between text-sm ${theme === 'dark' ? 'text-green-300' : 'text-gray-600'
                  }`}>
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                <div className={`flex justify-between text-sm ${theme === 'dark' ? 'text-green-300' : 'text-gray-600'
                  }`}>
                  <span>Shipping</span>
                  <span>
                    {shippingCost === 0 ? (
                      <span className={theme === 'dark' ? 'text-green-400' : 'text-navy-600'}>
                        Free
                      </span>
                    ) : (
                      formatPrice(shippingCost)
                    )}
                  </span>
                </div>

                <div className={`flex justify-between text-sm ${theme === 'dark' ? 'text-green-300' : 'text-gray-600'
                  }`}>
                  <span>GST (18%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>

                <div className={`border-t ${theme === 'dark' ? 'border-navy-700' : 'border-gray-200'
                  } pt-3`}>
                  <div className={`flex justify-between text-base font-bold ${theme === 'dark' ? 'text-green-400' : 'text-gray-900'
                    }`}>
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <p className={cn(
                    'text-xs mt-1',
                    theme === 'dark' ? 'text-green-300' : 'text-gray-500'
                  )}>
                    Including all taxes and duties
                  </p>
                </div>
              </div>

              {selectedAddress ? (
                paymentMethod === 'card' ? (
                  <Button
                    fullWidth
                    size="lg"
                    onClick={handleRazorpayPayment}
                    className={`mt-4 ${theme === 'dark' ? 'bg-green-600 hover:bg-green-700' : ''
                      }`}
                  >
                    Pay Now
                  </Button>
                ) : (
                  <Button
                    fullWidth
                    size="lg"
                    onClick={handlePlaceOrder}
                    className={`mt-4 ${theme === 'dark' ? 'bg-green-600 hover:bg-green-700' : ''
                      }`}
                  >
                    Place Order (COD)
                  </Button>
                )
              ) : (
                <Button
                  fullWidth
                  size="lg"
                  className={`mt-4 ${theme === 'dark' ? 'bg-navy-700 text-green-400' : ''
                    }`}
                  disabled
                >
                  Select an Address to Continue
                </Button>
              )}

              <div className={cn(
                'mt-4 text-sm flex items-center justify-center',
                theme === 'dark' ? 'text-green-300' : 'text-gray-500'
              )}>
                <CheckSquare className={`h-4 w-4 mr-2 ${theme === 'dark' ? 'text-green-400' : 'text-navy-600'
                  }`} />
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
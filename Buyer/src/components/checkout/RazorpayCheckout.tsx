import React, { useEffect, useState } from 'react';
import Button from '../ui/Button';
import axios from 'axios';
import { useBuyerContext } from '../../Context/BuyerContext';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayCheckoutProps {
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
  }; // Use the structure of the shippingAddress passed from CheckoutPage
  onSuccess: () => void;
  onFailure: (error: Error) => void;
  theme?: 'light' | 'dark';
}

const RazorpayCheckout: React.FC<RazorpayCheckoutProps> = ({
  amount,
  customerName,
  customerEmail,
  customerPhone,
  shippingAddress,
  onSuccess,
  onFailure,
  theme = 'light',
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { buyer } = useBuyerContext();

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    setIsLoading(true);

    try {
      // First create an order on your backend
      const orderResponse = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/payment/create-order`,
        {
          amount: amount * 100, // Convert to paise
          currency: 'INR',
          receipt: `order_${Date.now()}`,
          notes: {
            buyerId: buyer?._id,
            shippingAddress: JSON.stringify(shippingAddress),
            cartItems: JSON.stringify(buyer?.cart),
          },
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const orderId = orderResponse.data.orderId;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: amount * 100, // Amount in paisa
        currency: 'INR',
        name: 'Your Store Name',
        description: 'Purchase from Your Store',
        image: '/logo.png', // Your store logo
        order_id: orderId,
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone,
        },
        notes: {
          address: `${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.postalCode}`,
          buyerId: buyer?._id,
        },
        theme: {
          color: theme === 'dark' ? '#1e3a8a' : '#172554', // Navy color that matches your theme
        },
        handler: async function (response: any) {
          try {
            // Verify payment on your backend
            await axios.post(
              `${import.meta.env.VITE_BACKEND_URL}/payment/verify`,
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
              }
            );

            onSuccess();
          } catch (error) {
            console.error('Payment verification failed:', error);
            onFailure(new Error('Payment verification failed'));
          }
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false);
          },
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Payment error:', error);
      onFailure(error instanceof Error ? error : new Error('Payment failed'));
      setIsLoading(false);
    }
  };

  return (
    <Button
      fullWidth
      size="lg"
      onClick={handlePayment}
      isLoading={isLoading}
      className={`mt-4 ${
        theme === 'dark' ? 'bg-green-600 hover:bg-green-700' : 'bg-navy-700 hover:bg-navy-800'
      } text-white`}
    >
      {isLoading ? 'Processing...' : 'Pay Now'}
    </Button>
  );
};

export default RazorpayCheckout;
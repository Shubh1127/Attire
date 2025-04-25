import React, { useEffect } from 'react';
import Button from '../ui/Button';
import { useCartStore } from '../../store/cartStore';
import { Address } from '../../types';

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
  shippingAddress: Address;
  onSuccess: () => void;
  onFailure: (error: Error) => void;
}

const RazorpayCheckout: React.FC<RazorpayCheckoutProps> = ({
  amount,
  customerName,
  customerEmail,
  customerPhone,
  shippingAddress,
  onSuccess,
  onFailure,
}) => {
  const { clearCart } = useCartStore();
  const [isLoading, setIsLoading] = React.useState(false);

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

  const handlePayment = () => {
    setIsLoading(true);
    
    // In a real implementation, you would make an API call to your server to create an order
    // For this demo, we're simulating the process
    setTimeout(() => {
      const options = {
        key: 'YOUR_RAZORPAY_KEY_ID', // Replace with your Razorpay Key ID
        amount: amount * 100, // Amount in paisa
        currency: 'INR',
        name: 'Attire Clothing',
        description: 'Purchase from Attire',
        image: 'https://your-logo-url.png', // Replace with your logo
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone,
        },
        notes: {
          address: `${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.postalCode}`,
        },
        theme: {
          color: '#172554',
        },
        handler: function (response: any) {
          // Handle successful payment
          console.log('Payment successful:', response);
          clearCart();
          onSuccess();
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false);
          },
        },
      };

      try {
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } catch (error) {
        console.error('Razorpay error:', error);
        onFailure(error instanceof Error ? error : new Error('Payment failed'));
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <Button
      fullWidth
      size="lg"
      onClick={handlePayment}
      isLoading={isLoading}
      className="mt-4"
    >
      Pay Now
    </Button>
  );
};

export default RazorpayCheckout;
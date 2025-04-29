import React from 'react';
import Button from '../ui/Button';
import { useBuyerContext } from '../../Context/BuyerContext';

interface RazorpayCheckoutProps {
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: any;
  onSuccess: (paymentResponse: any) => void;
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
  const { buyer, initiateRazorpayPayment } = useBuyerContext();

  useEffect(() => {
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
      const paymentData = await initiateRazorpayPayment({
        amount,
        currency: 'INR',
        buyerId: buyer?._id,
        shippingAddress,
        cartItems: buyer?.cart
      });

      const options = {
        ...paymentData,
        handler: (response: any) => onSuccess(response),
        modal: {
          ondismiss: () => {
            setIsLoading(false);
            onFailure(new Error('Payment cancelled by user'));
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      setIsLoading(false);
      onFailure(error instanceof Error ? error : new Error('Payment failed'));
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
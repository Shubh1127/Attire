import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, CheckCircle, Clock, XCircle, RefreshCw } from 'lucide-react';
import { useBuyerContext } from '../Context/BuyerContext';
import { getCookie } from '../utils/cookies';
import axios from 'axios';
interface OrderItem {
    _id: string;
    name: string;
    price: number;
    quantity: number;
    size?: string;
    color?: string;
    photo?: string;
}

interface Order {
    _id: string;
    orderNumber: string;
    createdAt: string;
    total: number;
    trackingNumber?: string;
    status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
    expectedDeliveryDate?: string;
    items: OrderItem[];
    shippingAddress: {
        name: string;
        street: string;
        city: string;
        state: string;
        country: string;
    };
}

const OrdersPage: React.FC = () => {
    const { getProfile } = useBuyerContext();
    const [orders, setOrders] = useState<Order[]>([]);
    const [buyer, setBuyer] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

     useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const profileRes = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/buyer/profile`,
                    { withCredentials: true }
                );
                const buyerData = profileRes.data.buyer;
                setBuyer(buyerData);

                const token = getCookie('token');
                if (!token || !buyerData?._id) {
                    throw new Error('Authentication required');
                }

                const ordersRes = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/order/buyer/${buyerData._id}`,
                    { withCredentials: true }
                );

                setOrders(ordersRes.data.orders);
            } catch (err: any) {
                setError(err.message || 'Something went wrong');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getStatusIcon = (status: Order['status']) => {
        switch (status) {
            case 'delivered':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'shipped':
                return <Truck className="h-5 w-5 text-blue-500" />;
            case 'cancelled':
                return <XCircle className="h-5 w-5 text-red-500" />;
            case 'returned':
                return <RefreshCw className="h-5 w-5 text-amber-500" />;
            default:
                return <Clock className="h-5 w-5 text-gray-500" />;
        }
    };

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (loading) {
        return (
            <div className="min-h-screen mt-12 py-12 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen mt-12 py-12 flex justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <Link to="/signin" className="text-amber-500 hover:underline">
                        Please login to view your orders
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-navy-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8  mt-12 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-navy-800 dark:text-white">Your Orders</h1>
                    <div className="flex items-center space-x-2">
                        <Package className="h-6 w-6 text-amber-500" />
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            {orders.length} {orders.length === 1 ? 'order' : 'orders'}
                        </span>
                    </div>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center py-12">
                        <Package className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No orders yet</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Start shopping to see your orders here.
                        </p>
                        <div className="mt-6">
                            <Link
                                to="/"
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-500 hover:bg-amber-600"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div
                                key={order._id}
                                className="bg-white dark:bg-navy-800 shadow rounded-lg overflow-hidden"
                            >
                                <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between">
                                    <div className="mb-4 sm:mb-0">
                                        <div className="flex items-center space-x-2">
                                            {getStatusIcon(order.status)}
                                            <h3 className="text-lg font-medium text-navy-800 dark:text-white">
                                                Order #{order.orderNumber}
                                            </h3>
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            Placed on {formatDate(order.createdAt)}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">Total:</span>{' '}
                                            <span className="font-medium text-navy-800 dark:text-white">
                                                ₹{order.total.toLocaleString()}
                                            </span>
                                        </p>
                                        {order.trackingNumber && (
                                            <p className="text-sm">
                                                <span className="text-gray-500 dark:text-gray-400">Tracking:</span>{' '}
                                                <span className="font-medium text-blue-500">{order.trackingNumber}</span>
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="p-4 sm:p-6">
                                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                                        Items ({order.items.length})
                                    </h4>
                                    <div className="space-y-4">
                                        {order.items.map((item) => (
                                            <div key={item._id} className="flex">
                                                <div className="flex-shrink-0 h-20 w-20 rounded-md overflow-hidden">
                                                    <img
                                                        src={item.photo || '/placeholder-product.jpg'}
                                                        alt={item.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                                <div className="ml-4 flex-1">
                                                    <div className="flex justify-between text-base font-medium text-navy-800 dark:text-white">
                                                        <h3>{item.name}</h3>
                                                        <p>₹{item.price.toLocaleString()}</p>
                                                    </div>
                                                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                        <p>Qty: {item.quantity}</p>
                                                        {item.size && <p>Size: {item.size}</p>}
                                                        {item.color && <p>Color: {item.color}</p>}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="px-4 py-3 sm:px-6 bg-gray-50 dark:bg-navy-700 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                    <div className="mb-2 sm:mb-0">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            <span>Expected delivery:</span>{' '}
                                            <span className="font-medium text-navy-800 dark:text-white">
                                                {order.expectedDeliveryDate
                                                    ? formatDate(order.expectedDeliveryDate)
                                                    : 'Calculating...'}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="space-x-3">
                                        <Link
                                            to={`/orders/${order._id}`}
                                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-navy-800 dark:text-white bg-white dark:bg-navy-800 hover:bg-gray-50 dark:hover:bg-navy-700"
                                        >
                                            View Details
                                        </Link>
                                        {order.status === 'delivered' && (
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-500 hover:bg-amber-600"
                                            >
                                                Buy Again
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersPage;
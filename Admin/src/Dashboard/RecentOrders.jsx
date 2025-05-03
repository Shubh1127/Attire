import React, { useContext, useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { ThemeContext } from '@/Context/ThemeContext'; // Adjust path as needed
import { useOwner } from '@/Context/OwnerContext'; // Import the OwnerContext

const RecentOrders = () => {
  const { theme } = useContext(ThemeContext);
  const { fetchOrders } = useOwner(); // Fetch orders from the OwnerContext
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const getRecentOrders = async () => {
      try {
        const { orders } = await fetchOrders('', 1, 5); // Fetch the first 5 recent orders
        setOrders(orders);
        console.log('Recent Orders:', orders);
      } catch (error) {
        console.error('Error fetching recent orders:', error);
      }
    };

    getRecentOrders();
  }, [fetchOrders]);

  return (
    <Card className={`overflow-hidden ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}`}>
      <CardHeader className="flex justify-between items-center">
        <CardTitle className={theme === 'dark' ? 'text-white' : ''}>
          Recent Orders
        </CardTitle>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr
              className={`text-left text-xs font-medium uppercase tracking-wider ${
                theme === 'dark'
                  ? 'text-gray-400 bg-gray-900'
                  : 'text-gray-500 bg-gray-50'
              }`}
            >
              <th className="px-6 py-3">Order ID</th>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Total</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody
            className={`divide-y ${
              theme === 'dark'
                ? 'divide-gray-700 bg-gray-800'
                : 'divide-gray-200 bg-white'
            }`}
          >
            {orders.map((order) => (
              <tr
                key={order._id}
                className={theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}
              >
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {order._id.slice(-8).toUpperCase()}
                  <div
                    className={`text-xs ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    {order.items.length} items
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                  <div className="h-8 w-8 flex-shrink-0 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {order.shippingAddress.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-3">
                      <p
                        className={`text-sm font-medium ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {order.shippingAddress.name || 'Unknown'}
                      </p>
                      <p
                        className={`text-xs ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        {order.shippingAddress.phone || 'No phone'}
                      </p>
                    </div>
                  </div>
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                  }`}
                >
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  ₹{order.total.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge
                    variant={
                      order.status === 'delivered'
                        ? 'success'
                        : order.status === 'shipped'
                        ? 'info'
                        : 'warning'
                    }
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Eye size={16} className={theme === 'dark' ? 'text-gray-300' : ''} />}
                  >
                    <span className={theme === 'dark' ? 'text-gray-300' : ''}>
                      View
                    </span>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default RecentOrders;
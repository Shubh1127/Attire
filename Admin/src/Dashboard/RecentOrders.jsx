import React, { useContext } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { ThemeContext } from '@/Context/ThemeContext'; // Adjust path as needed

const orders = [
  {
    id: 'ORD-7291',
    customer: {
      name: 'Emma Wilson',
      email: 'emma@example.com',
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1600'
    },
    date: '2023-05-28',
    total: '$129.95',
    status: 'pending',
    items: 3
  },
  {
    id: 'ORD-7292',
    customer: {
      name: 'John Miller',
      email: 'john@example.com',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1600'
    },
    date: '2023-05-27',
    total: '$85.00',
    status: 'shipped',
    items: 2
  },
  {
    id: 'ORD-7293',
    customer: {
      name: 'Sophia Chen',
      email: 'sophia@example.com',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1600'
    },
    date: '2023-05-26',
    total: '$212.50',
    status: 'delivered',
    items: 4
  },
  {
    id: 'ORD-7294',
    customer: {
      name: 'Michael Brown',
      email: 'michael@example.com',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1600'
    },
    date: '2023-05-25',
    total: '$59.99',
    status: 'shipped',
    items: 1
  },
  {
    id: 'ORD-7295',
    customer: {
      name: 'Olivia Davis',
      email: 'olivia@example.com',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1600'
    },
    date: '2023-05-24',
    total: '$175.25',
    status: 'delivered',
    items: 3
  },
];
const RecentOrders = () => {
  const { theme } = useContext(ThemeContext);

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
            <tr className={`text-left text-xs font-medium uppercase tracking-wider ${
              theme === 'dark' 
                ? 'text-gray-400 bg-gray-900' 
                : 'text-gray-500 bg-gray-50'
            }`}>
              <th className="px-6 py-3">Order</th>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Total</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${
            theme === 'dark' 
              ? 'divide-gray-700 bg-gray-800' 
              : 'divide-gray-200 bg-white'
          }`}>
            {orders.map((order) => (
              <tr 
                key={order.id} 
                className={theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}
              >
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {order.id}
                  <div className={`text-xs ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {order.items} items
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 flex-shrink-0">
                      <img 
                        className="h-8 w-8 rounded-full" 
                        src={order.customer.avatar} 
                        alt={order.customer.name} 
                      />
                    </div>
                    <div className="ml-3">
                      <p className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {order.customer.name}
                      </p>
                      <p className={`text-xs ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {order.customer.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  {new Date(order.date).toLocaleDateString()}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {order.total}
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
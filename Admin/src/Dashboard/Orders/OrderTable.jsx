import React, { useState, useContext } from 'react';
import { Eye, ArrowUpDown, Download, Search } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ThemeContext } from "@/Context/ThemeContext";

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
    items: 3,
    paymentStatus: 'paid'
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
    items: 2,
    paymentStatus: 'paid'
  },
  // ... (rest of your orders data)
];

const OrderTable = () => {
  const { theme } = useContext(ThemeContext);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter ? order.status === statusFilter : true;
    const matchesSearch = searchQuery
      ? order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesStatus && matchesSearch;
  });

  const totalAmount = filteredOrders.reduce((sum, order) => {
    return sum + parseFloat(order.total.replace('$', ''));
  }, 0);
    
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'shipped':
        return 'info';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'danger';
      default:
        return 'default';
    }
  };
  
  const getPaymentStatusBadgeVariant = (status) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'refunded':
        return 'warning';
      case 'failed':
        return 'danger';
      default:
        return 'default';
    }
  };

  // Theme-aware styles
  const inputStyles = `pl-10 pr-4 py-2 rounded-md focus:ring-2 focus:ring-offset-2 sm:text-sm ${
    theme === 'dark'
      ? 'bg-gray-700 border-gray-600 text-white focus:ring-gray-500 focus:border-gray-500'
      : 'border-gray-300 focus:ring-gray-500 focus:border-gray-500'
  }`;

  const selectStyles = `rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
    theme === 'dark'
      ? 'bg-gray-700 border-gray-600 text-white focus:ring-gray-500 focus:border-gray-500'
      : 'border-gray-300 focus:ring-gray-500 focus:border-gray-500'
  }`;

  return (
    <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6">
        <h3 className={`text-lg font-medium ${
          theme === 'dark' ? 'text-white' : ''
        }`}>
          Orders
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <Search size={16} />
            </div>
            <input
              type="text"
              placeholder="Search orders or customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={inputStyles}
            />
          </div>
          <select
            className={selectStyles}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <Button 
            variant="secondary" 
            size="sm"
            icon={<Download size={16} className={theme === 'dark' ? 'text-gray-300' : ''} />}
          >
            <span className={theme === 'dark' ? 'text-gray-300' : ''}>Export</span>
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y">
          <thead className={theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}>
            <tr>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
              }`}>
                <div className="flex items-center">
                  Order
                  <ArrowUpDown size={14} className="ml-1" />
                </div>
              </th>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
              }`}>
                Customer
              </th>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
              }`}>
                Date
              </th>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
              }`}>
                Status
              </th>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
              }`}>
                Payment
              </th>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
              }`}>
                Total
              </th>
              <th scope="col" className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
              }`}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${
            theme === 'dark' ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'
          }`}>
            {filteredOrders.map((order) => (
              <tr 
                key={order.id} 
                className={theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {order.id}
                  </div>
                  <div className={`text-xs ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {order.items} items
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 flex-shrink-0">
                      <img className="h-8 w-8 rounded-full" src={order.customer.avatar} alt="" />
                    </div>
                    <div className="ml-3">
                      <div className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {order.customer.name}
                      </div>
                      <div className={`text-xs ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {order.customer.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  {new Date(order.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={getStatusBadgeVariant(order.status)}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={getPaymentStatusBadgeVariant(order.paymentStatus)}>
                    {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                  </Badge>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {order.total}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    icon={<Eye size={16} className={theme === 'dark' ? 'text-gray-300' : ''} />}
                  >
                    <span className={theme === 'dark' ? 'text-gray-300' : ''}>View</span>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className={`flex items-center justify-between p-6 border-t ${
        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Showing <span className="font-medium">{filteredOrders.length}</span> of{' '}
            <span className="font-medium">{orders.length}</span> orders
          </p>
          <span className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          } sm:ml-4`}>
            Total Amount: <span className="font-medium">${totalAmount.toFixed(2)}</span>
          </span>
        </div>
        <div className="flex space-x-1">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default OrderTable;
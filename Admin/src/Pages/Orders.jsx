import React, { useContext } from 'react';
import OrderTable from '../Dashboard/Orders/OrderTable';
import { Card } from "@/components/ui/card";
import { DollarSign, Package, Clock, CheckCircle } from 'lucide-react';
import { ThemeContext } from "@/Context/ThemeContext"; // Adjust path as needed

const Orders = () => {
  const { theme } = useContext(ThemeContext);

  const orderStats = {
    total: {
      label: 'Total Orders',
      value: '$48,574.23',
      count: '1,482',
      icon: <DollarSign className="h-5 w-5" />,
      light: {
        iconColor: 'text-blue-600',
        bgColor: 'bg-blue-50'
      },
      dark: {
        iconColor: 'text-blue-400',
        bgColor: 'bg-blue-900'
      }
    },
    pending: {
      label: 'Pending Orders',
      value: '23',
      count: '$4,320.50',
      icon: <Clock className="h-5 w-5" />,
      light: {
        iconColor: 'text-amber-600',
        bgColor: 'bg-amber-50'
      },
      dark: {
        iconColor: 'text-amber-400',
        bgColor: 'bg-amber-900'
      }
    },
    processing: {
      label: 'Processing',
      value: '45',
      count: '$8,450.75',
      icon: <Package className="h-5 w-5" />,
      light: {
        iconColor: 'text-purple-600',
        bgColor: 'bg-purple-50'
      },
      dark: {
        iconColor: 'text-purple-400',
        bgColor: 'bg-purple-900'
      }
    },
    completed: {
      label: 'Completed',
      value: '1,414',
      count: '$35,803.98',
      icon: <CheckCircle className="h-5 w-5" />,
      light: {
        iconColor: 'text-green-600',
        bgColor: 'bg-green-50'
      },
      dark: {
        iconColor: 'text-green-400',
        bgColor: 'bg-green-900'
      }
    },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl font-semibold ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Orders
        </h1>
        <p className={`mt-1 text-sm ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`}>
          Track and manage customer orders, shipments, and payment status
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(orderStats).map(([key, stat]) => {
          const colors = theme === 'dark' ? stat.dark : stat.light;
          const iconWithColor = React.cloneElement(stat.icon, {
            className: `${stat.icon.props.className} ${colors.iconColor}`
          });

          return (
            <Card key={key} className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
              <div className="p-6">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${colors.bgColor}`}>
                    {iconWithColor}
                  </div>
                  <div className="ml-4">
                    <p className={`text-sm font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {stat.label}
                    </p>
                    <div className="flex items-baseline">
                      <p className={`text-2xl font-semibold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {stat.value}
                      </p>
                      <p className={`ml-2 text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {stat.count}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      
      <OrderTable />
    </div>
  );
};

export default Orders;
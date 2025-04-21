import React from 'react';
import OrderTable from '../Dashboard/Orders/OrderTable';
import { Card } from "@/components/ui/card";
import { DollarSign, Package, Clock, CheckCircle } from 'lucide-react';

const Orders = () => {
  const orderStats = {
    total: {
      label: 'Total Orders',
      value: '$48,574.23',
      count: '1,482',
      icon: <DollarSign className="h-5 w-5 text-blue-600" />,
      bgColor: 'bg-blue-50',
    },
    pending: {
      label: 'Pending Orders',
      value: '23',
      count: '$4,320.50',
      icon: <Clock className="h-5 w-5 text-amber-600" />,
      bgColor: 'bg-amber-50',
    },
    processing: {
      label: 'Processing',
      value: '45',
      count: '$8,450.75',
      icon: <Package className="h-5 w-5 text-purple-600" />,
      bgColor: 'bg-purple-50',
    },
    completed: {
      label: 'Completed',
      value: '1,414',
      count: '$35,803.98',
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      bgColor: 'bg-green-50',
    },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track and manage customer orders, shipments, and payment status
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(orderStats).map(([key, stat]) => (
          <Card key={key}>
            <div className="p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  {stat.icon}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                    <p className="ml-2 text-sm text-gray-500">{stat.count}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      <OrderTable />
    </div>
  );
};

export default Orders;
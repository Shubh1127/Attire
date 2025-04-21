import React from 'react';
import CustomerTable from '../Dashboard/customers/CustomerTable';
import { Card} from "@/components/ui/card";
import { Users, UserPlus, UserCheck, Star } from 'lucide-react';

const Customers = () => {
  const customerStats = {
    total: {
      label: 'Total Customers',
      value: '2,420',
      change: '+12.5%',
      icon: <Users className="h-5 w-5 text-blue-600" />,
      bgColor: 'bg-blue-50',
    },
    new: {
      label: 'New Customers',
      value: '187',
      change: '+32.1%',
      icon: <UserPlus className="h-5 w-5 text-green-600" />,
      bgColor: 'bg-green-50',
    },
    active: {
      label: 'Active Customers',
      value: '1,845',
      change: '+2.3%',
      icon: <UserCheck className="h-5 w-5 text-purple-600" />,
      bgColor: 'bg-purple-50',
    },
    vip: {
      label: 'VIP Customers',
      value: '245',
      change: '+8.7%',
      icon: <Star className="h-5 w-5 text-amber-600" />,
      bgColor: 'bg-amber-50',
    },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Customers</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your customers and track their activity
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(customerStats).map(([key, stat]) => (
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
                    <p className="ml-2 text-xs text-green-600">{stat.change}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      <CustomerTable />
    </div>
  );
};

export default Customers;
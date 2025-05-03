import React, { useContext, useState, useEffect } from 'react';
import CustomerTable from '../Dashboard/customers/CustomerTable';
import { Card } from "@/components/ui/card";
import { Users, UserPlus, UserCheck, Star } from 'lucide-react';
import { ThemeContext } from "@/Context/ThemeContext";
import { useOwner } from "@/Context/OwnerContext";

const Customers = () => {
  const { theme } = useContext(ThemeContext);
  const { fetchBuyerDetails } = useOwner();
  const [buyers, setBuyers] = useState([]);

  useEffect(() => {
    const getBuyers = async () => {
      try {
        const buyerDetails = await fetchBuyerDetails();
        setBuyers(buyerDetails);
      } catch (error) {
        console.error("Error fetching buyer details:", error);
      }
    };
    getBuyers();
  }, []);

  // Calculate statistics from buyers data
  const totalCustomers = buyers.length;
  const newCustomers = buyers.filter(buyer => {
    const lastOrderDate = new Date(buyer.lastOrderDate);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return lastOrderDate >= thirtyDaysAgo;
  }).length;
  const vipCustomers = buyers.filter(buyer => buyer.totalSpent > 500).length;

  const customerStats = {
    total: {
      label: 'Total Customers',
      value: totalCustomers,
      change: '+0%', // You can calculate this if you have historical data
      icon: <Users className="h-5 w-5" />,
      light: {
        iconColor: 'text-blue-600',
        bgColor: 'bg-blue-50'
      },
      dark: {
        iconColor: 'text-blue-400',
        bgColor: 'bg-blue-900'
      }
    },
    new: {
      label: 'New Customers',
      value: newCustomers,
      change: '+0%', // You can calculate this if you have historical data
      icon: <UserPlus className="h-5 w-5" />,
      light: {
        iconColor: 'text-green-600',
        bgColor: 'bg-green-50'
      },
      dark: {
        iconColor: 'text-green-400',
        bgColor: 'bg-green-900'
      }
    },
    active: {
      label: 'Active Customers',
      value: totalCustomers, // Assuming all fetched buyers are active
      change: '+0%', // You can calculate this if you have historical data
      icon: <UserCheck className="h-5 w-5" />,
      light: {
        iconColor: 'text-purple-600',
        bgColor: 'bg-purple-50'
      },
      dark: {
        iconColor: 'text-purple-400',
        bgColor: 'bg-purple-900'
      }
    },
    vip: {
      label: 'VIP Customers',
      value: vipCustomers,
      change: '+0%', // You can calculate this if you have historical data
      icon: <Star className="h-5 w-5" />,
      light: {
        iconColor: 'text-amber-600',
        bgColor: 'bg-amber-50'
      },
      dark: {
        iconColor: 'text-amber-400',
        bgColor: 'bg-amber-900'
      }
    },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl font-semibold ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Customers
        </h1>
        <p className={`mt-1 text-sm ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`}>
          Manage your customers and track their activity
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(customerStats).map(([key, stat]) => {
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
                      <p className={`ml-2 text-xs ${
                        stat.change.startsWith('+') 
                          ? theme === 'dark' ? 'text-green-400' : 'text-green-600'
                          : theme === 'dark' ? 'text-red-400' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      
      <CustomerTable buyers={buyers} />
    </div>
  );
};

export default Customers;
import React from 'react';
import { TrendingUp, Users, ShoppingBag, DollarSign } from 'lucide-react';
import {Card} from "@/components/ui/Card";

const StatCard = ({ title, value, change, changeType, icon, iconBg }) => {
  return (
    <Card className="flex items-center">
      <div className="flex-1 px-6 py-5">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <div className="mt-1 flex items-baseline">
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          <span 
            className={`ml-2 text-xs font-medium ${
              changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {changeType === 'positive' ? '+' : ''}{change}
          </span>
        </div>
      </div>
      <div className={`p-3 rounded-md mr-6 ${iconBg}`}>
        {icon}
      </div>
    </Card>
  );
};

const SalesOverview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Sales"
        value="$24,780"
        change="12.5%"
        changeType="positive"
        icon={<DollarSign size={20} className="text-green-600" />}
        iconBg="bg-green-50"
      />
      <StatCard
        title="Total Orders"
        value="1,482"
        change="8.2%"
        changeType="positive"
        icon={<ShoppingBag size={20} className="text-blue-600" />}
        iconBg="bg-blue-50"
      />
      <StatCard
        title="New Customers"
        value="312"
        change="3.1%"
        changeType="negative"
        icon={<Users size={20} className="text-purple-600" />}
        iconBg="bg-purple-50"
      />
      <StatCard
        title="Growth Rate"
        value="14.2%"
        change="5.4%"
        changeType="positive"
        icon={<TrendingUp size={20} className="text-amber-600" />}
        iconBg="bg-amber-50"
      />
    </div>
  );
};

export default SalesOverview;

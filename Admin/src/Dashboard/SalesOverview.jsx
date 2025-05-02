import React, { useEffect, useState, useContext } from 'react';
import { TrendingUp, Users, ShoppingBag, DollarSign } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { useOwner } from "@/Context/OwnerContext";
import { ThemeContext } from "@/Context/ThemeContext";

// Utility function for theme-aware colors
const themeColor = (lightColor, darkColor, theme) => 
  theme === 'dark' ? darkColor : lightColor;

const StatCard = ({ title, value, change, changeType, icon, iconBg }) => {
  const { theme } = useContext(ThemeContext);

  // Determine colors based on theme
  const textColor = themeColor('text-gray-600', 'text-gray-400', theme);
  const valueColor = themeColor('text-gray-900', 'text-white', theme);
  const positiveColor = themeColor('text-green-600', 'text-green-400', theme);
  const negativeColor = themeColor('text-red-600', 'text-red-400', theme);
  const iconColor = theme === 'dark' 
    ? icon.props.className.replace('600', '300') 
    : icon.props.className;

  return (
    <Card className={`flex items-center ${
      themeColor('', 'bg-gray-800 border-gray-700', theme)
    }`}>
      <div className="flex-1 px-6 py-5">
        <p className={`text-sm font-medium ${textColor}`}>
          {title}
        </p>
        <div className="mt-1 flex items-baseline">
          <p className={`text-2xl font-semibold ${valueColor}`}>
            {value}
          </p>
          <span
            className={`ml-2 text-xs font-medium ${
              changeType === 'positive' ? positiveColor : negativeColor
            }`}
          >
            {changeType === 'positive' ? '+' : ''}{change}
          </span>
        </div>
      </div>
      <div className={`p-3 rounded-md mr-6 ${
        theme === 'dark' ? iconBg.replace('50', '900') : iconBg
      }`}>
        {React.cloneElement(icon, { className: iconColor })}
      </div>
    </Card>
  );
};

const SalesOverview = () => {
  const { theme } = useContext(ThemeContext);
  const { fetchTotalProducts } = useOwner();
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    const getTotalProducts = async () => {
      try {
        const total = await fetchTotalProducts();
        setTotalProducts(total);
      } catch (error) {
        console.error("Error fetching total products:", error);
      }
    };

    getTotalProducts();
  }, [fetchTotalProducts]);

  // Theme-aware icon background generator
  const getIconBg = (baseColor) => 
    themeColor(`bg-${baseColor}-50`, `bg-${baseColor}-900`, theme);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Sales"
        value="$24,780"
        change="12.5%"
        changeType="positive"
        icon={<DollarSign size={20} className="text-green-600" />}
        iconBg={getIconBg('green')}
      />
      <StatCard
        title="Total Orders"
        value="1,482"
        change="8.2%"
        changeType="positive"
        icon={<ShoppingBag size={20} className="text-blue-600" />}
        iconBg={getIconBg('blue')}
      />
      <StatCard
        title="New Customers"
        value="312"
        change="3.1%"
        changeType="negative"
        icon={<Users size={20} className="text-purple-600" />}
        iconBg={getIconBg('purple')}
      />
      <StatCard
        title="Total Products"
        value={totalProducts}
        change="5.4%"
        changeType="positive"
        icon={<TrendingUp size={20} className="text-amber-600" />}
        iconBg={getIconBg('amber')}
      />
    </div>
  );
};

export default SalesOverview;
import React, { useState, useContext, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeContext } from "@/Context/ThemeContext";
import { useOwner } from "@/Context/OwnerContext";

// Utility function for theme-aware colors
const themeColor = (lightColor, darkColor, theme) => 
  theme === 'dark' ? darkColor : lightColor;

const formatDateLabel = (period, data) => {
  if (period === 'week') {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return data.map(item => ({
      ...item,
      formattedDate: days[new Date(item._id.year, 0, item._id.date).getDay()]
    }));
  }
  if (period === 'month') {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return data.map(item => ({
      ...item,
      formattedDate: months[item._id.date - 1]
    }));
  }
  if (period === 'year') {
    return data.map(item => ({
      ...item,
      formattedDate: item._id.year.toString()
    }));
  }
  return data;
};

const SalesChart = () => {
  const { theme } = useContext(ThemeContext);
  const { fetchSalesAnalytics } = useOwner();
  const [timeFrame, setTimeFrame] = useState('month');
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dataFrames, setDataFrames] = useState({
    week: null,
    month: null,
    year: null
  });

  useEffect(() => {
    const loadData = async () => {
      // Only fetch if we don't have data for this timeFrame
      if (!dataFrames[timeFrame]) {
        try {
          setLoading(true);
          const data = await fetchSalesAnalytics(timeFrame);
          const formattedData = formatDateLabel(timeFrame, data);
          
          setSalesData(formattedData);
          setDataFrames(prev => ({
            ...prev,
            [timeFrame]: formattedData
          }));
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      } else {
        // Use cached data if available
        setSalesData(dataFrames[timeFrame]);
      }
    };

    loadData();
  }, [timeFrame, fetchSalesAnalytics, dataFrames]);

  // Clear cached data when component unmounts to prevent memory leaks
  useEffect(() => {
    return () => {
      setDataFrames({
        week: null,
        month: null,
        year: null
      });
    };
  }, []);

  // Theme-aware colors
  const cardBg = themeColor('bg-white', 'bg-gray-800', theme);
  const cardBorder = themeColor('border-gray-200', 'border-gray-700', theme);
  const textPrimary = themeColor('text-gray-900', 'text-white', theme);
  const textSecondary = themeColor('text-gray-600', 'text-gray-400', theme);
  const barBg = themeColor('bg-gray-900', 'bg-gray-300', theme);
  const barHover = themeColor('bg-gray-800', 'bg-gray-400', theme);
  const positiveBadgeBg = themeColor('bg-green-100', 'bg-green-900', theme);
  const positiveBadgeText = themeColor('text-green-800', 'text-green-200', theme);

  if (loading) {
    return (
      <Card className={`h-full ${cardBg} ${cardBorder}`}>
        <CardHeader>
          <CardTitle className={textPrimary}>Sales Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <p className={textSecondary}>Loading sales data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`h-full ${cardBg} ${cardBorder}`}>
        <CardHeader>
          <CardTitle className={textPrimary}>Sales Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <p className="text-red-500">Error: {error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const maxSales = salesData.length > 0 
    ? Math.max(...salesData.map(item => item.totalSales)) 
    : 0;

  const totalSales = salesData.reduce((sum, item) => sum + item.totalSales, 0);
  const averageSales = salesData.length > 0 
    ? totalSales / salesData.length 
    : 0;

  return (
    <Card className={`h-full ${cardBg} ${cardBorder}`}>
      <CardHeader className="flex justify-between items-center">
        <CardTitle className={textPrimary}>Sales Overview</CardTitle>
        <div className="flex space-x-2">
          <Button 
            variant={timeFrame === 'week' ? 'primary' : 'outline'} 
            size="sm"
            onClick={() => setTimeFrame('week')}
          >
            Weekly
          </Button>
          <Button 
            variant={timeFrame === 'month' ? 'primary' : 'outline'} 
            size="sm"
            onClick={() => setTimeFrame('month')}
          >
            Monthly
          </Button>
          <Button 
            variant={timeFrame === 'year' ? 'primary' : 'outline'} 
            size="sm"
            onClick={() => setTimeFrame('year')}
          >
            Yearly
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <p className={textSecondary}>Loading...</p>
            </div>
          ) : error ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-red-500">Error: {error}</p>
            </div>
          ) : salesData.length > 0 ? (
            <div className="flex h-full items-end space-x-2">
              {salesData.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className={`w-full ${barBg} hover:${barHover} transition-all rounded-t-sm`} 
                    style={{ 
                      height: maxSales > 0 ? `${(item.totalSales / maxSales) * 100}%` : '0%',
                      minHeight: '4px'
                    }}
                  ></div>
                  <div className={`text-xs mt-2 ${textSecondary}`}>
                    {item.formattedDate || item._id.date}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className={textSecondary}>No sales data available</p>
            </div>
          )}
        </div>
        <div className="mt-6 flex items-center justify-between">
          <div>
            <p className={`text-sm ${textSecondary}`}>Total Sales</p>
            <p className={`text-2xl font-semibold ${textPrimary}`}>
              ₹{totalSales.toFixed(2)}
            </p>
          </div>
          <div>
            <p className={`text-sm ${textSecondary}`}>Average</p>
            <p className={`text-2xl font-semibold ${textPrimary}`}>
              ₹{averageSales.toFixed(2)}
            </p>
          </div>
          <div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${positiveBadgeBg} ${positiveBadgeText}`}>
              +0.0%
            </span>
            <p className={`text-xs ${textSecondary} mt-1`}>vs previous period</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesChart;
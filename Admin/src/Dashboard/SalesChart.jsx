import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Mock data for the chart
const weeklyData = [
  { date: 'Mon', sales: 1240 },
  { date: 'Tue', sales: 1850 },
  { date: 'Wed', sales: 1400 },
  { date: 'Thu', sales: 2100 },
  { date: 'Fri', sales: 1800 },
  { date: 'Sat', sales: 2400 },
  { date: 'Sun', sales: 1900 },
];

const monthlyData = [
  { date: 'Jan', sales: 12500 },
  { date: 'Feb', sales: 15000 },
  { date: 'Mar', sales: 18000 },
  { date: 'Apr', sales: 16500 },
  { date: 'May', sales: 21000 },
  { date: 'Jun', sales: 19500 },
  { date: 'Jul', sales: 22800 },
  { date: 'Aug', sales: 24700 },
  { date: 'Sep', sales: 23500 },
  { date: 'Oct', sales: 26800 },
  { date: 'Nov', sales: 27900 },
  { date: 'Dec', sales: 32400 },
];

const SalesChart = () => {
  const [timeFrame, setTimeFrame] = useState('weekly');
  const data = timeFrame === 'weekly' ? weeklyData : monthlyData;
  
  const maxSales = Math.max(...data.map(item => item.sales));
  
  return (
    <Card className="h-full">
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Sales Overview</CardTitle>
        <div className="flex space-x-2">
          <Button 
            variant={timeFrame === 'weekly' ? 'primary' : 'outline'} 
            size="sm"
            onClick={() => setTimeFrame('weekly')}
          >
            Weekly
          </Button>
          <Button 
            variant={timeFrame === 'monthly' ? 'primary' : 'outline'} 
            size="sm"
            onClick={() => setTimeFrame('monthly')}
          >
            Monthly
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <div className="flex h-full items-end space-x-2">
            {data.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-gray-900 hover:bg-gray-800 transition-all rounded-t-sm" 
                  style={{ 
                    height: `${(item.sales / maxSales) * 100}%`,
                    minHeight: '4px'
                  }}
                ></div>
                <div className="text-xs mt-2 text-gray-600">{item.date}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Sales</p>
            <p className="text-2xl font-semibold">
              {timeFrame === 'weekly' 
                ? '$12,690' 
                : '$248,200'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Average</p>
            <p className="text-2xl font-semibold">
              {timeFrame === 'weekly' 
                ? '$1,813' 
                : '$20,683'}
            </p>
          </div>
          <div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              +{timeFrame === 'weekly' ? '8.2%' : '12.4%'}
            </span>
            <p className="text-xs text-gray-600 mt-1">vs previous period</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesChart;

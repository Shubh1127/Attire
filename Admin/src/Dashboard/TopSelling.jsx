import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {Badge} from "@/components/ui/badge"; // Adjust the path based on the actual location
import { TrendingUp, TrendingDown } from 'lucide-react';

const products = [
  {
    id: 1,
    name: 'Classic White T-Shirt',
    category: 'Men',
    price: '$29.99',
    image: 'https://images.pexels.com/photos/5384423/pexels-photo-5384423.jpeg?auto=compress&cs=tinysrgb&w=1600',
    sold: 278,
    stock: 23,
    trend: 'up',
    percentage: '12%'
  },
  {
    id: 2,
    name: 'Black Slim Dress',
    category: 'Women',
    price: '$89.99',
    image: 'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=1600',
    sold: 214,
    stock: 15,
    trend: 'up',
    percentage: '8%'
  },
  {
    id: 3,
    name: 'Denim Jacket',
    category: 'Men',
    price: '$125.00',
    image: 'https://images.pexels.com/photos/3651597/pexels-photo-3651597.jpeg?auto=compress&cs=tinysrgb&w=1600',
    sold: 195,
    stock: 8,
    trend: 'down',
    percentage: '3%'
  },
  {
    id: 4,
    name: 'Kids Summer Set',
    category: 'Kids',
    price: '$45.00',
    image: 'https://images.pexels.com/photos/6157052/pexels-photo-6157052.jpeg?auto=compress&cs=tinysrgb&w=1600',
    sold: 176,
    stock: 32,
    trend: 'up',
    percentage: '5%'
  },
];

const TopSellingProducts = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Selling Products</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-gray-200">
          {products.map((product) => (
            <li key={product.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-md overflow-hidden border border-gray-200">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {product.name}
                  </p>
                  <div className="flex items-center mt-1">
                    <Badge className="mr-2">{product.category}</Badge>
                    <span className="text-sm text-gray-500">{product.price}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-medium text-gray-900">{product.sold} sold</span>
                    {product.trend === 'up' ? (
                      <TrendingUp size={16} className="text-green-500" />
                    ) : (
                      <TrendingDown size={16} className="text-red-500" />
                    )}
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {product.stock} in stock
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default TopSellingProducts;

import React, { useContext, useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from 'lucide-react';
import { ThemeContext } from "../Context/ThemeContext";
import { useOwner } from "../Context/OwnerContext";

const TopSellingProducts = () => {
  const { theme } = useContext(ThemeContext);
  const [products, setProducts] = useState([]);
  const [soldProducts, setSoldProducts] = useState([]);
  const { fetchProducts, fetchOrders } = useOwner();

  useEffect(() => {
    const getProductsAndOrders = async () => {
      try {
        // Fetch products
        const fetchedProducts = await fetchProducts();

        // Fetch orders
        const { orders } = await fetchOrders("", 1, 100); // Fetch up to 100 orders

        // Create a map of product IDs and their sold quantities
        const soldMap = {};
        orders.forEach(order => {
          order.items.forEach(item => {
            if (soldMap[item.productId]) {
              soldMap[item.productId] += item.quantity;
            } else {
              soldMap[item.productId] = item.quantity;
            }
          });
        });

        // Filter products that are sold and add their sold quantities
        const filteredProducts = fetchedProducts
          .filter(product => soldMap[product.id])
          .map(product => ({
            ...product,
            sold: soldMap[product.id], // Add the sold quantity to the product
          }));

        setProducts(fetchedProducts);
        setSoldProducts(filteredProducts);
      } catch (error) {
        console.error("Error fetching products or orders:", error);
      }
    };

    getProductsAndOrders();
  }, [fetchProducts, fetchOrders]);

  return (
    <Card className={theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}>
      <CardHeader>
        <CardTitle className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
          Top Selling Products
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className={theme === 'dark' ? 'divide-y divide-gray-700' : 'divide-y divide-gray-200'}>
          {soldProducts.map((product) => (
            <li
              key={product.id}
              className={`p-4 ${
                theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-md overflow-hidden border ${
                    theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={product.photo[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {product.name}
                  </p>
                  <div className="flex items-center mt-1">
                    <Badge className="mr-2">{product.category}</Badge>
                    <span
                      className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      {product.price}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <span
                      className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {product.sold} sold
                    </span>
                    {product.sold > 0 ? (
                      <TrendingUp size={16} className="text-green-500" />
                    ) : (
                      <TrendingDown size={16} className="text-red-500" />
                    )}
                  </div>
                  <p
                    className={`mt-1 text-xs ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    {product.quantity} in stock
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
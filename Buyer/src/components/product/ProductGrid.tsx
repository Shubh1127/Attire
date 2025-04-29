import React, { useEffect } from 'react';
import { useBuyerContext } from '../../Context/BuyerContext';
import ProductCard from './ProductCard';
import { useTheme } from '../../Context/ThemeContext';

const ProductGrid: React.FC = () => {
  const { allProducts, fetchAllProducts } = useBuyerContext();
  const { theme } = useTheme();

  useEffect(() => {
    fetchAllProducts();
  }, []);


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {allProducts.length > 0 ? (
        allProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))
      ) : (
        <div className="col-span-full py-10 text-center">
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
            No products found
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
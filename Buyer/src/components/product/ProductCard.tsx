import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Product } from '../../types';
import { formatPrice, getDiscountPercentage, truncateText } from '../../lib/utils';
import Button from '../ui/Button';
import { useCartStore } from '../../store/cartStore';
import { useTheme } from '../../Context/ThemeContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCartStore();
  const { theme } = useTheme();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Safely get first size and color with fallbacks
    const defaultSize = product.sizes?.length ? product.sizes[0] : 'One Size';
    const defaultColor = product.colors?.length ? product.colors[0] : 'Default';
    
    addItem(product, 1, defaultSize, defaultColor);
  };

  return (
    <Link 
      to={`/product/${product._id}`}
      className={`group rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full ${
        theme === 'dark' ? 'bg-navy-800' : 'bg-white'
      }`}
    >
      {/* Product Image */}
      <div className={`relative h-64 overflow-hidden ${
        theme === 'dark' ? 'bg-navy-700' : 'bg-gray-100'
      }`}>
        <img 
          src={product.photo?.[0] || '/placeholder-product.jpg'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Discount Badge */}
        {product.discountPrice && (
          <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {getDiscountPercentage(product.price, product.discountPrice)}% OFF
          </div>
        )}
        
        {/* New Arrival Badge */}
        {product.isNewArrival && (
          <div className={`absolute top-2 right-2 text-white text-xs font-bold px-2 py-1 rounded-full ${
            theme === 'dark' ? 'bg-amber-500' : 'bg-navy-700'
          }`}>
            NEW
          </div>
        )}
        
        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="space-y-2">
            <Button 
              variant="primary" 
              className="w-36"
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
      
      {/* Product Info */}
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className={`font-medium group-hover:text-amber-500 transition-colors ${
            theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
          }`}>
            {truncateText(product.name, 30)}
          </h3>
          <button className={`transition-colors ${
            theme === 'dark' ? 'text-gray-400 hover:text-amber-400' : 'text-gray-400 hover:text-red-500'
          }`}>
            <Heart className="h-5 w-5" />
          </button>
        </div>
        
        <div className={`text-sm mb-1 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {product.category?.charAt(0).toUpperCase() + product.category?.slice(1)}
        </div>
        
        <div className="mt-auto flex items-center pt-2">
          {product.discountPrice ? (
            <div className="flex items-center space-x-2">
              <span className={`font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {formatPrice(product.discountPrice)}
              </span>
              <span className={`text-sm line-through ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
              }`}>
                {formatPrice(product.price)}
              </span>
            </div>
          ) : (
            <span className={`font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {formatPrice(product.price)}
            </span>
          )}
          
          <div className={`ml-auto flex items-center ${
            theme === 'dark' ? 'text-amber-400' : 'text-amber-500'
          }`}>
            <span className="text-sm font-medium mr-1">{product.rating || '0'}</span>
            <span className="text-xs">★</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
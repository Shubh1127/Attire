import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingBag, Heart, Clock, Truck, RotateCcw } from 'lucide-react';
import { useProductStore } from '../store/productStore';
import { useCartStore } from '../store/cartStore';
import Button from '../components/ui/Button';
import ProductGrid from '../components/product/ProductGrid';
import { formatPrice } from '../lib/utils';
import { useBuyerContext } from '../Context/BuyerContext';
import { useTheme } from '../Context/ThemeContext';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchProductById,addToCart } = useBuyerContext();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { getProductById, getRelatedProducts } = useProductStore();
  const { addItem } = useCartStore();
  const { theme } = useTheme();
  
  const relatedProducts = getRelatedProducts(id!, 4);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const productData = await fetchProductById(id);
        setProduct(productData);
      } catch (error) {
        console.error("Failed to load product:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className={`min-h-screen pt-24 pb-16 flex items-center justify-center ${
        theme === 'dark' ? 'bg-navy-900' : 'bg-white'
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Loading product...</p>
        </div>
      </div>
    );
  }

  const handleImageChange = (index: number) => {
    setCurrentImageIndex(index);
  };

  if (!product) {
    return (
      <div className={`min-h-screen pt-24 pb-16 flex items-center justify-center ${
        theme === 'dark' ? 'bg-navy-900' : 'bg-white'
      }`}>
        <div className="text-center">
          <h2 className={`text-2xl font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Product Not Found</h2>
          <p className={`mb-6 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>The product you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/')}>Back to Homepage</Button>
        </div>
      </div>
    );
  }
  
  const handleAddToCart = () => {
    if (!selectedSize) {
      setError('Please select a size');
      return;
    }
  
    if (!selectedColor) {
      setError('Please select a color');
      return;
    }
  
    addToCart(product._id, quantity, selectedSize, selectedColor); // Pass size and color
    if (error) setError(null);
  };
  
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };
  
  return (
    <div className={`min-h-screen pt-24 pb-16 ${
      theme === 'dark' ? 'bg-navy-900' : 'bg-white'
    }`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Product Images */}
          <div>
            <div className={`rounded-lg overflow-hidden mb-4 h-96 flex items-center justify-center ${
              theme === 'dark' ? 'bg-navy-800' : 'bg-gray-100'
            }`}>
              {product.photo && product.photo.length > 0 ? (
                <img 
                  src={product.photo[currentImageIndex]} 
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                  No image available
                </div>
              )}
            </div>
            
            <div className="flex space-x-4 overflow-x-auto pb-2">
              {product.photo && product.photo.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => handleImageChange(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${
                    currentImageIndex === index 
                      ? theme === 'dark'
                        ? 'border-amber-500 scale-105'
                        : 'border-navy-600 scale-105'
                      : theme === 'dark'
                        ? 'border-transparent hover:border-navy-600'
                        : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img 
                    src={image} 
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
          
          {/* Product Details */}
          <div>
            <h1 className={`text-3xl font-bold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>{product.name}</h1>
            
            <div className="flex items-center mb-4">
              <div className="flex items-center mr-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating) 
                        ? 'text-amber-500 fill-amber-500' 
                        : theme === 'dark' 
                          ? 'text-gray-600' 
                          : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center">
                {product.discountPrice ? (
                  <>
                    <span className={`text-2xl font-bold mr-3 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {formatPrice(product.discountPrice)}
                    </span>
                    <span className={`text-lg line-through ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      {formatPrice(product.price)}
                    </span>
                  </>
                ) : (
                  <span className={`text-2xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
            </div>
            
            <div className="mb-6">
              <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                {product.description}
              </p>
            </div>
            
            {/* Size Selection */}
            <div className="mb-6">
              <h3 className={`text-sm font-medium mb-3 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-900'
              }`}>Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    className={`px-4 py-2 text-sm rounded-md border ${
                      selectedSize === size
                        ? theme === 'dark'
                          ? 'bg-amber-500 text-white border-amber-500'
                          : 'bg-navy-700 text-white border-navy-700'
                        : theme === 'dark'
                          ? 'bg-navy-800 text-gray-300 border-navy-700 hover:border-amber-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-navy-500'
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Color Selection */}
            <div className="mb-6">
              <h3 className={`text-sm font-medium mb-3 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-900'
              }`}>Color</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(color => (
                  <button
                    key={color}
                    className={`px-4 py-2 text-sm rounded-md border ${
                      selectedColor === color
                        ? theme === 'dark'
                          ? 'bg-amber-500 text-white border-amber-500'
                          : 'bg-navy-700 text-white border-navy-700'
                        : theme === 'dark'
                          ? 'bg-navy-800 text-gray-300 border-navy-700 hover:border-amber-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-navy-500'
                    }`}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Quantity */}
            <div className="mb-6">
              <h3 className={`text-sm font-medium mb-3 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-900'
              }`}>Quantity</h3>
              <div className={`flex items-center border rounded-md w-32 ${
                theme === 'dark' ? 'border-navy-700' : 'border-gray-300'
              }`}>
                <button
                  type="button"
                  className={`p-2 ${
                    theme === 'dark' ? 'text-gray-400 hover:text-amber-400' : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                  </svg>
                </button>
                <span className={`flex-1 text-center ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {quantity}
                </span>
                <button
                  type="button"
                  className={`p-2 ${
                    theme === 'dark' ? 'text-gray-400 hover:text-amber-400' : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= 10}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Stocks */}
            <div className='mb-6'>
              {product.quantity > 0 ? (
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-green-400' : 'text-green-600'
                }`}>
                  In Stock: {product.quantity} items available
                </p>
              ) : (
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-red-400' : 'text-red-600'
                }`}>
                  Out of Stock
                </p>
              )}
            </div>
            
            {error && (
              <p className={`text-sm mb-4 ${
                theme === 'dark' ? 'text-red-400' : 'text-red-600'
              }`}>{error}</p>
            )}
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mb-8">
              <Button
                onClick={handleAddToCart}
                className="flex-1"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              
              <Button
                variant="outline"
                className="px-4"
              >
                <Heart className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Shipping Info */}
            <div className={`border-t pt-6 space-y-4 ${
              theme === 'dark' ? 'border-navy-700' : 'border-gray-200'
            }`}>
              <div className="flex items-center">
                <Clock className={`h-5 w-5 mr-3 ${
                  theme === 'dark' ? 'text-amber-400' : 'text-amber-500'
                }`} />
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  Orders placed before 3 PM ship the same day
                </span>
              </div>
              <div className="flex items-center">
                <Truck className={`h-5 w-5 mr-3 ${
                  theme === 'dark' ? 'text-amber-400' : 'text-amber-500'
                }`} />
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  Free shipping on orders above ₹999
                </span>
              </div>
              <div className="flex items-center">
                <RotateCcw className={`h-5 w-5 mr-3 ${
                  theme === 'dark' ? 'text-amber-400' : 'text-amber-500'
                }`} />
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  Easy 30-day returns and exchanges
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Description */}
        <div className="mb-16">
          <h2 className={`text-2xl font-bold mb-6 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Product Details</h2>
          <div className={`rounded-lg shadow-sm p-6 border ${
            theme === 'dark' ? 'bg-navy-800 border-navy-700' : 'bg-white border-gray-200'
          }`}>
            <p className={theme === 'dark' ? 'text-gray-300 leading-relaxed' : 'text-gray-700 leading-relaxed'}>
              {product.description}
            </p>
          </div>
        </div>
        
        {/* Related Products */}
        <div>
          <h2 className={`text-2xl font-bold mb-6 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>You May Also Like</h2>
          <ProductGrid products={relatedProducts} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
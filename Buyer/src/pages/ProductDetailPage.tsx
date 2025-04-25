import React, { useState,useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingBag, Heart, Clock, Truck, RotateCcw } from 'lucide-react';
import { useProductStore } from '../store/productStore';
import { useCartStore } from '../store/cartStore';
import Button from '../components/ui/Button';
import ProductGrid from '../components/product/ProductGrid';
import { formatPrice } from '../lib/utils';
import { useBuyerContext } from '../Context/BuyerContext';


const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchProductById } = useBuyerContext(); // Add this to your BuyerContext
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { getProductById, getRelatedProducts } = useProductStore();
  const { addItem } = useCartStore();
  
  // const product = getProductById(id!);
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
    return <div>Loading...</div>;
  }
  if (!product) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/')}>Back to Homepage</Button>
        </div>
      </div>
    );
  }
  
  const handleAddToCart = () => {
    // Validate selections
    if (!selectedSize) {
      setError('Please select a size');
      return;
    }
    
    if (!selectedColor) {
      setError('Please select a color');
      return;
    }
    
    // Add to cart
    addItem(product, quantity, selectedSize, selectedColor);
    
    // Clear error if exists
    if (error) setError(null);
    
    // Show success feedback
    // In a real app, you might use a toast notification here
    console.log('Added to cart:', { product, quantity, selectedSize, selectedColor });
  };
  
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };
  
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Product Images */}
          <div>
            <div className="bg-gray-100 rounded-lg overflow-hidden mb-4 h-96">
              <img 
                src={product.photo} 
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex space-x-4 overflow-x-auto pb-2">
              {product.photo.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-20 h-20 rounded-md overflow-hidden border-2 ${
                    currentImageIndex === index ? 'border-navy-600' : 'border-transparent'
                  }`}
                >
                  <img 
                    src={image} 
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
          
          {/* Product Details */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            
            <div className="flex items-center mb-4">
              <div className="flex items-center mr-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating) 
                        ? 'text-amber-500 fill-amber-500' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600 text-sm">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center">
                {product.discountPrice ? (
                  <>
                    <span className="text-2xl font-bold text-gray-900 mr-3">
                      {formatPrice(product.discountPrice)}
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                      {formatPrice(product.price)}
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700">{product.description}</p>
            </div>
            
            {/* Size Selection */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    className={`px-4 py-2 text-sm rounded-md border ${
                      selectedSize === size
                        ? 'bg-navy-700 text-white border-navy-700'
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
              <h3 className="text-sm font-medium text-gray-900 mb-3">Color</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(color => (
                  <button
                    key={color}
                    className={`px-4 py-2 text-sm rounded-md border ${
                      selectedColor === color
                        ? 'bg-navy-700 text-white border-navy-700'
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
              <h3 className="text-sm font-medium text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center border rounded-md w-32">
                <button
                  type="button"
                  className="p-2 text-gray-600 hover:text-gray-900"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                  </svg>
                </button>
                <span className="flex-1 text-center text-gray-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  className="p-2 text-gray-600 hover:text-gray-900"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= 10}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>
            
            {error && (
              <p className="text-red-600 text-sm mb-4">{error}</p>
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
            <div className="border-t border-gray-200 pt-6 space-y-4">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-amber-500 mr-3" />
                <span className="text-sm text-gray-600">
                  Orders placed before 3 PM ship the same day
                </span>
              </div>
              <div className="flex items-center">
                <Truck className="h-5 w-5 text-amber-500 mr-3" />
                <span className="text-sm text-gray-600">
                  Free shipping on orders above ₹999
                </span>
              </div>
              <div className="flex items-center">
                <RotateCcw className="h-5 w-5 text-amber-500 mr-3" />
                <span className="text-sm text-gray-600">
                  Easy 30-day returns and exchanges
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Description */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Details</h2>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>
        
        {/* Related Products */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
          <ProductGrid products={product} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
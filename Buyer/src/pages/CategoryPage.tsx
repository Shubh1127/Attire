import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProductStore } from '../store/productStore';
import { SlidersHorizontal, X } from 'lucide-react';
import { useBuyerContext } from '../Context/BuyerContext';

const CategoryPage = () => {
  const { allProducts = [], fetchAllProducts } = useBuyerContext();
  const { category } = useParams();
  const { setFilter, clearFilters, getFilteredProducts } = useProductStore();
  
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);

  useEffect(() => {
    const fetchingAllProducts = async () => {
      try {
        await fetchAllProducts();
        console.log("Fetched all products:", allProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchingAllProducts();
  }, []);

  // Extract available sizes and colors from products
  const availableSizes = Array.from(
    new Set(allProducts.flatMap(product => product.sizes))
  ).filter(Boolean);

  const availableColors = Array.from(
    new Set(allProducts.flatMap(product => product.colors))
  ).filter(Boolean);

  // Set filter when category changes
  useEffect(() => {
    clearFilters();
    if (category) {
      setFilter({ category });
    }
  }, [category, setFilter, clearFilters]);
  
  // Update filters when selections change
  useEffect(() => {
    setFilter({
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      sizes: selectedSizes.length > 0 ? selectedSizes : undefined,
      colors: selectedColors.length > 0 ? selectedColors : undefined,
    });
  }, [priceRange, selectedSizes, selectedColors, setFilter]);
  
  // Get filtered products
  const products = getFilteredProducts();
  
  const toggleSize = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size) 
        : [...prev, size]
    );
  };
  
  const toggleColor = (color) => {
    setSelectedColors(prev => 
      prev.includes(color) 
        ? prev.filter(c => c !== color) 
        : [...prev, color]
    );
  };
  
  const resetFilters = () => {
    setPriceRange([0, 5000]);
    setSelectedSizes([]);
    setSelectedColors([]);
  };
  
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {category ? category.toUpperCase() : 'All Products'}
          </h1>
          <p className="text-gray-600 mt-2">
            Discover our collection of {category ? category.toLowerCase() : 'products'}
          </p>
        </div>
        
        {/* Mobile Filter Toggle */}
        <div className="md:hidden mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-center space-x-2 py-2 px-4 border border-gray-300 rounded-md bg-white text-gray-700"
          >
            <SlidersHorizontal className="h-5 w-5" />
            <span>Filters</span>
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row">
          {/* Filters Sidebar */}
          <div 
            className={`${
              showFilters ? 'block' : 'hidden'
            } md:block w-full md:w-64 md:mr-8 p-4 bg-white rounded-lg shadow-sm border border-gray-200`}
          >
            <div className="flex items-center justify-between md:justify-start md:mb-6 mb-4">
              <h2 className="text-lg font-medium text-gray-900">Filters</h2>
              <button 
                onClick={resetFilters}
                className="text-sm text-navy-600 hover:text-navy-800 ml-4"
              >
                Reset All
              </button>
              <button 
                className="md:hidden text-gray-500"
                onClick={() => setShowFilters(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Price Range Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Price Range</h3>
              <div className="flex justify-between mb-2">
                <span className="text-xs text-gray-600">₹{priceRange[0]}</span>
                <span className="text-xs text-gray-600">₹{priceRange[1]}</span>
              </div>
              <input
                type="range"
                min="0"
                max="5000"
                step="100"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full"
              />
            </div>
            
            {/* Size Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Size</h3>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map(size => (
                  <button
                    key={size}
                    className={`px-3 py-1 text-xs rounded-md border ${
                      selectedSizes.includes(size)
                        ? 'bg-navy-700 text-white border-navy-700'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-navy-500'
                    }`}
                    onClick={() => toggleSize(size)}
                  >
                    {size.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Color Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Color</h3>
              <div className="flex flex-wrap gap-2">
                {availableColors.map(color => (
                  <button
                    key={color}
                    className={`px-3 py-1 text-xs rounded-md border ${
                      selectedColors.includes(color)
                        ? 'bg-navy-700 text-white border-navy-700'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-navy-500'
                    }`}
                    onClick={() => toggleColor(color)}
                  >
                    {color.charAt(0).toUpperCase() + color.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Products Grid - Directly in CategoryPage */}
          <div className="flex-1">
            {products.length === 0 ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-gray-500 text-lg">
                  No {category ? category.toLowerCase() : 'products'} found matching your filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {allProducts.map((product) => (
                  <div key={product._id} className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                    <Link to={`/product/${product._id}`} className="block">
                      {/* Product Image */}
                      <div className="aspect-square bg-gray-100 overflow-hidden">
                        <img
                          src={product.photo?.[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-300"
                        />
                      </div>
                      
                      {/* Product Info */}
                      <div className="p-4">
                        {/* Status Badge */}
                        {product.status && (
                          <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full mb-2">
                            {product.status}
                          </span>
                        )}
                        
                        {/* Product Name */}
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                          {product.name}
                        </h3>
                        
                        {/* Price */}
                        <p className="text-lg font-semibold text-gray-900">
                          ₹{product.price}
                        </p>
                        
                        {/* Colors */}
                        {product.colors && product.colors.length > 0 && (
                          <div className="mt-2 flex items-center">
                              <span className="text-sm text-gray-500 mr-2">Colors:</span>
                              <div className="flex space-x-1">
                                {product.colors.map((color) => (
                                  <span 
                                    key={color} 
                                    className="w-4 h-4 rounded-full border border-gray-300"
                                    style={{ backgroundColor: color }}
                                    title={color}
                                  />
                                ))}
                              </div>
                          </div>
                        )}
                        
                        {/* Sizes */}
                        {product.sizes && product.sizes.length > 0 && (
                          <div className="mt-2">
                            <span className="text-sm text-gray-500">Sizes: </span>
                            <span className="text-sm text-gray-700">
                              {product.sizes.map(size => size.toUpperCase()).join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
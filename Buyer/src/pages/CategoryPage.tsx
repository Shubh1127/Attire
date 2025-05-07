import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import { useBuyerContext } from '../Context/BuyerContext';
import { useTheme } from '../Context/ThemeContext';

const CategoryPage = () => {
  const { allProducts = [], fetchAllProducts } = useBuyerContext();
  const { category } = useParams();
  const { theme } = useTheme();

  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);

  // Predefined sizes and colors - show all options regardless of current availability
  const predefinedSizes = ['xs', 's', 'm', 'l', 'xl', 'xxl'];
  const predefinedColors = ['red', 'blue', 'green', 'yellow', 'black', 'white', 'gray', 'pink', 'purple'];

  useEffect(() => {
    const fetchingAllProducts = async () => {
      try {
        await fetchAllProducts();
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchingAllProducts();
  }, []);

  // Filter products by category first
  const categoryProducts = allProducts.filter((product) =>
    category ? product.category === category : true
  );

  // Then apply other filters
  const filteredProducts = categoryProducts.filter((product) => {
    // Price filter
    const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];

    // Size filter - only apply if sizes are selected
    const sizeMatch =
      selectedSizes.length === 0 ||
      (product.sizes && product.sizes.some((size) => selectedSizes.includes(size.toLowerCase())) )||
      (selectedSizes.length > 0 && (!product.sizes || product.sizes.length === 0));

    // Color filter - only apply if colors are selected
    const colorMatch =
      selectedColors.length === 0 ||
      (product.colors && product.colors.some((color) => selectedColors.includes(color.toLowerCase()))) ||
      (selectedColors.length > 0 && (!product.colors || product.colors.length === 0));

    return priceMatch && sizeMatch && colorMatch;
  });

  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  // Function to check if a size/color exists in any product (for styling)
  const isSizeAvailable = (size) => {
    return categoryProducts.some((product) => 
      product.sizes && product.sizes.map(s => s.toLowerCase()).includes(size)
    );
  };

  const isColorAvailable = (color) => {
    return categoryProducts.some((product) => 
      product.colors && product.colors.map(c => c.toLowerCase()).includes(color)
    );
  };

  return (
    <div className={`min-h-screen pt-24 pb-16 ${theme === 'dark' ? 'bg-navy-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4">
        {/* Category Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {category ? category.toUpperCase() : 'All Products'}
          </h1>
          <p className={`mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Discover our collection of {category ? category.toLowerCase() : 'products'}
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="md:hidden mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-md ${
              theme === 'dark'
                ? 'bg-navy-800 border-navy-700 text-white'
                : 'bg-white border-gray-300 text-gray-700'
            } border`}
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
            } md:block w-full md:w-64 md:mr-8 p-4 rounded-lg shadow-sm border ${
              theme === 'dark' ? 'bg-navy-800 border-navy-700' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between md:justify-start md:mb-6 mb-4">
              <h2 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Filters
              </h2>
              <button
                className={`text-sm ${
                  theme === 'dark'
                    ? 'text-amber-400 hover:text-amber-300'
                    : 'text-navy-600 hover:text-navy-800'
                } ml-4`}
                onClick={() => {
                  setPriceRange([0, 5000]);
                  setSelectedSizes([]);
                  setSelectedColors([]);
                }}
              >
                Reset All
              </button>
              <button
                className={`md:hidden ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
                onClick={() => setShowFilters(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Price Range Filter */}
            <div className="mb-6">
              <h3 className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'} mb-3`}>
                Price Range
              </h3>
              <div className="flex justify-between mb-2">
                <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  ₹{priceRange[0]}
                </span>
                <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  ₹{priceRange[1]}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="5000"
                step="100"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className={`w-full ${theme === 'dark' ? 'accent-amber-500' : 'accent-navy-600'}`}
              />
            </div>

            {/* Size Filter - Show all predefined sizes */}
            <div className="mb-6">
              <h3 className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'} mb-3`}>
                Size
              </h3>
              <div className="flex flex-wrap gap-2">
                {predefinedSizes.map((size) => {
                  const isAvailable = isSizeAvailable(size);
                  const isSelected = selectedSizes.includes(size);
                  
                  return (
                    <button
                      key={size}
                      className={`px-3 py-1 text-xs rounded-md border ${
                        isSelected
                          ? theme === 'dark'
                            ? 'bg-amber-500 text-white border-amber-500'
                            : 'bg-navy-700 text-white border-navy-700'
                          : theme === 'dark'
                            ? `bg-navy-700 text-gray-200 border-navy-600 hover:border-amber-400 ${!isAvailable ? 'opacity-50' : ''}`
                            : `bg-white text-gray-700 border-gray-300 hover:border-navy-500 ${!isAvailable ? 'opacity-50' : ''}`
                      }`}
                      onClick={() => toggleSize(size)}
                      disabled={!isAvailable && !isSelected}
                      title={!isAvailable ? "No products available in this size" : ""}
                    >
                      {size.toUpperCase()}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color Filter - Show all predefined colors */}
            <div className="mb-6">
              <h3 className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'} mb-3`}>
                Color
              </h3>
              <div className="flex flex-wrap gap-2">
                {predefinedColors.map((color) => {
                  const isAvailable = isColorAvailable(color);
                  const isSelected = selectedColors.includes(color);
                  
                  return (
                    <button
                      key={color}
                      className={`px-3 py-1 text-xs rounded-md border ${
                        isSelected
                          ? theme === 'dark'
                            ? 'bg-amber-500 text-white border-amber-500'
                            : 'bg-navy-700 text-white border-navy-700'
                          : theme === 'dark'
                            ? `bg-navy-700 text-gray-200 border-navy-600 hover:border-amber-400 ${!isAvailable ? 'opacity-50' : ''}`
                            : `bg-white text-gray-700 border-gray-300 hover:border-navy-500 ${!isAvailable ? 'opacity-50' : ''}`
                      }`}
                      onClick={() => toggleColor(color)}
                      disabled={!isAvailable && !isSelected}
                      title={!isAvailable ? "No products available in this color" : ""}
                    >
                      {color.charAt(0).toUpperCase() + color.slice(1)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="flex justify-center items-center h-64">
                <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  No {category ? category.toLowerCase() : 'products'} found matching your filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product._id}
                    className={`group relative rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 ${
                      theme === 'dark' ? 'bg-navy-800' : 'bg-white'
                    }`}
                  >
                    <Link to={`/product/${product._id}`} className="block">
                      {/* Product Image */}
                      <div
                        className={`aspect-square overflow-hidden ${
                          theme === 'dark' ? 'bg-navy-700' : 'bg-gray-100'
                        }`}
                      >
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
                          <span
                            className={`inline-block px-2 py-1 text-xs font-medium rounded-full mb-2 ${
                              theme === 'dark'
                                ? 'bg-green-900 text-green-200'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {product.status}
                          </span>
                        )}

                        {/* Product Name */}
                        <h3
                          className={`text-lg font-medium mb-1 ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}
                        >
                          {product.name}
                        </h3>

                        {/* Price */}
                        <p
                          className={`text-lg font-semibold ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}
                        >
                          ₹{product.price}
                        </p>

                        {/* Colors */}
                        {product.colors && product.colors.length > 0 && (
                          <div className="mt-2 flex items-center">
                            <span
                              className={`text-sm mr-2 ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                              }`}
                            >
                              Colors:
                            </span>
                            <div className="flex space-x-1">
                              {product.colors.map((color) => (
                                <span
                                  key={color}
                                  className="w-4 h-4 rounded-full border"
                                  style={{
                                    backgroundColor: color,
                                    borderColor: theme === 'dark' ? '#1e3a8a' : '#d1d5db',
                                  }}
                                  title={color}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Sizes */}
                        {product.sizes && product.sizes.length > 0 && (
                          <div className="mt-2">
                            <span
                              className={`text-sm ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                              }`}
                            >
                              Sizes:
                            </span>
                            <span
                              className={`text-sm ${
                                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                              }`}
                            >
                              {product.sizes.map((size) => size.toUpperCase()).join(', ')}
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
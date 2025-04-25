import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import { useProductStore } from '../store/productStore';
import ProductGrid from '../components/product/ProductGrid';
import Input from '../components/ui/Input';

const SearchPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const { setFilter, clearFilters, getFilteredProducts } = useProductStore();
  
  // Update filters when search query changes
  useEffect(() => {
    clearFilters();
    if (searchQuery) {
      setFilter({ search: searchQuery });
    }
  }, [searchQuery, setFilter, clearFilters]);
  
  // Get search results
  const searchResults = getFilteredProducts();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Update URL with search query
    const newUrl = searchQuery 
      ? `${location.pathname}?q=${encodeURIComponent(searchQuery)}` 
      : location.pathname;
    window.history.pushState({}, '', newUrl);
  };
  
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Search Products
          </h1>
          
          <form onSubmit={handleSubmit} className="relative">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products..."
              fullWidth
              className="rounded-full py-3 px-5 text-lg"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-navy-700 text-white p-2 rounded-full"
            >
              <SearchIcon className="h-5 w-5" />
            </button>
          </form>
        </div>
        
        {searchQuery ? (
          <>
            <h2 className="text-lg text-gray-600 mb-6">
              {searchResults.length > 0 
                ? `Found ${searchResults.length} results for "${searchQuery}"` 
                : `No results found for "${searchQuery}"`}
            </h2>
            <ProductGrid 
              products={searchResults}
              emptyMessage="Try searching with different keywords or browse our categories."
            />
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-8">
              Enter a search term to find products.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div 
                className="bg-gray-100 p-4 rounded-lg text-center cursor-pointer hover:bg-navy-50 transition-colors"
                onClick={() => setSearchQuery('shirts')}
              >
                <p className="font-medium">Shirts</p>
              </div>
              <div 
                className="bg-gray-100 p-4 rounded-lg text-center cursor-pointer hover:bg-navy-50 transition-colors"
                onClick={() => setSearchQuery('dresses')}
              >
                <p className="font-medium">Dresses</p>
              </div>
              <div 
                className="bg-gray-100 p-4 rounded-lg text-center cursor-pointer hover:bg-navy-50 transition-colors"
                onClick={() => setSearchQuery('shoes')}
              >
                <p className="font-medium">Shoes</p>
              </div>
              <div 
                className="bg-gray-100 p-4 rounded-lg text-center cursor-pointer hover:bg-navy-50 transition-colors"
                onClick={() => setSearchQuery('jeans')}
              >
                <p className="font-medium">Jeans</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
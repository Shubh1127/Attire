import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import { useProductStore } from '../store/productStore';
import { useTheme } from '../Context/ThemeContext';
import ProductGrid from '../components/product/ProductGrid';
import Input from '../components/ui/Input';

const SearchPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('q') || '';
  const { theme } = useTheme();

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(false);
  const { searchProducts } = useProductStore();

  // Debounce search to avoid too many re-renders
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery) {
        setIsSearching(true);
        // Update URL with search query
        const newUrl = `${location.pathname}?q=${encodeURIComponent(searchQuery)}`;
        window.history.pushState({}, '', newUrl);
        setIsSearching(false);
      } else {
        window.history.pushState({}, '', location.pathname);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery, location.pathname]);

  // Get search results
  const searchResults = searchQuery ? searchProducts(searchQuery) : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // The useEffect will handle the URL update
  };

  const handleQuickSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Popular searches based on your inventory
  const popularSearches = [
    'T-Shirts', 'Jeans', 'Dresses', 'Sneakers', 
    'Jackets', 'Watches', 'Bags', 'Accessories'
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 dark:bg-navy-900">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Search Products
          </h1>

          <form onSubmit={handleSubmit} className="relative">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products, categories, or brands..."
              fullWidth
              className="rounded-full py-3 px-5 text-lg dark:bg-navy-800 dark:border-navy-700 dark:text-white"
            />
            <button
              type="submit"
              className="absolute right-8 top-1/2 transform -translate-y-1/2 bg-navy-700 dark:bg-amber-500 text-white p-2 rounded-full"
            >
              <SearchIcon className="h-5 w-5" />
            </button>
          </form>
        </div>

        {/* Quick Search Suggestions */}
        {!searchQuery && (
          <div className="text-center py-6">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
              Popular Searches
            </h3>
            <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
              {popularSearches.map((search) => (
                <button
                  key={search}
                  onClick={() => handleQuickSearch(search.toLowerCase())}
                  className={`px-4 py-2 rounded-full text-sm ${
                    theme === 'dark'
                      ? 'bg-navy-700 hover:bg-navy-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  }`}
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        )}

        {isSearching ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-300">Searching...</p>
          </div>
        ) : searchQuery ? (
          <>
            <h2 className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              {searchResults.length > 0
                ? `Found ${searchResults.length} results for "${searchQuery}"`
                : `No results found for "${searchQuery}"`}
            </h2>
            
            {searchResults.length > 0 ? (
              <ProductGrid
                products={searchResults}
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  We couldn't find any products matching your search.
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className={`px-4 py-2 rounded-md ${
                    theme === 'dark'
                      ? 'bg-amber-600 hover:bg-amber-700 text-white'
                      : 'bg-navy-700 hover:bg-navy-800 text-white'
                  }`}
                >
                  Clear Search
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Search for products by name, category, or description
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
import { create } from 'zustand';
import { Product, Category } from '../types';

// Mock product data
import { products } from '../data/products';

interface ProductFilters {
  category?: Category;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
}

interface ProductState {
  products: Product[];
  filters: ProductFilters;
  isLoading: boolean;
  
  setFilter: (filter: Partial<ProductFilters>) => void;
  clearFilters: () => void;
  
  getFilteredProducts: () => Product[];
  getFeaturedProducts: () => Product[];
  getNewArrivals: () => Product[];
  getProductById: (id: string) => Product | undefined;
  getRelatedProducts: (id: string, limit?: number) => Product[];
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: products,
  filters: {},
  isLoading: false,
  
  setFilter: (filter) => {
    set((state) => ({
      filters: { ...state.filters, ...filter },
    }));
  },
  
  clearFilters: () => {
    set({ filters: {} });
  },
  
  getFilteredProducts: () => {
    const { products, filters } = get();
    
    return products.filter((product) => {
      // Filter by category
      if (filters.category && product.category !== filters.category) {
        return false;
      }
      
      // Filter by search term
      if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      
      // Filter by price range
      if (filters.minPrice && (product.discountPrice || product.price) < filters.minPrice) {
        return false;
      }
      
      if (filters.maxPrice && (product.discountPrice || product.price) > filters.maxPrice) {
        return false;
      }
      
      // Filter by sizes
      if (filters.sizes && filters.sizes.length > 0) {
        if (!product.sizes.some(size => filters.sizes?.includes(size))) {
          return false;
        }
      }
      
      // Filter by colors
      if (filters.colors && filters.colors.length > 0) {
        if (!product.colors.some(color => filters.colors?.includes(color))) {
          return false;
        }
      }
      
      return true;
    });
  },
  
  getFeaturedProducts: () => {
    return get().products.filter(product => product.isFeatured);
  },
  
  getNewArrivals: () => {
    return get().products.filter(product => product.isNewArrival);
  },
  
  getProductById: (id) => {
    return get().products.find(product => product.id === id);
  },
  
  getRelatedProducts: (id, limit = 4) => {
    const product = get().getProductById(id);
    if (!product) return [];
    
    return get().products
      .filter(p => p.id !== id && p.category === product.category)
      .slice(0, limit);
  },
}));
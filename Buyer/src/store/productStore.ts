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
  searchProducts: (query: string) => Product[];
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: products,
  filters: {},
  isLoading: false,

  searchProducts: (query) => {
    const { products } = get();
    if (!query.trim()) return products;
  
    const searchTerms = query.toLowerCase().split(' ').filter((term) => term.length > 0);
  
    return products.filter((product) => {
      // Create searchable fields with word boundaries
      const searchableFields = [
        ` ${product.name.toLowerCase()} `,
        ` ${product.description.toLowerCase()} `,
        product.tags ? ` ${product.tags.join(' ').toLowerCase()} ` : ' ',
      ].join(' ');
  
      // Exact matching for category
      const categoryMatch = product.category.toLowerCase() === query.toLowerCase();
  
      // Whole word matching for other fields
      const otherFieldsMatch = searchTerms.every((term) =>
        new RegExp(`\\b${term}\\b`).test(searchableFields)
      );
  
      return categoryMatch || otherFieldsMatch;
    });
  },
  
  setFilter: (filter) => {
    set((state) => ({
      filters: { ...state.filters, ...filter },
    }));
  },
  
  clearFilters: () => {
    set({ filters: {} });
  },
  
  fetchProducts: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/product/getProducts`);
      const data = await response.json();
      set({ products: data.products, isLoading: false });
    } catch (error) {
      console.error('Error fetching products:', error);
      set({ isLoading: false });
    }
  },

  getFilteredProducts: () => {
    const { products, filters, searchProducts } = get();
    
    let filtered = [...products];
    
    // Apply search filter first
    if (filters.search) {
      filtered = searchProducts(filters.search);
    }
    
    // Then apply other filters
    return filtered.filter((product) => {
      // Filter by category
      if (filters.category && product.category !== filters.category) {
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
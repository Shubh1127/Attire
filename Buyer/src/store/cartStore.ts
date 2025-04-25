import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '../types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity: number, size: string, color: string) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product, quantity, size, color) => {
        const currentItems = get().items;
        
        // Check if this product with same size and color already exists in cart
        const existingItemIndex = currentItems.findIndex(
          item => item.productId === product.id && item.size === size && item.color === color
        );
        
        if (existingItemIndex > -1) {
          // Update quantity of existing item
          const updatedItems = [...currentItems];
          updatedItems[existingItemIndex].quantity += quantity;
          
          set({ items: updatedItems });
        } else {
          // Add new item
          const newItem: CartItem = {
            id: Math.random().toString(36).substring(2, 10),
            productId: product.id,
            name: product.name,
            price: product.price,
            discountPrice: product.discountPrice,
            quantity,
            size,
            color,
            image: product.images[0],
          };
          
          set({ items: [...currentItems, newItem] });
        }
      },
      
      removeItem: (id) => {
        set({ items: get().items.filter(item => item.id !== id) });
      },
      
      updateQuantity: (id, quantity) => {
        set({
          items: get().items.map(item => 
            item.id === id ? { ...item, quantity } : item
          ),
        });
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      totalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      totalPrice: () => {
        return get().items.reduce((total, item) => {
          const itemPrice = item.discountPrice || item.price;
          return total + (itemPrice * item.quantity);
        }, 0);
      },
    }),
    {
      name: 'attire-cart',
    }
  )
);
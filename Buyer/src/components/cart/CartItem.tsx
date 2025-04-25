import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { CartItem as CartItemType } from '../../types';
import { formatPrice } from '../../lib/utils';
import { useCartStore } from '../../store/cartStore';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { removeItem, updateQuantity } = useCartStore();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      updateQuantity(item.id, newQuantity);
    }
  };

  return (
    <div className="flex py-6 border-b border-gray-200">
      {/* Product Image */}
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover object-center"
        />
      </div>

      {/* Product Details */}
      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <h3>{item.name}</h3>
            <p className="ml-4">
              {item.discountPrice 
                ? formatPrice(item.discountPrice * item.quantity)
                : formatPrice(item.price * item.quantity)}
            </p>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Size: {item.size} | Color: {item.color}
          </p>
        </div>
        
        <div className="flex flex-1 items-end justify-between text-sm">
          {/* Quantity Selector */}
          <div className="flex items-center border rounded-md">
            <button
              type="button"
              className="p-2 text-gray-600 hover:text-gray-900"
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="px-2 py-1 text-gray-900 w-8 text-center">
              {item.quantity}
            </span>
            <button
              type="button"
              className="p-2 text-gray-600 hover:text-gray-900"
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={item.quantity >= 10}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Remove Button */}
          <button
            type="button"
            className="font-medium text-red-600 hover:text-red-800 flex items-center"
            onClick={() => removeItem(item.id)}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../Context/ThemeContext';
import { useBuyerContext } from '../../Context/BuyerContext';
import { 
  cn,
  formatPrice, 
  getProductPhoto, 
  truncateText, 
  formatSize, 
  formatColor 
} from '../../lib/utils';
import { Minus, Plus, Trash2 } from 'lucide-react';
import Button from '../ui/Button';

interface CartItemProps {
  item: {
    _id: string;
    productId: string;
    name: string;
    description: string;
    price: number;
    photo: string[];
    size: string;
    color: string;
    quantity: number;
  };
  onUpdate: () => void; // Add this prop
}

const CartItem: React.FC<CartItemProps> = ({ item, onUpdate }) => {
  const { updateCartItem, deleteCartItem,fetchCart } = useBuyerContext();
  const { theme } = useTheme();
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [isRemoving, setIsRemoving] = React.useState(false);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    setIsUpdating(true);
    try {
      await updateCartItem(item.productId, newQuantity);
      await fetchCart(); // Re-fetch the cart to ensure state is updated
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleRemoveItem = async () => {
    setIsRemoving(true);
    try {
      await deleteCartItem(item.productId);
      await fetchCart(); // Re-fetch the cart to ensure state is updated
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      setIsRemoving(false);
    }
  };

  if (isRemoving) {
    return (
      <div className={cn(
        'flex items-center justify-center mb-4 p-4 rounded-lg',
        theme === 'dark' ? 'bg-navy-800' : 'bg-white',
        theme === 'dark' ? 'border-navy-700' : 'border-gray-200',
        'border'
      )}>
        <p className={theme === 'dark' ? 'text-green-300' : 'text-gray-600'}>
          Removing item...
        </p>
      </div>
    );
  }

  return (
    <div className={cn(
      'flex items-start justify-between mb-4 p-4 rounded-lg',
      theme === 'dark' ? 'bg-navy-800' : 'bg-white',
      theme === 'dark' ? 'border-navy-700' : 'border-gray-200',
      'border',
      isUpdating ? 'opacity-70' : ''
    )}>
      <Link 
        to={`/product/${item.productId}`}
        className="flex items-start flex-1"
      >
        <img
          src={getProductPhoto(item)}
          alt={item.name}
          className="h-16 w-16 rounded object-cover"
        />
        <div className="ml-4 flex-1">
          <h3 className={cn(
            'text-lg font-medium',
            theme === 'dark' ? 'text-green-400' : 'text-gray-900'
          )}>
            {item.name}
          </h3>
          <p className={cn(
            'text-sm',
            theme === 'dark' ? 'text-green-300' : 'text-gray-600'
          )}>
            {truncateText(item.description)}
          </p>
          <div className="flex gap-4 mt-1">
            <p className={cn(
              'text-sm',
              theme === 'dark' ? 'text-green-300' : 'text-gray-600'
            )}>
              Size: {formatSize(item.size)}
            </p>
            <p className={cn(
              'text-sm',
              theme === 'dark' ? 'text-green-300' : 'text-gray-600'
            )}>
              Color: {formatColor(item.color)}
            </p>
          </div>
        </div>
      </Link>

      <div className="flex flex-col items-end ml-4">
        <div className="flex items-center space-x-2 mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              handleQuantityChange(item.quantity - 1);
            }}
            disabled={isUpdating || isRemoving}
            className={cn(
              'h-8 w-8 p-0',
              theme === 'dark' ? 'hover:bg-navy-700' : 'hover:bg-gray-100',
              (isUpdating || isRemoving) ? 'opacity-50 cursor-not-allowed' : ''
            )}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className={cn(
            'w-8 text-center',
            theme === 'dark' ? 'text-green-400' : 'text-gray-900'
          )}>
            {item.quantity}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              handleQuantityChange(item.quantity + 1);
            }}
            disabled={isUpdating || isRemoving}
            className={cn(
              'h-8 w-8 p-0',
              theme === 'dark' ? 'hover:bg-navy-700' : 'hover:bg-gray-100',
              (isUpdating || isRemoving) ? 'opacity-50 cursor-not-allowed' : ''
            )}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <p className={cn(
          'text-lg font-medium mb-2',
          theme === 'dark' ? 'text-green-400' : 'text-gray-900'
        )}>
          {formatPrice(item.price * item.quantity)}
        </p>

        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            handleRemoveItem();
          }}
          disabled={isRemoving || isUpdating}
          className={cn(
            'text-red-500 hover:text-red-700 p-0 h-8',
            theme === 'dark' ? 'hover:bg-navy-700' : 'hover:bg-gray-100',
            (isUpdating || isRemoving) ? 'opacity-50 cursor-not-allowed' : ''
          )}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          {isRemoving ? 'Removing...' : 'Remove'}
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
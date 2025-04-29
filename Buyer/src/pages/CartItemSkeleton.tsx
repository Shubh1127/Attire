import React from 'react';
import { cn } from '../lib/utils';

const CartItemSkeleton: React.FC = () => {
  return (
    <div
      className={cn(
        'flex items-start justify-between mb-4 p-4 rounded-lg animate-pulse',
        'bg-gray-200 dark:bg-navy-800 border border-gray-300 dark:border-navy-700'
      )}
    >
      <div className="flex items-start flex-1">
        <div className="h-16 w-16 rounded bg-gray-300 dark:bg-navy-700"></div>
        <div className="ml-4 flex-1">
          <div className="h-4 w-3/4 bg-gray-300 dark:bg-navy-700 rounded mb-2"></div>
          <div className="h-3 w-1/2 bg-gray-300 dark:bg-navy-700 rounded mb-2"></div>
          <div className="flex gap-4 mt-1">
            <div className="h-3 w-16 bg-gray-300 dark:bg-navy-700 rounded"></div>
            <div className="h-3 w-16 bg-gray-300 dark:bg-navy-700 rounded"></div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end ml-4">
        <div className="h-8 w-20 bg-gray-300 dark:bg-navy-700 rounded mb-2"></div>
        <div className="h-4 w-12 bg-gray-300 dark:bg-navy-700 rounded mb-2"></div>
        <div className="h-8 w-16 bg-gray-300 dark:bg-navy-700 rounded"></div>
      </div>
    </div>
  );
};

export default CartItemSkeleton;
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(price);
}

export function getDiscountPercentage(originalPrice: number, discountPrice: number): number {
  return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export const CATEGORY_LABELS = {
  men: 'Men',
  women: 'Women',
  kids: 'Kids',
  footwear: 'Footwear',
};

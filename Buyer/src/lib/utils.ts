import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats price with INR currency and proper Indian number formatting
 * Handles both regular numbers and product objects with price property
 */
export function formatPrice(price: number | { price: number }): string {
  const priceValue = typeof price === 'number' ? price : price.price;
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(priceValue);
}

/**
 * Calculates discount percentage between original and discounted price
 * Works with both numbers and product objects
 */
export function getDiscountPercentage(
  originalPrice: number | { price: number },
  discountPrice: number | { price: number }
): number {
  const original = typeof originalPrice === 'number' ? originalPrice : originalPrice.price;
  const discount = typeof discountPrice === 'number' ? discountPrice : discountPrice.price;
  
  return Math.round(((original - discount) / original) * 100);
}

/**
 * Truncates text with ellipsis, with optional max length (default: 50)
 */
export function truncateText(text: string, maxLength: number = 50): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Calculates total price for a cart item (price * quantity)
 */
export function calculateItemTotal(item: {
  productId: { price: number };
  quantity: number;
}): number {
  return item.price * item.quantity;
}

/**
 * Gets the first photo URL or returns a placeholder if none exists
 */
export function getProductPhoto(item: { photo?: string[] }): string {
  return item.photo?.[0] || '/placeholder-product.jpg';
}

export const CATEGORY_LABELS = {
  men: 'Men',
  women: 'Women',
  kids: 'Kids',
  footwear: 'Footwear',
};

/**
 * Formats size with proper capitalization
 */
export function formatSize(size: string): string {
  if (!size) return '';
  return size.toUpperCase();
}

/**
 * Formats color with proper capitalization
 */
export function formatColor(color: string): string {
  if (!color) return '';
  return color.charAt(0).toUpperCase() + color.slice(1).toLowerCase();
}
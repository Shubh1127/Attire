export type User = {
  id: string;
  name: string;
  email: string;
  addresses: Address[];
};

export type Address = {
  id: string;
  title: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
};

export type Category = 'men' | 'women' | 'kids' | 'footwear';

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  images: string[];
  category: Category;
  sizes: string[];
  colors: string[];
  isNewArrival: boolean;
  isFeatured: boolean;
  rating: number;
  reviewCount: number;
};

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  discountPrice?: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
};

export type Review = {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
};

export type OrderStatus = 'processing' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export type Order = {
  id: string;
  userId: string;
  items: CartItem[];
  status: OrderStatus;
  totalAmount: number;
  shippingAddress: Address;
  paymentMethod: string;
  createdAt: string;
};
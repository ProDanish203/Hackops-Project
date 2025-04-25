export interface IUser {
  _id: string;
  email: string;
  name: string;
  phone: string;
  role: string;
  hasNotifications: boolean;
  isEmailVerified: boolean;
  address?: string;
  avatar?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: string;
  stock: string;
  category: {
    _id: string;
    name: string;
  };
  images: string[];
  imageUrls: string[];
  rating: number;
  createdAt: string;
  updatedAt?: string;
}

export interface ICategory {
  _id: string;
  name: string;
  description?: string;
  image: string;
  imageUrl: string;
  parentCategory?: string;
  createdBy: string;
  slug: string;
  createdAt: string;
  updatedAt?: string;
}

export interface IOrderItem {
  product: {
    _id: string;
    name: string;
    coverImage: string;
  };
  quantity: number;
  price: number;
  itemTotal: number;
}

export interface IAddress {
  street: string;
  city: string;
  state: string;
}

export interface IOrder {
  _id: string;
  orderItems: IOrderItem[];
  totalAmount: number;
  couponCode?: string;
  discount?: number;
  shippingAddress: IAddress;
  billingAddress: IAddress;
  paymentMethod: "cash_on_delivery" | "online";
  customer?: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    address?: string;
  };
  name: string;
  email: string;
  phone: string;
  orderStatus: "pending" | "processing" | "completed" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed";
  trackingNumber: string;
  estimatedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  notes?: string;
  createdAt: string;
}

export interface IOrderMin {
  _id: string;
  totalAmount: number;
  customer?: {
    _id: string;
    name: string;
  };
  name: string;
  orderStatus: string;
  trackingNumber: string;
  paymentStatus: string;
  createdAt: string;
}

export interface IPagination {
  totalItems: number;
  perPage: number;
  totalPages: number;
  currentPage: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export interface FileInfo {
  file: File;
  preview: string;
}

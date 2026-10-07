/**
 * Cafe Eleganza - Shared Data Contracts & Types
 */

export type DietaryTag = 'Vegetarian' | 'Vegan' | 'Halal' | 'Gluten-free';
export type Allergen = 'Dairy' | 'Nuts' | 'Gluten' | 'Soy' | 'Eggs' | 'Fish' | 'Shellfish';

export interface MenuItemVariant {
  name: string;
  nameUr?: string;
  priceDelta: number;
}

export interface MenuItemAddOn {
  name: string;
  nameUr?: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  nameUr: string;
  slug: string;
  description: string;
  descriptionUr: string;
  categoryId: string;
  price: number;
  image: string;
  tags: string[];
  allergens: Allergen[];
  dietary: DietaryTag[];
  spiceLevel: 0 | 1 | 2 | 3; // 0=mild, 3=extra spicy
  calories?: number;
  isVeg: boolean;
  isSpicy: boolean;
  isNew: boolean;
  isPopular: boolean;
  isFeatured: boolean;
  available: boolean;
  stockCount?: number; // undefined = unlimited
  lowStockThreshold?: number;
  variants: MenuItemVariant[];
  addOns: MenuItemAddOn[];
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  nameUr: string;
  slug: string;
  order: number;
  icon: string;
  active: boolean;
}

export type OrderType = 'dine_in' | 'delivery' | 'pickup';
export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
export type PaymentMethod = 'cod' | 'pay_at_counter' | 'jazzcash' | 'easypaisa' | 'card';

export interface OrderItem {
  menuItemId: string;
  name: string;
  nameUr?: string;
  price: number;
  quantity: number;
  selectedVariant?: MenuItemVariant;
  selectedAddOns?: MenuItemAddOn[];
  notes?: string;
}

export interface StatusHistoryEntry {
  status: OrderStatus;
  timestamp: string;
  note?: string;
  updatedBy?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. ELG-261007-0001
  userId?: string;
  customerName: string;
  phone: string;
  email?: string;
  type: OrderType;
  tableNo?: string;
  address?: string;
  lat?: number;
  lng?: number;
  zoneId?: string;
  language: 'en' | 'ur';
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  promoCode?: string;
  giftCardCode?: string;
  giftCardUsed?: number;
  pointsUsed?: number;
  pointsEarned: number;
  tax: number;
  deliveryFee: number;
  total: number;
  riderId?: string;
  riderName?: string;
  riderPhone?: string;
  riderLocation?: { lat: number; lng: number };
  idempotencyKey?: string;
  scheduledFor?: string; // ISO string or ASAP
  customerNotes?: string;
  cancelRequested?: boolean;
  cancelReason?: string;
  cancelledAt?: string;
  statusHistory: StatusHistoryEntry[];
  createdAt: string;
}

export interface Reservation {
  id: string;
  reservationCode: string; // e.g. RES-261007-42
  userId?: string;
  customerName: string;
  phone: string;
  email?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  guests: number;
  occasion?: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'declined' | 'cancelled';
  language: 'en' | 'ur';
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
  approved: boolean;
  orderId?: string;
}

export interface PromoCode {
  id: string;
  code: string;
  type: 'percent' | 'fixed' | 'freeDelivery';
  value: number; // percentage or fixed PKR
  maxDiscount?: number;
  minOrder: number;
  startsAt: string;
  expiresAt: string;
  maxUses: number;
  timesUsed: number;
  firstOrderOnly: boolean;
  orderTypes: OrderType[];
  categoryIds?: string[];
  active: boolean;
}

export interface GiftCard {
  id: string;
  code: string;
  initialBalance: number;
  balance: number;
  expiresAt: string;
  purchaserName: string;
  recipientName: string;
  recipientEmail?: string;
  active: boolean;
  createdAt: string;
}

export interface TableItem {
  id: string;
  number: string;
  name: string;
  active: boolean;
  sessionCode?: string;
  currentOrderId?: string;
}

export interface StaffCall {
  id: string;
  tableNo: string;
  type: 'call_waiter' | 'request_bill';
  status: 'pending' | 'acknowledged';
  createdAt: string;
}

export interface Rider {
  id: string;
  uid: string;
  name: string;
  phone: string;
  vehicle: string;
  active: boolean;
  isAvailable: boolean;
  currentLocation?: { lat: number; lng: number };
}

export interface RefundRecord {
  id: string;
  orderId: string;
  amount: number;
  method: string;
  status: 'none' | 'pending' | 'completed';
  reason: string;
  processedBy: string;
  notes?: string;
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  performedBy: string;
  details: string;
  timestamp: string;
}

export interface FAQItem {
  questionEn: string;
  questionUr: string;
  answerEn: string;
  answerUr: string;
}

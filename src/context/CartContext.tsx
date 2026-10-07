import React, { createContext, useContext, useState, useEffect } from 'react';
import { OrderItem, OrderType, PromoCode, GiftCard, MenuItem } from '../../shared/types';
import { defaultSiteConfig } from '../../shared/siteConfig';

interface CartContextType {
  items: OrderItem[];
  orderType: OrderType;
  tableNo: string;
  customerName: string;
  phone: string;
  email: string;
  deliveryAddress: string;
  deliveryLat?: number;
  deliveryLng?: number;
  customerNotes: string;
  promo?: PromoCode;
  giftCard?: GiftCard;
  giftCardAmountToUse: number;
  loyaltyPointsToRedeem: number;
  isCartOpen: boolean;
  
  // Actions
  addItem: (item: MenuItem, variantName?: string, addOnNames?: string[], quantity?: number, notes?: string) => void;
  removeItem: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  setOrderType: (type: OrderType) => void;
  setTableNo: (table: string) => void;
  setCustomerInfo: (info: { name?: string; phone?: string; email?: string; address?: string; notes?: string; lat?: number; lng?: number }) => void;
  applyPromo: (promo: PromoCode) => void;
  removePromo: () => void;
  applyGiftCard: (giftCard: GiftCard, amount: number) => void;
  removeGiftCard: () => void;
  setLoyaltyPointsToRedeem: (points: number) => void;
  setIsCartOpen: (open: boolean) => void;
  
  // Computed values
  subtotal: number;
  promoDiscount: number;
  giftCardDiscount: number;
  loyaltyDiscount: number;
  tax: number;
  deliveryFee: number;
  total: number;
  itemCount: number;
  pointsEarnable: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'eleganza_cart_v2';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<OrderItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.items)) return parsed.items;
      }
    } catch {}
    return [];
  });

  const [orderType, setOrderType] = useState<OrderType>('delivery');
  const [tableNo, setTableNo] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [deliveryLat, setDeliveryLat] = useState<number | undefined>(undefined);
  const [deliveryLng, setDeliveryLng] = useState<number | undefined>(undefined);
  const [customerNotes, setCustomerNotes] = useState<string>('');
  const [promo, setPromo] = useState<PromoCode | undefined>(undefined);
  const [giftCard, setGiftCard] = useState<GiftCard | undefined>(undefined);
  const [giftCardAmountToUse, setGiftCardAmountToUse] = useState<number>(0);
  const [loyaltyPointsToRedeem, setLoyaltyPointsToRedeem] = useState<number>(0);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Check URL params for table number preset e.g. /t/4
  useEffect(() => {
    const path = window.location.pathname;
    const match = path.match(/\/t\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      setTableNo(match[1]);
      setOrderType('dine_in');
    }
  }, []);

  // Save items to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ items, version: 2 }));
    } catch {}
  }, [items]);

  const addItem = (
    item: MenuItem,
    variantName?: string,
    addOnNames: string[] = [],
    quantity: number = 1,
    notes: string = ''
  ) => {
    const selectedVariant = item.variants?.find((v) => v.name === variantName);
    const selectedAddOns = item.addOns?.filter((a) => addOnNames.includes(a.name)) || [];
    
    let unitPrice = item.price;
    if (selectedVariant) unitPrice += selectedVariant.priceDelta;
    if (selectedAddOns.length > 0) {
      unitPrice += selectedAddOns.reduce((sum, addOn) => sum + addOn.price, 0);
    }

    const newItem: OrderItem = {
      menuItemId: item.id,
      name: item.name,
      nameUr: item.nameUr,
      price: unitPrice,
      quantity,
      selectedVariant,
      selectedAddOns,
      notes,
    };

    setItems((prev) => {
      // Check if identical item (same variant, same addons, same notes) already exists
      const existingIndex = prev.findIndex(
        (i) =>
          i.menuItemId === newItem.menuItemId &&
          i.selectedVariant?.name === newItem.selectedVariant?.name &&
          JSON.stringify(i.selectedAddOns?.map((a) => a.name).sort()) ===
            JSON.stringify(newItem.selectedAddOns?.map((a) => a.name).sort()) &&
          (i.notes || '') === (newItem.notes || '')
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [...prev, newItem];
    });
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(index);
      return;
    }
    setItems((prev) => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index].quantity = quantity;
      }
      return updated;
    });
  };

  const clearCart = () => {
    setItems([]);
    setPromo(undefined);
    setGiftCard(undefined);
    setGiftCardAmountToUse(0);
    setLoyaltyPointsToRedeem(0);
  };

  const setCustomerInfo = (info: {
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
    notes?: string;
    lat?: number;
    lng?: number;
  }) => {
    if (info.name !== undefined) setCustomerName(info.name);
    if (info.phone !== undefined) setPhone(info.phone);
    if (info.email !== undefined) setEmail(info.email);
    if (info.address !== undefined) setDeliveryAddress(info.address);
    if (info.notes !== undefined) setCustomerNotes(info.notes);
    if (info.lat !== undefined) setDeliveryLat(info.lat);
    if (info.lng !== undefined) setDeliveryLng(info.lng);
  };

  const applyPromo = (promoCode: PromoCode) => {
    setPromo(promoCode);
  };

  const removePromo = () => {
    setPromo(undefined);
  };

  const applyGiftCard = (card: GiftCard, amount: number) => {
    setGiftCard(card);
    setGiftCardAmountToUse(amount);
  };

  const removeGiftCard = () => {
    setGiftCard(undefined);
    setGiftCardAmountToUse(0);
  };

  // Subtotal calculation
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Promo calculation
  let promoDiscount = 0;
  if (promo && subtotal >= promo.minOrder) {
    if (promo.type === 'percent') {
      promoDiscount = Math.round((subtotal * promo.value) / 100);
      if (promo.maxDiscount) {
        promoDiscount = Math.min(promoDiscount, promo.maxDiscount);
      }
    } else if (promo.type === 'fixed') {
      promoDiscount = Math.min(promo.value, subtotal);
    }
  }

  // Loyalty discount (1 point = Rs 1, capped at 50% of subtotal)
  const maxLoyaltyDiscount = Math.floor(subtotal * 0.5);
  const loyaltyDiscount = Math.min(loyaltyPointsToRedeem * defaultSiteConfig.loyaltyPointValueRs, maxLoyaltyDiscount);

  // Delivery fee calculation
  let deliveryFee = 0;
  if (orderType === 'delivery') {
    if (promo?.type === 'freeDelivery' || subtotal >= defaultSiteConfig.freeDeliveryThreshold) {
      deliveryFee = 0;
    } else {
      deliveryFee = defaultSiteConfig.deliveryFee;
    }
  }

  // GST Calculation (16%)
  const discountedSubtotal = Math.max(0, subtotal - promoDiscount - loyaltyDiscount);
  const tax = defaultSiteConfig.gstEnabled ? Math.round((discountedSubtotal * defaultSiteConfig.gstRate) / 100) : 0;

  // Gift card discount (cannot exceed remaining balance)
  const beforeGiftCard = discountedSubtotal + tax + deliveryFee;
  const giftCardDiscount = Math.min(giftCardAmountToUse, beforeGiftCard);

  const total = Math.max(0, beforeGiftCard - giftCardDiscount);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Points earned for this order
  const pointsEarnable = Math.floor((subtotal / 100) * defaultSiteConfig.loyaltyPointsPerRs100);

  return (
    <CartContext.Provider
      value={{
        items,
        orderType,
        tableNo,
        customerName,
        phone,
        email,
        deliveryAddress,
        deliveryLat,
        deliveryLng,
        customerNotes,
        promo,
        giftCard,
        giftCardAmountToUse,
        loyaltyPointsToRedeem,
        isCartOpen,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        setOrderType,
        setTableNo,
        setCustomerInfo,
        applyPromo,
        removePromo,
        applyGiftCard,
        removeGiftCard,
        setLoyaltyPointsToRedeem,
        setIsCartOpen,
        subtotal,
        promoDiscount,
        giftCardDiscount,
        loyaltyDiscount,
        tax,
        deliveryFee,
        total,
        itemCount,
        pointsEarnable,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

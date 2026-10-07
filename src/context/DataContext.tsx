import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  MenuItem,
  Category,
  Order,
  Reservation,
  Review,
  PromoCode,
  GiftCard,
  TableItem,
  StaffCall,
  RefundRecord,
  AuditLogEntry,
  OrderStatus,
  OrderType,
} from '../../shared/types';
import {
  seedMenuItems,
  seedCategories,
  seedReviews,
  seedPromos,
  seedTables,
} from '../../shared/seedData';
import { defaultSiteConfig, SiteConfig, DeliveryZone } from '../../shared/siteConfig';
import {
  db,
  COLLECTIONS,
  syncMenuItem,
  deleteMenuItemFromFirestore,
  syncOrder,
  syncReservation,
  syncStaffCall,
  syncReview,
  syncSiteConfig,
  seedInitialFirestoreData,
  collection,
  onSnapshot,
} from '../services/firebase';

interface DataContextType {
  menuItems: MenuItem[];
  categories: Category[];
  orders: Order[];
  reservations: Reservation[];
  reviews: Review[];
  promos: PromoCode[];
  giftCards: GiftCard[];
  tables: TableItem[];
  staffCalls: StaffCall[];
  deliveryZones: DeliveryZone[];
  siteConfig: SiteConfig;
  auditLogs: AuditLogEntry[];
  refunds: RefundRecord[];

  // Menu Actions
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  toggleItemAvailability: (id: string) => void;
  updateItemStock: (id: string, stock: number) => void;

  // Order Actions
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'statusHistory' | 'status'>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  assignRider: (orderId: string, riderId: string, riderName: string, riderPhone: string) => void;
  cancelOrder: (orderId: string, reason?: string) => boolean;
  requestOrderCancel: (orderId: string, reason?: string) => void;

  // Staff Call Actions
  createStaffCall: (tableNo: string, type: 'call_waiter' | 'request_bill') => StaffCall;
  acknowledgeStaffCall: (id: string) => void;

  // Reservation Actions
  createReservation: (resData: Omit<Reservation, 'id' | 'reservationCode' | 'createdAt' | 'status'>) => Promise<Reservation>;
  updateReservationStatus: (id: string, status: 'confirmed' | 'declined' | 'cancelled') => void;

  // Review Actions
  addReview: (userName: string, rating: number, comment: string, orderId?: string) => void;
  deleteReview: (id: string) => void;

  // Promo & Gift Card Actions
  validatePromo: (code: string, subtotal: number, orderType: OrderType) => { valid: boolean; promo?: PromoCode; message?: string };
  addPromo: (promo: PromoCode) => void;
  togglePromo: (id: string) => void;
  validateGiftCard: (code: string) => { valid: boolean; card?: GiftCard; message?: string };
  issueGiftCard: (card: Omit<GiftCard, 'id' | 'createdAt'>) => GiftCard;

  // Settings Actions
  updateSiteConfig: (updates: Partial<SiteConfig>) => void;
  updateDeliveryZones: (zones: DeliveryZone[]) => void;
  updateTables: (tables: TableItem[]) => void;

  // Notifications
  hasUnreadAdminAlerts: boolean;
  clearAdminAlerts: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Web Audio API Chime helper for new order / waiter call alerts
const playAlertChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.45);
  } catch {}
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial states from localStorage or defaults
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    try {
      const saved = localStorage.getItem('eleganza_menu_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return seedMenuItems;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('eleganza_categories_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return seedCategories;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('eleganza_orders_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    // Seed initial orders for demonstration
    const now = new Date();
    return [
      {
        id: 'ord-seed-1',
        orderNumber: 'ELG-261007-0001',
        customerName: 'Hassan Raza',
        phone: '03005240034',
        type: 'delivery',
        address: 'House 14, St 3, Raza Town, Faisalabad',
        language: 'en',
        status: 'preparing',
        paymentMethod: 'cod',
        items: [
          { menuItemId: 'item-ube-latte', name: 'Ube Latte', price: 820, quantity: 2 },
          { menuItemId: 'item-pizza-pepperoni', name: 'Signature Pepperoni Pizza', price: 1850, quantity: 1 },
        ],
        subtotal: 3490,
        discount: 0,
        tax: 558,
        deliveryFee: 0,
        total: 4048,
        pointsEarned: 174,
        statusHistory: [
          { status: 'pending', timestamp: new Date(now.getTime() - 1000 * 60 * 18).toISOString() },
          { status: 'preparing', timestamp: new Date(now.getTime() - 1000 * 60 * 10).toISOString(), note: 'In wood oven' },
        ],
        createdAt: new Date(now.getTime() - 1000 * 60 * 18).toISOString(),
      },
      {
        id: 'ord-seed-2',
        orderNumber: 'ELG-261007-0002',
        customerName: 'Table 4 Guest',
        phone: '03011234567',
        type: 'dine_in',
        tableNo: '4',
        language: 'en',
        status: 'ready',
        paymentMethod: 'pay_at_counter',
        items: [
          { menuItemId: 'item-spanish-latte', name: 'Spanish Latte', price: 650, quantity: 2 },
          { menuItemId: 'item-mozzarella-sticks', name: 'Golden Mozzarella Sticks', price: 1250, quantity: 1 },
        ],
        subtotal: 2550,
        discount: 0,
        tax: 408,
        deliveryFee: 0,
        total: 2958,
        pointsEarned: 127,
        statusHistory: [
          { status: 'pending', timestamp: new Date(now.getTime() - 1000 * 60 * 12).toISOString() },
          { status: 'preparing', timestamp: new Date(now.getTime() - 1000 * 60 * 7).toISOString() },
          { status: 'ready', timestamp: new Date(now.getTime() - 1000 * 60 * 1).toISOString() },
        ],
        createdAt: new Date(now.getTime() - 1000 * 60 * 12).toISOString(),
      },
    ];
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    try {
      const saved = localStorage.getItem('eleganza_reservations_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'res-seed-1',
        reservationCode: 'RES-261007-18',
        customerName: 'Amina Khalid',
        phone: '03001234567',
        email: 'amina@example.com',
        date: new Date().toISOString().split('T')[0],
        time: '19:30',
        guests: 4,
        occasion: 'Family Dinner',
        notes: 'Corner solarium table with garden view please',
        status: 'confirmed',
        language: 'en',
        createdAt: new Date().toISOString(),
      },
    ];
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem('eleganza_reviews_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return seedReviews;
  });

  const [promos, setPromos] = useState<PromoCode[]>(() => {
    try {
      const saved = localStorage.getItem('eleganza_promos_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return seedPromos;
  });

  const [giftCards, setGiftCards] = useState<GiftCard[]>(() => {
    try {
      const saved = localStorage.getItem('eleganza_gift_cards_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'gc-demo',
        code: 'ELEGANZA-GIFT-5000',
        initialBalance: 5000,
        balance: 5000,
        expiresAt: '2026-12-31',
        purchaserName: 'CEO Office',
        recipientName: 'Valued Patron',
        active: true,
        createdAt: '2026-01-01',
      },
    ];
  });

  const [tables, setTables] = useState<TableItem[]>(() => {
    try {
      const saved = localStorage.getItem('eleganza_tables_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return seedTables;
  });

  const [staffCalls, setStaffCalls] = useState<StaffCall[]>([]);
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>(defaultSiteConfig.deliveryZones);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => {
    try {
      const saved = localStorage.getItem('eleganza_config_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return defaultSiteConfig;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [refunds, setRefunds] = useState<RefundRecord[]>([]);
  const [hasUnreadAdminAlerts, setHasUnreadAdminAlerts] = useState<boolean>(false);

  // Persistence helpers
  useEffect(() => {
    try {
      localStorage.setItem('eleganza_menu_v2', JSON.stringify(menuItems));
    } catch {}
  }, [menuItems]);

  useEffect(() => {
    try {
      localStorage.setItem('eleganza_orders_v2', JSON.stringify(orders));
    } catch {}
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('eleganza_reservations_v2', JSON.stringify(reservations));
    } catch {}
  }, [reservations]);

  useEffect(() => {
    try {
      localStorage.setItem('eleganza_reviews_v2', JSON.stringify(reviews));
    } catch {}
  }, [reviews]);

  useEffect(() => {
    try {
      localStorage.setItem('eleganza_promos_v2', JSON.stringify(promos));
    } catch {}
  }, [promos]);

  useEffect(() => {
    try {
      localStorage.setItem('eleganza_config_v2', JSON.stringify(siteConfig));
    } catch {}
  }, [siteConfig]);

  // --- REAL-TIME FIRESTORE SYNCHRONIZATION ---
  useEffect(() => {
    // 1. Initial check & seed to Firestore
    seedInitialFirestoreData(seedMenuItems, seedCategories, seedTables);

    // 2. Real-time Menu Items Listener
    const unsubMenu = onSnapshot(
      collection(db, COLLECTIONS.MENU_ITEMS),
      (snapshot) => {
        if (!snapshot.empty) {
          const remoteItems = snapshot.docs.map((d) => d.data() as MenuItem);
          setMenuItems(remoteItems);
        }
      },
      (err) => console.warn('[Firebase] Menu snapshot listener notice:', err)
    );

    // 3. Real-time Orders Listener
    const unsubOrders = onSnapshot(
      collection(db, COLLECTIONS.ORDERS),
      (snapshot) => {
        if (!snapshot.empty) {
          const remoteOrders = snapshot.docs.map((d) => d.data() as Order);
          remoteOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setOrders(remoteOrders);
        }
      },
      (err) => console.warn('[Firebase] Orders snapshot listener notice:', err)
    );

    // 4. Real-time Reservations Listener
    const unsubReservations = onSnapshot(
      collection(db, COLLECTIONS.RESERVATIONS),
      (snapshot) => {
        if (!snapshot.empty) {
          const remoteRes = snapshot.docs.map((d) => d.data() as Reservation);
          remoteRes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setReservations(remoteRes);
        }
      },
      (err) => console.warn('[Firebase] Reservations snapshot listener notice:', err)
    );

    // 5. Real-time Staff Calls Listener
    const unsubCalls = onSnapshot(
      collection(db, COLLECTIONS.STAFF_CALLS),
      (snapshot) => {
        const remoteCalls = snapshot.docs.map((d) => d.data() as StaffCall);
        setStaffCalls(remoteCalls);
      },
      (err) => console.warn('[Firebase] StaffCalls snapshot listener notice:', err)
    );

    return () => {
      unsubMenu();
      unsubOrders();
      unsubReservations();
      unsubCalls();
    };
  }, []);

  const logAudit = (action: string, performedBy: string, details: string) => {
    const entry: AuditLogEntry = {
      id: 'log_' + Date.now(),
      action,
      performedBy,
      details,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [entry, ...prev]);
  };

  // --- MENU ACTIONS ---
  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...item,
      id: 'item-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setMenuItems((prev) => [newItem, ...prev]);
    syncMenuItem(newItem);
    logAudit('CREATE_MENU_ITEM', 'Admin', `Created menu item ${newItem.name}`);
  };

  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    setMenuItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, ...updates, updatedAt: new Date().toISOString() };
          syncMenuItem(updated);
          return updated;
        }
        return item;
      })
    );
    logAudit('UPDATE_MENU_ITEM', 'Admin', `Updated menu item ID ${id}`);
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
    deleteMenuItemFromFirestore(id);
    logAudit('DELETE_MENU_ITEM', 'Admin', `Deleted menu item ID ${id}`);
  };

  const toggleItemAvailability = (id: string) => {
    setMenuItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, available: !item.available };
          syncMenuItem(updated);
          return updated;
        }
        return item;
      })
    );
  };

  const updateItemStock = (id: string, stock: number) => {
    setMenuItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = {
            ...item,
            stockCount: stock,
            available: stock > 0,
          };
          syncMenuItem(updated);
          return updated;
        }
        return item;
      })
    );
  };

  // --- ORDER ACTIONS ---
  const createOrder = async (
    orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'statusHistory' | 'status'>
  ): Promise<Order> => {
    const orderIndex = String(orders.length + 1).padStart(4, '0');
    const today = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const orderNumber = `ELG-${today}-${orderIndex}`;
    const id = 'ord_' + Date.now();

    const newOrder: Order = {
      ...orderData,
      id,
      orderNumber,
      status: 'pending',
      createdAt: new Date().toISOString(),
      statusHistory: [
        {
          status: 'pending',
          timestamp: new Date().toISOString(),
          note: 'Order submitted by customer',
        },
      ],
    };

    // Decrement item stock counts if tracked
    setMenuItems((prev) =>
      prev.map((menuItem) => {
        const orderedItem = orderData.items.find((i) => i.menuItemId === menuItem.id);
        if (orderedItem && typeof menuItem.stockCount === 'number') {
          const newStock = Math.max(0, menuItem.stockCount - orderedItem.quantity);
          return {
            ...menuItem,
            stockCount: newStock,
            available: newStock > 0,
          };
        }
        return menuItem;
      })
    );

    // Increment promo usage
    if (orderData.promoCode) {
      setPromos((prev) =>
        prev.map((p) =>
          p.code.toUpperCase() === orderData.promoCode?.toUpperCase()
            ? { ...p, timesUsed: p.timesUsed + 1 }
            : p
        )
      );
    }

    setOrders((prev) => [newOrder, ...prev]);
    syncOrder(newOrder);
    setHasUnreadAdminAlerts(true);
    playAlertChime();
    logAudit('CREATE_ORDER', orderData.customerName || 'Guest', `Placed order ${orderNumber} (${orderData.type})`);

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updatedHistory = [
            ...ord.statusHistory,
            {
              status,
              timestamp: new Date().toISOString(),
              note: note || `Status updated to ${status}`,
            },
          ];
          const updatedOrder = {
            ...ord,
            status,
            statusHistory: updatedHistory,
          };
          syncOrder(updatedOrder);
          return updatedOrder;
        }
        return ord;
      })
    );
    logAudit('UPDATE_ORDER_STATUS', 'Staff', `Order ${orderId} moved to ${status}`);
  };

  const assignRider = (orderId: string, riderId: string, riderName: string, riderPhone: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updatedOrder = {
            ...ord,
            riderId,
            riderName,
            riderPhone,
            status: (ord.status === 'pending' || ord.status === 'preparing' ? 'ready' : ord.status) as OrderStatus,
            statusHistory: [
              ...ord.statusHistory,
              {
                status: 'ready' as OrderStatus,
                timestamp: new Date().toISOString(),
                note: `Assigned rider ${riderName} (${riderPhone})`,
              },
            ],
          };
          syncOrder(updatedOrder);
          return updatedOrder;
        }
        return ord;
      })
    );
    logAudit('ASSIGN_RIDER', 'Admin', `Assigned rider ${riderName} to order ${orderId}`);
  };

  const cancelOrder = (orderId: string, reason?: string): boolean => {
    const target = orders.find((o) => o.id === orderId);
    if (!target) return false;

    // Check cancellation window
    const orderTime = new Date(target.createdAt).getTime();
    const elapsedMinutes = (Date.now() - orderTime) / (1000 * 60);

    if (target.status === 'pending' && elapsedMinutes <= siteConfig.orderCancelWindowMinutes) {
      updateOrderStatus(orderId, 'cancelled', reason || 'Self-cancelled by customer within grace window');
      
      // Restore stock
      setMenuItems((prev) =>
        prev.map((menuItem) => {
          const matched = target.items.find((i) => i.menuItemId === menuItem.id);
          if (matched && typeof menuItem.stockCount === 'number') {
            return {
              ...menuItem,
              stockCount: menuItem.stockCount + matched.quantity,
              available: true,
            };
          }
          return menuItem;
        })
      );
      return true;
    }
    return false;
  };

  const requestOrderCancel = (orderId: string, reason?: string) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? {
              ...ord,
              cancelRequested: true,
              cancelReason: reason || 'Customer requested cancellation via portal',
            }
          : ord
      )
    );
    setHasUnreadAdminAlerts(true);
    playAlertChime();
    logAudit('CANCEL_REQUEST', 'Customer', `Cancellation requested for ${orderId}`);
  };

  // --- STAFF CALLS ---
  const createStaffCall = (tableNo: string, type: 'call_waiter' | 'request_bill'): StaffCall => {
    const call: StaffCall = {
      id: 'call_' + Date.now(),
      tableNo,
      type,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setStaffCalls((prev) => [call, ...prev]);
    syncStaffCall(call);
    setHasUnreadAdminAlerts(true);
    playAlertChime();
    return call;
  };

  const acknowledgeStaffCall = (id: string) => {
    setStaffCalls((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const updated = { ...c, status: 'acknowledged' as const };
          syncStaffCall(updated);
          return updated;
        }
        return c;
      })
    );
  };

  // --- RESERVATIONS ---
  const createReservation = async (
    resData: Omit<Reservation, 'id' | 'reservationCode' | 'createdAt' | 'status'>
  ): Promise<Reservation> => {
    const count = String(reservations.length + 1).padStart(2, '0');
    const code = `RES-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${count}`;
    const newRes: Reservation = {
      ...resData,
      id: 'res_' + Date.now(),
      reservationCode: code,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };
    setReservations((prev) => [newRes, ...prev]);
    syncReservation(newRes);
    setHasUnreadAdminAlerts(true);
    playAlertChime();
    logAudit('CREATE_RESERVATION', resData.customerName, `Reserved for ${resData.guests} guests on ${resData.date}`);
    return newRes;
  };

  const updateReservationStatus = (id: string, status: 'confirmed' | 'declined' | 'cancelled') => {
    setReservations((prev) =>
      prev.map((res) => {
        if (res.id === id) {
          const updated = { ...res, status };
          syncReservation(updated);
          return updated;
        }
        return res;
      })
    );
  };

  // --- REVIEWS ---
  const addReview = (userName: string, rating: number, comment: string, orderId?: string) => {
    const newReview: Review = {
      id: 'rev_' + Date.now(),
      userId: 'usr_' + Date.now(),
      userName,
      rating,
      comment,
      createdAt: new Date().toISOString().split('T')[0],
      approved: true, // auto-approved with clean filter
      orderId,
    };
    setReviews((prev) => [newReview, ...prev]);
    syncReview(newReview);
  };

  const deleteReview = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  // --- PROMOS & GIFTCARDS ---
  const validatePromo = (
    code: string,
    subtotal: number,
    orderType: OrderType
  ): { valid: boolean; promo?: PromoCode; message?: string } => {
    const clean = code.trim().toUpperCase();
    const found = promos.find((p) => p.code.toUpperCase() === clean);
    if (!found) {
      return { valid: false, message: 'Invalid promo code.' };
    }
    if (!found.active) {
      return { valid: false, message: 'This promo is no longer active.' };
    }
    if (subtotal < found.minOrder) {
      return { valid: false, message: `Minimum order of Rs ${found.minOrder.toLocaleString()} required.` };
    }
    if (found.timesUsed >= found.maxUses) {
      return { valid: false, message: 'This promo code has reached its maximum uses.' };
    }
    if (!found.orderTypes.includes(orderType)) {
      return { valid: false, message: `This promo is only valid for ${found.orderTypes.join(', ')}.` };
    }
    return { valid: true, promo: found };
  };

  const addPromo = (promo: PromoCode) => {
    setPromos((prev) => [promo, ...prev]);
  };

  const togglePromo = (id: string) => {
    setPromos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );
  };

  const validateGiftCard = (code: string): { valid: boolean; card?: GiftCard; message?: string } => {
    const clean = code.trim().toUpperCase();
    const found = giftCards.find((c) => c.code.toUpperCase() === clean);
    if (!found) {
      return { valid: false, message: 'Gift card not found.' };
    }
    if (!found.active || found.balance <= 0) {
      return { valid: false, message: 'Gift card is inactive or has zero balance.' };
    }
    return { valid: true, card: found };
  };

  const issueGiftCard = (cardData: Omit<GiftCard, 'id' | 'createdAt'>): GiftCard => {
    const newCard: GiftCard = {
      ...cardData,
      id: 'gc_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setGiftCards((prev) => [newCard, ...prev]);
    return newCard;
  };

  const updateSiteConfig = (updates: Partial<SiteConfig>) => {
    setSiteConfig((prev) => {
      const updated = { ...prev, ...updates };
      syncSiteConfig(updated);
      return updated;
    });
    logAudit('UPDATE_SETTINGS', 'Admin', 'Updated site configuration');
  };

  const updateDeliveryZones = (zones: DeliveryZone[]) => {
    setDeliveryZones(zones);
  };

  const updateTables = (tbls: TableItem[]) => {
    setTables(tbls);
  };

  const clearAdminAlerts = () => {
    setHasUnreadAdminAlerts(false);
  };

  return (
    <DataContext.Provider
      value={{
        menuItems,
        categories,
        orders,
        reservations,
        reviews,
        promos,
        giftCards,
        tables,
        staffCalls,
        deliveryZones,
        siteConfig,
        auditLogs,
        refunds,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleItemAvailability,
        updateItemStock,
        createOrder,
        updateOrderStatus,
        assignRider,
        cancelOrder,
        requestOrderCancel,
        createStaffCall,
        acknowledgeStaffCall,
        createReservation,
        updateReservationStatus,
        addReview,
        deleteReview,
        validatePromo,
        addPromo,
        togglePromo,
        validateGiftCard,
        issueGiftCard,
        updateSiteConfig,
        updateDeliveryZones,
        updateTables,
        hasUnreadAdminAlerts,
        clearAdminAlerts,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

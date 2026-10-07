/**
 * Firebase Client SDK Initialization & Real-Time Sync Services
 * Cafe Eleganza - Solarium & Artisan Coffee
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import {
  getFirestore,
  Firestore,
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import firebaseConfigJson from '../../firebase-applet-config.json';
import { MenuItem, Category, Order, Reservation, Review, TableItem, StaffCall, PromoCode, GiftCard } from '../../shared/types';
import { SiteConfig } from '../../shared/siteConfig';

let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfigJson);
} else {
  app = getApp();
}

export const auth: Auth = getAuth(app);
export const db: Firestore = firebaseConfigJson.firestoreDatabaseId
  ? getFirestore(app, firebaseConfigJson.firestoreDatabaseId)
  : getFirestore(app);

// Firestore Collections
export const COLLECTIONS = {
  MENU_ITEMS: 'menuItems',
  CATEGORIES: 'categories',
  ORDERS: 'orders',
  RESERVATIONS: 'reservations',
  REVIEWS: 'reviews',
  TABLES: 'tables',
  STAFF_CALLS: 'staffCalls',
  PROMOS: 'promos',
  GIFT_CARDS: 'giftCards',
  SETTINGS: 'settings',
} as const;

// --- Database Operations ---

export async function syncMenuItem(item: MenuItem) {
  try {
    await setDoc(doc(db, COLLECTIONS.MENU_ITEMS, item.id), item, { merge: true });
  } catch (err) {
    console.warn('[Firebase] syncMenuItem error:', err);
  }
}

export async function deleteMenuItemFromFirestore(id: string) {
  try {
    await deleteDoc(doc(db, COLLECTIONS.MENU_ITEMS, id));
  } catch (err) {
    console.warn('[Firebase] deleteMenuItem error:', err);
  }
}

export async function syncOrder(order: Order) {
  try {
    await setDoc(doc(db, COLLECTIONS.ORDERS, order.id), order, { merge: true });
  } catch (err) {
    console.warn('[Firebase] syncOrder error:', err);
  }
}

export async function syncReservation(res: Reservation) {
  try {
    await setDoc(doc(db, COLLECTIONS.RESERVATIONS, res.id), res, { merge: true });
  } catch (err) {
    console.warn('[Firebase] syncReservation error:', err);
  }
}

export async function syncStaffCall(call: StaffCall) {
  try {
    await setDoc(doc(db, COLLECTIONS.STAFF_CALLS, call.id), call, { merge: true });
  } catch (err) {
    console.warn('[Firebase] syncStaffCall error:', err);
  }
}

export async function syncReview(review: Review) {
  try {
    await setDoc(doc(db, COLLECTIONS.REVIEWS, review.id), review, { merge: true });
  } catch (err) {
    console.warn('[Firebase] syncReview error:', err);
  }
}

export async function syncSiteConfig(config: SiteConfig) {
  try {
    await setDoc(doc(db, COLLECTIONS.SETTINGS, 'siteConfig'), config, { merge: true });
  } catch (err) {
    console.warn('[Firebase] syncSiteConfig error:', err);
  }
}

/**
 * Seed initial catalog to Firestore if collection is empty
 */
export async function seedInitialFirestoreData(
  menuItems: MenuItem[],
  categories: Category[],
  tables: TableItem[]
) {
  try {
    const menuSnap = await getDocs(collection(db, COLLECTIONS.MENU_ITEMS));
    if (menuSnap.empty) {
      console.log('[Firebase] Seeding initial menu items to Firestore...');
      for (const item of menuItems) {
        await setDoc(doc(db, COLLECTIONS.MENU_ITEMS, item.id), item);
      }
    }

    const catSnap = await getDocs(collection(db, COLLECTIONS.CATEGORIES));
    if (catSnap.empty) {
      console.log('[Firebase] Seeding categories to Firestore...');
      for (const cat of categories) {
        await setDoc(doc(db, COLLECTIONS.CATEGORIES, cat.id), cat);
      }
    }

    const tableSnap = await getDocs(collection(db, COLLECTIONS.TABLES));
    if (tableSnap.empty) {
      for (const t of tables) {
        await setDoc(doc(db, COLLECTIONS.TABLES, t.id), t);
      }
    }
  } catch (err) {
    console.warn('[Firebase] Seed check skipped or offline:', err);
  }
}

export {
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
};

export default app;

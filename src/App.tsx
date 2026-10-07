/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider, useData } from './context/DataContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';

import { SplashScreen } from './components/common/SplashScreen';
import { AnnouncementBanner } from './components/common/AnnouncementBanner';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { FloatingActions } from './components/common/FloatingActions';
import { CartDrawer } from './components/cart/CartDrawer';
import { ItemDetailModal } from './components/menu/ItemDetailModal';

import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { ReservationsPage } from './pages/ReservationsPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { StoryPage } from './pages/StoryPage';
import { GiftCardsPage } from './pages/GiftCardsPage';
import { ProfilePage } from './pages/ProfilePage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { TableOrderingPage } from './pages/TableOrderingPage';
import { RiderAppPage } from './pages/RiderAppPage';
import { AdminPage } from './pages/AdminPage';
import { TermsPage, PrivacyPage, RefundPolicyPage, ContactPage } from './pages/LegalPages';
import { MenuItem } from '../shared/types';

const MainLayout: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedCategoryParam, setSelectedCategoryParam] = useState<string>('all');
  const [trackedOrderId, setTrackedOrderId] = useState<string>('');
  const [activeTableNo, setActiveTableNo] = useState<string | null>(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [showSplash, setShowSplash] = useState<boolean>(true);

  // Check URL pathname for table QR scan e.g. /t/4
  useEffect(() => {
    const pathname = window.location.pathname;
    const tableMatch = pathname.match(/\/t\/([a-zA-Z0-9_-]+)/);
    if (tableMatch && tableMatch[1]) {
      setActiveTableNo(tableMatch[1]);
      setCurrentTab('table');
    }
  }, []);

  const handleNavigate = (tab: string, param?: string) => {
    setCurrentTab(tab);
    if (tab === 'menu' && param) {
      setSelectedCategoryParam(param);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenItemDetail = (item: MenuItem) => {
    setSelectedMenuItem(item);
  };

  const handleOrderSuccess = (orderId: string) => {
    setTrackedOrderId(orderId);
    setCurrentTab('orders');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6EFE3] dark:bg-[#1C130D] text-[#2B1B12] dark:text-[#F6EFE3] transition-colors duration-300">
      {/* 1. Animated Splash Screen on first load */}
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}

      {/* 2. Top Announcement Ribbon */}
      <AnnouncementBanner />

      {/* 3. Global Navbar */}
      <Navbar
        currentTab={currentTab}
        onNavigate={handleNavigate}
      />

      {/* 4. Active Page Content */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onOpenItemDetail={handleOpenItemDetail}
          />
        )}

        {currentTab === 'menu' && (
          <MenuPage
            initialCategoryId={selectedCategoryParam}
            onOpenItemDetail={handleOpenItemDetail}
          />
        )}

        {currentTab === 'reservations' && <ReservationsPage />}

        {currentTab === 'reviews' && <ReviewsPage />}

        {currentTab === 'story' && <StoryPage />}

        {currentTab === 'giftcards' && <GiftCardsPage />}

        {currentTab === 'profile' && (
          <ProfilePage
            onNavigateOrder={(id) => {
              setTrackedOrderId(id);
              setCurrentTab('orders');
            }}
            onNavigateMenu={() => setCurrentTab('menu')}
          />
        )}

        {currentTab === 'orders' && (
          <OrderTrackingPage
            orderId={trackedOrderId}
            onNavigateHome={() => setCurrentTab('home')}
          />
        )}

        {currentTab === 'table' && (
          <TableOrderingPage
            tableNo={activeTableNo || '4'}
            onOpenItemDetail={handleOpenItemDetail}
            onNavigateMenu={() => setCurrentTab('menu')}
          />
        )}

        {currentTab === 'rider' && <RiderAppPage />}

        {currentTab === 'admin' && <AdminPage />}

        {currentTab === 'contact' && <ContactPage />}
        {currentTab === 'terms' && <TermsPage />}
        {currentTab === 'privacy' && <PrivacyPage />}
        {currentTab === 'refunds' && <RefundPolicyPage />}
      </main>

      {/* 5. Item Detail Modal */}
      <ItemDetailModal
        item={selectedMenuItem}
        onClose={() => setSelectedMenuItem(null)}
      />

      {/* 6. Checkout Drawer */}
      <CartDrawer onOrderSuccess={handleOrderSuccess} />

      {/* 7. Floating WhatsApp, Call & Table Service Actions */}
      <FloatingActions />

      {/* 8. Global Luxury Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <DataProvider>
          <AuthProvider>
            <CartProvider>
              <MainLayout />
            </CartProvider>
          </AuthProvider>
        </DataProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

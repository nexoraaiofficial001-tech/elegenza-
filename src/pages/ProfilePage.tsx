import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/Button';
import {
  User,
  ShoppingBag,
  Calendar,
  Coins,
  MapPin,
  LogOut,
  RotateCcw,
  Trash2,
  CheckCircle2,
} from 'lucide-react';

interface ProfilePageProps {
  onNavigateOrder: (orderId: string) => void;
  onNavigateMenu: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  onNavigateOrder,
  onNavigateMenu,
}) => {
  const { language, t, formatPrice } = useLanguage();
  const { user, logout, loginAsDemo } = useAuth();
  const { orders, reservations } = useData();
  const { addItem, setIsCartOpen } = useCart();

  const [activeTab, setActiveTab] = useState<'orders' | 'reservations' | 'loyalty' | 'addresses'>('orders');

  if (!user) {
    return (
      <div className="w-full pt-36 pb-24 px-4 max-w-md mx-auto text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#0F3D2E]/10 text-[#0F3D2E] dark:text-[#E2B882] flex items-center justify-center mx-auto">
          <User className="w-8 h-8" />
        </div>
        <h2 className="font-serif-display font-bold text-2xl text-[#0F3D2E] dark:text-[#F6EFE3]">
          Guest Account Access
        </h2>
        <p className="text-xs text-[#6B5E55] dark:text-[#C5B5A5]">
          Sign in or load our sample customer profile to test loyalty rewards, previous orders, and table bookings.
        </p>
        <div className="flex flex-col gap-3">
          <Button
            variant="caramel"
            size="lg"
            onClick={() => loginAsDemo('customer')}
          >
            Sign In with Sample Customer
          </Button>
          <Button
            variant="outline"
            onClick={() => loginAsDemo('admin')}
          >
            Access Staff / Admin
          </Button>
        </div>
      </div>
    );
  }

  // Filter user orders
  const myOrders = orders; // show all current session orders for quick test
  const myReservations = reservations;

  return (
    <div className="w-full pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* User Header Profile Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0A2A20] border border-[#2B1B12]/10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-full bg-[#0F3D2E] text-[#F6EFE3] flex items-center justify-center font-serif-display font-bold text-2xl border-2 border-[#C48A4A]">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="font-serif-display font-bold text-2xl text-[#0F3D2E] dark:text-[#F6EFE3]">
              {user.name}
            </h2>
            <p className="text-xs text-[#6B5E55] dark:text-[#C5B5A5]">
              {user.email} · {user.phone || '0300-1234567'}
            </p>
            <div className="inline-flex items-center gap-1.5 mt-1.5 px-3 py-0.5 rounded-full bg-[#2E7D32]/10 text-[#2E7D32] text-xs font-semibold">
              <Coins className="w-3.5 h-3.5" />
              <span>{user.loyaltyPoints} Eleganza Points (Worth {formatPrice(user.loyaltyPoints)})</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={logout}
          className="p-2.5 rounded-full border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-[#2B1B12]/10 gap-6 text-sm font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`pb-3 flex items-center gap-2 cursor-pointer ${
            activeTab === 'orders'
              ? 'border-b-2 border-[#0F3D2E] text-[#0F3D2E] dark:text-[#E2B882]'
              : 'text-[#6B5E55] dark:text-[#C5B5A5]'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Order History ({myOrders.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('reservations')}
          className={`pb-3 flex items-center gap-2 cursor-pointer ${
            activeTab === 'reservations'
              ? 'border-b-2 border-[#0F3D2E] text-[#0F3D2E] dark:text-[#E2B882]'
              : 'text-[#6B5E55] dark:text-[#C5B5A5]'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Reservations ({myReservations.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('loyalty')}
          className={`pb-3 flex items-center gap-2 cursor-pointer ${
            activeTab === 'loyalty'
              ? 'border-b-2 border-[#0F3D2E] text-[#0F3D2E] dark:text-[#E2B882]'
              : 'text-[#6B5E55] dark:text-[#C5B5A5]'
          }`}
        >
          <Coins className="w-4 h-4" />
          <span>Loyalty Rewards</span>
        </button>
      </div>

      {/* Tab 1: Orders History */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {myOrders.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-[#0A2A20] rounded-3xl border">
              <p className="text-xs text-gray-500">No past orders yet.</p>
            </div>
          ) : (
            myOrders.map((order) => (
              <div
                key={order.id}
                className="p-5 rounded-3xl bg-white dark:bg-[#0A2A20] border border-[#2B1B12]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-base text-[#0F3D2E] dark:text-[#E2B882]">
                      {order.orderNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold uppercase bg-[#EADFCB] text-[#2B1B12] dark:bg-black/30 dark:text-[#E2B882]">
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#6B5E55] dark:text-[#C5B5A5] mt-1">
                    {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                  </p>
                  <span className="font-bold text-xs text-[#0F3D2E] dark:text-[#E2B882] block mt-1">
                    {formatPrice(order.total)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onNavigateOrder(order.id)}
                  >
                    Track Status
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Reservations */}
      {activeTab === 'reservations' && (
        <div className="space-y-4">
          {myReservations.map((res) => (
            <div
              key={res.id}
              className="p-5 rounded-3xl bg-white dark:bg-[#0A2A20] border border-[#2B1B12]/10 flex justify-between items-center shadow-sm"
            >
              <div>
                <span className="font-mono font-bold text-sm text-[#0F3D2E] dark:text-[#E2B882]">
                  {res.reservationCode}
                </span>
                <p className="text-xs text-[#6B5E55] dark:text-[#C5B5A5] mt-0.5">
                  {res.date} at {res.time} · {res.guests} Guests ({res.occasion || 'Dinner'})
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#2E7D32]/10 text-[#2E7D32] text-xs font-bold">
                {res.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Loyalty Rewards Program */}
      {activeTab === 'loyalty' && (
        <div className="p-8 rounded-3xl bg-[#0F3D2E] text-white space-y-6 shadow-xl">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#E2B882]">
                Eleganza Solarium Patron Rewards
              </span>
              <h3 className="font-serif-display font-bold text-3xl mt-1">
                {user.loyaltyPoints} Points Available
              </h3>
              <p className="text-xs text-white/80 mt-1">
                Earn 5 points for every Rs 100 spent. Redeem anytime at checkout for up to 50% discount!
              </p>
            </div>
            <Coins className="w-10 h-10 text-[#C48A4A]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs">
            <div className="p-4 rounded-2xl bg-white/10 space-y-1">
              <span className="font-bold text-sm text-[#E2B882]">Tier 1: Connoisseur</span>
              <p className="opacity-80">Free extra flavor drizzle on every third coffee order.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 space-y-1">
              <span className="font-bold text-sm text-[#E2B882]">Birthday Reward</span>
              <p className="opacity-80">Complimentary Eleganza Affogato or slice of chocolate cake on your special day.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 space-y-1">
              <span className="font-bold text-sm text-[#E2B882]">Secret Tasting Drops</span>
              <p className="opacity-80">Invitations to preview our new seasonal roasts before public release.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

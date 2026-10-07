import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import {
  Bike,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  Navigation,
  Clock,
} from 'lucide-react';

export const RiderAppPage: React.FC = () => {
  const { language, formatPrice } = useLanguage();
  const { orders, updateOrderStatus } = useData();
  const { user, loginAsDemo } = useAuth();

  const [activeTab, setActiveTab] = useState<'assigned' | 'completed'>('assigned');
  const [sharingLocation, setSharingLocation] = useState(false);

  // Delivery orders assigned or pending dispatch
  const deliveryOrders = orders.filter((o) => o.type === 'delivery');
  const activeDeliveries = deliveryOrders.filter(
    (o) => o.status === 'ready' || o.status === 'out_for_delivery' || o.status === 'preparing'
  );
  const completedDeliveries = deliveryOrders.filter((o) => o.status === 'delivered');

  // Daily cash collected sum
  const totalCollectedToday = completedDeliveries.reduce((sum, o) => sum + o.total, 0);

  const handleStatusChange = (orderId: string, newStatus: any) => {
    updateOrderStatus(orderId, newStatus);
  };

  return (
    <div className="w-full pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6">
      {/* Rider Header Bar */}
      <div className="p-6 rounded-3xl bg-[#0F3D2E] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#C48A4A] text-white flex items-center justify-center">
            <Bike className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#E2B882]">
              Faisalabad Express Dispatch Hub
            </span>
            <h2 className="font-serif-display font-bold text-2xl">
              Rider Console: {user?.name || 'Kashif'}
            </h2>
            <p className="text-xs text-white/80">Vehicle: Honda CD70 (FSD-8291)</p>
          </div>
        </div>

        {/* Location toggle & stats */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSharingLocation((p) => !p)}
            className={`px-3 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              sharingLocation ? 'bg-[#2E7D32] text-white' : 'bg-white/10 text-white/70'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>{sharingLocation ? 'Live GPS Active' : 'Share GPS'}</span>
          </button>
        </div>
      </div>

      {/* Cash Reconciliation Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0A2A20] border border-[#2B1B12]/10 space-y-1">
          <span className="text-[11px] font-bold text-[#6B5E55] dark:text-[#C5B5A5] uppercase">
            Active Deliveries
          </span>
          <span className="font-serif-display font-black text-2xl text-[#0F3D2E] dark:text-[#E2B882] block">
            {activeDeliveries.length}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0A2A20] border border-[#2B1B12]/10 space-y-1">
          <span className="text-[11px] font-bold text-[#6B5E55] dark:text-[#C5B5A5] uppercase">
            Completed Today
          </span>
          <span className="font-serif-display font-black text-2xl text-[#2E7D32] block">
            {completedDeliveries.length}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0A2A20] border border-[#2B1B12]/10 space-y-1 col-span-2 sm:col-span-1">
          <span className="text-[11px] font-bold text-[#6B5E55] dark:text-[#C5B5A5] uppercase">
            COD Cash To Reconcile
          </span>
          <span className="font-serif-display font-black text-2xl text-[#C48A4A] block">
            {formatPrice(totalCollectedToday)}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#2B1B12]/10 gap-6 text-sm font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('assigned')}
          className={`pb-3 cursor-pointer ${
            activeTab === 'assigned'
              ? 'border-b-2 border-[#0F3D2E] text-[#0F3D2E] dark:text-[#E2B882]'
              : 'text-[#6B5E55]'
          }`}
        >
          Active Deliveries ({activeDeliveries.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('completed')}
          className={`pb-3 cursor-pointer ${
            activeTab === 'completed'
              ? 'border-b-2 border-[#0F3D2E] text-[#0F3D2E] dark:text-[#E2B882]'
              : 'text-[#6B5E55]'
          }`}
        >
          Delivered History ({completedDeliveries.length})
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {activeTab === 'assigned' &&
          (activeDeliveries.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#0A2A20] border text-xs text-gray-500">
              No active delivery dispatches assigned. Safe riding!
            </div>
          ) : (
            activeDeliveries.map((order) => (
              <div
                key={order.id}
                className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0A2A20] border border-[#2B1B12]/10 space-y-4 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2B1B12]/8 pb-3">
                  <div>
                    <span className="font-mono font-bold text-base text-[#0F3D2E] dark:text-[#E2B882]">
                      {order.orderNumber}
                    </span>
                    <p className="text-xs font-semibold text-[#2B1B12] dark:text-[#F6EFE3]">
                      Customer: {order.customerName}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-[#EADFCB] text-xs font-bold uppercase text-[#2B1B12] dark:bg-black/30 dark:text-[#E2B882]">
                      Status: {order.status}
                    </span>
                    <span className="font-bold text-base text-[#0F3D2E] dark:text-[#E2B882]">
                      Collect: {formatPrice(order.total)}
                    </span>
                  </div>
                </div>

                {/* Delivery Address & Tap to Call */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-start gap-2 bg-[#F6EFE3] dark:bg-[#1C130D] p-3 rounded-2xl">
                    <MapPin className="w-4 h-4 text-[#C48A4A] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Delivery Address:</span>
                      <p className="opacity-90">{order.address || 'Raza Town, Faisalabad'}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-[#F6EFE3] dark:bg-[#1C130D] p-3 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#2E7D32]" />
                      <span className="font-bold">{order.phone}</span>
                    </div>
                    <a
                      href={`tel:${order.phone}`}
                      className="px-3 py-1.5 rounded-full bg-[#2E7D32] text-white font-bold text-xs shadow"
                    >
                      Call Customer
                    </a>
                  </div>
                </div>

                {/* Items */}
                <div className="text-xs text-[#6B5E55] dark:text-[#C5B5A5]">
                  <span className="font-bold block mb-1">Items to deliver:</span>
                  <p>{order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}</p>
                </div>

                {/* Status Action Buttons */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-[#2B1B12]/8">
                  {order.status === 'ready' && (
                    <Button
                      size="sm"
                      variant="caramel"
                      onClick={() => handleStatusChange(order.id, 'out_for_delivery')}
                    >
                      Mark Picked Up & On Route
                    </Button>
                  )}
                  {order.status === 'out_for_delivery' && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleStatusChange(order.id, 'delivered')}
                    >
                      Confirm Delivered & Cash Collected
                    </Button>
                  )}
                </div>
              </div>
            ))
          ))}

        {activeTab === 'completed' && (
          <div className="space-y-3">
            {completedDeliveries.map((order) => (
              <div
                key={order.id}
                className="p-4 rounded-2xl bg-white dark:bg-[#0A2A20] border border-[#2B1B12]/10 flex justify-between items-center text-xs"
              >
                <div>
                  <span className="font-mono font-bold text-sm text-[#0F3D2E] dark:text-[#E2B882]">
                    {order.orderNumber}
                  </span>
                  <p className="opacity-80">{order.address}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[#2E7D32] block">Delivered ✓</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

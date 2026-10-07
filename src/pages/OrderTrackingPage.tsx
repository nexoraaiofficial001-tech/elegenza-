import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { Order, OrderStatus } from '../../shared/types';
import { Button } from '../components/ui/Button';
import {
  Clock,
  ChefHat,
  PackageCheck,
  Bike,
  CheckCircle,
  XCircle,
  Phone,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

interface OrderTrackingPageProps {
  orderId?: string;
  onNavigateHome: () => void;
}

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({
  orderId,
  onNavigateHome,
}) => {
  const { language, t, formatPrice } = useLanguage();
  const { orders, cancelOrder, requestOrderCancel, siteConfig } = useData();

  const [searchId, setSearchId] = useState<string>(orderId || '');
  const [cancelReasonInput, setCancelReasonInput] = useState<string>('');
  const [showCancelPrompt, setShowCancelPrompt] = useState<boolean>(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Find order by ID or Order Number
  const currentOrder = orders.find(
    (o) => o.id === searchId || o.orderNumber.toUpperCase() === searchId.toUpperCase()
  );

  const statuses: { key: OrderStatus; label: string; icon: any }[] = [
    { key: 'pending', label: t('tracking.statusPending'), icon: Clock },
    { key: 'preparing', label: t('tracking.statusPreparing'), icon: ChefHat },
    { key: 'ready', label: t('tracking.statusReady'), icon: PackageCheck },
    { key: 'out_for_delivery', label: t('tracking.statusOut'), icon: Bike },
    { key: 'delivered', label: t('tracking.statusDelivered'), icon: CheckCircle },
  ];

  const getStatusIndex = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 0;
      case 'preparing': return 1;
      case 'ready': return 2;
      case 'out_for_delivery': return 3;
      case 'delivered': return 4;
      case 'cancelled': return -1;
      default: return 0;
    }
  };

  const handleCancel = () => {
    if (!currentOrder) return;
    const cancelled = cancelOrder(currentOrder.id, cancelReasonInput);
    if (cancelled) {
      setActionMessage('Your order was successfully cancelled.');
    } else {
      requestOrderCancel(currentOrder.id, cancelReasonInput);
      setActionMessage('Cancellation requested. Staff has been notified for approval.');
    }
    setShowCancelPrompt(false);
  };

  return (
    <div className="w-full pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* Search Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <h1 className="font-serif-display font-bold text-3xl sm:text-4xl text-[#0F3D2E] dark:text-[#F6EFE3]">
          {t('tracking.title')}
        </h1>
        <p className="text-xs sm:text-sm text-[#6B5E55] dark:text-[#C5B5A5]">
          Track kitchen preparations, wood fire timers, and live dispatch in real-time.
        </p>

        {/* Input to look up other order */}
        <div className="flex gap-2 max-w-md mx-auto pt-2">
          <input
            type="text"
            placeholder="Enter Order # (e.g. ELG-261007-0001)"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="flex-1 p-3 rounded-full border border-[#2B1B12]/15 dark:border-white/10 bg-white dark:bg-[#1C130D] text-xs font-mono uppercase font-bold"
          />
        </div>
      </div>

      {actionMessage && (
        <div className="p-4 rounded-2xl bg-[#0F3D2E]/10 border border-[#0F3D2E]/20 text-[#0F3D2E] dark:text-[#E2B882] text-xs font-semibold text-center">
          {actionMessage}
        </div>
      )}

      {currentOrder ? (
        <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#0A2A20] border border-[#2B1B12]/10 space-y-8 shadow-xl">
          {/* Order Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2B1B12]/10 dark:border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xl sm:text-2xl text-[#0F3D2E] dark:text-[#E2B882]">
                  {currentOrder.orderNumber}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-[#EADFCB] text-[#2B1B12] dark:bg-black/30 dark:text-[#E2B882]">
                  {currentOrder.type}
                </span>
              </div>
              <p className="text-xs text-[#6B5E55] dark:text-[#C5B5A5] mt-1">
                Placed on {new Date(currentOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-[#6B5E55] dark:text-[#C5B5A5] block">Total Amount:</span>
              <span className="font-serif-display font-bold text-2xl text-[#0F3D2E] dark:text-[#E2B882]">
                {formatPrice(currentOrder.total)}
              </span>
            </div>
          </div>

          {/* Stepper Progress */}
          {currentOrder.status === 'cancelled' ? (
            <div className="p-6 rounded-2xl bg-[#C0392B]/10 border border-[#C0392B]/20 text-center space-y-2">
              <XCircle className="w-10 h-10 text-[#C0392B] mx-auto" />
              <h4 className="font-bold text-lg text-[#C0392B]">Order Cancelled</h4>
              <p className="text-xs text-[#6B5E55] dark:text-[#C5B5A5]">
                {currentOrder.cancelReason || 'This order was cancelled.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-5 gap-2 text-center">
                {statuses.map((s, idx) => {
                  const currentIdx = getStatusIndex(currentOrder.status);
                  const isDone = currentIdx >= idx;
                  const isCurrent = currentIdx === idx;
                  const Icon = s.icon;

                  return (
                    <div key={s.key} className="flex flex-col items-center gap-2">
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all ${
                          isDone
                            ? 'bg-[#0F3D2E] text-white shadow-md'
                            : 'bg-[#EADFCB] dark:bg-[#1C130D] text-gray-400'
                        } ${isCurrent ? 'ring-4 ring-[#C48A4A]' : ''}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span
                        className={`text-[10px] sm:text-xs font-semibold leading-tight ${
                          isDone ? 'text-[#0F3D2E] dark:text-[#E2B882]' : 'text-gray-400'
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Status Note */}
              <div className="p-4 rounded-2xl bg-[#F6EFE3] dark:bg-[#1C130D] border border-[#2B1B12]/8 text-center text-xs text-[#6B5E55] dark:text-[#C5B5A5]">
                {currentOrder.status === 'pending' && 'Your order is in the kitchen queue. Prepping fresh ingredients.'}
                {currentOrder.status === 'preparing' && 'Our baristas and chefs are crafting your dishes with care.'}
                {currentOrder.status === 'ready' && 'Your order is packaged piping hot and ready for handover.'}
                {currentOrder.status === 'out_for_delivery' && 'Dispatched with rider! Heading to your address.'}
                {currentOrder.status === 'delivered' && 'Delivered! We hope you enjoyed your Eleganza experience.'}
              </div>
            </div>
          )}

          {/* Assigned Rider Banner (if delivery & rider assigned) */}
          {currentOrder.riderName && (
            <div className="p-4 rounded-2xl bg-[#0F3D2E]/10 border border-[#0F3D2E]/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0F3D2E] text-white flex items-center justify-center">
                  <Bike className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-[#6B5E55] block">Your Express Delivery Rider</span>
                  <span className="font-bold text-sm text-[#0F3D2E] dark:text-[#E2B882]">
                    {currentOrder.riderName}
                  </span>
                </div>
              </div>

              {currentOrder.riderPhone && (
                <a
                  href={`tel:${currentOrder.riderPhone}`}
                  className="px-4 py-2 rounded-full bg-[#C48A4A] text-white text-xs font-bold flex items-center gap-1.5 shadow"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Call Rider
                </a>
              )}
            </div>
          )}

          {/* Itemized Order Summary */}
          <div className="space-y-3 pt-4 border-t border-[#2B1B12]/10 dark:border-white/10">
            <h5 className="font-bold text-xs uppercase tracking-wider text-[#6B5E55] dark:text-[#C5B5A5]">
              Order Items ({currentOrder.items.length})
            </h5>
            <div className="space-y-2">
              {currentOrder.items.map((item, i) => (
                <div key={i} className="flex justify-between text-xs py-1">
                  <span>
                    <strong>{item.quantity}x</strong> {item.name}{' '}
                    {item.selectedVariant && `(${item.selectedVariant.name})`}
                  </span>
                  <span className="font-bold">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cancellation Actions */}
          {currentOrder.status !== 'cancelled' && currentOrder.status !== 'delivered' && (
            <div className="pt-4 border-t border-[#2B1B12]/10 dark:border-white/10 flex items-center justify-between">
              {showCancelPrompt ? (
                <div className="w-full space-y-3 p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200">
                  <span className="text-xs font-semibold text-red-700 block">
                    Reason for cancellation (optional):
                  </span>
                  <input
                    type="text"
                    placeholder="e.g. Changed mind, ordered wrong item"
                    value={cancelReasonInput}
                    onChange={(e) => setCancelReasonInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl border text-xs bg-white dark:bg-black/40"
                  />
                  <div className="flex gap-2">
                    <Button variant="danger" size="sm" onClick={handleCancel}>
                      Confirm Cancellation
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setShowCancelPrompt(false)}>
                      Dismiss
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowCancelPrompt(true)}
                  className="text-xs text-[#C0392B] hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {currentOrder.status === 'pending' ? 'Cancel Order' : 'Request Cancellation'}
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#0A2A20] border border-[#2B1B12]/10 space-y-4">
          <Clock className="w-12 h-12 text-gray-400 mx-auto" />
          <h4 className="text-xl font-bold font-serif-display">No Order Selected</h4>
          <p className="text-xs text-[#6B5E55] dark:text-[#C5B5A5]">
            Please enter your order reference number above (e.g. ELG-261007-0001) to view status.
          </p>
        </div>
      )}
    </div>
  );
};

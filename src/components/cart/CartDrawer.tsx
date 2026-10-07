import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../../context/CartContext';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { QuantityStepper } from '../ui/QuantityStepper';
import { Button } from '../ui/Button';
import { MapPicker } from '../common/MapPicker';
import confetti from 'canvas-confetti';
import {
  X,
  ShoppingBag,
  Trash2,
  Tag,
  Gift,
  Coins,
  ArrowRight,
  CheckCircle,
  Truck,
  Store,
  Utensils,
  AlertCircle,
} from 'lucide-react';

interface CartDrawerProps {
  onOrderSuccess?: (orderId: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onOrderSuccess }) => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeItem,
    updateQuantity,
    clearCart,
    orderType,
    setOrderType,
    tableNo,
    setTableNo,
    customerName,
    phone,
    email,
    deliveryAddress,
    customerNotes,
    setCustomerInfo,
    promo,
    applyPromo,
    removePromo,
    giftCard,
    applyGiftCard,
    removeGiftCard,
    loyaltyPointsToRedeem,
    setLoyaltyPointsToRedeem,
    subtotal,
    promoDiscount,
    giftCardDiscount,
    loyaltyDiscount,
    tax,
    deliveryFee,
    total,
    pointsEarnable,
  } = useCart();

  const { validatePromo, validateGiftCard, createOrder, siteConfig } = useData();
  const { language, formatPrice, isRtl, t } = useLanguage();
  const { user, isPhoneVerified, verifyPhone } = useAuth();

  const [promoCodeInput, setPromoCodeInput] = useState<string>('');
  const [promoError, setPromoError] = useState<string>('');
  const [promoSuccess, setPromoSuccess] = useState<string>('');

  const [giftCardInput, setGiftCardInput] = useState<string>('');
  const [giftCardError, setGiftCardError] = useState<string>('');

  const [otpCodeInput, setOtpCodeInput] = useState<string>('');
  const [showOtpField, setShowOtpField] = useState<boolean>(false);
  const [otpSent, setOtpSent] = useState<boolean>(false);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [orderError, setOrderError] = useState<string>('');
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);

  if (!isCartOpen) return null;

  // Pakistani phone validation: +923XXXXXXXXX or 03XXXXXXXXX
  const isValidPakistaniPhone = (num: string): boolean => {
    const cleaned = num.replace(/\s|-/g, '');
    return /^(\+92|0)?3[0-9]{9}$/.test(cleaned);
  };

  const handleApplyPromo = () => {
    setPromoError('');
    setPromoSuccess('');
    if (!promoCodeInput.trim()) return;

    const res = validatePromo(promoCodeInput, subtotal, orderType);
    if (!res.valid || !res.promo) {
      setPromoError(res.message || 'Invalid promo code');
    } else {
      applyPromo(res.promo);
      setPromoSuccess(`Promo ${res.promo.code} applied!`);
      setPromoCodeInput('');
    }
  };

  const handleApplyGiftCard = () => {
    setGiftCardError('');
    if (!giftCardInput.trim()) return;

    const res = validateGiftCard(giftCardInput);
    if (!res.valid || !res.card) {
      setGiftCardError(res.message || 'Gift card invalid');
    } else {
      applyGiftCard(res.card, res.card.balance);
      setGiftCardInput('');
    }
  };

  const handleSendOtp = () => {
    if (!isValidPakistaniPhone(phone)) {
      setOrderError('Please enter a valid Pakistani mobile number (03XX-XXXXXXX).');
      return;
    }
    setOtpSent(true);
    setShowOtpField(true);
    setOrderError('');
  };

  const handleVerifyOtp = async () => {
    const verified = await verifyPhone(phone, otpCodeInput);
    if (verified) {
      setShowOtpField(false);
      setOrderError('');
    } else {
      setOrderError('Invalid OTP code. Try entering 1234 for testing.');
    }
  };

  const handleSubmitOrder = async () => {
    setOrderError('');

    if (items.length === 0) {
      setOrderError('Your cart is empty.');
      return;
    }

    if (orderType === 'dine_in' && !tableNo) {
      setOrderError('Please select or specify your Table Number.');
      return;
    }

    if (!customerName.trim()) {
      setOrderError('Please enter your full name.');
      return;
    }

    if (!isValidPakistaniPhone(phone)) {
      setOrderError('Please enter a valid phone number (0300-XXXXXXX).');
      return;
    }

    if (orderType === 'delivery') {
      if (!deliveryAddress.trim()) {
        setOrderError('Please enter your full delivery address in Faisalabad.');
        return;
      }
      if (subtotal < siteConfig.minOrderDelivery) {
        setOrderError(`Minimum order for delivery is ${formatPrice(siteConfig.minOrderDelivery)}.`);
        return;
      }

      // Check OTP verification for guest delivery orders
      if (!isPhoneVerified(phone)) {
        setShowOtpField(true);
        setOtpSent(true);
        setOrderError('Please verify your phone number via OTP to place a delivery order.');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const order = await createOrder({
        customerName,
        phone,
        email: email || undefined,
        type: orderType,
        tableNo: orderType === 'dine_in' ? tableNo : undefined,
        address: orderType === 'delivery' ? deliveryAddress : undefined,
        language: language === 'ur' ? 'ur' : 'en',
        paymentMethod: orderType === 'delivery' ? 'cod' : 'pay_at_counter',
        items,
        subtotal,
        discount: promoDiscount,
        promoCode: promo?.code,
        giftCardCode: giftCard?.code,
        giftCardUsed: giftCardDiscount,
        pointsUsed: loyaltyPointsToRedeem,
        pointsEarned: pointsEarnable,
        tax,
        deliveryFee,
        total,
        customerNotes,
      });

      // Trigger Celebration Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0F3D2E', '#C48A4A', '#E2B882', '#6B8F71'],
        });
      } catch {}

      setConfirmedOrderId(order.orderNumber);
      clearCart();
      if (onOrderSuccess) onOrderSuccess(order.id);
    } catch (err: any) {
      setOrderError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCartOpen(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Drawer Panel */}
        <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: isRtl ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: isRtl ? '-100%' : '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="w-screen max-w-md sm:max-w-lg bg-[#F6EFE3] dark:bg-[#0A2A20] text-[#2B1B12] dark:text-[#F6EFE3] shadow-2xl flex flex-col justify-between"
          >
            {/* Drawer Header */}
            <div className="p-5 border-b border-[#2B1B12]/10 dark:border-white/10 flex items-center justify-between bg-white/40 dark:bg-black/20">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#0F3D2E] dark:text-[#E2B882]" />
                <h3 className="font-serif-display text-xl font-bold">
                  {t('cart.title')}
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#C48A4A] text-white font-semibold">
                  {items.reduce((acc, i) => acc + i.quantity, 0)}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Confirmed Order State */}
            {confirmedOrderId ? (
              <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#2E7D32]/10 text-[#2E7D32] flex items-center justify-center">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h4 className="text-2xl font-bold font-serif-display text-[#0F3D2E] dark:text-[#E2B882]">
                  Order Placed Successfully!
                </h4>
                <p className="text-sm text-[#6B5E55] dark:text-[#C5B5A5]">
                  Your kitchen ticket has been printed and our baristas are preparing your items.
                </p>
                <div className="p-3 bg-white dark:bg-[#1C130D] rounded-2xl border border-[#C48A4A]/30 font-mono font-bold text-lg text-[#0F3D2E] dark:text-[#E2B882]">
                  {confirmedOrderId}
                </div>
                <p className="text-xs text-[#2E7D32] font-semibold">
                  You earned +{pointsEarnable} Eleganza Loyalty Points!
                </p>
                <Button
                  variant="caramel"
                  onClick={() => {
                    setConfirmedOrderId(null);
                    setIsCartOpen(false);
                  }}
                  className="w-full mt-4"
                >
                  Return to Menu
                </Button>
              </div>
            ) : items.length === 0 ? (
              /* Empty Cart State */
              <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-[#EADFCB] dark:bg-[#1C130D] flex items-center justify-center text-[#6B5E55]">
                  <ShoppingBag className="w-10 h-10 opacity-60" />
                </div>
                <h4 className="text-xl font-bold font-serif-display">
                  {t('cart.empty')}
                </h4>
                <p className="text-sm text-[#6B5E55] dark:text-[#C5B5A5]">
                  {t('cart.emptySub')}
                </p>
                <Button
                  variant="primary"
                  onClick={() => setIsCartOpen(false)}
                >
                  {t('hero.viewMenu')}
                </Button>
              </div>
            ) : (
              /* Cart Body Scrollable */
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                {/* Order Type Toggle: Dine-in / Takeaway / Delivery */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#0F3D2E] dark:text-[#E2B882]">
                    {t('cart.orderType')}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setOrderType('delivery')}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                        orderType === 'delivery'
                          ? 'border-[#0F3D2E] bg-[#0F3D2E] text-white shadow'
                          : 'border-[#2B1B12]/15 bg-white/60 dark:bg-black/20 hover:border-[#0F3D2E]'
                      }`}
                    >
                      <Truck className="w-4 h-4" />
                      <span className="text-xs font-semibold">{t('cart.delivery')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setOrderType('dine_in')}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                        orderType === 'dine_in'
                          ? 'border-[#0F3D2E] bg-[#0F3D2E] text-white shadow'
                          : 'border-[#2B1B12]/15 bg-white/60 dark:bg-black/20 hover:border-[#0F3D2E]'
                      }`}
                    >
                      <Utensils className="w-4 h-4" />
                      <span className="text-xs font-semibold">{t('cart.dineIn')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setOrderType('pickup')}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                        orderType === 'pickup'
                          ? 'border-[#0F3D2E] bg-[#0F3D2E] text-white shadow'
                          : 'border-[#2B1B12]/15 bg-white/60 dark:bg-black/20 hover:border-[#0F3D2E]'
                      }`}
                    >
                      <Store className="w-4 h-4" />
                      <span className="text-xs font-semibold">{t('cart.pickup')}</span>
                    </button>
                  </div>
                </div>

                {/* Dine-In Table Picker */}
                {orderType === 'dine_in' && (
                  <div className="p-4 rounded-2xl bg-white/70 dark:bg-black/20 border border-[#2B1B12]/10 space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#0F3D2E] dark:text-[#E2B882]">
                      {t('cart.tableNumber')}
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={tableNo}
                        onChange={(e) => setTableNo(e.target.value)}
                        className="flex-1 p-2.5 rounded-xl border border-[#2B1B12]/20 dark:border-white/10 bg-white dark:bg-[#1C130D] text-sm font-semibold"
                      >
                        <option value="">Select Table...</option>
                        {Array.from({ length: siteConfig.tableCount }).map((_, i) => (
                          <option key={i + 1} value={String(i + 1)}>
                            Table {i + 1} ({i < 4 ? 'Solarium Sunroom' : i < 8 ? 'Main Lounge' : 'Terrace'})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Free delivery progress meter */}
                {orderType === 'delivery' && (
                  <div className="p-3 rounded-2xl bg-[#EADFCB] dark:bg-[#1C130D] border border-[#2B1B12]/10 space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span>Free Delivery at {formatPrice(siteConfig.freeDeliveryThreshold)}</span>
                      <span className="font-bold text-[#0F3D2E] dark:text-[#E2B882]">
                        {subtotal >= siteConfig.freeDeliveryThreshold
                          ? 'FREE DELIVERY UNLOCKED!'
                          : `${formatPrice(siteConfig.freeDeliveryThreshold - subtotal)} away`}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-black/10 overflow-hidden">
                      <div
                        className="h-full bg-[#0F3D2E] dark:bg-[#C48A4A] transition-all duration-300"
                        style={{
                          width: `${Math.min(100, (subtotal / siteConfig.freeDeliveryThreshold) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Cart Items List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#6B5E55] dark:text-[#C5B5A5]">
                      Selected Items
                    </span>
                    <button
                      type="button"
                      onClick={clearCart}
                      className="text-xs text-[#C0392B] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" /> Clear
                    </button>
                  </div>

                  {items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-white dark:bg-[#1C130D] border border-[#2B1B12]/8 dark:border-white/5 flex items-center justify-between gap-3 shadow-sm"
                    >
                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-sm text-[#2B1B12] dark:text-[#F6EFE3] truncate">
                          {language === 'ur' && item.nameUr ? item.nameUr : item.name}
                        </h5>
                        {item.selectedVariant && (
                          <p className="text-xs text-[#C48A4A] font-medium">
                            Style: {item.selectedVariant.name}
                          </p>
                        )}
                        {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                          <p className="text-[11px] text-[#6B5E55] dark:text-[#C5B5A5]">
                            +{item.selectedAddOns.map((a) => a.name).join(', ')}
                          </p>
                        )}
                        {item.notes && (
                          <p className="text-[11px] italic text-[#6B5E55]">
                            "{item.notes}"
                          </p>
                        )}
                        <span className="font-bold text-xs text-[#0F3D2E] dark:text-[#E2B882]">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <QuantityStepper
                          value={item.quantity}
                          onChange={(qty) => updateQuantity(idx, qty)}
                          size="sm"
                        />
                        <button
                          type="button"
                          onClick={() => removeItem(idx)}
                          className="p-1.5 text-gray-400 hover:text-[#C0392B] transition-colors"
                          aria-label="Remove item"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Customer Details Form */}
                <div className="p-4 rounded-2xl bg-white/70 dark:bg-black/20 border border-[#2B1B12]/10 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0F3D2E] dark:text-[#E2B882]">
                    Customer Information
                  </span>

                  <div>
                    <input
                      type="text"
                      placeholder={t('cart.customerName')}
                      value={customerName}
                      onChange={(e) => setCustomerInfo({ name: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#2B1B12]/20 dark:border-white/10 bg-white dark:bg-[#1C130D] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3D2E]"
                    />
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="tel"
                      placeholder="0300-1234567"
                      value={phone}
                      onChange={(e) => setCustomerInfo({ phone: e.target.value })}
                      className="flex-1 p-2.5 rounded-xl border border-[#2B1B12]/20 dark:border-white/10 bg-white dark:bg-[#1C130D] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3D2E]"
                    />
                    {orderType === 'delivery' && !isPhoneVerified(phone) && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handleSendOtp}
                      >
                        {otpSent ? 'Resend' : 'Send OTP'}
                      </Button>
                    )}
                  </div>

                  {/* OTP Verification Prompt */}
                  {showOtpField && (
                    <div className="p-3 rounded-xl bg-[#C48A4A]/10 border border-[#C48A4A]/30 space-y-2">
                      <p className="text-xs font-medium text-[#C48A4A]">
                        Enter 4-digit code sent to your phone (Demo code: <strong>1234</strong>)
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          maxLength={4}
                          placeholder="1234"
                          value={otpCodeInput}
                          onChange={(e) => setOtpCodeInput(e.target.value)}
                          className="w-28 p-2 rounded-lg border text-center font-mono font-bold text-sm tracking-widest bg-white dark:bg-[#1C130D]"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="caramel"
                          onClick={handleVerifyOtp}
                        >
                          Verify Phone
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Delivery Location & Map */}
                  {orderType === 'delivery' && (
                    <div className="space-y-2 pt-2">
                      <input
                        type="text"
                        placeholder="House / Street / Landmark in Faisalabad"
                        value={deliveryAddress}
                        onChange={(e) => setCustomerInfo({ address: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-[#2B1B12]/20 dark:border-white/10 bg-white dark:bg-[#1C130D] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3D2E]"
                      />
                      <MapPicker
                        onSelectLocation={(lat, lng, addr) => {
                          setCustomerInfo({
                            lat,
                            lng,
                            address: addr || deliveryAddress,
                          });
                        }}
                      />
                    </div>
                  )}

                  <textarea
                    rows={2}
                    placeholder="Kitchen instructions (e.g. extra sauce, gate bell rings twice)"
                    value={customerNotes}
                    onChange={(e) => setCustomerInfo({ notes: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#2B1B12]/20 dark:border-white/10 bg-white dark:bg-[#1C130D] text-xs focus:outline-none focus:ring-2 focus:ring-[#0F3D2E]"
                  />
                </div>

                {/* Promo Code & Gift Card Inputs */}
                <div className="space-y-3">
                  {/* Promo Input */}
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder={t('cart.promoPlaceholder')}
                        value={promoCodeInput}
                        onChange={(e) => setPromoCodeInput(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#2B1B12]/20 dark:border-white/10 bg-white dark:bg-[#1C130D] text-xs uppercase font-medium focus:outline-none focus:ring-2 focus:ring-[#0F3D2E]"
                      />
                      <Tag className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="caramel"
                      onClick={handleApplyPromo}
                    >
                      {t('cart.apply')}
                    </Button>
                  </div>
                  {promoError && <p className="text-xs text-[#C0392B]">{promoError}</p>}
                  {promoSuccess && <p className="text-xs text-[#2E7D32]">{promoSuccess}</p>}

                  {/* Gift Card Input */}
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder={t('cart.giftCardPlaceholder')}
                        value={giftCardInput}
                        onChange={(e) => setGiftCardInput(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#2B1B12]/20 dark:border-white/10 bg-white dark:bg-[#1C130D] text-xs uppercase font-medium focus:outline-none focus:ring-2 focus:ring-[#0F3D2E]"
                      />
                      <Gift className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={handleApplyGiftCard}
                    >
                      {t('cart.apply')}
                    </Button>
                  </div>
                  {giftCardError && <p className="text-xs text-[#C0392B]">{giftCardError}</p>}

                  {/* Loyalty Points Redemption (if logged in) */}
                  {user && user.loyaltyPoints > 0 && (
                    <div className="p-3 rounded-xl bg-[#2E7D32]/10 border border-[#2E7D32]/20 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Coins className="w-4 h-4 text-[#2E7D32]" />
                        <span className="text-xs font-medium">
                          You have {user.loyaltyPoints} points
                        </span>
                      </div>
                      {loyaltyPointsToRedeem > 0 ? (
                        <button
                          type="button"
                          onClick={() => setLoyaltyPointsToRedeem(0)}
                          className="text-xs text-[#C0392B] underline"
                        >
                          Cancel
                        </button>
                      ) : (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setLoyaltyPointsToRedeem(Math.min(user.loyaltyPoints, 200))}
                        >
                          Redeem Points
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="p-4 rounded-2xl bg-white/70 dark:bg-black/30 border border-[#2B1B12]/10 space-y-2 text-sm">
                  <div className="flex justify-between text-[#6B5E55] dark:text-[#C5B5A5]">
                    <span>{t('cart.subtotal')}</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>

                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-[#2E7D32] font-medium">
                      <span>{t('cart.promoDiscount')} ({promo?.code})</span>
                      <span>-{formatPrice(promoDiscount)}</span>
                    </div>
                  )}

                  {loyaltyDiscount > 0 && (
                    <div className="flex justify-between text-[#2E7D32] font-medium">
                      <span>{t('cart.loyaltyPoints')}</span>
                      <span>-{formatPrice(loyaltyDiscount)}</span>
                    </div>
                  )}

                  {orderType === 'delivery' && (
                    <div className="flex justify-between text-[#6B5E55] dark:text-[#C5B5A5]">
                      <span>{t('cart.deliveryFee')}</span>
                      <span>{deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}</span>
                    </div>
                  )}

                  {siteConfig.gstEnabled && (
                    <div className="flex justify-between text-[#6B5E55] dark:text-[#C5B5A5]">
                      <span>{t('cart.gst')}</span>
                      <span>{formatPrice(tax)}</span>
                    </div>
                  )}

                  {giftCardDiscount > 0 && (
                    <div className="flex justify-between text-[#C48A4A] font-medium">
                      <span>{t('cart.giftCard')}</span>
                      <span>-{formatPrice(giftCardDiscount)}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-[#2B1B12]/10 dark:border-white/10 flex justify-between font-bold text-lg text-[#0F3D2E] dark:text-[#E2B882]">
                    <span>{t('cart.total')}</span>
                    <span className="font-serif-display">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Error Banner */}
                {orderError && (
                  <div className="p-3 rounded-xl bg-[#C0392B]/10 border border-[#C0392B]/20 text-[#C0392B] text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{orderError}</span>
                  </div>
                )}
              </div>
            )}

            {/* Drawer Footer Actions */}
            {!confirmedOrderId && items.length > 0 && (
              <div className="p-5 border-t border-[#2B1B12]/10 dark:border-white/10 bg-white/50 dark:bg-black/20 space-y-3">
                <Button
                  variant="caramel"
                  size="lg"
                  className="w-full text-base font-bold shadow-caramel"
                  isLoading={isSubmitting}
                  onClick={handleSubmitOrder}
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  {t('cart.placeOrder')} · {formatPrice(total)}
                </Button>

                <p className="text-[11px] text-center text-[#6B5E55] dark:text-[#C5B5A5]">
                  {orderType === 'delivery' ? t('cart.cashOnDelivery') : t('cart.payAtCounter')}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

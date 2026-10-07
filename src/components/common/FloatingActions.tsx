import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { MessageCircle, Phone, BellRing, CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const FloatingActions: React.FC = () => {
  const { siteConfig, createStaffCall } = useData();
  const { isCartOpen, tableNo } = useCart();
  const { language } = useLanguage();

  const [showStaffModal, setShowStaffModal] = useState(false);
  const [callStatusMessage, setCallStatusMessage] = useState<string | null>(null);

  if (isCartOpen) return null;

  const encodedMsg = encodeURIComponent(
    language === 'ur'
      ? 'السلام علیکم کیفے الیگانزا! میں آرڈر یا مینو کے بارے میں معلومات چاہتا ہوں۔'
      : 'Hello Cafe Eleganza! I would like to inquire about your menu & artisan coffee.'
  );

  const whatsappUrl = siteConfig.whatsappNumber
    ? `https://wa.me/${siteConfig.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodedMsg}`
    : null;

  const handleStaffCall = (type: 'call_waiter' | 'request_bill') => {
    const tableNum = tableNo || '4';
    createStaffCall(tableNum, type);
    setCallStatusMessage(
      type === 'call_waiter'
        ? `Waiter notified for Table ${tableNum}! Staff is on the way.`
        : `Bill requested for Table ${tableNum}! Staff will bring your receipt.`
    );
    setTimeout(() => {
      setShowStaffModal(false);
      setCallStatusMessage(null);
    }, 2800);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-30 flex flex-col items-end gap-3 select-none">
        {/* Table Assistance button (If on table or table specified) */}
        {tableNo && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            type="button"
            onClick={() => setShowStaffModal(true)}
            className="px-4 py-2.5 rounded-full bg-[#0F3D2E] text-white shadow-forest flex items-center gap-2 border border-[#C48A4A] cursor-pointer text-xs font-bold"
          >
            <BellRing className="w-4 h-4 text-[#E2B882] animate-bounce" />
            <span>Table {tableNo} Staff Call</span>
          </motion.button>
        )}

        {/* WhatsApp Direct Chat Button */}
        {whatsappUrl && (
          <motion.a
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="w-12 h-12 rounded-full bg-[#25D366] text-white shadow-lg flex items-center justify-center hover:bg-[#20BA5A] transition-colors"
          >
            <MessageCircle className="w-6 h-6" />
          </motion.a>
        )}

        {/* Phone Call Button */}
        {siteConfig.phone && (
          <motion.a
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            href={`tel:${siteConfig.phone}`}
            aria-label="Call Cafe"
            className="w-12 h-12 rounded-full bg-[#C48A4A] text-white shadow-caramel flex items-center justify-center hover:bg-[#B37939] transition-colors"
          >
            <Phone className="w-5 h-5" />
          </motion.a>
        )}
      </div>

      {/* Staff Call Modal */}
      <AnimatePresence>
        {showStaffModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm rounded-3xl bg-[#F6EFE3] dark:bg-[#0A2A20] p-6 shadow-2xl border border-[#2B1B12]/10 space-y-4 text-center text-[#2B1B12] dark:text-[#F6EFE3]"
            >
              <div className="flex justify-between items-center">
                <span className="font-serif-display font-bold text-lg text-[#0F3D2E] dark:text-[#E2B882]">
                  Table {tableNo || '4'} Service
                </span>
                <button
                  type="button"
                  onClick={() => setShowStaffModal(false)}
                  className="p-1 rounded-full text-gray-400 hover:text-black"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {callStatusMessage ? (
                <div className="py-6 space-y-2 text-[#2E7D32]">
                  <CheckCircle2 className="w-12 h-12 mx-auto animate-pulse" />
                  <p className="text-sm font-semibold">{callStatusMessage}</p>
                </div>
              ) : (
                <div className="space-y-3 pt-2">
                  <p className="text-xs text-[#6B5E55] dark:text-[#C5B5A5]">
                    Need table assistance or ready for your check? Tap below to notify our staff tablet instantly.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleStaffCall('call_waiter')}
                    className="w-full py-3 rounded-2xl bg-[#0F3D2E] hover:bg-[#0A2A20] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <BellRing className="w-4 h-4 text-[#E2B882]" />
                    Call Waiter to Table
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStaffCall('request_bill')}
                    className="w-full py-3 rounded-2xl bg-[#C48A4A] hover:bg-[#B37939] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    Request Bill / Cashout
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

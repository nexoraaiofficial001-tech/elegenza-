import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { Button } from '../components/ui/Button';
import { Gift, CheckCircle2, Sparkles, Search } from 'lucide-react';

export const GiftCardsPage: React.FC = () => {
  const { language, t, formatPrice } = useLanguage();
  const { validateGiftCard } = useData();

  // Balance Check State
  const [checkCode, setCheckCode] = useState<string>('');
  const [balanceResult, setBalanceResult] = useState<{ checked: boolean; balance?: number; message?: string }>({
    checked: false,
  });

  // Request Gift Card State
  const [purchaserName, setPurchaserName] = useState<string>('');
  const [purchaserPhone, setPurchaserPhone] = useState<string>('');
  const [recipientName, setRecipientName] = useState<string>('');
  const [amount, setAmount] = useState<number>(3000);
  const [message, setMessage] = useState<string>('');
  const [requested, setRequested] = useState<boolean>(false);

  const handleCheckBalance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkCode.trim()) return;
    const res = validateGiftCard(checkCode);
    if (res.valid && res.card) {
      setBalanceResult({ checked: true, balance: res.card.balance });
    } else {
      setBalanceResult({ checked: true, message: res.message || 'Gift card not found or inactive.' });
    }
  };

  const handleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!purchaserName.trim() || !purchaserPhone.trim()) return;
    setRequested(true);
  };

  return (
    <div className="w-full pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C48A4A]">
          Eleganza Experiences
        </span>
        <h1 className="font-serif-display font-bold text-4xl sm:text-5xl text-[#0F3D2E] dark:text-[#F6EFE3]">
          Gift Cards & Moments
        </h1>
        <p className="text-sm text-[#6B5E55] dark:text-[#C5B5A5]">
          Treat your loved ones to an unhurried afternoon of artisan coffee, handcrafted coolers, and gourmet dining.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Card 1: Balance Checker */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0A2A20] border border-[#2B1B12]/10 space-y-5 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0F3D2E]/10 text-[#0F3D2E] dark:text-[#E2B882] flex items-center justify-center">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-display font-bold text-xl text-[#0F3D2E] dark:text-[#F6EFE3]">
                Check Card Balance
              </h3>
              <p className="text-xs text-[#6B5E55] dark:text-[#C5B5A5]">
                Already hold an Eleganza digital card code?
              </p>
            </div>
          </div>

          <form onSubmit={handleCheckBalance} className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. ELEGANZA-GIFT-5000"
                value={checkCode}
                onChange={(e) => setCheckCode(e.target.value)}
                className="flex-1 p-3 rounded-2xl border font-mono font-bold text-xs uppercase bg-white dark:bg-[#1C130D]"
              />
              <Button type="submit" variant="caramel">
                Check
              </Button>
            </div>

            {balanceResult.checked && (
              <div
                className={`p-4 rounded-2xl text-xs font-semibold ${
                  balanceResult.balance !== undefined
                    ? 'bg-[#2E7D32]/10 text-[#2E7D32] border border-[#2E7D32]/20'
                    : 'bg-[#C0392B]/10 text-[#C0392B] border border-[#C0392B]/20'
                }`}
              >
                {balanceResult.balance !== undefined
                  ? `Active Balance: ${formatPrice(balanceResult.balance)}`
                  : balanceResult.message}
              </div>
            )}
          </form>

          {/* Luxury Gift Card Mockup Graphic */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0F3D2E] to-[#0A2A20] text-[#F6EFE3] border border-[#C48A4A]/40 space-y-6 shadow-caramel-sm relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-serif-display font-bold text-lg text-white tracking-widest">
                  CAFE ELEGANZA
                </span>
                <span className="block text-[10px] text-[#C48A4A] tracking-wider uppercase">
                  VIP Gift Pass
                </span>
              </div>
              <Sparkles className="w-5 h-5 text-[#E2B882]" />
            </div>

            <div className="font-mono text-sm tracking-widest text-[#E2B882]">
              •••• •••• •••• 5000
            </div>

            <div className="flex justify-between items-end text-xs text-white/70">
              <span>Valid at Solarium Faisalabad & Online</span>
              <span className="font-bold text-white">PKR 3,000 – 10,000</span>
            </div>
          </div>
        </div>

        {/* Card 2: Request a New Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#EADFCB] dark:bg-[#1C130D] border border-[#2B1B12]/10 space-y-5 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#C48A4A]/20 text-[#C48A4A] flex items-center justify-center">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-display font-bold text-xl text-[#0F3D2E] dark:text-[#F6EFE3]">
                Order a Digital Gift Card
              </h3>
              <p className="text-xs text-[#6B5E55] dark:text-[#C5B5A5]">
                Our concierge will prepare and send a customized digital voucher via WhatsApp / SMS.
              </p>
            </div>
          </div>

          {requested ? (
            <div className="p-6 rounded-2xl bg-[#2E7D32]/15 text-[#2E7D32] text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 mx-auto" />
              <h4 className="font-bold text-base">Request Submitted!</h4>
              <p className="text-xs">
                Our team will contact you at {purchaserPhone} to confirm and issue your recipient's digital card code.
              </p>
            </div>
          ) : (
            <form onSubmit={handleRequest} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#6B5E55] dark:text-[#C5B5A5] block mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Sender name"
                    value={purchaserName}
                    onChange={(e) => setPurchaserName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border bg-white dark:bg-[#0A2A20] text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#6B5E55] dark:text-[#C5B5A5] block mb-1">
                    Phone (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0300-1234567"
                    value={purchaserPhone}
                    onChange={(e) => setPurchaserPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border bg-white dark:bg-[#0A2A20] text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#6B5E55] dark:text-[#C5B5A5] block mb-1">
                    Recipient Name
                  </label>
                  <input
                    type="text"
                    placeholder="Recipient's name"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border bg-white dark:bg-[#0A2A20] text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#6B5E55] dark:text-[#C5B5A5] block mb-1">
                    Denomination
                  </label>
                  <select
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border bg-white dark:bg-[#0A2A20] text-xs font-bold"
                  >
                    <option value={2000}>Rs 2,000</option>
                    <option value={3000}>Rs 3,000</option>
                    <option value={5000}>Rs 5,000</option>
                    <option value={8000}>Rs 8,000</option>
                    <option value={10000}>Rs 10,000</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#6B5E55] dark:text-[#C5B5A5] block mb-1">
                  Personal Greeting Message
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Happy Birthday! Enjoy the best lattes in town on me."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-2.5 rounded-xl border bg-white dark:bg-[#0A2A20] text-xs"
                />
              </div>

              <Button type="submit" variant="caramel" className="w-full font-bold">
                Submit Gift Card Request
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

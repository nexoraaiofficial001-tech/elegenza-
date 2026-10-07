import React from 'react';
import { useData } from '../context/DataContext';

export const TermsPage: React.FC = () => {
  const { siteConfig } = useData();
  return (
    <div className="w-full pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6 text-[#2B1B12] dark:text-[#F6EFE3]">
      <h1 className="font-serif-display font-bold text-3xl sm:text-4xl text-[#0F3D2E] dark:text-[#E2B882]">
        Terms & Conditions
      </h1>
      <p className="text-xs text-[#6B5E55] dark:text-[#C5B5A5]">Effective Date: January 1, 2026</p>
      <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[#6B5E55] dark:text-[#C5B5A5]">
        <p>
          Welcome to {siteConfig.brandName} ({siteConfig.legalBusinessName}). By accessing our digital ordering platform, QR table service, or dining in our solarium conservatory at {siteConfig.address}, you agree to comply with and be bound by the following terms.
        </p>
        <h3 className="font-bold text-base text-[#2B1B12] dark:text-[#F6EFE3]">1. Orders & Pricing</h3>
        <p>
          All prices are quoted in Pakistani Rupees (PKR) and inclusive of applicable provincial sales taxes (GST {siteConfig.gstRate}%) unless stated otherwise. Menu item availability and vintage coffee roasts are subject to daily change without prior notice.
        </p>
        <h3 className="font-bold text-base text-[#2B1B12] dark:text-[#F6EFE3]">2. Delivery & Dispatch</h3>
        <p>
          Delivery zones cover designated areas of Faisalabad including Raza Town, West Canal Road, and Green Avenue. Minimum order thresholds apply. While our riders strive to achieve estimated delivery windows, adverse weather or traffic may impact ETA.
        </p>
        <h3 className="font-bold text-base text-[#2B1B12] dark:text-[#F6EFE3]">3. Table Reservations</h3>
        <p>
          Reservations are held for up to 15 minutes past the reserved time slot before being released to walk-in patrons during peak evening hours.
        </p>
      </div>
    </div>
  );
};

export const PrivacyPage: React.FC = () => {
  const { siteConfig } = useData();
  return (
    <div className="w-full pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6 text-[#2B1B12] dark:text-[#F6EFE3]">
      <h1 className="font-serif-display font-bold text-3xl sm:text-4xl text-[#0F3D2E] dark:text-[#E2B882]">
        Privacy Policy
      </h1>
      <p className="text-xs text-[#6B5E55] dark:text-[#C5B5A5]">Effective Date: January 1, 2026</p>
      <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[#6B5E55] dark:text-[#C5B5A5]">
        <p>
          {siteConfig.legalBusinessName} respects the privacy of our patrons. We only collect details essential for order preparation, delivery dispatch, and reservation confirmations (such as phone number and delivery location).
        </p>
        <h3 className="font-bold text-base text-[#2B1B12] dark:text-[#F6EFE3]">Data Storage & Security</h3>
        <p>
          Patron data is securely encrypted. We do not sell or monetize personal contact numbers. Communication via WhatsApp and SMS is strictly limited to transaction updates and optional seasonal newsletter dispatches.
        </p>
      </div>
    </div>
  );
};

export const RefundPolicyPage: React.FC = () => {
  const { siteConfig } = useData();
  return (
    <div className="w-full pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6 text-[#2B1B12] dark:text-[#F6EFE3]">
      <h1 className="font-serif-display font-bold text-3xl sm:text-4xl text-[#0F3D2E] dark:text-[#E2B882]">
        Cancellation & Refund Policy
      </h1>
      <p className="text-xs text-[#6B5E55] dark:text-[#C5B5A5]">Effective Date: January 1, 2026</p>
      <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[#6B5E55] dark:text-[#C5B5A5]">
        <p>
          Patrons may cancel delivery orders within {siteConfig.orderCancelWindowMinutes} minutes of placement while the status remains "Pending". Once dishes enter wood-fire preparation, cancellation requires manager authorization.
        </p>
        <h3 className="font-bold text-base text-[#2B1B12] dark:text-[#F6EFE3]">Damaged or Incomplete Orders</h3>
        <p>
          In the rare event of an incorrect or compromised dispatch, contact our manager immediately at {siteConfig.phone} or via WhatsApp at {siteConfig.whatsappNumber} for prompt replacement or credit.
        </p>
      </div>
    </div>
  );
};

export const ContactPage: React.FC = () => {
  const { siteConfig } = useData();
  const [sent, setSent] = React.useState(false);

  return (
    <div className="w-full pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="font-serif-display font-bold text-4xl text-[#0F3D2E] dark:text-[#F6EFE3]">
          Contact & Location
        </h1>
        <p className="text-xs sm:text-sm text-[#6B5E55] dark:text-[#C5B5A5]">
          Visit our solarium sanctuary or reach out for catering inquiries and private conservatory events.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0A2A20] border border-[#2B1B12]/10 space-y-4">
          <h3 className="font-serif-display font-bold text-xl text-[#0F3D2E] dark:text-[#E2B882]">
            Visiting Address
          </h3>
          <p className="text-xs sm:text-sm text-[#6B5E55] dark:text-[#C5B5A5]">
            {siteConfig.address}
          </p>
          <div className="space-y-1 text-xs">
            <p><strong>Phone:</strong> {siteConfig.phone}</p>
            <p><strong>WhatsApp:</strong> {siteConfig.whatsappNumber}</p>
            <p><strong>Email:</strong> {siteConfig.email}</p>
            <p><strong>Hours:</strong> Open daily 11:00 AM – 12:00 AM (midnight)</p>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#0A2A20] border border-[#2B1B12]/10 space-y-4">
          <h3 className="font-serif-display font-bold text-xl text-[#0F3D2E] dark:text-[#E2B882]">
            Send an Inquiry
          </h3>
          {sent ? (
            <div className="p-4 rounded-2xl bg-[#2E7D32]/15 text-[#2E7D32] text-xs font-bold">
              Thank you! Your message has been sent to our management team.
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="space-y-3 text-xs"
            >
              <input
                type="text"
                required
                placeholder="Your Full Name"
                className="w-full p-2.5 rounded-xl border bg-[#F6EFE3] dark:bg-[#1C130D]"
              />
              <input
                type="tel"
                required
                placeholder="Mobile Number"
                className="w-full p-2.5 rounded-xl border bg-[#F6EFE3] dark:bg-[#1C130D]"
              />
              <textarea
                rows={3}
                required
                placeholder="How can we assist you?"
                className="w-full p-2.5 rounded-xl border bg-[#F6EFE3] dark:bg-[#1C130D]"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#0F3D2E] text-white font-bold cursor-pointer hover:bg-[#0A2A20]"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

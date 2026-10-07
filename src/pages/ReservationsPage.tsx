import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Calendar, Clock, Users, Sparkles, CheckCircle2, Download } from 'lucide-react';

export const ReservationsPage: React.FC = () => {
  const { language, t, isRtl } = useLanguage();
  const { createReservation, reservations, siteConfig } = useData();
  const { user } = useAuth();

  const todayStr = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 60);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  const [date, setDate] = useState<string>(todayStr);
  const [time, setTime] = useState<string>('19:00');
  const [guests, setGuests] = useState<number>(2);
  const [customerName, setCustomerName] = useState<string>(user?.name || '');
  const [phone, setPhone] = useState<string>(user?.phone || '');
  const [email, setEmail] = useState<string>(user?.email || '');
  const [occasion, setOccasion] = useState<string>('Casual Visit');
  const [notes, setNotes] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedReservationCode, setConfirmedReservationCode] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  // Generate 30-min time slots from 11:00 AM to 11:30 PM
  const timeSlots = [
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
    '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!customerName.trim() || !phone.trim()) {
      setError('Please provide your name and phone number.');
      return;
    }

    // Check capacity for date & time slot
    const existingForSlot = reservations.filter(
      (r) => r.date === date && r.time === time && r.status !== 'cancelled'
    );
    const currentGuests = existingForSlot.reduce((sum, r) => sum + r.guests, 0);
    if (currentGuests + guests > siteConfig.slotCapacity) {
      setError(`This time slot is fully booked (capacity ${siteConfig.slotCapacity} guests). Please select an adjacent 30-min window.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createReservation({
        customerName,
        phone,
        email: email || undefined,
        date,
        time,
        guests,
        occasion,
        notes,
        language: language === 'ur' ? 'ur' : 'en',
      });
      setConfirmedReservationCode(res.reservationCode);
    } catch (err: any) {
      setError(err.message || 'Failed to reserve table. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to generate .ics file
  const downloadIcs = () => {
    const startIso = `${date.replace(/-/g, '')}T${time.replace(':', '')}00`;
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Cafe Eleganza//Table Reservation//EN',
      'BEGIN:VEVENT',
      `SUMMARY:Table Reservation - Cafe Eleganza (${guests} guests)`,
      `DESCRIPTION:Table reserved at Cafe Eleganza Solarium (Green Avenue, W Canal Rd, Faisalabad). Ref: ${confirmedReservationCode}`,
      `LOCATION:${siteConfig.address}`,
      `DTSTART:${startIso}`,
      `DTEND:${startIso}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `eleganza-reservation-${confirmedReservationCode}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C48A4A]">
          Table Booking & Solarium Seating
        </span>
        <h1 className="font-serif-display font-bold text-4xl sm:text-5xl text-[#0F3D2E] dark:text-[#F6EFE3]">
          {t('reservations.title')}
        </h1>
        <p className="text-sm text-[#6B5E55] dark:text-[#C5B5A5]">
          {t('reservations.subtitle')}
        </p>
      </div>

      {confirmedReservationCode ? (
        /* Confirmed State */
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#0A2A20] border border-[#2B1B12]/10 text-center space-y-6 shadow-xl">
          <div className="w-20 h-20 rounded-full bg-[#2E7D32]/10 text-[#2E7D32] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <h3 className="font-serif-display font-bold text-3xl text-[#0F3D2E] dark:text-[#E2B882]">
              Table Confirmed!
            </h3>
            <p className="text-sm text-[#6B5E55] dark:text-[#C5B5A5]">
              We have reserved your conservatory table for <strong>{guests} guests</strong> on <strong>{date}</strong> at <strong>{time}</strong>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F6EFE3] dark:bg-[#1C130D] border border-[#C48A4A]/30 max-w-md mx-auto">
            <span className="text-xs text-[#6B5E55] block">Reservation Reference Code:</span>
            <span className="font-mono font-bold text-xl text-[#0F3D2E] dark:text-[#E2B882]">
              {confirmedReservationCode}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Button
              variant="caramel"
              onClick={downloadIcs}
              leftIcon={<Download className="w-4 h-4" />}
            >
              Add to Calendar (.ics)
            </Button>
            <Button
              variant="outline"
              onClick={() => setConfirmedReservationCode(null)}
            >
              Book Another Table
            </Button>
          </div>
        </div>
      ) : (
        /* Booking Form */
        <form
          onSubmit={handleSubmit}
          className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#0A2A20] border border-[#2B1B12]/10 space-y-6 shadow-xl"
        >
          {error && (
            <div className="p-4 rounded-2xl bg-[#C0392B]/10 border border-[#C0392B]/20 text-[#C0392B] text-xs font-semibold">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Date */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#0F3D2E] dark:text-[#E2B882] flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#C48A4A]" />
                {t('reservations.date')}
              </label>
              <input
                type="date"
                required
                min={todayStr}
                max={maxDateStr}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 rounded-2xl border border-[#2B1B12]/15 dark:border-white/10 bg-white dark:bg-[#1C130D] text-sm font-semibold"
              />
            </div>

            {/* Time Slot */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#0F3D2E] dark:text-[#E2B882] flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#C48A4A]" />
                {t('reservations.time')}
              </label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-3 rounded-2xl border border-[#2B1B12]/15 dark:border-white/10 bg-white dark:bg-[#1C130D] text-sm font-semibold"
              >
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>

            {/* Guests */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#0F3D2E] dark:text-[#E2B882] flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#C48A4A]" />
                {t('reservations.guests')}
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full p-3 rounded-2xl border border-[#2B1B12]/15 dark:border-white/10 bg-white dark:bg-[#1C130D] text-sm font-semibold"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => (
                  <option key={g} value={g}>
                    {g} {g === 1 ? 'Guest' : 'Guests'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#6B5E55] dark:text-[#C5B5A5] block mb-1.5">
                {t('reservations.name')} *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Tariq Mehmood"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full p-3 rounded-2xl border border-[#2B1B12]/15 dark:border-white/10 bg-white dark:bg-[#1C130D] text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#6B5E55] dark:text-[#C5B5A5] block mb-1.5">
                {t('reservations.phone')} *
              </label>
              <input
                type="tel"
                required
                placeholder="0300-1234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 rounded-2xl border border-[#2B1B12]/15 dark:border-white/10 bg-white dark:bg-[#1C130D] text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#6B5E55] dark:text-[#C5B5A5] block mb-1.5">
                {t('reservations.email')}
              </label>
              <input
                type="email"
                placeholder="tariq@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-2xl border border-[#2B1B12]/15 dark:border-white/10 bg-white dark:bg-[#1C130D] text-sm"
              />
            </div>
          </div>

          {/* Occasion & Preferences */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#6B5E55] dark:text-[#C5B5A5] block mb-1.5">
                Occasion
              </label>
              <select
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="w-full p-3 rounded-2xl border border-[#2B1B12]/15 dark:border-white/10 bg-white dark:bg-[#1C130D] text-sm"
              >
                <option value="Casual Visit">Casual Visit</option>
                <option value="Birthday Celebration">Birthday Celebration</option>
                <option value="Anniversary Dinner">Anniversary Dinner</option>
                <option value="Business Meeting">Business Meeting</option>
                <option value="Family Gathering">Family Gathering</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#6B5E55] dark:text-[#C5B5A5] block mb-1.5">
                {t('reservations.notes')}
              </label>
              <input
                type="text"
                placeholder="Corner glass table, high chair for infant, etc."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 rounded-2xl border border-[#2B1B12]/15 dark:border-white/10 bg-white dark:bg-[#1C130D] text-sm"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="caramel"
            size="lg"
            isLoading={isSubmitting}
            className="w-full shadow-caramel text-base font-bold"
          >
            {t('reservations.submit')}
          </Button>
        </form>
      )}
    </div>
  );
};

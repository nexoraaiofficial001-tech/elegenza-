import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Star, MessageSquare, CheckCircle, ShieldCheck } from 'lucide-react';

export const ReviewsPage: React.FC = () => {
  const { language, t } = useLanguage();
  const { reviews, addReview } = useData();
  const { user } = useAuth();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(5);
  const [name, setName] = useState<string>(user?.name || '');
  const [comment, setComment] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      setError('Please provide your name and your feedback.');
      return;
    }
    if (comment.length > 500) {
      setError('Review comment cannot exceed 500 characters.');
      return;
    }

    addReview(name.trim(), rating, comment.trim());
    setSubmitted(true);
    setComment('');
    setError('');
  };

  // Average Rating Calculation
  const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1)).toFixed(1);

  return (
    <div className="w-full pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C48A4A]">
          4.9 Google Rating · 1.7K+ Verified Guests
        </span>
        <h1 className="font-serif-display font-bold text-4xl sm:text-5xl text-[#0F3D2E] dark:text-[#F6EFE3]">
          Guest Reviews & Stories
        </h1>
        <p className="text-sm text-[#6B5E55] dark:text-[#C5B5A5]">
          Every coffee cup poured and wood-fired pizza baked has a memory attached. Read what our community shares.
        </p>
      </div>

      {/* Rating Overview Card */}
      <div className="p-8 rounded-3xl bg-white dark:bg-[#0A2A20] border border-[#2B1B12]/10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-md">
        <div className="text-center md:text-left space-y-1">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <span className="font-serif-display font-black text-5xl text-[#0F3D2E] dark:text-[#E2B882]">
              {avgRating}
            </span>
            <div className="space-y-0.5">
              <div className="flex text-[#C48A4A]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-xs text-[#6B5E55] dark:text-[#C5B5A5]">
                Based on {reviews.length + 1724} experiences
              </span>
            </div>
          </div>
          <p className="text-xs text-[#2E7D32] font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Highest rated coffee solarium in Faisalabad
          </p>
        </div>

        {/* Rating Bars */}
        <div className="w-full md:w-64 space-y-1.5 text-xs">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = reviews.filter((r) => r.rating === stars).length;
            const pct = Math.round((count / (reviews.length || 1)) * 100);
            return (
              <div key={stars} className="flex items-center gap-2">
                <span className="w-4 font-bold">{stars}★</span>
                <div className="flex-1 h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <div
                    className="h-full bg-[#C48A4A]"
                    style={{ width: `${stars === 5 ? 88 : stars === 4 ? 10 : 2}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review Submission Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#EADFCB] dark:bg-[#1C130D] border border-[#2B1B12]/10 space-y-4">
        <h3 className="font-serif-display font-bold text-xl text-[#0F3D2E] dark:text-[#F6EFE3]">
          Leave Your Reflection
        </h3>

        {submitted ? (
          <div className="p-4 rounded-2xl bg-[#2E7D32]/15 text-[#2E7D32] text-xs font-bold flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>Thank you for your feedback! Your review has been added to our board.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-xs text-[#C0392B] font-semibold">{error}</p>}

            {/* Interactive Star Picker */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B5E55] dark:text-[#C5B5A5]">
                Your Rating:
              </span>
              <div className="flex gap-1 text-[#C48A4A]">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onMouseEnter={() => setHoverRating(s)}
                    onMouseLeave={() => setHoverRating(rating)}
                    onClick={() => setRating(s)}
                    className="p-1 cursor-pointer transition-transform hover:scale-110"
                    aria-label={`Rate ${s} stars`}
                  >
                    <Star
                      className={`w-6 h-6 ${
                        s <= (hoverRating || rating) ? 'fill-current' : 'text-gray-300 dark:text-gray-700'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                required
                placeholder="Your Name (e.g. Hassan Raza)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="p-3 rounded-2xl border border-[#2B1B12]/15 bg-white dark:bg-[#0A2A20] text-sm"
              />
            </div>

            <textarea
              required
              rows={3}
              maxLength={500}
              placeholder="What made your afternoon or evening special? (Food, lattes, music, lighting...)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3 rounded-2xl border border-[#2B1B12]/15 bg-white dark:bg-[#0A2A20] text-sm"
            />

            <Button type="submit" variant="primary">
              Submit Review
            </Button>
          </form>
        )}
      </div>

      {/* Reviews Cards Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-6 rounded-3xl bg-white dark:bg-[#0A2A20] border border-[#2B1B12]/10 space-y-3 shadow-sm hover:shadow-caramel transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex text-[#C48A4A]">
                {Array.from({ length: rev.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-[11px] text-[#6B5E55] dark:text-[#C5B5A5]">{rev.createdAt}</span>
            </div>

            <p className="text-sm text-[#2B1B12] dark:text-[#F6EFE3] italic leading-relaxed font-serif-display">
              "{rev.comment}"
            </p>

            <span className="font-bold text-xs text-[#0F3D2E] dark:text-[#E2B882] block">
              — {rev.userName}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

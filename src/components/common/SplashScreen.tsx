import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Dismiss after 1.5s
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 400);
    }, 1500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ y: '-100%', opacity: 0.9 }}
          transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-50 bg-[#0F3D2E] text-[#F6EFE3] flex flex-col items-center justify-center select-none"
        >
          {/* Animated SVG Coffee Cup with rising steam */}
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* Steam curves */}
            <motion.svg
              viewBox="0 0 60 40"
              className="absolute -top-6 w-16 h-10 text-[#C48A4A]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <motion.path
                d="M15 35 C10 25, 20 15, 15 5"
                initial={{ pathLength: 0, opacity: 0, y: 10 }}
                animate={{ pathLength: 1, opacity: [0, 0.8, 0], y: -8 }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.path
                d="M30 35 C25 22, 35 15, 30 5"
                initial={{ pathLength: 0, opacity: 0, y: 10 }}
                animate={{ pathLength: 1, opacity: [0, 0.9, 0], y: -8 }}
                transition={{ duration: 1.4, repeat: Infinity, delay: 0.3, ease: 'easeInOut' }}
              />
              <motion.path
                d="M45 35 C40 25, 50 15, 45 5"
                initial={{ pathLength: 0, opacity: 0, y: 10 }}
                animate={{ pathLength: 1, opacity: [0, 0.8, 0], y: -8 }}
                transition={{ duration: 1.4, repeat: Infinity, delay: 0.6, ease: 'easeInOut' }}
              />
            </motion.svg>

            {/* Cup drawing */}
            <svg
              viewBox="0 0 100 80"
              className="w-24 h-20 text-[#F6EFE3]"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Cup bowl */}
              <motion.path
                d="M20 15 H80 C80 50, 70 65, 50 65 C30 65, 20 50, 20 15 Z"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
              />
              {/* Cup handle */}
              <motion.path
                d="M80 25 C92 25, 92 45, 80 50"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: 'easeInOut' }}
              />
              {/* Saucer */}
              <motion.path
                d="M10 72 Q50 78 90 72"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.7, delay: 0.4, ease: 'easeInOut' }}
              />
            </svg>
          </div>

          {/* Staggered Eleganza Title */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mt-4 space-y-1"
          >
            <h1 className="font-serif-display font-bold text-3xl tracking-widest text-[#F6EFE3]">
              ELEGANZA
            </h1>
            <p className="text-[11px] uppercase tracking-widest text-[#C48A4A] font-semibold">
              Solarium · Faisalabad
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

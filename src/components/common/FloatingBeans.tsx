import React from 'react';
import { motion } from 'motion/react';

export const FloatingBeans: React.FC = () => {
  // 14 carefully tuned floating coffee beans with distinct scales, rotations, and sine delays
  const beans = [
    { id: 1, top: '15%', left: '8%', size: 28, delay: 0, duration: 8, rotate: 25 },
    { id: 2, top: '28%', left: '18%', size: 22, delay: 1.2, duration: 9.5, rotate: -40 },
    { id: 3, top: '65%', left: '12%', size: 32, delay: 2.5, duration: 7, rotate: 65 },
    { id: 4, top: '80%', left: '22%', size: 24, delay: 0.8, duration: 11, rotate: 15 },
    { id: 5, top: '18%', right: '10%', size: 30, delay: 1.8, duration: 8.5, rotate: -30 },
    { id: 6, top: '35%', right: '16%', size: 20, delay: 3.1, duration: 10, rotate: 50 },
    { id: 7, top: '68%', right: '8%', size: 34, delay: 0.5, duration: 9, rotate: -20 },
    { id: 8, top: '82%', right: '20%', size: 22, delay: 2.2, duration: 7.5, rotate: 80 },
    { id: 9, top: '10%', left: '42%', size: 18, delay: 4.0, duration: 12, rotate: -15 },
    { id: 10, top: '88%', left: '48%', size: 26, delay: 1.5, duration: 8.8, rotate: 35 },
    { id: 11, top: '48%', left: '5%', size: 24, delay: 2.0, duration: 9.2, rotate: -55 },
    { id: 12, top: '52%', right: '6%', size: 26, delay: 3.4, duration: 10.5, rotate: 45 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {beans.map((b) => (
        <motion.div
          key={b.id}
          style={{
            position: 'absolute',
            top: b.top,
            left: b.left,
            right: (b as any).right,
            width: b.size,
            height: b.size * 1.35,
          }}
          animate={{
            y: [0, -18, 0, 14, 0],
            x: [0, 8, 0, -8, 0],
            rotate: [b.rotate, b.rotate + 18, b.rotate - 14, b.rotate],
          }}
          transition={{
            duration: b.duration,
            repeat: Infinity,
            delay: b.delay,
            ease: 'easeInOut',
          }}
          className="opacity-40 hover:opacity-75 transition-opacity"
        >
          {/* Handcrafted Coffee Bean SVG */}
          <svg viewBox="0 0 40 54" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full filter drop-shadow">
            <path
              d="M20 2C9 2 2 13 2 27C2 41 9 52 20 52C31 52 38 41 38 27C38 13 31 2 20 2Z"
              fill="#3A2316"
              stroke="#593722"
              strokeWidth="1.5"
            />
            {/* Curved Bean Crease */}
            <path
              d="M20 6C16 16 26 24 18 34C14 40 22 46 20 48"
              stroke="#C48A4A"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

export const RotatingBadge: React.FC = () => {
  return (
    <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
      {/* Outer rotating ring with circular text */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <path
              id="circlePath"
              d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
            />
          </defs>
          <text fontSize="8.5" fontWeight="600" fill="#C48A4A" letterSpacing="2.5">
            <textPath href="#circlePath" startOffset="0%">
              ORDER NOW • FRESHLY BREWED • SOLARIUM •
            </textPath>
          </text>
        </svg>
      </motion.div>

      {/* Center Coffee Spark Stamp */}
      <div className="w-12 h-12 rounded-full bg-[#0F3D2E] text-[#F6EFE3] flex items-center justify-center shadow-lg border-2 border-[#C48A4A]">
        <span className="text-xl">☕</span>
      </div>
    </div>
  );
};

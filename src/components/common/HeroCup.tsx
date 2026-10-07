import React from 'react';
import { motion } from 'motion/react';

interface HeroCupProps {
  imageOverride?: string;
}

export const HeroCup: React.FC<HeroCupProps> = ({ imageOverride }) => {
  return (
    <div className="relative w-full max-w-[340px] sm:max-w-[420px] aspect-[4/5] flex items-center justify-center select-none">
      {/* Dynamic inverse shadow below cup */}
      <motion.div
        animate={{
          scale: [1, 0.85, 1],
          opacity: [0.35, 0.2, 0.35],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -bottom-4 w-48 sm:w-60 h-8 bg-[#2B1B12] rounded-full blur-xl pointer-events-none"
      />

      {/* Floating cup container */}
      <motion.div
        animate={{
          y: [0, -16, 0],
          rotate: [0, 1.5, 0, -1.5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative z-10 w-full h-full flex items-center justify-center filter drop-shadow-2xl"
      >
        {imageOverride ? (
          <img
            src={imageOverride}
            alt="Cafe Eleganza Signature Cup"
            className="w-full h-full object-contain"
          />
        ) : (
          /* Handcrafted Luxury Artisan Iced Latte Inline SVG */
          <svg
            viewBox="0 0 320 440"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <defs>
              {/* Glass reflection gradient */}
              <linearGradient id="glassGrad" x1="60" y1="90" x2="260" y2="400" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFFFFF" stopOpacity="0.4" />
                <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.1" />
                <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.3" />
              </linearGradient>

              {/* Coffee to Milk gradient */}
              <linearGradient id="latteGrad" x1="160" y1="120" x2="160" y2="390" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#4A2E1B" />       {/* Rich Crema Top */}
                <stop offset="35%" stopColor="#8C5835" />      {/* Espresso Layer */}
                <stop offset="60%" stopColor="#C48A4A" />      {/* Swirling Caramel */}
                <stop offset="85%" stopColor="#F5E6D3" />      {/* Silky Whole Milk */}
                <stop offset="100%" stopColor="#E6CDB2" />     {/* Condensed Milk Base */}
              </linearGradient>

              {/* Caramel Drizzle Gradient */}
              <linearGradient id="caramelDrizzle" x1="100" y1="130" x2="220" y2="300" gradientUnits="userSpaceOnUse">
                <stop stopColor="#E29D42" />
                <stop offset="1" stopColor="#9C5B18" />
              </linearGradient>

              {/* Glass Rim Highlight */}
              <linearGradient id="rimGrad" x1="60" y1="90" x2="260" y2="90" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFFFFF" stopOpacity="0.8" />
                <stop offset="0.5" stopColor="#B6C9C1" stopOpacity="0.6" />
                <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.9" />
              </linearGradient>

              <filter id="liquidBlur" x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur stdDeviation="1.5" />
              </filter>
            </defs>

            {/* Drinking Straw (Forest Green / Brass Stripe) */}
            <path
              d="M190 20 L212 25 L178 220"
              stroke="#0F3D2E"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <path
              d="M192 20 L214 25 L180 220"
              stroke="#C48A4A"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="14 12"
            />

            {/* Clear Cup Body Path */}
            <path
              d="M72 96 L92 390 C93 398 100 404 108 404 H212 C220 404 227 398 228 390 L248 96 Z"
              fill="url(#latteGrad)"
            />

            {/* Swirling Caramel Streams inside glass */}
            <path
              d="M85 140 Q130 180 110 240 T150 330 Q170 380 140 395"
              stroke="url(#caramelDrizzle)"
              strokeWidth="14"
              strokeLinecap="round"
              fill="none"
              opacity="0.85"
            />
            <path
              d="M235 150 Q200 200 215 260 T180 340 Q170 380 180 395"
              stroke="url(#caramelDrizzle)"
              strokeWidth="11"
              strokeLinecap="round"
              fill="none"
              opacity="0.8"
            />

            {/* Floating Ice Cubes in Glass */}
            {/* Cube 1 (Upper Left) */}
            <g opacity="0.85" transform="rotate(-8 120 145)">
              <rect x="95" y="125" width="46" height="42" rx="7" fill="#FFFFFF" fillOpacity="0.55" stroke="#FFFFFF" strokeWidth="2" />
              <path d="M102 133 L134 133 L126 158" stroke="#FFFFFF" strokeWidth="1.5" fill="none" opacity="0.6" />
            </g>

            {/* Cube 2 (Upper Right) */}
            <g opacity="0.85" transform="rotate(14 195 160)">
              <rect x="175" y="140" width="48" height="44" rx="7" fill="#FFFFFF" fillOpacity="0.5" stroke="#FFFFFF" strokeWidth="2" />
              <path d="M182 148 L214 148 L206 173" stroke="#FFFFFF" strokeWidth="1.5" fill="none" opacity="0.6" />
            </g>

            {/* Cube 3 (Mid Depth) */}
            <g opacity="0.75" transform="rotate(-12 155 220)">
              <rect x="135" y="200" width="44" height="40" rx="6" fill="#FFFFFF" fillOpacity="0.4" stroke="#FFFFFF" strokeWidth="1.8" />
            </g>

            {/* Whipped Cold-Foam Crest / Crema Layer on Top */}
            <ellipse cx="160" cy="98" rx="88" ry="16" fill="#FBF7F0" />
            <ellipse cx="160" cy="98" rx="84" ry="13" fill="#D9A86E" opacity="0.65" />
            <ellipse cx="160" cy="97" rx="76" ry="10" fill="#F4ECE1" />

            {/* Glass Rim */}
            <ellipse cx="160" cy="96" rx="88" ry="15" fill="none" stroke="url(#rimGrad)" strokeWidth="4" />

            {/* Glass Container Outer Sheen & Vertical Refraction */}
            <path
              d="M72 96 L92 390 C93 398 100 404 108 404 H212 C220 404 227 398 228 390 L248 96 Z"
              fill="url(#glassGrad)"
              stroke="rgba(255, 255, 255, 0.4)"
              strokeWidth="2"
            />

            {/* Sharp Left Light Reflection */}
            <path
              d="M84 110 L102 380 Q104 388 112 388 L116 388 L98 110 Z"
              fill="#FFFFFF"
              fillOpacity="0.32"
            />

            {/* Cafe Eleganza Gold Seal Emblem on Glass */}
            <g transform="translate(130, 230)">
              <circle cx="30" cy="30" r="26" fill="#0F3D2E" fillOpacity="0.9" stroke="#C48A4A" strokeWidth="2" />
              <circle cx="30" cy="30" r="23" fill="none" stroke="#E2B882" strokeWidth="1" strokeDasharray="3 2" />
              <text
                x="30"
                y="27"
                textAnchor="middle"
                fill="#F6EFE3"
                fontSize="11"
                fontFamily="Fraunces, serif"
                fontWeight="bold"
                letterSpacing="1"
              >
                ELEGANZA
              </text>
              <text
                x="30"
                y="38"
                textAnchor="middle"
                fill="#C48A4A"
                fontSize="7"
                fontFamily="Inter, sans-serif"
                fontWeight="600"
                letterSpacing="0.8"
              >
                SOLARIUM
              </text>
            </g>
          </svg>
        )}
      </motion.div>
    </div>
  );
};

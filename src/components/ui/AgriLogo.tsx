import React from 'react';

interface AgriLogoProps {
  size?: number | string;
  className?: string;
  showText?: boolean;
  textClassName?: string;
}

export const AgriLogo: React.FC<AgriLogoProps> = ({
  size = 40,
  className = '',
  showText = false,
  textClassName = '',
}) => {
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Agricultural Plant & Soil Emblem */}
      <div
        className="relative shrink-0 flex items-center justify-center rounded-2xl p-1 shadow-lg transition-transform hover:scale-105"
        style={{
          width: size,
          height: size,
          background: 'linear-gradient(135deg, #064E3B 0%, #1E1B4B 50%, #451A03 100%)',
          border: '1.5px solid rgba(52, 211, 153, 0.35)',
          boxShadow: '0 8px 24px -4px rgba(16, 185, 129, 0.25), 0 4px 12px -2px rgba(120, 53, 15, 0.3)'
        }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-md"
        >
          <defs>
            {/* Green Leaf Gradient */}
            <linearGradient id="leafGradPrimary" x1="20" y1="20" x2="60" y2="60" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="50%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>

            {/* Lush Sprout Gradient */}
            <linearGradient id="leafGradSecondary" x1="45" y1="15" x2="85" y2="55" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#6EE7B7" />
              <stop offset="60%" stopColor="#059669" />
              <stop offset="100%" stopColor="#065F46" />
            </linearGradient>

            {/* Earth Soil Gradient */}
            <linearGradient id="soilGrad" x1="10" y1="65" x2="90" y2="95" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#92400E" />
              <stop offset="40%" stopColor="#78350F" />
              <stop offset="100%" stopColor="#451A03" />
            </linearGradient>

            {/* Gold Seed Glow */}
            <linearGradient id="seedGlow" x1="40" y1="45" x2="60" y2="65" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </defs>

          {/* Deep Earth Nutrient Base / Soil Mound */}
          <path
            d="M 12 78 Q 30 66 50 68 Q 70 70 88 78 C 84 89 70 93 50 93 C 30 93 16 89 12 78 Z"
            fill="url(#soilGrad)"
            stroke="#B45309"
            strokeWidth="1.5"
          />

          {/* Soil Layer Lines (Fertile Furrows) */}
          <path
            d="M 20 81 Q 35 74 50 76 Q 65 78 80 82"
            stroke="#D97706"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.7"
          />
          <path
            d="M 28 87 Q 40 82 50 83 Q 60 84 72 87"
            stroke="#F59E0B"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.5"
          />

          {/* Sprouting Stem */}
          <path
            d="M 50 72 C 50 56 49 42 50 32"
            stroke="#10B981"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Left Primary Vibrant Leaf */}
          <path
            d="M 49 52 C 34 50 20 38 22 22 C 38 22 47 38 49 52 Z"
            fill="url(#leafGradPrimary)"
            stroke="#34D399"
            strokeWidth="1"
          />
          {/* Left Leaf Vein */}
          <path
            d="M 24 24 Q 36 34 47 48"
            stroke="#A7F3D0"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* Right Secondary Sprout Leaf */}
          <path
            d="M 51 44 C 66 40 80 28 76 14 C 60 16 53 32 51 44 Z"
            fill="url(#leafGradSecondary)"
            stroke="#6EE7B7"
            strokeWidth="1"
          />
          {/* Right Leaf Vein */}
          <path
            d="M 74 16 Q 64 28 53 40"
            stroke="#D1FAE5"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* Top Tender Bud Leaf */}
          <path
            d="M 50 32 C 45 22 48 10 50 8 C 52 10 55 22 50 32 Z"
            fill="#6EE7B7"
            stroke="#34D399"
            strokeWidth="0.8"
          />

          {/* Golden Seed of Wisdom at Root Center */}
          <circle cx="50" cy="65" r="4.5" fill="url(#seedGlow)" stroke="#FFFBEB" strokeWidth="1" />
          <circle cx="50" cy="65" r="2" fill="#FFFFFF" opacity="0.8" />
        </svg>
      </div>

      {/* Optional Brand Text with Stylish Font */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className={`text-xl font-bold tracking-tight text-white ${textClassName}`} style={{ fontFamily: "'Caveat', cursive, serif" }}>
              AgriVeda AI
            </span>
            <span className="bg-gradient-to-r from-emerald-500/20 to-amber-500/20 text-emerald-400 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-500/30">
              SMART FARMING
            </span>
          </div>
          <span className="text-[10px] text-amber-200/80 font-medium">
            Plants • Soil • Intelligent Agriculture
          </span>
        </div>
      )}
    </div>
  );
};

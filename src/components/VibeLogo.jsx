import React from 'react';

export default function VibeLogo({ showText = true, size = "default", variant = "light", className = "" }) {
  const isLarge = size === "large";
  const isSmall = size === "small";
  const isDark = variant === "dark";

  const iconWidth = isLarge ? 52 : isSmall ? 32 : 40;
  const iconHeight = isLarge ? 48 : isSmall ? 30 : 38;

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* SVG Icon representing the emblem on the card */}
      <div className="relative flex items-center justify-center shrink-0">
        <svg
          width={iconWidth}
          height={iconHeight}
          viewBox="0 0 120 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="filter drop-shadow-sm"
        >
          <defs>
            <linearGradient id="goldSheenLogo" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF2B2" />
              <stop offset="35%" stopColor="#E5C05B" />
              <stop offset="70%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#B8860B" />
            </linearGradient>
          </defs>

          {/* Stylized V Left Stem */}
          <path
            d="M 18 18 L 48 88 C 50 92 56 92 58 88 L 66 70 L 36 22 C 34 19 30 18 26 18 Z"
            fill="url(#goldSheenLogo)"
          />

          {/* Stylized V Right Stem */}
          <path
            d="M 68 64 L 88 20 C 90 16 86 14 83 15 L 56 68 Z"
            fill="url(#goldSheenLogo)"
          />

          {/* Embedded Play Button Icon */}
          <polygon
            points="38,36 38,54 52,45"
            fill="url(#goldSheenLogo)"
          />

          {/* Broadcast signal waves */}
          <path
            d="M 80 20 A 14 14 0 0 1 94 34"
            stroke="url(#goldSheenLogo)"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 88 12 A 24 24 0 0 1 110 34"
            stroke="url(#goldSheenLogo)"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center tracking-wider font-display font-bold">
            <span className={`${isDark ? 'text-white' : 'text-slate-900'} text-lg sm:text-xl font-extrabold tracking-tight`}>
              VIBE
            </span>
            <span className="text-gold-500 text-lg sm:text-xl font-semibold tracking-wide ml-1">
              MEDIA
            </span>
            <span className={`${isDark ? 'text-slate-100' : 'text-slate-800'} text-base sm:text-lg font-normal tracking-widest ml-1.5`}>
              NETWORKS
            </span>
          </div>
          <span className={`text-[10px] sm:text-[11px] font-semibold tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-500'} uppercase`}>
            Digital Talent & Media Scouting Agency
          </span>
        </div>
      )}
    </div>
  );
}

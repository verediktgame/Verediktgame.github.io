import React from 'react';

export function SteamingCoffee() {
  return (
    <div className="steaming-coffee-wrapper" aria-hidden="true" title="Café recién servido">
      <svg viewBox="0 0 160 160" width="105" height="105" className="coffee-svg">
        <defs>
          <radialGradient id="coffeeLiquid" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#3d2314" />
            <stop offset="80%" stopColor="#1e1008" />
            <stop offset="100%" stopColor="#0d0703" />
          </radialGradient>
          <linearGradient id="mugGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ded5c5" />
            <stop offset="50%" stopColor="#c5b7a1" />
            <stop offset="100%" stopColor="#9c8c74" />
          </linearGradient>
          <filter id="coffeeShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="5" stdDeviation="4" floodColor="#000000" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* 3 Steam Vapor Lines with CSS animations */}
        <g className="steam-group">
          <path
            className="vapor-line vapor-1"
            d="M 68,68 Q 62,50 68,34 T 66,16"
            fill="none"
            stroke="rgba(235, 225, 205, 0.6)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            className="vapor-line vapor-2"
            d="M 80,66 Q 86,46 78,30 T 82,12"
            fill="none"
            stroke="rgba(235, 225, 205, 0.75)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            className="vapor-line vapor-3"
            d="M 92,68 Q 98,52 90,36 T 94,18"
            fill="none"
            stroke="rgba(235, 225, 205, 0.55)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>

        {/* Saucer / Plato */}
        <ellipse cx="80" cy="132" rx="55" ry="12" fill="#8f7e69" filter="url(#coffeeShadow)" />
        <ellipse cx="80" cy="130" rx="52" ry="10" fill="url(#mugGradient)" stroke="#7a6b57" strokeWidth="1" />
        <ellipse cx="80" cy="129" rx="36" ry="6" fill="#a89a84" opacity="0.6" />

        {/* Mug Body */}
        <g filter="url(#coffeeShadow)">
          {/* Mug Handle */}
          <path
            d="M 108,82 C 128,82 130,112 108,114"
            fill="none"
            stroke="url(#mugGradient)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 108,82 C 128,82 130,112 108,114"
            fill="none"
            stroke="#6e5f4d"
            strokeWidth="1.5"
          />

          {/* Mug Base / Cylinder */}
          <path
            d="M 52,78 L 56,120 C 56,126 104,126 104,120 L 108,78 Z"
            fill="url(#mugGradient)"
            stroke="#70604c"
            strokeWidth="1.5"
          />

          {/* Mug Rim & Coffee surface */}
          <ellipse cx="80" cy="78" rx="28" ry="9" fill="#b8aa95" stroke="#70604c" strokeWidth="1.5" />
          <ellipse cx="80" cy="79" rx="24" ry="7" fill="url(#coffeeLiquid)" />
          {/* Coffee gloss highlight */}
          <ellipse cx="76" cy="78" rx="14" ry="3" fill="rgba(255,255,255,0.18)" />
        </g>
      </svg>
    </div>
  );
}

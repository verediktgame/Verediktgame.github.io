import React, { useState, useEffect } from 'react';

export function DeskClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  // Hand angles (degrees)
  const secondAngle = seconds * 6; // 360 / 60
  const minuteAngle = (minutes + seconds / 60) * 6;
  const hourAngle = ((hours % 12) + minutes / 60) * 30; // 360 / 12

  // Generate 12 hour numbers and 60 tick marks
  const hourNumbers = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  return (
    <div className="police-clock-wrapper" title={`Hora actual: ${time.toLocaleTimeString()}`}>
      <svg viewBox="0 0 200 200" width="130" height="130" className="police-wall-clock">
        <defs>
          <radialGradient id="clockBezel" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#4a3728" />
            <stop offset="70%" stopColor="#24170d" />
            <stop offset="100%" stopColor="#140c06" />
          </radialGradient>
          <radialGradient id="clockFace" cx="45%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#fbf7ec" />
            <stop offset="85%" stopColor="#ede3c8" />
            <stop offset="100%" stopColor="#d6c7a1" />
          </radialGradient>
          <filter id="clockShadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="3" dy="6" stdDeviation="5" floodColor="#000000" floodOpacity="0.6" />
          </filter>
        </defs>

        {/* Outer casing shadow and rim */}
        <circle cx="100" cy="100" r="94" fill="url(#clockBezel)" stroke="#634e3a" strokeWidth="3" filter="url(#clockShadow)" />
        <circle cx="100" cy="100" r="84" fill="#1b120a" stroke="#8c7358" strokeWidth="1" />

        {/* Parchment clock face */}
        <circle cx="100" cy="100" r="80" fill="url(#clockFace)" stroke="#ad9877" strokeWidth="1.5" />

        {/* 60 minute ticks */}
        {Array.from({ length: 60 }).map((_, i) => {
          const isMajor = i % 5 === 0;
          const angle = i * 6;
          const rad = (angle * Math.PI) / 180;
          const rInner = isMajor ? 70 : 74;
          const rOuter = 78;
          const x1 = 100 + rInner * Math.sin(rad);
          const y1 = 100 - rInner * Math.cos(rad);
          const x2 = 100 + rOuter * Math.sin(rad);
          const y2 = 100 - rOuter * Math.cos(rad);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#2d2319"
              strokeWidth={isMajor ? 2.5 : 1}
              opacity={isMajor ? 0.9 : 0.4}
            />
          );
        })}

        {/* Hour numbers */}
        {hourNumbers.map((num, i) => {
          const angle = i * 30;
          const rad = (angle * Math.PI) / 180;
          const r = 58;
          const x = 100 + r * Math.sin(rad);
          const y = 100 - r * Math.cos(rad) + 4.5;
          return (
            <text
              key={num}
              x={x}
              y={y}
              textAnchor="middle"
              fill="#1e1812"
              fontSize="14"
              fontWeight="bold"
              fontFamily="var(--font-typewriter), Courier, monospace"
            >
              {num}
            </text>
          );
        })}

        {/* Vintage Dept Label */}
        <text
          x="100"
          y="78"
          textAnchor="middle"
          fill="#6b5842"
          fontSize="6.5"
          letterSpacing="1.5"
          fontFamily="sans-serif"
          fontWeight="700"
        >
          POLICE DEPT
        </text>
        <text
          x="100"
          y="126"
          textAnchor="middle"
          fill="#8c755a"
          fontSize="5.5"
          letterSpacing="1"
          fontFamily="monospace"
        >
          PRECINCT ARCHIVES
        </text>

        {/* Hour Hand */}
        <line
          x1="100"
          y1="100"
          x2="100"
          y2="58"
          stroke="#19130d"
          strokeWidth="4"
          strokeLinecap="round"
          transform={`rotate(${hourAngle} 100 100)`}
        />

        {/* Minute Hand */}
        <line
          x1="100"
          y1="100"
          x2="100"
          y2="38"
          stroke="#19130d"
          strokeWidth="2.5"
          strokeLinecap="round"
          transform={`rotate(${minuteAngle} 100 100)`}
        />

        {/* Second Hand (Vintage Red) */}
        <g transform={`rotate(${secondAngle} 100 100)`}>
          <line x1="100" y1="116" x2="100" y2="30" stroke="#9e1c1c" strokeWidth="1.2" />
          <circle cx="100" cy="116" r="2.5" fill="#9e1c1c" />
        </g>

        {/* Center Pivot */}
        <circle cx="100" cy="100" r="4" fill="#a88e63" stroke="#2b2016" strokeWidth="1" />
      </svg>
    </div>
  );
}

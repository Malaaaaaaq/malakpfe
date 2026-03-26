import React from 'react';

export default function ParkingHeroAnim() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <svg
        viewBox="0 0 400 400"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%' }}
      >
        <defs>
          <radialGradient id="pgBg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
          </radialGradient>
          <filter id="pgGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background glow */}
        <circle cx="200" cy="200" r="162" fill="url(#pgBg)" />

        {/* Outer rotating dashed ring */}
        <circle cx="200" cy="200" r="170" fill="none" stroke="rgba(218,18,18,0.45)" strokeWidth="1.5" strokeDasharray="9 6">
          <animateTransform attributeName="transform" type="rotate" from="0 200 200" to="360 200 200" dur="14s" repeatCount="indefinite" />
        </circle>

        {/* Middle counter-rotating ring */}
        <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="3 10">
          <animateTransform attributeName="transform" type="rotate" from="360 200 200" to="0 200 200" dur="20s" repeatCount="indefinite" />
        </circle>

        {/* Inner pulsing circle */}
        <circle cx="200" cy="200" r="118" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.2)" strokeWidth="2">
          <animate attributeName="r" values="113;121;113" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;1;0.8" dur="4s" repeatCount="indefinite" />
        </circle>

        {/* Giant P letter with glow */}
        <text
          x="200" y="244"
          textAnchor="middle"
          fontSize="168"
          fontWeight="900"
          fill="white"
          fontFamily="Arial Black, Arial, sans-serif"
          opacity="0.93"
          filter="url(#pgGlow)"
        >P</text>

        {/* Animated car driving in */}
        <g>
          <animateTransform
            attributeName="transform"
            type="translate"
            values="-220 0; 52 0; 52 0; 52 0"
            keyTimes="0; 0.38; 0.82; 1"
            dur="5.5s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.42 0 0.18 1; 0 0 1 1; 0 0 1 1"
          />
          {/* Car body */}
          <rect x="40" y="302" width="88" height="30" rx="10" fill="rgba(255,255,255,0.9)" />
          {/* Car roof */}
          <rect x="54" y="288" width="58" height="20" rx="8" fill="rgba(255,255,255,0.75)" />
          {/* Left window */}
          <rect x="57" y="290" width="23" height="15" rx="3" fill="rgba(4,21,98,0.4)" />
          {/* Right window */}
          <rect x="83" y="290" width="23" height="15" rx="3" fill="rgba(4,21,98,0.4)" />
          {/* Rear wheel */}
          <circle cx="62" cy="332" r="11" fill="rgba(15,23,42,0.72)" />
          <circle cx="62" cy="332" r="5" fill="rgba(255,255,255,0.65)" />
          {/* Front wheel */}
          <circle cx="106" cy="332" r="11" fill="rgba(15,23,42,0.72)" />
          <circle cx="106" cy="332" r="5" fill="rgba(255,255,255,0.65)" />
          {/* Headlight */}
          <rect x="126" y="306" width="6" height="10" rx="2" fill="rgba(255,245,100,0.92)" />
          {/* Tail light */}
          <rect x="38" y="306" width="4" height="8" rx="2" fill="rgba(218,18,18,0.85)" />
        </g>

        {/* Checkmark appearing after car parks */}
        <g>
          <animate attributeName="opacity"
            values="0;0;0;0;1;1;0;0"
            keyTimes="0;0.32;0.36;0.48;0.56;0.82;0.88;1"
            dur="5.5s" repeatCount="indefinite" />
          <circle cx="292" cy="158" r="0" fill="rgba(16,185,129,0.95)">
            <animate attributeName="r"
              values="0;0;0;0;22;22;0;0"
              keyTimes="0;0.32;0.36;0.48;0.56;0.82;0.88;1"
              dur="5.5s" repeatCount="indefinite" />
          </circle>
          <polyline points="282,158 289,166 304,150" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* Floating orbs */}
        <circle cx="68" cy="106" r="6" fill="rgba(218,18,18,0.65)">
          <animate attributeName="cy" values="106;86;106" dur="3.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.65;1;0.65" dur="3.2s" repeatCount="indefinite" />
        </circle>
        <circle cx="334" cy="152" r="4" fill="rgba(255,255,255,0.5)">
          <animate attributeName="cy" values="152;132;152" dur="2.8s" repeatCount="indefinite" />
        </circle>
        <circle cx="350" cy="268" r="5" fill="rgba(218,18,18,0.35)">
          <animate attributeName="cy" values="268;248;268" dur="4.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="50" cy="272" r="3" fill="rgba(255,255,255,0.35)">
          <animate attributeName="cy" values="272;252;272" dur="3.8s" repeatCount="indefinite" />
        </circle>
        <circle cx="200" cy="42" r="4" fill="rgba(255,255,255,0.3)">
          <animate attributeName="cy" values="42;28;42" dur="4s" repeatCount="indefinite" />
        </circle>

        {/* Faded P decorations around border */}
        <text x="345" y="206" fontSize="20" fill="rgba(255,255,255,0.18)" fontWeight="900" fontFamily="Arial, sans-serif" textAnchor="middle">
          <animate attributeName="opacity" values="0.18;0.38;0.18" dur="4s" repeatCount="indefinite" />
          P
        </text>
        <text x="55" y="206" fontSize="20" fill="rgba(255,255,255,0.18)" fontWeight="900" fontFamily="Arial, sans-serif" textAnchor="middle">
          <animate attributeName="opacity" values="0.18;0.38;0.18" dur="5s" repeatCount="indefinite" />
          P
        </text>
        <text x="200" y="52" fontSize="16" fill="rgba(255,255,255,0.15)" fontWeight="900" fontFamily="Arial, sans-serif" textAnchor="middle">
          <animate attributeName="opacity" values="0.15;0.3;0.15" dur="3.5s" repeatCount="indefinite" />
          P
        </text>

        {/* Parking lane lines at bottom */}
        <line x1="92" y1="368" x2="92" y2="388" stroke="rgba(255,255,255,0.28)" strokeWidth="2">
          <animate attributeName="opacity" values="0.28;0.7;0.28" dur="3s" repeatCount="indefinite" />
        </line>
        <line x1="162" y1="368" x2="162" y2="388" stroke="rgba(255,255,255,0.28)" strokeWidth="2">
          <animate attributeName="opacity" values="0.28;0.7;0.28" dur="3s" begin="0.5s" repeatCount="indefinite" />
        </line>
        <line x1="232" y1="368" x2="232" y2="388" stroke="rgba(255,255,255,0.28)" strokeWidth="2">
          <animate attributeName="opacity" values="0.28;0.7;0.28" dur="3s" begin="1s" repeatCount="indefinite" />
        </line>
        <line x1="302" y1="368" x2="302" y2="388" stroke="rgba(255,255,255,0.28)" strokeWidth="2">
          <animate attributeName="opacity" values="0.28;0.7;0.28" dur="3s" begin="1.5s" repeatCount="indefinite" />
        </line>
      </svg>
    </div>
  );
}

import React from 'react';

export default function FeaturesHeroAnim() {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
        <defs>
          <radialGradient id="fgBg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
          </radialGradient>
          <filter id="fgGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="fgSoftGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── Background ── */}
        <circle cx="200" cy="200" r="178" fill="url(#fgBg)" />

        {/* Outer slowly-rotating dashed ring */}
        <circle cx="200" cy="200" r="170" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="6 10">
          <animateTransform attributeName="transform" type="rotate" from="0 200 200" to="360 200 200" dur="30s" repeatCount="indefinite" />
        </circle>

        {/* Orbit track ring (static guide) */}
        <circle cx="200" cy="200" r="120" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1.5" strokeDasharray="3 14" />

        {/* Inner counter-rotating ring */}
        <circle cx="200" cy="200" r="78" fill="none" stroke="rgba(218,18,18,0.18)" strokeWidth="1" strokeDasharray="3 8">
          <animateTransform attributeName="transform" type="rotate" from="360 200 200" to="0 200 200" dur="20s" repeatCount="indefinite" />
        </circle>

        {/* ── 3 Orbiting Feature Nodes (orbit radius = 120) ── */}

        {/* Node 1 — Shield / Sécurité (Green) — starts at top */}
        <g>
          <animateTransform attributeName="transform" type="rotate"
            from="0 200 200" to="360 200 200" dur="12s" repeatCount="indefinite" />
          <circle cx="200" cy="80" r="26" fill="rgba(16,185,129,0.92)" filter="url(#fgGlow)">
            <animate attributeName="r" values="24;28;24" dur="2.2s" repeatCount="indefinite" />
          </circle>
          {/* Shield icon */}
          <path d="M200 69 L209 72.5 L209 80 Q209 88 200 92 Q191 88 191 80 L191 72.5 Z"
            fill="white" opacity="0.95" />
        </g>

        {/* Node 2 — Zap / Vitesse (Amber) — starts at bottom-right */}
        <g>
          <animateTransform attributeName="transform" type="rotate"
            from="120 200 200" to="480 200 200" dur="12s" repeatCount="indefinite" />
          <circle cx="200" cy="80" r="26" fill="rgba(245,158,11,0.92)" filter="url(#fgGlow)">
            <animate attributeName="r" values="24;28;24" dur="2.5s" begin="0.8s" repeatCount="indefinite" />
          </circle>
          {/* Lightning bolt icon */}
          <path d="M204 69 L194 83 L202 83 L197 92 L211 78 L203 78 Z"
            fill="white" opacity="0.95" />
        </g>

        {/* Node 3 — MapPin / GPS (Red) — starts at bottom-left */}
        <g>
          <animateTransform attributeName="transform" type="rotate"
            from="240 200 200" to="600 200 200" dur="12s" repeatCount="indefinite" />
          <circle cx="200" cy="80" r="26" fill="rgba(218,18,18,0.92)" filter="url(#fgGlow)">
            <animate attributeName="r" values="24;28;24" dur="2.8s" begin="1.6s" repeatCount="indefinite" />
          </circle>
          {/* Map pin icon */}
          <path d="M200 68 C194 68 188 73 188 79 C188 86 200 93 200 93 C200 93 212 86 212 79 C212 73 206 68 200 68 Z"
            fill="white" opacity="0.95" />
          <circle cx="200" cy="79" r="3.5" fill="rgba(218,18,18,0.65)" />
        </g>

        {/* ── Phone Mockup (centered at 200,200) ── */}
        {/* Body */}
        <rect x="168" y="148" width="64" height="104" rx="13" fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
        {/* Screen area */}
        <rect x="172" y="157" width="56" height="82" rx="6" fill="rgba(4,21,98,0.6)" />
        {/* Screen glow border */}
        <rect x="172" y="157" width="56" height="82" rx="6" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />

        {/* Status bar */}
        <rect x="177" y="161" width="28" height="3" rx="1.5" fill="rgba(255,255,255,0.38)" />
        <circle cx="222" cy="162.5" r="2.2" fill="rgba(16,185,129,0.9)" />

        {/* ParLak logo circle */}
        <circle cx="200" cy="184" r="15" fill="rgba(255,255,255,0.92)" filter="url(#fgSoftGlow)">
          <animate attributeName="opacity" values="0.92;1;0.92" dur="2s" repeatCount="indefinite" />
        </circle>
        <text x="200" y="189" textAnchor="middle" fontSize="14" fontWeight="900" fill="#041562">P</text>

        {/* App content lines */}
        <rect x="178" y="206" width="44" height="4" rx="2" fill="rgba(255,255,255,0.5)" />
        <rect x="183" y="214" width="34" height="3" rx="2" fill="rgba(255,255,255,0.3)" />
        <rect x="186" y="221" width="28" height="3" rx="2" fill="rgba(255,255,255,0.18)" />

        {/* Progress bar with animated fill */}
        <rect x="178" y="230" width="44" height="4" rx="2" fill="rgba(255,255,255,0.1)" />
        <rect x="178" y="230" height="4" rx="2" fill="rgba(16,185,129,0.8)">
          <animate attributeName="width" values="10;44;44;10" keyTimes="0;0.5;0.8;1" dur="4s" repeatCount="indefinite" />
        </rect>

        {/* Home indicator */}
        <rect x="190" y="246" width="20" height="3" rx="2" fill="rgba(255,255,255,0.32)" />

        {/* ── Pulse rings from phone center ── */}
        <circle cx="200" cy="200" r="50" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5">
          <animate attributeName="r" values="50;90;50" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.35;0;0.35" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle cx="200" cy="200" r="50" fill="none" stroke="rgba(218,18,18,0.15)" strokeWidth="1">
          <animate attributeName="r" values="50;90;50" dur="4s" begin="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0;0.3" dur="4s" begin="2s" repeatCount="indefinite" />
        </circle>

        {/* ── Notification card (slides in from right) ── */}
        <g>
          <animate attributeName="opacity" values="0;0;1;1;1;0" keyTimes="0;0.18;0.3;0.65;0.78;0.88" dur="7s" repeatCount="indefinite" />
          <animateTransform attributeName="transform" type="translate"
            values="30 0; 30 0; 0 0; 0 0; 0 0; 30 0"
            keyTimes="0;0.18;0.3;0.65;0.78;0.88"
            dur="7s" repeatCount="indefinite"
            calcMode="spline"
            keySplines="0 0 1 1; 0.3 0 0.2 1; 0 0 1 1; 0 0 1 1; 0.3 0 0.2 1" />
          {/* Card background */}
          <rect x="244" y="162" width="118" height="56" rx="11"
            fill="rgba(255,255,255,0.97)" />
          <rect x="244" y="162" width="118" height="56" rx="11"
            fill="none" stroke="rgba(4,21,98,0.1)" strokeWidth="1" />
          {/* Green checkmark circle */}
          <circle cx="262" cy="183" r="11" fill="rgba(16,185,129,0.9)" />
          <path d="M257 183 L261 188 L268 177" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Text lines */}
          <rect x="278" y="175" width="72" height="6" rx="3" fill="#041562" opacity="0.85" />
          <rect x="278" y="187" width="52" height="4" rx="2" fill="#64748b" opacity="0.55" />
          {/* Bottom separator & time */}
          <rect x="244" y="205" width="118" height="1" fill="rgba(0,0,0,0.06)" />
          <rect x="254" y="211" width="30" height="3" rx="1.5" fill="#10b981" opacity="0.7" />
          <rect x="290" y="211" width="20" height="3" rx="1.5" fill="#94a3b8" opacity="0.5" />
        </g>

        {/* ── Floating particles ── */}
        <circle cx="68" cy="128" r="5" fill="rgba(218,18,18,0.6)">
          <animate attributeName="cy" values="128;108;128" dur="3.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;1;0.6" dur="3.4s" repeatCount="indefinite" />
        </circle>
        <circle cx="342" cy="145" r="4" fill="rgba(255,255,255,0.45)">
          <animate attributeName="cy" values="145;125;145" dur="2.9s" repeatCount="indefinite" />
        </circle>
        <circle cx="58" cy="268" r="3.5" fill="rgba(255,255,255,0.32)">
          <animate attributeName="cy" values="268;248;268" dur="4.2s" repeatCount="indefinite" />
        </circle>
        <circle cx="348" cy="275" r="5" fill="rgba(218,18,18,0.28)">
          <animate attributeName="cy" values="275;255;275" dur="3.7s" repeatCount="indefinite" />
        </circle>
        <circle cx="200" cy="358" r="4" fill="rgba(255,255,255,0.25)">
          <animate attributeName="cy" values="358;343;358" dur="4.5s" repeatCount="indefinite" />
        </circle>

        {/* Small blinking stars */}
        <circle cx="125" cy="345" r="2" fill="rgba(255,255,255,0.5)">
          <animate attributeName="opacity" values="0.5;1;0.5" dur="1.9s" repeatCount="indefinite" />
        </circle>
        <circle cx="275" cy="348" r="2" fill="rgba(255,255,255,0.5)">
          <animate attributeName="opacity" values="0.5;1;0.5" dur="2.3s" begin="0.6s" repeatCount="indefinite" />
        </circle>
        <circle cx="52" cy="195" r="2" fill="rgba(255,255,255,0.4)">
          <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2.7s" begin="1.2s" repeatCount="indefinite" />
        </circle>
        <circle cx="352" cy="210" r="2" fill="rgba(255,255,255,0.4)">
          <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2.1s" begin="0.3s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
}

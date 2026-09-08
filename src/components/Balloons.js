/* ============================================================
   BALLOONS — Floating emoji rising endlessly
   ============================================================ */

import { Component } from 'valen';

const BALLOONS = [
  { e: '🎈', l: 8, d: 10, del: 0, s: 42 },
  { e: '💛', l: 22, d: 13, del: 1.4, s: 34 },
  { e: '🎉', l: 36, d: 11, del: 2.6, s: 38 },
  { e: '🎈', l: 52, d: 14, del: .6, s: 46 },
  { e: '✨', l: 66, d: 12, del: 3.2, s: 30 },
  { e: '🎈', l: 79, d: 10.5, del: 1.9, s: 40 },
  { e: '🌟', l: 92, d: 13.5, del: 3.8, s: 34 }
];

const Balloons = Component(function Balloons() {
  return {
    template() {
      return BALLOONS.map(b =>
        `<span class="balloon" style="left:${b.l}%; font-size:${b.s}px; animation-duration:${b.d}s; animation-delay:${b.del}s;">${b.e}</span>`
      ).join('');
    },
    
    stylesheet: {
      '.balloon': `
        position: fixed;
        bottom: -90px;
        z-index: 10;
        animation-name: rise;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
        pointer-events: none;
        will-change: transform;
      `,
      '@keyframes rise': `
        0%   { transform: translateY(0) rotate(-6deg); opacity: 0; }
        8%   { opacity: 1; }
        50%  { transform: translateY(-60vh) rotate(6deg); }
        92%  { opacity: 1; }
        100% { transform: translateY(-125vh) rotate(-6deg); opacity: 0; }
      `
    }
  };
});


export default Balloons;
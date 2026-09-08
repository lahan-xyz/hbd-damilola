/* ============================================================
   CONFETTI — Canvas rain + click bursts (black & gold palette)
   ============================================================ */

import { Component } from 'valen';
import { FX } from '../fx/fx.js';

const Confetti = Component(function Confetti() {
  return {
    template: `<canvas id="confetti-canvas"></canvas>`,

    run() {
      const canvas = document.getElementById('confetti-canvas');
      const ctx = canvas.getContext('2d');
      const COLORS = ['#FFD700', '#FFCC00', '#FFE44D', '#FFF3B0', '#B8860B', '#FFFFFF'];
      let W, H, pieces = [];

      const resize = () => { W = canvas.width = innerWidth; H = canvas.height = innerHeight; };
      resize();
      addEventListener('resize', resize);

      const spawnRain = (n) => {
        for (let i = 0; i < n; i++) pieces.push({
          shape: Math.random() > 0.35 ? 'rect' : 'circle',
          x: Math.random() * W, y: -20,
          vx: (Math.random() - 0.5) * 1.2, vy: Math.random() * 3 + 2.5,
          w: Math.random() * 8 + 4, h: Math.random() * 5 + 3,
          rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.2,
          color: COLORS[(Math.random() * COLORS.length) | 0]
        });
      };

      FX.rain = (seconds = 6) => {
        const until = Date.now() + seconds * 1000;
        const tick = () => {
          if (Date.now() > until) return;
          spawnRain(14);
          setTimeout(tick, 110);
        };
        tick();
      };

      FX.burst = (x, y, n = 55) => {
        for (let i = 0; i < n; i++) {
          const a = Math.random() * Math.PI * 2, s = Math.random() * 9 + 3;
          pieces.push({
            shape: Math.random() > 0.4 ? 'rect' : 'circle',
            x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 2,
            w: Math.random() * 7 + 3, h: Math.random() * 5 + 3,
            rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3,
            color: COLORS[(Math.random() * COLORS.length) | 0]
          });
        }
      };

      const frame = () => {
        ctx.clearRect(0, 0, W, H);
        pieces = pieces.filter(p => p.y < H + 60 && p.y > -80);
        if (pieces.length > 500) pieces.splice(0, pieces.length - 500);
        for (const p of pieces) {
          p.vy += 0.07; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.fillStyle = p.color;
          if (p.shape === 'rect') ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          else { ctx.beginPath(); ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2); ctx.fill(); }
          ctx.restore();
        }
        requestAnimationFrame(frame);
      };
      frame();
    },

    stylesheet: {
      '#confetti-canvas': `
        position: fixed; inset: 0;
        pointer-events: none;
        z-index: 40;
      `
    }
  };
});


export default Confetti;
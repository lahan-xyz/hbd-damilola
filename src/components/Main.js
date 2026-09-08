/* ============================================================
   MAIN — Phase machine: intro → ask → celebrate
   ============================================================ */

import { Component } from 'valen';
import { FX } from '../fx/fx.js';
import { songOn, playSong, stopSong } from '../fx/audio.js';

// Import child components to ensure they register with Valen before Main
import Confetti from './Confetti.js';
import Intro from './Intro.js';
import Balloons from './Balloons.js';

const Main = Component(function Main() {
  let dodges = 0, fireworkTimer = null;

  return {
    state: {
      phase: 'intro',          // 'intro' | 'ask' | 'celebrate'
      askIn: '',
      taunt: '',
      musicIcon: '🔊'
    },

    template() {
      return `
        <Confetti />

        <button class="music-btn" v:show="[ phase === 'celebrate' ]"
                @click="this.toggleMusic()">[ musicIcon ]</button>

        <div class="stage" v:show="[ phase === 'intro' ]">
          <div class="wrap"><Intro /></div>
        </div>

        <div class="stage slider [askIn]" v:show="[ phase === 'ask' ]">
          <div class="wrap">
            <p class="taunt" v:show="[ taunt ]">[ taunt ]</p>
            <h2 class="ask-title">Do you want to see your<br>surprise, Damilola?</h2>
            <div class="btns">
              <button class="btn gold" @click="this.yes()">Yes, show me! 💛</button>
              <button id="no-btn" class="btn ghost"
                      @mouseover="this.dodge()"
                      @click="this.no()">No 🙃</button>
            </div>
          </div>
        </div>

        <div class="stage celebrate" v:show="[ phase === 'celebrate' ]">
          <div class="wrap">
            <Balloons />
            <p class="pre">✨ &nbsp;the world got brighter on this day&nbsp; ✨</p>
            <h1 class="hbd">HAPPY BIRTHDAY</h1>
            <h2 class="name">Damilola</h2>
            <div class="cake">🎂</div>
            <p class="wish-line w1">May your year sparkle brighter than gold ✨</p>
            <p class="wish-line w2">Cake, laughter &amp; everything you wish for 🎈</p>
            <p class="wish-line w3">You are loved, today &amp; always 💛</p>
            <p class="hint">psst — tap anywhere for fireworks 🎆</p>
            <div class="btns">
              <button class="btn gold" @click="this.more()">More Confetti 🎉</button>
              <button class="btn ghost" @click="this.replay()">Replay ↻</button>
            </div>
          </div>
        </div>
      `;
    },

    created(state) {
      document.addEventListener('valen:intro-done', () => {
        state.phase = 'ask';
        // next tick so the freshly-shown stage transitions in (slides up)
        setTimeout(() => state.askIn = 'in', 60);
      });

      document.addEventListener('click', (e) => {
        if (state.phase === 'celebrate') FX.burst(e.clientX, e.clientY, 35);
      });

      this.yes = () => this.celebrate(state);

      this.no = () => {
        if (state.taunt) return;
        state.taunt = 'Nice try 😌 — the surprise is happening anyway!';
        setTimeout(() => this.celebrate(state), 1200);
      };

      this.dodge = () => {
        if (state.phase !== 'ask' || state.taunt) return;
        dodges++;
        if (dodges > 5) { this.no(); return; }
        const btn = document.getElementById('no-btn');
        if (!btn) return;
        const padX = Math.min(90, innerWidth * 0.18);
        const padY = Math.min(90, innerHeight * 0.15);
        const x = padX + Math.random() * Math.max(1, innerWidth - padX * 2 - 140);
        const y = padY + Math.random() * Math.max(1, innerHeight - padY * 2 - 60);
        btn.style.cssText = `position:fixed; left:${x}px; top:${y}px; z-index:60; margin:0;`;
      };

      this.more = () => {
        FX.rain(5);
        let i = 0;
        clearInterval(fireworkTimer);
        fireworkTimer = setInterval(() => {
          FX.burst(innerWidth * (0.15 + Math.random() * 0.7),
                   innerHeight * (0.15 + Math.random() * 0.5));
          if (++i >= 5) clearInterval(fireworkTimer);
        }, 450);
      };

      this.replay = () => location.reload();

      this.toggleMusic = () => {
        if (songOn) { stopSong(); state.musicIcon = '🔇'; }
        else { playSong(); state.musicIcon = '🔊'; }
      };

      this.celebrate = (st) => {
        clearInterval(fireworkTimer);
        st.phase = 'celebrate';
        playSong();
        FX.rain(7);
        let i = 0;
        fireworkTimer = setInterval(() => {
          FX.burst(innerWidth * (0.15 + Math.random() * 0.7),
                   innerHeight * (0.2 + Math.random() * 0.45));
          if (++i >= 6) clearInterval(fireworkTimer);
        }, 500);
        setTimeout(() => FX.burst(innerWidth / 2, innerHeight * 0.35, 90), 250);
      };
    },

    stylesheet: {
      '.stage': `
        position: relative;
        z-index: 20;
        width: 100%;
        padding: 6vh 5%;
      `,
      '.wrap': `
        min-height: 88vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
      `,

      /* --- music toggle --- */
      '.music-btn': `
        position: fixed;
        top: 16px; right: 16px;
        z-index: 60;
        width: 46px; height: 46px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 215, 0, .08);
        border: 1px solid rgba(255, 215, 0, .55);
        color: #FFD700;
        font-size: 20px;
        cursor: pointer;
        transition: background .3s ease;
      `,
      '.music-btn:hover': `background: rgba(255, 215, 0, .22);`,

      /* --- ask slider (slides up into view) --- */
      '.slider': `
        opacity: 0;
        transform: translateY(45vh) scale(.8);
        transition: transform .9s cubic-bezier(.2,.9,.3,1.2), opacity .7s ease;
      `,
      '.slider.in': `
        opacity: 1;
        transform: translateY(0) scale(1);
      `,
      '.taunt': `
        color: #FFE44D;
        font-size: 1.05rem;
        margin-bottom: 1rem;
        min-height: 1.5em;
        font-style: italic;
        animation: fadeUp .4s ease both;
      `,
      '.ask-title': `
        font-family: 'Playfair Display', Georgia, serif;
        font-size: clamp(1.7rem, 5vw, 2.8rem);
        font-weight: 700;
        line-height: 1.3;
        margin-bottom: 2rem;
        background-image: linear-gradient(90deg, #FFD700, #FFF3B0, #B8860B, #FFD700);
        background-size: 300% 100%;
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        animation: shimmer 3s linear infinite;
      `,

      /* --- buttons --- */
      '.btns': `
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
      `,
      '.btn': `
        padding: 15px 34px;
        border: none;
        border-radius: 50px;
        font-size: 1.05em;
        font-weight: 700;
        font-family: 'Manrope', serif;
        letter-spacing: .02em;
        cursor: pointer;
        transition: transform .2s ease, box-shadow .2s ease, background .2s ease;
      `,
      '.btn:active': `transform: scale(.95);`,
      '.gold': `
        background: linear-gradient(135deg, #FFD700, #FFAA00);
        color: #111;
        box-shadow: 0 0 28px rgba(255, 204, 0, .45);
      `,
      '.gold:hover': `
        transform: translateY(-3px) scale(1.04);
        box-shadow: 0 0 45px rgba(255, 204, 0, .7);
      `,
      '.ghost': `
        background: transparent;
        color: #FFCC00;
        border: 2px solid #FFCC00;
      `,
      '.ghost:hover': `background: rgba(255, 204, 0, .12);`,

      /* --- celebration (everything slides/pops in) --- */
      '.pre': `
        font-family: 'Manrope', sans-serif;
        font-weight: 600;
        color: #FFF3B0;
        letter-spacing: .35em;
        text-transform: uppercase;
        font-size: clamp(.6rem, 1.8vw, .85rem);
        margin-bottom: 1rem;
        animation: slideDown .7s ease both;
      `,
      '.hbd': `
        font-family: 'Playfair Display', Georgia, serif;
        font-size: clamp(2rem, 8vw, 5rem);
        font-weight: 800;
        letter-spacing: .12em;
        background-image: linear-gradient(90deg, #FFD700, #FFF3B0, #B8860B, #FFD700);
        background-size: 300% 100%;
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        animation: shimmer 3s linear infinite, slideDown .7s .1s ease both;
      `,
      '@keyframes shimmer': `
        0% { background-position: 0% 50%; }
        100% { background-position: 300% 50%; }
      `,
      '@keyframes slideDown': `
        from { opacity: 0; transform: translateY(-34px); }
        to   { opacity: 1; transform: translateY(0); }
      `,
      '.name': `
        font-family: 'Great Vibes', cursive;
        font-size: clamp(4rem, 14vw, 9rem);
        font-weight: 400;
        line-height: 1.1;
        background-image: linear-gradient(90deg, #FFCC00, #FFE44D, #FFF9DB, #FFCC00);
        background-size: 300% 100%;
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        animation: shimmer 3s linear infinite, pop .8s .25s cubic-bezier(.2,1.4,.4,1) both;
      `,
      '@keyframes pop': `
        0% { transform: scale(0) rotate(-6deg); opacity: 0; }
        100% { transform: scale(1) rotate(0); opacity: 1; }
      `,
      '.cake': `
        font-size: clamp(3.5rem, 10vw, 6rem);
        margin: .8rem 0 1.2rem;
        animation: cakeBounce 1.6s .9s ease-in-out infinite alternate;
        filter: drop-shadow(0 0 25px rgba(255, 204, 0, .4));
      `,
      '@keyframes cakeBounce': `
        0% { transform: translateY(0) scale(1); }
        100% { transform: translateY(-14px) scale(1.06); }
      `,
      '.wish-line': `
        font-family: 'Manrope', sans-serif;
        font-weight: 500;
        color: #f5e9c8;
        font-size: clamp(.95rem, 2.4vw, 1.2rem);
        margin: .25rem 0;
        opacity: 0;
        animation: fadeUp .8s ease forwards;
      `,
      '.w1': `animation-delay: .6s;`,
      '.w2': `animation-delay: 1.3s;`,
      '.w3': `animation-delay: 2s;`,
      '@keyframes fadeUp': `
        from { opacity: 0; transform: translateY(18px); }
        to   { opacity: 1; transform: translateY(0); }
      `,
      '.hint': `
        font-family: 'Manrope', sans-serif;
        margin: 1.4rem 0 1.6rem;
        color: #8a7f57;
        font-size: .85rem;
        letter-spacing: .08em;
        animation: fadeUp .8s 2.6s ease both;
      `
    }
  };
});

export default Main;
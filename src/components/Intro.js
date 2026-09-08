/* ============================================================
   INTRO — Typewriter with a "ghost" sizing layer so the caret
   is perfectly locked to the text (no re-centering jitter).
   ============================================================ */

import { Component } from 'valen';

const INTRO_LINES = [
  'Hey Damilola... 💛',
  'Something magical is in the air today ✨',
  'The stars aligned, the cake is baked...',
  'Are you ready for your surprise?'
];

const Intro = Component(function Intro() {
  let startup = true, runLine;
  return {
    state: { line: '', ghost: '', lineClass: 'below', cursorClass: 'blink' },

    template: `
      <div class="intro">
        <p class="intro-line [ lineClass ]">
          <span class="ghost" aria-hidden="true">[ ghost ]</span>
          <span class="typed">[ line ]<span class="cursor [ cursorClass ]"></span></span>
        </p>
      </div>
    `,

    created(state) {
      const TYPE = 55, HOLD = 1000, SLIDE = 520;
      let li = 0;

      runLine = () => {
        if (li >= INTRO_LINES.length) {
          setTimeout(() => document.dispatchEvent(new Event('valen:intro-done')), 250);
          return;
        }
        const text = INTRO_LINES[li];

        // 1. while invisible: set final width (ghost), park below
        state.line = '';
        state.ghost = text;
        state.lineClass = 'below';
        state.cursorClass = 'blink';

        setTimeout(() => {
          // 2. slide up into center
          state.lineClass = '';

          setTimeout(() => {
            // 3. type — caret solid, text never shifts backward
            state.cursorClass = '';
            let ci = 0;
            const type = () => {
              ci++;
              state.line = text.slice(0, ci);
              if (ci < text.length) {
                setTimeout(type, TYPE);
              } else {
                li++;
                // 4. hold (caret blinks), then slide up & out
                state.cursorClass = 'blink';
                setTimeout(() => {
                  state.lineClass = 'out';
                  setTimeout(runLine, SLIDE);
                }, HOLD);
              }
            };
            type();
          }, SLIDE);
        }, startup ? 60 : 300);
      };
      
    },
    
    run(){
      setTimeout(runLine, 100);
      startup = true;
    },

    stylesheet: {
      '.intro': `
        width: 100%;
        text-align: center;
        padding-inline: 6%;
        margin-top: -20%;
      `,
      '.intro-line': `
        position: relative;
        display: inline-block;
        max-width: 100%;
        margin: 0;
        line-height: 1.4;
        text-align: left;
        font-family: 'Playfair Display', Georgia, serif;
        font-size: clamp(1.45rem, 4.6vw, 2.4rem);
        font-weight: 600;
        color: #FFCC00;
        text-shadow: 0 0 24px rgba(255, 204, 0, .35);
        transition: transform .5s cubic-bezier(.22,.9,.3,1.05), opacity .5s ease;
        will-change: transform, opacity;
      `,
      '.intro-line.out': `
        transform: translateY(-48px) scale(.82);
        opacity: 0;
      `,
      '.intro-line.below': `
        transform: translateY(48px) scale(.9);
        opacity: 0;
        transition: none;
      `,
      '.ghost': `
        visibility: hidden;
        padding-right: 5px;
      `,
      '.typed': `
        position: absolute;
        inset: 0;
        text-align: left;
      `,
      '.cursor': `
        display: inline-block;
        width: 3px;
        height: 1.05em;
        margin-left: 2px;
        vertical-align: -0.18em;
        border-radius: 2px;
        background: #FFD700;
        box-shadow: 0 0 10px rgba(255, 215, 0, .6);
      `,
      '.blink': `
        animation: blink .6s step-end infinite;
      `,
      '@keyframes blink': `50% { opacity: 0; }`
    }
  };
});

export default Intro;
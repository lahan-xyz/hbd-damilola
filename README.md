# Happy Birthday, Damilola 💛

A beautiful interactive birthday surprise built with [Valen](https://github.com/lahan-xyz/valen).


## Features

- ✨ Typewriter intro animation with ghost-sizing (no layout jitter)
- 🎯 Interactive "Yes/No" — the "No" button dodges your cursor
- 🎊 Confetti rain + click-to-burst fireworks
- 🎈 Floating emoji balloons
- 🔊 Background music with toggle
- 📱 Fully responsive, mobile-friendly design
- 🌑 Elegant black & gold palette

## Architecture

Components are organized as ES modules. Each component self-registers with Valen via `Component(Name)` at the module level. Shared concerns (audio, FX) live in `js/` as utility modules. Global styles (resets, body background) are extracted to `css/global.css` while component-specific styles remain in their respective Valen `stylesheet` definitions.

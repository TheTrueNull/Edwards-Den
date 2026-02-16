# Edward Orlov - Retro TV Portfolio

A sleek, retro-themed portfolio website featuring a classic CRT TV aesthetic with authentic turn-on animations and sound effects.

## Features

- **Retro TV Interface**: Complete with TV frame, knobs, power button, and stand
- **CRT Effects**: Scanlines, phosphor glow, static overlay, and screen curvature
- **Turn-On Animation**: Authentic TV power-on sequence with progressive loading
- **Retro Sound Effects**: Generated audio including static, power-on pop, and click sounds
- **Expandable Project Cards**: Click to reveal project details and screenshots
- **Responsive Design**: Works on desktop and mobile devices

## Quick Start

1. Open `index.html` in a web browser
2. Click the **POWER** button (or press **Spacebar**) to turn on the TV
3. Watch the loading sequence with retro effects
4. Explore the portfolio content

## Adding Screenshots

Place your project screenshots in the `screenshots/` folder:

```
screenshots/
├── ai-docs-1.png      (AI Documentation Tool)
├── election-1.png     (Election System Dashboard)
├── election-2.png     (Election Voting Interface)
└── ai-ml-1.png        (ML Model Results)
```

## TV Controls

- **POWER**: Turn on the TV
- **CH ▲/▼**: Click for sound effects
- **SCAN**: Toggle scanline effect
- **STATIC**: Toggle static overlay

## Keyboard Shortcuts

- **Spacebar**: Turn on TV (when off)
- **Escape**: Close screenshot modal

## File Structure

```
Ben Project/
├── index.html          (Main HTML structure)
├── styles.css          (All styling and animations)
├── script.js           (Interactions and sound generation)
├── screenshots/        (Project screenshots folder)
│   └── README.txt      (Screenshot naming guide)
└── README.md           (This file)
```

## Browser Compatibility

Works best in modern browsers:
- Chrome (recommended)
- Firefox
- Edge
- Safari

Note: Sound effects require user interaction (click) before they can play due to browser autoplay policies.

## Customization

### Changing Colors

Edit the CSS variables in `styles.css`:

```css
:root {
    --tv-beige: #c4b59d;
    --text-green: #00ff41;
    --text-amber: #ffb000;
    --text-cyan: #00ffff;
}
```

### Adding More Projects

Copy a `.project-card` block in `index.html` and update the content and IDs.

---

Built with vanilla HTML, CSS, and JavaScript. No frameworks required.

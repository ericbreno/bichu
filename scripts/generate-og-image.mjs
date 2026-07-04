import sharp from "sharp";
import { writeFileSync } from "node:fs";

// Brand OG image for Bichu — 1200×630.
// Palette mirrored from src/app/globals.css; paw mark mirrored from public/favicon.svg.
// Regenerate after brand changes:  npm exec -- node scripts/generate-og-image.mjs
const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" font-family="Helvetica, 'Helvetica Neue', Arial, sans-serif" text-rendering="geometricPrecision">
  <defs>
    <!-- Paw mark reused from favicon.svg: 4 toe pads + bean-shaped main pad. -->
    <symbol id="paw" overflow="visible">
      <ellipse cx="-13" cy="-21" rx="4.4" ry="5.5"/>
      <ellipse cx="-4.5" cy="-24.5" rx="4.2" ry="5.3"/>
      <ellipse cx="4.5" cy="-24.5" rx="4.2" ry="5.3"/>
      <ellipse cx="13" cy="-21" rx="4.4" ry="5.5"/>
      <path d="M0,-14 C9,-14 16,-10 16,-3 C17,8 12,17 0,19 C-12,17 -17,8 -16,-3 C-16,-10 -9,-14 0,-14 Z"/>
    </symbol>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f8f5ef"/>
      <stop offset="1" stop-color="#eef0e9"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Decorative paws (sage, faint) top-right -->
  <g fill="#c7d8c6" opacity="0.55">
    <use href="#paw" transform="translate(1040,120) scale(3.1) rotate(-12)"/>
    <use href="#paw" transform="translate(1130,250) scale(2.2) rotate(8)"/>
  </g>
  <!-- Decorative paws (primary, faint) bottom-right -->
  <g fill="#7aa6a1" opacity="0.18">
    <use href="#paw" transform="translate(980,500) scale(4.4) rotate(14)"/>
    <use href="#paw" transform="translate(1110,470) scale(2.6) rotate(-6)"/>
  </g>

  <!-- Brand badge: teal disc with white paw -->
  <g transform="translate(96,120)">
    <circle cx="74" cy="74" r="74" fill="#7aa6a1"/>
    <g fill="#fffdf9" transform="translate(74,86) scale(2.55)"><use href="#paw"/></g>
  </g>

  <!-- Wordmark -->
  <text x="92" y="345" font-size="156" font-weight="800" letter-spacing="-5" fill="#2f3a39">Bichu</text>

  <!-- Accent rule -->
  <rect x="96" y="380" width="96" height="8" rx="4" fill="#e4b363"/>

  <!-- Tagline -->
  <text x="96" y="438" font-size="40" font-weight="700" fill="#2f3a39">Descubra o animal secreto a cada chute.</text>
  <text x="96" y="482" font-size="30" font-weight="500" fill="#868885">Classe · dieta · habitat · peso e muito mais</text>

  <!-- Gameplay motif: clue-colored chips -->
  <g transform="translate(96,520)">
    <rect x="0"   y="0" width="54" height="54" rx="12" fill="#b8e6b8"/>
    <rect x="70"  y="0" width="54" height="54" rx="12" fill="#ffe8a3"/>
    <rect x="140" y="0" width="54" height="54" rx="12" fill="#f7b5b5"/>
    <rect x="210" y="0" width="54" height="54" rx="12" fill="#b8ddf8"/>
  </g>

  <!-- Domain -->
  <g transform="translate(96,606)">
    <circle cx="11" cy="-9" r="6" fill="#7aa6a1"/>
    <text x="28" y="0" font-size="28" font-weight="600" fill="#7aa6a1">bi-chuu.web.app</text>
  </g>
</svg>`;

const png = await sharp(Buffer.from(svg), { density: 384 })
  .resize(1200, 630, { fit: "fill" })
  .png()
  .toBuffer();

const out = "public/og-image.png";
writeFileSync(out, png);
const meta = await sharp(png).metadata();
console.log(`wrote ${out} — ${meta.width}×${meta.height} ${meta.format}`);

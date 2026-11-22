import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const assetsDir = path.join(rootDir, 'assets');
const iconsDir = path.join(assetsDir, 'icons');
const pixelDir = path.join(assetsDir, 'pixelart');
const logosDir = path.join(assetsDir, 'logos');

[iconsDir, pixelDir, logosDir].forEach(d => fs.mkdirSync(d, { recursive: true }));

// Palette definition for SVG graphics
const COLORS = {
  mint: '#6AE5B5',
  pink: '#FF85B8',
  cyan: '#56B7EC',
  violet: '#5E26F6',
  yellow: '#F3F99D',
  white: '#FFFFFF',
  dark: '#09090B',
  surface: '#121217',
  border: '#23232E',
  indigo: '#0D0B14'
};

// 1. Vector Logo / Mark: Modern Clean Axolotl (Round Minimalist Badge)
function generateVectorLogoSvg({ size = 512, withBg = true, bgRadius = 112 } = {}) {
  const bg = withBg
    ? `<rect width="${size}" height="${size}" rx="${bgRadius}" fill="url(#bgGrad)"/>
       <rect width="${size}" height="${size}" rx="${bgRadius}" fill="none" stroke="${COLORS.mint}" stroke-width="4" stroke-opacity="0.25"/>`
    : '';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0E0C18"/>
      <stop offset="100%" stop-color="#07060A"/>
    </linearGradient>
    <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${COLORS.pink}"/>
      <stop offset="100%" stop-color="#E05297"/>
    </linearGradient>
    <linearGradient id="frillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${COLORS.violet}"/>
      <stop offset="50%" stop-color="#9146FF"/>
      <stop offset="100%" stop-color="${COLORS.pink}"/>
    </linearGradient>
    <linearGradient id="mintGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${COLORS.mint}"/>
      <stop offset="100%" stop-color="${COLORS.cyan}"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="10" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>
  ${bg}

  <!-- Glow effect -->
  <g filter="url(#glow)" opacity="0.6">
    <ellipse cx="256" cy="270" rx="140" ry="115" fill="none" stroke="${COLORS.pink}" stroke-width="12"/>
  </g>

  <!-- Axolotl Feathery Gills (Left) -->
  <g id="gills-left">
    <!-- Top Gill -->
    <path d="M 140 220 C 70 180, 55 240, 110 250 C 70 255, 60 300, 125 285 C 80 310, 95 345, 145 315"
          fill="none" stroke="url(#frillGrad)" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- Gill accents -->
    <circle cx="80" cy="205" r="10" fill="${COLORS.cyan}"/>
    <circle cx="65" cy="275" r="12" fill="${COLORS.mint}"/>
    <circle cx="85" cy="335" r="10" fill="${COLORS.violet}"/>
  </g>

  <!-- Axolotl Feathery Gills (Right) -->
  <g id="gills-right" transform="translate(512, 0) scale(-1, 1)">
    <!-- Top Gill -->
    <path d="M 140 220 C 70 180, 55 240, 110 250 C 70 255, 60 300, 125 285 C 80 310, 95 345, 145 315"
          fill="none" stroke="url(#frillGrad)" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- Gill accents -->
    <circle cx="80" cy="205" r="10" fill="${COLORS.cyan}"/>
    <circle cx="65" cy="275" r="12" fill="${COLORS.mint}"/>
    <circle cx="85" cy="335" r="10" fill="${COLORS.violet}"/>
  </g>

  <!-- Head / Body Base -->
  <path d="M 130 265 C 130 170, 382 170, 382 265 C 382 365, 130 365, 130 265 Z"
        fill="url(#bodyGrad)"/>

  <!-- Cheeks / Blushing Spots -->
  <circle cx="175" cy="295" r="18" fill="${COLORS.violet}" opacity="0.4"/>
  <circle cx="337" cy="295" r="18" fill="${COLORS.violet}" opacity="0.4"/>
  <circle cx="175" cy="295" r="10" fill="${COLORS.mint}" opacity="0.8"/>
  <circle cx="337" cy="295" r="10" fill="${COLORS.mint}" opacity="0.8"/>

  <!-- Big Sparkly Eyes -->
  <g id="eyes">
    <!-- Left Eye -->
    <circle cx="195" cy="245" r="26" fill="#0C0E16"/>
    <circle cx="195" cy="245" r="23" fill="#181528"/>
    <circle cx="187" cy="237" r="10" fill="${COLORS.mint}"/>
    <circle cx="205" cy="255" r="5" fill="${COLORS.white}"/>

    <!-- Right Eye -->
    <circle cx="317" cy="245" r="26" fill="#0C0E16"/>
    <circle cx="317" cy="245" r="23" fill="#181528"/>
    <circle cx="309" cy="237" r="10" fill="${COLORS.mint}"/>
    <circle cx="327" cy="255" r="5" fill="${COLORS.white}"/>
  </g>

  <!-- Happy Axolotl Curved Smile -->
  <path d="M 234 290 Q 256 312 278 290"
        fill="none" stroke="#0C0E16" stroke-width="8" stroke-linecap="round"/>

  <!-- Magic Sparkle Forehead Crown -->
  <path d="M 256 160 L 261 178 L 279 183 L 261 188 L 256 206 L 251 188 L 233 183 L 251 178 Z"
        fill="${COLORS.mint}"/>
</svg>
`;
}

// 2. Pixel Art Axolotl SVG (16x16 and 32x32 Grid for Crisp Scaling)
// Color map for 16x16 Pixel Grid:
// . = transparent
// P = Pink (#FF85B8)
// D = Deep Pink / Darker Magenta (#D84080)
// V = Violet (#5E26F6)
// M = Mint (#6AE5B5)
// C = Cyan (#56B7EC)
// B = Black / Eye (#09090B)
// W = White highlight (#FFFFFF)
// Y = Yellow (#F3F99D)

const PIXEL_16 = [
  "....V......V....", // 0
  "..C.P.V..V.P.C..", // 1  gills top
  ".M.D.P.PP.P.D.M.", // 2  gills mid & head top
  "..C.PPPPPPPP.C..", // 3  head upper
  "...PPPPPPPPPP...", // 4  head center
  "..V.PBP..PBP.V..", // 5  eyes
  "...PMPPPPPMP....", // 6  mint blush
  "...PPPPPPPPPP...", // 7  cheeks
  "....PP.MM.PP....", // 8  mint smile
  ".....PPPPPP.....", // 9  chin
  "....PPPPPPPP....", // 10 body upper
  "...PP.PPPP.PP...", // 11 hands
  "...PPPPPPPPPP...", // 12 belly
  "....PPPPPPPP....", // 13 lower body
  ".....PP..PP.....", // 14 feet
  "....MM....MM...."  // 15 cute mint toes
];

const COLOR_MAP_16 = {
  P: COLORS.pink,
  D: '#D84080',
  V: COLORS.violet,
  M: COLORS.mint,
  C: COLORS.cyan,
  B: '#09090B',
  W: COLORS.white,
  Y: COLORS.yellow
};

function generatePixelArtSvg(pixelGrid, colorMap, scale = 16, withBg = false) {
  const width = pixelGrid[0].length * scale;
  const height = pixelGrid.length * scale;

  let rects = '';
  if (withBg) {
    rects += `<rect width="${width}" height="${height}" rx="${scale * 2}" fill="#0D0B14"/>\n`;
  }

  for (let y = 0; y < pixelGrid.length; y++) {
    const row = pixelGrid[y];
    for (let x = 0; x < row.length; x++) {
      const char = row[x];
      if (char !== '.' && colorMap[char]) {
        rects += `  <rect x="${x * scale}" y="${y * scale}" width="${scale}" height="${scale}" fill="${colorMap[char]}"/>\n`;
      }
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" shape-rendering="crispEdges">
${rects}</svg>
`;
}

// 3. Compact Horizontal Wordmark + Icon (for Herdr Header / Readmes / Banners)
function generateHeaderBadgeSvg({ width = 160, height = 32 } = {}) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${COLORS.pink}"/>
      <stop offset="50%" stop-color="${COLORS.mint}"/>
      <stop offset="100%" stop-color="${COLORS.cyan}"/>
    </linearGradient>
  </defs>

  <!-- Axolotl Mini Face Icon -->
  <g transform="translate(2, 4) scale(0.047)">
    <!-- Gills -->
    <path d="M 60 160 C 20 120, 10 180, 50 190 C 15 200, 10 240, 60 225" fill="none" stroke="${COLORS.violet}" stroke-width="24" stroke-linecap="round"/>
    <path d="M 452 160 C 492 120, 502 180, 462 190 C 497 200, 502 240, 452 225" fill="none" stroke="${COLORS.violet}" stroke-width="24" stroke-linecap="round"/>
    <circle cx="15" cy="130" r="14" fill="${COLORS.cyan}"/>
    <circle cx="497" cy="130" r="14" fill="${COLORS.cyan}"/>

    <!-- Head -->
    <ellipse cx="256" cy="256" rx="170" ry="125" fill="${COLORS.pink}"/>

    <!-- Eyes -->
    <circle cx="185" cy="240" r="28" fill="#09090B"/>
    <circle cx="178" cy="232" r="11" fill="${COLORS.mint}"/>
    <circle cx="327" cy="240" r="28" fill="#09090B"/>
    <circle cx="320" cy="232" r="11" fill="${COLORS.mint}"/>

    <!-- Cheeks -->
    <circle cx="150" cy="285" r="14" fill="${COLORS.mint}" opacity="0.85"/>
    <circle cx="362" cy="285" r="14" fill="${COLORS.mint}" opacity="0.85"/>

    <!-- Smile -->
    <path d="M 226 280 Q 256 304 286 280" fill="none" stroke="#09090B" stroke-width="10" stroke-linecap="round"/>
  </g>

  <!-- Text: Axolotl -->
  <text x="34" y="21" font-family="'Geist Mono', 'Monaspace Neon', monospace" font-size="14" font-weight="700" fill="url(#textGrad)" letter-spacing="0.5">Axolotl</text>
  <rect x="100" y="8" width="48" height="15" rx="4" fill="${COLORS.violet}" fill-opacity="0.3" stroke="${COLORS.violet}" stroke-width="1"/>
  <text x="124" y="19" font-family="monospace" font-size="8.5" font-weight="bold" fill="${COLORS.mint}" text-anchor="middle">ARCANE</text>
</svg>
`;
}

// 4. Square App Icon for Herdr Header Sidebar (24x24 and 48x48)
function generateHerdrSidebarIconSvg() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <defs>
    <linearGradient id="sidebarBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#19152B"/>
      <stop offset="100%" stop-color="#0E0B1A"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="14" fill="url(#sidebarBg)" stroke="${COLORS.violet}" stroke-width="2"/>

  <!-- Left Gill -->
  <path d="M 18 26 C 9 20, 8 28, 14 31 C 8 33, 9 40, 16 38" fill="none" stroke="${COLORS.violet}" stroke-width="3" stroke-linecap="round"/>
  <circle cx="8" cy="20" r="2" fill="${COLORS.cyan}"/>
  <circle cx="6" cy="30" r="2.2" fill="${COLORS.mint}"/>

  <!-- Right Gill -->
  <path d="M 46 26 C 55 20, 56 28, 50 31 C 56 33, 55 40, 48 38" fill="none" stroke="${COLORS.violet}" stroke-width="3" stroke-linecap="round"/>
  <circle cx="56" cy="20" r="2" fill="${COLORS.cyan}"/>
  <circle cx="58" cy="30" r="2.2" fill="${COLORS.mint}"/>

  <!-- Head -->
  <ellipse cx="32" cy="35" rx="20" ry="15" fill="${COLORS.pink}"/>

  <!-- Cheeks -->
  <circle cx="20" cy="38" r="2.5" fill="${COLORS.mint}"/>
  <circle cx="44" cy="38" r="2.5" fill="${COLORS.mint}"/>

  <!-- Eyes -->
  <circle cx="25" cy="33" r="3.5" fill="#09090B"/>
  <circle cx="24" cy="32" r="1.3" fill="${COLORS.mint}"/>
  <circle cx="39" cy="33" r="3.5" fill="#09090B"/>
  <circle cx="38" cy="32" r="1.3" fill="${COLORS.mint}"/>

  <!-- Smile -->
  <path d="M 29 38 Q 32 41 35 38" fill="none" stroke="#09090B" stroke-width="1.8" stroke-linecap="round"/>

  <!-- Mini Sparkle -->
  <polygon points="32,21 33,23.5 35.5,24.5 33,25.5 32,28 31,25.5 28.5,24.5 31,23.5" fill="${COLORS.mint}"/>
</svg>
`;
}

// Generate files!
console.log('Generating Axolotl brand assets...');

// Logos
fs.writeFileSync(path.join(logosDir, 'axolotl-logo.svg'), generateVectorLogoSvg({ size: 512, withBg: true }));
fs.writeFileSync(path.join(logosDir, 'axolotl-mark.svg'), generateVectorLogoSvg({ size: 512, withBg: false }));
fs.writeFileSync(path.join(logosDir, 'axolotl-badge.svg'), generateHeaderBadgeSvg({ width: 160, height: 32 }));

// Pixel Art (16x16 base, scaled to 256x256 & 512x512)
fs.writeFileSync(path.join(pixelDir, 'axolotl-pixel-16.svg'), generatePixelArtSvg(PIXEL_16, COLOR_MAP_16, 16, false));
fs.writeFileSync(path.join(pixelDir, 'axolotl-pixel-card.svg'), generatePixelArtSvg(PIXEL_16, COLOR_MAP_16, 16, true));

// Icons (Favicons / App icons)
fs.writeFileSync(path.join(iconsDir, 'axolotl-icon-64.svg'), generateHerdrSidebarIconSvg());
fs.writeFileSync(path.join(iconsDir, 'favicon.svg'), generateHerdrSidebarIconSvg());

// Render PNGs via rsvg-convert & ImageMagick
console.log('Rendering high-resolution PNGs and Favicons...');

const renderPng = (svgPath, pngPath, size) => {
  try {
    execSync(`rsvg-convert -w ${size} -h ${size} "${svgPath}" -o "${pngPath}"`);
  } catch (err) {
    console.error(`Failed to convert ${svgPath}:`, err.message);
  }
};

renderPng(path.join(logosDir, 'axolotl-logo.svg'), path.join(logosDir, 'axolotl-logo-512.png'), 512);
renderPng(path.join(logosDir, 'axolotl-logo.svg'), path.join(logosDir, 'axolotl-logo-256.png'), 256);
renderPng(path.join(logosDir, 'axolotl-mark.svg'), path.join(logosDir, 'axolotl-mark-512.png'), 512);

renderPng(path.join(pixelDir, 'axolotl-pixel-16.svg'), path.join(pixelDir, 'axolotl-pixel-256.png'), 256);
renderPng(path.join(pixelDir, 'axolotl-pixel-16.svg'), path.join(pixelDir, 'axolotl-pixel-64.png'), 64);
renderPng(path.join(pixelDir, 'axolotl-pixel-16.svg'), path.join(pixelDir, 'axolotl-pixel-32.png'), 32);
renderPng(path.join(pixelDir, 'axolotl-pixel-16.svg'), path.join(pixelDir, 'axolotl-pixel-16.png'), 16);

renderPng(path.join(iconsDir, 'axolotl-icon-64.svg'), path.join(iconsDir, 'icon-64.png'), 64);
renderPng(path.join(iconsDir, 'axolotl-icon-64.svg'), path.join(iconsDir, 'icon-32.png'), 32);
renderPng(path.join(iconsDir, 'axolotl-icon-64.svg'), path.join(iconsDir, 'icon-16.png'), 16);

// Generate multi-resolution ICO for web favicons
try {
  execSync(`magick "${path.join(iconsDir, 'icon-16.png')}" "${path.join(iconsDir, 'icon-32.png')}" "${path.join(iconsDir, 'icon-64.png')}" "${path.join(iconsDir, 'favicon.ico')}"`);
  console.log('✅ Generated multi-size favicon.ico');
} catch (e) {
  console.log('Notice: favicon.ico generation skipped:', e.message);
}

console.log('Asset generation complete!');

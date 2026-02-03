# Favicon & PWA Icon Setup

This file explains how to generate all required favicon and PWA icon files from the existing `logo.svg`.

## Required Icon Files

Based on the manifest.json and index.html, you need to create the following files:

### Favicon Files
- `favicon.ico` - Multi-size ICO file (16x16, 32x32, 48x48)
- `favicon.svg` - Already exists ✓
- `apple-touch-icon.png` - 180x180 PNG
- `safari-pinned-tab.svg` - Monochrome SVG for Safari

### PWA Icon Files (from manifest.json)
- `icon-72x72.png`
- `icon-96x96.png`
- `icon-128x128.png`
- `icon-144x144.png`
- `icon-152x152.png`
- `icon-192x192.png` (PWA install icon)
- `icon-384x384.png`
- `icon-512x512.png` (Splash screen)

### Screenshots (Optional, for better PWA display)
- `screenshot-narrow.png` - Mobile screenshot (750x1334 or similar)
- `screenshot-wide.png` - Desktop screenshot (1280x800 or similar)

## Generation Methods

### Option 1: Online Tools (Recommended for quick setup)

1. **RealFaviconGenerator** (https://realfavicongenerator.net/)
   - Upload `logo.svg`
   - Configure theme color: #f97316 (orange-500)
   - Download package
   - Extract needed files to `/public/`

2. **Favicon.io** (https://favicon.io/)
   - Upload `logo.svg`
   - Download generated files

### Option 2: Command Line (Using ImageMagick)

```bash
# Install ImageMagick first
# macOS: brew install imagemagick
# Ubuntu: sudo apt-get install imagemagick

# Generate PNG icons from SVG
for size in 72 96 128 144 152 192 384 512; do
  convert -background none logo.svg -resize ${size}x${size} public/icon-${size}x${size}.png
done

# Generate Apple Touch Icon (180x180 with padding)
convert -background white logo.svg -resize 160x160 -gravity center -extent 180x180 public/apple-touch-icon.png

# Generate favicon.ico (multi-size)
convert -background none logo.svg -define icon:auto-resize=16,32,48 public/favicon.ico
```

### Option 3: Node.js Script (Sharp library)

```javascript
// scripts/generate-icons.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputSvg = path.join(__dirname, '../public/logo.svg');
const outputDir = path.join(__dirname, '../public');

async function generateIcons() {
  const svgBuffer = fs.readFileSync(inputSvg);
  
  // Generate PWA icons
  for (const size of sizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(outputDir, `icon-${size}x${size}.png`));
    console.log(`✓ Generated icon-${size}x${size}.png`);
  }
  
  // Generate Apple Touch Icon (with white background)
  await sharp(svgBuffer)
    .resize(160, 160)
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .extend({
      top: 10, bottom: 10, left: 10, right: 10,
      background: { r: 255, g: 255, b: 255 }
    })
    .png()
    .toFile(path.join(outputDir, 'apple-touch-icon.png'));
  console.log('✓ Generated apple-touch-icon.png');
  
  console.log('\n✅ All icons generated successfully!');
}

generateIcons().catch(console.error);
```

Then run:
```bash
npm install --save-dev sharp
node scripts/generate-icons.js
```

## Theme Color

The theme color used throughout the site is:
- **Hex**: `#f97316`
- **Tailwind**: `orange-500`
- **RGB**: `rgb(249, 115, 22)`

This color should be used for:
- Browser theme color (mobile Chrome)
- Windows tile color
- Safari pinned tab color

## Verification

After generating icons, verify:
1. All files exist in `/public/`
2. manifest.json loads without errors (check DevTools > Application > Manifest)
3. No 404 errors in DevTools Network tab
4. Install prompt appears on mobile (for PWA)

## Current Status

- ✅ `favicon.svg` - Exists
- ✅ `logo.svg` - Exists
- ⬜ `favicon.ico` - Needs generation
- ⬜ `apple-touch-icon.png` - Needs generation
- ⬜ `safari-pinned-tab.svg` - Needs generation
- ⬜ `icon-*.png` files - Need generation
- ⬜ Screenshots - Optional, add later

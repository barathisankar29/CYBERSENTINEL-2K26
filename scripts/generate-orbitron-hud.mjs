import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import opentype from 'opentype.js';

const SEAL_IMAGE_PATH = 'public/assets/about/vel-tech-seal.png';
const OUT_DIR = 'C:/Users/lakki/.gemini/antigravity-ide/brain/cd16c502-4ba9-455e-9fd7-eb221fa4929c';
const PUBLIC_BRANDING_DIR = 'public/assets/branding';

// Load Orbitron fonts
const fontBoldBuffer = fs.readFileSync('public/assets/fonts/orbitron/Orbitron-Bold.ttf');
const fontBold = opentype.parse(fontBoldBuffer.buffer.slice(fontBoldBuffer.byteOffset, fontBoldBuffer.byteOffset + fontBoldBuffer.byteLength));

const fontExtraBoldBuffer = fs.readFileSync('public/assets/fonts/orbitron/Orbitron-ExtraBold.ttf');
const fontExtraBold = opentype.parse(fontExtraBoldBuffer.buffer.slice(fontExtraBoldBuffer.byteOffset, fontExtraBoldBuffer.byteOffset + fontExtraBoldBuffer.byteLength));

function pathToSvgD(path) {
  let d = '';
  for (const cmd of path.commands) {
    if (cmd.type === 'M') d += `M${cmd.x.toFixed(2)},${cmd.y.toFixed(2)}`;
    else if (cmd.type === 'L') d += `L${cmd.x.toFixed(2)},${cmd.y.toFixed(2)}`;
    else if (cmd.type === 'C') d += `C${cmd.x1.toFixed(2)},${cmd.y1.toFixed(2)} ${cmd.x2.toFixed(2)},${cmd.y2.toFixed(2)} ${cmd.x.toFixed(2)},${cmd.y.toFixed(2)}`;
    else if (cmd.type === 'Q') d += `Q${cmd.x1.toFixed(2)},${cmd.y1.toFixed(2)} ${cmd.x.toFixed(2)},${cmd.y.toFixed(2)}`;
    else if (cmd.type === 'Z') d += 'Z';
  }
  return d;
}

function getFontPath(fontObj, text, targetCenterX, targetBaselineY, fontSize, letterSpacing = 0) {
  if (!letterSpacing) {
    const p = fontObj.getPath(text, 0, 0, fontSize);
    const bbox = p.getBoundingBox();
    const width = bbox.x2 - bbox.x1;
    const offsetX = targetCenterX - width / 2 - bbox.x1;
    const pathCentered = fontObj.getPath(text, offsetX, targetBaselineY, fontSize);
    return { d: pathToSvgD(pathCentered), width, bbox };
  } else {
    // Custom kerning / letter spacing
    let totalWidth = 0;
    const glyphs = fontObj.stringToGlyphs(text);
    for (let i = 0; i < glyphs.length; i++) {
      totalWidth += glyphs[i].advanceWidth * (fontSize / fontObj.unitsPerEm);
      if (i < glyphs.length - 1) totalWidth += letterSpacing;
    }
    let currentX = targetCenterX - totalWidth / 2;
    let combinedD = '';
    for (let i = 0; i < glyphs.length; i++) {
      const g = glyphs[i];
      const gPath = g.getPath(currentX, targetBaselineY, fontSize);
      combinedD += pathToSvgD(gPath) + ' ';
      currentX += g.advanceWidth * (fontSize / fontObj.unitsPerEm) + letterSpacing;
    }
    return { d: combinedD, width: totalWidth };
  }
}

async function renderBanner() {
  const boxExtra = 80;
  const width = 1140 + boxExtra; // 1220
  const height = 360;

  const cx = 195;
  const cy = 180;
  const sealSize = 226;

  const boxLeft = 370;
  const boxRight = 1080 + boxExtra; // 1160
  const boxCenterX = (boxLeft + boxRight) / 2; // 765

  // Orbitron typography matching the hero page Department text
  // Hero page uses Orbitron Bold (700/800) uppercase with subtle letter-spacing
  const pHeading = getFontPath(fontExtraBold, 'VEL TECH HIGH TECH', boxCenterX, 138, 33, 3);
  const pSubtitle = getFontPath(fontBold, 'DR. RANGARAJAN DR. SAKUNTHALA ENGINEERING COLLEGE', boxCenterX, 192, 17, 1);
  const pTag = getFontPath(fontBold, 'AN AUTONOMOUS INSTITUTION', boxCenterX, 236, 12.5, 3.5);

  const svgHud = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Gradients matching website theme: Cyan -> Violet -> Magenta -->
      <linearGradient id="cyberGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#00F0FF" />
        <stop offset="45%" stop-color="#22D3EE" />
        <stop offset="75%" stop-color="#A855F7" />
        <stop offset="100%" stop-color="#FF007F" />
      </linearGradient>

      <linearGradient id="portalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#00F0FF" />
        <stop offset="50%" stop-color="#7C3AED" />
        <stop offset="100%" stop-color="#FF007F" />
      </linearGradient>

      <!-- Intense Neon Glow Filters -->
      <filter id="neonCyan" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="2.5" result="blur1" />
        <feGaussianBlur stdDeviation="6" result="blur2" />
        <feMerge>
          <feMergeNode in="blur2" />
          <feMergeNode in="blur1" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      <filter id="neonMagenta" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="3" result="blur1" />
        <feGaussianBlur stdDeviation="8" result="blur2" />
        <feMerge>
          <feMergeNode in="blur2" />
          <feMergeNode in="blur1" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      <filter id="textGlowWhite" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="3.5" result="blur" />
        <feColorMatrix type="matrix" values="
          0 0 0 0 0
          0 0 0 0 0.95
          0 0 0 0 1
          0 0 0 0.85 0" result="cyanGlow" />
        <feMerge>
          <feMergeNode in="cyanGlow" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <!-- 1. LEFT PORTAL: Clean Sci-Fi Ring with Enlarged Logo -->
    <g filter="url(#neonCyan)">
      <circle cx="${cx}" cy="${cy}" r="142" fill="none" stroke="url(#portalGrad)" stroke-width="3" opacity="0.85" />
      <circle cx="${cx}" cy="${cy}" r="148" fill="none" stroke="#00F0FF" stroke-width="1.8" stroke-dasharray="16 10 5 10" opacity="0.65" />
      <circle cx="${cx}" cy="${cy}" r="134" fill="none" stroke="#A855F7" stroke-width="1.2" opacity="0.5" />

      <circle cx="${cx}" cy="${cy}" r="${sealSize/2 + 3}" fill="none" stroke="#00F0FF" stroke-width="2.5" opacity="0.9" />
      <circle cx="${cx}" cy="${cy}" r="${sealSize/2 + 6}" fill="none" stroke="#FF007F" stroke-width="1.2" stroke-dasharray="8 6" opacity="0.75" />
    </g>

    <circle cx="${cx}" cy="${cy}" r="144" fill="none" stroke="#00F0FF" stroke-width="8" opacity="0.22" filter="url(#neonCyan)" />
    <circle cx="${cx}" cy="${cy}" r="125" fill="none" stroke="#A855F7" stroke-width="5" opacity="0.22" filter="url(#neonMagenta)" />

    <!-- Connector rails bridging Portal to Box -->
    <g filter="url(#neonCyan)">
      <line x1="${cx + 140}" y1="${cy - 95}" x2="${boxLeft}" y2="${cy - 95}" stroke="#00F0FF" stroke-width="2.5" />
      <line x1="${cx + 140}" y1="${cy + 85}" x2="${boxLeft}" y2="${cy + 85}" stroke="#00F0FF" stroke-width="2.5" />
    </g>

    <!-- 2. RIGHT HUD FRAME: Sci-Fi Tactical Cyber Box -->
    <g filter="url(#neonCyan)">
      <path d="
        M ${boxLeft} 85
        L ${boxLeft + 105} 85
        L ${boxLeft + 140} 50
        L ${boxRight - 145} 50
        L ${boxRight - 110} 82
        L ${boxRight - 40} 82
        L ${boxRight} 122
        L ${boxRight} 248
        L ${boxRight - 40} 288
        L ${boxLeft + 95} 288
        L ${boxLeft + 60} 253
        L ${boxLeft} 253
        Z
      " fill="none" stroke="url(#cyberGrad)" stroke-width="2.8" stroke-linejoin="round" />

      <path d="
        M ${boxLeft + 20} 96
        L ${boxLeft + 99} 96
        L ${boxLeft + 134} 62
        L ${boxRight - 155} 62
        L ${boxRight - 123} 94
        L ${boxRight - 50} 94
        L ${boxRight - 15} 129
        L ${boxRight - 15} 240
        L ${boxRight - 50} 275
        L ${boxLeft + 105} 275
        L ${boxLeft + 70} 240
        L ${boxLeft + 20} 240
        Z
      " fill="none" stroke="#00F0FF" stroke-width="1.2" opacity="0.55" stroke-linejoin="round" />

      <path d="M ${boxCenterX - 40} 62 L ${boxCenterX + 120} 62 L ${boxCenterX + 100} 78 L ${boxCenterX - 60} 78 Z" fill="#00F0FF" opacity="0.85" />
      <path d="M ${boxCenterX + 130} 64 L ${boxCenterX + 185} 64" stroke="#00F0FF" stroke-width="2" opacity="0.8" />

      <g stroke="#00F0FF" stroke-width="3" stroke-linecap="round" opacity="0.95">
        <line x1="${boxLeft + 125}" y1="85" x2="${boxLeft + 139}" y2="71" />
        <line x1="${boxLeft + 139}" y1="85" x2="${boxLeft + 153}" y2="71" />
        <line x1="${boxLeft + 153}" y1="85" x2="${boxLeft + 167}" y2="71" />
      </g>

      <g stroke="#FF007F" stroke-width="3" stroke-linecap="round" opacity="0.9">
        <line x1="${boxLeft + 65}" y1="275" x2="${boxLeft + 79}" y2="289" />
        <line x1="${boxLeft + 79}" y1="275" x2="${boxLeft + 93}" y2="289" />
      </g>

      <line x1="${boxLeft + 135}" y1="272" x2="${boxRight - 80}" y2="272" stroke="#00F0FF" stroke-width="1" opacity="0.5" />
      <circle cx="${boxCenterX}" cy="272" r="3" fill="#00F0FF" />
      <circle cx="${boxLeft + 135}" cy="272" r="2.5" fill="#A855F7" />
      <circle cx="${boxRight - 80}" cy="272" r="2.5" fill="#FF007F" />

      <path d="M ${boxRight - 30} 72 L ${boxRight + 10} 112 L ${boxRight + 10} 155" fill="none" stroke="#FF007F" stroke-width="2" opacity="0.85" />
      <path d="M ${boxRight + 10} 220 L ${boxRight + 10} 260 L ${boxRight - 30} 300" fill="none" stroke="#00F0FF" stroke-width="2" opacity="0.85" />
    </g>

    <!-- 3. TYPOGRAPHY: Exact Orbitron Font Matching Hero Department -->
    <!-- Heading: VEL TECH HIGH TECH (Orbitron ExtraBold, White with Cyan Ambient Glow) -->
    <g fill="#FFFFFF" filter="url(#textGlowWhite)">
      <path d="${pHeading.d}" />
    </g>

    <!-- Subtitle: Dr. Rangarajan Dr. Sakunthala Engineering College (Orbitron Bold, Electric Cyan, Enlarged) -->
    <g fill="#00F0FF" stroke="#00F0FF" stroke-width="0.3" filter="url(#neonCyan)">
      <path d="${pSubtitle.d}" />
    </g>

    <!-- Tag: AN AUTONOMOUS INSTITUTION (Orbitron Bold, Silver-White) -->
    <g fill="#E2E8F0" filter="url(#neonCyan)">
      <path d="${pTag.d}" />
    </g>

    <!-- Mini decorative neon diamonds beside the tag -->
    <polygon points="${boxCenterX - pTag.width/2 - 20},232 ${boxCenterX - pTag.width/2 - 16},228 ${boxCenterX - pTag.width/2 - 12},232 ${boxCenterX - pTag.width/2 - 16},236" fill="#00F0FF" filter="url(#neonCyan)" />
    <polygon points="${boxCenterX + pTag.width/2 + 12},232 ${boxCenterX + pTag.width/2 + 16},228 ${boxCenterX + pTag.width/2 + 20},232 ${boxCenterX + pTag.width/2 + 16},236" fill="#FF007F" filter="url(#neonCyan)" />
  </svg>
  `;

  const sealCircleMask = `
  <svg width="${sealSize}" height="${sealSize}">
    <circle cx="${sealSize/2}" cy="${sealSize/2}" r="${sealSize/2}" fill="#fff"/>
  </svg>
  `;

  const maskedSeal = await sharp(SEAL_IMAGE_PATH)
    .resize(sealSize, sealSize, { fit: 'contain' })
    .composite([{ input: Buffer.from(sealCircleMask), blend: 'dest-in' }])
    .png()
    .toBuffer();

  const sealLeft = Math.round(cx - sealSize / 2);
  const sealTop = Math.round(cy - sealSize / 2);

  // 100% TRANSPARENT base canvas: alpha = 0 everywhere
  const finalTransparentPng = await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
    .composite([
      {
        input: Buffer.from(svgHud),
        top: 0,
        left: 0,
      },
      {
        input: maskedSeal,
        top: sealTop,
        left: sealLeft,
      }
    ])
    .png()
    .toBuffer();

  // Save to public branding paths as lossless WebP
  const targetLogoWebp = path.join(PUBLIC_BRANDING_DIR, 'vel-tech-high-tech-logo.webp');
  const targetFullLogoWebp = path.join(PUBLIC_BRANDING_DIR, 'vel-tech-high-tech-logo-full.webp');
  const targetLogoV2Webp = path.join(PUBLIC_BRANDING_DIR, 'vel-tech-high-tech-logo-v2.webp');
  const targetFullLogoV2Webp = path.join(PUBLIC_BRANDING_DIR, 'vel-tech-high-tech-logo-full-v2.webp');

  const webpBuffer = await sharp(finalTransparentPng)
    .webp({ quality: 100, alphaQuality: 100, lossless: true })
    .toBuffer();

  await sharp(webpBuffer).toFile(targetLogoWebp);
  await sharp(webpBuffer).toFile(targetFullLogoWebp);
  await sharp(webpBuffer).toFile(targetLogoV2Webp);
  await sharp(webpBuffer).toFile(targetFullLogoV2Webp);

  console.log('Successfully updated logo banner with Orbitron typography matching the hero department font!');
}

renderBanner().catch(console.error);

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

function getFontPathDirect(fontObj, text, targetCenterX, targetBaselineY, fontSize) {
  const p = fontObj.getPath(text, 0, 0, fontSize);
  const bbox = p.getBoundingBox();
  const width = bbox.x2 - bbox.x1;
  const offsetX = Math.round(targetCenterX - width / 2 - bbox.x1);
  const pathCentered = fontObj.getPath(text, offsetX, Math.round(targetBaselineY), fontSize);
  const d = pathCentered.toPathData(2).replace(/NaN/g, '0');
  return { d, width, bbox };
}

async function renderPinkSimpleBanner() {
  const width = 1420;
  const height = 360;

  const cx = 185;
  const cy = 180;
  const sealSize = 270;       // Big logo seal completely filling the circle
  const circleRadius = 136;   // Clean single ring hugging the seal snugly (zero empty gap)

  const boxLeft = 340;
  const boxRight = 1370;
  const boxCenterX = Math.round((boxLeft + boxRight) / 2);

  // Line 1 & Line 2 made same size/prominence; Line 3 left as it is
  const pHeading = getFontPathDirect(fontExtraBold, 'VEL TECH HIGH TECH', boxCenterX, 132, 28);
  const pSubtitle = getFontPathDirect(fontBold, 'DR. RANGARAJAN DR. SAKUNTHALA ENGINEERING COLLEGE', boxCenterX, 192, 27);
  const pTag = getFontPathDirect(fontBold, 'AN AUTONOMOUS INSTITUTION', boxCenterX, 238, 13);
  const tagHalfWidth = Math.round(pTag.width / 2);

  const railsX = cx + circleRadius - 2;

  const svgHud = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Pink Cyberpunk Theme Gradients matching website: Hot Pink -> Magenta -> Violet -->
      <linearGradient id="pinkCyberGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#FF3EA5" />
        <stop offset="45%" stop-color="#FF2A85" />
        <stop offset="75%" stop-color="#D926C9" />
        <stop offset="100%" stop-color="#A855F7" />
      </linearGradient>

      <linearGradient id="pinkPortalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FF3EA5" />
        <stop offset="50%" stop-color="#D926C9" />
        <stop offset="100%" stop-color="#7C3AED" />
      </linearGradient>

      <!-- Neon Pink Glow Filter for Borders & Accents -->
      <filter id="neonPink" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="2.2" result="blur1" />
        <feGaussianBlur stdDeviation="5.5" result="blur2" />
        <feMerge>
          <feMergeNode in="blur2" />
          <feMergeNode in="blur1" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      <!-- Intense Pink Glow for Heading Text -->
      <filter id="textGlowPink" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="3.2" result="blur" />
        <feColorMatrix type="matrix" values="
          0 0 0 0 1
          0 0 0 0 0.24
          0 0 0 0 0.65
          0 0 0 0 0.85 0" result="pinkGlow" />
        <feMerge>
          <feMergeNode in="pinkGlow" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      <!-- Subtitle Glow Filter for Crisp Readability -->
      <filter id="textGlowSubtitle" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2.2" result="blur" />
        <feColorMatrix type="matrix" values="
          0 0 0 0 1
          0 0 0 0 0.24
          0 0 0 0 0.65
          0 0 0 0 0.7 0" result="pinkGlow" />
        <feMerge>
          <feMergeNode in="pinkGlow" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      <!-- Clean Soft Glow Filter for Tagline -->
      <filter id="textGlowTag" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="1.2" result="blur" />
        <feColorMatrix type="matrix" values="
          0 0 0 0 1
          0 0 0 0 0.24
          0 0 0 0 0.65
          0 0 0 0 0.5 0" result="pinkGlow" />
        <feMerge>
          <feMergeNode in="pinkGlow" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <!-- 1. LEFT PORTAL: Clean Single Glowing Ring (snugly hugging the enlarged seal) -->
    <g filter="url(#neonPink)">
      <circle cx="${cx}" cy="${cy}" r="${circleRadius}" fill="none" stroke="url(#pinkPortalGrad)" stroke-width="2.8" opacity="0.95" />
    </g>

    <!-- Soft ambient pink bloom -->
    <circle cx="${cx}" cy="${cy}" r="${circleRadius}" fill="none" stroke="#FF3EA5" stroke-width="7" opacity="0.2" filter="url(#neonPink)" />

    <!-- Connecting rails bridging Portal to Box -->
    <g filter="url(#neonPink)">
      <line x1="${railsX}" y1="85" x2="${boxLeft}" y2="85" stroke="#FF3EA5" stroke-width="2.4" />
      <line x1="${railsX}" y1="255" x2="${boxLeft}" y2="255" stroke="#D926C9" stroke-width="2.4" />
    </g>

    <!-- 2. RIGHT HUD FRAME: Clean, Simple & Modern Cyber Frame -->
    <g filter="url(#neonPink)">
      <!-- Outer Frame in Pink Gradient -->
      <path d="
        M ${boxLeft} 85
        L ${boxLeft + 80} 85
        L ${boxLeft + 115} 55
        L ${boxRight - 115} 55
        L ${boxRight - 80} 85
        L ${boxRight} 85
        L ${boxRight} 255
        L ${boxRight - 80} 255
        L ${boxRight - 115} 285
        L ${boxLeft + 115} 285
        L ${boxLeft + 80} 255
        L ${boxLeft} 255
        Z
      " fill="none" stroke="url(#pinkCyberGrad)" stroke-width="2.6" stroke-linejoin="round" />

      <!-- Minimal Inner Accent Frame -->
      <path d="
        M ${boxLeft + 20} 95
        L ${boxLeft + 75} 95
        L ${boxLeft + 105} 67
        L ${boxRight - 105} 67
        L ${boxRight - 75} 95
        L ${boxRight - 20} 95
        L ${boxRight - 20} 245
        L ${boxRight - 75} 245
        L ${boxRight - 105} 273
        L ${boxLeft + 105} 273
        L ${boxLeft + 75} 245
        L ${boxLeft + 20} 245
        Z
      " fill="none" stroke="#FF3EA5" stroke-width="1.2" opacity="0.45" stroke-linejoin="round" />

      <!-- Corner Tech Highlights -->
      <circle cx="${boxRight - 115}" cy="55" r="3" fill="#FF3EA5" />
      <circle cx="${boxLeft + 115}" cy="285" r="3" fill="#D926C9" />

      <!-- Sleek Bottom Baseline Accent -->
      <line x1="${boxLeft + 160}" y1="266" x2="${boxRight - 160}" y2="266" stroke="#FF3EA5" stroke-width="1" opacity="0.4" />
      <circle cx="${boxCenterX}" cy="266" r="2.5" fill="#FF3EA5" />
    </g>

    <!-- 3. TYPOGRAPHY: Line 1 & Line 2 balanced and prominent -->
    <!-- Heading: VEL TECH HIGH TECH (Orbitron ExtraBold, Clean White with Pink Halo) -->
    <g fill="#FFFFFF" filter="url(#textGlowPink)">
      <path d="${pHeading.d}" />
    </g>

    <!-- Subtitle: DR. RANGARAJAN DR. SAKUNTHALA ENGINEERING COLLEGE (Orbitron Bold, Same Size as Line 1) -->
    <g fill="#FF3EA5" filter="url(#textGlowSubtitle)">
      <path d="${pSubtitle.d}" />
    </g>

    <!-- Tag: AN AUTONOMOUS INSTITUTION (Orbitron Bold, Crisp Silver-Pink, Left as is) -->
    <g fill="#FDF2F8" filter="url(#textGlowTag)">
      <path d="${pTag.d}" />
    </g>

    <!-- Mini decorative neon diamonds beside the tag -->
    <polygon points="${boxCenterX - tagHalfWidth - 18},234 ${boxCenterX - tagHalfWidth - 14},230 ${boxCenterX - tagHalfWidth - 10},234 ${boxCenterX - tagHalfWidth - 14},238" fill="#FF3EA5" filter="url(#neonPink)" />
    <polygon points="${boxCenterX + tagHalfWidth + 10},234 ${boxCenterX + tagHalfWidth + 14},230 ${boxCenterX + tagHalfWidth + 18},234 ${boxCenterX + tagHalfWidth + 14},238" fill="#D926C9" filter="url(#neonPink)" />
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
      { input: Buffer.from(svgHud), top: 0, left: 0 },
      { input: maskedSeal, top: sealTop, left: sealLeft }
    ])
    .png()
    .toBuffer();

  // Save standalone preview PNG
  const previewPath = path.join(OUT_DIR, 'hud_pink_simple_transparent.png');
  await sharp(finalTransparentPng).toFile(previewPath);

  // Simulate on dark website galaxy backdrop
  const darkCitySimSvg = `
  <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${width}" height="${height}" fill="#080415" />
    <circle cx="${cx}" cy="${cy}" r="170" fill="#d926c9" opacity="0.25" filter="blur(25px)" />
    <circle cx="${boxCenterX}" cy="180" r="220" fill="#ff3ea5" opacity="0.18" filter="blur(30px)" />
  </svg>
  `;
  const simPreviewBuffer = await sharp(Buffer.from(darkCitySimSvg))
    .composite([{ input: finalTransparentPng, top: 0, left: 0 }])
    .png()
    .toBuffer();
  await sharp(simPreviewBuffer).toFile(path.join(OUT_DIR, 'hud_pink_on_dark.png'));

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

  console.log('Successfully generated updated pink logo banner!');
}

renderPinkSimpleBanner().catch(console.error);

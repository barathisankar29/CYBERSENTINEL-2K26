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

function pathToSvgD(fontPath) {
  let d = '';
  for (const cmd of fontPath.commands) {
    if (cmd.type === 'M') d += 'M' + cmd.x.toFixed(2) + ' ' + cmd.y.toFixed(2) + ' ';
    else if (cmd.type === 'L') d += 'L' + cmd.x.toFixed(2) + ' ' + cmd.y.toFixed(2) + ' ';
    else if (cmd.type === 'C') d += 'C' + cmd.x1.toFixed(2) + ' ' + cmd.y1.toFixed(2) + ' ' + cmd.x2.toFixed(2) + ' ' + cmd.y2.toFixed(2) + ' ' + cmd.x.toFixed(2) + ' ' + cmd.y.toFixed(2) + ' ';
    else if (cmd.type === 'Q') d += 'Q' + cmd.x1.toFixed(2) + ' ' + cmd.y1.toFixed(2) + ' ' + cmd.x.toFixed(2) + ' ' + cmd.y.toFixed(2) + ' ';
    else if (cmd.type === 'Z') d += 'Z ';
  }
  return d.trim();
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
    return { d: combinedD.trim(), width: totalWidth };
  }
}

async function generateVerticalCrestHud() {
  const width = 1240;
  const height = 330;
  const cx = 620;
  const cyMedallion = 82;
  const sealDiameter = 110;
  const sealRadius = sealDiameter / 2;

  // Typography: Both lines made the SAME SIZE per user instruction
  // Line 1: VEL TECH HIGH TECH (26px)
  const pHeading = getFontPath(fontExtraBold, 'VEL TECH HIGH TECH', cx, 196, 26, 3);
  // Line 2: DR. RANGARAJAN DR. SAKUNTHALA ENGINEERING COLLEGE (25px - matching cap height)
  const pSubtitle = getFontPath(fontBold, 'DR. RANGARAJAN DR. SAKUNTHALA ENGINEERING COLLEGE', cx, 244, 25, 0.6);

  const svgHud = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Gradients matching website theme -->
      <linearGradient id="neonPinkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#FF007F" />
        <stop offset="25%" stop-color="#FF2A85" />
        <stop offset="50%" stop-color="#FFFFFF" />
        <stop offset="75%" stop-color="#FF2A85" />
        <stop offset="100%" stop-color="#FF007F" />
      </linearGradient>

      <linearGradient id="subBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FF2A85" />
        <stop offset="50%" stop-color="#D926C9" />
        <stop offset="100%" stop-color="#7209B7" />
      </linearGradient>

      <radialGradient id="medallionAura" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#FF007F" stop-opacity="0.5" />
        <stop offset="60%" stop-color="#7209B7" stop-opacity="0.18" />
        <stop offset="100%" stop-color="#000000" stop-opacity="0" />
      </radialGradient>

      <!-- Reliable Neon Glow Filters -->
      <filter id="neonPinkGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="0" stdDeviation="2.5" flood-color="#FF007F" flood-opacity="0.95" />
        <feDropShadow dx="0" dy="0" stdDeviation="7" flood-color="#FF2A85" flood-opacity="0.5" />
      </filter>

      <!-- Crisp White Heading with Vivid Neon Magenta Drop-Shadow -->
      <filter id="headingWhiteGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#FF007F" flood-opacity="0.95" />
        <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="#FF2A85" flood-opacity="0.65" />
      </filter>

      <filter id="subtitlePinkGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="0" stdDeviation="2.5" flood-color="#FF2A85" flood-opacity="0.95" />
        <feDropShadow dx="0" dy="0" stdDeviation="7" flood-color="#FF007F" flood-opacity="0.6" />
      </filter>
    </defs>

    <!-- ==================== 1. TOP CIRCUIT WINGS ==================== -->
    <!-- Left Wing -->
    <g filter="url(#neonPinkGlow)">
      <!-- Faint guide -->
      <path d="M 120 82 L 260 82 L 295 62 L 430 62 L 460 82 L 545 82" stroke="#7209B7" stroke-width="1.3" stroke-opacity="0.35" stroke-dasharray="6,4" fill="none" />
      <!-- Main glowing rail -->
      <path d="M 140 82 L 270 82 L 305 62 L 420 62 L 450 82 L 540 82" stroke="#FF007F" stroke-width="2.3" stroke-linecap="round" fill="none" />
      <!-- Secondary lower branch -->
      <path d="M 230 82 L 255 100 L 370 100 L 395 82" stroke="#FF2A85" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="4,4" fill="none" />
      <!-- Upper branch -->
      <path d="M 330 62 L 345 52 L 400 52" stroke="#FF007F" stroke-width="1.4" stroke-linecap="round" fill="none" />
      <!-- Nodes / Blocks -->
      <circle cx="145" cy="82" r="3.2" fill="#FF2A85" stroke="#FFFFFF" stroke-width="1" />
      <rect x="185" y="80" width="20" height="4" rx="2" fill="#FF007F" />
      <circle cx="305" cy="62" r="2.8" fill="#FFFFFF" />
      <circle cx="420" cy="62" r="2.8" fill="#FF2A85" />
      <rect x="350" y="50" width="26" height="3" rx="1.5" fill="#FF70A6" />
      <!-- Chevrons -->
      <path d="M 240 78 L 246 82 L 240 86" stroke="#FF70A6" stroke-width="1.8" fill="none" stroke-linecap="round" />
      <path d="M 250 78 L 256 82 L 250 86" stroke="#FF70A6" stroke-width="1.8" fill="none" stroke-linecap="round" />
      <circle cx="540" cy="82" r="4" fill="#FF007F" stroke="#FFFFFF" stroke-width="1.5" />
    </g>

    <!-- Right Wing -->
    <g filter="url(#neonPinkGlow)">
      <!-- Faint guide -->
      <path d="M 1120 82 L 980 82 L 945 62 L 810 62 L 780 82 L 695 82" stroke="#7209B7" stroke-width="1.3" stroke-opacity="0.35" stroke-dasharray="6,4" fill="none" />
      <!-- Main glowing rail -->
      <path d="M 1100 82 L 970 82 L 935 62 L 820 62 L 790 82 L 700 82" stroke="#FF007F" stroke-width="2.3" stroke-linecap="round" fill="none" />
      <!-- Secondary lower branch -->
      <path d="M 1010 82 L 985 100 L 870 100 L 845 82" stroke="#FF2A85" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="4,4" fill="none" />
      <!-- Upper branch -->
      <path d="M 910 62 L 895 52 L 840 52" stroke="#FF007F" stroke-width="1.4" stroke-linecap="round" fill="none" />
      <!-- Nodes / Blocks -->
      <circle cx="1095" cy="82" r="3.2" fill="#FF2A85" stroke="#FFFFFF" stroke-width="1" />
      <rect x="1035" y="80" width="20" height="4" rx="2" fill="#FF007F" />
      <circle cx="935" cy="62" r="2.8" fill="#FFFFFF" />
      <circle cx="820" cy="62" r="2.8" fill="#FF2A85" />
      <rect x="864" y="50" width="26" height="3" rx="1.5" fill="#FF70A6" />
      <!-- Chevrons -->
      <path d="M 1000 78 L 994 82 L 1000 86" stroke="#FF70A6" stroke-width="1.8" fill="none" stroke-linecap="round" />
      <path d="M 990 78 L 984 82 L 990 86" stroke="#FF70A6" stroke-width="1.8" fill="none" stroke-linecap="round" />
      <circle cx="700" cy="82" r="4" fill="#FF007F" stroke="#FFFFFF" stroke-width="1.5" />
    </g>

    <!-- ==================== 2. MAIN CHAMFERED HUD FRAME (SLIM & COMPACT) ==================== -->
    <g filter="url(#neonPinkGlow)">
      <!-- Outer Perimeter Path with Stepped Canopies, Side Brackets, and Center Inset Notch -->
      <path d="
        M 525 134
        L 485 98
        H 285
        L 245 134
        H 130
        L 75 189
        L 48 198
        V 246
        L 75 255
        L 130 300
        H 568
        L 582 288
        H 658
        L 672 300
        H 1110
        L 1165 255
        L 1192 246
        V 198
        L 1165 189
        L 1110 134
        H 995
        L 955 98
        H 755
        L 715 134
        Z
      " stroke="url(#neonPinkGrad)" stroke-width="2.5" fill="none" stroke-linejoin="round" />

      <!-- Inner Parallel Line (Concentric Double Border) -->
      <path d="
        M 530 141
        L 490 105
        H 290
        L 250 141
        H 134
        L 82 193
        L 55 202
        V 242
        L 82 251
        L 134 293
        H 572
        L 586 281
        H 654
        L 668 293
        H 1106
        L 1158 251
        L 1185 242
        V 202
        L 1158 193
        L 1106 141
        H 990
        L 950 105
        H 750
        L 710 141
        Z
      " stroke="url(#subBorderGrad)" stroke-width="1.2" stroke-dasharray="24 8 90 8" fill="none" stroke-opacity="0.8" stroke-linejoin="round" />

      <!-- Top Plateau Accent Runners -->
      <line x1="305" y1="91" x2="455" y2="91" stroke="#FF007F" stroke-width="1.8" stroke-linecap="round" />
      <line x1="785" y1="91" x2="935" y2="91" stroke="#FF007F" stroke-width="1.8" stroke-linecap="round" />

      <!-- Chamfer Corner White Highlights -->
      <line x1="130" y1="134" x2="75" y2="189" stroke="#FFFFFF" stroke-width="2.3" stroke-linecap="round" />
      <line x1="75" y1="255" x2="130" y2="300" stroke="#FFFFFF" stroke-width="2.3" stroke-linecap="round" />
      <line x1="1110" y1="134" x2="1165" y2="189" stroke="#FFFFFF" stroke-width="2.3" stroke-linecap="round" />
      <line x1="1165" y1="255" x2="1110" y2="300" stroke="#FFFFFF" stroke-width="2.3" stroke-linecap="round" />

      <!-- Side Bracket Accent Strips -->
      <line x1="46" y1="208" x2="46" y2="236" stroke="#FF2A85" stroke-width="2.3" stroke-linecap="round" />
      <line x1="1194" y1="208" x2="1194" y2="236" stroke="#FF2A85" stroke-width="2.3" stroke-linecap="round" />
    </g>

    <!-- Bottom Center Notch: 3 Glowing Dots -->
    <g filter="url(#neonPinkGlow)">
      <circle cx="604" cy="288" r="3" fill="#FF007F" stroke="#FFFFFF" stroke-width="1.4" />
      <circle cx="620" cy="288" r="4.2" fill="#FFFFFF" stroke="#FF007F" stroke-width="1.4" />
      <circle cx="636" cy="288" r="3" fill="#FF007F" stroke="#FFFFFF" stroke-width="1.4" />
    </g>

    <!-- ==================== 3. TYPOGRAPHY (MATCHING SIZES) ==================== -->
    <!-- LINE 1: VEL TECH HIGH TECH (26px, Bold Crisp White with Pink Halo) -->
    <g fill="#FFFFFF" filter="url(#headingWhiteGlow)">
      <path d="${pHeading.d}" />
    </g>

    <!-- LINE 2: DR. RANGARAJAN DR. SAKUNTHALA ENGINEERING COLLEGE (25px, Vibrant Neon Pink) -->
    <g fill="#FF2A85" filter="url(#subtitlePinkGlow)">
      <path d="${pSubtitle.d}" />
    </g>

    <!-- ==================== 4. CENTER TOP MEDALLION ==================== -->
    <!-- Ambient Aura -->
    <circle cx="${cx}" cy="${cyMedallion}" r="82" fill="url(#medallionAura)" pointer-events="none" />

    <!-- Calibration / Tech Rings -->
    <g filter="url(#neonPinkGlow)">
      <circle cx="${cx}" cy="${cyMedallion}" r="74" stroke="#FF007F" stroke-width="1.4" stroke-dasharray="10 12 22 12" fill="none" opacity="0.85" />
      <circle cx="${cx}" cy="${cyMedallion}" r="67" stroke="#FF2A85" stroke-width="1" stroke-dasharray="4 5" fill="none" opacity="0.6" />
      
      <!-- Coordinate tick marks -->
      <line x1="${cx}" y1="${cyMedallion - 77}" x2="${cx}" y2="${cyMedallion - 71}" stroke="#FF2A85" stroke-width="1.8" />
      <line x1="${cx}" y1="${cyMedallion + 71}" x2="${cx}" y2="${cyMedallion + 77}" stroke="#FF2A85" stroke-width="1.8" />
      <line x1="${cx - 77}" y1="${cyMedallion}" x2="${cx - 71}" y2="${cyMedallion}" stroke="#FF2A85" stroke-width="1.8" />
      <line x1="${cx + 71}" y1="${cyMedallion}" x2="${cx + 77}" y2="${cyMedallion}" stroke="#FF2A85" stroke-width="1.8" />

      <!-- Main Glowing Halo Ring Border -->
      <circle cx="${cx}" cy="${cyMedallion}" r="${sealRadius + 4}" stroke="#FF2A85" stroke-width="2.6" fill="#08020E" />
      <circle cx="${cx}" cy="${cyMedallion}" r="${sealRadius + 1}" stroke="#FF85C0" stroke-width="1.4" fill="none" />
      <circle cx="${cx}" cy="${cyMedallion}" r="${sealRadius + 6}" stroke="#FF007F" stroke-width="1.1" stroke-dasharray="6 5" fill="none" opacity="0.75" />

      <!-- Top Diamond Jewel Indicator -->
      <polygon points="${cx},${cyMedallion - sealRadius - 9} ${cx + 3.5},${cyMedallion - sealRadius - 5} ${cx},${cyMedallion - sealRadius - 1} ${cx - 3.5},${cyMedallion - sealRadius - 5}" fill="#FFFFFF" stroke="#FF007F" stroke-width="1" />
      <!-- Bottom Pip -->
      <circle cx="${cx}" cy="${cyMedallion + sealRadius + 5}" r="2.2" fill="#FF007F" stroke="#FFFFFF" stroke-width="1" />
    </g>
  </svg>
  `;

  // Circular Mask for Vel Tech Seal
  const sealCircleMask = `
  <svg width="${sealDiameter}" height="${sealDiameter}">
    <circle cx="${sealRadius}" cy="${sealRadius}" r="${sealRadius}" fill="#fff"/>
  </svg>
  `;

  const maskedSeal = await sharp(SEAL_IMAGE_PATH)
    .resize(sealDiameter, sealDiameter, { fit: 'contain' })
    .composite([{ input: Buffer.from(sealCircleMask), blend: 'dest-in' }])
    .png()
    .toBuffer();

  const sealLeft = Math.round(cx - sealRadius);
  const sealTop = Math.round(cyMedallion - sealRadius);

  // 100% Transparent base canvas
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

  // Save preview PNG for inspection
  const testPreviewPng = path.join(OUT_DIR, 'vertical_crest_hud_preview.png');
  await sharp(finalTransparentPng).toFile(testPreviewPng);

  // Save lossless WebP to public branding directory
  const webpBuffer = await sharp(finalTransparentPng)
    .webp({ quality: 100, alphaQuality: 100, lossless: true })
    .toBuffer();

  await sharp(webpBuffer).toFile(path.join(PUBLIC_BRANDING_DIR, 'vel-tech-high-tech-logo-v4.webp'));
  await sharp(webpBuffer).toFile(path.join(PUBLIC_BRANDING_DIR, 'vel-tech-high-tech-logo-full-v4.webp'));
  await sharp(webpBuffer).toFile(path.join(PUBLIC_BRANDING_DIR, 'vel-tech-high-tech-logo.webp'));
  await sharp(webpBuffer).toFile(path.join(PUBLIC_BRANDING_DIR, 'vel-tech-high-tech-logo-full.webp'));
  await sharp(webpBuffer).toFile(path.join(PUBLIC_BRANDING_DIR, 'vel-tech-high-tech-logo-v3.webp'));
  await sharp(webpBuffer).toFile(path.join(PUBLIC_BRANDING_DIR, 'vel-tech-high-tech-logo-full-v3.webp'));

  console.log('Successfully generated compact vertical crest HUD banner with matching text sizes!');
  console.log('Saved preview to:', testPreviewPng);
}

generateVerticalCrestHud().catch(console.error);

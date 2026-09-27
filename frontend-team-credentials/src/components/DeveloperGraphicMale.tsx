import React, { useState, useRef } from 'react';

export const DeveloperGraphicMale: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(() => {
    return localStorage.getItem('person3_image_data') || null;
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        setImageSrc(dataUrl);
        localStorage.setItem('person3_image_data', dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          fileInputRef.current?.click();
        }
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-[310px] lg:h-[310px] flex items-center justify-center cursor-pointer select-none group"
      title="Click or drag and drop to replace image"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        className="hidden"
      />

      {imageSrc ? (
        <img
          src={imageSrc}
          alt="Discipline Builds Freedom"
          className="w-full h-full object-contain drop-shadow-[0_10px_25px_rgba(0,240,255,0.45)] transition-transform duration-200 group-hover:scale-[1.03]"
          referrerPolicy="no-referrer"
        />
      ) : (
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full overflow-visible drop-shadow-[0_10px_25px_rgba(0,240,255,0.35)] transition-transform duration-200 group-hover:scale-[1.03]"
        >
        <defs>
          {/* Gradients */}
          <linearGradient id="maleCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f0ff" />
            <stop offset="60%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>

          <linearGradient id="maleDeepBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          <linearGradient id="malePinkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff00a0" />
            <stop offset="50%" stopColor="#ff007f" />
            <stop offset="100%" stopColor="#d946ef" />
          </linearGradient>

          <filter id="maleCyanGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="malePinkGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Mask for portrait */}
          <clipPath id="malePortraitClip">
            <polygon points="200,45 330,245 70,245" />
          </clipPath>
        </defs>

        {/* --- Background Geometric Triangles & Cyber Wireframes --- */}
        {/* Outer Large Neon Cyan Triangle */}
        <polygon
          points="200,30 365,270 35,270"
          fill="none"
          stroke="url(#maleCyanGrad)"
          strokeWidth="3.5"
          filter="url(#maleCyanGlow)"
        />

        {/* Inner Overlapping Dark Blue & Cyan Triangular Facets */}
        <polygon
          points="200,40 350,265 50,265"
          fill="#082f49"
          stroke="#00f0ff"
          strokeWidth="2"
        />

        {/* Offset Geometric Cyber Triangle Frame */}
        <polygon
          points="130,55 370,180 180,310"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="2"
          opacity="0.75"
        />
        <polygon
          points="60,140 290,290 100,320"
          fill="none"
          stroke="#0284c7"
          strokeWidth="1.5"
          opacity="0.6"
        />

        {/* Tech Grid Slices & Horizon Lines */}
        <line x1="50" y1="120" x2="160" y2="120" stroke="#00f0ff" strokeWidth="2" opacity="0.6" />
        <line x1="240" y1="110" x2="350" y2="110" stroke="#00f0ff" strokeWidth="2" opacity="0.6" />
        <line x1="30" y1="180" x2="120" y2="180" stroke="#38bdf8" strokeWidth="2" opacity="0.8" />
        <line x1="280" y1="175" x2="370" y2="175" stroke="#38bdf8" strokeWidth="2" opacity="0.8" />

        {/* Glitch Tech Rectangles behind character */}
        <rect x="25" y="195" width="60" height="7" fill="#00f0ff" />
        <rect x="70" y="185" width="45" height="5" fill="#a855f7" />
        <rect x="310" y="190" width="65" height="7" fill="#00f0ff" />
        <rect x="285" y="202" width="55" height="5" fill="#ec4899" />

        {/* --- Male Character Portrait (Jeeva) --- */}
        <g>
          {/* Portrait Backdrop glow */}
          <circle cx="200" cy="145" r="75" fill="#0369a1" opacity="0.4" />

          {/* Navy Suit Jacket / Torso */}
          <path
            d="M125,270 L140,195 C145,185 160,180 178,178 L185,225 L200,270 L215,225 L222,178 C240,180 255,185 260,195 L275,270 Z"
            fill="#0f172a"
            stroke="#1e293b"
            strokeWidth="2"
          />

          {/* White Dress Shirt V-Neck & Collar */}
          <polygon
            points="178,178 200,240 222,178"
            fill="#f8fafc"
          />
          {/* Shirt Collars */}
          <polygon points="175,175 195,195 186,175" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
          <polygon points="225,175 205,195 214,175" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />

          {/* Dark Patterned Tie */}
          <polygon points="196,188 204,188 208,245 200,256 192,245" fill="#1e293b" />
          {/* Tie Knot */}
          <polygon points="195,184 205,184 203,192 197,192" fill="#0f172a" />
          {/* Tie Micro Dots */}
          <circle cx="200" cy="202" r="1" fill="#38bdf8" />
          <circle cx="200" cy="216" r="1" fill="#38bdf8" />
          <circle cx="200" cy="230" r="1" fill="#38bdf8" />

          {/* Suit Lapels */}
          <polygon points="160,185 178,245 188,225 174,180" fill="#1e293b" stroke="#334155" strokeWidth="1" />
          <polygon points="240,185 222,245 212,225 226,180" fill="#1e293b" stroke="#334155" strokeWidth="1" />

          {/* Neck */}
          <rect x="188" y="148" width="24" height="32" rx="4" fill="#c48467" />

          {/* Head & Face */}
          <ellipse cx="200" cy="125" rx="32" ry="38" fill="#d9987a" />

          {/* Styled Wavy Black Hair */}
          <path
            d="M165,115 C162,88 185,70 215,70 C240,70 245,85 242,105 C248,110 246,120 240,126 C238,110 235,90 215,85 C190,80 178,92 172,110 Z"
            fill="#09090b"
          />
          <path
            d="M170,110 C175,85 200,75 225,75 C242,75 240,90 236,100 C220,86 195,84 175,98 Z"
            fill="#18181b"
          />

          {/* Eyebrows */}
          <path d="M178,112 Q187,108 194,112" stroke="#18181b" strokeWidth="3" strokeLinecap="round" />
          <path d="M206,112 Q213,108 222,112" stroke="#18181b" strokeWidth="3" strokeLinecap="round" />

          {/* Eyes */}
          <ellipse cx="186" cy="120" rx="4.5" ry="3.5" fill="#18181b" />
          <circle cx="187.5" cy="118.5" r="1.5" fill="#ffffff" />
          <ellipse cx="214" cy="120" rx="4.5" ry="3.5" fill="#18181b" />
          <circle cx="215.5" cy="118.5" r="1.5" fill="#ffffff" />

          {/* Nose */}
          <path d="M198,122 Q200,132 202,131" stroke="#b47253" strokeWidth="2.5" fill="none" strokeLinecap="round" />

          {/* Confident Smile with Teeth */}
          <path d="M189,140 Q200,150 211,140" stroke="#7f1d1d" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M192,140 Q200,146 208,140" fill="#ffffff" />

          {/* Subtle Stubble / Beard Shadow */}
          <path d="M188,148 Q200,158 212,148" stroke="#a36347" strokeWidth="2" strokeDasharray="1 2" fill="none" opacity="0.6" />
        </g>

        {/* --- Foreground Cyber Glitch Cuts --- */}
        <g>
          <rect x="65" y="240" width="110" height="5" fill="#00f0ff" opacity="0.9" />
          <rect x="220" y="243" width="115" height="5" fill="#d946ef" opacity="0.9" />
          <rect x="40" y="258" width="80" height="6" fill="#38bdf8" />
          <rect x="280" y="255" width="85" height="6" fill="#00f0ff" />
        </g>

        {/* --- 3D Neon Cyber Typography Across Lower Half --- */}
        {/* Layer 1: "DISCIPLINE" in 3D Cyan Block Text */}
        <g filter="url(#maleCyanGlow)">
          {/* Shadow 3D Extrusion */}
          <text
            x="200"
            y="266"
            textAnchor="middle"
            fill="#0369a1"
            className="font-black text-3xl tracking-wider"
            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900 }}
          >
            DISCIPLINE
          </text>
          {/* Front Cyan Glowing Text */}
          <text
            x="200"
            y="263"
            textAnchor="middle"
            fill="#00f0ff"
            stroke="#ffffff"
            strokeWidth="0.75"
            className="font-black text-3xl tracking-wider"
            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900 }}
          >
            DISCIPLINE
          </text>
        </g>

        {/* Layer 2: "BUILDS THE" in Cyan Sans */}
        <g filter="url(#maleCyanGlow)">
          <text
            x="200"
            y="292"
            textAnchor="middle"
            fill="#00f0ff"
            className="font-black text-xl tracking-widest"
            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900 }}
          >
            BUILDS THE
          </text>
        </g>

        {/* Layer 3: "FREEDOM" in Vivid Hot Pink Glowing Brush 3D Font */}
        <g filter="url(#malePinkGlow)">
          {/* 3D Cyan Underglow / Stroke */}
          <text
            x="200"
            y="336"
            textAnchor="middle"
            fill="#00f0ff"
            className="font-black text-4xl tracking-tighter"
            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900 }}
          >
            FREEDOM
          </text>
          {/* Front Hot Magenta Neon Brush Layer */}
          <text
            x="198"
            y="333"
            textAnchor="middle"
            fill="url(#malePinkGrad)"
            stroke="#ffffff"
            strokeWidth="0.8"
            className="font-black text-4xl tracking-tighter drop-shadow-[0_0_12px_#ff007f]"
            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900 }}
          >
            FREEDOM
          </text>
        </g>

        {/* Layer 4: "I WANT" in Cyan Block Font */}
        <g filter="url(#maleCyanGlow)">
          <text
            x="200"
            y="368"
            textAnchor="middle"
            fill="#00f0ff"
            stroke="#38bdf8"
            strokeWidth="0.5"
            className="font-black text-3xl tracking-widest"
            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900 }}
          >
            I WANT
          </text>
        </g>

        {/* Cyber indicator dashes `/////` at the right bottom edge */}
        <g stroke="#00f0ff" strokeWidth="3" opacity="0.85" filter="url(#maleCyanGlow)">
          <line x1="325" y1="322" x2="335" y2="310" />
          <line x1="332" y1="322" x2="342" y2="310" />
          <line x1="339" y1="322" x2="349" y2="310" />
          <line x1="346" y1="322" x2="356" y2="310" />
          <line x1="353" y1="322" x2="363" y2="310" />
        </g>

        {/* Tech Corner Bracket */}
        <path
          d="M315,340 L350,340 L350,320"
          fill="none"
          stroke="#00f0ff"
          strokeWidth="2"
        />
        <circle cx="350" cy="320" r="2" fill="#00f0ff" />
      </svg>
      )}
    </div>
  );
};

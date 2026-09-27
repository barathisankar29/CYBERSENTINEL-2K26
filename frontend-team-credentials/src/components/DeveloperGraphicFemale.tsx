import React, { useState, useEffect, useRef } from 'react';

export const DeveloperGraphicFemale: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(() => {
    return localStorage.getItem('person2_image_data') || null;
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-detect if user or system placed the image in /public/
  useEffect(() => {
    if (!imageSrc) {
      const candidates = [
        '/jeeva_final this_best.png',
        '/jeeva_final_this_best.png',
        '/person2.png',
        '/person_2.png',
        '/Screens_Speak_Design.png',
      ];

      const tryLoad = (idx: number) => {
        if (idx >= candidates.length) return;
        const img = new Image();
        img.src = candidates[idx];
        img.onload = () => {
          setImageSrc(candidates[idx]);
        };
        img.onerror = () => {
          tryLoad(idx + 1);
        };
      };

      tryLoad(0);
    }
  }, [imageSrc]);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        setImageSrc(dataUrl);
        localStorage.setItem('person2_image_data', dataUrl);
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
      className="relative w-56 h-56 xs:w-64 xs:h-64 sm:w-76 sm:h-76 md:w-[380px] md:h-[380px] lg:w-[420px] lg:h-[420px] max-w-full flex items-center justify-center cursor-pointer select-none group my-1 md:-my-2"
      title="Click or drag & drop to replace image"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        className="hidden"
      />

      {imageSrc ? (
        /* The exact user uploaded file rendered with responsive mobile sizing and large desktop presence */
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src={imageSrc}
            alt="Screens Speak Design"
            className="w-full h-full object-contain scale-100 sm:scale-105 md:scale-110 drop-shadow-[0_10px_30px_rgba(217,70,239,0.55)] transition-transform duration-200 group-hover:scale-[1.03] md:group-hover:scale-[1.12]"
            referrerPolicy="no-referrer"
          />
        </div>
      ) : (
        /* High-fidelity Cyber Graphic matching the artwork of jeeva_final this_best.png */
        <div className="relative w-full h-full flex items-center justify-center">
          <svg
            viewBox="0 0 440 440"
            className="w-full h-full overflow-visible scale-100 sm:scale-105 md:scale-110 drop-shadow-[0_10px_30px_rgba(217,70,239,0.45)] transition-transform duration-200 group-hover:scale-[1.03] md:group-hover:scale-[1.12]"
          >
            <defs>
              {/* Outer 3D Glossy Diamond Gradients */}
              <linearGradient id="p2DiamondGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="30%" stopColor="#d946ef" />
                <stop offset="70%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#4c1d95" />
              </linearGradient>

              <linearGradient id="p2OrangeBevel" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fb923c" />
                <stop offset="50%" stopColor="#ea580c" />
                <stop offset="100%" stopColor="#9a3412" />
              </linearGradient>

              <linearGradient id="p2GlossHighlight" x1="0%" y1="0%" x2="40%" y2="80%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
                <stop offset="45%" stopColor="#f472b6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
              </linearGradient>

              <linearGradient id="p2TextGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fffbeb" />
                <stop offset="25%" stopColor="#fef08a" />
                <stop offset="65%" stopColor="#facc15" />
                <stop offset="100%" stopColor="#eab308" />
              </linearGradient>

              <radialGradient id="p2BgGlow" cx="50%" cy="40%" r="65%">
                <stop offset="0%" stopColor="#be185d" />
                <stop offset="55%" stopColor="#701a75" />
                <stop offset="100%" stopColor="#1e052d" />
              </radialGradient>

              <filter id="p2Pop" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <clipPath id="p2DiamondMask">
                <polygon points="210,75 330,195 210,315 90,195" />
              </clipPath>
            </defs>

            {/* --- 3D Diamond Frame Geometry --- */}
            {/* Orange Back Bevel */}
            <polygon
              points="210,55 350,195 210,335 70,195"
              fill="url(#p2OrangeBevel)"
            />

            {/* Deep Violet 3D Extrusion Shadow Layer */}
            <polygon
              points="210,50 362,202 210,354 58,202"
              fill="#2e0854"
            />

            {/* Main Glossy Magenta Diamond Frame */}
            <polygon
              points="210,65 340,195 210,325 80,195"
              fill="url(#p2DiamondGrad)"
              stroke="#fb7185"
              strokeWidth="4"
            />

            {/* Inner Gloss Bevel Border */}
            <polygon
              points="210,73 332,195 210,317 88,195"
              fill="none"
              stroke="url(#p2GlossHighlight)"
              strokeWidth="3"
            />

            {/* --- Portrait inside Diamond Mask --- */}
            <g clipPath="url(#p2DiamondMask)">
              {/* Dark Magenta/Purple Backdrop */}
              <rect x="60" y="60" width="300" height="280" fill="url(#p2BgGlow)" />

              {/* Developer Portrait Silhouette / Painting */}
              {/* Peach Patterned Top / Torso */}
              <path
                d="M130,285 C135,225 165,212 210,212 C255,212 285,225 290,285 Z"
                fill="#fb923c"
              />
              <path
                d="M150,240 Q180,250 210,245 Q240,240 270,245"
                stroke="#fed7aa"
                strokeWidth="3"
                fill="none"
                opacity="0.8"
              />
              <path
                d="M160,260 Q185,270 210,265 Q235,270 260,260"
                stroke="#ffedd5"
                strokeWidth="2.5"
                fill="none"
                opacity="0.7"
              />

              {/* Neck */}
              <rect x="196" y="178" width="28" height="38" rx="4" fill="#c48a6b" />

              {/* Dark Hair - Full Flowing Silhouette */}
              <path
                d="M148,155 C138,110 165,82 210,82 C255,82 282,110 272,155 C278,210 272,260 258,278 C246,258 252,218 246,192 C238,172 222,172 210,172 C198,172 182,172 174,192 C168,218 174,258 162,278 C148,260 142,210 148,155 Z"
                fill="#09090b"
              />

              {/* Realistic Head and Face */}
              <path
                d="M178,142 C178,116 190,104 210,104 C230,104 242,116 242,142 C242,170 230,186 210,186 C190,186 178,170 178,142 Z"
                fill="#d29475"
              />

              {/* Soft Facial Shading */}
              <ellipse cx="192" cy="150" rx="8" ry="6" fill="#dfa284" opacity="0.6" />
              <ellipse cx="228" cy="150" rx="8" ry="6" fill="#dfa284" opacity="0.6" />

              {/* Natural Hair Bangs */}
              <path
                d="M176,132 C182,106 195,96 210,96 C225,96 238,106 244,132 C232,115 220,111 210,113 C200,115 188,123 176,132 Z"
                fill="#18181b"
              />

              {/* Eyebrows */}
              <path d="M188,132 Q196,128 202,132" stroke="#1c1917" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M218,132 Q224,128 232,132" stroke="#1c1917" strokeWidth="2.5" strokeLinecap="round" />

              {/* Round Eyeglasses with Thin Elegant Frames */}
              <circle cx="195" cy="144" r="13" fill="rgba(255,255,255,0.06)" stroke="#171717" strokeWidth="2.5" />
              <circle cx="225" cy="144" r="13" fill="rgba(255,255,255,0.06)" stroke="#171717" strokeWidth="2.5" />
              <path d="M208,142 Q210,139 212,142" stroke="#171717" strokeWidth="2.2" fill="none" />
              <line x1="182" y1="142" x2="176" y2="139" stroke="#171717" strokeWidth="2.2" />
              <line x1="238" y1="142" x2="244" y2="139" stroke="#171717" strokeWidth="2.2" />

              {/* Realistic Eyes */}
              <ellipse cx="195" cy="144" rx="4" ry="3" fill="#1c1917" />
              <circle cx="196.5" cy="142.5" r="1.2" fill="#ffffff" />
              <ellipse cx="225" cy="144" rx="4" ry="3" fill="#1c1917" />
              <circle cx="226.5" cy="142.5" r="1.2" fill="#ffffff" />

              {/* Nose & Smile */}
              <path d="M208,152 Q210,159 212,158" stroke="#b46e50" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M200,168 Q210,177 220,168" stroke="#881337" strokeWidth="2.2" fill="none" strokeLinecap="round" />
              <path d="M202,168 Q210,173 218,168" fill="#ffffff" />

              {/* Flowing Front Hair Strands */}
              <path
                d="M174,142 C168,182 166,222 156,262 C164,242 176,197 182,162 Z"
                fill="#09090b"
              />
              <path
                d="M246,142 C252,182 254,222 264,262 C256,242 244,197 238,162 Z"
                fill="#09090b"
              />
            </g>

            {/* --- Glitch Speed Stripes (Front Overlay) --- */}
            <g>
              {/* Yellow Speed Bar */}
              <rect x="70" y="230" width="175" height="10" fill="#facc15" />
              {/* Orange Speed Bar Extending Far Left */}
              <rect x="48" y="254" width="240" height="12" fill="#f97316" />
              {/* Hot Pink & Magenta Glitch Bars */}
              <rect x="105" y="242" width="145" height="8" fill="#ec4899" />
              <rect x="90" y="269" width="190" height="10" fill="#db2777" />
              {/* Violet Bottom Bar */}
              <rect x="120" y="283" width="140" height="9" fill="#9333ea" />

              {/* Shard Accents */}
              <rect x="36" y="218" width="28" height="6" fill="#facc15" />
              <rect x="56" y="242" width="24" height="6" fill="#fb923c" />
              <rect x="290" y="214" width="32" height="6" fill="#facc15" />
              <rect x="275" y="235" width="40" height="6" fill="#fb923c" />
            </g>

            {/* Cyber Matrix Dots Upper Right */}
            <g fill="#f472b6" opacity="0.85" transform="translate(290, 90)">
              <rect x="0" y="0" width="18" height="2" />
              <rect x="6" y="5" width="24" height="2" />
              <rect x="12" y="10" width="16" height="2" />
              <circle cx="34" cy="4" r="1.8" fill="#fde047" />
            </g>

            {/* --- 3D Typography: "Screens Speak Design." --- */}
            <g transform="translate(285, 150) rotate(-24)" filter="url(#p2Pop)">
              {/* Coral/Orange 3D Extrusion */}
              <text
                x="0"
                y="-24"
                fill="#c2410c"
                className="font-black text-3xl tracking-tighter"
                style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900 }}
              >
                Screens
              </text>
              <text
                x="8"
                y="2"
                fill="#c2410c"
                className="font-black text-3xl tracking-tighter"
                style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900 }}
              >
                Speak
              </text>
              <text
                x="15"
                y="28"
                fill="#c2410c"
                className="font-black text-3xl tracking-tighter"
                style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900 }}
              >
                Design.
              </text>

              {/* Front Yellow 3D Face */}
              <text
                x="-2"
                y="-27"
                fill="url(#p2TextGrad)"
                stroke="#ea580c"
                strokeWidth="1.2"
                className="font-black text-3xl tracking-tighter drop-shadow-[0_2px_6px_rgba(234,88,12,0.9)]"
                style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900 }}
              >
                Screens
              </text>
              <text
                x="6"
                y="-1"
                fill="url(#p2TextGrad)"
                stroke="#ea580c"
                strokeWidth="1.2"
                className="font-black text-3xl tracking-tighter drop-shadow-[0_2px_6px_rgba(234,88,12,0.9)]"
                style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900 }}
              >
                Speak
              </text>
              <text
                x="13"
                y="25"
                fill="url(#p2TextGrad)"
                stroke="#ea580c"
                strokeWidth="1.2"
                className="font-black text-3xl tracking-tighter drop-shadow-[0_2px_6px_rgba(234,88,12,0.9)]"
                style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900 }}
              >
                Design.
              </text>
            </g>
          </svg>

          {/* Unobtrusive upload prompt banner on hover */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none">
            <span className="bg-[#1e1035] text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-pink-500 shadow-lg">
              Click or Drop <span className="text-yellow-400 font-bold">jeeva_final this_best.png</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

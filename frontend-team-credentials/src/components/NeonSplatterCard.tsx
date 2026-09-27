import React from 'react';

interface NeonSplatterCardProps {
  children: React.ReactNode;
}

export const NeonSplatterCard: React.FC<NeonSplatterCardProps> = ({ children }) => {
  return (
    <div className="relative w-full max-w-[980px] min-h-[480px] lg:min-h-[500px] flex items-center justify-center p-3 sm:p-5 select-none">
      {/* Outer Splatter & Glow Layer (SVG vector splatter border matching the template) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
        viewBox="0 0 1000 520"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Gradient for border: Hot Magenta -> Deep Purple -> Electric Cyan */}
          <linearGradient id="neonSplatterGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff007f" />
            <stop offset="25%" stopColor="#c000ff" />
            <stop offset="60%" stopColor="#5000d0" />
            <stop offset="85%" stopColor="#00b4d8" />
            <stop offset="100%" stopColor="#00f0ff" />
          </linearGradient>

          {/* Splatter mask filters */}
          <filter id="neonGlowLeft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="neonGlowRight" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer ambient glow */}
        <rect
          x="14"
          y="14"
          width="972"
          height="492"
          rx="32"
          ry="32"
          fill="none"
          stroke="url(#neonSplatterGrad)"
          strokeWidth="10"
          opacity="0.35"
          filter="url(#neonGlowLeft)"
        />

        {/* Main solid neon frame border */}
        <rect
          x="16"
          y="16"
          width="968"
          height="488"
          rx="30"
          ry="30"
          fill="none"
          stroke="url(#neonSplatterGrad)"
          strokeWidth="6"
        />

        {/* Splatter & Spray Paint Grunge Elements - Left Side (Hot Pink / Magenta) */}
        <g fill="#ff0080" filter="url(#neonGlowLeft)">
          {/* Top-left corner splatter cluster */}
          <circle cx="16" cy="18" r="6" />
          <circle cx="10" cy="24" r="4.5" />
          <circle cx="28" cy="12" r="3" />
          <circle cx="6" cy="40" r="5" />
          <circle cx="12" cy="55" r="3.5" />
          <circle cx="3" cy="72" r="2.5" />
          <path d="M16,20 Q4,10 2,35 Q10,25 16,30 Z" />
          <path d="M12,45 C4,50 2,70 8,85 C14,75 14,58 12,45 Z" />
          <circle cx="22" cy="35" r="3" />
          <circle cx="35" cy="18" r="4" />
          <circle cx="48" cy="14" r="2" />
          <circle cx="62" cy="12" r="3" />

          {/* Left vertical edge splatters */}
          <circle cx="8" cy="110" r="4" />
          <circle cx="14" cy="125" r="5" />
          <circle cx="4" cy="140" r="3" />
          <circle cx="10" cy="165" r="4.5" />
          <circle cx="5" cy="190" r="3.5" />
          <circle cx="12" cy="210" r="6" />
          <circle cx="2" cy="230" r="2.5" />
          <circle cx="8" cy="250" r="5" />
          <circle cx="14" cy="275" r="4" />
          <circle cx="4" cy="295" r="3" />
          <circle cx="9" cy="320" r="5.5" />
          <circle cx="13" cy="345" r="3.5" />
          <circle cx="5" cy="370" r="4" />
          <circle cx="11" cy="395" r="6" />
          <circle cx="3" cy="420" r="3" />
          <path d="M16,150 Q2,160 5,185 Q12,175 16,170 Z" />
          <path d="M16,240 Q3,250 8,280 Q14,265 16,260 Z" />
          <path d="M16,330 Q4,345 7,375 Q13,360 16,355 Z" />

          {/* Bottom-left corner splatter cluster */}
          <circle cx="15" cy="460" r="6" />
          <circle cx="8" cy="475" r="4.5" />
          <circle cx="20" cy="490" r="5.5" />
          <circle cx="10" cy="505" r="3.5" />
          <circle cx="32" cy="498" r="4" />
          <circle cx="45" cy="505" r="3" />
          <circle cx="60" cy="502" r="4" />
          <path d="M16,470 C6,480 8,505 25,510 C20,495 18,485 16,470 Z" />
        </g>

        {/* Splatter & Spray Paint Elements - Bottom Edge (Deep Purple / Indigo) */}
        <g fill="#9333ea" opacity="0.85">
          <circle cx="100" cy="504" r="3.5" />
          <circle cx="135" cy="508" r="4" />
          <circle cx="170" cy="503" r="3" />
          <circle cx="210" cy="507" r="4.5" />
          <circle cx="260" cy="505" r="3" />
          <circle cx="310" cy="508" r="4" />
          <circle cx="360" cy="504" r="3" />
          <circle cx="420" cy="507" r="5" />
          <circle cx="480" cy="505" r="3.5" />
          <circle cx="530" cy="508" r="4" />
          <circle cx="590" cy="504" r="3" />
          <circle cx="650" cy="506" r="4.5" />
          <circle cx="710" cy="503" r="3" />
          <circle cx="760" cy="507" r="4" />
          <circle cx="820" cy="505" r="3.5" />
        </g>

        {/* Splatter & Spray Paint Elements - Right Side (Electric Cyan / Aqua) */}
        <g fill="#00f0ff" filter="url(#neonGlowRight)">
          {/* Top-right corner splatter cluster */}
          <circle cx="984" cy="18" r="6" />
          <circle cx="990" cy="25" r="4.5" />
          <circle cx="972" cy="12" r="3.5" />
          <circle cx="994" cy="42" r="5" />
          <circle cx="988" cy="60" r="3.5" />
          <circle cx="997" cy="80" r="2.5" />
          <circle cx="965" cy="16" r="4" />
          <circle cx="950" cy="13" r="3" />
          <circle cx="935" cy="15" r="3.5" />
          <path d="M984,20 Q996,12 998,35 Q990,26 984,30 Z" />
          <path d="M988,48 C996,55 998,75 992,88 C986,78 986,60 988,48 Z" />

          {/* Right vertical edge splatters */}
          <circle cx="992" cy="115" r="4" />
          <circle cx="986" cy="135" r="5.5" />
          <circle cx="996" cy="155" r="3" />
          <circle cx="990" cy="180" r="4.5" />
          <circle cx="995" cy="205" r="3.5" />
          <circle cx="987" cy="225" r="6" />
          <circle cx="998" cy="245" r="2.5" />
          <circle cx="991" cy="270" r="5" />
          <circle cx="985" cy="295" r="4" />
          <circle cx="996" cy="315" r="3" />
          <circle cx="990" cy="340" r="5" />
          <circle cx="986" cy="365" r="3.5" />
          <circle cx="995" cy="385" r="4" />
          <circle cx="988" cy="410" r="6" />
          <circle cx="997" cy="435" r="3" />
          <path d="M984,155 Q998,165 995,190 Q988,180 984,175 Z" />
          <path d="M984,245 Q997,255 992,285 Q986,270 984,265 Z" />
          <path d="M984,335 Q996,350 993,380 Q987,365 984,360 Z" />

          {/* Bottom-right corner splatter cluster */}
          <circle cx="985" cy="465" r="6" />
          <circle cx="992" cy="480" r="4.5" />
          <circle cx="978" cy="492" r="5.5" />
          <circle cx="990" cy="505" r="3.5" />
          <circle cx="968" cy="500" r="4" />
          <circle cx="952" cy="506" r="3" />
          <circle cx="938" cy="503" r="4" />
          <path d="M984,470 C994,480 992,505 975,510 C980,495 982,485 984,470 Z" />
        </g>

        {/* Fine splatter specks across all edges */}
        <g fill="#ff00a0" opacity="0.7">
          <circle cx="2" cy="65" r="1.5" />
          <circle cx="25" cy="8" r="1.5" />
          <circle cx="7" cy="98" r="1.8" />
          <circle cx="18" cy="180" r="1.5" />
          <circle cx="1" cy="215" r="2" />
          <circle cx="20" cy="310" r="1.5" />
          <circle cx="3" cy="360" r="2" />
          <circle cx="22" cy="445" r="1.7" />
          <circle cx="6" cy="495" r="2" />
        </g>

        <g fill="#00ffff" opacity="0.7">
          <circle cx="998" cy="70" r="1.5" />
          <circle cx="975" cy="8" r="1.5" />
          <circle cx="993" cy="102" r="1.8" />
          <circle cx="982" cy="190" r="1.5" />
          <circle cx="999" cy="220" r="2" />
          <circle cx="980" cy="305" r="1.5" />
          <circle cx="997" cy="355" r="2" />
          <circle cx="978" cy="440" r="1.7" />
          <circle cx="994" cy="495" r="2" />
        </g>
      </svg>

      {/* Card Inner Surface with Deep Midnight Navy Background */}
      <div className="relative z-10 w-full h-full bg-[#0b0827] rounded-[26px] p-4 sm:p-7 md:p-10 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 md:gap-10 shadow-2xl overflow-hidden">
        {children}
      </div>
    </div>
  );
};

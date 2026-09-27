import { useState, useEffect, useCallback } from 'react';
import { NeonSplatterCard } from './components/NeonSplatterCard';
import { PersonOnePlaceholder } from './components/PersonOnePlaceholder';
import { DeveloperGraphicFemale } from './components/DeveloperGraphicFemale';
import { DeveloperGraphicMale } from './components/DeveloperGraphicMale';
import { SocialIcons } from './components/SocialIcons';

interface SlideData {
  id: number;
  name: string;
  nameColor: string;
  textColor: string;
  graphicType: 'person1' | 'female' | 'male';
  loremIpsum: string;
  linkedinUrl?: string;
  githubUrl?: string;
}

const slides: SlideData[] = [
  {
    id: 1,
    name: 'Barathi Sankar',
    nameColor: '#FFEE00', // Bright neon yellow
    textColor: '#C800FF', // Vivid neon purple/violet
    graphicType: 'person1',
    loremIpsum:
      'LOREM IPSUM DOLOR SIT AMET, CONSECTETUER ADIPISCING ELIT. AENEAN COMMODO LIGULA EGET DOLOR. AENEAN MASSA. CUM SOCIIS NATOQUE PENATIBUS ET MAGNIS DIS PARTURIENT MONTES, NASCETUR RIDICULUS MUS. DONEC QUAM FELIS, ULTRICIES NEC, PELLENTESQUE EU, PRETIUM QUIS, SEM. NULLA CONSEQUAT MASSA QUIS ENIM. DONEC PEDE JUSTO, FRINGILLA VEL,',
    linkedinUrl: 'https://linkedin.com',
    githubUrl: 'https://github.com',
  },
  {
    id: 2,
    name: 'Jeevadharani',
    nameColor: '#FFAE00', // Amber / golden yellow-orange
    textColor: '#FF007F', // Vibrant neon pink / magenta
    graphicType: 'female',
    loremIpsum:
      'LOREM IPSUM DOLOR SIT AMET, CONSECTETUER ADIPISCING ELIT. AENEAN COMMODO LIGULA EGET DOLOR. AENEAN MASSA. CUM SOCIIS NATOQUE PENATIBUS ET MAGNIS DIS PARTURIENT MONTES, NASCETUR RIDICULUS MUS. DONEC QUAM FELIS, ULTRICIES NEC, PELLENTESQUE EU, PRETIUM QUIS, SEM. NULLA CONSEQUAT MASSA QUIS ENIM. DONEC PEDE JUSTO, FRINGILLA VEL,',
    linkedinUrl: 'https://linkedin.com',
    githubUrl: 'https://github.com',
  },
  {
    id: 3,
    name: 'Pranith',
    nameColor: '#FF0088', // Vibrant hot magenta / pink
    textColor: '#00B4FF', // Electric neon cyan / blue
    graphicType: 'male',
    loremIpsum:
      'LOREM IPSUM DOLOR SIT AMET, CONSECTETUER ADIPISCING ELIT. AENEAN COMMODO LIGULA EGET DOLOR. AENEAN MASSA. CUM SOCIIS NATOQUE PENATIBUS ET MAGNIS DIS PARTURIENT MONTES, NASCETUR RIDICULUS MUS. DONEC QUAM FELIS, ULTRICIES NEC, PELLENTESQUE EU, PRETIUM QUIS, SEM. NULLA CONSEQUAT MASSA QUIS ENIM. DONEC PEDE JUSTO, FRINGILLA VEL,',
    linkedinUrl: 'https://linkedin.com',
    githubUrl: 'https://github.com',
  },
];

export default function App() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const prevSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, []);

  // Keyboard navigation: immediately navigate on ArrowLeft or ArrowRight
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevSlide, nextSlide]);

  const currentSlide = slides[currentSlideIndex];

  return (
    <main className="min-h-screen w-full bg-[#0a0724] text-white flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 select-none overflow-x-hidden">
      {/* Top Header: "FRONTEND TEAM" matching user template */}
      <header className="mb-6 sm:mb-8 text-center">
        <h1
          className="text-[#a6d2ad] text-4xl sm:text-5xl md:text-6xl uppercase tracking-wider drop-shadow-[0_2px_12px_rgba(166,210,173,0.3)]"
          style={{ fontFamily: "'Bowlby One SC', sans-serif" }}
        >
          FRONTEND TEAM
        </h1>
      </header>

      {/* Main Slide Carousel Area with Left and Right White Arrow Buttons */}
      <div className="relative w-full max-w-[1120px] flex items-center justify-center">
        {/* Left Arrow Button */}
        <button
          onClick={prevSlide}
          aria-label="Previous slide"
          className="z-20 p-1 sm:p-3 mr-0.5 sm:mr-3 text-white hover:scale-110 active:scale-95 transition-transform duration-100 cursor-pointer focus:outline-none shrink-0"
        >
          {/* Crisp White Solid Triangle pointing left matching the template */}
          <svg
            className="w-6 h-8 sm:w-10 sm:h-12 md:w-12 md:h-14 drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]"
            viewBox="0 0 40 50"
            fill="none"
          >
            <polygon
              points="38,4 38,46 4,25"
              fill="#FFFFFF"
              stroke="#000000"
              strokeWidth="1.5"
            />
          </svg>
        </button>

        {/* Central Neon Card with Grunge Splatter Border */}
        <div className="flex-1 max-w-[980px]">
          <NeonSplatterCard>
            {/* Left Column: Graphic / Shape Spot */}
            <div className="w-full md:w-[45%] flex items-center justify-center py-2">
              {currentSlide.graphicType === 'person1' && <PersonOnePlaceholder />}
              {currentSlide.graphicType === 'female' && <DeveloperGraphicFemale />}
              {currentSlide.graphicType === 'male' && <DeveloperGraphicMale />}
            </div>

            {/* Right Column: Name, Description, and Social Links */}
            <div className="w-full md:w-[55%] flex flex-col justify-center items-start text-left pl-0 md:pl-6 space-y-4">
              {/* Developer Name */}
              <h2
                className="text-2xl sm:text-5xl md:text-[64px] uppercase tracking-wider leading-tight sm:leading-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]"
                style={{
                  color: currentSlide.nameColor,
                  fontFamily: "'Bangers', cursive, sans-serif",
                  letterSpacing: '0.05em',
                }}
              >
                {currentSlide.name}
              </h2>

              {/* Description Paragraph */}
              <p
                className="font-bold text-xs sm:text-sm md:text-[15px] leading-relaxed tracking-wider line-clamp-6 md:line-clamp-none max-w-[480px]"
                style={{
                  color: currentSlide.textColor,
                  fontFamily: "'Share Tech Mono', monospace",
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                }}
              >
                {currentSlide.loremIpsum}
              </p>

              {/* Social Profile Buttons (LinkedIn & GitHub) */}
              <div className="pt-2 w-full max-w-[480px] flex justify-center items-center">
                <SocialIcons
                  linkedinUrl={currentSlide.linkedinUrl}
                  githubUrl={currentSlide.githubUrl}
                />
              </div>
            </div>
          </NeonSplatterCard>
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={nextSlide}
          aria-label="Next slide"
          className="z-20 p-1 sm:p-3 ml-0.5 sm:ml-3 text-white hover:scale-110 active:scale-95 transition-transform duration-100 cursor-pointer focus:outline-none shrink-0"
        >
          {/* Crisp White Solid Triangle pointing right matching the template */}
          <svg
            className="w-6 h-8 sm:w-10 sm:h-12 md:w-12 md:h-14 drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]"
            viewBox="0 0 40 50"
            fill="none"
          >
            <polygon
              points="4,4 4,46 38,25"
              fill="#FFFFFF"
              stroke="#000000"
              strokeWidth="1.5"
            />
          </svg>
        </button>
      </div>
    </main>
  );
}

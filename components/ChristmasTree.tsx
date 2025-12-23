
import React, { useState, useEffect } from 'react';
import { UserPreferences } from '../types';

interface Ornament {
  id: number;
  x: number;
  y: number;
  message: string;
}

interface ChristmasTreeProps {
  ornamentMessages: string[];
  starMessage: string;
  prefs: UserPreferences;
}

const ChristmasTree: React.FC<ChristmasTreeProps> = ({ ornamentMessages, starMessage, prefs }) => {
  const [isGrowing, setIsGrowing] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsGrowing(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const ornaments: Ornament[] = [
    { id: 1, x: 50, y: 15, message: ornamentMessages[0] },
    { id: 2, x: 40, y: 35, message: ornamentMessages[1] },
    { id: 3, x: 60, y: 35, message: ornamentMessages[2] },
    { id: 4, x: 35, y: 60, message: ornamentMessages[3] },
    { id: 5, x: 65, y: 60, message: ornamentMessages[4] },
  ];

  const renderOrnamentShape = (id: number) => {
    const baseClasses = `absolute w-8 h-8 md:w-10 md:h-10 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 cursor-help flex items-center justify-center ${prefs.ornamentColor} shadow-[0_0_15px_rgba(255,255,255,0.4)] hover:shadow-[0_0_25px_white] hover:scale-125`;

    if (prefs.ornamentShape === 'star') {
      return (
        <div className={`${baseClasses} clip-star`} style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }}>
          <span className="text-[10px] opacity-30">✨</span>
        </div>
      );
    }
    
    if (prefs.ornamentShape === 'gingerbread') {
      return (
        <div className={`${baseClasses} rounded-lg border-4 border-amber-900/20`}>
          <span className="text-lg">🍪</span>
        </div>
      );
    }

    return <div className={`${baseClasses} rounded-full border-2 border-white/30`} />;
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto flex flex-col items-center">
      {/* Container for the tree and floating messages */}
      <div className={`relative transition-all duration-[2000ms] ${isGrowing ? 'scale-0 translate-y-full opacity-0' : 'scale-100 translate-y-0 opacity-100'}`}>
        
        {/* Floating North Star Message - Positioned above the SVG tree */}
        {hoveredId === 'star' && (
          <div className="absolute top-0 left-1/2 z-[60] w-80 md:w-[400px] float-msg pointer-events-none">
            <div className="relative p-6 bg-white/10 backdrop-blur-2xl rounded-[2.5rem] border-2 border-yellow-400 shadow-[0_0_50px_rgba(255,215,0,0.5)] text-center -mt-8">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 animate-pulse rounded-[2.5rem]" />
              <p className="relative text-xl md:text-3xl font-festive text-yellow-50 drop-shadow-[0_0_10px_rgba(255,215,0,0.8)] leading-relaxed italic">
                {starMessage}
              </p>
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-[12px] border-transparent border-t-yellow-400" />
            </div>
          </div>
        )}

        <svg viewBox="0 0 100 120" className="w-64 md:w-[30rem] overflow-visible drop-shadow-[0_0_30px_rgba(34,197,94,0.3)]">
          <rect x="45" y="90" width="10" height="20" fill="#5D4037" />
          <path d="M50 10 L85 90 L15 90 Z" fill="#1B5E20" />
          <path d="M50 10 L75 70 L25 70 Z" fill="#2E7D32" />
          <path d="M50 10 L65 45 L35 45 Z" fill="#388E3C" />
          
          {/* North Star */}
          <g 
            className="cursor-help pointer-events-auto"
            onMouseEnter={() => setHoveredId('star')}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Extended hit area for the star */}
            <circle cx="50" cy="10" r="15" fill="transparent" />
            <polygon 
              points="50,2 52,8 59,8 54,12 56,18 50,14 44,18 46,12 41,8 48,8" 
              fill="#FFD700" 
              className={`star-glow transition-all duration-500 ${hoveredId === 'star' ? 'scale-150 rotate-[36deg]' : 'scale-100'}`}
              style={{ transformOrigin: '50px 10px' }}
            />
          </g>
        </svg>

        {/* Ornaments overlay */}
        <div className="absolute inset-0 top-0">
          {ornaments.map((ornament) => (
            <div
              key={ornament.id}
              className="absolute z-20"
              style={{ left: `${ornament.x}%`, top: `${ornament.y + 10}%` }}
              onMouseEnter={() => setHoveredId(ornament.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {renderOrnamentShape(ornament.id)}
              
              {/* Ornament Tooltip Message */}
              <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-6 w-52 p-4 bg-white/95 backdrop-blur-md text-gray-800 text-base italic rounded-2xl shadow-2xl transition-all duration-300 pointer-events-none border border-white/50 ${hoveredId === ornament.id ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-90'}`}>
                <div className="relative text-center leading-snug">
                  "{ornament.message}"
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white/95" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {!isGrowing && (
        <div className="mt-16 text-center">
          <p className="text-white text-3xl font-festive tracking-widest animate-pulse drop-shadow-md">
            {hoveredId === 'star' ? "A message from the North Star..." : "Hover to reveal Santa's hidden notes"}
          </p>
          <div className="flex justify-center space-x-4 mt-6">
            <span className="text-yellow-400 text-2xl">✨</span>
            <span className="text-red-400 text-2xl">❄️</span>
            <span className="text-green-400 text-2xl">🎄</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChristmasTree;
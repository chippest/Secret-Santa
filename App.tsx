
import React, { useState, useCallback, useEffect } from 'react';
import Snowfall from './components/Snowfall';
import Quiz from './components/Quiz';
import ChristmasTree from './components/ChristmasTree';
import MusicPlayer from './components/MusicPlayer';
import { AppStage, UserPreferences } from './types';
import { generateOrnamentMessages, GenerationResult } from './services/geminiService';

const App: React.FC = () => {
  const [stage, setStage] = useState<AppStage>(AppStage.START);
  const [genData, setGenData] = useState<GenerationResult | null>(null);
  const [userPrefs, setUserPrefs] = useState<UserPreferences | null>(null);
  const [loadingText, setLoadingText] = useState('Planting your festive spirit...');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Smoother normalized coordinates
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const startJourney = () => {
    setStage(AppStage.QUIZ);
  };

  const handleQuizComplete = useCallback(async (prefs: UserPreferences) => {
    setUserPrefs(prefs);
    setStage(AppStage.GROWING);
    setLoadingText('Consulting the magic list...');
    
    try {
      const result = await generateOrnamentMessages(prefs);
      setGenData(result);
    } catch (e) {
      console.error("Failed to generate messages", e);
    }
    
    setTimeout(() => {
      setStage(AppStage.TREE);
    }, 2500);
  }, []);

  // Panning style: 120% span creates a parallax depth effect
  const panStyle = {
    transform: `translate(${mousePos.x * -8}%, ${mousePos.y * -8}%)`,
    width: '120vw',
    height: '120vh',
    left: '-10vw',
    top: '-10vh',
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0c1445]">
      {/* Immersive 120% Panning Layer */}
      <div 
        className="absolute transition-transform duration-1000 ease-out flex items-center justify-center will-change-transform"
        style={panStyle}
      >
        <Snowfall />
        
        <main className="relative z-10 w-full max-w-7xl flex flex-col items-center justify-center px-4">
          {stage === AppStage.START && (
            <div className="text-center animate-in fade-in slide-in-from-bottom-10 duration-1000 max-w-3xl">
              <div className="mb-8 text-8xl md:text-9xl animate-bounce drop-shadow-[0_0_30px_white]">🎄</div>
              <h1 className="text-7xl md:text-9xl font-festive text-white mb-8 drop-shadow-[0_0_30px_rgba(255,255,255,0.7)]">
                Secret Santa's <br /> Magical Tree
              </h1>
              <p className="text-white/80 text-xl md:text-3xl mb-12 max-w-2xl mx-auto leading-relaxed font-light">
                Discover the messages Santa left just for you. 
                Answer a few questions to see your tree bloom.
              </p>
              <button
                onClick={startJourney}
                className="group px-14 py-6 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white rounded-full font-bold text-3xl transition-all hover:scale-110 shadow-[0_0_50px_rgba(220,38,38,0.5)] active:scale-95 flex items-center space-x-4 mx-auto"
              >
                <span>Enter the Magic</span>
                <span className="group-hover:rotate-12 transition-transform">🎁</span>
              </button>
            </div>
          )}

          {stage === AppStage.QUIZ && (
            <Quiz onComplete={handleQuizComplete} />
          )}

          {stage === AppStage.GROWING && (
            <div className="text-center">
              <div className="mb-12 relative inline-block">
                <div className="w-40 h-40 border-8 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto"></div>
                <div className="absolute inset-0 flex items-center justify-center text-6xl animate-pulse">✨</div>
              </div>
              <h2 className="text-5xl font-festive text-white tracking-[0.3em] animate-pulse drop-shadow-lg">{loadingText}</h2>
              <p className="mt-8 text-white/40 italic text-2xl font-light">Polishing your ornaments...</p>
            </div>
          )}

          {stage === AppStage.TREE && userPrefs && genData && (
            <div className="w-full animate-in fade-in zoom-in duration-1000 flex flex-col items-center">
              <h2 className="text-6xl md:text-8xl font-festive text-white text-center mb-16 drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                Your Festive Gift
              </h2>
              <ChristmasTree 
                ornamentMessages={genData.ornamentMessages} 
                starMessage={genData.starMessage}
                prefs={userPrefs} 
              />
              <button
                onClick={() => setStage(AppStage.START)}
                className="mt-24 px-10 py-4 bg-white/5 hover:bg-white/10 text-white/50 rounded-full text-lg transition-all border border-white/10 hover:text-white backdrop-blur-xl"
              >
                Grow Another Memory ❄️
              </button>
            </div>
          )}
        </main>
      </div>

      <MusicPlayer />
      
      {/* Immersive Decorative Frame */}
      <div className="fixed inset-0 pointer-events-none border-[2rem] border-white/5 z-[100] rounded-[3rem]" />
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 text-white/30 text-xs tracking-[0.8em] uppercase pointer-events-none z-[110]">
        Explore with your cursor &bullet; Happy Holidays
      </div>
    </div>
  );
};

export default App;
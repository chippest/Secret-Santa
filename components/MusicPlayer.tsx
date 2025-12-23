
import React, { useState, useEffect, useRef } from 'react';

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'); 
    audioRef.current.loop = true;
    audioRef.current.volume = 0.25;

    // Attempt autoplay logic - usually needs user interaction
    const attemptPlay = () => {
      if (audioRef.current && !isPlaying) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(e => console.log("Still blocked by browser... waiting for click."));
      }
    };

    // Listen for any interaction to trigger the music if it failed initially
    window.addEventListener('mousedown', attemptPlay, { once: true });
    window.addEventListener('keydown', attemptPlay, { once: true });
    
    // Also try immediately
    attemptPlay();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      window.removeEventListener('mousedown', attemptPlay);
      window.removeEventListener('keydown', attemptPlay);
    };
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log("Playback failed", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed top-6 right-6 z-[100]">
      <button
        onClick={toggleMusic}
        className="group relative flex items-center justify-center w-14 h-14 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-full transition-all duration-500 shadow-2xl overflow-hidden"
      >
        <div className={`absolute inset-0 bg-red-600/20 transition-opacity duration-500 ${isPlaying ? 'opacity-100' : 'opacity-0'}`} />
        <span className="text-2xl relative z-10 group-hover:scale-110 transition-transform">
          {isPlaying ? '🔊' : '🔇'}
        </span>
        {isPlaying && (
          <div className="absolute bottom-2 flex space-x-1">
            <div className="w-1 h-2 bg-red-400 animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-1 h-4 bg-green-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1 h-3 bg-yellow-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        )}
      </button>
    </div>
  );
};

export default MusicPlayer;

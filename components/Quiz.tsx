
import React, { useState } from 'react';
import { UserPreferences } from '../types';

interface QuizProps {
  onComplete: (prefs: UserPreferences) => void;
}

const Quiz: React.FC<QuizProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [prefs, setPrefs] = useState<UserPreferences>({
    favoriteActivity: '',
    favoriteFlavor: '',
    holidayVibe: '',
    wish: '',
    ornamentShape: 'circle',
    ornamentColor: 'bg-red-500',
  });

  const questions = [
    {
      key: 'favoriteActivity',
      question: "What's your favorite winter activity?",
      placeholder: "e.g., Extreme Snowboarding or Napping near fire",
    },
    {
      key: 'favoriteFlavor',
      question: "Which flavor reminds you most of Christmas?",
      placeholder: "e.g., Burnt Gingerbread or Peppermint Mocha",
    },
    {
      key: 'ornamentShape',
      question: "Describe your custom ornament shape:",
      placeholder: "e.g., A tiny penguin, a star, or a circle",
    },
    {
      key: 'ornamentColor',
      question: "What's the signature color of your ornaments?",
      placeholder: "e.g., Neon Purple or Midnight Gold",
    },
    {
      key: 'holidayVibe',
      question: "Describe your ideal holiday vibe in 3 words:",
      placeholder: "e.g., Chaotic, Cozy, Loud",
    },
    {
      key: 'wish',
      question: "Finally, what is your biggest wish for the year?",
      placeholder: "Type your wish here...",
    }
  ];

  const handleNext = () => {
    if (!inputValue.trim()) return;

    const currentKey = questions[step].key as keyof UserPreferences;
    const value = inputValue.trim();
    
    // Logic for shape/color mapping if they type specific keywords, else default
    let finalValue: any = value;
    if (currentKey === 'ornamentShape') {
      if (value.toLowerCase().includes('star')) finalValue = 'star';
      else if (value.toLowerCase().includes('ginger')) finalValue = 'gingerbread';
      else finalValue = 'circle';
    } else if (currentKey === 'ornamentColor') {
      // Very basic mapping for common colors
      const lower = value.toLowerCase();
      if (lower.includes('gold') || lower.includes('yellow')) finalValue = 'bg-yellow-500';
      else if (lower.includes('blue')) finalValue = 'bg-blue-600';
      else if (lower.includes('green')) finalValue = 'bg-green-600';
      else finalValue = 'bg-red-600';
    }

    const updatedPrefs = { ...prefs, [currentKey]: finalValue };
    setPrefs(updatedPrefs);
    setInputValue('');
    
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(updatedPrefs);
    }
  };

  const currentQ = questions[step];

  return (
    <div className="relative z-10 bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-2xl w-full max-w-lg mx-auto transform transition-all animate-in fade-in zoom-in duration-700">
      <div className="mb-6 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
        <div 
          className="h-full bg-red-500 transition-all duration-500" 
          style={{ width: `${((step + 1) / questions.length) * 100}%` }}
        />
      </div>
      
      <h2 className="text-3xl font-festive text-white mb-8 text-center drop-shadow-md">
        {currentQ.question}
      </h2>
      
      <div className="space-y-6">
        <input
          type="text"
          value={inputValue}
          autoFocus
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleNext();
          }}
          className="w-full p-5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-red-400 text-lg shadow-inner"
          placeholder={currentQ.placeholder}
        />
        
        <button
          onClick={handleNext}
          disabled={!inputValue.trim()}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold text-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-95 flex items-center justify-center space-x-2"
        >
          <span>{step === questions.length - 1 ? "Plant my Wish! 🎁" : "Next Step"}</span>
          <span className="text-2xl">✨</span>
        </button>
      </div>
      
      <p className="mt-8 text-white/40 text-[10px] text-center uppercase tracking-[0.3em]">
        Journey Step {step + 1} of {questions.length}
      </p>
    </div>
  );
};

export default Quiz;

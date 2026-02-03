import React, { useCallback, useEffect } from 'react';
import { BanknoteConfig } from '../../types';
import { Icons } from '../../constants';
import BanknoteVisual from './BanknoteVisual';

interface BanknoteProps {
  config: BanknoteConfig;
  count: number;
  onClick?: (config: BanknoteConfig, count: number) => void;
}

// Pre-warm speech synthesis to reduce first-play delay
const warmUpSpeechSynthesis = () => {
  if ('speechSynthesis' in window) {
    const voices = window.speechSynthesis.getVoices();
    // If voices not loaded yet, listen for the event
    if (voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }
};

const Banknote: React.FC<BanknoteProps> = ({ config, count, onClick }) => {
  // Pre-warm on mount
  useEffect(() => {
    warmUpSpeechSynthesis();
  }, []);

  if (count === 0) return null;

  // Reduced visual stack limit from 5 to 3
  const displayCount = Math.min(count, 3); 
  const stack = Array.from({ length: displayCount });

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (onClick) {
      onClick(config, count);
    }
  }, [onClick, config, count]);

  const playAudio = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    // Feature detection for speech synthesis
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(config.label);
      utterance.lang = 'id-ID';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  }, [config.label]);

  return (
    <div className="flex flex-col items-center animate-fade-in-up w-full">
      <div 
        className="relative h-24 w-52 cursor-pointer group mb-2 transition-transform hover:scale-105" 
        onClick={handleClick}
        title="Click for details"
      >
        {/* Stack rendering logic */}
        {stack.map((_, index) => (
          <div
            key={index}
            className="absolute top-0 left-0 w-full h-full transition-transform"
            style={{
              // Stacking offset logic
              transform: `translate(${index * 6}px, ${index * -6}px)`,
              zIndex: index,
            }}
          >
            {/* The actual banknote visual component */}
            <BanknoteVisual 
              config={config} 
              className="w-full h-full text-base" // text-base sets the em scale base
              showDetails={true}
            />
          </div>
        ))}
        
        {/* Count Badge if multiple */}
        {count > 1 && (
          <div 
            className="absolute -top-4 -right-4 bg-stone-800 text-amber-50 font-bold text-sm w-8 h-8 flex items-center justify-center rounded-full shadow-lg z-50 border-2 border-white"
            style={{ transform: `translate(${displayCount * 6}px, ${displayCount * -6}px)`}}
          >
            {count}x
          </div>
        )}
      </div>
      
      {/* Label and Audio Control */}
      <div className="mt-4 flex flex-col items-center gap-1">
        <div className="flex items-center gap-2">
           <span className="text-sm font-bold text-stone-800">{config.label}</span>
           <button 
             onClick={playAudio}
             className="p-1 rounded-full hover:bg-orange-500/10 text-orange-500 transition-colors"
             title="Listen to pronunciation"
           >
             <Icons.Speaker />
           </button>
        </div>
        <span className="text-xs text-stone-500 italic">"{config.englishLabel}"</span>
      </div>
    </div>
  );
};

export default Banknote;
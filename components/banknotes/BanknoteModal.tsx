import React, { useState, useEffect } from 'react';
import { BanknoteConfig } from '../../types';
import { Icons, TRANSLATIONS } from '../../constants';
import BanknoteVisual from './BanknoteVisual';

interface BanknoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: BanknoteConfig | null;
  count: number;
  language: 'en' | 'id';
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

const BanknoteModal: React.FC<BanknoteModalProps> = ({ isOpen, onClose, config, count, language }) => {
  const [selectedYear, setSelectedYear] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Pre-warm speech synthesis when modal opens
  useEffect(() => {
    if (isOpen) {
      warmUpSpeechSynthesis();
    }
  }, [isOpen]);
  
  // Reset state when modal opens or config changes
  useEffect(() => {
    if (config && config.variants && config.variants.length > 0) {
      setSelectedYear(config.variants[0].year); // Default to the first variant (newest)
      setIsFlipped(false);
    }
  }, [config, isOpen]);

  // Prevent scrolling on body when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      
      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }
  }, [isOpen]);

  if (!isOpen || !config) return null;
  const t = TRANSLATIONS[language];

  const totalValue = config.value * count;

  const playAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Feature detection for speech synthesis
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(config.label);
      utterance.lang = 'id-ID';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Get current variant data
  const currentVariant = config.variants?.find(v => v.year === selectedYear) || 
                         (config.variants ? config.variants[0] : null);

  const frontImage = currentVariant?.images.front;
  const backImage = currentVariant?.images.back;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-800/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-stone-300/30 backdrop-blur rounded-full text-stone-600 hover:bg-stone-300/50 transition-colors z-30"
        >
          <Icons.X />
        </button>

        {/* Visual Header with 3D Flip */}
        <div className={`h-64 ${config.color} relative flex flex-col items-center justify-center overflow-hidden shrink-0`}>
           <div className="absolute inset-0 banknote-pattern opacity-30"></div>
           
           {/* Flip Container */}
           <div 
              className="w-72 h-36 relative cursor-pointer group"
              style={{ perspective: '1000px' }}
              onClick={() => setIsFlipped(!isFlipped)}
           >
              <div 
                className="w-full h-full relative transition-all duration-700"
                style={{ 
                  transformStyle: 'preserve-3d',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}
              >
                {/* Front Side */}
                <div 
                  className="absolute inset-0 w-full h-full"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                   <BanknoteVisual 
                      config={config} 
                      className="w-full h-full text-2xl border-2 border-white/30 shadow-xl"
                      showDetails={true}
                      customImageSrc={frontImage}
                   />
                </div>

                {/* Back Side */}
                <div 
                  className="absolute inset-0 w-full h-full"
                  style={{ 
                    backfaceVisibility: 'hidden', 
                    transform: 'rotateY(180deg)' 
                  }}
                >
                   <BanknoteVisual 
                      config={config} 
                      className="w-full h-full text-2xl border-2 border-white/30 shadow-xl"
                      showDetails={true}
                      customImageSrc={backImage}
                   />
                </div>
              </div>
           </div>

           {/* Flip Instruction */}
           <div className="mt-4 flex items-center gap-2 text-white/80 text-xs font-medium animate-pulse">
              <Icons.Rotate />
              <span>{t.flip}</span>
           </div>
        </div>

        {/* Controls Bar: Edition Selector */}
        {config.variants && config.variants.length > 0 && (
          <div className="px-6 py-3 bg-stone-200/30 border-b border-stone-300/20 flex items-center justify-between">
             <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">{t.edition}</span>
             <div className="flex gap-2">
                {config.variants.map(v => (
                  <button
                    key={v.year}
                    onClick={() => setSelectedYear(v.year)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                      selectedYear === v.year 
                        ? 'bg-orange-500 text-white border-orange-500 shadow-md' 
                        : 'bg-white text-stone-600 border-stone-300 hover:border-orange-500/50'
                    }`}
                  >
                    {v.year}
                  </button>
                ))}
             </div>
          </div>
        )}

        {/* Details Body (Scrollable) */}
        <div className="p-6 overflow-y-auto hide-scrollbar">
          <div className="flex justify-between items-start mb-4">
            <div>
               <h3 className="text-2xl font-bold text-stone-800">{config.label}</h3>
               <p className="text-sm text-stone-500 italic">{config.englishLabel}</p>
            </div>
            <button 
             onClick={playAudio}
             className="p-3 rounded-full bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 transition-colors"
             title="Listen to pronunciation"
           >
             <Icons.Speaker />
           </button>
          </div>

          <p className="text-stone-600 text-sm leading-relaxed mb-6 bg-stone-200/30 p-4 rounded-xl border border-stone-300/20">
            {config.description}
          </p>

          {/* Total Calculation - Only show if count > 1 */}
          {count > 1 && (
             <div className="mt-2 p-4 rounded-2xl bg-gradient-to-r from-stone-200/30 to-orange-500/10 border border-orange-500/20">
               <div className="flex justify-between items-end">
                 {/* Left: Calculation Logic */}
                 <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                       <span className="bg-white px-2.5 py-1 rounded-lg shadow-sm border border-stone-300/30 font-bold text-stone-800 text-sm">
                          {count} <span className="text-stone-400 font-normal text-xs">sheets</span>
                       </span>
                       <span className="text-stone-400 text-xs">×</span>
                       <span className="font-bold text-stone-700 text-sm">{config.shortLabel}</span>
                    </div>
                 </div>

                 {/* Right: Result */}
                 <div className="text-right">
                    <div className="text-2xl font-extrabold text-orange-500 leading-none tracking-tight">
                       {totalValue.toLocaleString('id-ID')}
                       <span className="text-sm font-bold text-orange-500/50 ml-1">IDR</span>
                    </div>
                 </div>
               </div>
             </div>
          )}
        </div>
        
        <div className="p-4 bg-stone-200/30 border-t border-stone-300/20 flex justify-center shrink-0">
           <button onClick={onClose} className="text-sm font-bold text-stone-600 hover:text-stone-800 transition-colors">
             {t.close}
           </button>
        </div>
      </div>
    </div>
  );
};

export default BanknoteModal;
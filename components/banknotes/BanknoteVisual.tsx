import React, { useState } from 'react';
import { BanknoteConfig } from '../../types';

interface BanknoteVisualProps {
  config: BanknoteConfig;
  className?: string;
  showDetails?: boolean;
  customImageSrc?: string; // New prop for overriding logic (e.g., showing back side)
}

const BanknoteVisual: React.FC<BanknoteVisualProps> = ({ config, className = "", showDetails = true, customImageSrc }) => {
  const [imageError, setImageError] = useState(false);

  // If customImageSrc is provided (from modal), use it.
  // Otherwise, default to the 2022 front view for general lists.
  const imagePath = customImageSrc || (config.variants ? config.variants[0].images.front : `/banknotes/${config.value}.jpg`);

  // --- RENDER JPG IMAGE (Primary) ---
  if (!imageError) {
    return (
      <div className={`relative overflow-hidden select-none bg-stone-50 ${className}`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 banknote-pattern opacity-40"></div>
        
        <img 
          src={imagePath}
          alt={config.label}
          className="w-full h-full object-contain relative z-10"
          style={{ 
            imageRendering: 'auto',
          }}
          loading="eager"
          decoding="async"
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  // --- CSS ART FALLBACK (Secondary - used if JPG is missing) ---
  return (
    <div className={`relative overflow-hidden rounded-lg border border-black/10 shadow-sm select-none ${config.color} ${config.textColor} ${className}`}>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 banknote-pattern opacity-30"></div>
      
      {/* Corners (Value) */}
      <div className="absolute top-[8%] left-[4%] font-bold text-[0.8em] opacity-90 leading-none">
        {config.shortLabel}
      </div>
      <div className="absolute bottom-[8%] right-[4%] font-bold text-[0.8em] opacity-90 leading-none">
        {config.shortLabel}
      </div>
      
      {/* Center Content */}
      {showDetails && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-[0.5em] uppercase tracking-widest opacity-70 font-semibold mb-[2%]">
            Bank Indonesia
          </div>
          <div className={`text-[1.5em] font-extrabold tracking-tighter ${config.textColor} drop-shadow-sm leading-none`}>
            {config.value.toLocaleString('id-ID')}
          </div>
          <div className="text-[0.6em] mt-[2%] italic font-serif">
            Rupiah
          </div>
        </div>
      )}

      {/* Decorative Side Strip */}
      <div className={`absolute right-[15%] top-0 bottom-0 w-[4%] ${config.accentColor} opacity-50`}></div>
      
      {/* Portrait Placeholder (Circle) */}
      {showDetails && (
        <div className="absolute left-[8%] top-1/2 -translate-y-1/2 w-[25%] aspect-square rounded-full bg-white/20 blur-[1px]"></div>
      )}
    </div>
  );
};

export default BanknoteVisual;
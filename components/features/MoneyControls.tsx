import React, { useCallback } from 'react';
import { Currency } from '../../types';
import { TRANSLATIONS, Icons } from '../../constants';

interface MoneyControlsProps {
  amount: number;
  setAmount: (val: number) => void;
  currency: Currency;
  rate: number;
  language: 'en' | 'id';
}

const MoneyControls: React.FC<MoneyControlsProps> = ({ amount, setAmount, currency, rate, language }) => {
  const t = TRANSLATIONS[language];
  const convertedValue = amount * rate;

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val) && val >= 0) setAmount(val);
    else if (e.target.value === '') setAmount(0);
  }, [setAmount]);

  const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(parseFloat(e.target.value));
  }, [setAmount]);

  const quickAdd = useCallback((val: number) => {
    setAmount(prev => Math.max(0, prev + val));
  }, [setAmount]);

  // Format IDR for display
  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Helper to determine dynamic max for slider based on current input
  const sliderMax = Math.max(500, Math.ceil(amount / 100) * 100 + 100);

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 w-full max-w-xl mx-auto border border-slate-100 relative z-10">
      
      {/* Input Display */}
      <div className="flex flex-col items-center justify-center mb-8">
        <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
          {t.youHave}
        </label>
        <div className="relative flex items-center justify-center w-full font-mono">
            <span className="text-4xl md:text-5xl font-bold text-slate-800 mr-2 flex items-center gap-2">
              <span className={`${currency.flag} rounded-md shadow-sm text-3xl md:text-4xl`}></span>
              {currency.symbol}
            </span>
            <input
              type="number"
              value={amount === 0 ? '' : amount}
              onChange={handleInputChange}
              className="w-40 text-4xl md:text-5xl font-bold text-slate-900 bg-transparent border-b-2 border-dashed border-slate-300 focus:border-indigo-500 outline-none text-center placeholder-slate-200 transition-colors font-mono"
              placeholder="0"
            />
        </div>
        <div className="text-sm text-slate-500 font-medium mt-2">
           {currency.name}
        </div>
      </div>

      {/* Slider */}
      <div className="mb-8 px-2">
        <input
          type="range"
          min="0"
          max={sliderMax}
          step="5"
          value={amount}
          onChange={handleSliderChange}
          className="w-full h-3 bg-slate-100 rounded-lg cursor-pointer accent-indigo-600 hover:accent-indigo-500 transition-all"
        />
      </div>

      {/* Quick Add Buttons */}
      <div className="flex gap-2 justify-center mb-8 flex-wrap">
        {[1, 10, 50, 100].map((val) => (
          <button
            key={val}
            onClick={() => quickAdd(val)}
            className="px-4 py-2 rounded-full bg-slate-50 text-slate-600 font-semibold text-sm hover:bg-indigo-50 hover:text-indigo-600 transition-colors border border-slate-200 active:scale-95"
          >
            +{val}
          </button>
        ))}
         <button
            onClick={() => setAmount(0)}
            className="px-4 py-2 rounded-full bg-red-50 text-red-600 font-semibold text-sm hover:bg-red-100 transition-colors border border-red-100 active:scale-95"
          >
            {t.clear}
          </button>
      </div>

      {/* Result Display */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl p-6 text-white text-center shadow-lg shadow-indigo-200">
        <label className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-1 block">
          {t.approx}
        </label>
        <div className="text-3xl md:text-4xl font-bold truncate font-mono">
          {formatIDR(convertedValue)}
        </div>
        <div className="mt-2 text-indigo-200 text-xs font-medium bg-indigo-900/30 inline-block px-3 py-1 rounded-full font-mono">
          1 {currency.code} ≈ {formatIDR(rate)}
        </div>
      </div>
    </div>
  );
};

export default MoneyControls;
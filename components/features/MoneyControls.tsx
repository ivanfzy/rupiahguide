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

  const quickAdd = useCallback((val: number) => {
    // Check if setAmount accepts a function update (like useState's setter)
    // We cast to any here because we know it's safe if it comes from useState
    // but the type definition above is a union that makes TS unhappy about calling it with a function
    if (typeof setAmount === 'function') {
        // @ts-ignore - handling both direct setter and state updater patterns
        setAmount((prev: number) => Math.max(0, prev + val));
    }
  }, [setAmount]);

  // Format IDR for display
  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8 w-full max-w-xl mx-auto border border-stone-200/50 relative z-10">
      
      {/* Input Display */}
      <div className="flex flex-col items-center justify-center mb-8">
        <label className="text-sm font-medium text-stone-400 mb-2 block">
          {t.youHave}
        </label>
        <div className="relative flex items-center justify-center w-full font-mono">
            <span className="text-4xl md:text-5xl font-bold text-stone-800 mr-2 flex items-center gap-2">
              <span className={`${currency.flag} rounded-md shadow-sm text-3xl md:text-4xl`}></span>
              {currency.symbol}
            </span>
            <input
              type="number"
              value={amount === 0 ? '' : amount}
              onChange={handleInputChange}
              className="w-40 text-4xl md:text-5xl font-bold text-stone-800 bg-transparent border-b-2 border-dashed border-stone-300/50 focus:border-orange-500 outline-none text-center placeholder-stone-300/30 transition-colors font-mono"
              placeholder="0"
            />
        </div>
        <div className="text-sm text-stone-600 font-medium mt-2">
           {currency.name}
        </div>
      </div>

      {/* Quick Add Buttons */}
      <div className="flex gap-2 justify-center mb-8 flex-wrap">
        {[1, 10, 50, 100].map((val) => (
          <button
            key={val}
            onClick={() => quickAdd(val)}
            className="px-4 py-2 rounded-full bg-stone-200 text-stone-600 font-semibold text-sm hover:bg-orange-500/10 hover:text-orange-500 transition-colors border border-stone-300/30 active:scale-95"
          >
            +{val}
          </button>
        ))}
         <button
            onClick={() => setAmount(0)}
            className="px-4 py-2 rounded-full bg-red-50 text-red-600 font-semibold text-sm hover:bg-red-100 transition-colors border border-red-100 active:scale-95 flex items-center gap-1"
          >
            <Icons.Trash className="w-4 h-4" /> {t.clear}
          </button>
      </div>

      {/* Result Display */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl p-6 text-white text-center shadow-lg shadow-orange-500/20">
        <label className="text-xs font-medium text-white/60 mb-1 block">
          {t.approx}
        </label>
        <div className="text-3xl md:text-4xl font-bold truncate font-mono">
          {formatIDR(convertedValue)}
        </div>
        <div className="mt-2 text-white/70 text-xs font-medium bg-stone-800/20 inline-block px-3 py-1 rounded-full font-mono">
          1 {currency.code} ≈ {formatIDR(rate)}
        </div>
      </div>
    </div>
  );
};

export default MoneyControls;
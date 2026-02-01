import React, { useState, useEffect, useCallback } from 'react';
import { IDR_BANKNOTES, SUPPORTED_CURRENCIES, ALL_AVAILABLE_CURRENCIES, TRANSLATIONS, Icons } from '../../constants';
import { RateMap } from '../../types';
import BanknoteControl from '../banknotes/BanknoteControl';
import AddCurrencyModal from './AddCurrencyModal';

import { cn } from '@/lib/utils';
import { CardOverlap } from '@/components/ui/CardOverlap';

interface RupiahCounterProps {
  popularRates: RateMap;
  lastUpdated: string;
  language: 'en' | 'id';
  favCurrencyCode: string;
  setFavCurrencyCode: (code: string) => void;
}

const RupiahCounter: React.FC<RupiahCounterProps> = ({ popularRates, lastUpdated, language, favCurrencyCode, setFavCurrencyCode }) => {
  const t = TRANSLATIONS[language];
  const [counts, setCounts] = useState<Record<number, number>>({});
  const [total, setTotal] = useState<number>(0);
  const [manualInput, setManualInput] = useState<string>("");
  
  // Active currencies state
  const [activeCurrencies, setActiveCurrencies] = useState<string[]>(
    SUPPORTED_CURRENCIES.map(c => c.code)
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Initialize counts
  useEffect(() => {
    const initial: Record<number, number> = {};
    IDR_BANKNOTES.forEach(note => initial[note.value] = 0);
    setCounts(initial);
  }, []);

  const reverseCalculate = useCallback((val: number) => {
    let remaining = val;
    const newCounts: Record<number, number> = {};
    
    IDR_BANKNOTES.forEach(note => {
      if (remaining >= note.value) {
        const count = Math.floor(remaining / note.value);
        newCounts[note.value] = count;
        remaining -= count * note.value;
      } else {
        newCounts[note.value] = 0;
      }
    });
    setCounts(newCounts);
  }, []);

  const updateCount = useCallback((value: number, delta: number) => {
    setCounts(prev => {
      const newCount = Math.max(0, (prev[value] || 0) + delta);
      const newCounts = { ...prev, [value]: newCount };
      
      // Recalculate total
      const newTotal = IDR_BANKNOTES.reduce((sum, note) => {
        return sum + (note.value * (newCounts[note.value] || 0));
      }, 0);
      
      setTotal(newTotal);
      setManualInput(newTotal.toString());
      return newCounts;
    });
  }, []);

  const handleManualInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const valStr = e.target.value.replace(/[^0-9]/g, '');
    setManualInput(valStr);
    const val = parseInt(valStr || '0', 10);
    setTotal(val);
    reverseCalculate(val);
  }, [reverseCalculate]);

  const addToTotal = useCallback((amount: number) => {
    setTotal(prev => {
      const newTotal = prev + amount;
      setManualInput(newTotal.toString());
      reverseCalculate(newTotal);
      return newTotal;
    });
  }, [reverseCalculate]);

  const clearTotal = useCallback(() => {
    setTotal(0);
    setManualInput("0");
    const initial: Record<number, number> = {};
    IDR_BANKNOTES.forEach(note => initial[note.value] = 0);
    setCounts(initial);
  }, []);

  const handleAddCurrency = useCallback((code: string) => {
    if (!activeCurrencies.includes(code)) {
      setActiveCurrencies(prev => [...prev, code]);
    }
  }, [activeCurrencies]);

  const handleRemoveCurrency = useCallback((code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Don't allow removing the last currency
    if (activeCurrencies.length <= 1) return;
    
    setActiveCurrencies(prev => prev.filter(c => c !== code));
    
    // If we removed the favorite, clear it
    if (code === favCurrencyCode) {
      setFavCurrencyCode('');
    }
  }, [activeCurrencies.length, favCurrencyCode, setFavCurrencyCode]);

  // Sort currencies so favorite is at top, then filter by active list
  const sortedRates = Object.entries(popularRates)
    .filter(([code]) => activeCurrencies.includes(code))
    .sort(([a], [b]) => {
      if (a === favCurrencyCode) return -1;
      if (b === favCurrencyCode) return 1;
      return a.localeCompare(b);
    });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Total Input Section */}
      <CardOverlap 
        className="-mt-14 mx-4"
      >
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 text-center">
          <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
          {t.totalCash}
        </label>
        <div className="flex items-center justify-center gap-2 font-mono">
            <span className="text-3xl font-bold text-slate-300">Rp</span>
            <input 
              type="text" 
              inputMode="numeric"
              value={total === 0 ? '' : Number(manualInput).toLocaleString('id-ID')}
              onChange={handleManualInputChange}
              placeholder="0"
              className="text-4xl md:text-5xl font-bold text-slate-900 w-full max-w-[300px] text-center border-b-2 border-slate-100 focus:border-indigo-500 outline-none bg-transparent placeholder-slate-200 font-mono"
            />
        </div>
        
        {/* ATM Presets */}
        <div className="mt-6">
          <p className="text-xs text-slate-400 mb-2 font-medium">{t.atmPresets}</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[50000, 100000, 300000, 500000, 1000000].map(val => (
              <button
                key={val}
                onClick={() => addToTotal(val)}
                className="px-4 py-2 rounded-full bg-slate-50 text-slate-600 font-semibold text-sm hover:bg-indigo-50 hover:text-indigo-600 transition-colors border border-slate-200 active:scale-95 flex items-center gap-1 font-mono"
              >
                <Icons.Plus className="w-3 h-3" /> {val.toLocaleString('id-ID')}
              </button>
            ))}
            <button
               onClick={clearTotal}
               className="px-4 py-2 rounded-full bg-red-50 text-red-600 font-semibold text-sm hover:bg-red-100 transition-colors border border-red-100 active:scale-95 flex items-center gap-1"
             >
               <Icons.Trash className="w-4 h-4" /> {t.clear}
             </button>
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-4 italic">
          {t.typeManual}
        </p>
        </div>
      </CardOverlap>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
        
        {/* Left Column: Banknote Counters */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-700 px-1 flex items-center gap-2">
            <Icons.Wallet className="w-5 h-5 text-indigo-500" />
            {t.banknoteBreakdown}
          </h3>
          <div className="space-y-3">
            {IDR_BANKNOTES.map(note => (
              <BanknoteControl 
                key={note.value}
                config={note}
                count={counts[note.value] || 0}
                onIncrement={() => updateCount(note.value, 1)}
                onDecrement={() => updateCount(note.value, -1)}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Conversions */}
        <div className="space-y-4">
           <div className="flex justify-between items-baseline px-1">
             <h3 className="font-bold text-slate-700 flex items-center gap-2">
               <Icons.Receipt className="w-5 h-5 text-indigo-500" />
               {t.worthApprox}
             </h3>
             <span className="text-[10px] text-slate-400">{t.lastUpdated} {lastUpdated}</span>
           </div>
           
           <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full mix-blend-overlay filter blur-2xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="space-y-0 relative z-10 divide-y divide-slate-800/50">
                 {sortedRates.map(([code, rate]) => {
                   const currency = ALL_AVAILABLE_CURRENCIES.find(c => c.code === code);
                   const val = total === 0 ? 0 : total / (rate as number);
                   // Format using id-ID to ensure correct decimals (commas)
                   const displayValue = val.toLocaleString('id-ID', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
                   const rateIDR = (rate as number).toLocaleString('id-ID');
                   const isFav = code === favCurrencyCode;

                   return (
                     <div key={code} className={`flex justify-between items-center py-4 first:pt-0 last:pb-0 ${isFav ? 'bg-white/5 -mx-6 px-6 relative' : ''}`}>
                        {isFav && <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400"></div>}
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-lg overflow-hidden relative">
                             <span className={`${currency?.flag} absolute inset-0 w-full h-full object-cover`}></span>
                           </div>
                           <div>
                             <div className="flex items-center gap-3 font-bold text-slate-200 leading-tight">
                               {code}
                               <button 
                                 onClick={() => setFavCurrencyCode(isFav ? '' : code)}
                                 className={`${isFav ? 'text-yellow-400' : 'text-slate-600 hover:text-yellow-400'} transition-colors p-1 rounded-full hover:bg-white/5`}
                                 title={isFav ? "Unset Favorite" : "Set as Favorite"}
                               >
                                 <Icons.Star filled={isFav} />
                               </button>
                               <button 
                                 onClick={(e) => handleRemoveCurrency(code, e)}
                                 className="text-slate-600 hover:text-red-400 transition-colors p-1 rounded-full hover:bg-white/5"
                                 title="Remove Currency"
                               >
                                 <Icons.X size={16} weight="bold" />
                               </button>
                             </div>
                             <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                                1 {code} = {rateIDR} IDR
                             </div>
                           </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-lg text-white tabular-nums font-mono">
                            <span className="text-indigo-300 mr-2 text-md font-normal">{currency?.symbol}</span>
                            {displayValue}
                          </div>
                        </div>
                     </div>
                   );
                 })}

                 {/* Add Currency Button inside the panel */}
                 <div className="pt-2">
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="w-full py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all flex items-center justify-center gap-2 border border-transparent hover:border-slate-700/50 group"
                    >
                      <div className="p-1 rounded-md bg-white/5 group-hover:bg-indigo-500/20 text-slate-400 group-hover:text-indigo-300 transition-colors">
                        <Icons.Plus size={14} weight="bold" />
                      </div>
                      {language === 'en' ? "Add Currency" : "Tambah Mata Uang"}
                    </button>
                 </div>
              </div>
           </div>
           
           <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-4 text-sm text-yellow-800">
             <p><strong>Note:</strong> {t.rateNote}</p>
           </div>
        </div>

      </div>

      <AddCurrencyModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        activeCurrencies={activeCurrencies}
        onAddCurrency={handleAddCurrency}
        language={language}
      />
    </div>
  );
};

export default RupiahCounter;
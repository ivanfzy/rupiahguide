import React, { useState, useMemo } from 'react';
import { ALL_AVAILABLE_CURRENCIES, Icons } from '../../constants';
import { cn } from '@/lib/utils';

interface AddCurrencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeCurrencies: string[];
  onAddCurrency: (code: string) => void;
  language: 'en' | 'id';
}

const AddCurrencyModal: React.FC<AddCurrencyModalProps> = ({ 
  isOpen, 
  onClose, 
  activeCurrencies, 
  onAddCurrency,
  language 
}) => {
  const [search, setSearch] = useState('');

  // Filter available currencies
  const filteredCurrencies = useMemo(() => {
    return ALL_AVAILABLE_CURRENCIES.filter(c => {
      // Exclude already active ones
      if (activeCurrencies.includes(c.code)) return false;
      
      // Filter by search
      const query = search.toLowerCase();
      return (
        c.code.toLowerCase().includes(query) || 
        c.name.toLowerCase().includes(query)
      );
    });
  }, [search, activeCurrencies]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-800/40 backdrop-blur-sm cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="bg-amber-50 rounded-3xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200 cursor-default border border-stone-300/30"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-6 border-b border-stone-300/30 flex justify-between items-center bg-stone-200/30 rounded-t-3xl">
          <h2 className="text-xl font-bold text-stone-800">
            {language === 'en' ? 'Add Currency' : 'Tambah Mata Uang'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-300/30 text-stone-600 transition-colors"
          >
            <Icons.X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-stone-300/30">
          <div className="relative">
            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input 
              type="text" 
              placeholder={language === 'en' ? "Search currency..." : "Cari mata uang..."}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-200/30 border border-stone-300/30 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-2 mr-2 mb-2 scrollbar-thin scrollbar-thumb-stone-200 scrollbar-track-transparent">
          {filteredCurrencies.length === 0 ? (
            <div className="text-center py-12 text-stone-500">
              <Icons.Globe size={48} className="mx-auto mb-3 opacity-20" />
              <p>{language === 'en' ? "No currencies found" : "Mata uang tidak ditemukan"}</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredCurrencies.map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => {
                    onAddCurrency(currency.code);
                    setSearch('');
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 p-3 hover:bg-stone-200 rounded-xl transition-colors text-left group"
                >
                  <span className={`${currency.flag} text-2xl rounded-sm shadow-sm`}></span>
                  <div>
                    <div className="font-bold text-stone-800 flex items-center gap-2">
                      {currency.code}
                      <span className="text-xs font-normal text-stone-500 bg-stone-200 px-1.5 py-0.5 rounded">
                        {currency.symbol}
                      </span>
                    </div>
                    <div className="text-xs text-stone-600">{currency.name}</div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-orange-500">
                    <Icons.Plus size={20} weight="bold" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AddCurrencyModal;

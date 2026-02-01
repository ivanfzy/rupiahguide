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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-3xl">
          <h2 className="text-xl font-bold text-slate-800">
            {language === 'en' ? 'Add Currency' : 'Tambah Mata Uang'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <Icons.X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder={language === 'en' ? "Search currency..." : "Cari mata uang..."}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-2 mr-2 mb-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          {filteredCurrencies.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
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
                  className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors text-left group"
                >
                  <span className={`${currency.flag} text-2xl rounded-sm shadow-sm`}></span>
                  <div>
                    <div className="font-bold text-slate-800 flex items-center gap-2">
                      {currency.code}
                      <span className="text-xs font-normal text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        {currency.symbol}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">{currency.name}</div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-600">
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

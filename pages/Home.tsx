import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { SUPPORTED_CURRENCIES, IDR_BANKNOTES, Icons, TRANSLATIONS } from '../constants';
import { Currency, ConversionData, RateMap, BanknoteConfig } from '../types';
import { fetchLiveRate, fetchPopularRates, FALLBACK_RATES } from '../services/geminiService';
import MoneyControls from '../components/features/MoneyControls';
import Banknote from '../components/banknotes/Banknote';
import BanknoteModal from '../components/banknotes/BanknoteModal';
import RupiahCounter from '../components/features/RupiahCounter';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import SEOHead from '../components/seo/SEOHead';
import { SCHEMA_ORG } from '@/config/seo';

import { HeroSection } from '@/components/ui/HeroSection';
import { CardOverlap } from '@/components/ui/CardOverlap';
import { cn } from '@/lib/utils';

function Home() {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'counter'>('counter');
  const [language, setLanguage] = useState<'en' | 'id'>('en');
  const [favCurrencyCode, setFavCurrencyCode] = useState<string>('USD');
  const t = TRANSLATIONS[language];
  
  // --- State for Visualizer ---
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(SUPPORTED_CURRENCIES[0]);
  const [amount, setAmount] = useState<number>(100);
  const [conversionData, setConversionData] = useState<ConversionData>({
    rate: 0,
    lastUpdated: 'Loading...',
    sources: []
  });
  const [loading, setLoading] = useState<boolean>(true);

  
  // --- Modal State ---
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNoteData, setSelectedNoteData] = useState<{config: BanknoteConfig, count: number} | null>(null);

  // --- State for Counter ---
  const [popularRates, setPopularRates] = useState<RateMap>(FALLBACK_RATES);
  const [popularRatesLastUpdated, setPopularRatesLastUpdated] = useState<string>("");

  // Initial Load - Parallel API calls for better performance
  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([
        updateRate(selectedCurrency.code),
        loadPopularRates()
      ]);
    };
    loadInitialData();
  }, []); // Only run on mount

  const updateRate = async (code: string) => {
    setLoading(true);
    const data = await fetchLiveRate(code);
    setConversionData(data);
    
    // Update the popularRates cache if this currency exists there
    // This ensures consistency between Visualizer and Counter tabs
    if (data.rate > 0) {
      setPopularRates(prev => ({
        ...prev,
        [code]: data.rate
      }));
    }
    
    setLoading(false);
  };

  const loadPopularRates = async () => {
    const rates = await fetchPopularRates();
    // Only update if we got valid rates (not empty)
    if (Object.keys(rates).length > 0) {
      setPopularRates(prev => ({...prev, ...rates}));
      setPopularRatesLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
  };

  const handleCurrencyChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const currency = SUPPORTED_CURRENCIES.find(c => c.code === e.target.value);
    if (currency) {
      setSelectedCurrency(currency);
      updateRate(currency.code);
    }
  }, []);

  const toggleFavorite = useCallback(() => {
    if (favCurrencyCode === selectedCurrency.code) {
      setFavCurrencyCode(''); // Remove favorite if already selected
    } else {
      setFavCurrencyCode(selectedCurrency.code); // Set as favorite
    }
  }, [favCurrencyCode, selectedCurrency.code]);
  
  const handleNoteClick = useCallback((config: BanknoteConfig, count: number) => {
    setSelectedNoteData({ config, count });
    setModalOpen(true);
  }, []);
  
  const closeModal = useCallback(() => {
    setModalOpen(false);
    setTimeout(() => setSelectedNoteData(null), 300); // Wait for animation ideally, but simplified here
  }, []);

  // Sort currencies: Favorite first, then alphabetical
  const sortedCurrencies = useMemo(() => {
    return [...SUPPORTED_CURRENCIES].sort((a, b) => {
      if (a.code === favCurrencyCode) return -1;
      if (b.code === favCurrencyCode) return 1;
      return a.code.localeCompare(b.code);
    });
  }, [favCurrencyCode]);

  // --- Visualizer Logic ---
  const currentIDR = Math.round(amount * conversionData.rate);

  const breakdown = useMemo(() => {
    let remaining = currentIDR;
    const result: { config: typeof IDR_BANKNOTES[0]; count: number }[] = [];
    const availableNotes = IDR_BANKNOTES;

    for (const note of availableNotes) {
      if (remaining >= note.value) {
        const count = Math.floor(remaining / note.value);
        remaining -= count * note.value;
        result.push({ config: note, count });
      }
    }
    return result;
  }, [currentIDR]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <SEOHead 
        title="RupiahGuide - Indonesia Travel Money Guide" 
        schema={SCHEMA_ORG.website}
      />
      
      <Navbar language={language} setLanguage={setLanguage} />

      {/* Hero / Tab Background */}
      <HeroSection className="pb-18 pt-10">
        
        {/* Tab Navigation */}
        <div 
          className={cn(
            "max-w-md mx-auto bg-slate-800/50 p-1.5 rounded-full border border-slate-700/50 backdrop-blur-md flex relative z-20",
            "mt-8"
          )}
        >
          <button
            onClick={() => setActiveTab('counter')}
            className={`flex-1 py-3 px-4 rounded-full text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
              activeTab === 'counter' 
                ? 'bg-indigo-500 text-white shadow-lg' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Icons.Money className="w-5 h-5" />
            <span className="truncate">{t.tabIdr}</span>
          </button>
          <button
            onClick={() => setActiveTab('visualizer')}
            className={`flex-1 py-3 px-4 rounded-full text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
              activeTab === 'visualizer' 
                ? 'bg-indigo-500 text-white shadow-lg' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Icons.Globe className="w-5 h-5" />
            <span className="truncate">{t.tabForeign}</span>
          </button>
        </div>
      </HeroSection>

      {/* Main Content Area */}
      <main className="px-2 flex-grow">
        
        {activeTab === 'visualizer' ? (
          <>
            {/* --- VISUALIZER MODE --- */}
            <div className="relative pt-6">
              
              {/* Currency Selector */}
              <div className="flex justify-center mb-6 px-4">
                 <CardOverlap className="-mt-14 w-full max-w-lg">
                   <div className="flex items-center justify-center gap-4 bg-white p-2.5 rounded-full border border-slate-200 shadow-lg w-full">
                    <div className="flex items-center gap-3 px-4 border-r border-slate-100 flex-1">
                      <span className={`${selectedCurrency.flag} text-3xl rounded-sm shadow-sm`}></span>
                      <select 
                       className="bg-transparent font-bold outline-none text-base w-full appearance-none cursor-pointer text-slate-800 py-1"
                       value={selectedCurrency.code}
                       onChange={handleCurrencyChange}
                      >
                        {sortedCurrencies.map(c => (
                          <option key={c.code} value={c.code} className="text-slate-900">
                            {c.code} - {c.name} {c.code === favCurrencyCode ? '★' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Favorite Button */}
                    <div className="flex items-center gap-1 pr-1">
                      <button 
                        onClick={toggleFavorite}
                        className={`p-2.5 rounded-full transition-colors ${selectedCurrency.code === favCurrencyCode ? 'text-yellow-400' : 'text-slate-300 hover:text-yellow-400'}`}
                        title={selectedCurrency.code === favCurrencyCode ? "Unset Favorite" : "Set as Favorite"}
                      >
                        <Icons.Star size={20} filled={selectedCurrency.code === favCurrencyCode} />
                      </button>

                      <button 
                        onClick={() => updateRate(selectedCurrency.code)} 
                        className={`p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all ${loading ? 'animate-spin' : ''}`}
                        title="Refresh Rate"
                      >
                         <Icons.Refresh size={20} weight="bold" />
                      </button>
                    </div>
                 </div>
                 </CardOverlap>
              </div>

              <MoneyControls 
                amount={amount} 
                setAmount={setAmount} 
                currency={selectedCurrency} 
                rate={conversionData.rate} 
                language={language}
              />

              {/* Info Bar */}
              <div className="max-w-xl mx-auto mt-6 flex justify-between items-center text-xs text-slate-400 px-4">
                <div className="flex items-center gap-1">
                    <Icons.Info />
                    {/* Explicitly using id-ID to show correct thousand separators for the rate */}
                    <span className="font-mono">{t.rate}: 1 {selectedCurrency.code} = {conversionData.rate.toLocaleString('id-ID')} IDR</span>
                 </div>
                <div className="flex items-center gap-2">
                  <span>{t.lastUpdated} {conversionData.lastUpdated}</span>
                  {conversionData.sources.length > 0 && (
                    <a href={conversionData.sources[0]} target="_blank" rel="noreferrer" className="hover:text-indigo-500 flex items-center gap-1 transition-colors ml-2">
                      <Icons.Search />
                      <span className="hidden sm:inline">{t.verified}</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Visualization Section */}
              <div className="max-w-4xl mx-auto mt-12">
                 <div className="flex items-center justify-center mb-8 px-4">
                   <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                     <Icons.Coins className="w-6 h-6 text-indigo-500" />
                     {t.visualBreakdown}
                   </h2>
                 </div>

                 <div className="bg-white rounded-3xl p-8 min-h-[300px] border border-slate-100 shadow-xl shadow-slate-200/50">
                    {amount === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-slate-300 py-12">
                         <div className="w-16 h-16 mb-4 opacity-50"><Icons.Wallet /></div>
                         <p>{t.enterAmount}</p>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-16 gap-x-6 place-items-center">
                           {breakdown.map((item) => (
                              <Banknote 
                                key={item.config.value} 
                                config={item.config} 
                                count={item.count} 
                                onClick={handleNoteClick}
                              />
                           ))}
                           {breakdown.length === 0 && currentIDR > 0 && (
                             <div className="col-span-full text-center text-slate-400 py-10">
                               {t.amountTooSmall}
                             </div>
                           )}
                        </div>
                      </>
                    )}
                 </div>
              </div>
            </div>
            
            <BanknoteModal 
              isOpen={modalOpen} 
              onClose={closeModal} 
              config={selectedNoteData?.config || null} 
              count={selectedNoteData?.count || 0}
              language={language}
            />
          </>
        ) : (
          /* --- COUNTER MODE --- */
          <div className="pt-2">
            <RupiahCounter 
              popularRates={popularRates} 
              lastUpdated={popularRatesLastUpdated}
              language={language}
              favCurrencyCode={favCurrencyCode}
              setFavCurrencyCode={setFavCurrencyCode}
            />
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}

export default Home;

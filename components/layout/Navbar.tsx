import React from 'react';
import { Link } from 'react-router-dom';
import { Icons, TRANSLATIONS } from '../../constants';

interface NavbarProps {
  language: 'en' | 'id';
  setLanguage: (lang: 'en' | 'id') => void;
}

const Navbar: React.FC<NavbarProps> = ({ language, setLanguage }) => {
  const t = TRANSLATIONS[language];

  return (
    <nav className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 shadow-xl">
      <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
           <div className="bg-indigo-600 p-1 rounded-lg text-white">
              <Icons.MoneyWavy className="w-6 h-6" weight="duotone" />
           </div>
           <span className="text-white font-bold text-lg tracking-tight">RupiahGuide</span>
        </Link>

        {/* Menu & Language */}
        <div className="flex items-center gap-6">
          <div className="md:flex gap-6">
             <Link to="/blog" className="text-slate-300 hover:text-white text-sm font-medium transition-colors flex items-center gap-2">
               <Icons.Article className="w-4 h-4" />
               {t.blog}
             </Link>
          </div>
          
          {/* Language Switch */}
          <div className="flex bg-slate-800 rounded-lg p-1">
            <button 
              onClick={() => setLanguage('id')}
              className={`px-2 py-1 text-xs font-bold rounded-sm ${language === 'id' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              ID
            </button>
            <button 
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 text-xs font-bold rounded-sm ${language === 'en' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
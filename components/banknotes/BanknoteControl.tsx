import React from 'react';
import { BanknoteConfig } from '../../types';
import BanknoteVisual from './BanknoteVisual';
import { Icons } from '../../constants';

interface BanknoteControlProps {
  config: BanknoteConfig;
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

const BanknoteControl: React.FC<BanknoteControlProps> = ({ config, count, onIncrement, onDecrement }) => {
  return (
    <div className="flex items-center justify-between bg-white p-3 rounded-2xl shadow-sm transition-all">
      {/* Visual Preview (Mini) using the new shared component */}
      <div className="h-12 w-24 flex-shrink-0">
        <BanknoteVisual 
          config={config} 
          className="w-full h-full text-xs" // text-xs scales down the internal text
          showDetails={false} // Hide detailed text for this small view
        />
      </div>

      {/* Label and Value */}
      <div className="flex-grow px-4">
        <div className="font-bold text-slate-800 text-sm">{config.label}</div>
        <div className="text-xs text-slate-400 font-mono">Rp {config.value.toLocaleString('id-ID')}</div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 bg-slate-50 p-1 rounded-xl">
        <button 
          onClick={onDecrement}
          disabled={count === 0}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 hover:text-indigo-600 transition-colors"
        >
          <Icons.Minus className="w-4 h-4" />
        </button>
        <span className="w-6 text-center font-bold text-slate-700 font-mono">{count}</span>
        <button 
          onClick={onIncrement}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm shadow-indigo-200 hover:bg-indigo-700 transition-colors"
        >
          <Icons.Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default BanknoteControl;
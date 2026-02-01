import React from 'react';

interface ReferenceItem {
  name: string;
  price: number;
  emoji: string;
}

// Average tourist prices in Indonesia (Bali/Jakarta weighted)
const REFERENCE_ITEMS: ReferenceItem[] = [
  { name: 'Mineral Water (1.5L)', price: 6000, emoji: '💧' },
  { name: 'Instant Noodle (Indomie)', price: 4000, emoji: '🍜' },
  { name: 'Fresh Coconut', price: 20000, emoji: '🥥' },
  { name: 'Local Coffee', price: 15000, emoji: '☕' },
  { name: 'Nasi Goreng (Street)', price: 25000, emoji: '🍛' },
  { name: 'Small Beer (Bintang)', price: 35000, emoji: '🍺' },
  { name: 'Motorbike Rent (1 Day)', price: 75000, emoji: '🛵' },
  { name: 'Massage (1 Hour)', price: 100000, emoji: '💆' },
  { name: 'Cafe Meal + Drink', price: 150000, emoji: '🍽️' },
  { name: 'Budget Hotel Room', price: 300000, emoji: '🛏️' },
];

interface PriceReferenceProps {
  amountIDR: number;
}

const PriceReference: React.FC<PriceReferenceProps> = ({ amountIDR }) => {
  if (amountIDR < 4000) return null;

  // Filter items that can be bought at least once
  const affordableItems = REFERENCE_ITEMS.filter(item => amountIDR >= item.price);
  
  // Select up to 4 representative items to display
  // We try to pick items where the quantity is reasonable (e.g., not 100 bottles of water)
  const displayItems = affordableItems.slice().reverse().slice(0, 4);

  return (
    <div className="mt-8 bg-indigo-50/50 rounded-3xl p-6 border border-indigo-100">
      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
        <span className="text-lg">🛒</span> Purchasing Power Context
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {displayItems.map((item) => {
          const quantity = Math.floor(amountIDR / item.price);
          return (
            <div key={item.name} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-indigo-50 shadow-sm">
              <div className="text-2xl">{item.emoji}</div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-800 leading-tight">
                  {quantity}x {item.name}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  @ {item.price.toLocaleString('id-ID')} IDR
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-[10px] text-slate-400 mt-3 text-center italic">
        *Average prices in tourist areas (Bali/Jakarta).
      </p>
    </div>
  );
};

export default PriceReference;
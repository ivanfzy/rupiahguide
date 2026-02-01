import { BanknoteConfig, Currency } from './types';
import React from 'react';
import {
  ArrowsClockwise,
  Wallet,
  MagnifyingGlass,
  Info,
  SpeakerHigh,
  Star,
  X,
  Plus,
  Minus,
  Trash,
  Globe,
  Flag,
  BookOpen,
  Article,
  Translate,
  Coins,
  Receipt,
  Money,
  MoneyWavy,
  CaretLeft,
  Question
} from '@phosphor-icons/react';

export const DEFAULT_CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US Dollar', flag: 'fi fi-us', symbol: '$' },
  { code: 'EUR', name: 'Euro', flag: 'fi fi-eu', symbol: '€' },
  { code: 'AUD', name: 'Australian Dollar', flag: 'fi fi-au', symbol: 'A$' },
  { code: 'SGD', name: 'Singapore Dollar', flag: 'fi fi-sg', symbol: 'S$' },
  { code: 'JPY', name: 'Japanese Yen', flag: 'fi fi-jp', symbol: '¥' },
  { code: 'GBP', name: 'British Pound', flag: 'fi fi-gb', symbol: '£' },
  { code: 'MYR', name: 'Malaysian Ringgit', flag: 'fi fi-my', symbol: 'RM' },
];

export const ALL_AVAILABLE_CURRENCIES: Currency[] = [
  ...DEFAULT_CURRENCIES,
  { code: 'CNY', name: 'Chinese Yuan', flag: 'fi fi-cn', symbol: '¥' },
  { code: 'KRW', name: 'South Korean Won', flag: 'fi fi-kr', symbol: '₩' },
  { code: 'THB', name: 'Thai Baht', flag: 'fi fi-th', symbol: '฿' },
  { code: 'SAR', name: 'Saudi Riyal', flag: 'fi fi-sa', symbol: '﷼' },
  { code: 'HKD', name: 'Hong Kong Dollar', flag: 'fi fi-hk', symbol: 'HK$' },
  { code: 'TWD', name: 'New Taiwan Dollar', flag: 'fi fi-tw', symbol: 'NT$' },
  { code: 'INR', name: 'Indian Rupee', flag: 'fi fi-in', symbol: '₹' },
  { code: 'PHP', name: 'Philippine Peso', flag: 'fi fi-ph', symbol: '₱' },
  { code: 'VND', name: 'Vietnamese Dong', flag: 'fi fi-vn', symbol: '₫' },
  { code: 'NZD', name: 'New Zealand Dollar', flag: 'fi fi-nz', symbol: 'NZ$' },
  { code: 'CAD', name: 'Canadian Dollar', flag: 'fi fi-ca', symbol: 'C$' },
  { code: 'CHF', name: 'Swiss Franc', flag: 'fi fi-ch', symbol: 'Fr' },
  { code: 'AED', name: 'UAE Dirham', flag: 'fi fi-ae', symbol: 'dh' },
  { code: 'BRL', name: 'Brazilian Real', flag: 'fi fi-br', symbol: 'R$' },
  { code: 'TRY', name: 'Turkish Lira', flag: 'fi fi-tr', symbol: '₺' },
  { code: 'RUB', name: 'Russian Ruble', flag: 'fi fi-ru', symbol: '₽' },
];

// For backward compatibility if needed, but we should use DEFAULT_CURRENCIES for initial state
export const SUPPORTED_CURRENCIES = DEFAULT_CURRENCIES;

// Helper to generate paths based on naming convention: /banknotes/{value}-{year}-{side}.jpg
const getVariant = (val: number, year: number) => ({
  year,
  emissionName: `Emisi ${year}`,
  images: {
    front: `/banknotes/${val}-${year}-front.jpg`,
    back: `/banknotes/${val}-${year}-back.jpg`
  }
});

export const IDR_BANKNOTES: BanknoteConfig[] = [
  { 
    value: 100000, 
    label: 'Seratus Ribu', 
    englishLabel: 'One Hundred Thousand',
    shortLabel: '100k', 
    color: 'bg-red-500', 
    textColor: 'text-red-900',
    accentColor: 'bg-red-600',
    description: 'Featuring Dr. (H.C.) Ir. Soekarno and Dr. (H.C.) Drs. Mohammad Hatta. The largest denomination.',
    variants: [
      getVariant(100000, 2022),
      getVariant(100000, 2016)
    ]
  },
  { 
    value: 50000, 
    label: 'Lima Puluh Ribu', 
    englishLabel: 'Fifty Thousand',
    shortLabel: '50k', 
    color: 'bg-blue-500', 
    textColor: 'text-blue-900',
    accentColor: 'bg-blue-600',
    description: 'Featuring Ir. H. Djuanda Kartawidjaja. Commonly used for daily shopping.',
    variants: [
      getVariant(50000, 2022),
      getVariant(50000, 2016)
    ]
  },
  { 
    value: 20000, 
    label: 'Dua Puluh Ribu', 
    englishLabel: 'Twenty Thousand',
    shortLabel: '20k', 
    color: 'bg-green-500', 
    textColor: 'text-green-900',
    accentColor: 'bg-green-600',
    description: 'Featuring Dr. G.S.S.J. Ratulangi. Used for small meals and transport.',
    variants: [
      getVariant(20000, 2022),
      getVariant(20000, 2016)
    ]
  },
  { 
    value: 10000, 
    label: 'Sepuluh Ribu', 
    englishLabel: 'Ten Thousand',
    shortLabel: '10k', 
    color: 'bg-purple-500', 
    textColor: 'text-purple-900',
    accentColor: 'bg-purple-600',
    description: 'Featuring Frans Kaisiepo. Useful for convenience store snacks.',
    variants: [
      getVariant(10000, 2022),
      getVariant(10000, 2016)
    ]
  },
  { 
    value: 5000, 
    label: 'Lima Ribu', 
    englishLabel: 'Five Thousand',
    shortLabel: '5k', 
    color: 'bg-yellow-600', 
    textColor: 'text-yellow-900',
    accentColor: 'bg-yellow-700',
    description: 'Featuring Dr. K.H. Idham Chalid. Commonly used for tips.',
    variants: [
      getVariant(5000, 2022),
      getVariant(5000, 2016)
    ]
  },
  { 
    value: 2000, 
    label: 'Dua Ribu', 
    englishLabel: 'Two Thousand',
    shortLabel: '2k', 
    color: 'bg-gray-400', 
    textColor: 'text-gray-900',
    accentColor: 'bg-gray-500',
    description: 'Featuring Mohammad Hoesni Thamrin. Typical parking fee note.',
    variants: [
      getVariant(2000, 2022),
      getVariant(2000, 2016)
    ]
  },
  { 
    value: 1000, 
    label: 'Seribu', 
    englishLabel: 'One Thousand',
    shortLabel: '1k', 
    color: 'bg-yellow-200', 
    textColor: 'text-yellow-800',
    accentColor: 'bg-yellow-300',
    description: 'Featuring Tjut Meutia. Often coin, but paper exists.',
    variants: [
      getVariant(1000, 2022),
      getVariant(1000, 2016)
    ]
  },
];

export const TRANSLATIONS = {
  en: {
    tabIdr: "I Have IDR Cash",
    tabForeign: "I Have Foreign Currency",
    youHave: "You Have",
    approx: "Approximately",
    visualBreakdown: "Visual Breakdown",
    exactMix: "Exact Mix",
    bigNotes: "Big Notes",
    totalCash: "Total Rupiah Cash",
    typeManual: "Type total manually or use the buttons below",
    banknoteBreakdown: "Banknote Breakdown",
    worthApprox: "Worth Approximately",
    rateNote: "These conversions are estimates based on market mid-rates. Money changers may offer slightly different rates.",
    lastUpdated: "Rates updated:",
    quickAdd: "Quick Add",
    clear: "Clear",
    rate: "Rate",
    verified: "Verified",
    amountTooSmall: "Amount too small for selected notes.",
    enterAmount: "Enter an amount to see the cash breakdown.",
    blog: "Blog",
    guide: "Guide",
    atmPresets: "ATM / Quick Presets",
    totalValue: "Total Value",
    close: "Close",
    flip: "Tap to Flip",
    edition: "Edition"
  },
  id: {
    tabIdr: "Tunai Rupiah",
    tabForeign: "Mata Uang Asing",
    youHave: "Anda Memiliki",
    approx: "Sekitar",
    visualBreakdown: "Visualisasi Pecahan",
    exactMix: "Campuran Pas",
    bigNotes: "Pecahan Besar",
    totalCash: "Total Tunai Rupiah",
    typeManual: "Ketik manual atau gunakan tombol cepat di bawah",
    banknoteBreakdown: "Rincian Pecahan",
    worthApprox: "Senilai Kira-kira",
    rateNote: "Konversi ini adalah estimasi berdasarkan harga tengah pasar. Money changer mungkin menawarkan kurs yang sedikit berbeda.",
    lastUpdated: "Kurs diperbarui:",
    quickAdd: "Tambah Cepat",
    clear: "Hapus",
    rate: "Kurs",
    verified: "Terverifikasi",
    amountTooSmall: "Jumlah terlalu kecil untuk pecahan yang dipilih.",
    enterAmount: "Masukkan jumlah untuk melihat rincian uang tunai.",
    blog: "Blog",
    guide: "Panduan",
    atmPresets: "ATM / Nominal Cepat",
    totalValue: "Total Nilai",
    close: "Tutup",
    flip: "Ketuk untuk Balik",
    edition: "Edisi"
  }
};

import type { IconProps } from '@phosphor-icons/react';

// Extend IconProps to explicitly include className if it's missing or for better compatibility
interface CustomIconProps extends IconProps {
  className?: string;
  onClick?: () => void;
}

export const Icons = {
  Refresh: (props: CustomIconProps) => <ArrowsClockwise weight="duotone" {...props} />,
  Wallet: (props: CustomIconProps) => <Wallet weight="duotone" {...props} />,
  Search: (props: CustomIconProps) => <MagnifyingGlass weight="duotone" {...props} />,
  Info: (props: CustomIconProps) => <Info weight="duotone" {...props} />,
  Speaker: (props: CustomIconProps) => <SpeakerHigh weight="duotone" {...props} />,
  Star: ({ filled, ...props }: { filled: boolean } & CustomIconProps) => (
    <Star weight={filled ? "fill" : "duotone"} {...props} />
  ),
  X: (props: CustomIconProps) => <X weight="bold" {...props} />,
  Plus: (props: CustomIconProps) => <Plus weight="bold" {...props} />,
  Minus: (props: CustomIconProps) => <Minus weight="bold" {...props} />,
  Trash: (props: CustomIconProps) => <Trash weight="duotone" {...props} />,
  Globe: (props: CustomIconProps) => <Globe weight="duotone" {...props} />,
  Flag: (props: CustomIconProps) => <Flag weight="duotone" {...props} />,
  Book: (props: CustomIconProps) => <BookOpen weight="duotone" {...props} />,
  Article: (props: CustomIconProps) => <Article weight="duotone" {...props} />,
  Translate: (props: CustomIconProps) => <Translate weight="duotone" {...props} />,
  Coins: (props: CustomIconProps) => <Coins weight="duotone" {...props} />,
  Receipt: (props: CustomIconProps) => <Receipt weight="duotone" {...props} />,
  Money: (props: CustomIconProps) => <Money weight="duotone" {...props} />,
  MoneyWavy: (props: CustomIconProps) => <MoneyWavy weight="duotone" {...props} />,
  Back: (props: CustomIconProps) => <CaretLeft weight="bold" {...props} />,
  Question: (props: CustomIconProps) => <Question weight="duotone" {...props} />,
  Rotate: (props: CustomIconProps) => <ArrowsClockwise weight="duotone" {...props} />
};
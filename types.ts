export interface Currency {
  code: string;
  name: string;
  flag: string;
  symbol: string;
}

export interface BanknoteVariant {
  year: number;
  emissionName?: string; // e.g., "Emisi 2022"
  images: {
    front: string; // path to front image
    back: string;  // path to back image
  };
}

export interface BanknoteConfig {
  value: number;
  label: string;
  englishLabel: string;
  shortLabel: string;
  color: string;
  textColor: string;
  accentColor: string;
  description: string;
  variants?: BanknoteVariant[]; // New field for multiple versions
}

export interface ConversionData {
  rate: number;
  lastUpdated: string;
  sources: string[];
}

export interface RateMap {
  [key: string]: number;
}

export interface GroundingSource {
  web?: {
    uri: string;
    title: string;
  };
}
// Extend Window interface for our custom property
declare global {
  interface Window {
    _geminiWarned?: boolean;
  }
}

import { GoogleGenAI, Type } from "@google/genai";
import { ConversionData, RateMap, GroundingSource } from "../types";
import { ALL_AVAILABLE_CURRENCIES } from "../constants";

let ai: GoogleGenAI | null = null;

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

interface CachedRate {
  rate: number;
  timestamp: number;
  sources: string[];
}

// Get cached rate from sessionStorage
const getCachedRate = (currencyCode: string): CachedRate | null => {
  try {
    const cached = sessionStorage.getItem(`rate_${currencyCode}`);
    if (cached) {
      const data: CachedRate = JSON.parse(cached);
      if (Date.now() - data.timestamp < CACHE_DURATION) {
        return data;
      }
      // Expired, remove it
      sessionStorage.removeItem(`rate_${currencyCode}`);
    }
  } catch (e) {
    console.warn("Cache read error:", e);
  }
  return null;
};

// Set cached rate to sessionStorage
const setCachedRate = (currencyCode: string, rate: number, sources: string[]) => {
  try {
    const data: CachedRate = {
      rate,
      timestamp: Date.now(),
      sources
    };
    sessionStorage.setItem(`rate_${currencyCode}`, JSON.stringify(data));
  } catch (e) {
    console.warn("Cache write error:", e);
  }
};

const initAI = () => {
  if (ai) return ai;
  
  const key = process.env.API_KEY || '';
  // Check if key is valid (not empty and not the string "undefined" from some build tools)
  if (!key || key === "undefined") {
    // Only warn once to avoid console spam
    if (typeof window !== 'undefined' && !window._geminiWarned) {
      console.warn("Gemini API Key is missing or undefined. Using fallback rates.");
      window._geminiWarned = true;
    }
    return null;
  }

  try {
    ai = new GoogleGenAI({ apiKey: key });
    return ai;
  } catch (err) {
    console.error("Error initializing GoogleGenAI:", err);
    return null;
  }
};

// Hardcoded fallback as a last resort
export const FALLBACK_RATES: Record<string, number> = {
  'USD': 15800,
  'EUR': 17100,
  'AUD': 10500,
  'SGD': 11800,
  'JPY': 105,
  'GBP': 20100,
  'MYR': 3400,
  'CNY': 2200,
  'KRW': 12,
  'THB': 450,
  'SAR': 4200,
  'HKD': 2000,
  'TWD': 500,
  'INR': 190,
  'PHP': 280,
  'VND': 0.65,
  'NZD': 9600,
  'CAD': 11600,
  'CHF': 18000,
  'AED': 4300,
  'BRL': 3100,
  'TRY': 500,
  'RUB': 170
};

// Modified to use Cloudflare Function Proxy in production
const fetchOpenAPIRate = async (currencyCode: string): Promise<number | null> => {
  try {
    // In production (Cloudflare Pages), use the internal API proxy
    // In dev (localhost), we can still use the direct URL or the proxy if `wrangler pages dev` is running
    const isProd = import.meta.env.PROD; 
    
    let url;
    if (isProd) {
      url = `/api/rates?currency=${currencyCode}&mode=single`;
    } else {
      // Direct fallback for local dev without wrangler
      const code = currencyCode.toLowerCase();
      url = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${code}.json`;
    }

    const response = await fetch(url);
    if (!response.ok) return null;
    
    const data = await response.json();
    
    if (isProd) {
       return data.rate || null;
    } else {
       const code = currencyCode.toLowerCase();
       return data[code]?.idr || null;
    }

  } catch (err) {
    console.warn(`Failed to fetch rate for ${currencyCode}:`, err);
    return null;
  }
};

// Fetch ALL popular rates
const fetchAllOpenAPIRates = async (): Promise<RateMap | null> => {
  try {
    const isProd = import.meta.env.PROD;
    
    let url;
    if (isProd) {
      url = `/api/rates?mode=popular`;
    } else {
      url = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/idr.json`;
    }

    const response = await fetch(url);
    if (!response.ok) return null;
    
    const data = await response.json();
    let rates;

    if (isProd) {
      rates = data.data;
    } else {
      rates = data.idr;
    }
    
    if (!rates) return null;

    const result: RateMap = {};
    const targets = ALL_AVAILABLE_CURRENCIES.map(c => c.code);
    
    targets.forEach(code => {
      const codeLower = code.toLowerCase();
      if (rates[codeLower]) {
        result[code] = Math.round(1 / rates[codeLower]); 
      }
    });

    return result;
  } catch (err) {
    console.warn("Failed to fetch popular rates:", err);
    return null;
  }
};

export const fetchLiveRate = async (currencyCode: string, forceRefresh = false): Promise<ConversionData> => {
  // 0. Check cache first (if not forcing refresh)
  if (!forceRefresh) {
    const cached = getCachedRate(currencyCode);
    if (cached) {
      return {
        rate: cached.rate,
        lastUpdated: new Date(cached.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' (cached)',
        sources: cached.sources
      };
    }
  }

  const genAI = initAI();
  
  // 1. Try Gemini API
  if (genAI) {
    try {
      const model = 'gemini-3-flash-preview'; // Updated to latest model per user request
      const prompt = `What is the current exchange rate for 1 ${currencyCode} to IDR (Indonesian Rupiah)? Provide the exact numeric exchange rate.`;

      const response = await genAI.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              rate: { type: Type.NUMBER, description: "The exchange rate for 1 unit of foreign currency to IDR" },
            },
            required: ["rate"],
          },
        },
      });

      const text = response.text;
      if (text) {
        const data = JSON.parse(text);
        
        // Extract sources
        const sources: string[] = [];
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (Array.isArray(groundingChunks)) {
          groundingChunks.forEach((chunk: GroundingSource) => {
            if (chunk.web?.uri) {
              sources.push(chunk.web.uri);
            }
          });
        }

        // Cache the result
        setCachedRate(currencyCode, data.rate, sources);

        return {
          rate: data.rate,
          lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sources: sources
        };
      }
    } catch (error) {
      console.warn("Gemini API failed, trying fallback...", error);
    }
  }

  // 2. Try Open API Fallback
  const openRate = await fetchOpenAPIRate(currencyCode);
  if (openRate) {
    setCachedRate(currencyCode, openRate, ['currency-api']);
    return {
      rate: openRate,
      lastUpdated: 'Open API',
      sources: ['currency-api']
    };
  }

  // 3. Last Resort: Hardcoded
  return {
    rate: FALLBACK_RATES[currencyCode] || 15000,
    lastUpdated: 'Offline Mode',
    sources: []
  };
};

export const fetchPopularRates = async (): Promise<RateMap> => {
  // 1. Try Open API First (Faster, Reliable, Deterministic)
  const openRates = await fetchAllOpenAPIRates();
  if (openRates) {
    return openRates;
  }

  // 2. Try Gemini API as fallback
  const genAI = initAI();
  if (genAI) {
    try {
      const model = 'gemini-2.0-flash';
      const prompt = `Return the current exchange rate for 1 unit of the following currencies to IDR: USD, EUR, AUD, SGD, MYR, GBP.`;

      const response = await genAI.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              USD: { type: Type.NUMBER },
              EUR: { type: Type.NUMBER },
              AUD: { type: Type.NUMBER },
              SGD: { type: Type.NUMBER },
              MYR: { type: Type.NUMBER },
              GBP: { type: Type.NUMBER },
            },
          },
        },
      });
      
      const text = response.text;
      if (text) return JSON.parse(text);
    } catch (e) {
      console.warn("Gemini API popular rates failed, trying fallback...", e);
    }
  }

  // 2. Try Open API Fallback
  // (Previously called, but let's just use FALLBACK if we reached here)
  
  // 3. Last Resort: Hardcoded
  return FALLBACK_RATES;
};

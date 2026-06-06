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
let apiKeyInvalid = false; // Track if the API key has been rejected

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
  if (apiKeyInvalid) return null; // Don't retry with a known-bad key
  
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

// Hardcoded fallback as a last resort (last updated: June 2026)
// These are approximate mid-rates and should be refreshed periodically
export const FALLBACK_RATES: Record<string, number> = {
  'USD': 18039,
  'EUR': 20952,
  'AUD': 12852,
  'SGD': 14036,
  'JPY': 113,
  'GBP': 24223,
  'MYR': 4469,
  'CNY': 2663,
  'KRW': 12,
  'THB': 552,
  'SAR': 4810,
  'HKD': 2303,
  'TWD': 572,
  'INR': 189,
  'PHP': 293,
  'VND': 0.69,
  'NZD': 10576,
  'CAD': 12974,
  'CHF': 22857,
  'AED': 4912,
  'BRL': 3562,
  'TRY': 392,
  'RUB': 246
};

// Modified to use Cloudflare Function Proxy in production
// CDN source: @fawazahmed0/currency-api (migrated to fawazahmed0/exchange-api)
// Fallback: Cloudflare Pages mirror per migration guide recommendation

const CURRENCY_API_BASE = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1';
const CURRENCY_API_FALLBACK = 'https://latest.currency-api.pages.dev/v1';

const fetchJSON = async (url: string): Promise<any | null> => {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
};

const fetchOpenAPIRate = async (currencyCode: string): Promise<number | null> => {
  try {
    // In production (Cloudflare Pages), use the internal API proxy
    // In dev (localhost), we can still use the direct URL or the proxy if `wrangler pages dev` is running
    const isProd = import.meta.env.PROD; 
    
    if (isProd) {
      const url = `/api/rates?currency=${currencyCode}&mode=single`;
      const data = await fetchJSON(url);
      return data?.rate || null;
    } else {
      const code = currencyCode.toLowerCase();
      // Try primary CDN, then Cloudflare fallback
      let data = await fetchJSON(`${CURRENCY_API_BASE}/currencies/${code}.json`);
      if (!data) {
        data = await fetchJSON(`${CURRENCY_API_FALLBACK}/currencies/${code}.json`);
      }
      if (!data) return null;
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
    
    if (isProd) {
      const url = `/api/rates?mode=popular`;
      const data = await fetchJSON(url);
      if (!data?.data) return null;
      const rates = data.data;
      return extractRates(rates);
    } else {
      // Try primary CDN, then Cloudflare fallback
      let data = await fetchJSON(`${CURRENCY_API_BASE}/currencies/idr.json`);
      if (!data) {
        data = await fetchJSON(`${CURRENCY_API_FALLBACK}/currencies/idr.json`);
      }
      if (!data?.idr) return null;
      return extractRates(data.idr);
    }
  } catch (err) {
    console.warn("Failed to fetch popular rates:", err);
    return null;
  }
};

// Extract rates from API response into RateMap
const extractRates = (rates: Record<string, number>): RateMap => {
  const result: RateMap = {};
  const targets = ALL_AVAILABLE_CURRENCIES.map(c => c.code);
  
  targets.forEach(code => {
    const codeLower = code.toLowerCase();
    if (rates[codeLower]) {
      result[code] = Math.round(1 / rates[codeLower]); 
    }
  });

  return result;
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
      const model = 'gemini-3-flash-preview'; // Latest model with Google Search grounding support
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
    } catch (error: any) {
      // Detect invalid API key and disable further retries
      const errorMsg = error?.message || String(error);
      if (errorMsg.includes('API_KEY_INVALID') || errorMsg.includes('API key not valid')) {
        apiKeyInvalid = true;
        ai = null; // Clear the instance so initAI won't return it
      }
      // Only warn once to reduce console noise
      if (typeof window !== 'undefined' && !window._geminiWarned) {
        console.warn("Gemini API failed, using fallback rates.");
        window._geminiWarned = true;
      }
    }
  }

  // 2. Try Open API Fallback
  const openRate = await fetchOpenAPIRate(currencyCode);
  if (openRate) {
    setCachedRate(currencyCode, openRate, ['https://github.com/fawazahmed0/exchange-api']);
    return {
      rate: openRate,
      lastUpdated: 'Open API',
      sources: ['https://github.com/fawazahmed0/exchange-api']
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
      const model = 'gemini-2.5-flash'; // Stable model for batch rate fetching (no grounding needed)
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
    } catch (e: any) {
      const errorMsg = e?.message || String(e);
      if (errorMsg.includes('API_KEY_INVALID') || errorMsg.includes('API key not valid')) {
        apiKeyInvalid = true;
        ai = null;
      }
      if (typeof window !== 'undefined' && !window._geminiWarned) {
        console.warn("Gemini API popular rates failed, using fallback rates.");
        window._geminiWarned = true;
      }
    }
  }

  // 2. Gemini API fallback (Open API already tried above)
  
  // 3. Last Resort: Hardcoded
  return FALLBACK_RATES;
};

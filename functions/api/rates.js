// functions/api/rates.js

/**
 * Cloudflare Pages Function to fetch currency rates securely.
 * This hides the API Key from the client browser.
 * CDN source: @fawazahmed0/currency-api (migrated to fawazahmed0/exchange-api)
 * Fallback: Cloudflare Pages mirror per migration guide recommendation
 */

const CDN_BASE = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1';
const CF_FALLBACK = 'https://latest.currency-api.pages.dev/v1';

const fetchJSON = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
};

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const currency = url.searchParams.get("currency") || "USD";
  const mode = url.searchParams.get("mode") || "single"; // 'single' or 'popular'

  // CORS Headers to allow requests from your domain
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*", // In production, change this to your specific domain
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 1. Try Gemini API first (if Key exists)
    if (env.GEMINI_API_KEY) {
      // Placeholder for future Gemini API integration on server-side
    }

    // 2. Primary Source: currency-api via jsdelivr CDN, with Cloudflare Pages fallback
    // The original repo has migrated to fawazahmed0/exchange-api
    
    if (mode === "popular") {
      // Try primary CDN, then fallback
      let data = await fetchJSON(`${CDN_BASE}/currencies/idr.json`);
      if (!data) {
        data = await fetchJSON(`${CF_FALLBACK}/currencies/idr.json`);
      }
      if (!data?.idr) throw new Error("Failed to fetch rates from both CDN and fallback");
      
      return new Response(JSON.stringify({ 
        success: true, 
        source: "cloudflare-proxy", 
        data: data.idr 
      }), { headers: corsHeaders });

    } else {
      // Single currency mode
      const code = currency.toLowerCase();
      let data = await fetchJSON(`${CDN_BASE}/currencies/${code}.json`);
      if (!data) {
        data = await fetchJSON(`${CF_FALLBACK}/currencies/${code}.json`);
      }
      if (!data?.[code]) throw new Error("Failed to fetch rate from both CDN and fallback");
      
      const rate = data[code]?.idr;

      return new Response(JSON.stringify({ 
        success: true, 
        source: "cloudflare-proxy", 
        rate: rate 
      }), { headers: corsHeaders });
    }

  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), { 
      status: 500, 
      headers: corsHeaders 
    });
  }
}

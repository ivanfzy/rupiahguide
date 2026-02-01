// functions/api/rates.js

/**
 * Cloudflare Pages Function to fetch currency rates securely.
 * This hides the API Key from the client browser.
 */
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
      // Note: We use the REST API endpoint manually here to avoid installing node modules in CF Workers if possible,
      // or we can stick to the Open API fallback which is robust and free.
      // For simplicity and speed in this demo, let's use the robust Open API as the primary backend source
      // but protected behind this proxy so clients don't know where it comes from.
    }

    // 2. Primary Source: Open Exchange Rates (Free via jsdelivr/fawazahmed0)
    // This is very reliable, free, and updated daily.
    
    if (mode === "popular") {
      // Fetch all rates relative to IDR
      // Strategy: Fetch IDR base. 1 IDR = 0.00006 USD. 
      // Invert to get: 1 USD = 1/0.00006 IDR.
      const response = await fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/idr.json`);
      
      if (!response.ok) throw new Error("Failed to fetch rates");
      
      const data = await response.json();
      const rates = data.idr;
      
      return new Response(JSON.stringify({ 
        success: true, 
        source: "cloudflare-proxy", 
        data: rates 
      }), { headers: corsHeaders });

    } else {
      // Single currency mode
      const code = currency.toLowerCase();
      const response = await fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${code}.json`);
      
      if (!response.ok) throw new Error("Failed to fetch rate");
      
      const data = await response.json();
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

# Setup Guide: Cloudflare Pages Environment Variables

To ensure your app works correctly on Cloudflare Pages and the API Proxy functions as intended, you need to configure the Environment Variables in the Cloudflare Dashboard.

## 1. Deploy Your Project
First, connect your GitHub repository to Cloudflare Pages and deploy the project.
- **Build Command**: `npm run build`
- **Build Output Directory**: `dist`

## 2. Add Environment Variables
Once the project is created (or during creation), go to:
**Settings** > **Environment variables**

Add the following variable:

| Variable Name | Value | Description |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | `AIzaSy...` | Your Google Gemini API Key. |

## 3. Redeploy
After adding the environment variable, you must **redeploy** your latest commit (or trigger a new build) for the changes to take effect.

## How it Works
- The file `functions/api/rates.js` will run on Cloudflare's edge network.
- It will access `GEMINI_API_KEY` securely from the server-side environment.
- Your frontend code (`geminiService.ts`) will request `/api/rates`, and Cloudflare will proxy this request, adding the API key or handling the logic secretly.
- The user's browser never sees your API Key.

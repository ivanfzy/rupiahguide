import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const apiKey = env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || env.GOOGLE_API_KEY || env.API_KEY;
    
    if (!apiKey) {
      console.warn("⚠️  WARNING: GEMINI_API_KEY not found in .env or environment variables.");
    } else {
      console.log("✅  GEMINI_API_KEY loaded successfully.");
    }

    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), tailwindcss()],
      define: {
        'process.env.API_KEY': JSON.stringify(apiKey),
        'process.env.GEMINI_API_KEY': JSON.stringify(apiKey),
        'global': 'window', // Polyfill global for browser
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
          buffer: 'buffer/', // Polyfill buffer
        }
      }
    };
});

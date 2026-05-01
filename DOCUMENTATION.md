# RupiahGuide - Application Blueprint & Documentation

## 1. Overview
**RupiahGuide** is an interactive web app designed to help travelers in Indonesia understand and handle the Rupiah (IDR). The app addresses the common confusion around the many zeros on Rupiah banknotes and provides real-time currency conversion using live exchange rates.

Built with **React 19**, **TypeScript**, **Vite 6**, **Tailwind CSS 4**, **Google Gemini API**, and the **Currency API CDN** (with Cloudflare Pages fallback).

---

## 2. Core Features

The app is divided into two main tabs serving different use cases:

### A. Tab "I Have IDR Cash" (Counter Mode)
*Identified by the Indonesia Flag icon (🇮🇩)*
This mode functions as a cash calculator and reverse converter.
*   **Cash Calculator:** Users can count their total physical cash by:
    *   Typing the total amount manually.
    *   Using **ATM / Quick Presets** buttons (50k, 100k, 300k, etc.) which are additive.
    *   Adding/removing specific banknote counts (e.g., 2x 100k, 3x 50k).
*   **Real-time Reverse Conversion:** Shows how much the Rupiah amount is worth in popular foreign currencies (USD, EUR, AUD, etc).
*   **Favorite Management:** Users can star their home currency, which moves it to the top of the conversion list.
*   **Add Currency:** Users can add currencies beyond the default list (USD, EUR, AUD, SGD, JPY, GBP, MYR) via an "Add Currency" button that opens a search modal.
*   **Purchasing Power Context:** Shows what the current Rupiah amount can buy (e.g., 3x Nasi Goreng, 1x Motorbike Rental).
*   **Locale Formatting:** Uses Indonesian number format (period as thousands separator, comma as decimal).

### B. Tab "I Have Foreign Currency" (Visualizer Mode)
*Identified by the Globe icon (🌏)*
This mode helps travelers visualize what they will get when exchanging money.
*   **Currency Selector:** Dropdown to choose the source currency. Supports favorites.
*   **Interactive Input:** Slider, manual input, and quick-add buttons (+1, +10, etc) for entering the foreign currency amount.
*   **Banknote Visualization:** Displays a stack of Rupiah banknotes visually based on the current exchange rate.
    *   *Exact Mix:* Optimal denomination combination.
    *   *Big Notes:* Prioritizes large denominations (50k & 100k).
*   **Audio Pronunciation:** Click on a banknote image to hear the amount pronounced in Bahasa Indonesia (Text-to-Speech).
*   **Live Rates:** Fetches current exchange rates using the rate engine.

### C. Common Features
*   **Language Support:** English (EN) and Bahasa Indonesia (ID) switcher.
*   **State Persistence:** Favorite currency is stored in app state during the session.
*   **Responsive:** Optimized display for desktop and mobile devices.

---

## 3. File Structure & Responsibilities

Technical breakdown of each file in the project:

### Root Level
*   **`index.html`**: HTML entry point. Loads Google Fonts (Google Sans, Azeret Mono), analytics scripts (Google Analytics, Statcounter), and the app shell.
*   **`index.tsx`**: React entry point. Renders the `App` component into the DOM.
*   **`App.tsx`**: Main router (React Router). Handles navigation between pages (Home, Blog, BlogPost). Includes `AnalyticsTracker`, `ScrollToTop`, and `useImagePreload`.
*   **`metadata.json`**: App configuration (name, description).
*   **`constants.tsx`**: Static data — currencies, banknote configs, translations (EN/ID), and icon components.
*   **`types.ts`**: TypeScript interfaces for type safety across the app.

### `pages/`
*   **`Home.tsx`**: Main app page (Controller).
    *   Manages global page state: active tab, language, favorite currency, conversion data.
    *   Initializes API calls (`fetchLiveRate`, `fetchPopularRates`).
    *   Layout: Navbar → Hero Section → Main Content → Footer.
*   **`Blog.tsx`**: Blog listing page. Loads all `.md` posts from `src/content/blog/`.
*   **`BlogPost.tsx`**: Individual blog post page. Parses frontmatter (title, excerpt, FAQ), renders markdown with heading anchor IDs and H1→H2 demotion, generates Article + FAQ schema.org data.

### `components/` (UI Components)
*   **`layout/Navbar.tsx`**: App header. Logo, blog link, and language switcher (hidden on blog pages).
*   **`layout/Footer.tsx`**: Page footer. Copyright and exchange rate disclaimer.
*   **`features/MoneyControls.tsx`** *(Visualizer)*: Input panel for foreign currency — number input, range slider, quick-add buttons.
*   **`features/Banknote.tsx`** *(Visualizer)*: Visual component rendering banknote images. Handles click-to-play audio pronunciation.
*   **`features/RupiahCounter.tsx`** *(Counter)*: Main container for the IDR calculator tab. Manages total logic, ATM presets, banknote controls, and currency conversion list.
*   **`features/BanknoteControl.tsx`** *(Counter)*: Individual control row for each denomination (mini image, label, -/+ buttons).
*   **`features/AddCurrencyModal.tsx`**: Modal for searching and adding currencies. Supports search and backdrop-click-to-close.
*   **`features/PriceReference.tsx`**: Displays purchasing power context — what the current Rupiah amount can buy.
*   **`banknotes/BanknoteModal.tsx`**: Full-screen banknote detail modal with front/back images and variant selector.
*   **`banknotes/BanknoteVisual.tsx`**: Banknote image component with flip animation.
*   **`seo/SEOHead.tsx`**: SEO component using `react-helmet-async`. Manages meta tags, canonical URLs, Open Graph, Twitter Cards, and JSON-LD schema markup.

### `services/` (Logic & API)
*   **`geminiService.ts`**: Rate fetching engine with 3-tier fallback:
    1.  **Gemini API** (for `fetchLiveRate`): Uses `gemini-3-flash-preview` with Google Search grounding for single-currency rates with source attribution.
    2.  **Currency API CDN** (primary for batch): Fetches from `cdn.jsdelivr.net/npm/@fawazahmed0/currency-api` with `latest.currency-api.pages.dev` fallback. Used for `fetchPopularRates` (all currencies at once).
    3.  **Hardcoded fallback**: Approximate mid-rates used only when all live sources fail.
    *   In production, routes through Cloudflare Function proxy (`/api/rates`) to avoid client-side CDN calls.
    *   `fetchLiveRate(currencyCode)`: Single currency rate with grounding sources.
    *   `fetchPopularRates()`: Batch rates for all supported currencies (Open API first, then Gemini as fallback, then hardcoded).
    *   Session-based caching (5-minute TTL via `sessionStorage`).
    *   API key validation: detects invalid keys and disables retries to prevent console spam.

### `functions/api/` (Cloudflare Pages Functions)
*   **`rates.js`**: Server-side API proxy for rate fetching. Same 3-tier fallback (Gemini → CDN → hardcoded) but runs server-side to keep API calls off the client.

### `src/` (Source Modules)
*   **`config/seo.ts`**: SEO configuration — site name, descriptions (3 tiers: short/standard/long), title templates, Schema.org generators (Organization, WebApplication, BreadcrumbList, Article, FAQPage).
*   **`content/blog/`**: 25+ markdown blog posts with YAML frontmatter (title, excerpt, date, readTime, optional FAQ array).
*   **`hooks/useAnalytics.ts`**: Programmatic analytics tracking (page views, custom events) for Google Analytics.
*   **`hooks/useImagePreload.ts`**: Preloads banknote images on app startup.
*   **`components/ScrollToTop.tsx`**: Scrolls to top on route change.
*   **`components/ui/HeroSection.tsx`**: Reusable hero section component with gradient background.
*   **`components/ui/CardOverlap.tsx`**: Card with negative margin overlap effect.
*   **`lib/utils.ts`**: Utility functions (`cn` for className merging).

---

## 4. Data Flow

1.  **Initialization:** `Home.tsx` loads → `useEffect` calls `geminiService` to fetch rates.
2.  **Visualizer:**
    *   User changes input in `MoneyControls`.
    *   `Home.tsx` calculates `currentIDR` (Input × Rate).
    *   `breakdown` function (useMemo) computes denomination combination.
    *   Data is sent to `Banknote` for rendering.
3.  **Counter:**
    *   User presses preset button in `RupiahCounter`.
    *   `total` state is updated.
    *   `reverseCalculate` breaks the total into estimated banknote counts.
    *   `counts` state is updated and sent to `BanknoteControl`.
    *   Conversion list is recalculated (Total / Rate).

---

## 5. Rate Engine & External Integrations

### Rate Fetching Strategy (3-tier fallback)

| Priority | Source | Used By | Model/Endpoint |
|---|---|---|---|
| 1st | **Gemini API** | `fetchLiveRate` | `gemini-3-flash-preview` with Google Search grounding |
| 2nd | **Currency API CDN** | `fetchPopularRates` (primary), `fetchLiveRate` (fallback) | jsdelivr CDN → Cloudflare Pages fallback |
| 3rd | **Hardcoded rates** | Both functions | Approximate mid-rates (updated May 2026) |

**`fetchLiveRate` flow:** Gemini (with grounding) → CDN → Hardcoded
**`fetchPopularRates` flow:** CDN (batch) → Gemini (`gemini-2.5-flash`, no grounding) → Hardcoded

### Production Architecture
- In production (`import.meta.env.PROD`), rate requests route through a Cloudflare Pages Function (`/api/rates`) to avoid direct client-side CDN calls.
- The Cloudflare Function (`functions/api/rates.js`) implements the same 3-tier fallback server-side.
- Gemini API key is stored as a Cloudflare environment variable (not in the client bundle).

### SEO & Content
- **Schema.org:** Each page generates structured data (Organization, WebApplication, BreadcrumbList). Blog posts also generate ArticleSchema and FAQSchema.
- **Blog:** 25+ markdown articles in `src/content/blog/` with YAML frontmatter. Parsed by `gray-matter`, rendered by `react-markdown`.
- **Analytics:** Google Analytics (`G-PYG33L1JFL`) + Statcounter (`13203153`). Programmatic tracking via `useAnalytics` hook.

---

## 6. UI/UX Design (Tailwind CSS)

*   **Styling:** Tailwind CSS v4 utility classes (via `@tailwindcss/vite` plugin).
*   **Color Palette:** **Stone** (backgrounds, text) and **Orange** (accent, interactions, primary actions).
*   **Typography:** Google Sans (UI text) and Azeret Mono (monospace/numbers).
*   **Aesthetics:** Rounded corners (`rounded-3xl`, `rounded-2xl`), soft shadows (`shadow-sm`, `shadow-lg`), and gradient overlays for depth.
*   **Dark Navbar:** `bg-stone-800` with `bg-orange-500` accent on active language tab.
*   **Navigation:** Flag (🇮🇩) and Globe (🌏) icons on main tabs for instant context recognition (Local Cash vs Foreign Currency).
*   **Animations:** Smooth transitions on hover, tab changes, and element loading.
*   **Responsive:** Mobile-first design with `max-w-4xl` content constraint.

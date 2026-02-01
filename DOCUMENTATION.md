# RupiahGuide - Application Blueprint & Documentation

## 1. Overview
**RupiahGuide** adalah aplikasi web interaktif yang dirancang untuk membantu wisatawan di Indonesia memahami mata uang Rupiah (IDR). Aplikasi ini memecahkan kebingungan umum mengenai banyaknya angka nol pada uang kertas Rupiah dan memberikan konversi nilai tukar secara real-time menggunakan AI.

Aplikasi ini dibangun menggunakan **React**, **TypeScript**, **Tailwind CSS** (via `@tailwindcss/postcss`), dan **Google Gemini API**.

---

## 2. Fitur Utama (Core Features)

Aplikasi dibagi menjadi dua tab utama yang melayani kasus penggunaan berbeda:

### A. Tab "I Have IDR Cash" (Counter Mode)
*Ditandai dengan ikon Bendera Indonesia (🇮🇩)*
Mode ini berfungsi sebagai kalkulator uang tunai dan konverter balik.
*   **Kalkulator Uang Tunai:** Pengguna dapat menghitung total uang fisik yang mereka miliki dengan:
    *   Mengetik total nominal secara manual.
    *   Menggunakan tombol **ATM / Quick Presets** (50k, 100k, 300k, dst) yang bersifat aditif.
    *   Menambah/mengurang jumlah lembar uang kertas spesifik (misal: 2 lembar 100k, 3 lembar 50k).
*   **Konversi Balik Real-time:** Menampilkan berapa nilai uang Rupiah tersebut dalam mata uang asing populer (USD, EUR, AUD, dll).
*   **Manajemen Favorit:** Pengguna dapat menandai mata uang asal mereka sebagai favorit (bintang), yang akan memindahkannya ke posisi teratas daftar konversi.
*   **Fitur Tambah Mata Uang:** Pengguna dapat menambahkan mata uang lain di luar daftar default (USD, EUR, AUD, SGD, JPY, GBP, MYR) melalui tombol "Add Currency" yang membuka modal pencarian.
*   **Format Lokal:** Menggunakan format angka Indonesia (titik sebagai pemisah ribuan, koma sebagai desimal).

### B. Tab "I Have Foreign Currency" (Visualizer Mode)
*Ditandai dengan ikon Bola Dunia (🌏)*
Mode ini membantu wisatawan memvisualisasikan apa yang akan mereka dapatkan saat menukar uang.
*   **Pemilih Mata Uang:** Dropdown untuk memilih mata uang asal. Mendukung fitur favorit.
*   **Input Interaktif:** Slider, input manual, dan tombol cepat (+1, +10, dll) untuk memasukkan jumlah mata uang asing.
*   **Visualisasi Uang Kertas:** Menampilkan tumpukan uang kertas Rupiah secara visual berdasarkan nilai tukar saat ini.
    *   *Exact Mix:* Campuran pecahan uang yang optimal.
    *   *Big Notes:* Mengutamakan pecahan besar (50k & 100k).
*   **Audio Pronunciation:** Klik pada gambar uang kertas untuk mendengar cara pengucapan nominal dalam Bahasa Indonesia (Text-to-Speech).
*   **Live Rates:** Mengambil nilai tukar terkini menggunakan Google Gemini API.

### C. Fitur Umum
*   **Dukungan Bahasa:** Switcher bahasa Inggris (EN) dan Bahasa Indonesia (ID).
*   **State Persistence:** Mata uang favorit disimpan dalam state aplikasi selama sesi berjalan.
*   **Responsif:** Tampilan optimal di desktop dan perangkat seluler.

---

## 3. Struktur File & Fungsi (File Structure & Responsibilities)

Berikut adalah penjelasan teknis untuk setiap file dalam proyek:

### Root Level
*   **`index.html`**: Titik masuk HTML. Memuat font Google (Plus Jakarta Sans).
*   **`index.tsx`**: Titik masuk React. Merender komponen `App` ke dalam DOM.
*   **`App.tsx`**: Menangani routing utama (React Router) untuk navigasi antar halaman (Home, Blog).
*   **`metadata.json`**: File konfigurasi untuk perizinan aplikasi.
*   **`tailwind.config.js`**: Konfigurasi Tailwind CSS, termasuk definisi *spacing* kustom untuk sistem tema.
*   **`postcss.config.js`**: Konfigurasi PostCSS untuk mengintegrasikan Tailwind.

### Folder `pages/`
*   **`Home.tsx`**: Halaman utama (Controller) aplikasi.
    *   Mengelola state global halaman: Tab aktif, Bahasa, Mata Uang Favorit, Data Konversi.
    *   Menangani inisialisasi API calls (`fetchLiveRate`, `fetchPopularRates`).
    *   Mengatur layout dasar (Navbar, Hero Section, Main Content, Footer).

### Folder `components/` (UI Components)
*   **`Navbar.tsx`**: Header aplikasi. Berisi logo, link navigasi, dan tombol pengganti bahasa.
*   **`Footer.tsx`**: Bagian kaki halaman. Berisi hak cipta dan disclaimer tentang nilai tukar.
*   **`MoneyControls.tsx`** *(Digunakan di Visualizer)*: Panel input untuk mata uang asing. Berisi input angka, slider range, dan tombol "Quick Add".
*   **`Banknote.tsx`** *(Digunakan di Visualizer)*: Komponen visual yang merender gambar (CSS art atau image) tumpukan uang kertas. Menangani event klik untuk memutar audio pengucapan.
*   **`RupiahCounter.tsx`** *(Digunakan di Counter)*: Wadah utama untuk tab kalkulator IDR.
    *   Mengelola logika penjumlahan total Rupiah.
    *   Menangani logika preset ATM (penambahan nilai).
    *   Merender daftar `BanknoteControl`.
    *   Merender daftar konversi ke mata uang asing.
    *   Mengintegrasikan tombol "Add Currency" dan modal pencarian.
*   **`BanknoteControl.tsx`** *(Digunakan di Counter)*: Baris kontrol individual untuk setiap pecahan uang (gambar mini, label, tombol -/+).
*   **`AddCurrencyModal.tsx`**: Modal popup untuk mencari dan memilih mata uang baru untuk ditambahkan ke daftar konversi. Mendukung pencarian dan penutupan dengan klik di luar area (backdrop).
*   **`PriceReference.tsx`**: Komponen untuk menampilkan konteks daya beli.

### Folder `services/` (Logic & API)
*   **`geminiService.ts`**: Layer komunikasi dengan Google GenAI dan Open Exchange API.
    *   `fetchLiveRate(currencyCode)`: Meminta Gemini mencari rate spesifik (single currency) ke IDR. Menggunakan grounding Google Search.
    *   `fetchPopularRates()`: Mengambil daftar rate untuk semua mata uang yang tersedia (`ALL_AVAILABLE_CURRENCIES`) menggunakan Open API (dengan fallback ke Gemini dan hardcoded data).
    *   Menyediakan data *fallback* (hardcoded) jika API key tidak ada atau request gagal.

### Config & Data
*   **`constants.tsx`**: Menyimpan data statis untuk menghindari *magic numbers* di kode.
    *   `DEFAULT_CURRENCIES`: Daftar 7 mata uang utama (USD, EUR, AUD, SGD, JPY, GBP, MYR) yang ditampilkan secara default.
    *   `ALL_AVAILABLE_CURRENCIES`: Daftar lengkap semua mata uang yang didukung aplikasi.
    *   `IDR_BANKNOTES`: Konfigurasi visual dan nilai setiap pecahan Rupiah.
    *   `TRANSLATIONS`: Kamus bahasa (EN/ID).
    *   `Icons`: Komponen ikon SVG.
*   **`types.ts`**: Definisi tipe TypeScript (Interfaces) untuk menjamin keamanan tipe data di seluruh aplikasi.

---

## 4. Alur Data (Data Flow)

1.  **Inisialisasi:** `Home.tsx` dimuat -> `useEffect` memanggil `geminiService` untuk mendapatkan rate.
2.  **Visualizer:**
    *   User mengubah input di `MoneyControls`.
    *   `Home.tsx` menghitung `currentIDR` (Input * Rate).
    *   Fungsi `breakdown` (useMemo) menghitung kombinasi pecahan uang.
    *   Data dikirim ke `Banknote` untuk dirender.
3.  **Counter:**
    *   User menekan tombol preset di `RupiahCounter`.
    *   State `total` diperbarui.
    *   Fungsi `reverseCalculate` memecah total menjadi estimasi jumlah lembar uang.
    *   State `counts` diperbarui dan dikirim ke `BanknoteControl`.
    *   Daftar konversi di bawah dihitung ulang (Total / Rate).

---

## 5. Integrasi Eksternal (Google Gemini API)

Aplikasi menggunakan model `gemini-3-flash-preview` untuk dua fungsi:
1.  **Live Rate:** Menggunakan tool `googleSearch` untuk mencari nilai tukar terkini yang akurat dari internet.
2.  **Popular Rates:** Meminta model menghasilkan JSON object berisi rate untuk mata uang utama (USD, EUR, AUD, dll) untuk tampilan perbandingan cepat (sebagai fallback jika Open API gagal).

---

## 6. Desain UI/UX (Tailwind CSS)

*   **Styling:** Menggunakan utility classes Tailwind CSS v4 (via `@tailwindcss/postcss`).
*   **Konfigurasi:** Menggunakan `tailwind.config.js` untuk mendefinisikan *spacing* semantik (seperti `hero-pt`, `card-offset`) agar konsisten dan mudah diubah.
*   **Theme:** Palet warna utama adalah Slate (latar belakang/teks) dan Indigo (aksen/interaksi).
*   **Estetika:** Menggunakan sudut membulat (`rounded-3xl`), bayangan halus (`shadow-xl`), dan efek transparansi (`backdrop-blur`) untuk tampilan modern.
*   **Navigasi Intuitif:** Penggunaan ikon bendera (🇮🇩) dan bola dunia (🌏) pada tab utama untuk mempercepat pengenalan konteks (Uang Lokal vs Uang Asing).
*   **Animasi:** Transisi halus pada hover, perubahan tab, dan pemuatan elemen.

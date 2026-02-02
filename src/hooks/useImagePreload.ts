import { useEffect } from 'react';

// Daftar gambar banknotes yang perlu di-preload (2022 series - front)
const BANKNOTE_IMAGES = [
  '/banknotes/1000-2022-front.jpg',
  '/banknotes/2000-2022-front.jpg',
  '/banknotes/5000-2022-front.jpg',
  '/banknotes/10000-2022-front.jpg',
  '/banknotes/20000-2022-front.jpg',
  '/banknotes/50000-2022-front.jpg',
  '/banknotes/100000-2022-front.jpg',
];

/**
 * Hook untuk preload gambar banknotes
 * Gambar akan di-load di background saat aplikasi dimulai
 */
export const useImagePreload = () => {
  useEffect(() => {
    // Preload gambar menggunakan Image object
    // Ini akan membuat browser cache gambar
    BANKNOTE_IMAGES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);
};

export default useImagePreload;

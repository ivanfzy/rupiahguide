import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Komponen yang meng-scroll halaman ke atas setiap kali
 * lokasi/route berubah. Ini mencegah masalah scroll position
 * yang bertahan saat navigasi di SPA.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll ke atas dengan behavior smooth
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  return null;
}

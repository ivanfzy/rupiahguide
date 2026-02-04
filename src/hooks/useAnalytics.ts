import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Type definitions for analytics
interface AnalyticsEvent {
  action: string;
  category?: string;
  label?: string;
  value?: number;
}

// Track page view for Google Analytics 4
const trackGAPageView = (path: string, title?: string) => {
  if (typeof window === 'undefined') return;
  
  const gtag = (window as any).gtag;
  if (gtag) {
    gtag('event', 'page_view', {
      page_path: path,
      page_title: title || document.title,
      page_location: window.location.href,
    });
  }
};

// Track page view for Statcounter
const trackStatcounterPageView = () => {
  if (typeof window === 'undefined') return;
  
  // Statcounter automatically tracks page views on load
  // For SPA route changes, we need to trigger a virtual page view
  const sc_project = (window as any).sc_project;
  if (sc_project && typeof (window as any).__sc_button_click !== 'undefined') {
    // Trigger Statcounter to record the page view
    try {
      (window as any).sc_click_stat && (window as any).sc_click_stat();
    } catch (e) {
      // Silent fail if Statcounter not loaded
    }
  }
};

// Track custom event for Google Analytics 4
export const trackEvent = ({ action, category, label, value }: AnalyticsEvent) => {
  if (typeof window === 'undefined') return;
  
  const gtag = (window as any).gtag;
  if (gtag) {
    gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Hook to track route changes in SPA
export const useAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page view when route changes
    const path = location.pathname + location.search;
    
    // Small delay to ensure document.title is updated
    const timer = setTimeout(() => {
      trackGAPageView(path, document.title);
      trackStatcounterPageView();
    }, 100);

    return () => clearTimeout(timer);
  }, [location]);
};

// Hook to track specific user interactions
export const useTrackEvent = () => {
  return trackEvent;
};

export default useAnalytics;

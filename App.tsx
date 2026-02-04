import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import { useImagePreload } from './src/hooks/useImagePreload';
import { ScrollToTop } from './src/components/ScrollToTop';
import useAnalytics from './src/hooks/useAnalytics';

// Analytics tracker component
function AnalyticsTracker() {
  useAnalytics();
  return null;
}

function App() {
  // Preload gambar banknotes saat aplikasi dimulai
  useImagePreload();

  return (
    <Router>
      <AnalyticsTracker />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
      </Routes>
    </Router>
  );
}

export default App;

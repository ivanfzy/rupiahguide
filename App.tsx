import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import { useImagePreload } from './src/hooks/useImagePreload';
import { ScrollToTop } from './src/components/ScrollToTop';

function App() {
  // Preload gambar banknotes saat aplikasi dimulai
  useImagePreload();

  return (
    <Router>
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

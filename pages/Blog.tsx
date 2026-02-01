import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import matter from 'gray-matter';

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    // Dynamically import all markdown files
    const modules = import.meta.glob('../src/content/blog/*.md', { query: '?raw', import: 'default' });
    
    const loadPosts = async () => {
      const loadedPosts: BlogPost[] = [];
      
      for (const path in modules) {
        const rawContent = await modules[path]() as string;
        const { data } = matter(rawContent);
        
        // Extract slug from filename
        const slug = path.split('/').pop()?.replace('.md', '') || '';
        
        loadedPosts.push({
          slug,
          title: data.title,
          excerpt: data.excerpt,
          date: new Date(data.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          readTime: data.readTime
        });
      }
      
      // Sort by date descending
      loadedPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setPosts(loadedPosts);
    };

    loadPosts();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <Navbar language="en" setLanguage={() => {}} /> {/* Simplification for Blog layout */}

      <div className="bg-slate-900 text-white pb-18 pt-10 px-6 shadow-2xl relative overflow-hidden shrink-0 mb-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">RupiahGuide Blog</h1>
          <p className="text-slate-400 text-lg">Tips, tricks, and guides for handling money in Indonesia.</p>
        </div>
      </div>

      <main className="px-6 flex-grow max-w-4xl mx-auto w-full space-y-8 pb-12">
        {posts.map(post => (
          <Link to={`/blog/${post.slug}`} key={post.slug} className="block group">
            <article className="bg-white rounded-3xl p-6 shadow-sm hover:border-indigo-100">
              <h2 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                {post.title}
              </h2>
              <p className="text-slate-500 leading-relaxed">
                {post.excerpt}
              </p>
            </article>
          </Link>
        ))}
      </main>

      <Footer />
    </div>
  );
};

export default Blog;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import matter from 'gray-matter';
import { Money, ShieldWarning, TrendUp, Wallet, Bank, Coins, ArrowRight, BookOpen } from '@phosphor-icons/react';

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  // We keep date for sorting purposes, even if not displayed
  date: string; 
}

const getPostIcon = (title: string) => {
  const lower = title.toLowerCase();
  const iconClass = "w-8 h-8 text-indigo-500";
  
  if (lower.includes('scam') || lower.includes('fake') || lower.includes('avoid')) 
    return <ShieldWarning weight="duotone" className={iconClass} />;
  if (lower.includes('budget') || lower.includes('cost') || lower.includes('save')) 
    return <Wallet weight="duotone" className={iconClass} />;
  if (lower.includes('value') || lower.includes('worth') || lower.includes('big')) 
    return <TrendUp weight="duotone" className={iconClass} />;
  if (lower.includes('coin') || lower.includes('change') || lower.includes('notes')) 
    return <Coins weight="duotone" className={iconClass} />;
  if (lower.includes('understanding') || lower.includes('guide')) 
    return <BookOpen weight="duotone" className={iconClass} />;
  return <Bank weight="duotone" className={iconClass} />;
}

const getCategory = (title: string) => {
    const lower = title.toLowerCase();
    if (lower.includes('scam') || lower.includes('fake')) return 'Safety';
    if (lower.includes('budget') || lower.includes('cost')) return 'Budgeting';
    if (lower.includes('coin') || lower.includes('notes')) return 'Cash Tips';
    return 'Essential Guide';
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
          date: data.date
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
      <Navbar language="en" setLanguage={() => {}} />

      <div className="bg-slate-900 text-white pb-18 pt-10 px-6 shadow-2xl relative overflow-hidden shrink-0 mb-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">RupiahGuide Blog</h1>
          <p className="text-slate-400 text-lg">Tips, tricks, and guides for handling money in Indonesia.</p>
        </div>
      </div>

      <main className="px-6 flex-grow max-w-4xl mx-auto w-full space-y-6 pb-12">
        {posts.map(post => (
          <Link to={`/blog/${post.slug}`} key={post.slug} className="block group">
            <article className="bg-white rounded-2xl p-6 md:p-8 shadow-sm transition-all duration-300 relative overflow-hidden">
              {/* Decorative background blob */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -mr-10 -mt-10 transition-colors group-hover:bg-indigo-50/50"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-5">
                    <div className="p-3 rounded-xl">
                        {getPostIcon(post.title)}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-3 py-1 rounded-full group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                        {getCategory(post.title)}
                    </span>
                </div>

                <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors pr-4">
                  {post.title}
                </h2>
                <p className="text-slate-500 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            </article>
          </Link>
        ))}
      </main>

      <Footer />
    </div>
  );
};

export default Blog;

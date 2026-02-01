import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import matter from 'gray-matter';
import { 
  BookOpen, 
  Wallet, 
  Bank, 
  ShieldCheck, 
  Coins, 
  DeviceMobile, 
  CaretRight 
} from '@phosphor-icons/react';

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  order: number;
}

interface CategoryInfo {
  label: string;
  icon: React.ReactNode;
  description: string;
}

const CATEGORY_MAP: Record<string, CategoryInfo> = {
  'foundation': {
    label: 'Foundation',
    icon: <BookOpen weight="duotone" className="w-6 h-6" />,
    description: 'Understanding Rupiah basics'
  },
  'budget-planning': {
    label: 'Budget & Planning',
    icon: <Wallet weight="duotone" className="w-6 h-6" />,
    description: 'Plan your spending wisely'
  },
  'atm-cash': {
    label: 'ATM & Cash Management',
    icon: <Bank weight="duotone" className="w-6 h-6" />,
    description: 'Withdraw and store cash safely'
  },
  'exchange-safety': {
    label: 'Exchange & Safety',
    icon: <ShieldCheck weight="duotone" className="w-6 h-6" />,
    description: 'Avoid scams and stay secure'
  },
  'daily-transactions': {
    label: 'Daily Transactions',
    icon: <Coins weight="duotone" className="w-6 h-6" />,
    description: 'Master everyday payments'
  },
  'digital-emergency': {
    label: 'Digital & Emergency',
    icon: <DeviceMobile weight="duotone" className="w-6 h-6" />,
    description: 'e-Wallets and backup plans'
  }
};

const CATEGORY_ORDER = [
  'foundation',
  'budget-planning',
  'atm-cash',
  'exchange-safety',
  'daily-transactions',
  'digital-emergency'
];

const Blog = () => {
  const [groupedPosts, setGroupedPosts] = useState<Record<string, BlogPost[]>>({});

  useEffect(() => {
    const modules = import.meta.glob('../src/content/blog/*.md', { query: '?raw', import: 'default' });
    
    const loadPosts = async () => {
      const loadedPosts: BlogPost[] = [];
      
      for (const path in modules) {
        const rawContent = await modules[path]() as string;
        const { data } = matter(rawContent);
        
        const slug = path.split('/').pop()?.replace('.md', '') || '';
        
        loadedPosts.push({
          slug,
          title: data.title,
          excerpt: data.excerpt,
          category: data.category || 'uncategorized',
          order: data.order || 99
        });
      }
      
      // Group by category and sort by order
      const grouped: Record<string, BlogPost[]> = {};
      
      loadedPosts.forEach(post => {
        if (!grouped[post.category]) {
          grouped[post.category] = [];
        }
        grouped[post.category].push(post);
      });
      
      // Sort each category by order
      Object.keys(grouped).forEach(category => {
        grouped[category].sort((a, b) => a.order - b.order);
      });
      
      setGroupedPosts(grouped);
    };

    loadPosts();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <Navbar language="en" setLanguage={() => {}} />

      <div className="bg-slate-900 text-white pb-16 pt-10 px-6 shadow-2xl relative overflow-hidden shrink-0 mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">RupiahGuide Blog</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Essential guides to help you navigate money matters in Indonesia. 
            Start from the basics and work your way through.
          </p>
        </div>
      </div>

      <main className="px-6 flex-grow max-w-4xl mx-auto w-full pb-12 space-y-12">
        {CATEGORY_ORDER.map(categoryKey => {
          const posts = groupedPosts[categoryKey];
          const categoryInfo = CATEGORY_MAP[categoryKey];
          
          if (!posts || posts.length === 0) return null;
          
          return (
            <section key={categoryKey} className="space-y-4">
              {/* Category Header */}
              <div className="flex items-center gap-3 pb-2 border-b border-slate-200">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                  {categoryInfo.icon}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">
                    {categoryInfo.label}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {categoryInfo.description}
                  </p>
                </div>
              </div>
              
              {/* Posts in Category */}
              <div className="space-y-3">
                {posts.map((post, index) => (
                  <Link 
                    to={`/blog/${post.slug}`} 
                    key={post.slug} 
                    className="block group"
                  >
                    <article className="bg-white rounded-xl p-5 shadow-sm transition-all duration-300 relative overflow-hidden hover:shadow-md hover:bg-indigo-50/30">
                      <div className="flex items-start gap-4">
                        {/* Order Number */}
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-sm font-bold group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                          {index + 1}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-grow min-w-0">
                          <h3 className="text-base font-bold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors flex items-center gap-2">
                            <span className="truncate">{post.title}</span>
                            <CaretRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all flex-shrink-0" />
                          </h3>
                          <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                            {post.excerpt}
                          </p>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </main>

      <Footer />
    </div>
  );
};

export default Blog;

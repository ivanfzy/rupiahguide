import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import matter from 'gray-matter';
import SEOHead from '../components/seo/SEOHead';
import { SCHEMA_ORG } from '@/config/seo';

interface BlogMeta {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
}

const BlogPost = () => {
  const { slug } = useParams();
  const [content, setContent] = useState<string | null>(null);
  const [meta, setMeta] = useState<BlogMeta | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      if (!slug) return;
      
      try {
        // Dynamic import based on slug
        // Note: Vite requires glob to be static string literal, so we import all and pick one
        const modules = import.meta.glob('../src/content/blog/*.md', { query: '?raw', import: 'default' });
        const path = `../src/content/blog/${slug}.md`;
        
        if (modules[path]) {
          const rawContent = await modules[path]() as string;
          const { content, data } = matter(rawContent);
          setContent(content);
          setMeta(data);
        } else {
          setContent(null);
        }
      } catch (err) {
        console.error("Failed to load post:", err);
        setContent(null);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
  }

  if (!content || !meta) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="mb-8">Post not found.</p>
          <Link to="/blog" className="text-indigo-600 hover:underline">Back to Blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <SEOHead 
        title={meta.title} 
        description={meta.excerpt}
        ogType="article"
      />
      <Navbar language="en" setLanguage={() => {}} />

      <div className="bg-slate-900 text-white py-16 px-6 relative overflow-hidden shrink-0">
         <div className="max-w-4xl mx-auto relative z-10">
           <Link to="/blog" className="text-slate-400 hover:text-white text-sm mb-4 inline-block">← Back to Blog</Link>
           <h1 className="text-3xl md:text-4xl font-bold mb-4">{meta.title}</h1>
         </div>
      </div>

      <main className="px-6 flex-grow -mt-12 relative z-20 pb-12">
        <article className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100 prose prose-lg prose-indigo prose-slate">
          <ReactMarkdown
            components={{
              h1: ({...props}) => <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mt-4 mb-4 leading-tight" {...props} />,
              h2: ({...props}) => <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mt-8 mb-4 leading-tight border-b border-slate-100 pb-2" {...props} />,
              h3: ({...props}) => <h3 className="text-xl md:text-2xl font-bold text-slate-800 mt-6 mb-3 leading-tight" {...props} />,
              p: ({...props}) => <p className="text-slate-600 leading-relaxed mb-6 text-lg" {...props} />,
              ul: ({...props}) => <ul className="list-disc list-outside ml-6 mb-6 text-slate-600 space-y-2 text-lg" {...props} />,
              ol: ({...props}) => <ol className="list-decimal list-outside ml-6 mb-6 text-slate-600 space-y-2 text-lg" {...props} />,
              li: ({...props}) => <li className="pl-1" {...props} />,
              a: ({...props}) => <a className="text-indigo-600 hover:text-indigo-500 font-medium underline decoration-indigo-200 hover:decoration-indigo-500 transition-all" {...props} />,
              blockquote: ({...props}) => <blockquote className="border-l-4 border-indigo-500 pl-4 italic text-slate-700 bg-slate-50 py-2 pr-4 rounded-r-lg mb-6" {...props} />,
              code: ({...props}) => <code className="bg-slate-100 text-pink-600 px-1.5 py-0.5 rounded text-sm font-mono font-medium" {...props} />,
            }}
          >
            {content}
          </ReactMarkdown>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import matter from 'gray-matter';
import SEOHead from '../components/seo/SEOHead';
import { createArticleSchema, createBreadcrumbSchema } from '@/config/seo';

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
    return <div className="min-h-screen flex items-center justify-center bg-stone-100"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div></div>;
  }

  if (!content || !meta) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100 text-stone-600">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="mb-8">Post not found.</p>
          <Link to="/blog" className="text-orange-500 hover:text-orange-600 hover:underline">Back to Blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 text-stone-800 font-sans flex flex-col">
      <SEOHead 
        title={meta.title}
        description={meta.excerpt}
        canonicalPath={`/blog/${slug}`}
        imageUrl={`https://rupiahguide.com/blog-images/${slug}.jpg`}
        schema={{
          "@context": "https://schema.org",
          "@graph": [
            createArticleSchema({
              title: meta.title,
              description: meta.excerpt,
              url: `https://rupiahguide.com/blog/${slug}`,
              datePublished: meta.date,
            }),
            createBreadcrumbSchema([
              { name: "Home", url: "https://rupiahguide.com/" },
              { name: "Blog", url: "https://rupiahguide.com/blog" },
              { name: meta.title, url: `https://rupiahguide.com/blog/${slug}` },
            ])
          ]
        }}
      />
      <Navbar language="en" setLanguage={() => {}} hideLanguageSwitch={true} />

      <div className="bg-gradient-to-br from-stone-200 via-stone-300/50 to-stone-200 text-stone-800 py-16 px-6 relative overflow-hidden shrink-0 border-b border-stone-300/50">
         <div className="max-w-4xl mx-auto relative z-10">
           <Link to="/blog" className="text-stone-500 hover:text-orange-500 text-sm mb-4 inline-block transition-colors">← Back to Blog</Link>
           <h1 className="text-3xl md:text-4xl font-bold mb-4">{meta.title}</h1>
         </div>
      </div>

      <main className="px-6 flex-grow -mt-12 relative z-20 pb-12">
        <article className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-stone-200/50">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({...props}) => <h1 className="text-3xl md:text-4xl font-bold text-stone-800 mt-4 mb-4 leading-tight" {...props} />,
              h2: ({...props}) => <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mt-8 mb-4 leading-tight border-b border-stone-200/50 pb-2" {...props} />,
              h3: ({...props}) => <h3 className="text-xl md:text-2xl font-bold text-stone-800 mt-6 mb-3 leading-tight" {...props} />,
              p: ({...props}) => <p className="text-stone-600 leading-relaxed mb-6 text-lg" {...props} />,
              ul: ({...props}) => <ul className="list-disc list-outside ml-6 mb-6 text-stone-600 space-y-2 text-lg" {...props} />,
              ol: ({...props}) => <ol className="list-decimal list-outside ml-6 mb-6 text-stone-600 space-y-2 text-lg" {...props} />,
              li: ({...props}) => <li className="pl-1" {...props} />,
              a: ({...props}) => <a className="text-orange-500 hover:text-orange-600 font-medium underline decoration-orange-500/30 hover:decoration-orange-500 transition-all" {...props} />,
              blockquote: ({...props}) => <blockquote className="border-l-4 border-orange-500 pl-4 italic text-stone-700 bg-amber-100/30 py-2 pr-4 rounded-r-lg mb-6" {...props} />,
              code: ({...props}) => <code className="text-inherit font-mono" {...props} />,
              pre: ({children, ...props}) => (
                <div className="my-6 rounded-xl border border-stone-200 overflow-x-auto">
                  <pre className="bg-stone-50 p-4 text-sm text-stone-700 min-w-fit" {...props}>
                    {children}
                  </pre>
                </div>
              ),
              table: ({...props}) => <div className="overflow-x-auto my-8 rounded-lg border border-stone-200/50 shadow-sm"><table className="min-w-full divide-y divide-stone-200/50 !m-0" {...props} /></div>,
              thead: ({...props}) => <thead className="bg-amber-100/30" {...props} />,
              tbody: ({...props}) => <tbody className="bg-white divide-y divide-stone-200/50" {...props} />,
              tr: ({...props}) => <tr className="hover:bg-amber-100/20 transition-colors" {...props} />,
              th: ({...props}) => <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider" {...props} />,
              td: ({...props}) => <td className="px-4 py-3 text-sm text-stone-600 whitespace-normal" {...props} />,
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

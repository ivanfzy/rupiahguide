// scripts/generate-sitemap.js
import { writeFileSync, readdirSync, readFileSync } from 'fs';
import { resolve, join } from 'path';
import matter from 'gray-matter';

// Load SEO Config (Simple approach since we can't easily import TS in JS script without build step)
const BASE_URL = 'https://rupiahguide.com';
const BLOG_DIR = resolve('src/content/blog');

const staticPages = [
  '/',
  '/blog',
];

// Scan for markdown posts
let blogPosts = [];
try {
  const files = readdirSync(BLOG_DIR);
  blogPosts = files
    .filter(file => file.endsWith('.md'))
    .map(file => {
      const slug = file.replace('.md', '');
      return `/blog/${slug}`;
    });
} catch (err) {
  console.warn('⚠️ No blog posts found or directory missing:', err.message);
}

const allPages = [...staticPages, ...blogPosts];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allPages
    .map((page) => {
      return `
  <url>
    <loc>${BASE_URL}${page}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page === '/' ? 'daily' : 'monthly'}</changefreq>
    <priority>${page === '/' ? '1.0' : '0.8'}</priority>
  </url>`;
    })
    .join('')}
</urlset>`;

const robots = `User-agent: *
Allow: /
Sitemap: ${BASE_URL}/sitemap.xml
`;

// Write files to public dir
try {
  const publicDir = resolve('public');
  writeFileSync(resolve(publicDir, 'sitemap.xml'), sitemap);
  writeFileSync(resolve(publicDir, 'robots.txt'), robots);
  console.log('✅ Sitemap and Robots.txt generated successfully!');
  console.log(`   - Total URLs: ${allPages.length}`);
} catch (error) {
  console.error('❌ Error generating sitemap:', error);
}

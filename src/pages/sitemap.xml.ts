import type { APIRoute } from 'astro';
import { getPublishedArticles } from '@/lib/articles';
import { categories } from '@/data/stories';

function escapeXml(unsafe: string): string {
  return (unsafe || '').replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case "'":
        return '&apos;';
      case '"':
        return '&quot;';
      default:
        return c;
    }
  });
}

export const GET: APIRoute = async (context) => {
  const origin = context.url?.origin;
  const siteUrl = (origin && !origin.includes('localhost') && !origin.includes('127.0.0.1')
    ? origin
    : context.site?.toString() || 'https://y7duth.online'
  ).replace(/\/$/, '');

  const articles = await getPublishedArticles();
  const targetCategories = categories.filter((cat) => cat !== 'الكل');

  const urls: string[] = [];

  // 1. Homepage
  urls.push(`  <url>
    <loc>${siteUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`);

  // 2. Category Pages
  for (const cat of targetCategories) {
    const loc = `${siteUrl}/category/${encodeURIComponent(cat)}`;
    urls.push(`  <url>
    <loc>${escapeXml(loc)}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
  }

  // 3. Article Pages (All 100 articles)
  for (const art of articles) {
    const lastmodDate = art.publishedAt || art.createdAt || new Date().toISOString();
    let lastmodIso = '';
    try {
      lastmodIso = new Date(lastmodDate).toISOString().split('T')[0];
    } catch {
      lastmodIso = new Date().toISOString().split('T')[0];
    }

    const loc = `${siteUrl}/story/${encodeURIComponent(art.slug)}`;
    urls.push(`  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmodIso}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>`);
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  return new Response(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
    },
  });
};

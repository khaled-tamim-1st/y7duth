import type { APIRoute } from 'astro';
import { getPublishedArticles } from '@/lib/articles';
import { remember } from '@/lib/cache';
import { optimizeImageUrl } from '@/lib/seo';

export const GET: APIRoute = async () => {
  const searchIndex = await remember('api_search_index', 120, async () => {
    const rows = await getPublishedArticles();
    return rows.map((s) => ({
      slug: s.slug,
      title: s.title,
      excerpt: s.excerpt,
      category: s.category,
      author: s.authorName,
      location: s.location || 'الكويت',
      read: s.readTime || '٥ دقائق',
      image: optimizeImageUrl(s.coverImage, 200),
    }));
  });

  return new Response(JSON.stringify(searchIndex), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=120, s-maxage=600, stale-while-revalidate=86400',
    },
  });
};

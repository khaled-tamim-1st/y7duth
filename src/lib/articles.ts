import articlesData from '@/data/articles-data.json';
import { getDb, articlesTable } from '@/db';
import { desc, and, eq, lte, or } from 'drizzle-orm';

export interface ArticleItem {
  id: string;
  slug: string;
  oldSlug?: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  location: string;
  authorName: string;
  authorRole: string;
  coverImage: string;
  status: string;
  publishedAt: string | null;
  createdAt: string;
  isFeatured: boolean;
  readTime: string;
}

// Fallback normalized articles list from bundled JSON
export const fallbackArticles: ArticleItem[] = (articlesData as any[]).map((a) => ({
  id: String(a.id),
  slug: String(a.slug),
  oldSlug: a.old_slug ? String(a.old_slug) : undefined,
  title: String(a.title),
  excerpt: String(a.excerpt),
  content: String(a.content || ''),
  category: String(a.category),
  location: String(a.location || 'الكويت'),
  authorName: String(a.author_name || a.authorName || 'فريق التحرير'),
  authorRole: String(a.author_role || a.authorRole || 'محرر وثائقي'),
  coverImage: String(a.cover_image || a.coverImage || ''),
  status: String(a.status || 'published'),
  publishedAt: a.published_at || a.publishedAt || a.created_at || a.createdAt || null,
  createdAt: String(a.created_at || a.createdAt || new Date().toISOString()),
  isFeatured: Boolean(a.is_featured || a.isFeatured),
  readTime: String(a.read_time || a.readTime || '٥ دقائق'),
}));

/**
 * Fetch all published articles:
 * Tries the database first. If DB is unavailable, empty, or running in serverless mode (Cloudflare),
 * seamlessly falls back to the bundled 100 articles dataset.
 */
export async function getPublishedArticles(): Promise<ArticleItem[]> {
  try {
    const db = getDb();
    if (db) {
      const now = new Date();
      const rows = await db
        .select({
          id: articlesTable.id,
          slug: articlesTable.slug,
          category: articlesTable.category,
          title: articlesTable.title,
          excerpt: articlesTable.excerpt,
          content: articlesTable.content,
          location: articlesTable.location,
          authorName: articlesTable.authorName,
          authorRole: articlesTable.authorRole,
          coverImage: articlesTable.coverImage,
          isFeatured: articlesTable.isFeatured,
          readTime: articlesTable.readTime,
          status: articlesTable.status,
          publishedAt: articlesTable.publishedAt,
          createdAt: articlesTable.createdAt,
        })
        .from(articlesTable)
        .where(
          or(
            eq(articlesTable.status, 'published'),
            and(
              eq(articlesTable.status, 'scheduled'),
              lte(articlesTable.scheduledFor, now)
            )
          )
        )
        .orderBy(desc(articlesTable.createdAt));

      if (rows && rows.length > 0) {
        return rows.map((r: any) => ({
          id: String(r.id),
          slug: String(r.slug),
          title: String(r.title),
          excerpt: String(r.excerpt),
          content: String(r.content || ''),
          category: String(r.category),
          location: String(r.location || 'الكويت'),
          authorName: String(r.authorName || 'فريق التحرير'),
          authorRole: String(r.authorRole || 'محرر وثائقي'),
          coverImage: String(r.coverImage || ''),
          status: String(r.status || 'published'),
          publishedAt: r.publishedAt ? new Date(r.publishedAt).toISOString() : null,
          createdAt: String(r.createdAt || new Date().toISOString()),
          isFeatured: Boolean(r.isFeatured),
          readTime: String(r.readTime || '٥ دقائق'),
        }));
      }
    }
  } catch (err) {
    console.debug('Database fetch notice, falling back to static dataset:', err);
  }

  // Fallback to static articles
  return fallbackArticles.filter((a) => a.status === 'published');
}

/**
 * Fetch a single article by its slug.
 */
export async function getArticleBySlug(slug: string): Promise<ArticleItem | null> {
  const decodedSlug = decodeURIComponent(slug);

  try {
    const db = getDb();
    if (db) {
      const now = new Date();
      const rows = await db
        .select()
        .from(articlesTable)
        .where(
          and(
            eq(articlesTable.slug, decodedSlug),
            or(
              eq(articlesTable.status, 'published'),
              and(
                eq(articlesTable.status, 'scheduled'),
                lte(articlesTable.scheduledFor, now)
              )
            )
          )
        )
        .limit(1);

      if (rows && rows.length > 0) {
        const r: any = rows[0];
        return {
          id: String(r.id),
          slug: String(r.slug),
          title: String(r.title),
          excerpt: String(r.excerpt),
          content: String(r.content || ''),
          category: String(r.category),
          location: String(r.location || 'الكويت'),
          authorName: String(r.authorName || 'فريق التحرير'),
          authorRole: String(r.authorRole || 'محرر وثائقي'),
          coverImage: String(r.coverImage || ''),
          status: String(r.status || 'published'),
          publishedAt: r.publishedAt ? new Date(r.publishedAt).toISOString() : null,
          createdAt: String(r.createdAt || new Date().toISOString()),
          isFeatured: Boolean(r.isFeatured),
          readTime: String(r.readTime || '٥ دقائق'),
        };
      }
    }
  } catch (err) {
    console.debug('DB lookup notice for slug:', decodedSlug, err);
  }

  const match = fallbackArticles.find(
    (a) =>
      a.slug === decodedSlug ||
      a.slug === slug ||
      (a.oldSlug && (a.oldSlug === decodedSlug || a.oldSlug === slug))
  );
  return match || null;
}

/**
 * Fetch articles for a specific category.
 */
export async function getArticlesByCategory(category: string): Promise<ArticleItem[]> {
  const decodedCategory = decodeURIComponent(category);
  const all = await getPublishedArticles();
  return all.filter((a) => a.category === decodedCategory);
}

/**
 * Fetch linear Next and Previous articles in circular chain (Doubly-Linked List)
 * Guarantees zero orphan pages and unbroken crawl depth.
 */
export async function getPrevNextArticles(currentId: string): Promise<{
  prev: ArticleItem | null;
  next: ArticleItem | null;
}> {
  const all = await getPublishedArticles();
  if (all.length <= 1) return { prev: null, next: null };

  const currentIndex = all.findIndex((a) => a.id === currentId);
  if (currentIndex === -1) return { prev: null, next: null };

  const prevIndex = (currentIndex - 1 + all.length) % all.length;
  const nextIndex = (currentIndex + 1) % all.length;

  return {
    prev: all[prevIndex],
    next: all[nextIndex],
  };
}

/**
 * Fetch related stories with dynamic rotating topical clustering and cross-silo linking.
 * Prevents PageRank starvation by rotating recommendations through the category.
 */
export async function getRelatedArticles(
  currentId: string,
  category: string,
  limit = 4
): Promise<ArticleItem[]> {
  const all = await getPublishedArticles();
  const sameCategory = all.filter((a) => a.id !== currentId && a.category === category);

  const selected: ArticleItem[] = [];
  const selectedIds = new Set<string>();

  if (sameCategory.length > 0) {
    // Locate current article's index to rotate from
    const currentIndex = sameCategory.findIndex((a) => a.id === currentId);
    const startIdx = currentIndex >= 0 ? (currentIndex + 1) % sameCategory.length : 0;

    // Pick up to 3 stories from the same category sequentially starting after current
    for (let i = 0; i < sameCategory.length && selected.length < 3; i++) {
      const candidate = sameCategory[(startIdx + i) % sameCategory.length];
      if (candidate.id !== currentId && !selectedIds.has(candidate.id)) {
        selected.push(candidate);
        selectedIds.add(candidate.id);
      }
    }
  }

  // Cross-category linking (pick 1 story from another category for topic exploration)
  const otherCategories = all.filter((a) => a.id !== currentId && a.category !== category);
  if (otherCategories.length > 0 && selected.length < limit) {
    // Deterministic selection based on currentId hash so each page has stable cross-links
    const hash = currentId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const crossIndex = hash % otherCategories.length;
    const candidate = otherCategories[crossIndex];
    if (candidate && !selectedIds.has(candidate.id)) {
      selected.push(candidate);
      selectedIds.add(candidate.id);
    }
  }

  // If still under limit, backfill from remaining articles
  if (selected.length < limit) {
    for (const art of all) {
      if (art.id !== currentId && !selectedIds.has(art.id)) {
        selected.push(art);
        selectedIds.add(art.id);
        if (selected.length >= limit) break;
      }
    }
  }

  return selected.slice(0, limit);
}


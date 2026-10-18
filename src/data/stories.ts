export interface Story {
  slug: string;
  category: 'أهل الديرة' | 'في الفريج' | 'سوالف وتراث' | 'سفرة الديرة' | 'ألبوم الذاكرة';
  title: string;
  excerpt: string;
  author: string;
  authorRole?: string;
  date: string;
  read: string;
  image: string;
  location: string;
  featured?: boolean;
  body: string[];
}

export const categories = [
  'الكل',
  'أهل الديرة',
  'في الفريج',
  'سوالف وتراث',
  'سفرة الديرة',
  'ألبوم الذاكرة',
] as const;

export type Category = (typeof categories)[number];

import articlesData from './articles-data.json';

export const stories: Story[] = (articlesData as any[]).map((a) => ({
  slug: String(a.slug),
  category: a.category,
  title: String(a.title),
  excerpt: String(a.excerpt),
  author: String(a.author_name || a.authorName || 'فريق التحرير'),
  authorRole: a.author_role || a.authorRole || 'محرر وثائقي',
  date: new Date(a.published_at || a.created_at || Date.now()).toLocaleDateString('ar-KW'),
  read: String(a.read_time || a.readTime || '٥ دقائق'),
  image: String(a.cover_image || a.coverImage || ''),
  location: String(a.location || 'الكويت'),
  featured: Boolean(a.is_featured || a.isFeatured),
  body: String(a.content || '').split('\n\n').filter(Boolean),
}));

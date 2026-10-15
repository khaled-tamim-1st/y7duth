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

// تم تفريغ المقالات التجريبية بناءً على طلبك لتجهيز المدونة للمحتوى الجديد
export const stories: Story[] = [];

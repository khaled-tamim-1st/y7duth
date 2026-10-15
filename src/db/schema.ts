import { pgTable, text, timestamp, boolean, uuid, integer, varchar } from 'drizzle-orm/pg-core';

export const articlesTable = pgTable('articles', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  excerpt: text('excerpt').notNull(),
  content: text('content').notNull(),
  category: varchar('category', { length: 50 }).notNull(), // 'أهل الديرة' | 'في الفريج' | 'سوالف وتراث' | 'سفرة الديرة' | 'ألبوم الذاكرة'
  location: varchar('location', { length: 150 }),
  authorName: varchar('author_name', { length: 150 }).notNull(),
  authorRole: varchar('author_role', { length: 150 }),
  coverImage: varchar('cover_image', { length: 500 }).notNull(),
  status: varchar('status', { length: 20 }).default('draft').notNull(), // 'draft' | 'scheduled' | 'published'
  scheduledFor: timestamp('scheduled_for', { withTimezone: true }),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  isFeatured: boolean('is_featured').default(false).notNull(),
  readTime: varchar('read_time', { length: 50 }).default('٥ دقائق'),
  viewsCount: integer('views_count').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const subscribersTable = pgTable('subscribers', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  subscribedAt: timestamp('subscribed_at', { withTimezone: true }).defaultNow().notNull(),
  isActive: boolean('is_active').default(true).notNull(),
});

export const adminUsersTable = pgTable('admin_users', {
  id: uuid('id').defaultRandom().primaryKey(),
  username: varchar('username', { length: 100 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 150 }).notNull(),
  role: varchar('role', { length: 50 }).default('admin').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Article = typeof articlesTable.$inferSelect;
export type NewArticle = typeof articlesTable.$inferInsert;
export type Subscriber = typeof subscribersTable.$inferSelect;
export type AdminUser = typeof adminUsersTable.$inferSelect;

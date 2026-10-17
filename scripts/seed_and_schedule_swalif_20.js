import { PGlite } from '@electric-sql/pglite';
import fs from 'fs';
import path from 'path';

// مصفوفة البيانات والمواقع والصور لـ 20 مقالاً في قسم سوالف وتراث
const articlesMeta = [
  {
    file: 'مقال-01-حمارة-القايلة.md',
    location: 'فرجان الكويت القديمة - حي القبلة',
    coverImage: '/images/street.jpg',
    readTime: '٦ دقائق',
    scheduledFor: '2026-11-12T11:00:00+03:00'
  },
  {
    file: 'مقال-02-الطنطل-والسكيك.md',
    location: 'سكيك الكويت العتيقة - حي الشرق',
    coverImage: '/images/historical-place.jpg',
    readTime: '٦ دقائق',
    scheduledFor: '2026-11-15T11:00:00+03:00'
  },
  {
    file: 'مقال-03-بودرياه-البحر.md',
    location: 'هيرات اللؤلؤ وأعماق البحر الكويتي',
    coverImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200',
    readTime: '٧ دقائق',
    scheduledFor: '2026-11-18T11:00:00+03:00'
  },
  {
    file: 'مقال-04-السعلوة-والدعيدع.md',
    location: 'بيوت ودواوين الفريج القديم',
    coverImage: '/images/neighborhood.jpg',
    readTime: '٧ دقائق',
    scheduledFor: '2026-11-21T11:00:00+03:00'
  },
  {
    file: 'مقال-05-مثل-صام-وفطر-بصلة.md',
    location: 'سوق الخضار ومطابخ الفرجان القديمة',
    coverImage: '/images/souq.jpg',
    readTime: '٦ دقائق',
    scheduledFor: '2026-11-24T11:00:00+03:00'
  },
  {
    file: 'مقال-06-مثل-طار-طيرك.md',
    location: 'سواحل الكويت وبوادي الصيد والرحلات',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200',
    readTime: '٦ دقائق',
    scheduledFor: '2026-11-27T11:00:00+03:00'
  },
  {
    file: 'مقال-07-مثل-يمدح-السوق.md',
    location: 'سوق المباركية وبورصة تجارة اللؤلؤ',
    coverImage: '/images/kuwait-souq.jpg',
    readTime: '٦ دقائق',
    scheduledFor: '2026-11-30T11:00:00+03:00'
  },
  {
    file: 'مقال-08-امثال-طريفة.md',
    location: 'مجالس ودواوين أهل الديرة العتيقة',
    coverImage: '/images/breakfast.jpg',
    readTime: '٧ دقائق',
    scheduledFor: '2026-12-03T11:00:00+03:00'
  },
  {
    file: 'مقال-09-احتفالية-النون.md',
    location: 'أحواش بيوت الفريج القديمة',
    coverImage: '/images/neighborhood.jpg',
    readTime: '٦ دقائق',
    scheduledFor: '2026-12-06T11:00:00+03:00'
  },
  {
    file: 'مقال-10-القرقيعان.md',
    location: 'سكيك وبراحات فرجان الكويت',
    coverImage: '/images/street.jpg',
    readTime: '٦ دقائق',
    scheduledFor: '2026-12-09T11:00:00+03:00'
  },
  {
    file: 'مقال-11-دق-الهريس.md',
    location: 'حوش البيت الكويتي ومطابخ رمضان',
    coverImage: '/images/breakfast.jpg',
    readTime: '٦ دقائق',
    scheduledFor: '2026-12-12T11:00:00+03:00'
  },
  {
    file: 'مقال-12-الغبقة-الرمضانية.md',
    location: 'دواوين الكويت وموائد السمر الرمضاني',
    coverImage: '/images/breakfast.jpg',
    readTime: '٦ دقائق',
    scheduledFor: '2026-12-15T11:00:00+03:00'
  },
  {
    file: 'مقال-13-العاب-صبيان-الفريج.md',
    location: 'البراحات والساحات الترابية في الفريج',
    coverImage: '/images/street.jpg',
    readTime: '٦ دقائق',
    scheduledFor: '2026-12-18T11:00:00+03:00'
  },
  {
    file: 'مقال-14-العاب-بنات-الفريج.md',
    location: 'ليوان وغرف البيت الكويتي العتيق',
    coverImage: '/images/neighborhood.jpg',
    readTime: '٦ دقائق',
    scheduledFor: '2026-12-21T11:00:00+03:00'
  },
  {
    file: 'مقال-15-اهازيج-التنويم.md',
    location: 'غرف النوم والدار في البيوت الطينية القديمة',
    coverImage: '/images/historical-place.jpg',
    readTime: '٦ دقائق',
    scheduledFor: '2026-12-24T11:00:00+03:00'
  },
  {
    file: 'مقال-16-السامري-والعرضة.md',
    location: 'ساحات الاحتفالات الوطنية ونقعات الساحل',
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200',
    readTime: '٧ دقائق',
    scheduledFor: '2026-12-26T11:00:00+03:00'
  },
  {
    file: 'مقال-17-سنة-الطاعون.md',
    location: 'داخل سور الكويت القديم (1831)',
    coverImage: '/images/historical-place.jpg',
    readTime: '٦ دقائق',
    scheduledFor: '2026-12-28T11:00:00+03:00'
  },
  {
    file: 'مقال-18-سنة-الجدري.md',
    location: 'أحياء العاصمة داخل السور (1932)',
    coverImage: '/images/neighborhood.jpg',
    readTime: '٦ دقائق',
    scheduledFor: '2026-12-29T11:00:00+03:00'
  },
  {
    file: 'مقال-19-سنة-البطاقة.md',
    location: 'أسواق التموين ودكاكين فرجان العاصمة',
    coverImage: '/images/souq.jpg',
    readTime: '٦ دقائق',
    scheduledFor: '2026-12-30T11:00:00+03:00'
  },
  {
    file: 'مقال-20-سنة-الهيلك.md',
    location: 'مخازن ودواوين تجار الكويت في حي الوسط',
    coverImage: '/images/kuwait-souq.jpg',
    readTime: '٧ دقائق',
    scheduledFor: '2026-12-31T11:00:00+03:00'
  }
];

function parseArticleMarkdown(filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const lines = raw.split('\n');

  // استخراج العنوان H1
  const titleLine = lines.find(l => l.startsWith('# '));
  const title = titleLine ? titleLine.replace(/^#\s+/, '').trim() : 'عنوان المقال التراثي';

  // استخراج السلاج
  const slugLine = lines.find(l => l.toLowerCase().includes('slug:'));
  let slug = '';
  if (slugLine) {
    slug = slugLine.replace(/\*\*slug:\*\*/i, '').replace(/slug:/i, '').replace(/\*/g, '').trim();
  }

  // استخراج المقتطف Excerpt
  const excerptLine = lines.find(l => l.toLowerCase().includes('excerpt:'));
  let excerpt = '';
  if (excerptLine) {
    excerpt = excerptLine.replace(/\*\*excerpt:\*\*/i, '').replace(/excerpt:/i, '').replace(/\*/g, '').trim();
  }

  // استخراج متن المقال (حذف الترويسة وميتا الـ SEO)
  let contentStartIndex = -1;
  let dashesCount = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      dashesCount++;
      if (dashesCount >= 2) {
        contentStartIndex = i + 1;
        break;
      }
    }
  }

  const content = (contentStartIndex !== -1 ? lines.slice(contentStartIndex).join('\n') : raw).trim();

  return { title, slug, excerpt, content };
}

async function main() {
  const dbPath = path.resolve(process.cwd(), 'local-data', 'pglite');
  const db = new PGlite(dbPath);

  console.log('====================================================');
  console.log('⚡ بدء إدراج وجدولة مقالات قسم [سوالف وتراث] في الداتابيز');
  console.log('====================================================\n');

  const dir = path.resolve(process.cwd(), 'سوالف-وتراث');
  let insertedCount = 0;

  for (const item of articlesMeta) {
    const fullPath = path.join(dir, item.file);
    if (!fs.existsSync(fullPath)) {
      console.error(`⚠️ الملف غير موجود: ${item.file}`);
      continue;
    }

    const { title, slug, excerpt, content } = parseArticleMarkdown(fullPath);

    // فحص ما إذا كان المقال موجوداً مسبقاً
    const existing = await db.query('SELECT id FROM articles WHERE slug = $1', [slug]);

    if (existing.rows.length > 0) {
      // تحديث
      await db.query(`
        UPDATE articles SET
          title = $1,
          excerpt = $2,
          content = $3,
          category = $4,
          location = $5,
          author_name = $6,
          author_role = $7,
          cover_image = $8,
          status = $9,
          scheduled_for = $10,
          read_time = $11,
          updated_at = NOW()
        WHERE slug = $12
      `, [
        title,
        excerpt,
        content,
        'سوالف وتراث',
        item.location,
        'خالد تميم',
        'باحث تراثي وراوي سوالف',
        item.coverImage,
        'scheduled',
        item.scheduledFor,
        item.readTime,
        slug
      ]);
      console.log(`🔄 تم تحديث وجدولة: [${slug}] -> ${item.scheduledFor.slice(0, 10)}`);
    } else {
      // إدراج جديد
      await db.query(`
        INSERT INTO articles (
          slug, title, excerpt, content, category, location,
          author_name, author_role, cover_image, status,
          scheduled_for, published_at, is_featured, read_time, views_count,
          created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $8, $9, $10,
          $11, NULL, false, $12, 0,
          NOW(), NOW()
        )
      `, [
        slug,
        title,
        excerpt,
        content,
        'سوالف وتراث',
        item.location,
        'خالد تميم',
        'باحث تراثي وراوي سوالف',
        item.coverImage,
        'scheduled',
        item.scheduledFor,
        item.readTime
      ]);
      console.log(`✅ تم إدراج وجدولة: [${slug}] -> ${item.scheduledFor.slice(0, 10)}`);
    }

    insertedCount++;
  }

  console.log(`\n🎉 اكتمل إدراج وجدولة ${insertedCount} مقالاً في قاعدة البيانات بنجاح!`);

  // تقرير التحقق النهائي
  const statsRes = await db.query(`
    SELECT category, status, count(*) as count
    FROM articles
    GROUP BY category, status
    ORDER BY category, status
  `);

  console.log('\n--- التوزيع الحالي للمقالات في قاعدة البيانات ---');
  console.table(statsRes.rows);

  const swalifRes = await db.query(`
    SELECT title, slug, location, scheduled_for, status
    FROM articles
    WHERE category = 'سوالف وتراث'
    ORDER BY scheduled_for ASC
  `);

  console.log(`\n--- قائمة مقالات [سوالف وتراث] المجدولة (${swalifRes.rows.length} مقالاً) ---`);
  swalifRes.rows.forEach((r, i) => {
    const d = new Date(r.scheduled_for);
    console.log(`${i + 1}. [${r.status}] ${r.title}`);
    console.log(`    Slug: ${r.slug} | الموعد: ${d.toISOString().slice(0, 10)} 11:00 AM | المكان: ${r.location}`);
  });

  process.exit(0);
}

main().catch(err => {
  console.error('❌ خطأ أثناء الإدراج:', err);
  process.exit(1);
});

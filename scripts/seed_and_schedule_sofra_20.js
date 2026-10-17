import { PGlite } from '@electric-sql/pglite';
import fs from 'fs';
import path from 'path';

// مصفوفة البيانات والجدولة والصور والمواقع لـ 20 مقالاً في قسم سفرة الديرة
export const sofraArticlesMeta = [
  // --- الدفعة الأولى: سادة السفرة الكويتية وأطباق اللحم والعيش ---
  {
    file: 'مقال-01-مجبوس-اللحم-الكويتي.md',
    location: 'مطابخ البيوت العتيقة - حي القبلة',
    coverImage: '/images/breakfast.jpg',
    readTime: '٧ دقائق',
    scheduledFor: '2026-11-13T12:00:00+03:00'
  },
  {
    file: 'مقال-02-المطبق-الزبيدي-والهامور.md',
    location: 'سوق السمك القديم وفرضة السيف',
    coverImage: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=1200',
    readTime: '٧ دقائق',
    scheduledFor: '2026-11-16T12:00:00+03:00'
  },
  {
    file: 'مقال-03-القوزي-الكويتي-ولائم-الدواوين.md',
    location: 'دواوين أهل الديرة - فريج الميدان وحي الشرق',
    coverImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200',
    readTime: '٨ دقائق',
    scheduledFor: '2026-11-19T12:00:00+03:00'
  },
  {
    file: 'مقال-04-المحمر-ودبس-التمر.md',
    location: 'هيرات اللؤلؤ وسفن الغوص في عرض البحر',
    coverImage: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=1200',
    readTime: '٧ دقائق',
    scheduledFor: '2026-11-22T12:00:00+03:00'
  },

  // --- الدفعة الثانية: أكلات الصبر ودفء الشتاء والفرجان ---
  {
    file: 'مقال-05-المموش-ومموش-الروبيان-اليابس.md',
    location: 'فرجان الكويت القديمة - بيوت الطين في الشتاء',
    coverImage: '/images/neighborhood.jpg',
    readTime: '٦ دقائق',
    scheduledFor: '2026-11-25T12:00:00+03:00'
  },
  {
    file: 'مقال-06-المرقوقة-والقبوط-الكويتي.md',
    location: 'ليوان البيت الكويتي العتيق - مطابخ النفاس',
    coverImage: '/images/breakfast.jpg',
    readTime: '٧ دقائق',
    scheduledFor: '2026-11-28T12:00:00+03:00'
  },
  {
    file: 'مقال-07-الهريس-والجريش-في-البيوت-القديمة.md',
    location: 'بيوت الفريج ومناحيز الهريس في رمضان',
    coverImage: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?q=80&w=1200',
    readTime: '٧ دقائق',
    scheduledFor: '2026-12-01T12:00:00+03:00'
  },
  {
    file: 'مقال-08-المعدس-الكويتي-وايام-الغيم.md',
    location: 'مطابخ الفرجان وأيام الغيم والمطر',
    coverImage: '/images/street.jpg',
    readTime: '٦ دقائق',
    scheduledFor: '2026-12-04T12:00:00+03:00'
  },

  // --- الدفعة الثالثة: مائدة البحر وحكايات قاع الجون ---
  {
    file: 'مقال-09-مرقة-الصبور-وموسم-الشوي-بالميفا.md',
    location: 'تنور الميفا في باحة البيت وبحر جون الكويت',
    coverImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200',
    readTime: '٨ دقائق',
    scheduledFor: '2026-12-07T12:00:00+03:00'
  },
  {
    file: 'مقال-10-ميد-مشوي-على-السيف.md',
    location: 'ساحل الشويخ والوطية (شاطئ السيف)',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200',
    readTime: '٧ دقائق',
    scheduledFor: '2026-12-10T12:00:00+03:00'
  },
  {
    file: 'مقال-11-مرقة-الهامور-والدقوس-والمعبوج.md',
    location: 'مطابخ الفريج وسوق السمك بالمباركية',
    coverImage: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1200',
    readTime: '٨ دقائق',
    scheduledFor: '2026-12-13T12:00:00+03:00'
  },
  {
    file: 'مقال-12-حمسة-الروبيان-والخثاق.md',
    location: 'نقعة الشملان وسواحل جزيرة بوبيان',
    coverImage: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?q=80&w=1200',
    readTime: '٨ دقائق',
    scheduledFor: '2026-12-16T12:00:00+03:00'
  },

  // --- الدفعة الرابعة: حلويات البيت ومناسبات الأعياد والقهوة ---
  {
    file: 'مقال-13-الدرابيل-والقرص-العقيلي.md',
    location: 'دواوين الضيافة وفوالة الأعياد في الفريج',
    coverImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1200',
    readTime: '٦ دقائق',
    scheduledFor: '2026-12-19T12:00:00+03:00'
  },
  {
    file: 'مقال-14-الرهش-الكويتي-والحلوى-العمانية.md',
    location: 'سوق التمر ودكاكين الحلواچية في المباركية',
    coverImage: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=1200',
    readTime: '٦ دقائق',
    scheduledFor: '2026-12-22T12:00:00+03:00'
  },
  {
    file: 'مقال-15-اللقيمات-وصب-القفشة.md',
    location: 'بيوت الفريج وموائد الغبقة في رمضان',
    coverImage: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?q=80&w=1200',
    readTime: '٦ دقائق',
    scheduledFor: '2026-12-25T12:00:00+03:00'
  },
  {
    file: 'مقال-16-البلاليط-وقرص-الطابي.md',
    location: 'فطور صباح الجمعة والأعياد في البيت العود',
    coverImage: '/images/breakfast.jpg',
    readTime: '٦ دقائق',
    scheduledFor: '2026-12-27T12:00:00+03:00'
  },

  // --- الدفعة الخامسة: أسرار البهارات، المونة، والمشروبات الشعبية ---
  {
    file: 'مقال-17-خلطة-البزار-الكويتي-واللومي-السحاري.md',
    location: 'سوق الغربللي وعطّارو الكويت القديمة',
    coverImage: '/images/kuwait-souq.jpg',
    readTime: '٨ دقائق',
    scheduledFor: '2026-12-28T12:00:00+03:00'
  },
  {
    file: 'مقال-18-صناعة-الآجار-الكويتي-والمخللات.md',
    location: 'مخازن المونة وبساتين الفنطاس والجهراء',
    coverImage: 'https://images.unsplash.com/photo-1589135233689-d56d354a781b?q=80&w=1200',
    readTime: '٧ دقائق',
    scheduledFor: '2026-12-29T12:00:00+03:00'
  },
  {
    file: 'مقال-19-القهوة-العربية-الكويتية-وآداب-الفنجان.md',
    location: 'دواوين الكويت العريقة ومجالس الرجال',
    coverImage: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200',
    readTime: '٨ دقائق',
    scheduledFor: '2026-12-30T12:00:00+03:00'
  },
  {
    file: 'مقال-20-شاي-الفحم-وماء-اللقاح-وشراب-البيذان.md',
    location: 'مقاهي السيف الشعبية وواحات النخيل',
    coverImage: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=1200',
    readTime: '٨ دقائق',
    scheduledFor: '2026-12-31T12:00:00+03:00'
  }
];

export function parseArticleMarkdown(filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8');

  // Title (H1)
  let title = '';
  const mTitle = raw.match(/【العنوان\s*\(H1\)】[^\:]*:\s*(.*)/i) || 
                 raw.match(/العنوان\s*\(H1\)[^\:]*:\s*(.*)/i) || 
                 raw.match(/العنوان[^\:]*:\s*(.*)/i);
  if (mTitle) {
    title = mTitle[1].replace(/^[#\*\s]+/, '').replace(/[\*\s]+$/, '').trim();
  } else {
    const lines = raw.split('\n');
    const titleLine = lines.find(l => l.startsWith('# '));
    title = titleLine ? titleLine.replace(/^#\s+/, '').replace(/^المقال\s+[^\:]+:\s*/, '').trim() : path.basename(filePath, '.md');
  }

  // Slug
  let slug = '';
  const mSlug = raw.match(/【Slug】[^\:]*:\s*(.*)/i) || raw.match(/Slug[^\:]*:\s*(.*)/i);
  if (mSlug) {
    slug = mSlug[1].replace(/[`\*]/g, '').trim();
  } else {
    slug = path.basename(filePath, '.md');
  }

  // Excerpt
  let excerpt = '';
  const mExcerpt = raw.match(/【Excerpt】[^\:]*:\s*(.*)/i) || raw.match(/Excerpt[^\:]*:\s*(.*)/i);
  if (mExcerpt) {
    excerpt = mExcerpt[1].replace(/[`\*]/g, '').trim();
  } else {
    excerpt = title;
  }

  // Content (we keep the rich article content, stripping YAML wrapper if needed or preserving everything)
  const lines = raw.split('\n');
  let contentStartIndex = 0;
  let dashesCount = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      dashesCount++;
      if (dashesCount >= 1 && i > 5) {
        contentStartIndex = i + 1;
        break;
      }
    }
  }

  const content = (contentStartIndex > 0 ? lines.slice(contentStartIndex).join('\n') : raw).trim();

  return { title, slug, excerpt, content };
}

async function main() {
  const dbPath = path.resolve(process.cwd(), 'local-data', 'pglite');
  const db = new PGlite(dbPath);

  console.log('====================================================');
  console.log('⚡ بدء إدراج وجدولة مقالات قسم [سفرة الديرة] في الداتابيز');
  console.log('====================================================\n');

  const dir = path.resolve(process.cwd(), 'سفرة-الديرة');
  let insertedCount = 0;

  for (const item of sofraArticlesMeta) {
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
        'سفرة الديرة',
        item.location,
        'خالد تميم',
        'باحث ومؤرخ تراث الطهي الكويتي',
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
        'سفرة الديرة',
        item.location,
        'خالد تميم',
        'باحث ومؤرخ تراث الطهي الكويتي',
        item.coverImage,
        'scheduled',
        item.scheduledFor,
        item.readTime
      ]);
      console.log(`✅ تم إدراج وجدولة: [${slug}] -> ${item.scheduledFor.slice(0, 10)}`);
    }

    insertedCount++;
  }

  console.log(`\n🎉 اكتمل إدراج وجدولة ${insertedCount} مقالاً في قسم [سفرة الديرة] بنجاح!`);

  // إحصائيات عامة
  const statsRes = await db.query(`
    SELECT category, status, count(*) as count
    FROM articles
    GROUP BY category, status
    ORDER BY category, status
  `);

  console.log('\n--- التوزيع الشامل لجميع أقسام المدونة في قاعدة البيانات ---');
  console.table(statsRes.rows);

  const sofraRes = await db.query(`
    SELECT title, slug, location, scheduled_for, status
    FROM articles
    WHERE category = 'سفرة الديرة'
    ORDER BY scheduled_for ASC
  `);

  console.log(`\n--- قائمة مقالات [سفرة الديرة] المجدولة (${sofraRes.rows.length} مقالاً) ---`);
  sofraRes.rows.forEach((r, i) => {
    const d = new Date(r.scheduled_for);
    console.log(`${i + 1}. [${r.status}] ${r.title}`);
    console.log(`    Slug: ${r.slug} | الموعد: ${d.toISOString().slice(0, 10)} 12:00 PM | المكان: ${r.location}`);
  });

  await db.close();
  process.exit(0);
}

main().catch(err => {
  console.error('❌ خطأ أثناء الإدراج:', err);
  process.exit(1);
});

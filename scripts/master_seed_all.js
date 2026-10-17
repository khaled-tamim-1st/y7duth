import { PGlite } from '@electric-sql/pglite';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

// استيراد مقالات أهل الديرة ومقالات في الفريج
// سنقرأ البيانات مباشرة لضمان سلامة وسرعة البناء
import { fareejArticles } from './seed_al_fareej_20.js';

// تواريخ جدولة أهل الديرة المعتمدة
const ahlAldeiraSchedule = [
  { slug: 'بوابات-سور-الكويت-القديم-تاريخ-الدراويز-الخمس', date: '2026-11-10T09:00:00+03:00' },
  { slug: 'مقهى-بوناشي-أقدم-مقهى-شعبي-في-الكويت-1780', date: '2026-11-13T09:00:00+03:00' },
  { slug: 'عادات-الزوارة-الكويتية-لمة-الخميس-والجمعة', date: '2026-11-16T09:00:00+03:00' },
  { slug: 'مهنة-القلافة-صناعة-السفن-الشراعية-الكويت', date: '2026-11-19T09:00:00+03:00' },
  { slug: 'سوق-الحريم-سوق-واجف-تاريخ-كفاح-نساء-الكويت', date: '2026-11-22T09:00:00+03:00' },
  { slug: 'شاي-الضحى-الكويتي-عادات-نساء-الفريج', date: '2026-11-25T09:00:00+03:00' },
  { slug: 'كشك-مبارك-في-ساحة-الصرافين-مقر-حكم-أسد-الجزيرة', date: '2026-11-28T09:00:00+03:00' },
  { slug: 'النهام-وفنون-البحر-في-الكويت-الفجري-واليامال', date: '2026-12-01T09:00:00+03:00' },
  { slug: 'مهنة-الكندري-في-الكويت-القديمة-سقاية-ماء-شط-العرب', date: '2026-12-04T09:00:00+03:00' },
  { slug: 'سنة-الهدامة-1934-طوفان-المطر-وفزعة-أهل-الكويت', date: '2026-12-07T09:00:00+03:00' },
  { slug: 'عمارة-البيت-الكويتي-القديم-الحوش-الليوان-البادجير', date: '2026-12-10T09:00:00+03:00' },
  { slug: 'عادة-القريش-في-الكويت-استقبال-رمضان-بين-الماضي-والحاضر', date: '2026-12-13T09:00:00+03:00' },
  { slug: 'متحف-بيت-العثمان-في-حولي-قصر-الأربعينيات', date: '2026-12-16T09:00:00+03:00' },
  { slug: 'فن-السدو-الكويتي-تراث-عالمي-في-اليونسكو', date: '2026-12-19T09:00:00+03:00' },
  { slug: 'سوق-الصفافير-في-الكويت-حرفة-طرق-النحاس-وتبييض-الدلال', date: '2026-12-22T09:00:00+03:00' },
  { slug: 'العالم-الفلكي-صالح-العجيري-سيرة-شيخ-الفلكيين-الكويتيين', date: '2026-12-25T09:00:00+03:00' },
  { slug: 'المستشفى-الأمريكاني-في-الكويت-تاريخ-الطب-الحديث-والعمارة', date: '2026-12-27T09:00:00+03:00' },
  { slug: 'سنة-الطفحة-1912-عام-الرخاء-والغوص-على-اللؤلؤ', date: '2026-12-29T09:00:00+03:00' },
  { slug: 'الديوانية-الكويتية-دستور-التكافل-الاجتماعي-وآداب-المجالس', date: '2026-12-30T09:00:00+03:00' },
  { slug: 'مصطلحات-البيت-الكويتي-القديم-معجم-الأثاث-والأواني', date: '2026-12-31T09:00:00+03:00' }
];

// مصفوفة بيانات مقالات سوالف وتراث
const swalifMeta = [
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

  const titleLine = lines.find(l => l.startsWith('# '));
  const title = titleLine ? titleLine.replace(/^#\s+/, '').trim() : 'عنوان المقال التراثي';

  const slugLine = lines.find(l => l.toLowerCase().includes('slug:'));
  let slug = '';
  if (slugLine) {
    slug = slugLine.replace(/\*\*slug:\*\*/i, '').replace(/slug:/i, '').replace(/\*/g, '').trim();
  }

  const excerptLine = lines.find(l => l.toLowerCase().includes('excerpt:'));
  let excerpt = '';
  if (excerptLine) {
    excerpt = excerptLine.replace(/\*\*excerpt:\*\*/i, '').replace(/excerpt:/i, '').replace(/\*/g, '').trim();
  }

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

async function runMasterSeed() {
  const dataDir = path.resolve(process.cwd(), 'local-data', 'pglite');
  fs.mkdirSync(dataDir, { recursive: true });

  console.log('===========================================================');
  console.log('🚀 إطلاق نظام البناء والجدولة الشامل لمدونة «يحدث في الكويت»');
  console.log('===========================================================\n');

  const db = new PGlite(dataDir);
  await db.waitReady;

  // 1. إنشاء الجداول الأساسية
  console.log('1️⃣ إنشاء الجداول الأساسية (articles, subscribers, admin_users)...');
  await db.exec(`
    CREATE TABLE IF NOT EXISTS articles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      slug VARCHAR(255) UNIQUE NOT NULL,
      title VARCHAR(255) NOT NULL,
      excerpt TEXT NOT NULL,
      content TEXT NOT NULL,
      category VARCHAR(50) NOT NULL,
      location VARCHAR(150),
      author_name VARCHAR(150) NOT NULL,
      author_role VARCHAR(150),
      cover_image VARCHAR(500) NOT NULL,
      status VARCHAR(20) DEFAULT 'draft' NOT NULL,
      scheduled_for TIMESTAMP WITH TIME ZONE,
      published_at TIMESTAMP WITH TIME ZONE,
      is_featured BOOLEAN DEFAULT false,
      read_time VARCHAR(50) DEFAULT '٥ دقائق',
      views_count INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS subscribers (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) UNIQUE NOT NULL,
      subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      is_active BOOLEAN DEFAULT true
    );

    CREATE TABLE IF NOT EXISTS admin_users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      username VARCHAR(100) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      name VARCHAR(150) NOT NULL,
      role VARCHAR(50) DEFAULT 'admin',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);
  console.log('✅ اكتمل تجهيز الجداول بنجاح.');

  // 2. إدراج المشرف العام والمشترك الافتراضي
  console.log('\n2️⃣ إدراج المشرف العام والمشترك الافتراضي...');
  const passHash = await bcrypt.hash('kuwait@admin2026', 10);
  await db.query(`
    INSERT INTO admin_users (username, password_hash, name, role)
    VALUES ('admin', $1, 'المشرف العام', 'admin')
    ON CONFLICT (username) DO NOTHING
  `, [passHash]);

  await db.query(`
    INSERT INTO subscribers (email, is_active)
    VALUES ('reader@yhdth-fy-lkwyt.com', true)
    ON CONFLICT (email) DO NOTHING
  `);
  console.log('✅ تم تجهيز حساب الأدمن والمشترك الافتراضي.');

  // 3. قراءة وإدراج وجدولة 20 مقالاً لقسم «أهل الديرة»
  console.log('\n3️⃣ إدراج وجدولة 20 مقالاً لقسم [أهل الديرة]...');
  const seedAll20Path = path.resolve(process.cwd(), 'scripts', 'seed_all_20.js');
  const seedAllCode = fs.readFileSync(seedAll20Path, 'utf-8');

  // استخراج المقالات باستخدام ديناميكية node
  const ahlArticlesMatch = seedAllCode.match(/const allArticles = (\[[\s\S]*?\]);\s*async function/);
  let ahlArticles = [];
  if (ahlArticlesMatch) {
    ahlArticles = eval(ahlArticlesMatch[1]);
  }

  const scheduleMap = new Map();
  ahlAldeiraSchedule.forEach(s => scheduleMap.set(s.slug, s.date));

  for (let i = 0; i < ahlArticles.length; i++) {
    const art = ahlArticles[i];
    const schedDate = scheduleMap.get(art.slug) || `2026-11-${String(10 + i).padStart(2, '0')}T09:00:00+03:00`;
    await db.query(`
      INSERT INTO articles (
        slug, title, excerpt, content, category, location,
        author_name, author_role, cover_image, status,
        scheduled_for, published_at, is_featured, read_time, views_count,
        created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, 'أهل الديرة', $5,
        $6, $7, $8, 'scheduled',
        $9, NULL, false, $10, 0,
        NOW(), NOW()
      )
      ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title,
        excerpt = EXCLUDED.excerpt,
        content = EXCLUDED.content,
        scheduled_for = EXCLUDED.scheduled_for,
        status = 'scheduled'
    `, [
      art.slug,
      art.title,
      art.excerpt,
      art.content,
      art.location || 'الكويت العاصمة',
      art.authorName || 'خالد تميم',
      art.authorRole || 'باحث صحفي ومحرر كويتي',
      art.coverImage || '/images/neighborhood.jpg',
      schedDate,
      art.readTime || '٦ دقائق'
    ]);
  }
  console.log(`✅ تم إدراج وجدولة ${ahlArticles.length} مقالاً في [أهل الديرة].`);

  // 4. إدراج وجدولة 20 مقالاً لقسم «في الفريج»
  console.log('\n4️⃣ إدراج وجدولة 20 مقالاً لقسم [في الفريج]...');
  for (let i = 0; i < fareejArticles.length; i++) {
    const art = fareejArticles[i];
    await db.query(`
      INSERT INTO articles (
        slug, title, excerpt, content, category, location,
        author_name, author_role, cover_image, status,
        scheduled_for, published_at, is_featured, read_time, views_count,
        created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, 'في الفريج', $5,
        $6, $7, $8, 'scheduled',
        $9, NULL, false, $10, 0,
        NOW(), NOW()
      )
      ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title,
        excerpt = EXCLUDED.excerpt,
        content = EXCLUDED.content,
        scheduled_for = EXCLUDED.scheduled_for,
        status = 'scheduled'
    `, [
      art.slug,
      art.title,
      art.excerpt,
      art.content,
      art.location,
      art.authorName,
      art.authorRole,
      art.coverImage,
      art.scheduledFor,
      art.readTime
    ]);
  }
  console.log(`✅ تم إدراج وجدولة ${fareejArticles.length} مقالاً في [في الفريج].`);

  // 5. إدراج وجدولة 20 مقالاً لقسم «سوالف وتراث»
  console.log('\n5️⃣ إدراج وجدولة 20 مقالاً لقسم [سوالف وتراث]...');
  const swalifDir = path.resolve(process.cwd(), 'سوالف-وتراث');

  for (let i = 0; i < swalifMeta.length; i++) {
    const meta = swalifMeta[i];
    const fullPath = path.join(swalifDir, meta.file);
    const { title, slug, excerpt, content } = parseArticleMarkdown(fullPath);

    await db.query(`
      INSERT INTO articles (
        slug, title, excerpt, content, category, location,
        author_name, author_role, cover_image, status,
        scheduled_for, published_at, is_featured, read_time, views_count,
        created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, 'سوالف وتراث', $5,
        'خالد تميم', 'باحث تراثي وراوي سوالف', $6, 'scheduled',
        $7, NULL, false, $8, 0,
        NOW(), NOW()
      )
      ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title,
        excerpt = EXCLUDED.excerpt,
        content = EXCLUDED.content,
        scheduled_for = EXCLUDED.scheduled_for,
        status = 'scheduled'
    `, [
      slug,
      title,
      excerpt,
      content,
      meta.location,
      meta.coverImage,
      meta.scheduledFor,
      meta.readTime
    ]);
    console.log(`[${i + 1}/20] جدولة: ${title.slice(0, 45)}... -> ${meta.scheduledFor.slice(0, 10)}`);
  }
  console.log(`✅ تم إدراج وجدولة ${swalifMeta.length} مقالاً في [سوالف وتراث].`);

  // 6. التحقق الإجمالي النهائي
  const statsRes = await db.query(`
    SELECT category, status, count(*) as count
    FROM articles
    GROUP BY category, status
    ORDER BY category, status
  `);

  console.log('\n===========================================================');
  console.log('🏆 تقرير حالة قاعدة البيانات بعد الضبط والجدولة الشاملة');
  console.log('===========================================================');
  console.table(statsRes.rows);

  const totalCount = await db.query('SELECT count(*) as total FROM articles');
  console.log(`إجمالي المقالات المجدولة والجاهزة في الداتابيز: ${totalCount.rows[0].total} مقالاً`);

  // إغلاق PGlite بسلاسة
  await db.close();
  console.log('\n✨ تم إغلاق قاعدة البيانات بأمان وحفظ جميع البيانات على القرص.');
  process.exit(0);
}

runMasterSeed().catch(err => {
  console.error('❌ خطأ فادح أثناء التهيئة:', err);
  process.exit(1);
});

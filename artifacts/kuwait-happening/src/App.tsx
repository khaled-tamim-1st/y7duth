import { type ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { ArrowLeft, ArrowUpLeft, Bookmark, Check, Clock3, Copy, Menu, Search, Share2, X } from 'lucide-react';
import {
  Link,
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

type Story = {
  slug: string; category: string; title: string; excerpt: string; author: string;
  date: string; read: string; image: string; location: string; body: string[];
};

const stories: Story[] = [
  {
    slug: 'souq-mubarakiya-morning', category: 'أماكن', title: 'المباركية، حين يبدأ النهار قبل أن تستيقظ المدينة',
    excerpt: 'في السوق القديم، للصباح رائحة لا تشبه سواه؛ هيلٌ يسبق الشمس، وأبوابٌ تُفتح على حكايات لا تنتهي.',
    author: 'نورة الشمري', date: '١٨ يونيو ٢٠٢٥', read: '٦ دقائق', image: '/images/kuwait-souq.jpg', location: 'سوق المباركية',
    body: [
      'قبل أن تمتلئ الشوارع بأصوات السيارات، وقبل أن تتحول الشمس إلى مرآة كبيرة فوق المدينة، يكون سوق المباركية قد بدأ يومه بالفعل. هنا لا يحتاج الصباح إلى منبّه؛ يكفي صوت رفع الأبواب المعدنية، ورائحة الهيل التي تنساب من دكان صغير.',
      'في الممرات الضيقة، يتجاور كل شيء كما لو أنه يعرف مكانه منذ زمن. علب البهارات الملونة، أقمشة مطوية بعناية، وصناديق التمر التي تُفتح على مهل. يحيّي البائع زبونه باسمه، ويسأله عن البيت قبل أن يسأله عمّا يريد.',
      '«السوق مو بس بيع وشرا»، يقول أبو عبدالله وهو يرتّب أكياس الزعفران. «هو موعدنا الصبح. نمرّ نسلم، نشرب چاي، ونعرف أخبار بعض». وفي هذه الجملة البسيطة سرّ المكان: المباركية ليست صورة من الماضي، بل عادة حاضرة تتجدد كل يوم.',
      'عند زاوية المقهى، يتوقف الوقت قليلًا. فناجين صغيرة، حديث عن البحر والطقس ومباراة الأمس. ومن الباب المفتوح، يصل ضوء جديد إلى الرواق، كأن المدينة تكتشف نفسها مرة أخرى.',
      'ربما لهذا لا يشبه الصباح هنا أي صباح آخر. لأنك لا تأتي لتشتري شيئًا فقط؛ تأتي لتكون جزءًا من مشهد يعرفك، حتى لو غبت عنه أسبوعًا.',
    ],
  },
  {
    slug: 'neighborhood-lights', category: 'حكايات', title: 'في آخر الفريج، ضوءٌ لا يطفأ',
    excerpt: 'حكاية بقالة صغيرة في قلب السالمية، تحفظ أسماء الجيران وتعرف ما ينقص البيت قبل أن يسألوا.',
    author: 'عبدالله الهاجري', date: '١٦ يونيو ٢٠٢٥', read: '٤ دقائق', image: '/images/neighborhood.jpg', location: 'السالمية',
    body: [
      'في شارع جانبي هادئ بالسالمية، تظل لمبة البقالة مضاءة حتى وقت متأخر. ليست إضاءة قوية ولا لافتة كبيرة، لكنها تكفي لتقول للمارة إن هناك مكانًا يعرفهم.',
      'منذ اثنين وعشرين عامًا، يفتح أبو يوسف محله قبل الفجر بقليل. يعرف أي جار يفضل خبزه محمصًا، وأي طفل يختار الحلوى نفسها كل خميس. «الناس هم اللي يخلّون المكان مكان»، يقول وهو يبتسم.',
      'تغيرت العمارات من حوله، وظهرت مقاهٍ جديدة في الشارع، لكن البقالة بقيت نقطة صغيرة تجمع أطراف الحكاية. يدخل أحدهم ليشتري ماءً، فيخرج بعد حديث عن رحلة أو دوام أو جار غاب.',
    ],
  },
  {
    slug: 'breakfast-table', category: 'مذاق', title: 'الريوق الكويتي: مائدةٌ تجمع البيت قبل أن يبدأ اليوم',
    excerpt: 'من البيض والبلاليط إلى آخر استكانة شاي، طقوس صباحية تحمل في تفاصيلها معنى اللمة.',
    author: 'مي العوضي', date: '١٢ يونيو ٢٠٢٥', read: '٥ دقائق', image: '/images/breakfast.jpg', location: 'البيت الكويتي',
    body: [
      'في بيوت كثيرة، يبدأ اليوم برائحة الهيل. يصب الشاي في استكانات صغيرة، وتصل أطباق البيض والبلاليط والخبز الساخن إلى منتصف الطاولة.',
      'الريوق ليس وصفة واحدة. هو ما يتغير من بيت إلى آخر، وما يبقى في كل بيت: أن ينتظر أحدهم الآخر، وأن تبدأ الحكايات قبل أن تبدأ المشاوير.',
      'حتى في الأيام المستعجلة، تبقى لقمة صغيرة مع كوب شاي كأنها وعد بالعودة. مائدة قصيرة، لكنها تمنح اليوم اتساعًا كافيًا.',
    ],
  },
  {
    slug: 'sea-memory', category: 'ذاكرة', title: 'البحر الذي يسكن في كلام أهل الكويت',
    excerpt: 'من أغاني النهّامين إلى نزهة المساء على الساحل، حكاية علاقة لم تنقطع مع الماء.',
    author: 'سالم الرشيدي', date: '٩ يونيو ٢٠٢٥', read: '٧ دقائق', image: '/images/kuwait-souq.jpg', location: 'ساحل الكويت',
    body: [
      'حتى من لم يركب سفينة في حياته يعرف شيئًا عن البحر. في مفردات البيوت، في أغنية قديمة، وفي طريقة النظر إلى الأفق حين يهدأ المساء.',
      'كان البحر طريقًا ورزقًا ومجهولًا واسعًا. واليوم، صار مساحة للعودة إليه؛ مشية على الكورنيش، جلسة على صخرة، أو لحظة صمت أمام الموج.',
      'تتبدل المدينة، لكن البحر يترك أثره في اللغة والذاكرة، وفي حكايات تُروى كلما اجتمع أهل البيت.',
    ],
  },
  {
    slug: 'art-in-shuwaikh', category: 'ثقافة', title: 'المخازن التي صارت مساحة للفن واللقاء',
    excerpt: 'في الشويخ، يجد الفنانون مكانًا جديدًا يلتقي فيه العمل اليدوي بالموسيقى والناس.',
    author: 'ليلى المبارك', date: '٥ يونيو ٢٠٢٥', read: '٥ دقائق', image: '/images/neighborhood.jpg', location: 'الشويخ',
    body: [
      'حين تدخل أحد المخازن القديمة في الشويخ، لا تدري إن كنت في ورشة أم معرض أم بيت مفتوح. ربما تكون الثلاثة معًا.',
      'في المساحات التي كانت تحفظ الأشياء، تُعرض الآن أعمال صنعتها أيادٍ محلية. يمرّ الزائر ليرى، ثم يبقى ليسمع قصة صاحب العمل.',
      'ما يجعل المكان حيًا ليس الجدران ولا الإضاءة، بل سهولة اللقاء؛ أن تجد نفسك إلى جوار شخص لم تعرفه، تتحدثان عن شيء صنعه أحدكما بحب.',
    ],
  },
  {
    slug: 'evening-walk', category: 'يوميات', title: 'ساعةٌ على الكورنيش تكفي لتغيير إيقاع اليوم',
    excerpt: 'حين يخفّ وهج الشمس، يصبح الساحل غرفة المعيشة الأوسع للمدينة.',
    author: 'فهد الدوسري', date: '٢ يونيو ٢٠٢٥', read: '٣ دقائق', image: '/images/neighborhood.jpg', location: 'مدينة الكويت',
    body: [
      'في المساء، يخرج الناس إلى الساحل من كل الجهات. يمشون ببطء، يركضون، أو يجلسون دون أن يحتاجوا إلى سبب.',
      'تبدو المدينة من هنا أقل استعجالًا. ضوء الأبراج بعيد، والهواء يحمل شيئًا من الملح، والحديث يعود إلى حجمه الطبيعي.',
      'ساعة واحدة تكفي. لا تغيّر شيئًا في جدول الغد، لكنها تجعل العودة إلى البيت أخفّ.',
    ],
  },
];

const categories = ['الكل', 'أماكن', 'حكايات', 'مذاق', 'ذاكرة', 'ثقافة', 'يوميات'];

function Header({ onSearch }: { onSearch: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return <>
    <div className="bg-[#18323c] text-[#f5f0e6] text-[11px] md:text-xs">
      <div className="max-w-[1320px] mx-auto px-5 md:px-10 h-9 flex items-center justify-between">
        <span className="tracking-wide">الأربعاء، ١٨ يونيو ٢٠٢٥ <i className="inline-block w-1 h-1 rounded-full bg-[#cf3935] mx-2 align-middle" /> الكويت ٣٨°</span>
        <span className="hidden sm:block text-white/60">حكايات من هنا، تُروى كما هي</span>
      </div>
    </div>
    <header className="bg-[#f4f0e7] border-b border-[#d9d1c2] relative z-10" dir="rtl">
      <div className="max-w-[1320px] mx-auto px-5 md:px-10 h-[88px] flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 no-underline" data-testid="link-home">
          <img src="/brand/kuwait-mark-solid.png" className="w-[48px] h-[48px] object-contain" alt="شعار يحدث في الكويت" />
          <span className="leading-[1.15]">
            <span className="block text-[21px] md:text-[24px] font-bold tracking-[-.05em] text-[#18323c]">يحدث في الكويت</span>
            <span className="block text-[9px] tracking-[.15em] text-[#8b8478] mt-1">حكايات المكان وأهله</span>
          </span>
        </Link>
        <nav className="hidden lg:flex items-center gap-8 text-[14px] text-[#41535a]" aria-label="التنقل الرئيسي">
          {categories.slice(1, 6).map(c => <a key={c} href={`/#${c}`} onClick={() => setMenuOpen(false)} className="hover:text-[#126447] transition-colors">{c}</a>)}
          <a href="/#عن-المجلة" className="hover:text-[#126447] transition-colors">عن المجلة</a>
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={onSearch} aria-label="ابحث في الحكايات" data-testid="button-open-search" className="h-10 w-10 grid place-items-center rounded-full hover:bg-[#e9e3d8] transition-colors"><Search size={19} strokeWidth={1.6}/></button>
          <button className="lg:hidden h-10 w-10 grid place-items-center rounded-full hover:bg-[#e9e3d8]" aria-label="فتح القائمة" onClick={() => setMenuOpen(!menuOpen)} data-testid="button-menu"><Menu size={20}/></button>
          <a href="#النشرة" className="hidden sm:inline-flex bg-[#126447] text-[#f4f0e7] rounded-full px-5 py-2.5 text-[13px] hover:bg-[#0e5038] transition-colors">رسالتنا الأسبوعية</a>
        </div>
      </div>
      {menuOpen && <nav className="lg:hidden absolute top-full inset-x-0 bg-[#f4f0e7] border-b border-[#d9d1c2] px-6 py-4 grid grid-cols-2 gap-4 shadow-lg" aria-label="قائمة الهاتف">{categories.slice(1).map(c => <a key={c} href={`/#${c}`} onClick={() => setMenuOpen(false)} className="py-2 text-[#18323c]">{c}</a>)}</nav>}
    </header>
  </>;
}

function StoryCard({ story, compact = false }: { story: Story; compact?: boolean }) {
  return <Link href={`/story/${story.slug}`} className={`group block text-right no-underline ${compact ? 'grid grid-cols-[1fr_96px] gap-4 items-center' : ''}`} data-testid={`link-story-${story.slug}`}>
    <div className={`relative overflow-hidden bg-[#d8d1c4] ${compact ? 'order-last aspect-square' : 'aspect-[1.48]'}`}>
      <img src={story.image} alt={story.location} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
      {!compact && <span className="absolute top-3 right-3 text-[11px] bg-[#f4f0e7] text-[#126447] px-3 py-1 rounded-full">{story.category}</span>}
    </div>
    <div className={compact ? 'py-1' : 'pt-4'}>
      {compact && <span className="text-[11px] text-[#126447]">{story.category}</span>}
      <h3 className={`font-semibold text-[#18323c] leading-[1.65] group-hover:text-[#126447] transition-colors ${compact ? 'text-[15px] mt-1' : 'text-[21px] md:text-[23px]'}`}>{story.title}</h3>
      {!compact && <p className="text-[14px] leading-[1.9] text-[#6c7777] mt-2 line-clamp-2">{story.excerpt}</p>}
      <div className="flex items-center gap-2 mt-3 text-[11px] text-[#8c8980]">
        <span>{story.date}</span><span className="w-[3px] h-[3px] bg-[#c8bda9] rounded-full"/><span>{story.read}</span>
      </div>
    </div>
  </Link>;
}

function Home() {
  const [, setLocation] = useLocation();
  const [category, setCategory] = useState('الكل');
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const visible = useMemo(() => stories.filter(s => (category === 'الكل' || s.category === category) && (!query || `${s.title} ${s.excerpt} ${s.category}`.includes(query.trim()))), [category, query]);
  const featured = stories[0];
  const openSearch = () => { setSearchOpen(v => !v); window.setTimeout(() => document.getElementById('story-search')?.focus(), 40); };
  return (
    <main className="grain min-h-[100dvh] bg-[#f4f0e7] text-[#18323c]" dir="rtl">
      <Header onSearch={openSearch}/>
      {searchOpen && <div className="bg-[#e9e3d8] border-b border-[#d8d0c1] fade-up">
        <div className="max-w-[1320px] mx-auto px-5 md:px-10 py-4 flex gap-3 items-center">
          <Search size={19} className="text-[#126447]"/>
          <input id="story-search" value={query} onChange={e => setQuery(e.target.value)} placeholder="ابحث عن حكاية، مكان، أو كلمة..." className="bg-transparent border-0 outline-none w-full text-[16px] placeholder:text-[#8c8980]" aria-label="ابحث في الحكايات" data-testid="input-story-search"/>
          <button onClick={() => { setQuery(''); setSearchOpen(false); }} aria-label="إغلاق البحث" className="p-2 hover:bg-[#dcd4c6] rounded-full"><X size={18}/></button>
        </div>
      </div>}
      <div className="max-w-[1320px] mx-auto px-5 md:px-10">
        <section className="pt-7 md:pt-10 pb-7 border-b border-[#d9d1c2] flex items-end justify-between gap-5">
          <div>
            <div className="text-[11px] tracking-[.16em] text-[#126447] font-semibold mb-2">المشهد من هنا — العدد ٠٦</div>
            <h1 className="text-[35px] md:text-[46px] leading-[1.2] font-bold tracking-[-.04em]">الكويت، كما نعيشها.</h1>
          </div>
          <p className="hidden md:block max-w-[315px] text-[14px] leading-[1.9] text-[#72766f] pb-1">مجلة مستقلة تنصت للمدينة، وتكتب عن تفاصيلها الصغيرة التي تصنع حكاية كبيرة.</p>
        </section>
        <section className="grid lg:grid-cols-[1.63fr_0.87fr] gap-8 lg:gap-10 py-8 md:py-10">
          <button onClick={() => setLocation(`/story/${featured.slug}`)} className="group text-right relative min-h-[380px] md:min-h-[510px] overflow-hidden bg-[#263b3e]" data-testid="button-featured-story">
            <img src={featured.image} alt="ممرات سوق المباركية في الصباح" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"/>
            <div className="image-wash absolute inset-0"/>
            <div className="absolute top-5 right-5 flex items-center gap-2 bg-[#f4f0e7]/95 px-3 py-1.5 text-[11px] text-[#126447]"><span className="w-1.5 h-1.5 rounded-full bg-[#c93835]"/> حكاية هذا الأسبوع</div>
            <div className="absolute bottom-0 inset-x-0 p-6 md:p-10 text-[#fbf7ed]">
              <span className="text-[12px] text-[#b8d3c2]">{featured.category} <span className="mx-2 text-white/50">/</span> {featured.location}</span>
              <h2 className="max-w-[720px] text-[30px] md:text-[45px] font-semibold leading-[1.35] mt-3">{featured.title}</h2>
              <p className="max-w-[580px] text-[14px] md:text-[16px] text-white/80 leading-[1.85] mt-3">{featured.excerpt}</p>
              <span className="inline-flex items-center gap-2 border-b border-[#b4cabb] pb-1 mt-6 text-[13px]">اقرأ الحكاية <ArrowLeft size={15}/></span>
            </div>
          </button>
          <aside className="flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-[#d9d1c2]">
              <h2 className="text-[18px] font-semibold">على طاولة التحرير</h2><span className="text-[11px] text-[#8c8980]">مختاراتنا</span>
            </div>
            <div className="divide-y divide-[#d9d1c2]">
              {stories.slice(1, 4).map((s, i) => <div key={s.slug} className="py-[18px] first:pt-5">
                <div className="flex items-center gap-2 text-[11px] text-[#126447] mb-2"><span className="font-serif text-[15px] text-[#c93835]">٠{i + 1}</span><span>{s.category}</span></div>
                <StoryCard story={s} compact/>
              </div>)}
            </div>
            <a href="#كل-الحكايات" className="mt-auto pt-5 flex items-center gap-2 text-[13px] text-[#126447]">كل حكاياتنا <ArrowLeft size={15}/></a>
          </aside>
        </section>
        <section className="border-y border-[#d9d1c2] py-5 flex items-center gap-5 overflow-x-auto" aria-label="اختيار فئة">
          <span className="text-[11px] text-[#8c8980] whitespace-nowrap">اقرأ حسب المزاج</span>
          <div className="flex items-center gap-2 min-w-max">
            {categories.map(c => <button key={c} onClick={() => { setCategory(c); document.getElementById('كل-الحكايات')?.scrollIntoView({ behavior: 'smooth' }); }} className={`rounded-full px-4 py-2 text-[12px] transition-colors ${category === c ? 'bg-[#18323c] text-[#f4f0e7]' : 'bg-transparent text-[#546267] hover:bg-[#e8e2d7]'}`} aria-pressed={category === c} data-testid={`button-category-${c}`}>{c}</button>)}
          </div>
        </section>
        <section id="كل-الحكايات" className="pt-12 md:pt-16 pb-16 scroll-mt-5">
          <div className="flex items-end justify-between gap-4 mb-7 md:mb-9">
            <div><div className="text-[11px] tracking-[.14em] text-[#126447] mb-2">من المدينة وأهلها</div><h2 className="text-[28px] md:text-[36px] font-semibold">{category === 'الكل' ? 'حكايات تستحق الوقوف' : `حكايات ${category}`}</h2></div>
            <span className="text-[12px] text-[#8c8980] pb-1">{visible.length} حكايات</span>
          </div>
          {visible.length ? <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-7 gap-y-10">{visible.map(s => <StoryCard key={s.slug} story={s}/>)}</div> :
          <div className="py-16 text-center border border-dashed border-[#c9c1b3]">
            <Search size={22} className="mx-auto mb-3 text-[#126447]"/>
            <h3 className="font-semibold">ما لقينا حكاية بهذا الوصف</h3>
            <p className="text-sm text-[#777b74] mt-2">جرّب كلمة ثانية، أو اختر كل الحكايات.</p>
            <button onClick={() => { setQuery(''); setCategory('الكل'); }} className="mt-4 text-[#126447] underline underline-offset-4">عرض كل الحكايات</button>
          </div>}
        </section>
        <section className="grid md:grid-cols-[.9fr_1.1fr] mb-16 bg-[#e8e1d4]">
          <div className="relative min-h-[260px] overflow-hidden">
            <img src="/images/breakfast.jpg" alt="مائدة فطور كويتية" className="absolute inset-0 w-full h-full object-cover"/>
            <div className="absolute inset-0 bg-[#18323c]/15"/>
          </div>
          <div className="p-7 md:p-12 flex flex-col justify-center">
            <span className="text-[#126447] text-[11px] tracking-[.13em]">من دفتر المكان</span>
            <blockquote className="text-[23px] md:text-[30px] leading-[1.7] font-semibold mt-3">«الأماكن ما تعيش بحيطانها، تعيش بالناس اللي يردّون لها.»</blockquote>
            <span className="text-[12px] text-[#7e7c73] mt-4">من حكاية عن سوق المباركية</span>
            <button onClick={() => setLocation(`/story/${featured.slug}`)} className="mt-6 inline-flex items-center gap-2 text-[13px] text-[#126447] self-start">اقرأ الحكاية كاملة <ArrowLeft size={15}/></button>
          </div>
        </section>
        <section id="عن-المجلة" className="py-12 md:py-16 border-t border-[#d9d1c2] grid md:grid-cols-[1fr_1fr] gap-8 items-center">
          <div><span className="text-[11px] tracking-[.14em] text-[#126447]">ليش نكتب؟</span><h2 className="text-[29px] md:text-[38px] font-semibold leading-[1.45] mt-3">لأن كل شارع<br/>عنده سالفة.</h2></div>
          <p className="text-[15px] leading-[2] text-[#626f70] max-w-[560px]">«يحدث في الكويت» مساحة تلتقط الحياة وهي تمشي. نكتب عن الأماكن التي نرجع لها، والناس الذين يخلّون المدينة أقرب، والتفاصيل التي قد تمرّ علينا لو ما وقفنا عندها شوي.</p>
        </section>
      </div>
      <footer id="النشرة" className="bg-[#18323c] text-[#f4f0e7] mt-4" dir="rtl">
        <div className="max-w-[1320px] mx-auto px-5 md:px-10 py-12 md:py-16 grid md:grid-cols-[1fr_1fr] gap-10 items-center">
          <div><span className="text-[11px] text-[#a9c7b4] tracking-[.15em]">رسالة من الكويت</span><h2 className="text-[27px] md:text-[34px] font-semibold mt-2">حكاية جديدة، كل أسبوع.</h2><p className="text-[13px] text-white/60 mt-2">نرسل لك اختياراتنا من قلب المدينة. بلا ضجيج، وبلا رسائل كثيرة.</p></div>
          {subscribed ? <div className="flex items-center gap-3 text-[#b8d3c2]" role="status"><Check size={20}/><span>وصلت رسالتك. نراك في البريد قريبًا.</span></div> :
          <form className="flex gap-2 border-b border-white/30 pb-2" onSubmit={e => { e.preventDefault(); if (email.includes('@')) setSubscribed(true); }}>
            <label className="sr-only" htmlFor="newsletter-email">بريدك الإلكتروني</label>
            <input id="newsletter-email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="بريدك الإلكتروني" className="bg-transparent outline-none flex-1 text-[14px] placeholder:text-white/45" data-testid="input-newsletter"/>
            <button className="text-[13px] flex items-center gap-2 hover:text-[#b8d3c2]" data-testid="button-subscribe">سجّلني <ArrowLeft size={15}/></button>
          </form>}
        </div>
        <div className="border-t border-white/15">
          <div className="max-w-[1320px] mx-auto px-5 md:px-10 py-5 flex flex-col sm:flex-row gap-3 justify-between text-[11px] text-white/50">
            <span>© ٢٠٢٥ يحدث في الكويت — مجلة مستقلة من الكويت</span><span>نكتب عنّا، لنقرأ بعضنا.</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Article({ slug }: { slug?: string }) {
  const [, setLocation] = useLocation();
  const story = stories.find(s => s.slug === slug);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  if (!story) return <main dir="rtl" className="min-h-[100dvh] bg-[#f4f0e7] text-[#18323c] grid place-items-center p-8"><div className="text-center"><h1 className="text-3xl font-bold">الحكاية غير موجودة</h1><button onClick={() => setLocation('/')} className="text-[#126447] mt-5 underline">العودة إلى الصفحة الرئيسية</button></div></main>;
  const share = async () => {
    try { await navigator.clipboard.writeText(window.location.href); setCopied(true); window.setTimeout(() => setCopied(false), 2000); }
    catch { setCopied(false); }
  };
  return <main dir="rtl" className="grain min-h-[100dvh] bg-[#f4f0e7] text-[#18323c]">
    <Header onSearch={() => setLocation('/')}/>
    <article className="fade-up">
      <div className="max-w-[900px] mx-auto px-5 md:px-8 pt-7 md:pt-10">
        <button onClick={() => setLocation('/')} className="inline-flex items-center gap-2 text-[13px] text-[#647170] hover:text-[#126447]" data-testid="button-back-home"><ArrowUpLeft size={17}/> كل الحكايات</button>
        <div className="mt-8 flex items-center gap-2 text-[12px] text-[#126447]"><span>{story.category}</span><span className="text-[#b7ad9d]">/</span><span>{story.location}</span></div>
        <h1 className="text-[34px] md:text-[53px] leading-[1.45] font-semibold tracking-[-.035em] mt-3">{story.title}</h1>
        <p className="text-[17px] md:text-[19px] leading-[1.9] text-[#667373] mt-4 max-w-[760px]">{story.excerpt}</p>
        <div className="flex flex-wrap items-center justify-between gap-4 border-y border-[#d9d1c2] py-4 mt-7 text-[12px] text-[#777b74]">
          <div className="flex items-center gap-3"><span className="w-9 h-9 rounded-full bg-[#dce5da] text-[#126447] grid place-items-center font-semibold">{story.author.slice(0, 1)}</span><span>كتابة {story.author}</span><span className="text-[#b7ad9d]">·</span><span>{story.date}</span></div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5"><Clock3 size={14}/>{story.read}</span>
            <button onClick={() => setSaved(!saved)} aria-label={saved ? 'إزالة من المحفوظات' : 'حفظ الحكاية'} aria-pressed={saved} className={`p-2 rounded-full transition-colors ${saved ? 'bg-[#126447] text-white' : 'hover:bg-[#e7e0d4]'}`} data-testid="button-save-story"><Bookmark size={16} fill={saved ? 'currentColor' : 'none'}/></button>
            <button onClick={share} aria-label="نسخ رابط الحكاية" className="p-2 rounded-full hover:bg-[#e7e0d4]" data-testid="button-share-story">{copied ? <Check size={16}/> : <Share2 size={16}/>}</button>
          </div>
        </div>
      </div>
      <figure className="max-w-[1100px] mx-auto px-5 md:px-8 mt-7 md:mt-9">
        <img src={story.image} alt={story.location} className="w-full max-h-[590px] object-cover"/>
        <figcaption className="text-[11px] text-[#88867e] mt-2">{story.location} — من دفتر «يحدث في الكويت»</figcaption>
      </figure>
      <div className="max-w-[760px] mx-auto px-5 md:px-8 py-9 md:py-12">
        <div className="article-copy">
          <p className="text-[21px] md:text-[23px] leading-[2] font-medium text-[#18323c]">{story.body[0]}</p>
          {story.body.slice(1).map((paragraph, i) => <div key={i}>{i === 2 && <h2>مكانٌ يعرف أهله</h2>}<p>{paragraph}</p></div>)}
        </div>
        <div className="border-y border-[#d9d1c2] py-5 mt-10 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
          <div><span className="block text-[11px] text-[#8c8980]">هذه الحكاية من</span><span className="text-[14px] text-[#126447] mt-1 inline-block">دفتر {story.category}</span></div>
          <div className="flex gap-2">
            <button onClick={() => setSaved(!saved)} className="inline-flex items-center gap-2 border border-[#cfc6b7] rounded-full px-4 py-2 text-[12px] hover:bg-[#e9e3d8]" data-testid="button-save-bottom"><Bookmark size={14} fill={saved ? 'currentColor' : 'none'}/>{saved ? 'انحفظت' : 'احفظها لوقت ثاني'}</button>
            <button onClick={share} className="inline-flex items-center gap-2 bg-[#18323c] text-[#f4f0e7] rounded-full px-4 py-2 text-[12px] hover:bg-[#254652]" data-testid="button-copy-link">{copied ? <Check size={14}/> : <Copy size={14}/>} {copied ? 'تم النسخ' : 'انسخ الرابط'}</button>
          </div>
        </div>
        <div className="mt-10 p-6 md:p-8 bg-[#e8e1d4] flex flex-col sm:flex-row justify-between gap-5 items-start sm:items-center">
          <div><span className="text-[11px] text-[#126447]">انتهت الحكاية؟</span><p className="text-[17px] font-semibold mt-1">باقي حكايات من نفس المكان.</p></div>
          <button onClick={() => setLocation('/')} className="inline-flex items-center gap-2 text-[13px] text-[#126447] border-b border-[#126447] pb-1" data-testid="button-more-stories">ارجع للحكايات <ArrowLeft size={15}/></button>
        </div>
      </div>
      <section className="bg-[#e8e1d4] py-10 md:py-14">
        <div className="max-w-[1100px] mx-auto px-5 md:px-8">
          <div className="flex justify-between items-end mb-6"><div><span className="text-[11px] text-[#126447]">اقرأ بعد</span><h2 className="text-[25px] font-semibold mt-1">حكايات على نفس الموجة</h2></div><button onClick={() => setLocation('/')} className="text-[12px] text-[#126447]">كل الحكايات ←</button></div>
          <div className="grid md:grid-cols-2 gap-7">{stories.filter(s => s.slug !== story.slug).slice(0, 2).map(s => <StoryCard key={s.slug} story={s}/>)}</div>
        </div>
      </section>
    </article>
    <footer className="bg-[#18323c] text-[#f4f0e7] px-5 md:px-10 py-6 flex justify-between text-[11px] text-white/55"><span>© يحدث في الكويت</span><button onClick={() => setLocation('/')} className="text-white/75 hover:text-white">الصفحة الرئيسية</button></footer>
  </main>;
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/story/:slug">{params => <Article slug={params.slug}/>}</Route>
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

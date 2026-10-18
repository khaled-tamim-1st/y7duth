export interface CategoryConfig {
  name: string;
  slug: string;
  desc: string;
  color: string;
}

export const CATEGORIES_CONFIG: CategoryConfig[] = [
  {
    name: 'أهل الديرة',
    slug: 'ahl-al-deera',
    desc: 'شخصيات ملهمة، رواد، حرفيون، وقصص إنسانية صنعت روح الكويت وتراثها الحي.',
    color: '#126447',
  },
  {
    name: 'في الفريج',
    slug: 'fil-freej',
    desc: 'أسواق قديمة، بيوت تراثية، فرجان عتيقة، ومقاهٍ شعبية تحفظ أصالة المكان.',
    color: '#cf3935',
  },
  {
    name: 'سوالف وتراث',
    slug: 'swalef-w-turath',
    desc: 'حكايات البحر والغوص، عادات البيوت، لهجة ومفردات أهل الكويت، وأمثال الطيبين.',
    color: '#18323c',
  },
  {
    name: 'سفرة الديرة',
    slug: 'sofrat-al-deera',
    desc: 'أكلات البيت الكويتي القديم، طقوس الريوق المهيّل، واستكانة الشاي وسفرة البركة.',
    color: '#c27d38',
  },
  {
    name: 'ألبوم الذاكرة',
    slug: 'album-al-dhakira',
    desc: 'صور نادرة، وثائق قديمة، وذكريات توثق معالم الكويت وتاريخها الجميل.',
    color: '#2a5563',
  },
];

export function getCategorySlug(categoryName: string): string {
  const found = CATEGORIES_CONFIG.find((c) => c.name === categoryName);
  return found ? found.slug : categoryName;
}

export function getCategoryBySlugOrName(slugOrName: string): CategoryConfig | null {
  if (!slugOrName) return null;
  const decoded = decodeURIComponent(slugOrName).trim();
  const found = CATEGORIES_CONFIG.find(
    (c) => c.slug.toLowerCase() === decoded.toLowerCase() || c.name === decoded
  );
  return found || null;
}

export function getCategoryNameBySlug(slugOrName: string): string {
  const conf = getCategoryBySlugOrName(slugOrName);
  return conf ? conf.name : decodeURIComponent(slugOrName);
}

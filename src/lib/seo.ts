/**
 * SEO & Meta Tags Optimization Engine for «يحدث في الكويت»
 * Compliant with Google Search Central SERP Display Guidelines (2026)
 */

export const BRAND_NAME = 'يحدث في الكويت';

/**
 * Optimizes the article title for Google SERP:
 * - Keeps title length under 60-62 characters to prevent truncation.
 * - Prioritizes the main entity/keyword (before ':').
 * - Preserves brand suffix without truncation.
 */
export function formatSeoTitle(rawTitle: string): string {
  if (!rawTitle) return BRAND_NAME;
  const brandSuffix = ` — ${BRAND_NAME}`;

  // If already optimal length
  if ((rawTitle + brandSuffix).length <= 62) {
    return `${rawTitle}${brandSuffix}`;
  }

  // If title has a colon ':' separating the core subject from editorial elaboration
  if (rawTitle.includes(':')) {
    const [entityPart, ...restParts] = rawTitle.split(':');
    const entity = entityPart.trim();
    const rest = restParts.join(':').trim();

    const maxSubLen = 60 - entity.length - brandSuffix.length - 2;
    if (maxSubLen > 8) {
      const words = rest.split(' ');
      let sub = '';
      for (const w of words) {
        if ((sub + ' ' + w).trim().length <= maxSubLen) {
          sub = (sub + ' ' + w).trim();
        } else {
          break;
        }
      }
      if (sub) {
        return `${entity}: ${sub}${brandSuffix}`;
      }
    }
    return `${entity}${brandSuffix}`;
  }

  // Fallback: truncate on word boundary
  const maxTitleLen = 60 - brandSuffix.length;
  const words = rawTitle.split(' ');
  let cleanTitle = '';
  for (const w of words) {
    if ((cleanTitle + ' ' + w).trim().length <= maxTitleLen) {
      cleanTitle = (cleanTitle + ' ' + w).trim();
    } else {
      break;
    }
  }
  return `${cleanTitle || rawTitle.slice(0, maxTitleLen)}${brandSuffix}`;
}

/**
 * Optimizes the meta description for Google SERP:
 * - Truncates at ~115 characters on a clean word boundary.
 * - Adds a high-converting Call-to-Action (CTA).
 * - Total length strictly under 155-160 characters.
 */
export function formatSeoDescription(rawExcerpt: string): string {
  if (!rawExcerpt) {
    return 'مجلة مستقلة توثق حكايات أهل الديرة، أسرار الفرجان القديمة، وعَبَق التراث الكويتي الأصيل.';
  }

  const clean = rawExcerpt.replace(/\s+/g, ' ').trim();
  const cta = ' | اقرأ التوثيق في «يحدث في الكويت».';
  const targetExcerptLen = 155 - cta.length - 3; // ~116 chars

  if (clean.length <= 155) {
    return clean;
  }

  const sliced = clean.slice(0, targetExcerptLen);
  const lastSpace = sliced.lastIndexOf(' ');
  const safeSlice = lastSpace > 70 ? sliced.slice(0, lastSpace) : sliced;

  return `${safeSlice}...${cta}`;
}

/**
 * High-ranking Pillar Page SEO metadata for Core Categories
 * Targets high-volume GCC & Kuwait search queries
 */
export const CATEGORY_SEO_META: Record<string, { title: string; desc: string }> = {
  'أهل الديرة': {
    title: 'شخصيات ورواد وبناة تاريخ الكويت | أهل الديرة — يحدث في الكويت',
    desc: 'سِيَر وتاريخ رواد وشخصيات كويتية صنعت مجد الوطن، وحرفيون وقصص إنسانية ملهمة في ذاكرة وتراث الكويت الأصيل.',
  },
  'في الفريج': {
    title: 'أسواق ومعالم وفرجان الكويت القديمة | في الفريج — يحدث في الكويت',
    desc: 'جولة وثائقية بين فرجان وأسواق وبراحات الكويت القديمة؛ براحة بن بحر، سوق المباركية، وبيوت الطين العتيقة.',
  },
  'سوالف وتراث': {
    title: 'تراث وسوالف وعادات أهل الكويت والبحر | سوالف وتراث — يحدث في الكويت',
    desc: 'حكايات الغوص والبحر، عادات وتقاليد الكويتيين، اللهجة والمفردات القديمة، وأمثال الطيبين في تراث الكويت.',
  },
  'سفرة الديرة': {
    title: 'أكلات ومطبخ وتراث الضيافة الكويتي | سفرة الديرة — يحدث في الكويت',
    desc: 'دليل الأكلات الكويتية الشعبية القديمة، وطقوس السفرة والريوق المهيّل واستكانة شاي الفحم في البيت الكويتي الأصيل.',
  },
  'ألبوم الذاكرة': {
    title: 'صور ووثائق وتاريخ معالم الكويت النادرة | ألبوم الذاكرة — يحدث في الكويت',
    desc: 'أرشيف بصري يوثق أندر الصور والوثائق والمراسلات والعملات والطوابع في تاريخ الكويت منذ بدايات القرن العشرين.',
  },
};

/**
 * Automatically injects Cloudinary transformations for auto-format (AVIF/WebP)
 * and auto-quality compression with optional width resizing.
 */
export function optimizeImageUrl(url: string, width?: number): string {
  if (!url || typeof url !== 'string') return url;
  if (!url.includes('res.cloudinary.com')) return url;
  if (url.includes('/image/upload/f_auto') || url.includes('/image/upload/q_auto')) return url;

  const transform = width ? `f_auto,q_auto,w_${width}` : 'f_auto,q_auto';
  return url.replace('/image/upload/', `/image/upload/${transform}/`);
}

